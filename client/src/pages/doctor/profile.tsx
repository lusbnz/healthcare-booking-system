import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { toast } from "sonner";
import { changePassword } from "@/api/users";
import { getDoctorProfile, updateDoctorProfile } from "@/api/doctors";

interface IDoctorProfile {
  fullname: string;
  email: string;
  phone_number: string;
  specialty: string;
  address: string;
  license_number: string;
}

export default function DoctorProfile() {
  const [formData, setFormData] = useState<IDoctorProfile>({
    fullname: "",
    email: "",
    phone_number: "",
    address: "",
    specialty: "",
    license_number: "",
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsProfileLoading(true);
        const profile = await getDoctorProfile();
        console.log('profile', profile);
        setFormData({
          fullname: profile.fullname || "",
          email: profile.email || "",
          phone_number: profile.phone_number || "",
          address: profile.address || "",
          specialty: profile.specialty || "",
          license_number: profile.license_number || "",
        });
      } catch (error) {
        toast.error("Failed to load profile data.");
      } finally {
        setIsProfileLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      await updateDoctorProfile({
        fullname: formData.fullname,
        email: formData.email,
        phone_number: formData.phone_number || "",
        specialty: formData?.specialty || "",
        address: formData?.address || "",
        license_number: formData?.license_number || "",
      });
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    if (passwordData.new_password === passwordData.old_password) {
      toast.error("New password must be different from the current password.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Password update failed");
      }
      toast.success("Password updated successfully.");
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to update password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
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
          <div className="container mx-auto p-4">
            {isProfileLoading ? (
              <div>Loading profile...</div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Doctor Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Full Name</Label>
                      <Input
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Email</Label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Phone Number</Label>
                      <Input
                        name="phone_number"
                        value={formData.phone_number || ""}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Address</Label>
                      <Input
                        name="address"
                        value={formData?.address || ""}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Specialty</Label>
                      <Input
                        name="specialty"
                        value={formData?.specialty || ""}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">License Number</Label>
                      <Input
                        name="license_number"
                        value={formData?.license_number || ""}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleUpdateProfile} disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Profile"}
                      </Button>
                    </div>

                    <div className="mt-8 border-t pt-4">
                      <h3 className="text-lg font-semibold">Change Password</h3>
                      <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Current Password</Label>
                          <Input
                            name="old_password"
                            type="password"
                            value={passwordData.old_password}
                            onChange={handlePasswordChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">New Password</Label>
                          <Input
                            name="new_password"
                            type="password"
                            value={passwordData.new_password}
                            onChange={handlePasswordChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Confirm Password</Label>
                          <Input
                            name="confirm_password"
                            type="password"
                            value={passwordData.confirm_password}
                            onChange={handlePasswordChange}
                            className="col-span-3"
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button
                            onClick={handleUpdatePassword}
                            disabled={isLoading}
                          >
                            {isLoading ? "Updating..." : "Update Password"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}