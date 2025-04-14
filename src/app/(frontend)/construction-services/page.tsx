import { ServicesSection } from "@/app/components/frontend/servicesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Construction Services - Om Miniraj Building & Construction Services Private Limited",
    description:
      "Welcome to Om Miniraj Building and Construction Services Private Limited, your trusted partner in the world of construction and infrastructure development in India.",
};

export default async function ServicesPage() {
    return <ServicesSection/>;
}
