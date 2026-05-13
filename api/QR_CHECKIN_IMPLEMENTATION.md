# QR Check-in Implementation Guide

## Kiến trúc tổng thể

```
FE (Next.js) <---> BE (NestJS) <---> Redis
     ↓
  QR Display          QR Service        Token Storage
  QR Scanner          Generate Token    TTL: 15 minutes
```

## Luồng hoạt động

### 1. **FE Hiển thị QR**
- User đăng nhập vào FE
- Call API `GET /api/qr/generate` → nhận token + QR code image (Base64)
- Hiển thị QR code lên màn hình
- Set timer để auto-refresh QR sau 14 phút (hoặc khi user bấm "Làm mới")

### 2. **BE Generate QR Token**
- Endpoint: `GET /api/qr/generate` (yêu cầu JWT token)
- Tạo token ngẫu nhiên 32 bytes (hex)
- Lưu vào Redis với payload:
  ```json
  {
    "token": "...",
    "userId": "...",
    "timestamp": 1234567890,
    "used": false
  }
  ```
- TTL: 15 phút (900 giây)
- Generate QR code từ token (qrcode library)
- Return: token, qrCode (Base64), expiresAt, ttl

### 3. **Redis Lưu Token**
- Key format: `qr:token:{token}`
- Value: JSON payload
- TTL: 900 seconds (15 minutes)
- Auto-delete sau TTL hết hạn

### 4. **Scanner Quét → Xác thực**
- Endpoint: `POST /api/qr/verify` (public, không cần auth)
- Gửi: `{ token: "..." }`
- Kiểm tra:
  - Token có tồn tại trong Redis không?
  - Token đã dùng rồi không?
- Nếu hợp lệ:
  - Mark `used: true` trong Redis
  - Return: `{ valid: true, userId: "...", message: "..." }`
- Nếu không hợp lệ:
  - Return: `{ valid: false, message: "..." }`

### 5. **QR Đã Dùng → Invalidate**
- Token tự động bị mark `used: true` sau khi verify
- FE có thể call `DELETE /api/qr/{token}` để invalidate trước khi sinh QR mới
- Hoặc khi user logout, auto-invalidate current token

### 6. **FE Tự Sinh QR Mới**
- User bấm "Làm mới QR" hoặc timer hết 14 phút
- Call `DELETE /api/qr/{oldToken}` (invalidate cũ)
- Call `GET /api/qr/generate` (sinh mới)
- Update QR code trên UI
- Reset timer

## API Endpoints

### 1. Generate QR Token
```
GET /api/qr/generate
Headers: Authorization: Bearer <jwt_token>

Response (200):
{
  "token": "abc123def456...",
  "qrCode": "data:image/png;base64,iVBORw0KG...",
  "expiresAt": 1234567890000,
  "ttl": 900
}
```

### 2. Verify QR Token
```
POST /api/qr/verify
Body: { "token": "abc123def456..." }

Response (200):
{
  "valid": true,
  "userId": "507f1f77bcf86cd799439011",
  "message": "QR token hợp lệ"
}

OR

{
  "valid": false,
  "message": "QR token không tồn tại hoặc đã hết hạn"
}
```

### 3. Invalidate QR Token
```
DELETE /api/qr/{token}
Headers: Authorization: Bearer <jwt_token>

Response (200):
{
  "success": true
}
```

### 4. Get QR Token Info
```
GET /api/qr/info/{token}
Headers: Authorization: Bearer <jwt_token>

Response (200):
{
  "info": {
    "token": "...",
    "userId": "...",
    "timestamp": 1234567890,
    "used": false
  },
  "ttl": 850  // seconds remaining
}
```

## Environment Variables (trong .env)

```env
# Redis
REDIS_URL=redis://localhost:6379

# Hoặc nếu sử dụng connection details khác:
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

## Installation

```bash
# Cài đặt ioredis
npm install ioredis

# Cài đặt qrcode (nếu chưa có)
npm install qrcode

# Cài đặt types (nếu cần)
npm install -D @types/node
```

## Redis Module Setup

### src/shared/redis/redis.service.ts
- Quản lý Redis connection
- Methods: set, get, delete, exists, expire, ttl, hSet, hGet, etc.
- Auto-reconnect với retry strategy

### src/shared/redis/redis.module.ts
- Export RedisService
- Khởi tạo kết nối khi module init

## QR Module Setup

### src/modules/qr/qr.service.ts
- `generateQrToken(userId)` - sinh token + QR code
- `verifyQrToken(token)` - xác thực token
- `invalidateQrToken(token)` - vô hiệu hóa token
- `getQrTokenInfo(token)` - lấy info token
- `getQrTokenTtl(token)` - lấy TTL còn lại

### src/modules/qr/qr.controller.ts
- `GET /api/qr/generate` - generate QR
- `POST /api/qr/verify` - verify QR
- `DELETE /api/qr/:token` - invalidate QR
- `GET /api/qr/info/:token` - get info

## Testing

### 1. Generate QR Token
```bash
curl -X GET http://localhost:3000/api/qr/generate \
  -H "Authorization: Bearer <jwt_token>"
```

### 2. Verify QR Token
```bash
curl -X POST http://localhost:3000/api/qr/verify \
  -H "Content-Type: application/json" \
  -d '{"token": "abc123..."}'
```

### 3. Invalidate QR Token
```bash
curl -X DELETE http://localhost:3000/api/qr/abc123... \
  -H "Authorization: Bearer <jwt_token>"
```

## FE Implementation (Next.js)

### 1. Hook useQrScanner
```typescript
const useQrScanner = (userId: string) => {
  const [qrToken, setQrToken] = useState<string>('');
  const [qrImage, setQrImage] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<number>(0);
  
  const generateQr = async () => {
    const res = await fetch('/api/qr/generate', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setQrToken(data.token);
    setQrImage(data.qrCode);
    setExpiresAt(data.expiresAt);
  };
  
  useEffect(() => {
    generateQr();
    const timer = setInterval(generateQr, 14 * 60 * 1000); // 14 minutes
    return () => clearInterval(timer);
  }, []);
  
  return { qrToken, qrImage, expiresAt };
};
```

### 2. Component QRDisplay
```typescript
<div>
  <img src={qrImage} alt="QR Code" />
  <p>Expires: {new Date(expiresAt).toLocaleTimeString()}</p>
  <button onClick={generateQr}>Làm mới</button>
</div>
```

### 3. Verify Endpoint
```typescript
const verifyQr = async (token: string) => {
  const res = await fetch('/api/qr/verify', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  return res.json();
};
```

## Notes

- Redis connection được tạo khi app start (OnModuleInit)
- TTL 15 phút có thể config trong QrService.QR_TTL_SECONDS
- QR code được generate dưới dạng PNG Base64
- Token là unique 32-byte hex string
- Mỗi verify success sẽ mark token là `used: true`
- FE nên auto-refresh QR sau 14 phút để avoid timeout

## Troubleshooting

### Redis connection refused
- Đảm bảo Docker container Redis đang chạy: `docker-compose up -d`
- Kiểm tra port 6379 open
- Kiểm tra REDIS_URL đúng

### QR code không hiển thị
- Kiểm tra qrcode package đã cài chưa
- Kiểm tra token được return từ generate endpoint

### Token không hợp lệ
- Token hết TTL (15 phút)
- Token đã dùng rồi (used: true)
- Token không tồn tại trong Redis
