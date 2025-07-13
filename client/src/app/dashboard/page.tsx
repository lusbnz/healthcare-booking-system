"use client";

import { useCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardHome() {
  const user = useCurrentUser();

  if (!user) return <p>Đang tải...</p>;

  if (user.role === "admin") return <p>Đang cập nhật...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chào mừng, {user.full_name}!</h1>
        {user.role === "patient" && <Button>Đặt lịch khám</Button>}
      </div>

      {user.role === "patient" ? <PatientDashboard /> : <DoctorDashboard />}
    </div>
  );
}

function PatientDashboard() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Lịch hẹn sắp tới" />
        <StatCard title="Lịch sử khám" />
        <StatCard title="Bác sĩ theo dõi" />
      </div>

      <TableSection title="Lịch hẹn sắp tới" />
      <TableSection title="Lịch sử khám gần đây" />
    </>
  );
}

function DoctorDashboard() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng bệnh nhân" />
        <StatCard title="Hôm nay" />
        <StatCard title="Doanh thu tháng" />
        <StatCard title="Đánh giá" />
      </div>

      <TableSection title="Lịch hẹn sắp tới" />
      <TableSection title="Bệnh nhân gần đây" />
    </>
  );
}

function StatCard({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">--</p>
      </CardContent>
    </Card>
  );
}

function TableSection({ title }: { title: string }) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="border rounded p-4 text-sm text-muted-foreground">
        (Hiển thị dữ liệu bảng tại đây...)
      </div>
    </div>
  );
}
