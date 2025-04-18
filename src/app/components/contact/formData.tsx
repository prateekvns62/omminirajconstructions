"use client";
import { useState } from "react";
import { Descriptions, Input, Button, message as antdMessage } from "antd";
import { format } from "date-fns";
import '@ant-design/v5-patch-for-react-19';
import PageTitle from "../admin/pagetitle";
import Loader from "../admin/loader";

interface UserType {
  id: number;
  name: string;
  mobile_number: string;
  email: string;
  message: string;
  status: number;
  created_at: string | Date;
  updated_at: string | Date;
}

interface ReplyType {
  id: number;
  message: string;
  created_at: string | Date;
}

export default function FormData({ user, adminReply, contactUsReplyOnce }: { user: UserType, adminReply: ReplyType[], contactUsReplyOnce: boolean }) {
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSendEmail = async (id: number, name: string, email: string, message: string, userMessage: string) => {
    const contactUsReply = {id, name, email, message, userMessage};

    try {
        const response = await fetch(`/api/contact/sendEmail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(contactUsReply), // Passing the object as JSON
        });

        if (response.ok) {
            console.log("Email sent successfully");
        } else {
            console.log("Failed to send email");
        }
    } catch (error) {
        console.log("An error occurred while sending the email.", error);
    }
  };


  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      antdMessage.warning("Please enter a message before sending.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          replyMessage,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        antdMessage.success("Reply sent successfully and saved to database!");
        setReplyMessage("");
        adminReply.push({ id: result.savedReply.id, message: replyMessage, created_at: new Date().toISOString() });
        handleSendEmail(user.id,user.name,user.email,replyMessage,user.message);
      } else {
        antdMessage.error(result.message || "Failed to send the message.");
      }
    } catch (error) {
      console.log(error);
      antdMessage.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageTitle title={`Contact Us Form Detail | Submitted by: ${user.name}`} />

      <div className="p-6 bg-white shadow-md rounded-lg">
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Mobile Number">{user.mobile_number}</Descriptions.Item>
          <Descriptions.Item label="Message">{user.message}</Descriptions.Item>
          <Descriptions.Item label="Created At">
            {format(new Date(user.created_at), "dd MMM yyyy, hh:mm a")}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated At">
            {format(new Date(user.updated_at), "dd MMM yyyy, hh:mm a")}
          </Descriptions.Item>
        </Descriptions>

          {/* Old Replies Section (Visible only if there are replies) */}
          {adminReply.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Replies Sent by Admin</h3>
              {adminReply.map((reply) => (
              <div key={reply.id} className="p-4 border-b last:border-none">
                  <div className="flex items-center">
                  <span className="text-sm text-gray-500">
                      {format(new Date(reply.created_at), "dd MMM yyyy, hh:mm a")}
                  </span>
                  <span className="mx-2 text-gray-500">|</span> {/* Pipe separator */}
                  <span className="text-gray-800">{reply.message}</span>
                  </div>
              </div>
              ))}
          </div>
          )}

        {/* Reply Section */}
        {(!contactUsReplyOnce || adminReply.length === 0) && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Reply Back to Customer</h3>

            <Input.TextArea
              rows={4}
              placeholder="Type your reply message here..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
            <Button type="primary" className="mt-3" loading={loading} onClick={handleSendReply}>
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        )}
      </div>
      {loading && (<Loader/>)}
    </div>
  );
}
