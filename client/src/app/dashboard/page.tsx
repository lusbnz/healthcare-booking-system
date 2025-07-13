import { getCurrentUser } from "@/lib/auth";

export default function DashboardHome() {
  const user = getCurrentUser();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Chào mừng {user.full_name}!</h1>
      <p>
        Bạn đang đăng nhập với vai trò <strong>{user.role}</strong>.
      </p>
    </div>
  );
}
