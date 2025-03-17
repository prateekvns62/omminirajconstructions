"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "@ant-design/v5-patch-for-react-19";
import Image from "next/image";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{  email?: string; password?: string; confirmPassword?: string; form?: string }>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id: number; email: string; expires: Date } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  useEffect(() => {
    if (!token) {
      router.push("/login?message=Invalid or expired token");
      return;
    }

    const validateToken = async () => {
          setLoading(true);
          const res = await fetch("/api/profile/validate-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          const data = await res.json();
          if (data.message) {
            router.push("/login?errormessage=Invalid or expired token");
          }

          if (!data.user || new Date() > data.user.expires) {
            router.push("/login?errormessage=Invalid or expired token");
          }
      
          if (data.user) {
            setUser({
              id: data.user?.user_id ?? 0,
              email: data.user?.email ?? "",
              expires: new Date(data.user?.expires ?? Date.now()),
            });
          }
          
          setLoading(false);

      };
      

    validateToken();
  }, [token, router]);

  const validatePassword = (password: string) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const validateInputs = (field: string, value: string) => {
    let errorMsg = "";
    if (field === "password") {
      if (!validatePassword(value)) {
        errorMsg =
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
      }
    } else if (field === "confirmPassword" && value !== password) {
      errorMsg = "Passwords do not match";
    }
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (email !== user?.email) {
      setErrors((prev) => ({ ...prev, email: "Email does not match" }));
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setErrors((prev) => ({ ...prev, password: "Invalid password format" }));
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/profile/updateprofile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId:user.id, status: 1 , newPassword: password }),
      });

      if (res.ok) {
        router.push("/login?successmessage=Password Changed Successfully!");
        setLoading(false);
      } else {
        router.push("/login?errormessage=Something went wrong!");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      router.push("/login?errormessage=Something went wrong!");
   }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {loading && (
        <div className="absolute inset-0 bg-white/30 backdrop-blur-none flex justify-center items-center z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin shadow-lg"></div>
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-lg w-120 border border-gray-300">
        <Image 
          src="/logo.jpg"
          alt="Logo"
          width={200}
          height={128}
          className="mx-auto mb-6"
        />
        <h2 className="text-center text-lg font-semibold mb-4">Reset Password</h2>
        {errors.form && <p className="text-red-500 text-center">{errors.form}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}
        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validateInputs("password", e.target.value);
              }}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                validateInputs("confirmPassword", e.target.value);
              }}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default function ResetPassword() {
  return <ResetPasswordPage />;
}