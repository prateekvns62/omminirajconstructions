"use client";
import PageBuilder from "@/components/PageBuilder";
import { Container, Typography } from "@mui/material";

export default function PageBuilderPage() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ my: 3 }}>
        Page Builder
      </Typography>
      <PageBuilder />
    </Container>
  );
}
