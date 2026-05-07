# Ứng dụng Check-in/Check-out với QR Code + GPS -

# NOTE : Đang trong quá trình dev

## 📋 Mô tả dự án

Ứng dụng quản lý check-in/check-out nhân viên sử dụng QR code và xác thực vị trí GPS. Giúp công ty quản lý giờ làm việc, kiểm soát có mặt nhân viên tại công ty, và tính toán giờ công chính xác.

## 🧠 Giới thiệu Công nghệ

### NextJS
### NestJS - Monolith - Fastify
### MongoDB

## 📁 Cấu trúc dự án

```
my-project/
├── api/                    # Backend NestJS
│   ├── src/
│   │   ├── modules/        # business logic
│   │   │   ├── auth/           
│   │   │   ├── employees/      
│   │   │   ├── checkin/        
│   │   │   ├── qr/             
│   │   │   └── location/       
│   │   │
│   │   ├── main.ts
│   │   └── app.module.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── ezcheckin-client/               # Frontend NextJS
│   ├── app/
│   │   ├── page.tsx        # Trang chính
│   ├── components/         
│   ├── lib/               
│   ├── package.json
│   └── next.config.js
│
└── README.md
```

## 🎯 Chức năng chính

### 1. **Scan QR Code**

- Nhân viên scan QR code tại công ty để check-in/out
- Xác thực QR code hợp lệ

### 2. **Xác minh GPS**

- Kiểm tra vị trí nhân viên có trong bán kính cho phép (500m - 1km)
- Ghi nhận tọa độ vị trí check-in

### 3. **Lưu dữ liệu**

- Lưu thời gian check-in/out
- Lưu vị trí GPS
- Lưu thiết bị/browser sử dụng

### 4. **Báo cáo & Thống kê**

- Xem lịch sử check-in cá nhân
- Báo cáo giờ làm việc
- Thống kê có mặt/vắng mặt

### 5. **Admin Dashboard**

- Quản lý nhân viên
- Xem lịch sử toàn công ty
- Tạo/quản lý QR code điểm check-in
- Xuất báo cáo

## 🚀 Hướng dẫn chạy

### Yêu cầu

- Node.js 16+
- npm hoặc pnpm
- PostgreSQL (hoặc MongoDB)

### Backend Setup

```bash
cd api
npm install
npm run start:dev
```

Backend chạy tại `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại `http://localhost:3001`

## 📡 API Endpoints (Ví dụ)

```
POST   /api/auth/login           - Đăng nhập
POST   /api/auth/logout          - Đăng xuất
GET    /api/employees            - Danh sách nhân viên
POST   /api/checkin              - Check-in/out
GET    /api/checkin/history      - Lịch sử check-in
POST   /api/qr/verify            - Xác thực QR code
GET    /api/location/validate    - Kiểm tra vị trí GPS
GET    /api/reports/summary      - Báo cáo tổng hợp
```

## 🔒 Tính năng bảo mật

- JWT authentication
- Password hashing (bcrypt)
- Xác thực GPS (chống giả mạo vị trí)
- Rate limiting
- CORS policy
- Input validation & sanitization

## 📝 License

MIT

## 👨‍💻 Tác giả

Your Name

---

**Happy Coding! 🚀**
