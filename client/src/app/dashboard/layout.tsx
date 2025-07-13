import { Sidebar } from "@/components/common/sidebar";
import { getCurrentUser } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getCurrentUser();

  return (
    <div className="h-screen grid grid-cols-[240px_1fr]">
      <Sidebar role={user.role} />
      <main className="p-6 overflow-auto">{children}</main>
    </div>
  );
}
