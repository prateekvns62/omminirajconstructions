"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, Button, Box, CircularProgress, IconButton } from "@mui/material";
import { message } from "antd";
import CloseIcon from "@mui/icons-material/Close";

export default function MediaGallery({ onSelect }: { onSelect: (url: string) => void }) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch images when modal opens
  useEffect(() => {
    if (open) {
      fetchImages();
    }
  }, [open]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/getMediaGallery");
      const data = await response.json();
      if (response.ok) {
        setImages(data.images);
      } else {
        message.error("Failed to fetch media gallery.");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      message.error("Error fetching media.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return message.error("No file selected!");

    const formData = new FormData();
    formData.append("image", selectedFile);

    setUploading(true);
    try {
      const response = await fetch("/api/uploadImage", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setImages((prev) => [data.url, ...prev]); // Add new image at the top
        message.success("Image uploaded successfully!");
      } else {
        message.error(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Something went wrong!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Media Gallery
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Select an Image
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", p: 2 }}>
            {loading ? (
              <CircularProgress />
            ) : images.length > 0 ? (
              images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Gallery"
                  width="100"
                  height="100"
                  style={{
                    cursor: "pointer",
                    borderRadius: "8px",
                    objectFit: "cover",
                    transition: "0.2s",
                    border: "2px solid transparent",
                  }}
                  onClick={() => {
                    onSelect(img);
                    setOpen(false);
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.border = "2px solid #1976d2")}
                  onMouseOut={(e) => (e.currentTarget.style.border = "2px solid transparent")}
                />
              ))
            ) : (
              <p>No images found</p>
            )}
          </Box>

          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
            <Button 
              onClick={handleImageUpload} 
              disabled={!selectedFile || uploading} 
              sx={{ mt: 1 }}
              variant="contained"
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
