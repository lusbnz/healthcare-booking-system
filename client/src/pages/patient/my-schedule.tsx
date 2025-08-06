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
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatCard, StatCardProps } from "@/components/common/stat-card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { format, isBefore } from "date-fns";
import { vi } from "date-fns/locale";
import {
  getAppointments,
  getDoctorsForPatients,
  updateAppointment,
  getAppointmentDetail, // Import the API function
} from "@/api/patients";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Import shadcn/ui Dialog components

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

export default function MySchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<ApiAppointment | null>(null); // State for selected appointment details
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog open/close
  const router = useRouter();

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
              doctorName: doctorDetails?.username,
              doctor: appt.doctor,
              patient: appt.patient,
              date: format(timeslot, "dd/MM/yyyy", { locale: vi }),
              time: format(timeslot, "HH:mm", { locale: vi }),
              location: doctorDetails?.profile.address,
              phone: doctorDetails?.phone_number,
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

  const statCards: StatCardProps[] = [
    {
      title: "Đã xác nhận",
      value: appointments
        .filter((appt) => appt.status === "confirm")
        .length.toString(),
      footerLabel: "Lịch hẹn đã xác nhận",
      className: "bg-blue-50 hover:shadow-lg transition-shadow",
    },
    {
      title: "Chờ xác nhận",
      value: appointments
        .filter((appt) => appt.status === "pending")
        .length.toString(),
      footerLabel: "Lịch hẹn đang chờ",
      className: "bg-yellow-50 hover:shadow-lg transition-shadow",
    },
    {
      title: "Đã hủy",
      value: appointments
        .filter((appt) => appt.status === "cancelled")
        .length.toString(),
      footerLabel: "Lịch hẹn bị hủy",
      className: "bg-red-50 hover:shadow-lg transition-shadow",
    },
  ];

  const handlecancelledAppointment = async (appointment: Appointment) => {
    try {
      await updateAppointment(appointment.id, {
        id: appointment.id,
        patient: appointment.patient,
        doctor: appointment.doctor,
        status: "cancelled",
        timeslot: appointment.timeslot,
        reason: appointment.reason,
      });
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointment.id ? { ...appt, status: "cancelled" } : appt
        )
      );
    } catch (error) {
      console.error("Cancellation failed:", error);
      alert("Hủy lịch thất bại. Vui lòng thử lại.");
    }
  };

  const handleViewDetails = async (appointmentId: number) => {
    try {
      const appointmentDetails: ApiAppointment = await getAppointmentDetail(
        appointmentId
      );
      setSelectedAppointment(appointmentDetails);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch appointment details:", error);
      alert("Không thể tải chi tiết lịch hẹn. Vui lòng thử lại.");
    }
  };

  const filterAppointmentsByStatus = (status: string) => {
    if (status === "All") return appointments;
    if (status === "Sắp tới") {
      return appointments.filter(
        (appt) =>
          appt.status === "confirm" &&
          isBefore(
            new Date(),
            new Date(appt.date.split("/").reverse().join("-"))
          )
      );
    }
    return appointments.filter((appt) => appt.status === status);
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
              <Button
                variant="outline"
                onClick={() => router.push("/patient/find-doctor")}
              >
                <Calendar className="mr-2 h-4 w-4" /> Đặt lịch mới
              </Button>
            </div>
          </div>

          <Tabs defaultValue="All" className="w-full">
            <TabsList className="flex justify-start gap-2 bg-muted p-1 rounded-md">
              <TabsTrigger value="All" className="flex-1">
                Tất cả
              </TabsTrigger>
              <TabsTrigger value="confirm" className="flex-1">
                Đã xác nhận
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex-1">
                Chờ xác nhận
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="flex-1">
                Huỷ bỏ
              </TabsTrigger>
            </TabsList>
            {["All", "confirm", "pending", "cancelled"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="space-y-4">
                  {filterAppointmentsByStatus(tab).map((appointment) => (
                    <Card
                      key={appointment.id}
                      className="shadow-md hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="flex flex-row items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={`https://i.pravatar.cc/100?img=${appointment.id}`}
                            alt={appointment.doctorName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <CardTitle className="text-md">
                              {appointment.doctorName}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {appointment.date} {appointment.time}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          {appointment.status === "pending" && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {appointment.status}
                            </span>
                          )}
                          {appointment.status === "confirm" && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {appointment.status}
                            </span>
                          )}
                          {appointment.status === "cancelled" && (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {appointment.status}
                            </span>
                          )}
                          <p className="text-sm text-muted-foreground my-2">
                            Lý do: {appointment.reason}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex gap-2">
                          {appointment.status !== "cancelled" &&
                            appointment.status !== "confirm" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handlecancelledAppointment(appointment)
                                }
                              >
                                Hủy lịch
                              </Button>
                            )}
                          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(appointment.id)}
                              >
                                Xem chi tiết
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
                                <DialogDescription>
                                  Thông tin chi tiết về lịch hẹn của bạn
                                </DialogDescription>
                              </DialogHeader>
                              {selectedAppointment ? (
                                <div className="space-y-4">
                                  <p>
                                    <strong>ID:</strong> {selectedAppointment.id}
                                  </p>
                                  <p>
                                    <strong>Bác sĩ:</strong>{" "}
                                    {
                                      doctors.find(
                                        (d) => d.id === selectedAppointment.doctor
                                      )?.username
                                    }
                                  </p>
                                  <p>
                                    <strong>Thời gian:</strong>{" "}
                                    {format(
                                      new Date(selectedAppointment.timeslot),
                                      "dd/MM/yyyy HH:mm",
                                      { locale: vi }
                                    )}
                                  </p>
                                  <p>
                                    <strong>Lý do:</strong>{" "}
                                    {selectedAppointment.reason}
                                  </p>
                                  <p>
                                    <strong>Trạng thái:</strong>{" "}
                                    {selectedAppointment.status}
                                  </p>
                                  <p>
                                    <strong>Ngày tạo:</strong>{" "}
                                    {format(
                                      new Date(selectedAppointment.created_at),
                                      "dd/MM/yyyy HH:mm",
                                      { locale: vi }
                                    )}
                                  </p>
                                  <p>
                                    <strong>Ngày cập nhật:</strong>{" "}
                                    {format(
                                      new Date(selectedAppointment.updated_at),
                                      "dd/MM/yyyy HH:mm",
                                      { locale: vi }
                                    )}
                                  </p>
                                </div>
                              ) : (
                                <p>Đang tải...</p>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}