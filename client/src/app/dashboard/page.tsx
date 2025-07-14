"use client";

import { Users, CalendarCheck, TrendingUp, Star } from "lucide-react";
import { useCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Pie, Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

export default function DashboardHome() {
  const user = useCurrentUser();

  if (!user) return <p>Đang tải...</p>;
  if (user.role === "admin") return <p>Đang cập nhật...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Chào mừng, {user.full_name}!</h2>
        {user.role === "patient" && <Button>Đặt lịch khám</Button>}
      </div>

      {user.role === "patient" ? <PatientDashboard /> : <DoctorDashboard />}
    </div>
  );
}

function PatientDashboard() {
  const stats = [
    { title: "Lịch hẹn sắp tới", value: 2 },
    { title: "Lịch sử khám", value: 3 },
    { title: "Bác sĩ theo dõi", value: 3 },
  ];

  const upcomingAppointments = [
    {
      name: "BS. Trần Hữu Phúc",
      type: "Khám tổng quát",
      time: "15/07/2025 • 09:00 - 09:30",
      status: "Đã xác nhận",
      avatar: "/avatar.jpg",
    },
    {
      name: "BS. Nguyễn Lan",
      type: "Tư vấn tâm lý",
      time: "20/07/2025 • 10:00 - 10:30",
      status: "Chờ xác nhận",
      avatar: "/avatar.jpg",
    },
  ];

  const historyAppointments = [
    {
      name: "BS. Lê Văn Minh",
      type: "Khám nội tiết",
      date: "10/06/2025",
      result: "Hoàn thành",
      avatar: "/avatar.jpg",
    },
    {
      name: "BS. Nguyễn Thị Mai",
      type: "Khám tim mạch",
      date: "05/05/2025",
      result: "Hoàn thành",
      avatar: "/avatar.jpg",
    },
    {
      name: "BS. Trịnh Hùng",
      type: "Khám tiêu hóa",
      date: "01/04/2025",
      result: "Hoàn thành",
      avatar: "/avatar.jpg",
    },
  ];

  const appointmentStatusData = {
    labels: ["Đã xác nhận", "Chờ xác nhận"],
    datasets: [
      {
        data: [
          upcomingAppointments.filter((appt) => appt.status === "Đã xác nhận")
            .length,
          upcomingAppointments.filter((appt) => appt.status === "Chờ xác nhận")
            .length,
        ],
        backgroundColor: ["#265DFA", "#FBBF24"],
        borderColor: ["#1E4FCC", "#D4A01F"],
        borderWidth: 1,
      },
    ],
  };

  const historyByMonth = historyAppointments.reduce((acc, appt) => {
    const month = appt.date.slice(3);
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const historyChartData = {
    labels: Object.keys(historyByMonth),
    datasets: [
      {
        label: "Số lịch hẹn",
        data: Object.values(historyByMonth),
        borderColor: "#265DFA",
        backgroundColor: "#265DFA80",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="p-5 rounded-2xl shadow-sm border border-gray-100 bg-white"
          >
            <p className="text-sm text-muted-foreground">{stat.title}</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">
              {stat.value}
            </h2>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h2 className="text-base font-semibold mb-2">
            Phân bố trạng thái lịch hẹn
          </h2>
          <Card className="p-4 rounded-xl shadow-sm border border-gray-100 bg-white h-64">
            <Pie
              data={appointmentStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                      },
                    },
                  },
                  title: { display: false },
                },
              }}
            />
          </Card>
        </div>
        <div>
          <h2 className="text-base font-semibold mb-2">
            Lịch sử khám theo thời gian
          </h2>
          <Card className="p-4 rounded-xl shadow-sm border border-gray-100 bg-white h-64">
            <Line
              data={historyChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                      },
                    },
                  },
                  title: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Số lịch hẹn",
                      font: { size: 12 },
                    },
                    ticks: { font: { size: 10 } },
                  },
                  x: {
                    title: {
                      display: true,
                      text: "Tháng",
                      font: { size: 12 },
                    },
                    ticks: { font: { size: 10 } },
                  },
                },
              }}
            />
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-1">Lịch hẹn sắp tới</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Các cuộc hẹn được lên lịch trong thời gian tới
        </p>
        <div className="border rounded-lg divide-y">
          {upcomingAppointments.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition"
            >
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={item.avatar} alt={item.name} />
                  <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.type}</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm">{item.time}</p>
                <Badge
                  variant={
                    item.status === "Huỷ"
                      ? "destructive"
                      : item.status === "Hoàn thành"
                      ? "default"
                      : "secondary"
                  }
                >
                  {item.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Lịch sử khám gần đây</h2>
        <div className="border rounded-lg divide-y">
          {upcomingAppointments.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition"
            >
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={item.avatar} alt={item.name} />
                  <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.type}</p>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                {item.time} <br /> {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DoctorDashboard() {
  const stats = [
    {
      title: "Tổng bệnh nhân",
      value: "156",
      icon: <Users className="w-5 h-5 text-[#265DFA]" />,
      bg: "bg-[#E8EFFF]",
      sub: "+15% từ tháng trước",
      progress: 60,
    },
    {
      title: "Hôm nay",
      value: "8",
      icon: <CalendarCheck className="w-5 h-5 text-[#179A5C]" />,
      bg: "bg-[#DFF7EB]",
      sub: "8/12 cuộc hẹn",
      progress: 66,
    },
    {
      title: "Doanh thu tháng",
      value: "45.000.000đ",
      icon: <TrendingUp className="w-5 h-5 text-[#0BA5EC]" />,
      bg: "bg-[#D2F4FF]",
      sub: "+12% từ tháng trước",
      progress: 80,
    },
    {
      title: "Đánh giá",
      value: "4.9",
      icon: <Star className="w-5 h-5 text-[#FBBF24]" />,
      bg: "bg-[#FEF3C7]",
      sub: "Từ 124 đánh giá",
      progress: 95,
    },
  ];

  const appointments = [
    {
      name: "Nguyễn Văn A",
      type: "Khám định kỳ",
      time: "09:00 - 09:30",
      status: "Chờ xác nhận",
      avatar: "/avatar.jpg",
    },
    {
      name: "Trần Thị B",
      type: "Khám hô hấp",
      time: "10:00 - 10:30",
      status: "Huỷ",
      avatar: "/avatar.jpg",
    },
    {
      name: "Lê Minh C",
      type: "Khám tim mạch",
      time: "11:00 - 11:30",
      status: "Hoàn thành",
      avatar: "/avatar.jpg",
    },
  ];

  const recentPatients = [
    {
      name: "Nguyễn Văn A",
      age: 45,
      condition: "Cao huyết áp",
      lastVisit: "2024-01-15",
      avatar: "/avatar.jpg",
    },
    {
      name: "Lê Thị Hồng",
      age: 52,
      condition: "Tiểu đường",
      lastVisit: "2024-01-10",
      avatar: "/avatar.jpg",
    },
  ];

  const appointmentStatusData = {
    labels: ["Chờ xác nhận", "Hoàn thành", "Huỷ"],
    datasets: [
      {
        label: "Số lịch hẹn",
        data: [
          appointments.filter((appt) => appt.status === "Chờ xác nhận").length,
          appointments.filter((appt) => appt.status === "Hoàn thành").length,
          appointments.filter((appt) => appt.status === "Huỷ").length,
        ],
        backgroundColor: ["#FBBF24", "#265DFA", "#EF4444"],
        borderColor: ["#D4A01F", "#1E4FCC", "#DC2626"],
        borderWidth: 1,
      },
    ],
  };

  const conditionData = {
    labels: ["Cao huyết áp", "Tiểu đường"],
    datasets: [
      {
        data: [
          recentPatients.filter((p) => p.condition === "Cao huyết áp").length,
          recentPatients.filter((p) => p.condition === "Tiểu đường").length,
        ],
        backgroundColor: ["#265DFA", "#179A5C"],
        borderColor: ["#1E4FCC", "#127B4A"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((card, i) => (
          <Card
            key={i}
            className="p-5 rounded-2xl shadow-sm border border-gray-100 bg-white space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {card.value}
                </h2>
              </div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${card.bg}`}
              >
                {card.icon}
              </div>
            </div>
            <Progress
              value={card.progress}
              className="h-2 rounded bg-gray-200"
            />
            <p className="text-sm text-gray-500">{card.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h2 className="text-base font-semibold mb-2">
            Trạng thái lịch hẹn hôm nay
          </h2>
          <Card className="p-4 rounded-xl shadow-sm border border-gray-100 bg-white h-64">
            <Bar
              data={appointmentStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                      },
                    },
                  },
                  title: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Số lịch hẹn",
                      font: { size: 12 },
                    },
                    ticks: { font: { size: 10 } },
                  },
                  x: {
                    title: {
                      display: true,
                      text: "Trạng thái",
                      font: { size: 12 },
                    },
                    ticks: { font: { size: 10 } },
                  },
                },
              }}
            />
          </Card>
        </div>
        <div>
          <h2 className="text-base font-semibold mb-2">
            Phân bố tình trạng bệnh nhân
          </h2>
          <Card className="p-4 rounded-xl shadow-sm border border-gray-100 bg-white h-64">
            <Doughnut
              data={conditionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                      },
                    },
                  },
                  title: { display: false },
                },
              }}
            />
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Lịch hẹn hôm nay</h2>
        <div className="border rounded-lg divide-y">
          {appointments.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition"
            >
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={item.avatar} alt={item.name} />
                  <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.type}</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm">{item.time}</p>
                <Badge
                  variant={
                    item.status === "Huỷ"
                      ? "destructive"
                      : item.status === "Hoàn thành"
                      ? "default"
                      : "secondary"
                  }
                >
                  {item.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Bệnh nhân gần đây</h2>
        <div className="border rounded-lg divide-y">
          {recentPatients.map((patient, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition"
            >
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={patient.avatar} alt={patient.name} />
                  <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {patient.age} tuổi • {patient.condition}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Khám lần cuối: {patient.lastVisit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
