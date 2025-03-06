"use client";
import { useState } from "react";
import { FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FranchiseForm() {
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
        }
    };
    

    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormData((prev) => ({ ...prev, doYouHave: selectedOptions }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            console.log("Form submitted successfully:", result);
        } catch (error) {
            console.error("Submission Error:", error);
        }
    };

    return (
        <div className="w-full p-8 bg-white-100">
            <h2 className="text-2xl font-semibold mb-4 text-black">Franchise Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Name *" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="text" name="mobileNumber" placeholder="Mobile Number *" value={formData.mobileNumber} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="text" name="address" placeholder="Address for Franchise *" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="text" name="aadhaarCardNumber" placeholder="Aadhaar Card Number *" value={formData.aadhaarCardNumber} onChange={handleChange} className="w-full p-2 border rounded" required />

                {[{ name: "aadharFrontCopy", label: "Aadhaar Card Front" },
                  { name: "aadharBackCopy", label: "Aadhaar Card Back" },
                  { name: "passbookCopy", label: "Bank Passbook" },
                  { name: "panCardCopy", label: "Pan Card" }].map((fileInput) => (
                    <label key={fileInput.name} className="block border p-3 rounded-md bg-yellow-400 text-black cursor-pointer">
                        <div className="flex items-center space-x-2">
                            <FilePlus className="text-black" />
                            <span>{formData[fileInput.name as keyof typeof formData] instanceof File ? (formData[fileInput.name as keyof typeof formData] as File).name : fileInput.label}</span>
                        </div>
                        <input type="file" name={fileInput.name} onChange={handleFileChange} className="hidden" required/>
                    </label>
                ))}

                <input type="text" name="accountNumber" placeholder="Bank Account Number *" value={formData.accountNumber} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="text" name="ifscCode" placeholder="IFSC Code *" value={formData.ifscCode} onChange={handleChange} className="w-full p-2 border rounded" required />
                
                <label className="block font-semibold text-black">Do you have (check all that apply) *</label>
                <select multiple name="doYouHave" onChange={handleMultiSelectChange} className="w-full p-2 border rounded">
                    <option value="Home Paper or Rent Agreement">Home Paper or Rent Agreement</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Printer">Printer</option>
                    <option value="Company Banner or Signage">Company Banner or Signage</option>
                </select>

                <textarea name="message" placeholder="Comment or Message" value={formData.message} onChange={handleChange} className="w-full p-2 border rounded" />
                
                <Button type="submit" className="w-full p-3 bg-yellow-400 text-black font-semibold">SEND</Button>
            </form>
        </div>
    );
    
}



