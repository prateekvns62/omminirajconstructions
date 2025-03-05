import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

export default async function handler(req:any, res:any) {
    
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const franchiseData = req.body;

    // Define dynamic Franchise Certificate attachment
    const franchiseCertificateFilename = `Franchise_Certificate_${franchiseData.franchiseId}.pdf`;
    const franchiseCertificatePath = path.join(process.cwd(), "public", "uploads", franchiseCertificateFilename);

    if (!fs.existsSync(franchiseCertificatePath)) {
      return res.status(400).json({ status:"notOK",message: "Franchise certificate does not exist." });
    }
    
    
    // Setup Nodemailer transporter using SMTP from .env
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    
      const staticAttachments = [
        "certificate-of-recognisaton.pdf",
        "Viksit-Bharat-omminiraj.pdf",
        "rules_of_construction_work.pdf",
      ].map((filename) => ({
        filename,
        path: path.join(process.cwd(), "public", "uploads", filename),
      }));
  
      
      // Combine all attachments
      const attachments = [
        {
          filename: franchiseCertificateFilename,
          path: franchiseCertificatePath,
        },
        ...staticAttachments,
      ];
     
    // Define email details
    const mailOptions = {
      from: process.env.EMAIL_FROM, // Sender email
      to: "collegevsgoi@gmail.com", // Receiver email
      subject: `${franchiseData.name} - Your Franchise Request is Approved`,
      html: `
        <p>Hi ${franchiseData.name},</p>
        <p>We are pleased to inform you that your request for a franchise has been approved by <strong>Om Miniraj Building & Construction Services Pvt. Ltd.</strong>.</p>
        <p><strong>Your Franchise ID:</strong> ${franchiseData.franchiseId}</p>
        <p><strong>Your GST Number:</strong> ${franchiseData.gstNumber}</p>
        <p>Please download your certificates from the attachments.</p>
        <p>Best Regards,</p>
        <p><strong>Om Miniraj Building & Construction Services Pvt. Ltd.</strong></p>
      `,
      attachments,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: error });
  }
}
