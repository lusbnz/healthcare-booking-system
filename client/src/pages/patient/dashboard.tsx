"use client";

import { StatCard, StatCardProps } from "@/components/common/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  IconUsers,
  IconClipboardList,
  IconStethoscope,
  IconPrescription,
  IconHeadset,
} from "@tabler/icons-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { ProtectedRoute } from "@/lib/auth";

const patientStats: StatCardProps[] = [
  {
    title: "Lịch hẹn sắp tới",
    value: 3,
    badge: { value: "+1", trend: "up" },
    footerLabel: "Trong 7 ngày tới",
    icon: IconClipboardList,
  },
  {
    title: "Bác sĩ theo dõi",
    value: 2,
    footerLabel: "Ổn định",
    icon: IconUsers,
  },
  {
    title: "Hồ sơ y tế",
    value: 12,
    badge: { value: "+2", trend: "up" },
    footerLabel: "Kết quả gần nhất",
    footerSub: "Dữ liệu mới cập nhật",
    icon: IconStethoscope,
  },
  {
    title: "Thuốc đang dùng",
    value: 4,
    footerLabel: "Theo đơn",
    icon: IconPrescription,
  },
];

const quickActions: StatCardProps[] = [
  {
    title: "Tìm Bác Sĩ",
    value: "",
    footerLabel: "Khám phá các bác sĩ chuyên khoa",
    icon: IconUsers,
    className: "cursor-pointer hover:bg-accent",
  },
  {
    title: "Đặt Lịch Hẹn",
    value: "",
    footerLabel: "Đặt lịch nhanh chóng",
    icon: IconClipboardList,
    className: "cursor-pointer hover:bg-accent",
  },
  {
    title: "Xem Hồ Sơ",
    value: "",
    footerLabel: "Xem lịch sử y tế",
    icon: IconStethoscope,
    className: "cursor-pointer hover:bg-accent",
  },
];

export default function PatientDashboardPage() {
  const router = useRouter();

  const handleQuickActionClick = (title: string) => {
    switch (title) {
      case "Tìm Bác Sĩ":
        router.push("patient/find-doctor");
        break;
      case "Đặt Lịch Hẹn":
        router.push("patient/book-appointment");
        break;
      case "Xem Hồ Sơ":
        router.push("patient/medical-records");
        break;
      default:
        break;
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
            <CardContent className="py-6">
              <h2 className="text-2xl font-semibold mb-1">
                Chào mừng trở lại, Nguyễn Văn Nam!
              </h2>
              <p>Hôm nay là ngày tốt để chăm sóc sức khỏe của bạn</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {patientStats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lịch Hẹn Sắp Tới</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    doctor: "BS. Nguyễn Văn A",
                    date: "28/1/2025",
                    time: "09:00",
                    room: "Phòng 201, Tầng 2",
                    status: "Đã xác nhận",
                  },
                  {
                    doctor: "BS. Trần Thị B",
                    date: "30/1/2025",
                    time: "14:30",
                    room: "Phòng 105, Tầng 1",
                    status: "Chờ xác nhận",
                  },
                  {
                    doctor: "BS. Lê Văn C",
                    date: "2/2/2025",
                    time: "10:15",
                    room: "Phòng 301, Tầng 3",
                    status: "Đã xác nhận",
                  },
                ].map((item, i) => (
                  <div key={i} className="border rounded p-2">
                    <div className="font-medium">{item.doctor}</div>
                    <div className="text-sm">
                      {item.date} — {item.time}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.room}
                    </div>
                    <Badge
                      variant={
                        item.status === "Đã xác nhận"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thao Tác Nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action) => (
                  <div key={action.title} onClick={() => handleQuickActionClick(action.title)}>
                    <StatCard {...action} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nhắc Nhở Sức Khỏe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Đã đến lúc uống thuốc huyết áp. Nhớ uống đúng giờ để đảm bảo
                  hiệu quả điều trị.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}