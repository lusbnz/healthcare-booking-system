"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/common/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useCurrentUser } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useCurrentUser();

  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen flex overflow-hidden">
      {!isMobile && <Sidebar role={user?.role} collapsed={isCollapsed} />}

      {isMobile && (
        <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
          <Sidebar role={user?.role} collapsed={false} isOverlay />
        </Dialog>
      )}

      <div className="flex-1 relative overflow-auto">
        <div className="p-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (isMobile) {
                setMobileOpen(true);
              } else {
                setIsCollapsed(!isCollapsed);
              }
            }}
          >
            <Menu />
          </Button>
        </div>

        <main className="p-4 pt-0 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
