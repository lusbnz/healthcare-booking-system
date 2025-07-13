import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 shadow">
        <h1 className="text-2xl font-bold text-primary">Helicopter</h1>
        <div className="space-x-2">
          <Link href="/auth/login">
            <Button variant="outline">Đăng nhập</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Đăng ký</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-muted">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Đặt lịch khám bệnh dễ dàng, mọi lúc mọi nơi
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mb-8">
          Nền tảng kết nối bệnh nhân với bác sĩ một cách nhanh chóng, an toàn và hiệu quả.
        </p>
        <Link href="/auth/login">
          <Button size="lg">Bắt đầu ngay</Button>
        </Link>
      </main>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 py-16">
        {[
          {
            title: "Tìm bác sĩ chuyên khoa",
            desc: "Lọc bác sĩ theo chuyên môn, địa điểm và thời gian trống.",
          },
          {
            title: "Quản lý lịch hẹn",
            desc: "Theo dõi, cập nhật và hủy lịch dễ dàng chỉ với vài cú click.",
          },
          {
            title: "Hồ sơ bệnh án điện tử",
            desc: "Lưu trữ và truy cập hồ sơ khám bệnh mọi lúc.",
          },
        ].map((feature, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-6 space-y-2">
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.desc}</p>
          </div>
        ))}
      </section>

      <footer className="text-center py-6 text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} HealthCare Booking. All rights reserved.
      </footer>
    </div>
  );
}
