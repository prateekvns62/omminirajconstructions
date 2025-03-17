import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req:any, res:any) {
    
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { type,gstNumber } = req.query;
    const franchiseData = req.body;
    // Define dynamic Franchise Certificate attachment
    const franchiseCertificateFilename = `Franchise_Certificate_${franchiseData.franchiseId}.pdf`;
    const franchiseCertificatePath = path.join(process.cwd(), "public", "uploads", franchiseCertificateFilename);
    const recipientEmail = process.env.DEV_ENV === "1" ? process.env.TEST_EMAIL : franchiseData.email;

    // Setup Nodemailer transporter using SMTP from .env
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
    });

    let mailOptions;

    if(type == "reject"){
        if(franchiseData.gstNumber != "" && fs.existsSync(franchiseCertificatePath)){
            mailOptions = {
                from: process.env.EMAIL_FROM, // Sender email
                to: recipientEmail,
                subject: `${franchiseData.name} - Your Franchise Has Been Canceled`,
                html: `
                    <p>Hi ${franchiseData.name},</p>
                    <p>We regret to inform you that your active franchise has been <strong>canceled</strong> by <strong>Om Miniraj Building & Construction Services Pvt. Ltd.</strong>.</p>
                    <p><strong>Franchise ID:</strong> ${franchiseData.franchiseId}</p>
                    <p><strong>Reason for Cancellation :</strong></p>
                    <ul>
                        <li>Non-compliance with company policies</li>
                        <li>Failure to submit required documents</li>
                        <li>Operational inconsistencies affecting service quality</li>
                        <li>Violation of terms and conditions</li>
                        <li>Financial discrepancies</li>
                    </ul>
                    <p>If you believe this was an error or would like to discuss further, please contact our support team at <a href="mailto:support@omminiraj.com">support@omminiraj.com</a>.</p>
                    <p>Best Regards,</p>
                    <p><strong>Om Miniraj Building & Construction Services Pvt. Ltd.</strong></p>
                    `,
            };
        }else{
            mailOptions = {
                from: process.env.EMAIL_FROM,
                to: recipientEmail,
                subject: `${franchiseData.name} - Your Franchise Request is Rejected`,
                html: `
                  <p>Hi ${franchiseData.name},</p>
                  <p>We regret to inform you that your franchise request has been rejected.</p>
                  <p>Reason: Missing required documents or not meeting the approval criteria.</p>
                  <p>If you have any questions, please contact our support team.</p>
                  <p>Best Regards,</p>
                  <p><strong>Om Miniraj Building & Construction Services Pvt. Ltd.</strong></p>
                `,
              };
        }
        
    } else {
        if (!fs.existsSync(franchiseCertificatePath)) {
            return res.status(400).json({ status:"notOK",message: "Franchise certificate does not exist." });
        }

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
        mailOptions = {
            from: process.env.EMAIL_FROM, // Sender email
            to: "collegevsgoi@gmail.com", // Receiver email
            subject: `${franchiseData.name} - Your Franchise Request is Approved`,
            html: `
            <p>Hi ${franchiseData.name},</p>
            <p>We are pleased to inform you that your request for a franchise has been approved by <strong>Om Miniraj Building & Construction Services Pvt. Ltd.</strong>.</p>
            <p><strong>Your Franchise ID:</strong> ${franchiseData.franchiseId}</p>
            <p><strong>Your GST Number:</strong> ${franchiseData.gstNumber??gstNumber}</p>
            <p>Please download your certificates from the attachments.</p>
            <p>Best Regards,</p>
            <p><strong>Om Miniraj Building & Construction Services Pvt. Ltd.</strong></p>
            `,
            attachments,
        };
    }

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: error });
  }
}
