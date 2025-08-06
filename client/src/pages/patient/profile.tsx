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
import { getUserProfile, updatePatientProfile } from "@/api/patients";

interface IPatientProfile {
  id: number;
  username: string;
  fullname: string;
  email: string;
  phone_number: string | null;
  user_type: "doctor" | "patient";
  profile: {
    address: string;
    date_of_birth: string;
    insurance_number: string;
  } | null;
}

export default function PatientProfile() {
  const [formData, setFormData] = useState<IPatientProfile>({
    id: 0,
    username: "",
    fullname: "",
    email: "",
    phone_number: null,
    user_type: "patient",
    profile: {
      address: "",
      date_of_birth: "",
      insurance_number: "",
    },
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
        const profile = await getUserProfile();
        setFormData({
          id: profile.id || 0,
          username: profile.username || "",
          fullname: profile.fullname || "",
          email: profile.email || "",
          phone_number: profile.phone_number || null,
          user_type: profile.user_type || "patient",
          profile: {
            address: profile.profile?.address || "",
            date_of_birth: profile.profile?.date_of_birth || "",
            insurance_number: profile.profile?.insurance_number || "",
          },
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
    if (["address", "date_of_birth", "insurance_number"].includes(name)) {
        setFormData((prev) => {
          const profile = prev.profile ?? {
            address: "",
            date_of_birth: "",
            insurance_number: "",
          };
          return {
            ...prev,
            profile: {
              ...profile,
              [name]: value,
            },
          };
        });
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      // Ensure profile is not null before sending
      if (!formData.profile) {
        throw new Error("Profile data is missing");
      }
      await updatePatientProfile({
        id: formData.id,
        username: formData.username,
        fullname: formData.fullname,
        email: formData.email,
        phone_number: formData.phone_number,
        user_type: formData.user_type,
        profile: {
          address: formData.profile.address || "",
          date_of_birth: formData.profile.date_of_birth || "",
          insurance_number: formData.profile.insurance_number || "",
        },
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
                  <CardTitle>Patient Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Username</Label>
                      <Input
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="col-span-3"
                        disabled
                      />
                    </div>
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
                        value={formData.profile?.address || ""}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Date of Birth</Label>
                      <Input
                        name="date_of_birth"
                        type="date"
                        value={formData.profile?.date_of_birth || ""}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Insurance Number</Label>
                      <Input
                        name="insurance_number"
                        value={formData.profile?.insurance_number || ""}
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