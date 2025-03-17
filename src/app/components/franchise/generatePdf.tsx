import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface values {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const timesItalicFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  
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

  const companyName = "Om Miniraj Building & Construction Services Pvt. Ltd.";
  const textWidth = timesBoldFont.widthOfTextAtSize(companyName, 16);
  page.drawText(companyName, {
    x: (width / 2) - (textWidth/2),
    y: height - 190,
    size: 16,
    font:timesBoldFont,
  });

  // Franchise Authorization Title
  const AytorizationText = "Franchise Authorization";
  page.drawText(AytorizationText, {
    x: (width / 2) - 157,
    y: height - 256,
    size: 30,
    font:timesBoldFont,
  });

  // Franchisee Name
  const fname = franchise.name.toUpperCase();
  const ftextWidth = timesBoldFont.widthOfTextAtSize(fname, 20);
  page.drawText(fname, {
    x: (width-ftextWidth)/2,
    y: height - 333,
    size: 20,
    font:timesBoldFont,
  });

  // Separator Line
  const dtextWidth = timesBoldFont.widthOfTextAtSize("---------------------------------------------", 20);
  page.drawText("---------------------------------------------", {
    x: (width / 2) - (dtextWidth/2),
    y: height - 353,
    size: 20,
    font: timesFont,
  });

  // Authorized Date //February 19, 2025
  const authorizationDate = `Authorized Date: ${new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;
  const atextWidth = timesItalicFont.widthOfTextAtSize(authorizationDate, 14);
  page.drawText(authorizationDate, {
    x: (width / 2) - (atextWidth/2),
    y: height - 400,
    size: 14,
    font: timesItalicFont,
  });

  // Franchise Message
  const message1 = `This certificate authorizes the franchise partner to operate under the Om Miniraj Building & Construction Services Pvt. Ltd. brand.`;
  const m1textWidth = timesBoldFont.widthOfTextAtSize(message1, 14);
  const message2 = `The franchisee agrees to comply with the terms and conditions set forth in the franchise agreement.`;
  const m2textWidth = timesBoldFont.widthOfTextAtSize(message2, 14);
  page.drawText(message1, {
    x: (width / 2) - (m1textWidth/2) + 25,
    y: height - 438,
    size: 14,
    font: timesFont,
  });
  page.drawText(message2, {
    x: (width / 2) - (m2textWidth/2),
    y: height - 455,
    size: 14,
    font: timesFont,
  });

  // GST Number and Authorized By
  page.drawText(`GST Number: ${values.gstNumber}`, {
    x: 35,
    y: height - 523,
    size: 14,
    font:timesBoldFont,
  });

  page.drawText(`Franchise ID: ${franchise.franchiseId}`, {
    x: 35,
    y: height - 543,
    size: 14,
    font:timesBoldFont,
  });

  page.drawText("Authorized By: Jasbeer Singh", {
    x: width - 225,
    y: height - 543,
    size: 14,
    font:timesBoldFont,
  });

  const signatureUrl = "/seal_sign.PNG"; // Place image in public/ folder
  const signatureBytes = await fetch(signatureUrl).then((res) => res.arrayBuffer());
  const signatureImage = await pdfDoc.embedPng(signatureBytes);
  page.drawImage(signatureImage, { x: width - 235, y: height - 567, width: 205, height: 113.5 });


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
