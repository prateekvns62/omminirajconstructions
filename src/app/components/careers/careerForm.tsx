"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PageTitle from "../admin/pagetitle";
import { useRouter } from "next/navigation";
import { message } from "antd";
import Loader from "../admin/loader";
import '@ant-design/v5-patch-for-react-19';
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Heading from "@tiptap/extension-heading";

export default function CareerForm() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<{
        jobTitle: string;
        jobIdentifire: string;
        jobDescription: string;
        jobCategory: string;
        jobType: string;
        jobLocation: string;
        status: number;
    }>({
        jobTitle: "",
        jobIdentifire: "",
        jobDescription: "",
        jobCategory: "",
        jobType: "",
        jobLocation: "",
        status: 1,
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Bold,
            Italic,
            Underline,
            BulletList,
            OrderedList,
            Heading.configure({ levels: [1, 2, 3] }),
        ],
        content: formData.jobDescription || "",
        onUpdate: ({ editor }) => {
            setFormData((prev) => ({ ...prev, jobDescription: editor.getHTML() }));
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
    
        try {
            const response = await fetch("/api/careers/saveCareer", {
                method: "POST",
                body: formDataToSend, // Send as FormData, NOT JSON
            });
    
            if (!response.ok) throw new Error("Form submission failed");
    
            const result = await response.json();
            message.success("Form submitted successfully!");
            setTimeout(() => {
                router.push(`/admin/careers/${result.career.id}`);
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
            <PageTitle title="Add New Job" />
            
            <div className="flex w-full gap-x-8 px-4">
                {/* Left Section (Content) */}
                <div className="w-[72%] p-10 py-8 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block text-lg font-bold text-black">Job Identifire <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="text" name="jobIdentifire" placeholder="Job Identifire..." value={formData.jobIdentifire} onChange={handleChange} className="w-full p-2 border rounded" required />


                        <label className="block text-lg font-bold text-black">Job title <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="text" name="jobTitle" placeholder="Job title..." value={formData.jobTitle} onChange={handleChange} className="w-full p-2 border rounded" required />

                        <label className="block text-lg font-bold text-black">Job Description <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <div className="w-full min-h-[200px] border rounded p-2 bg-white">
                            {/* Toolbar */}
                            {editor && (
                                <div className="mb-2 flex gap-2 border-b pb-2">
                                    <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="p-2 border rounded">Bold</button>
                                    <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="p-2 border rounded">Italic</button>
                                    <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className="p-2 border rounded">Underline</button>
                                    <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="p-2 border rounded">Bullet List</button>
                                    <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className="p-2 border rounded">Ordered List</button>
                                    <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="p-2 border rounded">H2</button>
                                </div>
                            )}
                            {/* Editor Content */}
                            {editor ? <EditorContent editor={editor} className="h-full min-h-[150px] overflow-auto" /> : <p>Loading editor...</p>}
                        </div>
                        <label className="block text-lg font-bold text-black">Job Category <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="text" name="jobCategory" placeholder="Job Category..." value={formData.jobCategory} onChange={handleChange} className="w-full p-2 border rounded" required />

                        <label className="block text-lg font-bold text-black">Job Type <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="text" name="jobType" placeholder="Job Type..." value={formData.jobType} onChange={handleChange} className="w-full p-2 border rounded" required />
                        
                        <label className="block text-lg font-bold text-black">Job Location <span className="text-red-500 text-2xl leading-none">*</span></label>
                        <input type="text" name="jobLocation" placeholder="Job Location..." value={formData.jobLocation} onChange={handleChange} className="w-full p-2 border rounded" required />

                        <label className="block text-lg font-bold text-black">Status</label>
                        <select name="status" value={formData.status ? "1": "0"} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="0">Inactive</option>
                            <option value="1">Active</option>
                        </select>

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



