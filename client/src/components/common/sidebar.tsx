"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavLink {
  label: string;
  href: string;
}

interface SidebarProps {
  role: string;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const baseLinks: NavLink[] = [{ label: "Trang chủ", href: "/dashboard" }];

  const patientLinks: NavLink[] = [
    { label: "Tìm bác sĩ", href: "/dashboard/doctors" },
    { label: "Lịch hẹn", href: "/dashboard/appointments" },
    { label: "Hồ sơ khám", href: "/dashboard/medical-records" },
  ];

  const doctorLinks: NavLink[] = [
    { label: "Lịch làm việc", href: "/dashboard/availability" },
    { label: "Bệnh nhân", href: "/dashboard/patients" },
    { label: "Lịch hẹn", href: "/dashboard/my-schedule" },
  ];

  const adminLinks: NavLink[] = [
    { label: "Quản lý người dùng", href: "/dashboard/admin/users" },
    { label: "Duyệt bác sĩ", href: "/dashboard/admin/doctors" },
  ];

  const roleLinks =
    role === "patient"
      ? patientLinks
      : role === "doctor"
      ? doctorLinks
      : adminLinks;

  const links = [...baseLinks, ...roleLinks];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
      </div>
      <ScrollArea className="flex-1">
        <nav className="space-y-1 p-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
              onClick={() => setOpen(false)}
            >
              <span className="truncate">{link.label}</span>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );

  return (
    <>
      <div className="md:hidden p-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-50"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      <aside
        className={cn(
          "hidden md:block w-[240px] bg-white border-r",
          "h-screen sticky top-0"
        )}
      >
        <NavContent />
      </aside>
    </>
  );
}
