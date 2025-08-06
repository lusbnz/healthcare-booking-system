"use client";

import { StatCard, StatCardProps } from "@/components/common/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  IconUsers,
  IconClipboardList,
  IconStethoscope,
  IconPrescription,
  IconPill,
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
    // icon: IconClipboardList,
    className:
      "bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow",
  },
  {
    title: "Bác sĩ theo dõi",
    value: 2,
    footerLabel: "Ổn định",
    icon: IconUsers,
    className:
      "bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-shadow",
  },
  {
    title: "Hồ sơ y tế",
    value: 12,
    badge: { value: "+2", trend: "up" },
    footerLabel: "Kết quả gần nhất",
    footerSub: "Dữ liệu mới cập nhật",
    // icon: IconStethoscope,
    className:
      "bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-shadow",
  },
  {
    title: "Thuốc đang dùng",
    value: 4,
    footerLabel: "Theo đơn",
    icon: IconPrescription,
    className:
      "bg-gradient-to-br from-pink-50 to-white hover:shadow-lg transition-shadow",
  },
];

const quickActions: StatCardProps[] = [
  {
    title: "Tìm Bác Sĩ",
    value: "",
    footerLabel: "Khám phá các bác sĩ chuyên khoa",
    icon: IconUsers,
    className:
      "cursor-pointer bg-gradient-to-br from-blue-100 to-white hover:bg-blue-200 transition-all",
  },
  {
    title: "Đặt Lịch Hẹn",
    value: "",
    footerLabel: "Đặt lịch nhanh chóng",
    icon: IconClipboardList,
    className:
      "cursor-pointer bg-gradient-to-br from-green-100 to-white hover:bg-green-200 transition-all",
  },
  {
    title: "Xem Hồ Sơ",
    value: "",
    footerLabel: "Xem lịch sử y tế",
    icon: IconStethoscope,
    className:
      "cursor-pointer bg-gradient-to-br from-purple-100 to-white hover:bg-purple-200 transition-all",
  },
];

export default function PatientDashboardPage() {
  const router = useRouter();

  const handleQuickActionClick = (title: string) => {
    switch (title) {
      case "Tìm Bác Sĩ":
        router.push("/patient/find-doctor");
        break;
      case "Đặt Lịch Hẹn":
        router.push("/patient/book-appointment");
        break;
      case "Xem Hồ Sơ":
        router.push("/patient/medical-records");
        break;
      default:
        break;
    }
  };

  return (
    <ProtectedRoute>
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
          <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">
            <div className="@container/main flex flex-1 flex-col gap-6">
              {/* Welcome Card */}
              <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg rounded-xl overflow-hidden">
                <CardContent className="py-8 px-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    Chào mừng trở lại, Nguyễn Văn Nam!
                  </h2>
                  <p className="text-sm md:text-base opacity-90">
                    Hôm nay là ngày tuyệt vời để chăm sóc sức khỏe của bạn
                  </p>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {patientStats.map((stat) => (
                  <StatCard key={stat.title} {...stat} />
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Appointments Card */}
                <Card className="shadow-sm hover:shadow-md transition-shadow rounded-xl">
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg md:text-xl">
                      Lịch Hẹn Sắp Tới
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
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
                      <div
                        key={i}
                        className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-base">
                            {item.doctor}
                          </div>
                          <Badge
                            variant={
                              item.status === "Đã xác nhận"
                                ? "default"
                                : "outline"
                            }
                            className={cn(
                              item.status === "Đã xác nhận"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            )}
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {item.date} — {item.time}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.room}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions Card */}
                <Card className="shadow-sm hover:shadow-md transition-shadow rounded-xl">
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg md:text-xl">
                      Thao Tác Nhanh
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {quickActions.map((action) => (
                      <div
                        key={action.title}
                        onClick={() => handleQuickActionClick(action.title)}
                      >
                        <StatCard {...action} />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Health Reminder Card */}
                <Card className="shadow-sm hover:shadow-md transition-shadow rounded-xl">
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                      <IconPill className="h-5 w-5 text-blue-500" />
                      Nhắc Nhở Sức Khỏe
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Đã đến lúc uống thuốc huyết áp. Nhớ uống đúng giờ để đảm
                      bảo hiệu quả điều trị.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push("patient/medication-schedule")}
                    >
                      Xem lịch uống thuốc
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
