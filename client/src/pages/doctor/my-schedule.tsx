"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { StatCard } from "@/components/common/stat-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

type Appointment = {
  id: string;
  patientName: string;
  date: Date;
  time: string;
  duration: string;
  phone: string;
  status: string;
  treatment: string;
};

const initialAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Nguyễn Văn A",
    date: new Date("2025-07-25"),
    time: "08:00",
    duration: "30 phút",
    phone: "0901234567",
    status: "Đã xác nhận",
    treatment: "Đau đầu, chóng mặt",
  },
  {
    id: "2",
    patientName: "Trần Thị B",
    date: new Date("2025-07-25"),
    time: "08:30",
    duration: "45 phút",
    phone: "0907654321",
    status: "Chờ xác nhận",
    treatment: "Ho, khan, sốt nhẹ",
  },
];

export default function MySchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date("2025-07-25T13:15:00+07:00"));
  const [appointments] = useState<Appointment[]>(initialAppointments);

  // Lọc các lịch hẹn theo ngày được chọn
  const filteredAppointments = date
    ? appointments.filter((app) => isSameDay(app.date, date))
    : appointments;

  // Lấy danh sách các ngày có lịch hẹn
  const getDaysWithAppointments = () => {
    return appointments.map((app) => app.date);
  };

  const renderAppointment = (appointment: Appointment) => (
    <div
      key={appointment.id}
      className="flex items-center justify-between p-4 mb-4 bg-gray-50 rounded-lg"
    >
      <div>
        <div className="font-medium">{appointment.patientName}</div>
        <div className="text-sm text-muted-foreground">
          {format(appointment.date, "dd/MM/yyyy")} - {appointment.time} ({appointment.duration})
        </div>
        <div className="text-sm text-muted-foreground">{appointment.treatment}</div>
      </div>
      <div className="text-right">
        <div
          className={cn(
            "text-sm",
            appointment.status === "Đã xác nhận" ? "text-green-600" : "text-yellow-600"
          )}
        >
          {appointment.status}
        </div>
        <div className="text-sm text-muted-foreground">{appointment.phone}</div>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" size="sm">
            Xem chi tiết
          </Button>
          <Button variant="outline" size="sm">
            Chỉnh sửa
          </Button>
        </div>
      </div>
    </div>
  );

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
        <div className="container mx-auto p-4 sm:p-6 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Lịch Trình Của Tôi
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Quản lý lịch hẹn và ca khám
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <StatCard
              title="Tổng Lịch Hẹn"
              value="5"
              icon={CalendarIcon}
              footerLabel="Tổng số lịch hẹn"
              className="bg-gradient-to-br from-blue-50 to-white"
            />
            <StatCard
              title="Đã Xác Nhận"
              value="3"
              icon={CalendarIcon}
              footerLabel="Lịch hẹn xác nhận"
              className="bg-gradient-to-br from-green-50 to-white"
            />
            <StatCard
              title="Chờ Xác Nhận"
              value="1"
              icon={CalendarIcon}
              footerLabel="Lịch hẹn đang chờ"
              className="bg-gradient-to-br from-yellow-50 to-white"
            />
            <StatCard
              title="Phòng Khám"
              value="A101"
              icon={CalendarIcon}
              footerLabel="Phòng hiện tại"
              className="bg-gradient-to-br from-purple-50 to-white"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lịch Hẹn</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      modifiers={{
                        booked: getDaysWithAppointments(),
                      }}
                      modifiersStyles={{
                        booked: {
                          backgroundColor: "#3b82f6",
                          color: "white",
                          borderRadius: "50%",
                        },
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">
                  {date
                    ? `Lịch hẹn ngày ${format(date, "dd/MM/yyyy")}`
                    : "Tất cả lịch hẹn"}
                </h3>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map(renderAppointment)
                ) : (
                  <p className="text-muted-foreground">
                    {date
                      ? "Không có lịch hẹn trong ngày này."
                      : "Không có lịch hẹn nào."}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}