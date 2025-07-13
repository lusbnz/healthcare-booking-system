"use client";

import { useCurrentUser } from "@/lib/auth";

export default function DashboardHome() {
  const user = useCurrentUser();

  console.log('user', user);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Chào mừng {user?.full_name}!</h1>
      <p>
        Bạn đang đăng nhập với vai trò <strong>{user?.role}</strong>.
      </p>
    </div>
  );
}
