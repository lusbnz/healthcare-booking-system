"use client";

import {
  Calendar,
  Users,
  LogOut,
  FileText,
  CalendarClock,
  Stethoscope,
  UserCog,
  Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DialogContent } from "@/components/ui/dialog";
import clsx from "clsx";

type NavLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export function Sidebar({
  role,
  collapsed = false,
  isOverlay = false,
}: {
  role: string;
  collapsed?: boolean;
  isOverlay?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const baseLinks: NavLink[] = [
    {
      label: "Trang chủ",
      href: "/dashboard",
      icon: <Home size={16} />,
    },
  ];

  const patientLinks: NavLink[] = [
    {
      label: "Tìm bác sĩ",
      href: "/dashboard/doctors",
      icon: <Stethoscope size={16} />,
    },
    {
      label: "Lịch hẹn",
      href: "/dashboard/appointments",
      icon: <Calendar size={16} />,
    },
    {
      label: "Hồ sơ khám",
      href: "/dashboard/medical-records",
      icon: <FileText size={16} />,
    },
  ];

  const doctorLinks: NavLink[] = [
    {
      label: "Lịch làm việc",
      href: "/dashboard/availability",
      icon: <CalendarClock size={16} />,
    },
    {
      label: "Bệnh nhân",
      href: "/dashboard/patients",
      icon: <Users size={16} />,
    },
    {
      label: "Lịch hẹn",
      href: "/dashboard/my-schedule",
      icon: <Calendar size={16} />,
    },
  ];

  const adminLinks: NavLink[] = [
    {
      label: "Quản lý người dùng",
      href: "/dashboard/admin/users",
      icon: <UserCog size={16} />,
    },
    {
      label: "Duyệt bác sĩ",
      href: "/dashboard/admin/doctors",
      icon: <Stethoscope size={16} />,
    },
  ];

  const customLinks =
    role === "patient"
      ? patientLinks
      : role === "doctor"
      ? doctorLinks
      : adminLinks;

  const links = [...baseLinks, ...customLinks];

  const SidebarContent = (
    <aside
      className={clsx(
        "flex flex-col h-full bg-white px-4 py-4 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[240px]",
        isOverlay ? "h-screen" : "border-r"
      )}
    >
      <div className="flex items-center justify-between mb-6">
        {!collapsed && (
          <Link href="/dashboard" className="font-bold text-lg">
            Helicopter
          </Link>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "",
                collapsed ? "justify-center px-0" : ""
              )}
            >
              {link.icon}
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={clsx(
                "w-full flex items-center px-3 py-2",
                collapsed ? "justify-center px-0" : "justify-between"
              )}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <span className="text-sm font-medium">Tài khoản</span>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-full">
            <DropdownMenuItem
              className="flex items-center gap-2 text-red-600"
              onClick={() => router.push("/auth/login")}
            >
              <LogOut size={16} />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );

  return isOverlay ? (
    <DialogContent className="p-0 w-[240px] rounded-none border-none left-[120px]">
      {SidebarContent}
    </DialogContent>
  ) : (
    SidebarContent
  );
}
