"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const registerSchema = z
  .object({
    full_name: z.string().min(2, "Vui lòng nhập họ tên"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    phone: z.string().min(8, "Số điện thoại không hợp lệ"),
    role: z.enum(["patient", "doctor"]),
    specialty: z.string().optional(),
    experience_years: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "doctor") {
      if (!data.specialty || data.specialty.trim() === "") {
        ctx.addIssue({
          path: ["specialty"],
          code: z.ZodIssueCode.custom,
          message: "Vui lòng nhập chuyên khoa",
        });
      }
      if (!data.experience_years || data.experience_years.trim() === "") {
        ctx.addIssue({
          path: ["experience_years"],
          code: z.ZodIssueCode.custom,
          message: "Vui lòng nhập số năm kinh nghiệm",
        });
      }
    }
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      phone: "",
      role: "patient",
    },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (values) => {
    try {
      await api("/api/users/register", {
        method: "POST",
        body: JSON.stringify(values),
      });

      router.push("/auth/login");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Đăng ký thất bại. Vui lòng thử lại.";

      form.setError("email", { message });
      console.error("errorRegister", message);
    }
  };

  const selectedRole = form.watch("role");

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      <div className="hidden md:block relative">
        {!isImageLoaded && <Skeleton className="w-full h-full rounded-none" />}
        <Image
          src="/register_banner.jpg"
          alt="Register Illustration"
          fill
          className={`object-cover transition-opacity duration-500 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsImageLoaded(true)}
          priority
        />
      </div>

      <div className="flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Tạo tài khoản mới
            </h1>
            <p className="text-sm text-muted-foreground">
              Nhanh chóng, bảo mật và dễ sử dụng
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="0123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vai trò</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="patient">Bệnh nhân</SelectItem>
                        <SelectItem value="doctor">Bác sĩ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedRole === "doctor" && (
                <div className="space-y-4 animate-fade-in">
                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chuyên khoa</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nội tiết, Tim mạch, Da liễu..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience_years"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số năm kinh nghiệm</FormLabel>
                        <FormControl>
                          <Input placeholder="VD: 5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Button className="w-full" type="submit">
                Đăng ký
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link
              href="/auth/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
