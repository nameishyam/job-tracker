import { useState } from "react";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bcrypt from "bcryptjs";

const Forgotpass = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpValidated, setOtpValidated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleGenerateOTP = async () => {
    if (resendTimer > 0) return;
    setIsGenerating(true);
    setError("");
    const email = formData.email;
    if (!email) {
      setError("Please enter your email.");
      setIsGenerating(false);
      return;
    }
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.removeItem("hashedOTP");
      setOtpRequested(true);
      setIsGenerating(false);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/generate-otp`,
        { email, otp }
      );
      if (response.status === 200) {
        bcrypt.hash(otp, 10).then((hashedOTP) => {
          localStorage.setItem("hashedOTP", hashedOTP);
        });
        setResendTimer(60);
        const timerInterval = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timerInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to send OTP. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleValidateOTP = async () => {
    setIsValidating(true);
    setError("");
    const enteredOtp = formData.otp;
    const hashedOTP = localStorage.getItem("hashedOTP");
    if (!enteredOtp) {
      setError("Please enter the OTP.");
      setIsValidating(false);
      return;
    }
    try {
      const isMatch = await bcrypt.compare(enteredOtp, hashedOTP);
      if (isMatch) {
        setOtpValidated(true);
        setError("");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const { email, password, confirmPassword } = formData;
    if (!otpValidated) {
      setError("Please validate OTP before submitting.");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/reset-password`,
        { email, newPassword: password }
      );
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-100">
              Forgot Password
            </h1>
            <p className="text-slate-400 mt-2">
              Enter your email to reset your password.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-center text-sm text-rose-300"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            {/* Generate OTP button */}
            <div>
              <button
                type="button"
                onClick={handleGenerateOTP}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 bg-emerald-500 text-slate-900 font-medium hover:bg-emerald-400 disabled:opacity-60"
              >
                {isGenerating ? "Sending..." : "Generate OTP"}
              </button>
            </div>

            {/* OTP input */}
            {otpRequested && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Enter OTP
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  placeholder="6-digit code"
                />

                <div className="flex gap-3 items-center">
                  <button
                    type="button"
                    onClick={handleValidateOTP}
                    disabled={isValidating || otpValidated}
                    className="inline-flex items-center gap-2 rounded-md px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-500 disabled:opacity-60"
                  >
                    {isValidating
                      ? "Validating..."
                      : otpValidated
                      ? "Validated ✅"
                      : "Validate OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateOTP}
                    disabled={resendTimer > 0 || isGenerating}
                    className="text-sm underline text-slate-300"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
                  </button>
                </div>
              </div>
            )}

            {/* Password fields */}
            {otpValidated && (
              <>
                {/* Password */}
                <div className="relative space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 pr-10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    placeholder="Enter password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 pr-10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    placeholder="Confirm password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Submit button */}
            <div>
              <button
                type="submit"
                className="w-full rounded-md px-4 py-2 bg-emerald-600 text-white font-medium hover:bg-emerald-500 disabled:opacity-60"
                disabled={!otpValidated || isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
              {!otpValidated && (
                <p className="text-xs text-slate-400 mt-2">
                  You must validate OTP before submitting.
                </p>
              )}
            </div>
          </form>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Forgotpass;
