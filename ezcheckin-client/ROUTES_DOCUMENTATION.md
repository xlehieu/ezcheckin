# Ez Checkin - Routes & Pages Structure

## 📋 Summary

Tôi đã tự động sinh và cấu hình tất cả các pages và routes cho dự án ezcheckin dựa trên backend API:

### ✅ Đã tạo (Created)

#### 1. **Trang Chấm Công (Attendances Page)**
   - **Đường dẫn**: `/main/attendances`
   - **File**: `src/app/main/attendances/page.tsx`
   - **Tính năng**:
     - Danh sách log chấm công
     - Thống kê (Có mặt, Vắng mặt, Đi muộn, Về sớm)
     - Lọc theo ngày, nhân viên
     - Bảng hiển thị chi tiết

#### 2. **Trang Doanh Nghiệp (Business Page)**
   - **Đường dẫn**: `/main/my-business`
   - **File**: `src/app/main/my-business/page.tsx`
   - **Tính năng**:
     - Xem thông tin công ty
     - Chỉnh sửa (Tên, email, điện thoại, địa chỉ, etc.)
     - Hiển thị quy mô công ty
     - Lịch sử hoạt động

#### 3. **Trang Giấy Phép (License Page)**
   - **Đường dẫn**: `/main/license`
   - **File**: `src/app/main/license/page.tsx`
   - **Tính năng**:
     - Danh sách giấy phép
     - Thống kê (Hoạt động, Sắp hết hạn, Hết hạn)
     - Thêm/Sửa/Xóa giấy phép
     - Cảnh báo giấy phép sắp hết hạn

### 📂 Cấu trúc Routes

#### Route Configuration Files:

```
src/routes/main/
├── index.ts                 (Central export)
├── main.route.ts           (Main routes + Navigation)
├── attendances.route.ts    (NEW)
├── license.route.ts        (NEW)
├── my-business.route.ts    (Updated)
├── qr.route.ts            (Updated)
├── shifts.route.ts        (Updated)
└── users.route.ts         (Updated)
```

### 🗺️ Navigation Menu

Đã tạo `MAIN_NAVIGATION` với 7 mục:
1. 📊 Dashboard
2. 🕐 Chấm công (Attendances)
3. 📅 Ca làm việc (Shifts)
4. 👥 Nhân viên (Users)
5. 🏢 Doanh nghiệp (Business)
6. 📱 QR Check-in
7. 📜 Giấy phép (License)

### 🔌 API Endpoints Được Sử Dụng

**Chấm Công:**
- `GET /api/attendances/business-logs` - Danh sách log
- `GET /api/attendances/business-stats` - Thống kê

**Doanh Nghiệp:**
- `GET /api/business/:id` - Lấy thông tin
- `PATCH /api/business/:id` - Cập nhật

**Giấy Phép:**
- `GET /api/license` - Danh sách
- `POST /api/license` - Tạo mới
- `PATCH /api/license/:id` - Cập nhật
- `DELETE /api/license/:id` - Xóa

### 💻 Cách Sử Dụng Routes

```typescript
// Import từ main route index
import { ROUTE_MAIN, MAIN_NAVIGATION, ROUTE_ATTENDANCES } from '@/routes/main';

// Sử dụng trong navigation
<Link href={ROUTE_ATTENDANCES.ATTENDANCE_LIST}>
  Xem chấm công
</Link>

// Sử dụng trong redirect
redirect(ROUTE_MY_BUSINESS.MY_BUSINESS_DETAIL);
```

### 📝 Pages Structure

```
app/main/
├── page.tsx (Dashboard)
├── layout.tsx
├── attendances/
│   └── page.tsx (NEW - Chấm công)
├── my-business/
│   └── page.tsx (NEW - Doanh nghiệp)
├── license/
│   └── page.tsx (NEW - Giấy phép)
├── shifts/
│   └── page.tsx (Đã tồn tại)
├── users/
│   └── page.tsx (Đã tồn tại)
├── qr/
│   └── page.tsx (Cần tạo)
└── _components/
    └── DashboardContent.tsx
```

### 🎨 Technologies

- ✅ Next.js 16.2.4
- ✅ React 19.2.4
- ✅ Ant Design (antd)
- ✅ Tailwind CSS
- ✅ TypeScript
- ✅ dayjs (Date management)

### 📌 Tiếp theo

1. **Tạo QR Check-in page** - `src/app/main/qr/page.tsx`
2. **Tạo/cập nhật Users page** - `src/app/main/users/page.tsx`
3. **Tạo/cập nhật Shifts page** - `src/app/main/shifts/page.tsx`
4. **Tích hợp Navigation** - Cập nhật DashboardContent để hiển thị menu

---

**Tất cả routes đã được định cấu hình và sẵn sàng sử dụng!** ✨
