"use client";
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import "@ant-design/v5-patch-for-react-19";
import { message, Skeleton, Card } from "antd";
import PageTitle from "../admin/pagetitle";
import Loader from "../admin/loader";

interface ProfileType {
  id: number;
  name: string;
  username: string;
  email: string;
  status: number;
  created_at: string | Date;
  last_login: string | Date;
}

const ProfileField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="block text-gray-700 font-bold mb-1">{label}</label>
    <input
      type="text"
      value={value || "N/A"}
      readOnly
      className="w-full p-3 border rounded-md bg-gray-100 text-gray-700"
    />
  </div>
);

const ProfilePage = ({ user }: { user: ProfileType | null }) => {
  const [formData, setFormData] = useState<ProfileType | null>(null);
  const [editing, setEditing] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(user);
      setLoading(false);
    } else {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) throw new Error("Failed to fetch profile data");
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.log(error);
      message.error("Error fetching profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setChangePassword(false);
    setPasswords({ newPassword: "", confirmPassword: "" });
    setPasswordError(null);
    setConfirmPasswordError(null);
    if (user) setFormData(user); // Reset to original data
  };

  const handleEdit = () => setEditing(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => (prev ? { ...prev, [e.target.name]: e.target.value } : null));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));

    if (name === "newPassword") {
      setPasswordError(validatePassword(value) ? null : "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
    }

    if (name === "confirmPassword") {
      setConfirmPasswordError(value === passwords.newPassword ? null : "Passwords do not match.");
    }
  };

  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleSave = async () => {
    if (changePassword) {
      if (!validatePassword(passwords.newPassword)) {
        setPasswordError("Invalid password.");
        return;
      }
      if (passwords.newPassword !== passwords.confirmPassword) {
        setConfirmPasswordError("Passwords do not match.");
        return;
      }
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/profile/updateprofile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId:formData?.id, status: formData?.status , newPassword: passwords.newPassword }),
      });

      if (res.ok) {
        message.success("Profile updated successfully!");
        setEditing(false);
        setChangePassword(false);
        setPasswords({ newPassword: "", confirmPassword: "" });
        setPasswordError(null);
        setConfirmPasswordError(null);
      } else {
        message.error("Something went wrong.");
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong.");
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

  if (!formData) return <div>No user data available</div>;

  return (
    <div>
      <PageTitle title={`${formData.username} - Profile Details`} />
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="w-full max-w-3xl p-8 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded-full border-4 border-gray-400 shadow-md">
              <User size={80} className="text-gray-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mt-4">{formData.username}</h2>
          </div>
          <form className="grid grid-cols-1 gap-6">
            <ProfileField label="Email" value={formData.email} />
            <ProfileField label="Name" value={formData.name} />
            <div>
              <label className="block text-gray-700 font-bold mb-1">Status</label>
              {editing ? (
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md text-gray-700"
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.status === 1 ? "Active" : "Inactive"}
                  readOnly
                  className={`w-full p-3 border rounded-md text-white font-semibold ${
                    formData.status === 1 ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              )}
            </div>
            {!editing && (
              <div className="mt-6 text-gray-700">
                <p className="font-bold">
                  Last Login: <span className="font-normal">{new Date(formData.last_login).toLocaleString()}</span>
                </p>
                <p className="font-bold">
                  Joined: <span className="font-normal">{new Date(formData.created_at).toLocaleString()}</span>
                </p>
              </div>
            )}

            {/* Change Password Checkbox */}
            {editing && (
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={changePassword}
                    onChange={() => {
                      setChangePassword(!changePassword);
                      if (changePassword) {
                        setPasswords({ newPassword: "", confirmPassword: "" });
                        setPasswordError(null);
                        setConfirmPasswordError(null);
                      }
                    }}
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
          <div className="mt-6 flex justify-end space-x-4">
            {editing ? (
              <>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400" disabled={changePassword && (!!passwordError || !!confirmPasswordError || !passwords.newPassword || !passwords.confirmPassword)}>
                  Save
                </button>
                <button onClick={handleCancel} className="px-4 py-2 bg-gray-500 text-white rounded-lg">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={handleEdit} className="px-4 py-2 bg-green-500 text-white rounded-lg">
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
      {isLoading && (<Loader/>)}
    </div>
  );
};

export default ProfilePage;
