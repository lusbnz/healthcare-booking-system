"use client";

import { StatCard, StatCardProps } from "@/components/common/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  IconUsers,
  IconPrescription,
  IconPill,
  IconClipboardList,
} from "@tabler/icons-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { ProtectedRoute, useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import {
  getAppointments,
  getDoctorsForPatients,
  getPatientDashboard,
} from "@/api/patients";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

type ApiAppointment = {
  id: number;
  patient: number;
  doctor: number;
  timeslot: string;
  reason: string;
  status: "pending" | "confirm" | "cancelled";
  created_at: string;
  updated_at: string;
};

type Appointment = {
  id: number;
  doctorName: string;
  patient: number;
  doctor: number;
  date: string;
  time: string;
  location: string;
  timeslot: string;
  phone: string;
  status: "pending" | "confirm" | "cancelled";
  reason: string;
};

type Doctor = {
  id: number;
  username: string;
  email: string;
  phone_number: string | null;
  profile: {
    fullname?: string;
    email?: string;
    phone_number?: string;
    specialty?: string;
    address?: string;
    license_number?: string;
  };
};

type DashboardStats = {
  upcoming_appointments: number;
  unread_notifications: number;
};

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
];

export default function PatientDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [stats, setStats] = useState<StatCardProps[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorList: Doctor[] = await getDoctorsForPatients();
        setDoctors(doctorList);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const apiAppointments: ApiAppointment[] = await getAppointments("");
        const mappedAppointments = await Promise.all(
          apiAppointments.map(async (appt) => {
            const doctorDetails = doctors?.find(
              (doctor) => doctor.id === appt.doctor
            );
            const timeslot = new Date(appt.timeslot);
            return {
              id: appt.id,
              doctorName: doctorDetails?.username || "Unknown",
              doctor: appt.doctor,
              patient: appt.patient,
              date: format(timeslot, "dd/MM/yyyy", { locale: vi }),
              time: format(timeslot, "HH:mm", { locale: vi }),
              location: doctorDetails?.profile?.address || "N/A",
              phone: doctorDetails?.phone_number || "N/A",
              status: appt.status,
              reason: appt.reason,
              timeslot: appt.timeslot,
            } as Appointment;
          })
        );
        setAppointments(mappedAppointments);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    fetchAppointments();
  }, [doctors]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const dashboardData: DashboardStats = await getPatientDashboard();
        const newStats: StatCardProps[] = [
          {
            title: "Lịch hẹn sắp tới",
            value: dashboardData.upcoming_appointments.toString(),
            badge:
              dashboardData.upcoming_appointments > 0
                ? {
                    value: `+${dashboardData.upcoming_appointments}`,
                    trend: "up",
                  }
                : undefined,
            footerLabel: "Trong 7 ngày tới",
            className:
              "bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow",
          },
          {
            title: "Thông báo chưa đọc",
            value: dashboardData.unread_notifications.toString(),
            badge:
              dashboardData.unread_notifications > 0
                ? {
                    value: `+${dashboardData.unread_notifications}`,
                    trend: "up",
                  }
                : undefined,
            footerLabel: "Thông báo mới",
            className:
              "bg-gradient-to-br from-yellow-50 to-white hover:shadow-lg transition-shadow",
          },
          // {
          //   title: "Bác sĩ theo dõi",
          //   value: 2,
          //   footerLabel: "Ổn định",
          //   icon: IconUsers,
          //   className:
          //     "bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-shadow",
          // },
          // {
          //   title: "Hồ sơ y tế",
          //   value: 12,
          //   badge: { value: "+2", trend: "up" },
          //   footerLabel: "Kết quả gần nhất",
          //   footerSub: "Dữ liệu mới cập nhật",
          //   className:
          //     "bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-shadow",
          // },
          // {
          //   title: "Thuốc đang dùng",
          //   value: 4,
          //   footerLabel: "Theo đơn",
          //   icon: IconPrescription,
          //   className:
          //     "bg-gradient-to-br from-pink-50 to-white hover:shadow-lg transition-shadow",
          // },
        ];
        setStats(newStats);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        // Fallback to default stats in case of API failure
        setStats([
          {
            title: "Lịch hẹn sắp tới",
            value: "0",
            footerLabel: "Trong 7 ngày tới",
            className:
              "bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow",
          },
          {
            title: "Thông báo chưa đọc",
            value: "0",
            footerLabel: "Thông báo mới",
            className:
              "bg-gradient-to-br from-yellow-50 to-white hover:shadow-lg transition-shadow",
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
        ]);
      }
    };

    fetchDashboardStats();
  }, []);

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
                    Chào mừng trở lại, {user?.username}!
                  </h2>
                  <p className="text-sm md:text-base opacity-90">
                    Hôm nay là ngày tuyệt vời để chăm sóc sức khỏe của bạn
                  </p>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat) => (
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
                    {appointments.map((item, i) => (
                      <div
                        key={i}
                        className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                        onClick={() =>
                          router.push(`/${user?.user_type}/my-schedule`)
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-base">
                            {item.doctorName}
                          </div>
                          <Badge
                            variant={
                              item.status === "confirm" ? "default" : "outline"
                            }
                            className={cn(
                              item.status === "confirm"
                                ? "bg-green-100 text-green-800"
                                : item.status === "cancelled"
                                ? "bg-red-100 text-red-800"
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
                          {item.reason}
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
