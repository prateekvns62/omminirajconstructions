import ProjectGallery from "@/app/components/gallery/imageProjectGallery";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ongoing Projects - Om Miniraj Building & Construction Services Private Limited",
    description:
      "Welcome to Om Miniraj Building and Construction Services Private Limited, your trusted partner in the world of construction and infrastructure development in India.",
};

export default async function OngoingProjectPage() {
    return <ProjectGallery/>;
}
