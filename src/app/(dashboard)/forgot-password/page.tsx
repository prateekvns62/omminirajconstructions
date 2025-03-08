"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const OTPPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP, 3: Reset Password
  const [error, setError] = useState("");
  const router = useRouter();

  const requestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Call API to send OTP
    const res = await fetch("/api/profile/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Failed to send OTP");
      return;
    }

    setStep(2);
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Invalid OTP");
      return;
    }
    setStep(3);
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Failed to reset password");
      return;
    }

    router.replace("/login");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 border border-gray-300">
        <img src="/logo.jpg" alt="Logo" width={100} height={61} className="mx-auto mb-6" />
        {step === 1 && (
          <form onSubmit={requestOTP}>
            <p className="text-center mb-6 text-gray-600">Enter your registred email to reset your password.</p>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg mb-4" />
            <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Send OTP</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={verifyOTP}>
            <p className="text-center mb-6 text-gray-600">Enter the OTP sent to your email</p>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg mb-4" />
            <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Verify OTP</button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={resetPassword}>
            <p className="text-center mb-6 text-gray-600">Set your new password</p>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg mb-4" />
            <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Reset Password</button>
          </form>
        )}

        <div className="mt-4 text-center text-sm text-gray-600">
          <a href="/login" className="text-blue-600 hover:underline">
            Back to Login
          </a>
        </div>

        {/* Create Account Link */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Om Miniraj Building & Construction Services Private Limited</p>
        </div>
      </div>
    </div>
  );
};

export default function OTPLoginPage() {
  return <OTPPage />;
}