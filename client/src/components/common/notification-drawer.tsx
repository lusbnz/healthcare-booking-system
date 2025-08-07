import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllNotifications } from "@/api/notifications";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

interface Notification {
  id: number;
  recipient: number;
  message: string;
  read: boolean;
  created_at: string;
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsDrawer({
  isOpen,
  onOpenChange,
}: NotificationsDrawerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {user} = useAuth()

  useEffect(() => {
    if (isOpen) {
      const fetchNotifications = async () => {
        setIsLoading(true);
        try {
          const response = await getAllNotifications();
          setNotifications(response);
        } catch (err) {
          setError("Error fetching notifications");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchNotifications();
    }
  }, [isOpen]);

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Notifications</DrawerTitle>
          <DrawerDescription>
            View your recent notifications here.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading notifications...
            </p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No new notifications at the moment.
            </p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`p-2 rounded-md ${
                    notification.read ? "bg-muted" : "bg-primary/10"
                  }`}
                  onClick={() => {
                    router.push(`/${user?.user_type}/my-schedule`)
                  }}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-sm">{notification.message}</p>
                    {!notification.read && (
                      <Badge variant="secondary">Unread</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
