"use client";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { message, Skeleton, Card } from "antd";
import '@ant-design/v5-patch-for-react-19';
import { useRouter } from "next/navigation";
import PageTitle from "@/app/components/admin/pagetitle";
import Loader from "@/app/components/admin/loader";

type UserType = {
  id: number;
  name: string;
  username: string;
  email: string;
  status: number;
  created_at: string | Date;
  last_login: string | Date;
};

const ProfilePage = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data: UserType = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          message.error("Error fetching profile data");
        }
      } catch (error) {
        console.log(error);
        message.error("Error fetching profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validatePassword = (password: string) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });

    if (name === "newPassword") {
      if (!validatePassword(value)) {
        setPasswordError(
          "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character."
        );
      } else {
        setPasswordError(null);
      }
    }

    if (name === "confirmPassword") {
      if (value !== passwords.newPassword) {
        setConfirmPasswordError("Passwords do not match.");
      } else {
        setConfirmPasswordError(null);
      }
    }
  };

  const handleSave = async () => {
    if (!validatePassword(passwords.newPassword) || passwords.newPassword !== passwords.confirmPassword) {
      return;
    }
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/profile/updateprofile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status:user?.status, userId: user?.id, newPassword: passwords.newPassword }),
      });
      const data: UserType = await res.json();
      if (res.ok) {
        setUser(data);
        setPasswords({ newPassword: "", confirmPassword: "" });
        setPasswordError(null);
        setConfirmPasswordError(null);
        message.success("Profile updated successfully!");
        router.replace("/admin/profile");
      } else {
        message.error("Something went wrong! Please try after some time.");
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong! Please try after some time.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg space-y-6">
        <Skeleton active />
        <Card className="p-4">
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>
        <Card className="p-4">
          <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageTitle title={`${user?.username} - Change Password`} />
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="w-full max-w-3xl p-8 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded-full border-4 border-gray-400 shadow-md">
              <User size={80} className="text-gray-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mt-4">{user?.username}</h2>
          </div>
          <form className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className="w-full p-3 border rounded-md text-gray-700"
                placeholder="Enter strong password"
              />
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Re-enter Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full p-3 border rounded-md text-gray-700"
                placeholder="Re-enter password"
              />
              {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
            </div>
          </form>
          <div className="mt-6 flex justify-end space-x-4">
            <button 
              onClick={handleSave} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
              disabled={!!passwordError || !!confirmPasswordError || !passwords.newPassword || !passwords.confirmPassword}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      {isLoading && (<Loader/>)}
    </div>
  );
};

export default ProfilePage;
