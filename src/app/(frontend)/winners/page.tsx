import ImageGallery from "@/app/components/gallery/imageWinnersGallery";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Winners - Om Miniraj Building & Construction Services Private Limited",
    description:
      "Welcome to Om Miniraj Building and Construction Services Private Limited, your trusted partner in the world of construction and infrastructure development in India.",
};

export default async function WinnersPage() {
    return <ImageGallery/>;
}
