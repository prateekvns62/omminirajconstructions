import ImageGallery from "@/app/components/gallery/imageGallery";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gallery - Om Miniraj Building &amp; Construction Services Private Limited",
    description:
      "Welcome to Om Miniraj Building and Construction Services Private Limited, your trusted partner in the world of construction and infrastructure development in India.",
  };

export default async function GalleryPage() {
    return <ImageGallery/>;
}
