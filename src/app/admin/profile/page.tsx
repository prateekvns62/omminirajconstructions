"use client";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import '@ant-design/v5-patch-for-react-19';
import { message, Skeleton, Card } from "antd";
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
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserType | null>(null);
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [passwords, setPasswords] = useState<{ newPassword: string; confirmPassword: string }>({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data: UserType = await res.json();
        if (res.ok) {
          setUser(data);
          setFormData({ ...data });
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

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setChangePassword(false);
    setPasswords({ newPassword: "", confirmPassword: "" });
    setPasswordError(null);
    setConfirmPasswordError(null);
    setFormData(user ? { ...user } : null); // Reset to original user data
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) =>
      prev ? { ...prev, [e.target.name]: e.target.value } : null
    );
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

  const validatePassword = (password: string) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSave = async () => {
    if (changePassword) {
      if (!validatePassword(passwords.newPassword)) {
        setPasswordError(
          "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character."
        );
        return;
      }
      if (passwords.newPassword !== passwords.confirmPassword) {
        setConfirmPasswordError("Passwords do not match.");
        return;
      }
    }
    setIsLoading(true);
    try {
      console.log();
      const formDataUpdate = {
        userId: formData?.id,
        status: formData?.status,
        newPassword: passwords.newPassword,
      };
      const res = await fetch("/api/profile/updateprofile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataUpdate),
      });

      const data: UserType = await res.json();
      if (res.ok) {
        setUser(data);
        setEditing(false);
        setChangePassword(false);
        setPasswords({ newPassword: "", confirmPassword: "" });
        setPasswordError(null);
        setConfirmPasswordError(null);
        message.success("Profile updated successfully!");
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
      <PageTitle title={`${user?.username} - Profile Details`} />
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="w-full max-w-3xl p-8 bg-white shadow-lg rounded-lg">
          {/* User Avatar */}
          <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded-full border-4 border-gray-400 shadow-md">
                <User size={80} className="text-gray-500" />
              </div>
            <h2 className="text-3xl font-bold text-gray-800 mt-4">{user?.username}</h2>
          </div>

          {/* User Information Form */}
          <form className="grid grid-cols-1 gap-6">
            {/* Email (Read-Only) */}
            <div>
              <label className="block text-gray-700 font-bold mb-1">Email</label>
              <input
                type="text"
                value={user?.email}
                readOnly
                className="w-full p-3 border rounded-md bg-gray-100 text-gray-700"
              />
            </div>

            {/* Name (Read-Only) */}
            <div>
              <label className="block text-gray-700 font-bold mb-1">Name</label>
              <input
                type="text"
                value={user?.name || "N/A"}
                readOnly
                className="w-full p-3 border rounded-md bg-gray-100 text-gray-700"
              />
            </div>
            {/* Status (Dropdown when editing) */}
            <div>
              <label className="block text-gray-700 font-bold mb-1">Status</label>
              {editing ? (
                <select
                  name="status"
                  value={formData?.status}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md text-gray-700"
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={user?.status === 1 ? "Active" : "Inactive"}
                  readOnly
                  className={`w-full p-3 border rounded-md text-white font-semibold ${
                    user?.status === 1 ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              )}
            </div>

            {!editing && (
            <div className="mt-6 text-gray-700">
              <p className="font-bold">Last Login: <span className="font-normal">{user?.last_login ? new Date(user.last_login).toLocaleString() : "N/A"}</span></p>
              <p className="font-bold">Joined: <span className="font-normal">{user?.created_at ? new Date(user.created_at).toLocaleString() : "N/A"}</span></p>
            </div>
            )}

            {/* Change Password Checkbox */}
            {editing && (
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={changePassword}
                    onChange={() => setChangePassword(!changePassword)}
                  />
                  <span className="text-gray-700 font-bold">Want to change password?</span>
                </label>
              </div>
            )}

            {/* Password Fields (Visible if checkbox is checked) */}
            {editing && changePassword && (
              <>
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
              </>
            )}
          </form>

          {/* Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            {editing ? (
              <>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400" disabled={changePassword && (!!passwordError || !!confirmPasswordError || !passwords.newPassword || !passwords.confirmPassword)}>Save</button>
                <button onClick={handleCancel} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
              </>
            ) : (
              <button onClick={handleEdit} className="px-4 py-2 bg-green-500 text-white rounded-lg">Edit Profile</button>
            )}
          </div>
        </div>
      </div>
      {isLoading && (<Loader/>)}
    </div>
  );
};

export default ProfilePage;
