"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button, buttonVariants } from "@/components/ui/button";

import { useState, useEffect, useContext } from "react";
import { formatPrice } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { UserContext } from "@/lib/usercontent";
import { Card, CardContent } from "@/components/ui/card";
import {
  Phone,
  Mail,
  Calendar,
  User,
  Hash,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { apiConfig } from "@/lib/api-config";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const profileFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    ),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  mobileNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[0-9]{7,12}$/,
      "Please enter a valid phone number (7-12 digits, no spaces or hyphens)"
    ),
});

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    password: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      )
      .regex(/^[^\s]+$/, "Password cannot contain spaces"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine(
    (data) => {
      if (data.password && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.currentPassword === data.password) {
        return false;
      }
      return true;
    },
    {
      message: "New password must be different from current password",
      path: ["password"],
    }
  );

type ProfileFormData = z.infer<typeof profileFormSchema>;
type PasswordFormData = z.infer<typeof passwordFormSchema>;

const otpFormSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

type OtpFormData = z.infer<typeof otpFormSchema>;

export default function UserProfile() {
  const { profile, userRank, setProfile, userToken } =
    useContext(UserContext) || {};
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [formError, setFormError] = useState<string>("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [verifiedOtp, setVerifiedOtp] = useState<string>("");
  const [showPasswordSuccessDialog, setShowPasswordSuccessDialog] =
    useState(false);
  const initials = `${profile?.userResult?.firstName?.[0] || ""}${
    profile?.userResult?.lastName?.[0] || ""
  }`;
  const [pendingPasswordValues, setPendingPasswordValues] =
    useState<PasswordFormData | null>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile?.userResult?.firstName || "",
      lastName: profile?.userResult?.lastName || "",
      email: profile?.userResult?.email || "",
      mobileNumber: profile?.userResult?.mobileNumber || "",
    },
    mode: "onChange",
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  });

  // Update form values when profile changes
  useEffect(() => {
    if (profile?.userResult) {
      profileForm.reset({
        firstName: profile.userResult.firstName || "",
        lastName: profile.userResult.lastName || "",
        email: profile.userResult.email || "",
        mobileNumber: profile.userResult.mobileNumber || "",
      });
    }
  }, [profile, profileForm]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const rankToImage = {
    Bronze: "/ranks/bronze.png",
    Silver: "/ranks/silver.png",
    Gold: "/ranks/gold.png",
    Platinum: "/ranks/platinum.png",
    Diamond: "/ranks/diamond.png",
    King: "/ranks/king.png",
    "Royal King": "/ranks/royalKing.png",
  };

  const rankImage =
    userRank && userRank.toString() !== "Not Available"
      ? rankToImage[userRank as unknown as keyof typeof rankToImage]
      : null;

  // Format date with proper type checking
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd-MM-yy | HH:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const onSubmit = async (values: ProfileFormData) => {
    try {
      setIsLoading(true);
      setFormError("");

      const requestData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        mobileNumber: values.mobileNumber,
      };

      const response = await axios.put(
        apiConfig.profile.updateProfile,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            token: userToken,
          },
        }
      );

      if (response.data.result) {
        if (setProfile && profile?.userResult) {
          setProfile({
            ...profile,
            userResult: {
              ...profile.userResult,
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              mobileNumber: values.mobileNumber,
            },
          });
        }
        setIsEditing(false);
        setShowSuccessDialog(true);
      } else {
        setFormError(
          response.data.responseMessage || "Failed to update profile"
        );
        toast.error(
          response.data.responseMessage || "Failed to update profile"
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setFormError(error.response?.data?.responseMessage);
        toast.error(
          error.response?.data?.responseMessage ||
            "An error occurred while updating profile"
        );
      } else {
        toast.error("An error occurred while updating profile");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileCancel = () => {
    setIsEditing(false);
    setFormError("");
    // Reset form to original values
    if (profile?.userResult) {
      profileForm.reset({
        firstName: profile.userResult.firstName || "",
        lastName: profile.userResult.lastName || "",
        email: profile.userResult.email || "",
        mobileNumber: profile.userResult.mobileNumber || "",
      });
    }
  };

  const handlePasswordCancel = () => {
    setFormError("");
    // Reset password form and OTP state
    passwordForm.reset({
      currentPassword: "",
      password: "",
      confirmPassword: "",
    });
    setIsOtpVerified(false);
    setVerifiedOtp("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowCurrentPassword(false);
    setCountdown(0);
  };

  const handleResendOTP = async () => {
    if (isResendDisabled || isOtpVerified) return;

    try {
      setIsOtpLoading(true);
      const response = await axios.post(
        apiConfig.auth.getOtpChangeTransaction,
        {
          nickName: profile?.userResult?.nickName,
        }
      );

      if (response.data.statusCode === 200) {
        toast.success("OTP resent successfully");
        setCountdown(90);
        setIsResendDisabled(true);
      } else {
        toast.error(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to resend OTP"
      );
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleOtpSubmit = async (values: OtpFormData) => {
    try {
      setOtpLoading(true);
      const response = await axios.put(
        apiConfig.auth.userChangePassword,
        {
          otp: values.otp,
          oldPassword: pendingPasswordValues?.currentPassword,
          newPassword: pendingPasswordValues?.password,
          confirmPassword: pendingPasswordValues?.confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: userToken,
          },
        }
      );

      if (response.data.statusCode === 200) {
        setIsOtpVerified(true);
        setVerifiedOtp(values.otp);
        setShowOtpDialog(false);
        setShowPasswordSuccessDialog(true);
        //toast.success("OTP verified successfully");
      } else {
        toast.error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        //setFormError(error.response?.data?.responseMessage);
        toast.error(
          error.response?.data?.responseMessage ||
            "An error occurred while updating profile"
        );
      } else {
        toast.error("An error occurred while updating profile");
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const onPassword = async (values: PasswordFormData) => {
    if (!isOtpVerified) {
      if (isResendDisabled) {
        setCountdown(0);
        toast.error("Please wait before requesting a new OTP");
        return;
      }

      try {
        setIsPasswordLoading(true);
        const response = await axios.post(
          apiConfig.auth.getOtpChangeTransaction,
          {
            nickName: profile?.userResult?.nickName,
          },
          {
            headers: {
              "Content-Type": "application/json",
              token: userToken,
            },
          }
        );

        if (response.data.statusCode === 200) {
          setShowOtpDialog(true);
          setCountdown(90);
          setIsResendDisabled(true);
          setPendingPasswordValues(values);
          toast.success("OTP sent successfully");
        } else {
          toast.error(response.data.message || "Failed to send OTP");
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to send OTP"
        );
        setCountdown(0);
      } finally {
        setIsPasswordLoading(false);
      }
      return;
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-5 p-4">
        <div className="flex-1">
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3">
            User Profile
          </h2>
        </div>
        <div className="flex-1 pb-5">
          <div className="border-2 border-primary p-5 py-8 lg:p-10 bg-card rounded-lg lg:rounded-2xl flex gap-16 flex-col lg:flex-row">
            <div className="flex flex-col gap-4 flex-wrap">
              <div className="flex flex-col justify-center items-center gap-5">
                <div className="relative">
                  <Avatar className="size-30 lg:size-40 rounded-full">
                    {profile?.userResult && (
                      <AvatarImage
                        src="/avatar.jpg"
                        alt={profile.userResult.nickName}
                      />
                    )}
                    <AvatarFallback className="rounded-full">
                      {profile?.userResult ? initials : "..."}
                    </AvatarFallback>
                  </Avatar>
                  {rankImage && (
                    <Avatar className="size-10 lg:size-14 absolute top-0 lg:-top-5 -right-10 z-1 rounded-null">
                      <AvatarImage
                        src={rankImage}
                        alt={userRank?.toString() || "Rank"}
                      />
                      <AvatarFallback className="rounded-lg">
                        {userRank?.toString() || "No"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="grid flex-1 text-center text-xl lg:text-2xl leading-tight">
                  <span className="font-bold text-primary">
                    {profile?.userResult?.nickName || "Loading..."}
                  </span>
                  <span className="text-sm lg:text-base mt-1">
                    {profile?.userResult
                      ? `${profile.userResult.firstName} ${profile.userResult.lastName}`
                      : "Loading..."}
                  </span>
                  <span
                    className={`py-1 px-2 rounded-sm text-xs inline-flex w-fit font-semibold justify-center mt-2 mx-auto ${
                      profile?.userResult?.planSubscription === true
                        ? "bg-green-600"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {profile?.userResult?.planSubscription
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-4">
                <h3 className="text-primary text-lg font-semibold">
                  {isEditing ? "Account Edit" : " Account Details"}
                </h3>
                {!isEditing && (
                  <Button variant="link" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                )}
              </div>
              <div className="grid gap-4">
                {isEditing ? (
                  <Card className="bg-transparent border-0 rounded-none p-0 shadow-none">
                    <CardContent className="p-0">
                      <Form {...profileForm}>
                        <form
                          onSubmit={profileForm.handleSubmit(onSubmit)}
                          className="space-y-4"
                        >
                          {formError && (
                            <div className="text-sm text-red-500 mb-4">
                              {formError}
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={profileForm.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={isLoading}
                                      autoComplete="given-name"
                                      autoCorrect="off"
                                      autoCapitalize="off"
                                      spellCheck="false"
                                      onChange={(e) => {
                                        field.onChange(e);
                                        profileForm.trigger("firstName");
                                        setFormError("");
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={isLoading}
                                      autoComplete="family-name"
                                      autoCorrect="off"
                                      autoCapitalize="off"
                                      spellCheck="false"
                                      onChange={(e) => {
                                        field.onChange(e);
                                        profileForm.trigger("lastName");
                                        setFormError("");
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="email"
                                    //disabled={isLoading}
                                    autoComplete="email"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    readOnly
                                    disabled
                                    onChange={(e) => {
                                      field.onChange(e);
                                      profileForm.trigger("email");
                                      setFormError("");
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="mobileNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="tel"
                                    disabled={isLoading}
                                    autoComplete="tel"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    onChange={(e) => {
                                      field.onChange(e);
                                      profileForm.trigger("mobileNumber");
                                      setFormError("");
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex gap-2 justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              size="lg"
                              onClick={handleProfileCancel}
                              disabled={isLoading}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={isLoading}
                              variant="primary"
                              size="lg"
                            >
                              {isLoading ? "Saving..." : "Save"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-transparent border-0 rounded-none p-0 shadow-none">
                    <CardContent className="p-0">
                      <div className="grid gap-4 xl:grid-cols-2">
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-gray-500">Mobile</p>
                            <p className="font-semibold">
                              {profile?.userResult?.mobileNumber}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-semibold">
                              {profile?.userResult?.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Register Date
                            </p>
                            <p className="font-semibold">
                              {formatDate(profile?.userResult?.createdAt)}
                            </p>
                          </div>
                        </div>
                        {/* <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Activation Date
                            </p>
                            <p className="font-semibold">
                              {formatDate(profile?.userResult?.activationDate)}
                            </p>
                          </div>
                        </div> */}
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-semibold">
                              {profile?.userResult?.planSubscription
                                ? "Active"
                                : "Inactive"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Hash className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-gray-500">IVT ID</p>
                            <p className="font-semibold">
                              {profile?.userResult?.ivtId || "NA"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-gray-500">Sponsor</p>
                            <p className="font-semibold">
                              {profile?.userResult?.invitationCode !==
                              "Admin123"
                                ? profile?.userResult?.invitationCode
                                : "NA"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
          <div className="border-2 border-primary p-5 py-8 lg:p-10 bg-card rounded-lg lg:rounded-2xl flex gap-16 flex-col lg:flex-row mt-6">
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(onPassword)}
                className="w-full"
              >
                {formError && (
                  <div className="text-sm text-red-500 mb-4">{formError}</div>
                )}
                <div className="mb-6">
                  <h4 className="text-primary text-lg font-semibold mb-4">
                    Change Password
                  </h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Leave blank if you don't want to change your password
                  </p>
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormLabel>Current Password</FormLabel>
                          <div className="relative">
                        <FormControl>
                            <Input
                              {...field}
                              type={showCurrentPassword ? "text" : "password"}
                              disabled={isPasswordLoading}
                              autoComplete="current-password"
                              autoCorrect="off"
                              autoCapitalize="off"
                              spellCheck="false"
                              onChange={(e) => {
                                field.onChange(e);
                                passwordForm.trigger("currentPassword");
                                setFormError("");
                              }}
                            />
                        </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormLabel>New Password</FormLabel>
                          <div className="relative">
                        <FormControl>
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              disabled={isPasswordLoading}
                              autoComplete="new-password"
                              autoCorrect="off"
                              autoCapitalize="off"
                              spellCheck="false"
                              onChange={(e) => {
                                field.onChange(e);
                                passwordForm.trigger("password");
                                setFormError("");
                              }}
                            />
                        </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormLabel>Confirm New Password</FormLabel>
                          <div className="relative">
                        <FormControl>
                            <Input
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              disabled={isPasswordLoading}
                              autoComplete="new-password"
                              autoCorrect="off"
                              autoCapitalize="off"
                              spellCheck="false"
                              onChange={(e) => {
                                field.onChange(e);
                                passwordForm.trigger("confirmPassword");
                                setFormError("");
                              }}
                            />
                        </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="reset"
                    variant="outline"
                    size="lg"
                    onClick={handlePasswordCancel}
                    disabled={isPasswordLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPasswordLoading}
                    variant="primary"
                    size="lg"
                  >
                    {isPasswordLoading
                      ? "Sending..."
                      : isOtpVerified
                      ? "Submit"
                      : "Send OTP"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px] [&>button]:hidden" onPointerDownOutside={(event) => {event.preventDefault()}}>
          <DialogHeader>
            <DialogTitle className="text-primary">Profile Updated</DialogTitle>
            <DialogDescription>
              Your profile has been successfully updated.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button
              variant="primary"
              onClick={() => setShowSuccessDialog(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* OTP Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="sm:max-w-[425px] [&>button]:hidden" onPointerDownOutside={(event) => {event.preventDefault()}}>
          <DialogHeader className="mb-4">
            <DialogTitle className="text-primary">Verify OTP</DialogTitle>
            <DialogDescription>
              Please enter the 6-digit OTP sent to your email.
            </DialogDescription>
          </DialogHeader>
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
              className="space-y-6"
            >
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          otpForm.trigger("otp");
                        }}
                        className="gap-2"
                        disabled={isOtpLoading}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="reset"
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    setShowOtpDialog(false);
                    otpForm.reset();
                    setFormError("");
                    handlePasswordCancel();
                    setCountdown(0);
                  }}
                  disabled={isOtpLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isOtpLoading}
                >
                  {isOtpLoading ? "Verifying..." : "Verify OTP"}
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Didn't receive the code?{" "}
              {isResendDisabled ? (
                <span className="text-muted-foreground">
                  Resend available in {countdown} seconds
                </span>
              ) : (
                <Button
                  variant="link"
                  onClick={handleResendOTP}
                  disabled={isOtpLoading}
                  className="p-0 h-auto"
                >
                  {isOtpLoading ? "Sending..." : "Resend OTP"}
                </Button>
              )}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Success Dialog */}
      <Dialog
        open={showPasswordSuccessDialog}
        onOpenChange={setShowPasswordSuccessDialog}
      >
        <DialogContent className="sm:max-w-[425px] [&>button]:hidden" onPointerDownOutside={(event) => {event.preventDefault()}}>
          <DialogHeader>
            <DialogTitle className="text-primary">Password Changed</DialogTitle>
            <DialogDescription>
              Your password has been successfully changed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button
              variant="primary"
              onClick={() => {
                setShowPasswordSuccessDialog(false);
                window.location.reload();
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
