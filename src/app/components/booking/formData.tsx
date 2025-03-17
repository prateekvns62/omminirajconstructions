"use client";
import { useState, useEffect } from "react";
import { Descriptions, Tag, Button, Modal, message,Skeleton, Card, Image } from "antd";
import { format } from "date-fns";
import { DownloadOutlined, CheckCircleOutlined, MailOutlined, ClockCircleOutlined, SyncOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import '@ant-design/v5-patch-for-react-19';
import { usePathname, useRouter } from "next/navigation";
import PageTitle from "../admin/pagetitle";
import Loader from "../admin/loader";

const isImage = (url:string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
const isPDF = (url:string) => /\.pdf$/i.test(url);

interface BookingType {
  id: number;
  bookingId: string;
  name: string;
  email: string;
  aadhaarCardNumber: number;
  workBy: string;
  workThrough: string;
  plotSize: string;
  area: number;
  photo?: string | null;  // <-- Allow null
  aadharFrontCopy?: string | null; 
  aadharBackCopy?: string | null; 
  panCardCopy?: string | null; 
  registryCopy?: string | null; 
  franchise_id?: string | null;
  status: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  paymentDetails?: PaymentDetailsType | null;  // <-- Allow null
}


interface PaymentDetailsType {
  id: number;
  bookingId: string;
  paymentMethod: string;
  transactionId: string;
  amount: number;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}


const getStatusTag = (status: string) => {
  const tagStyle = { fontSize: "15px", padding: "2px 12px" };
  switch (status) {
    case "SUCCESS":
      return <Tag icon={<ClockCircleOutlined />} color="green" style={tagStyle}>SUCCESS</Tag>;
    default:
      return <Tag color="default" style={tagStyle}>Unknown</Tag>;
  }
};

const getBookingStatusTag = (status: number) => {
  const tagStyle = { fontSize: "15px", padding: "2px 12px" };
  switch (status) {
    case 0:
      return <Tag icon={<ClockCircleOutlined />} color="blue" style={tagStyle}>Submitted</Tag>;
    case 1:
      return <Tag icon={<SyncOutlined spin />} color="orange" style={tagStyle}>In Progress</Tag>;
    case 2:
      return <Tag icon={<CheckCircleOutlined />} color="green" style={tagStyle}>Completed</Tag>;
    case 3:
      return <Tag icon={<ExclamationCircleOutlined />} color="red" style={tagStyle}>Payment Pending</Tag>;
    case 4:
        return <Tag icon={<CloseCircleOutlined />} color="red" style={tagStyle}>Rejected</Tag>;
    default:
      return <Tag color="default" style={tagStyle}>Unknown</Tag>;
  }
};

export default function FranchiseDetails({ booking }: { booking: BookingType }) {
  const [bookingData, setBookingData] = useState<BookingType>(booking);
  const [paymentData, setPaymentData] = useState<PaymentDetailsType | null>(booking.paymentDetails ?? null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname() || "/admin";
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreview = (imageUrl:string) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  const renderDocument = (label:string, fileUrl:string) => {
    if (!fileUrl) return "N/A";

    if (isPDF(fileUrl)) {
      return (
        <>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            href={fileUrl}
            download
            style={{ marginLeft: 8 }}
          >
            Download
          </Button>
        </>
      );
    } else if (isImage(fileUrl)) {
      return (
        <>
          <Image
            width={50}
            src={fileUrl}
            preview={{ visible: false }} // ✅ Uses built-in preview only
            onClick={() => handlePreview(fileUrl)}
            style={{ cursor: "pointer", marginRight: 8 }}
            alt="Image"
          />
          <Button
            type="link"
            icon={<DownloadOutlined />}
            href={fileUrl}
            download
          >
            Download
          </Button>
        </>
      );
    }

    return "Unsupported file type";
  };

  useEffect(() => {
    const historyStack: string[] = JSON.parse(sessionStorage.getItem("historyStack") || "[]");

    if (historyStack.length === 0 || historyStack[historyStack.length - 1] !== pathname) {
      historyStack.push(pathname);
      sessionStorage.setItem("historyStack", JSON.stringify(historyStack));
    }
  }, [pathname]);


  const handleSendEmail = async () => {
    Modal.confirm({
      title: "Send Email?",
      content: "Are you sure you want to send this email?",
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/booking/sendEmail`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bookingData),
          });
          const result = await response.json();
          if (response.ok) {
            message.success(result.message || "Email sent successfully!");
          } else {
            message.error(result.message || "Failed to send email.");
          }
        } catch (error) {
          console.log(error);
          message.error("An error occurred while sending the email.");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const updateStatus = async (status: number) => {
    if (!bookingData?.id) {
        message.error("Booking ID is missing.");
        return;
    }
    Modal.confirm({
        title: "Update Status",
        content: "Are you sure you want to update the status?",
        onOk: async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/booking/updateStatus`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: bookingData.id, status }), // Using bookingData.id directly
                });
                const result = await response.json();
                if (response.ok) {
                    message.success(result.message || "Status updated successfully!");
                    fetchBookingDetails(bookingData.id);
                } else {
                    message.error(result.message || "Failed to update status.");
                }
            } catch (error) {
                console.log(error);
                message.error("An error occurred while updating the status.");
            } finally {
              setLoading(false);
            }
        },
      });
    };

    const fetchBookingDetails = async (id: number) => {
      try {
        const response = await fetch(`/api/booking/${id}`, {
          method: "GET",
        });

        const updatedData = await response.json();
        
        setBookingData(updatedData.record);
        setPaymentData(updatedData.record.paymentDetails ?? null);
      } catch (error) {
        console.log(error);
        console.error("Error fetching updated booking details:", error);
      }
    };

    const handleDelete = async (id: number) => {
      Modal.confirm({
        title: "Are you sure you want to delete this record?",
        icon: <ExclamationCircleOutlined />,
        content: "This action cannot be undone.",
        okText: "Yes, Delete",
        cancelText: "Cancel",
        onOk: async () => {
          setLoading(true);
          try {
            const response = await fetch(`/api/booking/${id}`, { method: "DELETE" });
            if (response.ok) {
              message.success("Record deleted successfully");
              router.push("/admin/booking-form");
            } else {
              message.error("Failed to delete record");
            }
          } catch (error) {
            console.log(error);
            message.error("An error occurred while deleting the record");
          } finally {
            setLoading(false);
          }
        },
      });
    };


  useEffect(() => {
    if (bookingData) {
      setIsLoading(false);
    }
  }, [bookingData]);


  if (isLoading) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg space-y-6">
        <Skeleton active />
        <Card className="p-4">
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>
        <Card className="p-4">
          <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageTitle title={`Booking Detail #${bookingData.bookingId}`} />
      <div className="p-6 bg-white shadow-md rounded-lg space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
          <span>Booking Status: </span>{getBookingStatusTag(bookingData!.status)}
          </h2>
          <div className="space-x-3">
            {/* Show the button if paymentData is missing or payment is not successful */}
            {!paymentData || paymentData.status !== "SUCCESS" ? (
                <Button type="primary"
                  size="large"
                  className="bg-blue-500 text-white h-[60px] text-xl font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-blue-600 hover:shadow-lg flex items-center justify-center"
                  icon={<MailOutlined />}
                  onClick={() => handleSendEmail()}>
                    Send Payment Reminder
                  </Button>
                ) : null}

              { bookingData!.status == 0 && (
                <Button type="primary"
                size="large"
                className="bg-orange-500 hover:bg-orange-600 text-white h-[60px] text-xl font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center"
                icon={<SyncOutlined />}
                onClick={() => updateStatus(1)}>
                  Mark In Progress
                </Button>
              )}

              { bookingData!.status == 1 && (
                <Button type="primary"
                size="large"
                className="bg-red-500 hover:bg-green-600 text-white h-[60px] text-xl font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center"
                icon={<CheckCircleOutlined />}
                onClick={() => updateStatus(2)}>
                  Mark as Completed
                </Button>
              )}
              { bookingData!.status != 4 && (
                <Button
                  type="primary"
                  size="large"
                  danger
                  className="bg-red-500 text-white w-[160px] h-[56px] text-xl font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-red-600 hover:shadow-lg flex items-center justify-center"
                  icon={<CloseCircleOutlined />}
                  onClick={() => updateStatus(4)}>
                  Reject
                </Button>
              )}

              { bookingData!.status == 4 && (
                <Button
                  type="primary"
                  size="large"
                  danger
                  className="bg-red-500 text-white w-[160px] h-[56px] text-xl font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-red-600 hover:shadow-lg flex items-center justify-center"
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleDelete(bookingData.id)}>
                  Delete
                </Button>
              )}
              
          </div>
        </div>
        <div>
          <Descriptions bordered column={2} size="middle" title="Basic Details">
            <Descriptions.Item label="Name"><strong>{bookingData.name}</strong></Descriptions.Item>
            <Descriptions.Item label="Email"><strong>{bookingData.email}</strong></Descriptions.Item>
            <Descriptions.Item label="Aadhaar Card Number"><strong>{bookingData.aadhaarCardNumber}</strong></Descriptions.Item>
            <Descriptions.Item label="Work By"><strong>{bookingData.workBy}</strong></Descriptions.Item>
            <Descriptions.Item label="Work Through"><strong>{bookingData.workThrough}</strong></Descriptions.Item>
            {bookingData.franchise_id !== "" && bookingData.franchise_id !== null && (
                <Descriptions.Item label="Franchise Id"><strong>{bookingData.franchise_id}</strong></Descriptions.Item>
            )}
            <Descriptions.Item label="Area"><strong>{bookingData.area}  sq.ft.</strong></Descriptions.Item>
            <Descriptions.Item label="Booking Amount"><strong>{bookingData.plotSize} INR</strong></Descriptions.Item>
          </Descriptions>
        </div>

        <div className="mt-4">
          <Descriptions bordered column={1} size="middle" title="Booking Payment Details">
            {paymentData ? (
              <>
                <Descriptions.Item label="Payment Method">{paymentData.paymentMethod}</Descriptions.Item>
                <Descriptions.Item label="Transaction ID">{paymentData.transactionId}</Descriptions.Item>
                <Descriptions.Item label="Amount Paid">{paymentData.amount} INR</Descriptions.Item>
                <Descriptions.Item label="Payment Status">{getStatusTag(paymentData.status)}</Descriptions.Item>
              </>
            ) : (
              <Descriptions.Item label="Payment Status">
                <span className="text-red-500">
                  No payment has been received for this booking. Please resend the payment link to complete the transaction.
                </span>
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>


        <div className="mt-4">
          <Descriptions title="Booking Documents" bordered column={2}>
            <Descriptions.Item label="Photo" span={2}>
              {renderDocument("Photo", bookingData.photo as string)}
            </Descriptions.Item>
            <Descriptions.Item label="Aadhar Front Copy" span={2}>
              {renderDocument("Aadhar Front Copy", bookingData.aadharFrontCopy as string)}
            </Descriptions.Item>
            <Descriptions.Item label="Aadhar Back Copy" span={2}>
              {renderDocument("Aadhar Back Copy", bookingData.aadharBackCopy as string)}
            </Descriptions.Item>
            <Descriptions.Item label="PAN Card Copy" span={2}>
              {renderDocument("PAN Card Copy", bookingData.panCardCopy as string)}
            </Descriptions.Item>
            <Descriptions.Item label="Registry Copy" span={2}>
              {renderDocument("Registry Copy", bookingData.registryCopy as string)}
            </Descriptions.Item>
          </Descriptions>
          {previewVisible && (
            <Image.PreviewGroup
              preview={{
                visible: previewVisible,
                onVisibleChange: (visible) => !visible && setPreviewVisible(false),
              }}
            >
              <Image src={previewImage} width={0} height={0} alt="Document Image" />
            </Image.PreviewGroup>
          )}
        </div>
        
        <div className="mt-4">
          <Descriptions bordered column={3} size="middle" title="Status Message & Timestamps">
            {/* <Descriptions.Item label="Status">{getStatusTag(bookingData.Status)}</Descriptions.Item> */}
            <Descriptions.Item label="Created At">
              {format(new Date(bookingData.createdAt), "dd MMM yyyy, hh:mm a")}
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated At">
              {format(new Date(bookingData.updatedAt), "dd MMM yyyy, hh:mm a")}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
      {loading && (<Loader/>)}
    </div>
  );
}
