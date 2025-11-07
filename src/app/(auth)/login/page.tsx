"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button, buttonVariants } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect, Suspense } from "react";
import { authService } from "@/lib/services/auth.service";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next";
import axios from "axios";
import { apiConfig } from "@/lib/api-config";
const formSchema = z.object({
  nickName: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .regex(/^[^\s]+$/, "Username cannot contain spaces"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

function LoginFormContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickName: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  // Load saved credentials if they exist
  useEffect(() => {
    const savedNickName = localStorage.getItem("rememberedNickName");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedNickName && savedRememberMe) {
      form.setValue("nickName", savedNickName);
      form.setValue("rememberMe", true);
    }
  }, [form]);

  const handleAdminLogin = async () => {
    try {
      setIsLoading(true);
      const key = searchParams.get("key");
      let nickName = searchParams.get("id");

      if (nickName) {
        nickName = nickName.replace(/\s/g, " ");
      }

      if (key && nickName) {
        const response = await axios.post(apiConfig.auth.login, {
          nickName: nickName,
          password: key,
          loginBy: 0,
        });
        //const response = await authService.login(nickName, key, 0);

        if (response?.data?.result?.token) {
          setCookie("token", response.data.result.token, { maxAge: 60 * 3});
          router.push(routes.dashboard);
        }
      }
    } catch (error) {
      setLoginError(error instanceof Error? error.message : "Admin login failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const key = searchParams.get("key");
    const nickName = searchParams.get("id");
    if (key && nickName) {
      handleAdminLogin();
    }
  }, [searchParams]);

  const onSubmit = async (values: FormData) => {
    try {
      setIsLoading(true);
      setLoginError("");

      if (values.rememberMe) {
        localStorage.setItem("rememberedNickName", values.nickName);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedNickName");
        localStorage.removeItem("rememberMe");
      }

      const response = await authService.login(
        values.nickName,
        values.password
      );

      if (response?.result?.token) {
        setCookie("token", response.result.token, { maxAge: 60 * 3});
        router.push(routes.dashboard);
      } else {
        setLoginError(
          response.responseMessage || "Invalid username or password"
        );
        setIsLoading(false);
      }
    } catch (error) {
      setLoginError(error instanceof Error? error.message : "Invalid username or password");
    } finally{
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full text-left backdrop-blur-md bg-card/60">
        <CardHeader className="text-center">
          <CardTitle>
            <h1 className="text-2xl">Sign In</h1>
          </CardTitle>
          <CardDescription className="text-foreground text-base mt-1">
            <p>Welcome back to Metatrader</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nickName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="nickName">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your Username"
                        id="nickName"
                        {...field}
                        autoComplete="off"
                        disabled={isLoading}
                        onChange={(e) => {
                          field.onChange(e);
                          form.trigger("nickName");
                          setLoginError(""); // Clear error when user types
                        }}
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
                    <FormLabel htmlFor="password">Password</FormLabel>
                      <div className="relative">
                    <FormControl>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                          disabled={isLoading}
                          autoComplete="current-password"
                          onChange={(e) => {
                            field.onChange(e);
                            form.trigger("password");
                            setLoginError(""); // Clear error when user types
                          }}
                        />
                    </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {loginError && (
                <div className="text-base text-destructive mt-2">
                  {loginError}
                </div>
              )}

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          disabled={isLoading}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            form.trigger("rememberMe");
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <Link
                  href={routes.resetPassword}
                  className="text-sm underline underline-offset-2"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className={buttonVariants({
                  variant: "default",
                  size: "xl",
                  textSize: "xl",
                  className: "w-full cursor-pointer",
                })}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <p className="text-base mt-5">
        Don&apos;t have an account?{" "}
        <Link
          href={routes.register}
          className={buttonVariants({
            variant: "link",
            size: null,
            textSize: null
          })}
        >
          Sign Up
        </Link>
      </p>
    </>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
