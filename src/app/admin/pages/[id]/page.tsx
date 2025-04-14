import { PrismaClient } from "@prisma/client";
import PageBuilder from "@/components/PageBuilder";
import { Container, Typography } from "@mui/material";

const prisma = new PrismaClient();

export default async function PageBuilderPage({ params }: { params: Promise <{ id: string }> }) {
  try {
    const { id } = await params;  // No need to await params

    const pageId = parseInt(id, 10);
    
    if (isNaN(pageId)) return <p className="text-red-500 text-center">Invalid Form ID</p>;

    const page = await prisma.pageContent.findUnique({
      where: { id: pageId },
    });

    return (
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ my: 3 }}>
          Page Builder
        </Typography>
        <PageBuilder page={page} />
      </Container>
    );

  } catch (error) {
    console.error("Error fetching user details:", error);
    return <p className="text-red-500 text-center">Something went wrong. Please try again later.</p>;
  }
}
