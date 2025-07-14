import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarCheck, FileText, Stethoscope } from "lucide-react";

const features = [
  {
    icon: Stethoscope,
    title: "Tìm bác sĩ chuyên khoa",
    desc: "Lọc bác sĩ theo chuyên môn, địa điểm và thời gian trống phù hợp.",
  },
  {
    icon: CalendarCheck,
    title: "Quản lý lịch hẹn",
    desc: "Theo dõi, cập nhật và hủy lịch dễ dàng chỉ với vài cú click.",
  },
  {
    icon: FileText,
    title: "Hồ sơ bệnh án điện tử",
    desc: "Lưu trữ và truy cập hồ sơ khám bệnh mọi lúc, bảo mật tuyệt đối.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="flex items-center justify-between px-6 py-4 border-b shadow-sm sticky top-0 z-10 bg-white">
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          🩺 Helicopter
        </h1>
        <div className="space-x-2">
          <Link href="/auth/login">
            <Button variant="outline">Đăng nhập</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Đăng ký</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-b from-blue-50 to-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight max-w-3xl">
          Đặt lịch khám bệnh dễ dàng, mọi lúc mọi nơi
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mb-8">
          Nền tảng kết nối bệnh nhân với bác sĩ một cách nhanh chóng, an toàn và hiệu quả.
        </p>
        <Link href="/auth/login">
          <Button size="lg" className="px-8 py-6 text-base">
            Bắt đầu ngay
          </Button>
        </Link>
      </main>

      <section className="px-6 md:px-16 py-16 bg-muted/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition hover:shadow-xl"
            >
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center py-6 text-sm text-muted-foreground border-t mt-auto">
        {new Date().getFullYear()} HealthCare Booking. All rights reserved.
      </footer>
    </div>
  );
}
