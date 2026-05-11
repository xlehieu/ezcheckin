# Shifts Implementation Guide

## 📋 Overview

Tôi đã viết lại UI Shifts hoàn toàn dựa trên cấu trúc Users và backend API. Bao gồm:
- ✅ Type definitions
- ✅ Server actions (API calls)
- ✅ Zustand store
- ✅ React component với CRUD + Filter
- ✅ Pagination

## 📁 Files Created/Modified

### 1. **Type Definitions** - `src/@types/shift.type.ts`
```typescript
export type ShiftRecord {
  _id: string;
  shiftName: string;
  startTime: string; // HH:mm:ss
  endTime: string;   // HH:mm:ss
  isActive: boolean;
  business: string;
  createdAt: string;
  updatedAt: string;
  // ... other fields
}

export type ShiftQueryParams = ListQueryParams & {
  status?: boolean;
}

export type CreateShiftPayload {
  shiftName: string;
  startTime: string;  // HH:mm format
  endTime: string;    // HH:mm format
}
```

### 2. **Server Actions** - `src/features/shifts/shift.action.ts`
Bao gồm các hàm:
- `getShifts(query)` - Lấy danh sách ca với pagination
- `getShiftById(id)` - Lấy chi tiết ca
- `createShift(payload)` - Tạo ca mới
- `updateShift(id, payload)` - Cập nhật ca
- `deleteShift(id)` - Xóa ca (soft delete)
- `restoreShift(id)` - Khôi phục ca đã xóa
- `toggleShiftStatus(id)` - Bật/tắt trạng thái

### 3. **Cache Tags** - `src/features/shifts/shift.tag.ts`
Quản lý cache tags cho Next.js revalidation

### 4. **Zustand Store** - `src/store/shift.store.ts`
```typescript
type ShiftStore = {
  shiftListFilter: ShiftQueryParams;
  setShiftListFilter: (values: Partial<ShiftQueryParams>) => void;
}
```

### 5. **React Component** - `src/app/main/shifts/_components/ShiftList.tsx`

#### Features:
- **Table Display**: Hiển thị danh sách ca với 5 cột:
  - Tên ca
  - Giờ vào (HH:mm)
  - Giờ ra (HH:mm)
  - Trạng thái (Tag: Xanh/Đỏ)
  - Ngày tạo

- **Search & Filter**:
  - Input search theo tên ca
  - Pagination (current, pageSize)
  - Tự động reload khi filter thay đổi

- **CRUD Operations**:
  - ✅ **Create**: Modal form tạo ca mới
  - ✅ **Update**: Edit ca thông qua modal
  - ✅ **Delete**: Xóa với confirmation popup
  - ✅ **Read**: Hiển thị chi tiết

- **Modal Form**:
  - Tên ca (text input)
  - Giờ bắt đầu (time input HH:mm)
  - Giờ kết thúc (time input HH:mm)
  - Validation rules

- **Buttons**:
  - Reload button
  - Add new shift button
  - Edit (pencil icon)
  - Delete (trash icon với confirmation)

### 6. **Page Layout** - `src/app/main/shifts/page.tsx`
```typescript
export default function ShiftsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1>Ca làm việc</h1>
        <p>Quản lý các ca làm việc trong công ty</p>
      </div>
      <ShiftList />
    </div>
  );
}
```

### 7. **Layout Metadata** - `src/app/main/shifts/layout.tsx`
Set metadata title cho page

## 🔗 API Integration

Tất cả actions kết nối với backend `/shifts` endpoint:

| Method | Endpoint | Action | Roles |
|--------|----------|--------|-------|
| GET | `/shifts` | Lấy danh sách | ADMIN, MANAGER |
| GET | `/shifts/:id` | Lấy chi tiết | ADMIN, MANAGER |
| POST | `/shifts` | Tạo mới | ADMIN, MANAGER |
| PATCH | `/shifts/:id` | Cập nhật | ADMIN, MANAGER |
| PATCH | `/shifts/toggle/:id` | Toggle status | ADMIN, MANAGER |
| DELETE | `/shifts/:id` | Xóa mềm | ADMIN |
| POST | `/shifts/:id/restore` | Khôi phục | ADMIN |

## 🎯 Features Implemented

### State Management
- ✅ Zustand store cho filter state
- ✅ Pagination state
- ✅ Loading state
- ✅ Modal state (open/close, editing)

### Data Handling
- ✅ Time format conversion (HH:mm:ss → HH:mm)
- ✅ Date formatting (Vietnamese locale)
- ✅ Pagination meta info

### UI/UX
- ✅ Loading skeleton
- ✅ Empty state (table automatic)
- ✅ Success/Error messages
- ✅ Confirmation dialogs
- ✅ Responsive table

### Error Handling
- ✅ Try-catch blocks
- ✅ User feedback via message.error()
- ✅ Console logging (optional)

## 📊 Data Flow

```
ShiftList Component
├── useShiftStore (filter state)
├── usePaginationData (data, loading, total)
├── useEffect → fetchShifts() → getShifts(query)
├── Table (display)
├── Modal (create/edit)
└── Actions (create/update/delete)
    └── API Server → Backend
        └── Response → State Update
```

## 🧪 Usage Example

```typescript
// In a page or another component
import ShiftList from '@/app/main/shifts/_components/ShiftList';

export default function ShiftsPage() {
  return <ShiftList />;
}

// Or use the store
import { useShiftStore } from '@/store/shift.store';

const MyComponent = () => {
  const { shiftListFilter, setShiftListFilter } = useShiftStore();
  
  // Update filter
  setShiftListFilter({
    search: 'Ca sáng',
    current: 1,
  });
};
```

## 🔍 Architecture Comparison with Users

| Aspect | Users | Shifts |
|--------|-------|--------|
| Type file | `user.type.ts` | `shift.type.ts` ✅ |
| Actions | `user.action.ts` | `shift.action.ts` ✅ |
| Store | `user.store.ts` | `shift.store.ts` ✅ |
| Component | `UserList.tsx` | `ShiftList.tsx` ✅ |
| Features | List + Filter | List + Filter + CRUD + Modal ✅ |

## 📝 Notes

1. **Time Format**: Backend sử dụng HH:mm:ss, frontend chuyển đổi thành HH:mm cho display
2. **Pagination**: Mặc định 10 items/page, có thể thay đổi trong store
3. **Soft Delete**: Xóa là soft delete, có option restore
4. **Revalidation**: Sử dụng Next.js cache tags để revalidate data sau mỗi action
5. **Error Handling**: Tất cả errors được catch và hiển thị user-friendly messages

---

**Status**: ✅ Hoàn thành và sẵn sàng sử dụng
