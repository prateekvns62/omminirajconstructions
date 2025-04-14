"use client";
import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTitle from "../admin/pagetitle";
import { useRouter } from "next/navigation";
import { message } from "antd";
import Loader from "../admin/loader";
import '@ant-design/v5-patch-for-react-19';


export default function ServicesForm() {
    const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<{
        serviceTitle: string;
        description: string;
        image: File | null;
        status: boolean;
        showOnHome: boolean;
    }>({
        serviceTitle: "",
        description: "",
        image: null,
        status: true,
        showOnHome: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setFormData((prev) => ({
            ...prev,
            [name]: name === "status" || name === "showOnHome" ? Boolean(Number(value)) : value,
        }));
    };
    



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            const file = files[0];
            const allowedFormats: { [key: string]: string[] } = {
                image: ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"],
            };
    
            if (!allowedFormats[name]?.includes(file.type)) {
                message.error(`Invalid file format for ${name}. Please select a valid ${name === "pdf" ? "PDF" : "image"} file.`);
                e.target.value = ""; // Reset file input
                return;
            }
    
            setFormData((prev) => ({
                ...prev,
                [name as keyof typeof prev]: file
            }));
    
            setFileNames((prev) => ({
                ...prev,
                [name]: file.name
            }));
        } else {
            setFileNames((prev) => ({
                ...prev,
                [name]: ""
            }));
        }
    };
    
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const formDataToSend = new FormData();
    
        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === "string" || typeof value === "boolean") {
                formDataToSend.append(key, String(value));
            }
        });
        
    
        // Append file fields
        ["image"].forEach((key) => {
            const file = formData[key as keyof typeof formData] as File | null;
            if (file) {
                formDataToSend.append(key, file);
            }
        });
    
        try {
            const response = await fetch("/api/services/saveService", {
                method: "POST",
                body: formDataToSend, // Send as FormData, NOT JSON
            });
    
            if (!response.ok) throw new Error("Form submission failed");
    
            const result = await response.json();
            message.success("Form submitted successfully!");
            setTimeout(() => {
                router.push(`/admin/services/${result.service.id}`);
            }, 1000);

        } catch (error) {
            console.error("Submission Error:", error);
            message.error("Something went wrong!");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div>
            <PageTitle title="Add New Service" />
            
            <div className="flex w-full gap-x-8 px-4">
                {/* Left Section (Content) */}
                <div className="w-[72%] p-10 py-8 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block text-lg font-bold text-black">Service Title <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="text" name="serviceTitle" placeholder="Service Title..." value={formData.serviceTitle} onChange={handleChange} className="w-full p-2 border rounded" required />

                        <label className="block text-lg font-bold text-black">Description</label>
                        <textarea rows={5} name="description" placeholder="Description..." value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" />

                        <label className="block text-lg font-bold text-black">Status</label>
                        <select name="status" value={formData.status ? "1": "0"} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="0">Inactive</option>
                            <option value="1">Active</option>
                        </select>

                        <label className="block text-lg font-bold text-black">Show on Home</label>
                        <select name="showOnHome" value={formData.showOnHome ? "1" : "0"} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                        {[
                        { name: "image", label: "Service Image", accept: "image/*" },
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
                                accept={fileInput.accept} 
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                required
                            />
                            {fileNames[fileInput.name] ? <span>{fileNames[fileInput.name]}</span> : <span className="flex items-center gap-2"><Upload className="w-5 h-5 text-black-600" /> Choose File</span>}
                            </label>                        </div>
                        ))}
                        
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
            {isLoading && (<Loader/>)}
        </div>

    );
    
}



