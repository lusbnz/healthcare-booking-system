"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, Calendar, Coffee, AlertCircle } from "lucide-react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { StatCard } from "@/components/common/stat-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type TimeSlot = {
  start: string;
  end: string;
  breakTime?: string;
};

type DaySchedule = {
  label: string;
  slots: TimeSlot[];
};

type ValidationError = {
  index: number;
  message: string;
};

const WEEK_DAYS = [
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
  "Chủ Nhật",
];

const defaultSchedule: Record<string, DaySchedule> = WEEK_DAYS.reduce(
  (acc, day) => {
    acc[day] = {
      label: day,
      slots:
        day === "Thứ Hai"
          ? [{ start: "08:00", end: "12:00", breakTime: "" }]
          : [],
    };
    return acc;
  },
  {} as Record<string, DaySchedule>
);

// Utility to convert time string (HH:MM) to minutes
const timeToMinutes = (time: string): number => {
  if (!time || !/^\d{2}:\d{2}$/.test(time)) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Validate break time format (HH:MM-HH:MM)
const validateBreakTime = (
  breakTime: string | undefined
): { valid: boolean; start: number; end: number } => {
  if (!breakTime) return { valid: true, start: 0, end: 0 };
  const match = breakTime.match(/^(\d{2}:\d{2})-(\d{2}:\d{2})$/);
  if (!match) return { valid: false, start: 0, end: 0 };
  const start = timeToMinutes(match[1]);
  const end = timeToMinutes(match[2]);
  return { valid: start < end, start, end };
};

// Check for overlapping slots
const hasOverlap = (
  slots: TimeSlot[],
  newSlot: TimeSlot,
  currentIndex: number
): boolean => {
  const newStart = timeToMinutes(newSlot.start);
  const newEnd = timeToMinutes(newSlot.end);
  return slots.some((slot, index) => {
    if (index === currentIndex || !slot.start || !slot.end) return false;
    const start = timeToMinutes(slot.start);
    const end = timeToMinutes(slot.end);
    return newStart < end && newEnd > start;
  });
};

export default function AvailabilityPage() {
  const [selectedDay, setSelectedDay] = useState("Thứ Hai");
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const addSlot = () => {
    setSchedule((prev) => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        slots: [
          ...prev[selectedDay].slots,
          { start: "08:00", end: "12:00", breakTime: "" },
        ],
      },
    }));
    setErrors([]);
  };

  const updateSlot = (index: number, field: keyof TimeSlot, value: string) => {
    setSchedule((prev) => {
      const updatedSlots = [...prev[selectedDay].slots];
      updatedSlots[index] = { ...updatedSlots[index], [field]: value };
      return {
        ...prev,
        [selectedDay]: { ...prev[selectedDay], slots: updatedSlots },
      };
    });

    // Validate the updated slot
    const updatedSlots = [...schedule[selectedDay].slots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    const slot = updatedSlots[index];

    const newErrors: ValidationError[] = [];

    // Validate time format and range
    if (field === "start" || field === "end") {
      if (!value.match(/^\d{2}:\d{2}$/)) {
        newErrors.push({ index, message: "Thời gian không hợp lệ (HH:MM)" });
      } else if (slot.start && slot.end) {
        const startMinutes = timeToMinutes(slot.start);
        const endMinutes = timeToMinutes(slot.end);
        if (startMinutes >= endMinutes) {
          newErrors.push({
            index,
            message: "Thời gian bắt đầu phải trước thời gian kết thúc",
          });
        }
        if (hasOverlap(updatedSlots, slot, index)) {
          newErrors.push({ index, message: "Ca làm việc bị trùng lặp" });
        }
      }
    }

    // Validate break time
    if (field === "breakTime" && value) {
      const { valid, start, end } = validateBreakTime(value);
      if (!valid) {
        newErrors.push({
          index,
          message: "Thời gian nghỉ không hợp lệ (HH:MM-HH:MM)",
        });
      } else if (slot.start && slot.end) {
        const slotStart = timeToMinutes(slot.start);
        const slotEnd = timeToMinutes(slot.end);
        if (start < slotStart || end > slotEnd) {
          newErrors.push({
            index,
            message: "Thời gian nghỉ phải nằm trong ca làm việc",
          });
        }
      }
    }

    setErrors(newErrors);
  };

  const removeSlot = (index: number) => {
    setSchedule((prev) => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        slots: prev[selectedDay].slots.filter((_, i) => i !== index),
      },
    }));
    setErrors(errors.filter((err) => err.index !== index));
  };

  const totalHours = Object.values(schedule).reduce((sum, day) => {
    return (
      sum +
      day.slots.reduce((acc, slot) => {
        if (!slot.start || !slot.end) return acc;
        const start = timeToMinutes(slot.start);
        const end = timeToMinutes(slot.end);
        let duration = (end - start) / 60;
        const breakTime = validateBreakTime(slot.breakTime);
        if (breakTime.valid && breakTime.start && breakTime.end) {
          duration -= (breakTime.end - breakTime.start) / 60;
        }
        return acc + (duration > 0 ? duration : 0);
      }, 0)
    );
  }, 0);

  const workingDays = Object.values(schedule).filter(
    (day) => day.slots.length > 0
  ).length;

  const handleSave = async () => {
    const allErrors: ValidationError[] = [];
    WEEK_DAYS.forEach((day) => {
      schedule[day].slots.forEach((slot, index) => {
        if (!slot.start || !slot.end) {
          allErrors.push({ index, message: "Ca làm việc chưa hoàn thiện" });
        } else {
          const start = timeToMinutes(slot.start);
          const end = timeToMinutes(slot.end);
          if (start >= end) {
            allErrors.push({
              index,
              message: "Thời gian bắt đầu phải trước thời gian kết thúc",
            });
          }
          if (hasOverlap(schedule[day].slots, slot, index)) {
            allErrors.push({ index, message: "Ca làm việc bị trùng lặp" });
          }
          if (slot.breakTime) {
            const {
              valid,
              start: breakStart,
              end: breakEnd,
            } = validateBreakTime(slot.breakTime);
            if (!valid) {
              allErrors.push({ index, message: "Thời gian nghỉ không hợp lệ" });
            } else if (breakStart < start || breakEnd > end) {
              allErrors.push({
                index,
                message: "Thời gian nghỉ phải nằm trong ca làm việc",
              });
            }
          }
        }
      });
    });

    if (allErrors.length > 0) {
      setErrors(allErrors);
      setSaveStatus("error");
      return;
    }

    setSaveStatus("saving");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving schedule:", schedule);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setSaveStatus("error");
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
        <div className="container mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Quản Lý Lịch Làm Việc
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Cấu hình thời gian làm việc và nghỉ ngơi hàng tuần
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <StatCard
              title="Tổng Giờ Làm Việc"
              value={`${totalHours.toFixed(1)} giờ`}
              icon={Clock}
              footerLabel="Tổng giờ làm việc/tuần"
              className="bg-gradient-to-br from-blue-50 to-white"
            />
            <StatCard
              title="Ngày Làm Việc"
              value={`${workingDays}/7 ngày`}
              icon={Calendar}
              footerLabel="Số ngày có ca làm"
              className="bg-gradient-to-br from-green-50 to-white"
            />
            <StatCard
              title="Thời Gian Nghỉ"
              value={`${(7 * 8 - totalHours).toFixed(1)} giờ`}
              icon={Coffee}
              footerLabel="Thời gian chưa sử dụng"
              className="bg-gradient-to-br from-yellow-50 to-white"
            />
          </div>

          {saveStatus === "success" && (
            <Alert variant="default" className="border-green-500 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Lưu thành công</AlertTitle>
              <AlertDescription>Lịch làm việc đã được lưu.</AlertDescription>
            </Alert>
          )}
          {saveStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>
                Vui lòng kiểm tra lại các ca làm việc.
              </AlertDescription>
            </Alert>
          )}

          <Tabs
            value={selectedDay}
            onValueChange={setSelectedDay}
            className="space-y-6"
          >
            <div className="md:hidden">
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngày" />
                </SelectTrigger>
                <SelectContent>
                  {WEEK_DAYS.map((day) => (
                    <SelectItem key={day} value={day}>
                      <div className="flex items-center justify-between w-full">
                        <span>{day}</span>
                        {schedule[day].slots.length > 0 && (
                          <Badge variant="default" className="ml-2">
                            {schedule[day].slots.length} ca
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <TabsList className="hidden md:grid grid-cols-7 gap-2">
              {WEEK_DAYS.map((day) => (
                <TabsTrigger
                  key={day}
                  value={day}
                  className="relative flex items-center justify-center"
                >
                  <span>{day}</span>
                  {schedule[day].slots.length > 0 && (
                    <Badge variant="default" className="ml-2">
                      {schedule[day].slots.length} ca
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedDay}>
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="mb-4 sm:mb-0">
                      Cấu Hình - {selectedDay}
                    </CardTitle>
                    <Button
                      size="sm"
                      onClick={addSlot}
                      disabled={errors.length > 0}
                    >
                      + Thêm Ca
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {schedule[selectedDay].slots.map((slot, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4"
                    >
                      <div>
                        <Label>Bắt đầu</Label>
                        <Input
                          type="time"
                          value={slot.start}
                          onChange={(e) =>
                            updateSlot(index, "start", e.target.value)
                          }
                          className={cn(
                            "mt-1",
                            errors.some((err) => err.index === index) &&
                              "border-red-500"
                          )}
                        />
                      </div>
                      <div>
                        <Label>Kết thúc</Label>
                        <Input
                          type="time"
                          value={slot.end}
                          onChange={(e) =>
                            updateSlot(index, "end", e.target.value)
                          }
                          className={cn(
                            "mt-1",
                            errors.some((err) => err.index === index) &&
                              "border-red-500"
                          )}
                        />
                      </div>
                      <div>
                        <Label>Thời gian nghỉ</Label>
                        <Input
                          value={slot.breakTime}
                          onChange={(e) =>
                            updateSlot(index, "breakTime", e.target.value)
                          }
                          placeholder="VD: 12:00-13:00"
                          className={cn(
                            "mt-1",
                            errors.some((err) => err.index === index) &&
                              "border-red-500"
                          )}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSlot(index)}
                          className="w-full sm:w-auto"
                        >
                          Xóa
                        </Button>
                      </div>
                      {errors
                        .filter((err) => err.index === index)
                        .map((err, i) => (
                          <div
                            key={i}
                            className="col-span-4 text-sm text-red-500"
                          >
                            {err.message}
                          </div>
                        ))}
                    </div>
                  ))}
                  <Button
                    className="mt-4 w-full sm:w-auto"
                    onClick={handleSave}
                    disabled={saveStatus === "saving" || errors.length > 0}
                  >
                    {saveStatus === "saving" ? "Đang lưu..." : "Lưu Thay Đổi"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Tổng Quan Tuần</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-4">
                {WEEK_DAYS.map((day) => (
                  <div key={day} className="text-center">
                    <div className="font-semibold mb-2">{day}</div>
                    {schedule[day].slots.length > 0 ? (
                      schedule[day].slots.map((slot, idx) => (
                        <div
                          key={idx}
                          className="bg-primary/10 text-primary rounded-lg p-2 mb-2"
                        >
                          {slot.start} - {slot.end}
                          {slot.breakTime && (
                            <div className="text-xs text-muted-foreground">
                              Nghỉ: {slot.breakTime}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="bg-muted rounded-lg p-2 text-muted-foreground">
                        Nghỉ
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
