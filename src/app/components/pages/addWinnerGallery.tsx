"use client";
import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PageTitle from "../admin/pagetitle";
import { message } from "antd";
import '@ant-design/v5-patch-for-react-19';
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Image {
  id: number;
  image: string;
  position: number;
}

export default function AdminWinnerGallery() {
  const [images, setImages] = useState<Image[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = () => {
    fetch("/api/winners/images")
      .then((res) => res.json())
      .then((data) => setImages(data.images));
  }
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/winners/upload", { method: "POST", body: formData });
    const data = await res.json();
    message.success("Image Uploaded");
    if (data.image.id) {
      setImages((prevImages) => [...prevImages, data.image]);
      setFile(null); // Reset file after upload
      router.refresh();
    }
  };

  const handleDelete = async (id: number, image: string) => {
    await fetch("/api/winners/delete", { 
      method: "DELETE", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ id, image }) 
    });

    setImages((prevImages) => prevImages.filter((img) => img.id !== id));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(oldIndex, 1);
    updatedImages.splice(newIndex, 0, movedImage);

    setImages([...updatedImages]);

    fetch("/api/winners/reorder", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: updatedImages }) 
    });
  };

  return (
    <div>
      <PageTitle title="Winners Page" />
      <form onSubmit={handleUpload} className="bg-white p-3 rounded-lg shadow-md w-full max-w-md mx-4">
        <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-22 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg 
                className="w-10 h-10 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
                >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M7 16V12M17 16V12M12 20H12M4 12l8-8 8 8M12 4v16">
                </path>
                </svg>
                <p className="text-sm text-gray-500">Click to upload Image or drag & drop</p>
                <p className="text-xs text-gray-400">PNG, JPG, JPEG (Max: 5MB)</p>
            </div>
            <input 
                type="file" 
                accept="image/*" 
                className="hidden"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFile(e.target.files ? e.target.files[0] : null)
                } 
            />
            </label>
        </div>

        {file && (
            <p className="mt-2 text-green-600 text-sm font-medium">
            {file.name} selected ✔️
            </p>
        )}

        <button 
            type="submit" 
            disabled={!file} 
            className={`mt-4 w-full px-4 py-2 text-white font-bold rounded-lg transition-all 
            ${file ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 shadow-lg" 
                    : "bg-gray-300 cursor-not-allowed"}`
            }
        >
            Upload
        </button>
      </form>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map((img) => img.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {images.map((img) => (
              <SortableImage key={img.id} image={img} onDelete={handleDelete} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableImage({ image, onDelete }: { image: Image; onDelete: (id: number, url: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative">
      <Image 
        src={image.image} 
        alt="Uploaded" 
        width={300} // Set appropriate width
        height={200} // Set appropriate height
        className="w-full h-40 object-cover rounded-md"
      />
      <button
        onClick={() => onDelete(image.id, image.image)}
        onPointerDown={(e) => e.stopPropagation()} // Prevents drag when clicking delete
        className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full"
      >
        ✖
      </button>
    </div>
  );
}

