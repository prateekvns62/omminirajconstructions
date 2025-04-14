"use client";
import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTitle from "../admin/pagetitle";
import { useRouter } from "next/navigation";
import { message } from "antd";
import Loader from "../admin/loader";
import '@ant-design/v5-patch-for-react-19';

const initialSettings = [
    { name: "loan_agreement", label: "Loan Agreement", accept: "application/pdf" },
    { name: "customer_agreement", label: "Customer Agreement", accept: "application/pdf" },
    { name: "thekedar_agreement", label: "Thekedar Agreement", accept: "application/pdf" },
    { name: "details_of_material", label: "Details of Material", accept: "application/pdf" },
    { name: "more_information", label: "More Information", accept: "application/pdf" }
  ];

  interface GeneralType {
    id: number;
    key: string;
    title: string;
    value: string | null;
  }

export default function GeneralSettingForm({ general }: { general: GeneralType[] | null }) {
    const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (general && general.length) {
          const fileData: { [key: string]: string } = {};
          
          general.forEach((item) => {
            fileData[item.key] = item.value?.split("/").pop() || "";   // fallback to empty if null
          });
    
          setFileNames(fileData);
        }
      }, [general]);

    const [formData, setFormData] = useState<{
        loan_agreement: File | null;
        customer_agreement: File | null;
        thekedar_agreement: File | null;
        details_of_material: File | null;
        more_information: File | null;
    }>({
        loan_agreement: null,
        customer_agreement: null,
        thekedar_agreement: null,
        details_of_material: null,
        more_information: null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            const file = files[0];
    
            if (file.type !== "application/pdf") {
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
    
        // Append file fields
        ["loan_agreement", "customer_agreement","thekedar_agreement", "details_of_material", "more_information"].forEach((key) => {
            const file = formData[key as keyof typeof formData] as File | null;
            if (file) {
                formDataToSend.append(key, file);
            }
        });
    
        try {
            const response = await fetch("/api/general/settings", {
                method: "POST",
                body: formDataToSend, // Send as FormData, NOT JSON
            });
    
            if (!response.ok) throw new Error("Form submission failed");
    
            const result = await response.json();
            message.success("Form submitted successfully!");
            setTimeout(() => {
                router.push(`/admin/settings/general`);
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
            <PageTitle title="General Settings" />
            
            <div className="flex w-full gap-x-8 px-4">
                {/* Left Section (Content) */}
                <div className="w-[72%] p-10 py-8 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {initialSettings.map((fileInput) => (
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
                            </label>
                        </div>
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



