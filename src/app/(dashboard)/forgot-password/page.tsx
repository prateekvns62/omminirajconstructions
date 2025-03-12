"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/profile/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setEmail("");
      router.push("/login?successmessage=A password reset link has been sent to your email.");
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 relative">
      {loading && (
        <div className="absolute inset-0 bg-white/30 backdrop-blur-none flex justify-center items-center z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin shadow-lg"></div>
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-lg w-120 border border-gray-300 relative">
        <img
          src="/logo.jpg"
          alt="Logo"
          width={200}
          height={128}
          className="mx-auto mb-6"
        />
        <p className="text-center mb-6 text-gray-600">
          Enter your email to reset your password
        </p>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}
        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

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

export default function ForgotPassword() {
  return <ForgotPasswordPage />;
}