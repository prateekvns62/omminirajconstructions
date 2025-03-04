import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

interface values {
    [key: string]: any; // Adjust based on actual data structure
}

interface franchise {
    id: number;
    name: string;
    email: string;
    address: string;
    doYouHave: string;
    mobileNumber: string;
    message: string;
    gstNumber?: string | null;
    franchiseId?: string | null;
    franchiseCertificateUrl?: string | null;
    aadhaarCardNumber: string;
    accountNumber: string;
    ifscCode: string;
    passbookCopy: string;
    panCardCopy: string;
    aadharFrontCopy: string;
    aadharBackCopy: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    Status: number;
  }

const generatePDF = async (franchise:franchise,values:values) : Promise<string> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 Landscape
  const { width, height } = page.getSize();
  
  const timesFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  
  // Gold Border
  page.drawRectangle({
    x: 14,
    y: 14,
    width: width - 28,
    height: height - 28,
    borderColor: rgb(0.85, 0.65, 0.13), // Gold color
    borderWidth: 5.8,
  });

  // Company Logo (Centered)
  const logoUrl = "/logo.jpg"; // Place image in `public/` folder
  const logoImageBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
  const logoImage = await pdfDoc.embedJpg(logoImageBytes);
  page.drawImage(logoImage, { x: width / 2 - 57.5, y: height - 115, width: 114, height: 73 });

  // Company Name
  page.drawText("Om Miniraj Building & Construction Services Pvt. Ltd.", {
    x: width / 2 - 191,
    y: height - 190,
    size: 16,
    font:timesBoldFont,
  });

  // Franchise Authorization Title
  page.drawText("Franchise Authorization", {
    x: width / 2 - 157,
    y: height - 256,
    size: 30,
    font:timesBoldFont,
  });

  // Franchisee Name
  page.drawText(franchise.name.toUpperCase(), {
    x: width / 2 - 100,
    y: height - 350,
    size: 20,
    font:timesBoldFont,
  });

  // Separator Line
  page.drawText("---------------------------------------------", {
    x: width / 2 - 100,
    y: height - 355,
    size: 14,
    font: timesFont,
  });

  // Authorized Date
  page.drawText(`Authorized Date: ${new Date().toLocaleDateString()}`, {
    x: width / 2 - 100,
    y: height - 420,
    size: 14,
    font: timesFont,
  });

  // Franchise Message
  const message = `This certificate authorizes the franchise partner to operate under the Om Miniraj Building & Construction Services Pvt. Ltd. brand. The franchisee agrees to comply with the terms and conditions set forth in the franchise agreement.`;
  page.drawText(message, {
    x: 50,
    y: height - 440,
    size: 14,
    font: timesFont,
    maxWidth: width - 100,
    lineHeight: 15,
  });

  // GST Number and Authorized By
  page.drawText(`GST Number: ${values.gstNumber}`, {
    x: 50,
    y: height - 500,
    size: 14,
    font:timesBoldFont,
  });

  page.drawText(`Franchise ID: ${franchise.franchiseId}`, {
    x: 50,
    y: height - 520,
    size: 14,
    font:timesBoldFont,
  });

  page.drawText("Authorized By: Jasbeer Singh", {
    x: width - 240,
    y: height - 500,
    size: 14,
    font:timesBoldFont,
  });

  const pdfBytes = await pdfDoc.save();

  // Send PDF to API route for saving
  const response = await fetch("/api/upload-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pdfBytes: Array.from(new Uint8Array(pdfBytes)), // Convert for API transfer
      filename: `Franchise_Certificate_${franchise.franchiseId}.pdf`,
    }),
  });

  const { fileUrl } = await response.json();
  return fileUrl;
};

export default generatePDF;
