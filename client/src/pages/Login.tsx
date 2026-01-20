import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { SpinnerCustom } from "@/components/ui/spinner";

const loginSchema = z.object({
  email: z.string().refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Invalid email address",
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const passwordResetSchema = z
  .object({
    email: z.string().refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Invalid email address",
    }),
    otp: z.string().length(6, "OTP must be 6 digits").optional(),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmNewPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.confirmNewPassword) {
        return data.newPassword === data.confirmNewPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmNewPassword"],
    },
  );

export default function Login() {
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await api.post(`/users/login`, values);
      await login();
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async () => {
    const email = passwordForm.getValues("email");
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post(`/users/generate-otp`, { email });
      const data = await res.data;
      if (res.status !== 200) {
        toast.error(data.error || "Failed to send OTP");
        return;
      }
      toast.success("OTP sent to your email");
      setEmailVerified(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = passwordForm.getValues("otp");
    if (!enteredOtp) {
      toast.error("Please enter OTP");
      return;
    }
    if (enteredOtp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post(`/users/validate-otp`, {
        email: passwordForm.getValues("email"),
        otp: enteredOtp,
      });
      if (res.status === 200) {
        toast.success("OTP verified");
        setOtpVerified(true);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (
    values: z.infer<typeof passwordResetSchema>,
  ) => {
    if (!values.newPassword || !values.confirmNewPassword) {
      toast.error("Please enter both password fields");
      return;
    }
    if (values.newPassword !== values.confirmNewPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.patch(`/users/reset-password`, {
        email: values.email,
        newPassword: values.newPassword,
      });
      if (res.status === 400) {
        toast.error("No user found with this email");
        return;
      }
      const data = await res.data;
      if (res.status !== 200) {
        toast.error(data.error || "Password reset failed");
        return;
      }
      toast.success("Password reset successfully!");
      passwordForm.reset();
      setForgotPassword(false);
      setEmailVerified(false);
      setOtpVerified(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    passwordForm.reset();
    setForgotPassword(false);
    setEmailVerified(false);
    setOtpVerified(false);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      {forgotPassword ? (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              {!emailVerified
                ? "Enter your email to receive an OTP"
                : !otpVerified
                  ? "Enter the OTP sent to your email"
                  : "Create your new password"}
            </CardDescription>
          </CardHeader>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(handleResetPassword)}
              className="space-y-8"
            >
              <CardContent>
                <div className="flex flex-col gap-6">
                  {!emailVerified && (
                    <div className="grid gap-2">
                      <FormField
                        name="email"
                        control={passwordForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="xyz@example.com"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  {emailVerified && !otpVerified && (
                    <>
                      <div className="text-sm text-muted-foreground">
                        OTP sent to: {passwordForm.getValues("email")}
                      </div>
                      <div className="grid gap-2">
                        <FormField
                          name="otp"
                          control={passwordForm.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>OTP</FormLabel>
                              <FormControl>
                                <InputOTP maxLength={6} {...field}>
                                  <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                  </InputOTPGroup>
                                  <InputOTPSeparator />
                                  <InputOTPGroup>
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
                      </div>
                    </>
                  )}
                  {otpVerified && (
                    <>
                      <FormField
                        name="newPassword"
                        control={passwordForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showNewPassword ? "text" : "password"}
                                  placeholder="Enter new password"
                                  {...field}
                                  disabled={isLoading}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:cursor-pointer"
                                  onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                  }
                                  disabled={isLoading}
                                >
                                  {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="confirmNewPassword"
                        control={passwordForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  placeholder="Confirm new password"
                                  {...field}
                                  disabled={isLoading}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:cursor-pointer"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                  disabled={isLoading}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                {!emailVerified && (
                  <Button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={isLoading}
                    className="w-full hover:cursor-pointer"
                  >
                    {isLoading ? <SpinnerCustom /> : "Send OTP"}
                  </Button>
                )}
                {emailVerified && !otpVerified && (
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                    className="w-full hover:cursor-pointer"
                  >
                    {isLoading ? <SpinnerCustom /> : "Verify OTP"}
                  </Button>
                )}
                {otpVerified && (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full hover:cursor-pointer"
                  >
                    {isLoading ? <SpinnerCustom /> : "Reset Password"}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="link"
                  onClick={handleBackToLogin}
                  disabled={isLoading}
                  className="hover:cursor-pointer"
                >
                  Back to Login
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      ) : (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your Email and password</CardDescription>
            <CardAction>
              <Button
                variant="link"
                className="hover:cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            </CardAction>
          </CardHeader>
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="space-y-4"
            >
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <FormLabel>Email</FormLabel>
                    </div>
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="xyz@example.com"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Button
                        variant="link"
                        onClick={() => setForgotPassword(true)}
                        className="hover:cursor-pointer"
                      >
                        Forgot Password?
                      </Button>
                    </div>
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                {...field}
                                disabled={isLoading}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full hover:cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? <SpinnerCustom /> : "Login"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}
    </div>
  );
}
