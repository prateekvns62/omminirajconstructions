"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials or Account disabled!");
      return;
    }

    router.replace("/admin");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 border border-gray-300">
        <img
          src="/logo.jpg"
          alt="Logo"
          width={100}
          height={61}
          className="mx-auto mb-6"
        />
        <p className="text-center mb-6 text-gray-600">
          Enter your credentials to continue
        </p>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="string"
              placeholder="Username or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Keep me logged in and Forgot Password in the same line */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="keepLoggedIn"
                checked={keepLoggedIn}
                onChange={() => setKeepLoggedIn(!keepLoggedIn)}
                className="h-4 w-4 border-gray-300 rounded"
              />
              <label htmlFor="keepLoggedIn" className="ml-2 text-sm text-gray-600">
                Keep me logged in
              </label>
            </div>
            <div>
              <a href="/forgot-password" className="text-blue-600 text-sm hover:underline">
                Forgot Password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        {/* Create Account Link */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Om Miniraj Building & Construction Services Private Limited</p>
        </div>
      </div>
    </div>
  );
};

export default function Loginpage() {
  return <LoginPage />;
}
