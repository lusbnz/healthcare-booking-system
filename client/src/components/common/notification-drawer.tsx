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
  
  interface NotificationsDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
  }
  
  export function NotificationsDrawer({ isOpen, onOpenChange }: NotificationsDrawerProps) {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={onOpenChange}
        direction="right"
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Notifications</DrawerTitle>
            <DrawerDescription>
              View your recent notifications here.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <p className="text-sm text-muted-foreground">
              No new notifications at the moment.
            </p>
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