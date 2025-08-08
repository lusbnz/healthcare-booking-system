"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, useMemo } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import {
  bookAppointment,
  getDoctorsForPatients,
  getAppointments,
} from "@/api/patients";
import { useRouter } from "next/navigation";
import { format, addHours, isBefore, startOfDay, addDays } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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

type Timeslot = {
  startTime: string;
  isAvailable: boolean;
};

type Appointment = {
  id: number;
  patient: number;
  doctor: number;
  timeslot: string;
  reason: string;
  status: string;
  created_at: string;
  updated_at: string;
};

async function getAvailableTimeslots(doctorId: number): Promise<Timeslot[]> {
  const timeslots: Timeslot[] = [];
  const now = new Date();
  const startDate = startOfDay(now);

  const query = `doctor=${doctorId}`;
  const bookedAppointments: Appointment[] = await getAppointments(query);

  const bookedTimeslots = bookedAppointments
    .filter((appt) => appt.status !== "cancelled")
    .map((appt) => {
      const date = new Date(appt.timeslot);
      return date.toISOString().split(".")[0] + "Z";
    });

  for (let day = 0; day < 7; day++) {
    const currentDay = addDays(startDate, day);
    for (let hour = 8; hour <= 17; hour++) {
      const startTime = addHours(currentDay, hour);
      if (isBefore(now, startTime)) {
        const startTimeString = startTime.toISOString().split(".")[0] + "Z";
        const isAvailable = !bookedTimeslots.includes(startTimeString);
        timeslots.push({
          startTime: startTimeString,
          isAvailable,
        });
      }
    }
  }
  return timeslots;
}

export default function FindDoctorPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [addressesFilter, setAddressesFilter] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [selectedTimeslot, setSelectedTimeslot] = useState<string>("");
  const [reason, setReason] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorList: Doctor[] = await getDoctorsForPatients();
        setDoctors(doctorList);
        setAllDoctors(doctorList);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const specialties = useMemo(
    () =>
      Array.from(new Set(allDoctors.map((doctor) => doctor.profile?.specialty))),
    [allDoctors]
  );
  const addresses = useMemo(
    () =>
      Array.from(new Set(allDoctors.map((doctor) => doctor.profile?.address))),
    [allDoctors]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    filterDoctors(e.target.value, specialtyFilter, addressesFilter);
  };

  const handleFilterChange = (
    filterType: "specialty" | "address",
    value: string
  ) => {
    if (filterType === "specialty") setSpecialtyFilter(value);
    if (filterType === "address") setAddressesFilter(value);
    filterDoctors(
      searchTerm,
      filterType === "specialty" ? value : specialtyFilter,
      filterType === "address" ? value : addressesFilter
    );
  };

  const filterDoctors = (
    search: string,
    specialty: string,
    address: string
  ) => {
    const filtered = allDoctors.filter((doctor) => {
      const matchesSearch = doctor.username
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesSpecialty =
        !specialty ||
        specialty === "all" ||
        doctor.profile?.specialty === specialty;
      const matchesAddress =
        !address || address === "all" || doctor.profile?.address === address;
      return matchesSearch && matchesSpecialty && matchesAddress;
    });
    setDoctors(filtered);
  };

  const handleBookAppointment = async (doctorId: number) => {
    setSelectedDoctorId(doctorId);
    try {
      const availableTimeslots = await getAvailableTimeslots(doctorId);
      setTimeslots(availableTimeslots);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch timeslots:", error);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedDoctorId || !selectedTimeslot || !reason) {
      toast.error("Vui lòng chọn thời gian và nhập lý do khám.");
      return;
    }

    try {
      await bookAppointment({
        doctor: selectedDoctorId,
        timeslot: selectedTimeslot,
        reason,
      });
      setIsModalOpen(false);
      setSelectedTimeslot("");
      setReason("");
      router.push("/patient/my-schedule");
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Đặt lịch thất bại. Vui lòng thử lại.");
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
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Tìm Bác Sĩ</h1>
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">
                Tìm theo tên bác sĩ, chuyên khoa...
              </Label>
              <Input
                id="search"
                placeholder="Tìm thông tin bác sĩ..."
                value={searchTerm}
                onChange={handleSearch}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="specialty">Tất cả chuyên khoa</Label>
              <Select
                value={specialtyFilter}
                onValueChange={(value) =>
                  handleFilterChange("specialty", value)
                }
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Tất cả chuyên khoa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả chuyên khoa</SelectItem>
                  {specialties.map((specialty) => {
                    if (!specialty) return null;
                    return (
                      <SelectItem key={specialty} value={specialty!}>
                        {specialty}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="address">Tất cả địa điểm</Label>
              <Select
                value={addressesFilter}
                onValueChange={(value) => handleFilterChange("address", value)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Tất cả địa điểm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả địa điểm</SelectItem>
                  {addresses.map((address) => {
                    if (!address) return null;
                    return (
                      <SelectItem key={address} value={address!}>
                        {address}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <img
                    src={`https://i.pravatar.cc/100?img=${doctor.id}`}
                    alt={doctor.username}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{doctor.username}</CardTitle>
                    <CardDescription>{doctor.email}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Chuyên khoa: {doctor.profile?.specialty || "Chưa xác định"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Địa điểm: {doctor.profile?.address || "Chưa xác định"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Giấy phép:{" "}
                      {doctor.profile?.license_number || "Chưa xác định"}
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleBookAppointment(doctor.id)}
                  >
                    Đặt lịch hẹn
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chọn thời gian đặt lịch</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="timeslot" className="mb-2">
                  Thời gian
                </Label>
                <Select
                  value={selectedTimeslot}
                  onValueChange={setSelectedTimeslot}
                >
                  <SelectTrigger id="timeslot">
                    <SelectValue placeholder="Chọn thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeslots.map((slot) => (
                      <SelectItem
                        key={slot.startTime}
                        value={slot.startTime}
                        disabled={!slot.isAvailable}
                      >
                        {format(new Date(slot.startTime), "dd/MM/yyyy HH:mm")}{" "}
                        {slot.isAvailable ? "" : "(Đã được đặt)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reason" className="mb-2">
                  Lý do khám
                </Label>
                <Input
                  id="reason"
                  placeholder="Nhập lý do khám..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleConfirmBooking}>Xác nhận</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
