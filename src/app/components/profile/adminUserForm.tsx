"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { message } from "antd";
import PageTitle from "@/app/components/admin/pagetitle";
import "@ant-design/v5-patch-for-react-19";

export default function AdminUserForm() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        status: 0,
    });
    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: "",
    });
    const [formError, setFormError] = useState("");


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "password" || name === "confirmPassword") {
            validatePasswords(name, value);
        }
    };

    const validatePassword = (password: string) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(password);
    };

    const validatePasswords = (field: string, value: string) => {
        let errorMsg = "";
        if (field === "password") {
            if (!validatePassword(value)) {
                errorMsg =
                    "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
            }
        } else if (field === "confirmPassword" && value !== formData.password) {
            errorMsg = "Passwords do not match";
        }
        setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setFormError("");

        if (errors.password || errors.confirmPassword) {
            message.error("Please fix validation errors");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/profile/saveProfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    status: Number(formData.status), // Ensure status is a number
                }),
            });

            if (!response.ok) throw new Error("Form submission failed");

            const result = await response.json();

            if (result.message) {
                setFormError(result.message); // Show error above button
                setTimeout(() => setFormError(""), 3000);
                setIsLoading(false);
                return;
            }

            setFormData({
                name: "",
                email: "",
                username: "",
                password: "",
                confirmPassword: "",
                status: 0,
            });

            message.success("Form submitted successfully!");

            setTimeout(() => {
                router.push(`/admin/profile/${result.user.id}`);
            }, 1000);
        } catch (error) {
            console.error("Submission Error:", error);
            message.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <PageTitle title="Admin User Form" />

            <div className="flex w-full gap-x-8 px-4">
                {/* Left Section (Content) */}
                <div className="w-[72%] p-10 py-8 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block text-lg font-bold text-black">
                            Name <span className="text-red-500 text-2xl leading-none">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name..."
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                            disabled={isLoading}
                        />

                        <label className="block text-lg font-bold text-black">
                            Username <span className="text-red-500 text-2xl leading-none">*</span>
                        </label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username..."
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                            disabled={isLoading}
                        />

                        <label className="block text-lg font-bold text-black">
                            Email <span className="text-red-500 text-2xl leading-none">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email..."
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                            disabled={isLoading}
                        />

                        <label className="block text-lg font-bold text-black">
                            Status <span className="text-red-500 text-2xl leading-none">*</span>
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                            disabled={isLoading}
                        >
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                        </select>

                        <label className="block text-lg font-bold text-black">
                            Password <span className="text-red-500 text-2xl leading-none">*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password..."
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                            disabled={isLoading}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                        <label className="block text-lg font-bold text-black">
                            Confirm Password <span className="text-red-500 text-2xl leading-none">*</span>
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter password..."
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                            disabled={isLoading}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

                        {/* Error Message (Displayed above the button) */}
                        {formError && (
                            <p className="text-red-500 text-sm font-semibold">{formError}</p>
                        )}

                        {/* Submit Button with Loader Effect */}
                        <Button
                            type="submit"
                            className="w-1/4 p-7 bg-yellow-400 text-black font-extrabold text-left text-2xl hover:bg-yellow-500 hover:text-white transition duration-300 disabled:bg-gray-400"
                            disabled={isLoading || !!errors.password || !!errors.confirmPassword}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        />
                                    </svg>
                                    Submitting Data...
                                </div>
                            ) : (
                                "Submit Form"
                            )}
                        </Button>
                    </form>
                </div>

                {/* Right Section (Image Background) */}
                <div
                    className="w-[28%] bg-gray-100 bg-cover bg-center"
                    style={{ backgroundImage: "url('/franchise_form.jpg')" }}
                />
            </div>
        </div>
    );
}
