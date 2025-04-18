"use client";
import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTitle from "../admin/pagetitle";
import { useRouter } from "next/navigation";
import { message } from "antd";
import Loader from "../admin/loader";
import '@ant-design/v5-patch-for-react-19';

interface CertificateType {
    id: number;
    identifier: string;
    title: string;
    pdf: string | File | null;
    img: string | File | null;
    status: boolean;
    certificateId: string;
    certificateApprovalDate: string | Date;
    expiredDate: string | Date;
    priority: number;
    showOnHome: boolean;
  }

export default function UpdateCertificateForm({ certificate }: { certificate: CertificateType }) {
    const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<CertificateType>(certificate);
    const [updateImage, setUpdateImage] = useState(false);

    const router = useRouter();

    const handleBack = () => {
        const historyStack: string[] = JSON.parse(sessionStorage.getItem("historyStack") || "[]");
    
        if (historyStack.length > 1) {
          historyStack.pop(); // Remove current page
          const prevPage = historyStack[historyStack.length - 1]; // Get new previous page
          sessionStorage.setItem("historyStack", JSON.stringify(historyStack));
          router.push(prevPage);
        } else {
          router.push("/admin"); // Fallback to dashboard if no history exists
        }
      };

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
                img: ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"],
                pdf: ["application/pdf"],
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
        ["img", "pdf"].forEach((key) => {
            const file = formData[key as keyof typeof formData] as File | null;
            if (file) {
                formDataToSend.append(key, file);
            }
        });
    
        try {
            const response = await fetch(`/api/certificates/saveCertificate/${certificate.id}`, {
                method: "POST",
                body: formDataToSend, // Send as FormData, NOT JSON
            });
    
            if (!response.ok) throw new Error("Form submission failed");
    
            //const result = await response.json();
            message.success("Form submitted successfully!");
            setTimeout(() => {
                handleBack();
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
            <PageTitle title="Add New Certificate" />
            
            <div className="flex w-full gap-x-8 px-4">
                {/* Left Section (Content) */}
                <div className="w-[72%] p-10 py-8 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block text-lg font-bold text-black">Identifier <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="text" name="identifier" placeholder="Identifier..." value={formData.identifier} onChange={handleChange} className="w-full p-2 border rounded" required />

                        <label className="block text-lg font-bold text-black">Title</label>
                        <input type="text" name="title" placeholder="Title..." value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" />

                        <label className="block text-lg font-bold text-black">Status</label>
                        <select name="status" value={formData.status ? "1": "0"} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="0">Inactive</option>
                            <option value="1">Active</option>
                        </select>

                        <label className="block text-lg font-bold text-black">Certificate ID</label>
                        <input type="text" name="certificateId" placeholder="Certificate ID..." value={formData.certificateId} onChange={handleChange} className="w-full p-2 border rounded" />

                        <label className="block text-lg font-bold text-black">Certificate Approval Date</label>
                        <input type="date" name="certificateApprovalDate" value={formData.certificateApprovalDate instanceof Date ? formData.certificateApprovalDate.toISOString().split("T")[0]  : formData.certificateApprovalDate} onChange={handleChange} className="w-full p-2 border rounded" />

                        <label className="block text-lg font-bold text-black">Expired Date</label>
                        <input type="date" name="expiredDate" value={formData.expiredDate instanceof Date ? formData.expiredDate.toISOString().split("T")[0] : formData.expiredDate} onChange={handleChange} className="w-full p-2 border rounded" />

                        <label className="block text-lg font-bold text-black">Priority</label>
                        <input type="number" name="priority" placeholder="Priority..." value={formData.priority} onChange={handleChange} className="w-full p-2 border rounded" />

                        <label className="block text-lg font-bold text-black">Show on Home</label>
                        <select name="showOnHome" value={formData.showOnHome ? "1" : "0"} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>

                        {/* Checkbox to enable file upload */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="updateImage"
                                checked={updateImage}
                                onChange={() => setUpdateImage(!updateImage)}
                                className="cursor-pointer"
                            />
                            <label htmlFor="updateImage" className="text-black cursor-pointer">
                                Update Service Image
                            </label>
                        </div>


                        {updateImage && (
                            <>
                            {[
                                { name: "img", label: "Certificate in Image Format", accept: "image/*" },
                                { name: "pdf", label: "Certificate in Pdf format", accept: "application/pdf" },
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
                            </>
                        )}

                        <div className="flex justify-between">
                            <Button type="submit" className="w-1/4 p-7 bg-yellow-400 text-black font-extrabold text-left text-xl hover:bg-yellow-500 hover:text-white transition duration-300" disabled={isLoading}>{isLoading ? "Submitting..." : "Submit Form"}</Button>
                            <Button type="button" className="w-1/4 p-7 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600 text-xl transition duration-300" onClick={handleBack}>Back</Button>
                        </div>
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



