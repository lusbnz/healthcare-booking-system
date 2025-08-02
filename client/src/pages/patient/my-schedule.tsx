"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard, StatCardProps } from "@/components/common/stat-card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";

type Appointment = {
  id: number;
  doctorName: string;
  date: string;
  time: string;
  location: string;
  phone: string;
  status: "Sắp tới" | "Đã hoàn thành" | "Chờ xác nhận" | "Đã hủy";
  fee: number;
  notes?: string;
};

const initialAppointments: Appointment[] = [
  {
    id: 1,
    doctorName: "Nguyễn Văn A",
    date: "28/01/2025",
    time: "09:00",
    location: "Phòng 201, Tầng 2",
    phone: "024-369-8731",
    status: "Sắp tới",
    fee: 500000,
    notes: "Triều chứng: Kiểm tra huyết áp, theo dõi điều trị. Ghi chú: Mang theo kết quả xét nghiệm máu gần nhất",
  },
  {
    id: 2,
    doctorName: "Trần Thị B",
    date: "30/01/2025",
    time: "14:30",
    location: "Phòng 105, Tầng 1",
    phone: "028-385-4269",
    status: "Chờ xác nhận",
    fee: 400000,
    notes: "Triều chứng: Khám sức khỏe tổng quát. Ghi chú: Nhịn ăn 8 tiếng trước khám",
  },
  {
    id: 3,
    doctorName: "Lê Văn C",
    date: "02/02/2025",
    time: "10:15",
    location: "Phòng 301, Tầng 3",
    phone: "024-369-8731",
    status: "Đã hoàn thành",
    fee: 500000,
  },
  {
    id: 4,
    doctorName: "Phạm Thị D",
    date: "01/02/2025",
    time: "10:00",
    location: "Phòng 101, Tầng 1",
    phone: "024-369-8731",
    status: "Đã hủy",
    fee: 450000,
  },
];

const statCards: StatCardProps[] = [
  {
    title: "Sắp tới",
    value: "3",
    footerLabel: "Lịch hẹn trong tương lai",
    className: "bg-green-50 hover:shadow-lg transition-shadow",
  },
  {
    title: "Đã hoàn thành",
    value: "1",
    footerLabel: "Lịch hẹn đã khám",
    className: "bg-blue-50 hover:shadow-lg transition-shadow",
  },
  {
    title: "Chờ xác nhận",
    value: "1",
    footerLabel: "Lịch hẹn đang chờ",
    className: "bg-yellow-50 hover:shadow-lg transition-shadow",
  },
  {
    title: "Đã hủy",
    value: "1",
    footerLabel: "Lịch hẹn bị hủy",
    className: "bg-red-50 hover:shadow-lg transition-shadow",
  },
];

export default function MySchedulePage() {
  const [appointments, setAppointments] = useState(initialAppointments);
//   const { cancelAppointment } = useAuth();
  const router = useRouter();

  const handleCancelAppointment = async (appointmentId: number) => {
    // try {
    //   await cancelAppointment(appointmentId);
    //   setAppointments(appointments.filter((a) => a.id !== appointmentId));
    // } catch (error) {
    //   console.error("Cancellation failed:", error);
    // }
  };

  const handleViewDetails = (appointmentId: number) => {
    router.push(`/patient/appointment-detail?id=${appointmentId}`);
  };

  const filterAppointmentsByStatus = (status: string) => {
    if (status === "Đã khám") return appointments.filter(a => a.status === "Đã hoàn thành");
    if (status === "All") return appointments;
    return appointments.filter(a => a.status === status);
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
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Lịch Hẹn Của Tôi</h1>
          <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {statCards.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => router.push("/patient/find-doctor")}>
                <Calendar className="mr-2 h-4 w-4" /> Đặt lịch mới
              </Button>
            </div>
          </div>

          <Tabs defaultValue="All" className="w-full">
            <TabsList className="flex justify-start gap-2 bg-muted p-1 rounded-md">
              <TabsTrigger value="All" className="flex-1">Tất cả</TabsTrigger>
              <TabsTrigger value="Sắp tới" className="flex-1">Sắp tới</TabsTrigger>
              <TabsTrigger value="Đã khám" className="flex-1">Đã khám</TabsTrigger>
              <TabsTrigger value="Đã hủy" className="flex-1">Đã hủy</TabsTrigger>
            </TabsList>
            <TabsContent value="All">
              <div className="space-y-4">
                {filterAppointmentsByStatus("All").map((appointment) => (
                  <Card key={appointment.id} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={`https://i.pravatar.cc/100?img=${appointment.id}`}
                          alt={appointment.doctorName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <CardTitle className="text-md">{appointment.doctorName}</CardTitle>
                          <CardDescription className="text-sm">
                            {appointment.date} {appointment.time}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{appointment.location}</p>
                        <p className="text-xs text-muted-foreground">{appointment.phone}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center mb-2">
                        {appointment.status === "Sắp tới" && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {appointment.status}
                          </span>
                        )}
                        {appointment.status === "Chờ xác nhận" && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {appointment.status}
                          </span>
                        )}
                        {appointment.status === "Đã hoàn thành" && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {appointment.status}
                          </span>
                        )}
                        {appointment.status === "Đã hủy" && (
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {appointment.status}
                          </span>
                        )}
                        <span className="text-sm font-medium">
                          Phí khám: {appointment.fee.toLocaleString("vi-VN")} VND
                        </span>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground mb-2">{appointment.notes}</p>
                      )}
                      <div className="flex gap-2">
                        {appointment.status !== "Đã hủy" && appointment.status !== "Đã hoàn thành" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            Hủy lịch
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(appointment.id)}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="Sắp tới">
              <div className="space-y-4">
                {filterAppointmentsByStatus("Sắp tới").map((appointment) => (
                  <Card key={appointment.id} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={`https://i.pravatar.cc/100?img=${appointment.id}`}
                          alt={appointment.doctorName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <CardTitle className="text-md">{appointment.doctorName}</CardTitle>
                          <CardDescription className="text-sm">
                            {appointment.date} {appointment.time}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{appointment.location}</p>
                        <p className="text-xs text-muted-foreground">{appointment.phone}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {appointment.status}
                        </span>
                        <span className="text-sm font-medium">
                          Phí khám: {appointment.fee.toLocaleString("vi-VN")} VND
                        </span>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground mb-2">{appointment.notes}</p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          Hủy lịch
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(appointment.id)}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="Đã khám">
              <div className="space-y-4">
                {filterAppointmentsByStatus("Đã khám").map((appointment) => (
                  <Card key={appointment.id} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={`https://i.pravatar.cc/100?img=${appointment.id}`}
                          alt={appointment.doctorName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <CardTitle className="text-md">{appointment.doctorName}</CardTitle>
                          <CardDescription className="text-sm">
                            {appointment.date} {appointment.time}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{appointment.location}</p>
                        <p className="text-xs text-muted-foreground">{appointment.phone}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {appointment.status}
                        </span>
                        <span className="text-sm font-medium">
                          Phí khám: {appointment.fee.toLocaleString("vi-VN")} VND
                        </span>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground mb-2">{appointment.notes}</p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(appointment.id)}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="Đã hủy">
              <div className="space-y-4">
                {filterAppointmentsByStatus("Đã hủy").map((appointment) => (
                  <Card key={appointment.id} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={`https://i.pravatar.cc/100?img=${appointment.id}`}
                          alt={appointment.doctorName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <CardTitle className="text-md">{appointment.doctorName}</CardTitle>
                          <CardDescription className="text-sm">
                            {appointment.date} {appointment.time}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{appointment.location}</p>
                        <p className="text-xs text-muted-foreground">{appointment.phone}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {appointment.status}
                        </span>
                        <span className="text-sm font-medium">
                          Phí khám: {appointment.fee.toLocaleString("vi-VN")} VND
                        </span>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground mb-2">{appointment.notes}</p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(appointment.id)}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}