"use client";
import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTitle from "../admin/pagetitle";
import { useRouter } from "next/navigation";
import { message } from "antd";
import '@ant-design/v5-patch-for-react-19';

export default function BookingForm() {
    const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showFranchiseField, setShowFranchiseField] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        workBy: string;
        workThrough: string; // Ensure it's typed as string array
        plotSize: string;
        area: string;
        aadhaarCardNumber: string;
        photo: File | null;
        registryCopy: File | null;
        panCardCopy: File | null;
        aadharFrontCopy: File | null;
        aadharBackCopy: File | null;
        franchise_id: string;
    }>({
        name: "",
        email: "",
        workBy: "",
        workThrough: "", // Now correctly typed
        plotSize: "",
        area: "",
        aadhaarCardNumber: "",
        photo: null,
        registryCopy: null,
        panCardCopy: null,
        aadharFrontCopy: null,
        aadharBackCopy: null,
        franchise_id: ""
    });

    const determinePlotSize = (area:number) => {
        if (area <= 450) return "5100";
        if (area <= 900) return "10200";
        if (area <= 1350) return "15300";
        if (area <= 1800) return "20400";
        return "25500";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "workThrough") {
            setShowFranchiseField(value === "Franchise");
        }

        if (name === "area") {
            setFormData((prev) => ({ ...prev, plotSize: determinePlotSize(Number(value))}));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                [name as keyof typeof prev]: files[0] // Type assertion
            }));
            setFileNames((prev) => ({
                ...prev,
                [name]: files[0].name, // Store file name separately
            }));
        } else {
            setFileNames((prev) => ({
                ...prev,
                [name]: "", // Clear file name if no file is selected
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const formDataToSend = new FormData();
    
        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === "string") {
                formDataToSend.append(key, value);
            }
        });
        
    
        ["photo","aadharFrontCopy", "aadharBackCopy", "panCardCopy", "registryCopy"].forEach((key) => {
            const file = formData[key as keyof typeof formData] as File | null;
            if (file) {
                formDataToSend.append(key, file);
            }
        });
    
        try {
            const response = await fetch("/api/booking/saveBooking", {
                method: "POST",
                body: formDataToSend, // Send as FormData, NOT JSON
            });
    
            if (!response.ok) throw new Error("Form submission failed");
    
            const result = await response.json();
            message.success("Form submitted successfully!");
            setTimeout(() => {
                window.open(`/booking/payment/${result.booking.id}`, '_blank');
                router.push('/admin/booking-form');
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
            <PageTitle title="Booking Form" />
            <div className="flex w-full gap-x-8 px-4">
                <div className="w-[72%] p-10 py-8 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block text-lg font-bold">Name <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />

                        <label className="block text-lg font-bold">Email <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />

                        <label className="block text-lg font-bold">Aadhaar Card Number <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="text" name="aadhaarCardNumber" value={formData.aadhaarCardNumber} onChange={handleChange} className="w-full p-2 border rounded" required />

                        <label className="block text-lg font-bold">Work By <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <select name="workBy" value={formData.workBy} onChange={handleChange} className="w-full p-2 border rounded" required>
                            <option value="">Select an option</option>
                            <option value="Booking">Booking</option>
                            <option value="Full Payment">Full Payment</option>
                            <option value="Loan with 25% advance and 75% EMI">Loan with 25% advance and 75% EMI</option>
                        </select>
                        
                        <label className="block text-lg font-bold">Work Through <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <select name="workThrough" value={formData.workThrough} onChange={handleChange} className="w-full p-2 border rounded" required>
                            <option value="">Select an option</option>
                            <option value="Franchise">Franchise</option>
                            <option value="Individual">Individual</option>
                        </select>

                        {showFranchiseField && (
                            <div>
                                <label className="block text-lg font-bold text-black">Franchise Id <span className="text-red-500 text-2xl leading-none">*</span></label>
                                <input type="text" name="franchise_id" value={formData.franchise_id} onChange={handleChange} className="w-full p-2 border rounded" required />
                            </div>
                        )}

                        <label className="block text-lg font-bold">Area <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="number" name="area" value={formData.area} onChange={handleChange} className="w-full p-2 border rounded" required />

                        <label className="block text-lg font-bold">Plot Size</label>
                        <select name="plotSize" value={formData.plotSize} onChange={handleChange} className="w-full p-2 border rounded bg-gray-200 text-gray-500 cursor-not-allowed" required disabled>                            <option value="">Please select</option>
                            <option value="5100">0 - 450 Sq. Ft</option>
                            <option value="10200">451 - 900 Sq. Ft</option>
                            <option value="15300">901 - 1350 Sq. Ft</option>
                            <option value="20400">1351 - 1800 Sq. Ft</option>
                            <option value="25500">Above 1801 Sq. Ft</option>
                        </select>

                        {["photo", "aadharFrontCopy", "aadharBackCopy", "panCardCopy", "registryCopy"].map((fileInput) => (
                            <div key={fileInput} className="space-y-2">
                                <label className="block text-lg font-bold">{fileInput.replace(/([A-Z])/g, ' $1')} <span className="text-red-500 text-2xl leading-none">*</span></label>
                                <label className="block border p-4 rounded-md bg-yellow-400 cursor-pointer relative">
                                    <input type="file" name={fileInput} onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                                    {fileNames[fileInput] ? fileNames[fileInput] : <span className="flex items-center gap-2"><Upload className="w-5 h-5" /> Choose File</span>}
                                </label>
                            </div>
                        ))}

                        <Button type="submit" className="w-1/4 p-7 bg-yellow-400 text-black font-extrabold text-2xl hover:bg-yellow-500 hover:text-white transition duration-300" disabled={isLoading}>
                            {isLoading ? "Submitting..." : "Submit Form"}
                        </Button>
                    </form>
                </div>
                <div className="w-[28%] bg-gray-100 bg-cover bg-center" style={{ backgroundImage: "url('/franchise_form.jpg')" }}>
                </div>
            </div>
        </div>
    );
}
