"use client";
import { useState, useEffect } from "react";
import { Descriptions, Tag, Button, Modal, Form, Input, message,Skeleton, Card, Image } from "antd";
import { format } from "date-fns";
import { MailOutlined, DownloadOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import '@ant-design/v5-patch-for-react-19';
import { usePathname, useRouter } from "next/navigation";
import PageTitle from "../admin/pagetitle";
import generatePDF from "./generatePdf";
import Loader from "../admin/loader";

const isImage = (url:any) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
const isPDF = (url:any) => /\.pdf$/i.test(url);

interface FranchiseRecord {
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


const getStatusTag = (status: number) => {
  const tagStyle = { fontSize: "15px", padding: "2px 12px" };
  switch (status) {
    case 0:
      return <Tag icon={<ClockCircleOutlined />} color="blue" style={tagStyle}>Submitted</Tag>;
    case 1:
      return <Tag icon={<CheckCircleOutlined />} color="green" style={tagStyle}>Approved</Tag>;
    case 2:
      return <Tag icon={<CloseCircleOutlined />} color="red" style={tagStyle}>Rejected</Tag>;
    default:
      return <Tag color="default" style={tagStyle}>Unknown</Tag>;
  }
};

export default function FranchiseDetails({ franchise }: { franchise: FranchiseRecord }) {
  const [franchiseData, setFranchiseData] = useState<FranchiseRecord>(franchise);
  const [isApproveModalVisible, setApproveModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const pathname = usePathname() || "/admin";
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreview = (imageUrl:any) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  const renderDocument = (label:any, fileUrl:any) => {
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
    let historyStack: string[] = JSON.parse(sessionStorage.getItem("historyStack") || "[]");

    if (historyStack.length === 0 || historyStack[historyStack.length - 1] !== pathname) {
      historyStack.push(pathname);
      sessionStorage.setItem("historyStack", JSON.stringify(historyStack));
    }

    setPreviousUrl(historyStack.length > 1 ? historyStack[historyStack.length - 2] : null);
  }, [pathname]);


  const handleSendEmail = async () => {
    Modal.confirm({
      title: "Send Email?",
      content: "Are you sure you want to send this email?",
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/franchise/sendEmail`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(franchiseData),
          });
          const result = await response.json();
          if (response.ok) {
            message.success(result.message || "Email sent successfully!");
          } else {
            message.error(result.message || "Failed to send email.");
          }
        } catch (error) {
          message.error("An error occurred while sending the email.");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSendEmailForApproval = async (type:string,gstNumber:any) => {
    try {
      const response = await fetch(`/api/franchise/sendEmail?type=${encodeURIComponent(type)}&gstNumber=${encodeURIComponent(gstNumber)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(franchiseData),
      });
    } catch (error) {
      console.log("An error occurred while sending the email.");
    }
  };
  

  const handleBack = () => {
    let historyStack: string[] = JSON.parse(sessionStorage.getItem("historyStack") || "[]");

    if (historyStack.length > 1) {
      historyStack.pop(); // Remove current page
      const prevPage = historyStack[historyStack.length - 1]; // Get new previous page
      sessionStorage.setItem("historyStack", JSON.stringify(historyStack));
      router.push(prevPage);
    } else {
      router.push("/admin"); // Fallback to dashboard if no history exists
    }
  };

  const fetchFranchiseData = async () => {
    try {
      const response = await fetch(`/api/franchise/${franchise.id}`);
      if (response.ok) {
        const updatedData = await response.json();
        setFranchiseData(updatedData.record);
      }
    } catch (error) {
      message.error("Error fetching updated data");
    }
  };

  useEffect(() => {
    fetchFranchiseData();
  }, []);

  useEffect(() => {
    if (franchiseData) {
      setIsLoading(false);
    }
  }, [franchiseData]);


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

  const handleApprove = () => {
    setApproveModalVisible(true);
  };

  const submitApproval = async (values: any) => {
    setLoading(true);
    try {
      const { gstNumber } = values;
      // Generate PDF and get the URL
      const pdfUrl = await generatePDF(franchise, values);
      console.log("Saved PDF URL:", pdfUrl);
  
      // Assign franchiseCertificateUrl to values
      const updatedValues = { ...values, franchiseCertificateUrl: pdfUrl, status: 1 };
  
      // Make API request with updated values
      const response = await fetch(`/api/franchise/${franchise.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({updatedValues}),
      });
      if (response.ok) {
        message.success("Franchise approved successfully");
        setApproveModalVisible(false);
        fetchFranchiseData();
        handleSendEmailForApproval("approve",gstNumber);
      }
    } catch (error) {
      message.error("An error occurred while approving");
    } finally {
      setLoading(false);
    }
  };
  

  const handleReject = async () => {
    Modal.confirm({
      title: "Are you sure you want to reject this request?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/franchise/${franchise.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: 2 }),
          });
          if (response.ok) {
            message.success("Franchise request rejected");
            fetchFranchiseData();
            handleSendEmailForApproval("reject",null);
          }
        } catch (error) {
          message.error("An error occurred while rejecting");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: "Are you sure you want to delete this record?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/franchise/${franchiseData.id}`, { method: "DELETE" });
          if (response.ok) {
            message.success("Record deleted successfully");
            handleBack();
          }
        } catch (error) {
          message.error("An error occurred while deleting the record");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div>
      <PageTitle title={`Franchise Detail #${franchiseData.franchiseId}`} />
      <div className="p-6 bg-white shadow-md rounded-lg space-y-6">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          {getStatusTag(franchiseData.Status)}
          <span>Franchise | Submitted By: {franchiseData.name}</span>
        </h2>
          <div className="space-x-3">
          {franchiseData.Status === 0 && (
            <>
              <Button
                type="primary"
                size="large"
                className="px-6 py-3 text-lg flex items-center space-x-2 transition-all duration-300 hover:bg-green-600"
                icon={<CheckCircleOutlined />}
                onClick={handleApprove}
              >
                Approve
              </Button>
              <Button
                type="primary"
                size="large"
                danger
                className="bg-red-500 text-white w-[160px] h-[56px] text-xl font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-red-600 hover:shadow-lg flex items-center justify-center"
                icon={<CloseCircleOutlined />}
                onClick={handleReject}
              >
                Reject
              </Button>
            </>
          )}
          {franchiseData.Status === 1 && (
            <>
            {/* Send Email Button */}
                <Button
                  type="primary"
                  size="large"
                  className="bg-blue-500 text-white w-[160px] h-[56px] text-xl font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-blue-600 hover:shadow-lg flex items-center justify-center"
                  icon={<MailOutlined />}
                  onClick={handleSendEmail}
                >
                  Send Email
                </Button>
            <Button
              type="primary"
              size="large"
              danger
              className="bg-red-500 text-white w-[160px] h-[56px] text-xl font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-red-600 hover:shadow-lg flex items-center justify-center"
              icon={<CloseCircleOutlined />}
              onClick={handleReject}
            >
              Reject
            </Button>
            <Button
                type="primary"
                size="large"
                className="px-6 py-3 text-lg flex items-center space-x-2 transition-all duration-300 hover:bg-green-600"
                icon={<CheckCircleOutlined />}
                onClick={handleApprove}
              >
                Re Generate Certificate
              </Button>
            </>
          )}
          {franchiseData.Status === 2 && (
            <>
              <Button
                type="primary"
                size="large"
                className="px-6 py-3 text-lg flex items-center space-x-2 transition-all duration-300 hover:bg-green-600"
                icon={<CheckCircleOutlined />}
                onClick={handleApprove}
              >
                Approve
            </Button>
            <Button
              type="primary"
              size="large"
              danger
              className="bg-gray-700 text-white w-[160px] h-[56px] text-xl font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-gray-800 hover:shadow-lg flex items-center justify-center"
              icon={<DeleteOutlined />}
              onClick={handleDelete}
            >
              Delete
            </Button>
            </>
          )}
        </div>
      </div>
        <div>
          <Descriptions bordered column={2} size="middle" title="Basic Details">
            <Descriptions.Item label="Name">{franchiseData.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{franchiseData.email}</Descriptions.Item>
            <Descriptions.Item label="Mobile Number">{franchiseData.mobileNumber}</Descriptions.Item>
            <Descriptions.Item label="Aadhaar Card Number">{franchiseData.aadhaarCardNumber}</Descriptions.Item>
            <Descriptions.Item label="Account Number">{franchiseData.accountNumber}</Descriptions.Item>
            <Descriptions.Item label="IFSC Code">{franchiseData.ifscCode}</Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>{franchiseData.address}</Descriptions.Item>
            <Descriptions.Item label="Do You Have" span={2}>{franchiseData.doYouHave}</Descriptions.Item>
          </Descriptions>
        </div>

        <div className="mt-4">
        <Descriptions title="Franchise Documents" bordered column={2}>
          <Descriptions.Item label="Passbook Copy" span={2}>
            {renderDocument("Passbook Copy", franchiseData.passbookCopy)}
          </Descriptions.Item>
          <Descriptions.Item label="PAN Card Copy" span={2}>
            {renderDocument("PAN Card Copy", franchiseData.panCardCopy)}
          </Descriptions.Item>
          <Descriptions.Item label="Aadhar Front Copy" span={2}>
            {renderDocument("Aadhar Front Copy", franchiseData.aadharFrontCopy)}
          </Descriptions.Item>
          <Descriptions.Item label="Aadhar Back Copy" span={2}>
            {renderDocument("Aadhar Back Copy", franchiseData.aadharBackCopy)}
          </Descriptions.Item>
        </Descriptions>
        {previewVisible && (
        <Image.PreviewGroup
          preview={{
            visible: previewVisible,
            onVisibleChange: (visible) => !visible && setPreviewVisible(false),
          }}
        >
          <Image src={previewImage} width={0} height={0} />
        </Image.PreviewGroup>
      )}
        </div>


        <div className="mt-4">
          <Descriptions bordered column={1} size="middle" title="Franchise Details">
            <Descriptions.Item label="Franchise ID">{franchiseData.franchiseId || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="GST Number">{franchiseData.gstNumber || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Franchise Certificate URL">
              {franchiseData.franchiseCertificateUrl ? (
                <>
                  <a href={franchiseData.franchiseCertificateUrl} target="_blank" rel="noopener noreferrer">
                    {franchiseData.franchiseCertificateUrl}
                  </a>
                  <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    href={franchiseData.franchiseCertificateUrl}
                    download
                    style={{ marginLeft: 8 }}
                  >
                    Download
                  </Button>
                </>
              ) : (
                "N/A"
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>
        
        <div className="mt-4">
          <Descriptions bordered column={3} size="middle" title="Status Message & Timestamps">
            <Descriptions.Item label="Status">{getStatusTag(franchiseData.Status)}</Descriptions.Item>
            <Descriptions.Item label="Created At">
              {format(new Date(franchiseData.createdAt), "dd MMM yyyy, hh:mm a")}
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated At">
              {format(new Date(franchiseData.updatedAt), "dd MMM yyyy, hh:mm a")}
            </Descriptions.Item>
            <Descriptions.Item label="Message" span={3}>{franchiseData.message}</Descriptions.Item>
          </Descriptions>
        </div>
        <Modal 
            title="Approve Franchise" 
            open={isApproveModalVisible} 
            onCancel={() => setApproveModalVisible(false)} 
            onOk={() => form.submit()}
            width={500} // Increased modal width for better spacing
            centered // Centers the modal on the screen
            className="custom-modal"
          >
            <Form 
              form={form} 
              onFinish={submitApproval} 
              layout="vertical" 
              className="space-y-4 p-4"
              initialValues={{
                gstNumber: franchiseData.gstNumber || "", // Set default value
              }}
            >
              {/* GST Number Field */}
              <Form.Item 
                label={<span className="text-lg font-semibold">GST Number</span>} 
                name="gstNumber"
                rules={[
                  { required: true, message: "Please enter a GST number" }
                ]}
              >
                <Input 
                  placeholder="Enter GST Number" 
                  size="large" 
                  className="rounded-lg border-gray-300 shadow-sm"
                  value={franchiseData.gstNumber || ""}
                />
              </Form.Item>
            </Form>
          </Modal>
      </div>
      {loading && (<Loader/>)}
    </div>
  );
}
