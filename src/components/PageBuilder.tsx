"use client";
import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import grapesjsPresetWebpage from "grapesjs-preset-webpage";
import grapesjsBlocksBasic from "grapesjs-blocks-basic";
import grapesjsPluginCKEditor from "grapesjs-plugin-ckeditor";
import grapesjsForms from "grapesjs-plugin-forms";
import { Box, Button, TextField, Stack } from "@mui/material";
import { message } from "antd";
import '@ant-design/v5-patch-for-react-19';
import MediaGallery from "./MediaGallery";

interface PagesType {
  id: number;
  identifier: string;
  title: string;
  html: string;
  css: string;
  createdAt: string | Date;
}

export default function PageBuilder({ page }: { page?: PagesType | null }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const [pageIdentifire, setPageIdentifire] = useState(page?.identifier || "");
  const [pageTitle, setPageTitle] = useState(page?.title || "");

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = grapesjs.init({
        container: "#gjs",
        fromElement: true,
        width: "100%",
        height: "1470px",
        plugins: [
          grapesjsPresetWebpage, // Default blocks
          grapesjsBlocksBasic, // Basic blocks
          grapesjsPluginCKEditor, // Rich text editing
          grapesjsForms, // Form elements
        ],
        storageManager: false, // Disable automatic storage
        blockManager: {
          appendTo: "#blocks",
        },
      });

      if (page?.html) {
        editorRef.current.setComponents(page.html);
      }
      if (page?.css) {
        editorRef.current.setStyle(page.css);
      }

      editorRef.current.BlockManager.add("open-media-gallery", {
        label: "Media Gallery",
        category: "Custom Blocks",
        attributes: { class: "fa fa-image" },
        content: {
          tagName: "img",
          attributes: {
            src: "",
            alt: "Click to select image",
            width: "200",
            height: "200",
            style: "background-color: #ccc; display: block; cursor: pointer;",
          },
        },
      });

      editorRef.current.Panels.addButton("options", {
        id: "open-media-gallery",
        className: "fa fa-image",
        command: "open-media-gallery",
        attributes: { title: "Open Media Gallery" },
      });

      editorRef.current.Commands.add("open-media-gallery", {
        run: () => {
          setShowGallery(true); // Open Media Gallery
        },
      });
  
      // Listen for the event
      editorRef.current.on("open-media-gallery", () => {
        setShowGallery(true);
      });

      // Change Panel & Block Background Color to Black
      const style = document.createElement("style");
      style.innerHTML = `
        .gjs-pn-panels, .gjs-pn-views, #blocks {
          background-color: black !important;
        }
        .gjs-pn-btn[title="Open Blocks"] {
          display: none !important; /* Hide Open Blocks Button */
        }
        div.cke_notifications_area {
            display: none !important;
        }
      `;
      document.head.appendChild(style);
    }
    
  }, [page]);

  const [showGallery, setShowGallery] = useState(false);

  const handleImageSelect = (url: string) => {
    const editor = editorRef.current;
    const selectedComponent = editor.getSelected();
    if (selectedComponent && selectedComponent.is("image")) {
      selectedComponent.set("src", url);
    }
    setShowGallery(false);
  };

  const saveHtmlCss =  async () => {
    const editor = editorRef.current;
    const html = editor.getHtml();
    const bodyContent = html.replace(/<\/?body[^>]*>/g, "").trim(); 
    const css = editor.getCss();
    console.log({ pageIdentifire, pageTitle, html: bodyContent, css });
    if(!pageIdentifire){
        message.error("Page Identifire is Requred!");
        return;
    }
    if(!pageTitle){
        message.error("Page Title is Requred!");
        return;
    }
    if(!bodyContent){
        message.error("Page Content is Requred!");
        return;
    }
    try {
      const response = await fetch("/api/savePage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: pageIdentifire,
          title: pageTitle,
          html: bodyContent,
          css,
          ...(page?.id && { id: page.id }),
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        message.success("Page saved successfully");
        if(!page?.id){
          setPageIdentifire("");
          setPageTitle("");
          editor.DomComponents.clear();
          editor.CssComposer.clear();
        }
        
      } else {
        message.error(result.error || "Failed to save page");
      }
    } catch (error) {
      console.error("Error saving page:", error);
      message.error("Something went wrong");
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 2 }}>
        <TextField
            label="Page Identifier"
            variant="outlined"
            sx={{ width: 200, height: 56 }} // Ensures uniform size
            value={pageIdentifire}
            onChange={(e) => setPageIdentifire(e.target.value)}
            required
        />
        <TextField
            label="Page Title"
            variant="outlined"
            sx={{ width: 200, height: 56 }} // Ensures uniform size
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            required
        />
        <Button
            onClick={saveHtmlCss}
            variant="contained"
            sx={{
            height: 56,
            px: 3,
            backgroundColor: "#1976d2",
            "&:hover": {
                backgroundColor: "#155a9a",
            },
            }}
        >
            Save Page
        </Button>
      </Stack>
      <Box sx={{ display: "flex", gap: 0 }}>
        <Box id="blocks" sx={{ width: "250px", p: 2 }} />
        <div id="gjs" style={{ flex: 1 }} />
      </Box>
      {showGallery && <MediaGallery onSelect={handleImageSelect} />}
    </Box>
  );
}
