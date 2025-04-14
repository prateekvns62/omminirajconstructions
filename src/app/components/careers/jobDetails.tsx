"use client";
import React from "react";
import { format } from "date-fns";
import { useState } from "react";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import Loader from "../admin/loader";
import '@ant-design/v5-patch-for-react-19';
import CureerOverview from "./careerOverView";
import PageTitle from "../frontend/pageTitle";

interface CareerType {
    id: number;
    jobIdentifire: string;
    jobTitle: string;
    jobDescription: string;
    jobCategory: string;
    jobType: string;
    jobLocation: string;
    status: number;
    createdAt: string | Date;
  }

  interface JobApplicationType {
    name: string;
    email: string;
    contact: string;
    coverLetter: string;
    resume: string | File | null;
    status: number; // 0 - Pending, 1 - Accepted, 2 - Rejected
    submittedBy: number; // 0 - User, 1 - Admin
    jobId: number;
  }

export default function JobDetailPage({ job }: { job: CareerType } ) {
  const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<JobApplicationType>({
        name: "",
        resume: null,
        email: "",
        status: 0,
        contact: "",
        coverLetter: "",
        submittedBy: 0,
        jobId: job.id,
    });

    if (!job) {
      return <p className="text-red-500 text-center">Job not found.</p>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, files } = e.target;
      if (files && files.length > 0) {
          const file = files[0];
          const allowedFormats: { [key: string]: string[] } = {
            resume: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
          };
          
          if (!allowedFormats[name]?.includes(file.type)) {
            message.error(`Invalid file format for ${name}. Please select a valid PDF, DOC, or DOCX file.`);
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
      ["resume"].forEach((key) => {
          const file = formData[key as keyof typeof formData] as File | null;
          if (file) {
              formDataToSend.append(key, file);
          }
      });
  
      try {
          const response = await fetch("/api/jobs/saveJob", {
              method: "POST",
              body: formDataToSend, // Send as FormData, NOT JSON
          });
  
          if (!response.ok) {
            if (response.status === 400) {
              message.error("You have already applied for this job. Duplicate applications are not allowed.");

              setFormData({
                  name: "",
                  resume: null,
                  email: "",
                  status: 0,
                  contact: "",
                  coverLetter: "",
                  submittedBy: 0,
                  jobId: job.id,
              });

              // Reset file names
              setFileNames({});

            } else {
              message.error("Form submission failed. Please try again later.");
            }
          } else{
            message.success("Application submitted successfully!");
            setFormData({
                name: "",
                resume: null,
                email: "",
                status: 0,
                contact: "",
                coverLetter: "",
                submittedBy: 0,
                jobId: job.id,
            });

            // Reset file names
            setFileNames({});
          }
          router.refresh();

      } catch (error) {
          console.error("Submission Error:", error);
          message.error("Something went wrong!");
      } finally {
          setIsLoading(false); // Stop loading
      }
  };
  try {

    return (
      <div>
      <PageTitle title={`Career - ${job.jobTitle}`} />
      <div className="container max-w-7xl md:px-0 mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - Job Details */}
        <div>
          <h1 className="text-3xl font-bold">{job.jobTitle}</h1>
          <p className="text-sm text-gray-500 mt-2">Posted at: {format(new Date(job.createdAt), "dd MMM yyyy, hh:mm a")}</p>
          <p className="text-sm text-gray-500 mt-2">Category: {job.jobCategory} | Type: {job.jobType} | Location: {job.jobLocation}</p>
          <h2 className="text-xl font-bold mt-6">Job Description</h2>
          <div className="mt-2 text-gray-700" dangerouslySetInnerHTML={{ __html: job.jobDescription }} />
        </div>
        
        {/* Right Side - Apply Form */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Apply for this position</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
              <label className="block text-gray-700">Full Name <span className="text-red-500 text-2xl leading-none">*</span></label>
              <input type="text" name="name" placeholder="Full Name..." value={formData.name} onChange={handleChange} className="w-full p-2 border rounded bg-white" required />
            </div>
            <div>
              <label className="block text-gray-700">Email  <span className="text-red-500 text-2xl leading-none">*</span></label>
              <input type="text" name="email" placeholder="Email..." value={formData.email} onChange={handleChange} className="w-full p-2 border rounded bg-white" required />
            </div>
            <div>
              <label className="block text-gray-700">Phone  <span className="text-red-500 text-2xl leading-none">*</span></label>
              <input type="text" name="contact" placeholder="Phone No...." value={formData.contact} onChange={handleChange} className="w-full p-2 border rounded bg-white" required />
            </div>
            <div>
              <label className="block text-gray-700">Cover Letter  <span className="text-red-500 text-2xl leading-none">*</span></label>
              <textarea rows={3} name="coverLetter" placeholder="Cover Letter..." value={formData.coverLetter} onChange={handleChange} className="w-full p-2 border rounded bg-white" required />
            </div>
            {[
              { name: "resume", label: "Upload CV/Resume ", accept: ".pdf,.doc,.docx" },
              ].map((fileInput) => (
                  <div key={fileInput.name}>
                      {/* Label */}
                      <label className="block text-lg font-bold text-black">
                      {fileInput.label} <span className="text-red-500 text-2xl leading-none">*</span>
                      </label>

                      <label className="block border p-3 rounded-md bg-yellow-400 text-black cursor-pointer relative">
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
                      <p className="text-sm text-gray-500">Allowed Types: .pdf, .doc, .docx</p>                    
                  </div>
              ))}

            <div className="flex items-center">
              <input type="checkbox" className="mr-2 w-4 h-4" required />
              <span className="text-gray-700">By using this form you agree with the storage and handling of your data by this website.</span>
            </div>
            <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition duration-300 ease-in-out cursor-pointer" >SUBMIT</button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6 md:px-0"> 
        <CureerOverview/>
      </div>
      {isLoading && (
        <Loader/>
      )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching job details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  }
}
