"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { message } from "antd";
import { FaChevronLeft, FaChevronRight, FaTimes, FaDownload } from "react-icons/fa";
import PageTitle from "../frontend/pageTitle";


interface ImageType {
  id: number;
  image: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/winners/images")
      .then((res) => res.json())
      .then((data) => {
        if (data.images.length > 0) {
          setImages(data.images);
        }
      })
      .catch(() => message.error("Error loading images."));
  }, []);

  const openPreview = (index: number) => setSelectedImage(index);
  const closePreview = () => setSelectedImage(null);
  const nextImage = () => setSelectedImage((prev) => (prev !== null ? (prev + 1) % images.length : prev));
  const prevImage = () => setSelectedImage((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : prev));
  const downloadImage = () => {
    if (selectedImage !== null) {
      const link = document.createElement("a");
      link.href = images[selectedImage].image;
      link.download = imageName(images[selectedImage].image);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const imageName = (imageUrl: string) =>{
    return imageUrl.replace("/uploads/gallery/", "");
  }

  return (
    <>
    <PageTitle title="Winners" />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="relative w-full overflow-hidden rounded-lg shadow-lg cursor-pointer bg-black"
              onClick={() => openPreview(index)}
            >
              <Image
                src={img.image}
                alt={`Winners Image ${img.id}`}
                width={500}
                height={500}
                className="w-full h-full object-cover transition-opacity duration-500 opacity-0 animate-fadeIn"
                loading="lazy"
                onLoad={(e) => e.currentTarget.classList.add("opacity-100")}
              />
            </div>
          ))}
        </div>

        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex flex-col justify-center items-center z-50">
            <div className="absolute top-5 right-5 flex gap-4 text-white text-2xl">
              <button onClick={downloadImage}><FaDownload /></button>
              <button onClick={closePreview}><FaTimes /></button>
            </div>

            <div className="absolute top-5 left-5 text-white text-lg">
              {selectedImage + 1} / {images.length}
            </div>

            <button className="absolute left-5 text-white text-3xl" onClick={prevImage}>
              <FaChevronLeft />
            </button>

            <div className="flex flex-col items-center">
              <Image
                src={images[selectedImage].image}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-cover opacity-0 transition-opacity duration-500 animate-fadeIn"
                alt="Preview"
                onLoad={(e) => e.currentTarget.classList.add("opacity-100")}
              />
              <div className="text-white text-lg mt-2">{imageName(images[selectedImage].image)}</div>
            </div>

            <button className="absolute right-5 text-white text-3xl" onClick={nextImage}>
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
