"use client";
import { useState, useEffect } from "react";
import PageTitle from "../frontend/pageTitle";

interface OngoingProject {
  id: number;
  youtubeVideoId: string;
}

export default function ProjectGalleryPage() {
  const [projects, setProjects] = useState<OngoingProject[]>([]);

  useEffect(() => {
    fetch("/api/projects/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.projects.length > 0) {
          setProjects(data.projects);
        }
      })
      .catch(() => console.error("Error loading project videos."));
  }, []);

  return (
    <>
      <PageTitle title="Ongoing Projects" />
      <div className="container mx-auto p-4">
        {/* First 6 videos - 2 in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {projects.slice(0, 6).map((project) => (
            <div key={project.id} className="relative w-full rounded-lg shadow-lg bg-black aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${project.youtubeVideoId}`}
                title="Ongoing Project Video"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full rounded-md"
              ></iframe>
            </div>
          ))}
        </div>

        {/* Remaining videos - 3 in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          {projects.slice(6).map((project) => (
            <div key={project.id} className="relative w-full rounded-lg shadow-lg bg-black aspect-video">
              <iframe
                style={{ height: "650px" }}
                src={`https://www.youtube.com/embed/${project.youtubeVideoId}`}
                title="Ongoing Project Video"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full rounded-md"
              ></iframe>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}