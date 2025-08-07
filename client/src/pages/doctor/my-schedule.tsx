"use client";

import { useState, useEffect } from "react";
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
import { format, isSameDay, startOfDay } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  cancelAppointment,
  confirmAppointment,
  getDoctorAppointments,
} from "@/api/doctors";
import { toast } from "sonner";

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
  id: string;
  patientName: string;
  date: Date;
  time: string;
  status: string;
  treatment: string;
};

export default function MySchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const apiAppointments: ApiAppointment[] = await getDoctorAppointments();
        const mappedAppointments: Appointment[] = apiAppointments.map(
          (appt) => {
            const timeslot = new Date(appt.timeslot);
            return {
              id: appt.id.toString(),
              patientName: `Bệnh nhân ${appt.patient}`,
              date: timeslot,
              time: format(timeslot, "HH:mm", { locale: vi }),
              status:
                appt.status === "confirm"
                  ? "Đã xác nhận"
                  : appt.status === "pending"
                  ? "Chờ xác nhận"
                  : "Đã hủy",
              treatment: appt.reason,
            };
          }
        );
        setAppointments(mappedAppointments);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        toast.error("Không thể tải lịch hẹn. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleConfirmAppointment = async (id: string) => {
    try {
      await confirmAppointment(Number(id));
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: "Đã xác nhận" } : appt
        )
      );
    } catch (error) {
      console.error("Failed to confirm appointment:", error);
      toast.error("Xác nhận lịch hẹn thất bại. Vui lòng thử lại.");
    }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      await cancelAppointment(Number(id));
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: "Đã hủy" } : appt
        )
      );
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      toast.error("Hủy lịch hẹn thất bại. Vui lòng thử lại.");
      alert("Hủy lịch hẹn thất bại. Vui lòng thử lại.");
    }
  };

  const totalAppointments = appointments.length;
  const confirmedAppointments = appointments.filter(
    (appt) => appt.status === "Đã xác nhận"
  ).length;
  const pendingAppointments = appointments.filter(
    (appt) => appt.status === "Chờ xác nhận"
  ).length;
  const cancelAppoinments = appointments.filter(
    (appt) => appt.status === "Đã hủy"
  ).length;

  const filteredAppointments = date
    ? appointments.filter((app) => {
        const appointmentDate = startOfDay(app.date);
        const selectedDate = startOfDay(date);
        return isSameDay(appointmentDate, selectedDate);
      })
    : appointments;

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
          {format(appointment.date, "dd/MM/yyyy", { locale: vi })} -{" "}
          {appointment.time}
        </div>
        <div className="text-sm text-muted-foreground">
          {appointment.treatment}
        </div>
      </div>
      <div className="text-right">
        <div
          className={cn(
            "text-sm",
            appointment.status === "Đã xác nhận"
              ? "text-green-600"
              : appointment.status === "Chờ xác nhận"
              ? "text-yellow-600"
              : "text-red-600"
          )}
        >
          {appointment.status}
        </div>
        <div className="flex gap-2 mt-2">
          {appointment.status === "Chờ xác nhận" && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleConfirmAppointment(appointment.id)}
              >
                Xác nhận
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleCancelAppointment(appointment.id)}
              >
                Hủy
              </Button>
            </>
          )}
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
              value={totalAppointments.toString()}
              icon={CalendarIcon}
              footerLabel="Tổng số lịch hẹn"
              className="bg-gradient-to-br from-blue-50 to-white"
            />
            <StatCard
              title="Đã Xác Nhận"
              value={confirmedAppointments.toString()}
              icon={CalendarIcon}
              footerLabel="Lịch hẹn xác nhận"
              className="bg-gradient-to-br from-green-50 to-white"
            />
            <StatCard
              title="Chờ Xác Nhận"
              value={pendingAppointments.toString()}
              icon={CalendarIcon}
              footerLabel="Lịch hẹn đang chờ"
              className="bg-gradient-to-br from-yellow-50 to-white"
            />
            <StatCard
              title="Đã huỷ"
              value={cancelAppoinments.toString()}
              icon={CalendarIcon}
              footerLabel="Lịch hẹn đã huỷ"
              className="bg-gradient-to-br from-red-50 to-white"
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
                      {date ? format(date, "PPP", { locale: vi }) : "Chọn ngày"}
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
              <h3 className="text-lg font-semibold mb-4">
                {date
                  ? `Lịch hẹn ngày ${format(date, "dd/MM/yyyy", {
                      locale: vi,
                    })}`
                  : "Tất cả lịch hẹn"}
              </h3>
              {isLoading ? (
                <p className="text-muted-foreground">Đang tải lịch hẹn...</p>
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map(renderAppointment)
              ) : (
                <p className="text-muted-foreground">
                  {date
                    ? "Không có lịch hẹn trong ngày này."
                    : "Không có lịch hẹn nào."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
