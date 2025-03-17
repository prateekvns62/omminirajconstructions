"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PageTitle from "../admin/pagetitle";
import { useRouter } from "next/navigation";
import { message } from "antd";
import Loader from "../admin/loader";
import '@ant-design/v5-patch-for-react-19';

interface TestimonialType {
    id: number;
    customerName: string;
    reviewMessage: string;
    showOnHome: boolean;
  }

export default function UpdateTestimonialsForm({ testimonial }: { testimonial: TestimonialType }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<TestimonialType>(testimonial);

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
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const formDataToSend = new FormData();
    
        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === "string" || typeof value === "boolean") {
                formDataToSend.append(key, String(value));
            }
        });
        
        try {
            const response = await fetch(`/api/testimonials/saveTestimonial/${testimonial.id}`, {
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
            <PageTitle title="Update Testimonials" />
            
            <div className="flex w-full gap-x-8 px-4">
                {/* Left Section (Content) */}
                <div className="w-[72%] p-10 py-8 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block text-lg font-bold text-black">Customer Name <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="text" name="customerName" placeholder="Customer Name..." value={formData.customerName} onChange={handleChange} className="w-full p-2 border rounded" required />

                        <label className="block text-lg font-bold text-black">Review Message</label>
                        <textarea rows={5} name="reviewMessage" placeholder="Review Message..." value={formData.reviewMessage} onChange={handleChange} className="w-full p-2 border rounded" />

                        <label className="block text-lg font-bold text-black">Show on Home</label>
                        <select name="showOnHome" value={formData.showOnHome ? "1" : "0"} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                        
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



