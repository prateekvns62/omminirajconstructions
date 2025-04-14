"use client";
import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PageTitle from "../admin/pagetitle";
import { message } from "antd";
import { useRouter } from "next/navigation";
import '@ant-design/v5-patch-for-react-19';

interface OngoingProjects {
  id: number;
  youtubeVideoId: string;
  position: number;
}

export default function AdminProjectGallery() {
  const [projects, setProjects] = useState<OngoingProjects[]>([]);
  const [youtubeVideoId, setYoutubeVideoId] = useState("");
  const [draggingId, setDraggingId] = useState<number | null>(null); // Track dragging item

  const router = useRouter();

  useEffect(() => {
    fetchGalleryVideos();
  }, []);

  const fetchGalleryVideos = async () => {
    const res = await fetch("/api/projects/projects");
    const data = await res.json();
    setProjects(data.projects);
  };

  const validateYouTubeVideo = async (videoId: string) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    try {
      const res = await fetch(url);
      return res.ok;
    } catch (error) {
      console.error("YouTube Video Validation Error:", error);
      return false;
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!youtubeVideoId.trim()) return;

    const isValid = await validateYouTubeVideo(youtubeVideoId);
    if (!isValid) {
      message.error("Invalid YouTube Video ID! Please enter a valid video.");
      return;
    }

    const res = await fetch("/api/projects/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ youtubeVideoId }),
    });

    const data = await res.json();
    message.success("Video Uploaded");
    if (data.project.id) {
      setProjects((prevVideos) => [...prevVideos, data.project]);
      setYoutubeVideoId("");
      router.refresh();
    }
  };

  const handleDelete = async (id: number) => {
    await fetch("/api/projects/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setProjects((prevVideos) => prevVideos.filter((video) => video.id !== id));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragStart = (event: any) => {
    setDraggingId(event.active.id);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    setDraggingId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((video) => video.id === active.id);
    const newIndex = projects.findIndex((video) => video.id === over.id);

    const updatedVideos = arrayMove(projects, oldIndex, newIndex);
    setProjects(updatedVideos);

    fetch("/api/projects/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projects: updatedVideos }),
    });
  };

  return (
    <div>
      <PageTitle title="Projects Page" />
      <form onSubmit={handleUpload} className="bg-white p-3 rounded-lg shadow-md w-full max-w-md mx-4">
        <input
          type="text"
          placeholder="Enter YouTube Video ID"
          value={youtubeVideoId}
          onChange={(e) => setYoutubeVideoId(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <button
          type="submit"
          disabled={!youtubeVideoId.trim()}
          className={`w-full px-4 py-2 text-white font-bold rounded-lg transition-all 
            ${youtubeVideoId.trim() ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 shadow-lg" 
                                    : "bg-gray-300 cursor-not-allowed"}`}
        >
          Upload
        </button>
      </form>

      <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map((video) => video.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-3 gap-12 mt-4">
            {projects.map((video) => (
              <SortableVideo key={video.id} video={video} onDelete={handleDelete} draggingId={draggingId} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableVideo({ video, onDelete, draggingId }: { video: OngoingProjects; onDelete: (id: number) => void; draggingId: number | null }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: video.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform) || "none",
    transition: transition || "none",
    zIndex: draggingId === video.id ? 1000 : 1,
    position: "relative",
  };

  return (
    <div ref={setNodeRef} style={style} className="relative bg-gray-100 rounded-lg shadow-md p-2">
      {/* Move Icon */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 bg-transparent text-black border border-black px-2 py-1 rounded cursor-grab hover:bg-gray-300/40"
      >
        ≡
      </button>

      {/* Video */}
      <iframe
        width="100%"
        height="200"
        src={`https://www.youtube.com/embed/${video.youtubeVideoId}`}
        title="YouTube video"
        frameBorder="0"
        allowFullScreen
        className="rounded-md"
      ></iframe>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(video.id)}
        onPointerDown={(e) => e.stopPropagation()} // Prevents drag cancel when clicking delete
        className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full"
      >
        ✖
      </button>
    </div>
  );
}
