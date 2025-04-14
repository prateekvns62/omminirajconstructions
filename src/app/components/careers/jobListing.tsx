"use client";
import React, { useState, useEffect } from "react";
import CureerOverview from "./careerOverView";
import '@ant-design/v5-patch-for-react-19';
import { Skeleton } from "antd";
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

const JobListing = ({ jobs }: { jobs: CareerType[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate loading time
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredJobs = jobs.filter((job) => {
    return (
      (searchTerm === "" ||
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobLocation.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.category === "" || job.jobCategory === filters.category) &&
      (filters.type === "" || job.jobType === filters.type) &&
      (filters.location === "" || job.jobLocation === filters.location)
    );
  });

  const uniqueCategories = Array.from(new Set(jobs.map((job) => job.jobCategory)));
  const uniqueTypes = Array.from(new Set(jobs.map((job) => job.jobType)));
  const uniqueLocations = Array.from(new Set(jobs.map((job) => job.jobLocation)));

  return (
    <>
    <PageTitle title="Career" />
    <div className="container max-w-7xl mx-auto p-6 mt-8 md:px-0">
      {loading ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : jobs.length === 0 ? (
        <p className="text-center text-lg">Currently, we are not having any openings for now.</p>
      ) : filteredJobs.length === 0 ? (
        <p className="text-center text-lg">No jobs match your search criteria.</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            <input
              type="text"
              placeholder="Search by Title, Category, Type, Location"
              value={searchTerm}
              onChange={handleSearch}
              className="border p-2 rounded w-full md:w-1/3"
            />
            <select name="category" onChange={handleFilterChange} className="border p-2 rounded">
              <option value="">All Categories</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select name="type" onChange={handleFilterChange} className="border p-2 rounded">
              <option value="">All Types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select name="location" onChange={handleFilterChange} className="border p-2 rounded">
              <option value="">All Locations</option>
              {uniqueLocations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <a key={job.id} href={`/career/${job.jobIdentifire}`} className="border p-6 rounded-lg shadow-md hover:shadow-lg block cursor-pointer hover:bg-gray-100 relative group">
                <h3 className="text-xl font-bold">{job.jobTitle}</h3>
                <p className="text-sm text-gray-700"><strong>Category:</strong> {job.jobCategory}</p>
                <p className="text-sm mt-2 text-gray-700"><strong>Type:</strong> {job.jobType}</p>
                <p className="text-sm mt-2 text-gray-700"><strong>Location:</strong> {job.jobLocation}</p>
                <h3 className="mt-2 text-gray-700"><strong>Job Description:</strong></h3>
                <div className="mt-2 text-gray-700 truncate-html h-[48px]" dangerouslySetInnerHTML={{ __html: job.jobDescription }} />
                <span className="text-gray-600 mt-4 block group-hover:text-yellow-500">More Details →</span>
              </a>
            ))}
          </div>
        </>
      )}

      <CureerOverview />

      <style jsx>{`
        .truncate-html {
          display: -webkit-box;
          -webkit-line-clamp: 2; /* Restrict to 2 lines */
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div></>
  );
};

export default JobListing;
