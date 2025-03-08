"use client";
import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTitle from "../admin/pagetitle";
import { useRouter } from "next/navigation";
import { message } from "antd";


export default function FranchiseForm() {
    const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        address: string;
        doYouHave: string[]; // Ensure it's typed as string array
        mobileNumber: string;
        message: string;
        aadhaarCardNumber: string;
        accountNumber: string;
        ifscCode: string;
        passbookCopy: File | null;
        panCardCopy: File | null;
        aadharFrontCopy: File | null;
        aadharBackCopy: File | null;
    }>({
        name: "",
        email: "",
        address: "",
        doYouHave: [], // Now correctly typed
        mobileNumber: "",
        message: "",
        aadhaarCardNumber: "",
        accountNumber: "",
        ifscCode: "",
        passbookCopy: null,
        panCardCopy: null,
        aadharFrontCopy: null,
        aadharBackCopy: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
    

    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormData((prev) => ({ ...prev, doYouHave: selectedOptions }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const formDataToSend = new FormData();
    
        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === "string") {
                formDataToSend.append(key, value);
            } else if (key === "doYouHave" && Array.isArray(value)) {
                value.forEach((item) => {
                    formDataToSend.append(key, item);
                });
            }
        });
        
    
        // Append file fields
        ["passbookCopy", "panCardCopy", "aadharFrontCopy", "aadharBackCopy"].forEach((key) => {
            const file = formData[key as keyof typeof formData] as File | null;
            if (file) {
                formDataToSend.append(key, file);
            }
        });
    
        try {
            const response = await fetch("/api/franchise/saveFranchise", {
                method: "POST",
                body: formDataToSend, // Send as FormData, NOT JSON
            });
    
            if (!response.ok) throw new Error("Form submission failed");
    
            const result = await response.json();
            message.success("Form submitted successfully!");
            setTimeout(() => {
                router.push(`/admin/franchise/${result.franchise.id}`);
            }, 2000);

        } catch (error) {
            console.error("Submission Error:", error);
            message.success("Something went wrong!");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div>
            <PageTitle title="Franchise Form" />
            
            <div className="flex w-full gap-x-8 px-4">
                {/* Left Section (Content) */}
                <div className="w-[72%] p-10 py-8 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block text-lg font-bold text-black">Name <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="text" name="name" placeholder="Name..." value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                        <label className="block text-lg font-bold text-black">Mobile Number <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="text" name="mobileNumber" placeholder="Mobile Number..." value={formData.mobileNumber} onChange={handleChange} className="w-full p-2 border rounded" required />
                        <label className="block text-lg font-bold text-black">Email <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="email" name="email" placeholder="Email..." value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
                        <label className="block text-lg font-bold text-black">Address for Franchise <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="text" name="address" placeholder="Address for Franchise..." value={formData.address} onChange={handleChange} className="w-full p-2 border rounded" required />
                        <label className="block text-lg font-bold text-black">Aadhaar Card Number <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="text" name="aadhaarCardNumber" placeholder="Aadhaar Card Number..." value={formData.aadhaarCardNumber} onChange={handleChange} className="w-full p-2 border rounded" required />
                        <label className="block text-lg font-bold text-black">Bank Account Number <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="text" name="accountNumber" placeholder="Bank Account Number..." value={formData.accountNumber} onChange={handleChange} className="w-full p-2 border rounded" required />
                        <label className="block text-lg font-bold text-black">IFSC Code <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="text" name="ifscCode" placeholder="IFSC Code..." value={formData.ifscCode} onChange={handleChange} className="w-full p-2 border rounded" required />

                        {[
                        { name: "aadharFrontCopy", label: "Aadhaar Card Front" },
                        { name: "aadharBackCopy", label: "Aadhaar Card Back" },
                        { name: "passbookCopy", label: "Bank Passbook" },
                        { name: "panCardCopy", label: "Pan Card" }
                        ].map((fileInput) => (
                        <div key={fileInput.name} className="space-y-2">
                            {/* Label */}
                            <label className="block text-lg font-bold text-black">
                            {fileInput.label} <span className="text-red-500 text-2xl leading-none">*</span>
                            </label>

                            <label className="block border p-4 rounded-md bg-yellow-400 text-black cursor-pointer relative">
                            <input
                                type="file"
                                name={fileInput.name}
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                required
                            />
                            {fileNames[fileInput.name] ? <span>{fileNames[fileInput.name]}</span> : <span className="flex items-center gap-2"><Upload className="w-5 h-5 text-black-600" /> Choose File</span>}
                            </label>                        </div>
                        ))}

                        
                        <label className="block font-semibold text-black">Do you have (check all that apply) *</label>
                        <select multiple name="doYouHave" onChange={handleMultiSelectChange} className="w-full p-2 border rounded">
                            <option value="Home Paper or Rent Agreement">Home Paper or Rent Agreement</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Printer">Printer</option>
                            <option value="Company Banner or Signage">Company Banner or Signage</option>
                        </select>

                        <label className="block text-lg font-bold text-black">Comment or Message</label>
                        <textarea name="message" placeholder="Write Your Comment or Message..." value={formData.message} onChange={handleChange} className="w-full p-2 border rounded" />
                        
                        <Button type="submit" className="w-1/4 p-7 bg-yellow-400 text-black font-extrabold text-left text-2xl hover:bg-yellow-500 hover:text-white transition duration-300" disabled={isLoading}>{isLoading ? "Submitting..." : "Submit Form"}</Button>
                    </form>
                </div>
                {/* Right Section (Image Background) */}
                <div 
                    className="w-[28%] bg-gray-100 bg-cover bg-center"
                    style={{ backgroundImage: "url('/franchise_form.jpg')" }}
                >
                    {/* No content needed here, just background */}
                </div>
            </div>
        </div>

    );
    
}



