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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { StatCard, StatCardProps } from "@/components/common/stat-card";

type MedicalRecord = {
  id: number;
  date: string;
  type: string;
  doctor: string;
  status: "Hoàn thành" | "Chờ xử lý" | "Đã hủy";
  fileUrl?: string;
  notes?: string;
};

const initialRecords: MedicalRecord[] = [
  {
    id: 1,
    date: "02/08/2025",
    type: "Xét nghiệm máu",
    doctor: "Nguyễn Văn A",
    status: "Hoàn thành",
    fileUrl: "record_001.pdf",
    notes: "Kết quả bình thường, theo dõi định kỳ.",
  },
  {
    id: 2,
    date: "01/08/2025",
    type: "Siêu âm bụng",
    doctor: "Trần Thị B",
    status: "Chờ xử lý",
    notes: "Chờ kết quả từ phòng xét nghiệm.",
  },
  {
    id: 3,
    date: "30/07/2025",
    type: "Khám tim mạch",
    doctor: "Lê Văn C",
    status: "Hoàn thành",
    fileUrl: "record_002.pdf",
    notes: "Đề nghị tái khám sau 1 tháng.",
  },
  {
    id: 4,
    date: "28/07/2025",
    type: "X-quang phổi",
    doctor: "Phạm Thị D",
    status: "Đã hủy",
    notes: "Hủy do bệnh nhân vắng mặt.",
  },
];

const statCards: StatCardProps[] = [
  {
    title: "Hoàn thành",
    value: "2",
    badge: { value: "+1", trend: "up" },
    footerLabel: "Hồ sơ đã hoàn tất",
    // icon: Download,
    className: "bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-all",
  },
  {
    title: "Chờ xử lý",
    value: "1",
    footerLabel: "Đang chờ kết quả",
    // icon: Download,
    className: "bg-gradient-to-br from-yellow-50 to-white hover:shadow-lg transition-all",
  },
  {
    title: "Đã hủy",
    value: "1",
    footerLabel: "Hồ sơ bị hủy",
    // icon: Download,
    className: "bg-gradient-to-br from-red-50 to-white hover:shadow-lg transition-all",
  },
];

export default function MedicalRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [records, setRecords] = useState(initialRecords);
  const router = useRouter();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    filterRecords(e.target.value, statusFilter);
  };

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    filterRecords(searchTerm, value);
  };

  const filterRecords = (search: string, status: string) => {
    setRecords(initialRecords);
  };

  const handleDownload = async (fileUrl: string) => {
    // Placeholder for download logic
  };

  const handleViewDetails = (recordId: number) => {
    router.push(`/patient/record-detail?id=${recordId}`);
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
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white shadow-xl">
            <h1 className="text-3xl font-bold tracking-tight">Hồ Sơ Y Tế</h1>
            <p className="mt-2 text-lg opacity-90">Theo dõi và quản lý hồ sơ y tế của bạn một cách dễ dàng</p>
          </div>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
            <div className="flex-1">
              <Label htmlFor="search" className="mb-2 block text-sm font-medium text-gray-700">
                Tìm kiếm
              </Label>
              <Input
                id="search"
                placeholder="Tìm theo loại xét nghiệm hoặc bác sĩ..."
                value={searchTerm}
                onChange={handleSearch}
                className="h-10 rounded-md border-gray-200 text-base shadow-sm transition-all focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="w-full sm:w-48">
              <Label htmlFor="status" className="mb-2 block text-sm font-medium text-gray-700">
                Trạng thái
              </Label>
              <Select value={statusFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="h-10 rounded-md border-gray-200 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent className="rounded-md border-gray-200 text-base shadow-sm">
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                  <SelectItem value="Chờ xử lý">Chờ xử lý</SelectItem>
                  <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {records.map((record) => (
              <Card
                key={record.id}
                className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <CardHeader className="bg-gradient-to-br from-gray-50 to-white p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 shadow-sm transition-transform group-hover:scale-105">
                      <span className="text-lg font-semibold text-indigo-600">R{record.id}</span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900">{record.type}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        {record.date} • {record.doctor}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    // variant={
                    //   record.status === "Hoàn thành"
                    //     ? "success"
                    //     : record.status === "Chờ xử lý"
                    //     ? "warning"
                    //     : "destructive"
                    // }
                    className="mt-3 inline-block px-3 py-1 text-sm"
                  >
                    {record.status}
                  </Badge>
                </CardHeader>
                <CardContent className="p-6">
                  {record.notes && (
                    <p className="mb-4 rounded-md bg-gray-50 p-3 text-sm text-gray-600 shadow-inner">
                      {record.notes}
                    </p>
                  )}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                      onClick={() => handleViewDetails(record.id)}
                    >
                      Xem chi tiết
                    </Button>
                    {record.fileUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => handleDownload(record.fileUrl!)}
                      >
                        <Download className="mr-2 h-4 w-4" /> Tải xuống
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}