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
import { Star } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  hospital: string;
  location: string;
  availability: string[];
  fee: number;
};

const initialDoctors: Doctor[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    specialty: "Bệnh viện Bạch Mai",
    rating: 4.8,
    reviews: 156,
    hospital: "Bệnh viện Bạch Mai",
    location: "Hà Nội",
    availability: ["09:00-10:30", "14:00-15:30"],
    fee: 600000,
  },
  {
    id: 2,
    name: "Trần Thị B",
    specialty: "Bệnh viện Chợ Rẫy",
    rating: 4.9,
    reviews: 203,
    hospital: "Bệnh viện Chợ Rẫy",
    location: "TP. Hồ Chí Minh",
    availability: ["09:00-10:30", "13:30-15:00"],
    fee: 400000,
  },
  {
    id: 3,
    name: "Lê Văn C",
    specialty: "Bệnh viện Đại học Y Hà Nội",
    rating: 4.7,
    reviews: 89,
    hospital: "Bệnh viện Đại học Y Hà Nội",
    location: "Hà Nội",
    availability: ["10:00-11:30", "15:00-16:30"],
    fee: 500000,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    specialty: "Bệnh viện Nhi Trung ương",
    rating: 4.9,
    reviews: 267,
    hospital: "Bệnh viện Nhi Trung ương",
    location: "Hà Nội",
    availability: ["08:30-10:00", "14:00-15:30"],
    fee: 550000,
  },
];

export default function FindDoctorPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [doctors, setDoctors] = useState(initialDoctors);
  //   const { bookAppointment } = useAuth();
  const router = useRouter();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    filterDoctors(e.target.value, specialtyFilter, locationFilter);
  };

  const handleFilterChange = (
    filterType: "specialty" | "location",
    value: string
  ) => {
    if (filterType === "specialty") setSpecialtyFilter(value);
    if (filterType === "location") setLocationFilter(value);
    filterDoctors(
      searchTerm,
      value,
      filterType === "location" ? value : locationFilter
    );
  };

  const filterDoctors = (
    search: string,
    specialty: string,
    location: string
  ) => {
    // let filtered = initialDoctors.filter((doctor) => {
    //   const matchesSearch = doctor.name
    //     .toLowerCase()
    //     .includes(search.toLowerCase());
    //   const matchesSpecialty = !specialty || doctor.specialty === specialty;
    //   const matchesLocation = !location || doctor.location === location;
    //   return matchesSearch && matchesSpecialty && matchesLocation;
    // });
    // setDoctors(filtered);
    setDoctors(initialDoctors);
  };

  const handleBookAppointment = async (doctorId: number) => {
    // try {
    //   await bookAppointment(doctorId);
    //   router.push("/patient/appointments");
    // } catch (error) {
    //   console.error("Booking failed:", error);
    // }
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
                  <SelectItem value="Bệnh viện Bạch Mai">Bạch Mai</SelectItem>
                  <SelectItem value="Bệnh viện Chợ Rẫy">Chợ Rẫy</SelectItem>
                  <SelectItem value="Bệnh viện Đại học Y Hà Nội">
                    ĐHYHN
                  </SelectItem>
                  <SelectItem value="Bệnh viện Nhi Trung ương">
                    Nhi TW
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="location">Tất cả địa điểm</Label>
              <Select
                value={locationFilter}
                onValueChange={(value) => handleFilterChange("location", value)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Tất cả địa điểm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả địa điểm</SelectItem>
                  <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                  <SelectItem value="TP. Hồ Chí Minh">TP. HCM</SelectItem>
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
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(doctor.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {doctor.rating} ({doctor.reviews})
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Bệnh viện: {doctor.hospital}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Địa điểm: {doctor.location}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Khung giờ còn trống:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {doctor.availability.map((slot, index) => (
                        <span
                          key={index}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm">
                    Phí tư vấn: {doctor.fee.toLocaleString("vi-VN")} VND
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
      </SidebarInset>
    </SidebarProvider>
  );
}
