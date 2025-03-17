"use client";
import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTitle from "../admin/pagetitle";
import { useRouter } from "next/navigation";
import { message } from "antd";
import Loader from "../admin/loader";
import '@ant-design/v5-patch-for-react-19';


export default function ClientsForm() {
    const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<{
        type: number;
        srNo: number;
        name: string;
        location: string;
        image: string | File | null;
    }>({
        name: "",
        location: "",
        image: null,
        type: 0,
        srNo: 0,
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
            if (typeof value === "string" || typeof value === "boolean" || typeof value === "number") {
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
            const response = await fetch("/api/clients/saveClient", {
                method: "POST",
                body: formDataToSend, // Send as FormData, NOT JSON
            });
    
            if (!response.ok) throw new Error("Form submission failed");
    
            const result = await response.json();
            message.success("Form submitted successfully!");
            setTimeout(() => {
                router.push(`/admin/clients/${result.client.id}`);
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
            <PageTitle title="Add New Client" />
            
            <div className="flex w-full gap-x-8 px-4">
                {/* Left Section (Content) */}
                <div className="w-[72%] p-10 py-8 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-4">

                    <label className="block text-lg font-bold text-black">Client Type</label>
                    <select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded"
                    >
                    <option value="0">Image</option>
                    <option value="1">List</option>
                    </select>

                    {/* Show Name and Location only if type is 1 (List) */}
                    {formData.type == 1 && (
                    <>
                        <label className="block text-lg font-bold text-black">
                        Client Name <span className="text-red-500 text-2xl leading-none">*</span>
                        </label>
                        <input 
                        type="text" 
                        name="name" 
                        placeholder="Client Name..." 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="w-full p-2 border rounded" 
                        required 
                        />

                        <label className="block text-lg font-bold text-black">
                        Location <span className="text-red-500 text-2xl leading-none">*</span>
                        </label>
                        <input 
                        type="text" 
                        name="location" 
                        placeholder="Location..." 
                        value={formData.location} 
                        onChange={handleChange} 
                        className="w-full p-2 border rounded" 
                        required
                        />
                    </>
                    )}

                    {/* Show Image Upload only if type is 0 (Image) */}
                    {formData.type == 0 && (
                    <div className="space-y-2">
                        <label className="block text-lg font-bold text-black">
                        Client Image <span className="text-red-500 text-2xl leading-none">*</span>
                        </label>

                        <label className="block border p-4 rounded-md bg-yellow-400 text-black cursor-pointer relative">
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            required
                        />
                        {fileNames.image ? <span>{fileNames.image}</span> : (
                            <span className="flex items-center gap-2">
                            <Upload className="w-5 h-5 text-black-600" /> Choose File
                            </span>
                        )}
                        </label>
                    </div>
                    )}

                        <label className="block text-lg font-bold text-black">
                        Sr. No. <span className="text-red-500 text-2xl leading-none">*</span>
                        </label>
                        <input 
                        type="number" 
                        name="srNo" 
                        placeholder="Enter Sr. No..." 
                        value={formData.srNo} 
                        onChange={handleChange} 
                        className="w-full p-2 border rounded" 
                        required 
                        />
                        
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



