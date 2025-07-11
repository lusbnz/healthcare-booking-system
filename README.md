# HealthCare Booking System

---

## Stack

### Frontend

- TypeScript
- ReactJS

### Backend

- Python
- Django

### Database

- MySQL

---

## Tổng quan dự án (SaaS)

Nền tảng đặt lịch khám bệnh trực tuyến giúp kết nối **bệnh nhân** và **bác sĩ** một cách tiện lợi, nhanh chóng và an toàn.

### Đối tượng sử dụng

- **Bệnh nhân**:
  - Đăng ký tài khoản
  - Tìm bác sĩ theo chuyên khoa
  - Đặt và quản lý lịch khám
  - Xem hồ sơ khám bệnh

- **Bác sĩ**:
  - Thiết lập khung giờ làm việc
  - Quản lý lịch hẹn
  - Cập nhật hồ sơ khám bệnh

- **Admin**:
  - Quản lý hệ thống
  - Phê duyệt bác sĩ
  - Thống kê hệ thống

---

## Cấu trúc dữ liệu

<img width="1026" height="805" alt="Screenshot 2025-07-11 at 21 35 14" src="https://github.com/user-attachments/assets/d91866c3-755d-447c-bbd4-52f39a61e179" />

---

## Các tính năng chính

1. **Đăng ký / Đăng nhập**
2. **Tìm kiếm bác sĩ theo chuyên khoa, thời gian**
3. **Đặt lịch khám**
4. **Xác nhận / hủy lịch hẹn**
5. **Thông báo qua hệ thống**
6. **Quản lý hồ sơ khám bệnh**
7. **Quản lý thời gian làm việc của bác sĩ**

---

## Luồng hoạt động

- Bệnh nhân đăng ký & đăng nhập
- Tìm kiếm bác sĩ theo chuyên khoa
- Xem khung giờ trống và đặt lịch
- Bác sĩ nhận thông báo và xác nhận
- Gửi nhắc lịch trước 24h
- Bác sĩ cập nhật hồ sơ sau khi khám

---

## Logic quan trọng

- **Prevent double booking**: kiểm tra TimeSlot trước khi đặt
- **Doctor quản lý TimeSlot**
- **Patient có thể hủy lịch trước X giờ**
- **Role-based routing**

---

## API Endpoint

### Authentication & User

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST   | `/api/auth/register` | Đăng ký người dùng |
| POST   | `/api/auth/login`    | Đăng nhập |
| GET    | `/api/auth/profile`  | Lấy thông tin user |
| PUT    | `/api/auth/profile`  | Cập nhật user |
| POST   | `/api/auth/logout`   | Đăng xuất |

### Patient

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | `/api/patients/me` | Lấy thông tin bệnh nhân |
| PUT    | `/api/patients/me` | Cập nhật thông tin bệnh nhân |

### Doctor

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | `/api/doctors`     | Danh sách bác sĩ |
| GET    | `/api/doctors/:id` | Chi tiết bác sĩ |
| GET    | `/api/doctors/me`  | Lấy thông tin bác sĩ hiện tại |
| PUT    | `/api/doctors/me`  | Cập nhật thông tin bác sĩ |

### Specialization (Chuyên khoa)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | `/api/specializations` | Danh sách chuyên khoa |

### Time Slots

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | `/api/timeslots` | Lấy khung giờ còn trống |
| POST   | `/api/timeslots` | Tạo khung giờ làm việc |
| DELETE | `/api/timeslots/:id` | Xóa khung giờ |

### Appointment (Lịch khám)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | `/api/appointments` | Danh sách lịch khám |
| POST   | `/api/appointments` | Đặt lịch khám |
| GET    | `/api/appointments/:id` | Chi tiết lịch |
| PUT    | `/api/appointments/:id` | Cập nhật trạng thái |
| DELETE | `/api/appointments/:id` | Hủy lịch |

### Medical Record

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | `/api/medical-records` | Danh sách hồ sơ |
| GET    | `/api/medical-records/:id` | Chi tiết hồ sơ |
| POST   | `/api/medical-records` | Tạo hồ sơ khám |

### Notification

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | `/api/notifications` | Danh sách thông báo |
| PUT    | `/api/notifications/:id` | Đánh dấu đã đọc |

### Admin

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | `/api/admin/users` | Danh sách người dùng |
| DELETE | `/api/admin/users/:id` | Xóa người dùng |
| PUT    | `/api/admin/doctors/:id/approve` | Phê duyệt bác sĩ |

---

## 🖥️ Client Page (SaaS)

### Public Pages

| Path | Description |
|------|-------------|
| `/` | Trang chủ |
| `/login` | Đăng nhập |
| `/register` | Đăng ký |

### Patient Pages

| Path | Description |
|------|-------------|
| `/dashboard` | Dashboard bệnh nhân |
| `/doctors` | Tìm bác sĩ |
| `/booking/:doctorId` | Đặt lịch |
| `/appointments` | Quản lý lịch hẹn |
| `/appointments/:id` | Chi tiết lịch hẹn |
| `/medical-records` | Hồ sơ bệnh án |
| `/notifications` | Thông báo |
| `/profile` | Hồ sơ cá nhân |

### Doctor Pages

| Path | Description |
|------|-------------|
| `/dashboard` | Dashboard bác sĩ |
| `/my-schedule` | Lịch hẹn của tôi |
| `/availability` | Quản lý khung giờ |
| `/appointments/:id` | Chi tiết buổi khám |
| `/patients` | Danh sách bệnh nhân |
| `/profile` | Hồ sơ bác sĩ |

### Admin Pages

| Path | Description |
|------|-------------|
| `/admin/dashboard` | Dashboard admin |
| `/admin/users` | Quản lý người dùng |
| `/admin/doctors` | Duyệt bác sĩ |

---

## Khả năng mở rộng

- Tích hợp thanh toán online
- Lịch sử thanh toán
- Tích hợp nhắc lịch
