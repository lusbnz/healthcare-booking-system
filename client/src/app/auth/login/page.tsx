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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { api } from "@/lib/api";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const getRoleFromEmail = (email: string): "patient" | "doctor" | "admin" => {
  if (email === "doctor@demo.com") return "doctor";
  if (email === "admin@demo.com") return "admin";
  return "patient";
};

export default function LoginPage() {
  const router = useRouter();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      // await api("/api/users/login", {
      //   method: "POST",
      //   body: JSON.stringify(values),
      // });

      const role = getRoleFromEmail(values.email);
      const user = {
        id: "123",
        full_name: "Nguyễn Văn A",
        role,
      };

      localStorage.setItem("currentUser", JSON.stringify(user));
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Đăng nhập thất bại. Vui lòng thử lại.";

      form.setError("email", { message });
      console.error("errorLogin", message);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      <div className="hidden md:block relative">
        {!isImageLoaded && <Skeleton className="w-full h-full rounded-none" />}
        <Image
          src="/login_banner.jpg"
          alt="Login Illustration"
          fill
          className={`object-cover transition-opacity duration-500 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsImageLoaded(true)}
          priority
        />
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-primary">
              Chào mừng trở lại 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              Đăng nhập để tiếp tục sử dụng nền tảng
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@gmail.com"
                        {...field}
                      />
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

              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground">
            Bạn chưa có tài khoản?{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Đăng ký ngay
            </Link>
          </p>

          <div className="mt-6 border-t pt-4 text-sm text-gray-600 space-y-2 bg-muted/30 p-4 rounded-xl">
            <p className="font-semibold text-center text-muted-foreground">
              Tài khoản dùng thử
            </p>
            <ul className="grid grid-cols-1 gap-2 text-center text-xs sm:text-sm text-muted-foreground">
              <li>
                <strong>Doctor:</strong>
                <code>doctor@demo.com</code>
              </li>
              <li>
                <strong>Patient:</strong>
                <code>patient@demo.com</code>
              </li>
              <li>
                <strong>Admin:</strong>
                <code>admin@demo.com</code>
              </li>
              <li>
                <strong>Mật khẩu:</strong>
                <code>demo123</code>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
