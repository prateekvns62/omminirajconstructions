"use client";
import { useState, useEffect } from "react";
import { Descriptions, Tag, Button, Modal, Form, Input, message,Skeleton, Card  } from "antd";
import { format } from "date-fns";
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import '@ant-design/v5-patch-for-react-19';
import { usePathname, useRouter } from "next/navigation";
import PageTitle from "../admin/pagetitle";
import generatePDF from "./generatePdf";


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
  const [form] = Form.useForm();
  const router = useRouter();
  const pathname = usePathname() || "/admin";
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);

  useEffect(() => {
    let historyStack: string[] = JSON.parse(sessionStorage.getItem("historyStack") || "[]");

    if (historyStack.length === 0 || historyStack[historyStack.length - 1] !== pathname) {
      historyStack.push(pathname);
      sessionStorage.setItem("historyStack", JSON.stringify(historyStack));
    }

    setPreviousUrl(historyStack.length > 1 ? historyStack[historyStack.length - 2] : null);
  }, [pathname]);

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
    try {
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
      }
    } catch (error) {
      message.error("An error occurred while approving");
    }
  };
  

  const handleReject = async () => {
    Modal.confirm({
      title: "Are you sure you want to reject this request?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          const response = await fetch(`/api/franchise/${franchise.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: 2 }),
          });
          if (response.ok) {
            message.success("Franchise request rejected");
            fetchFranchiseData();
          }
        } catch (error) {
          message.error("An error occurred while rejecting");
        }
      },
    });
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: "Are you sure you want to delete this record?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          const response = await fetch(`/api/franchise/${franchiseData.id}`, { method: "DELETE" });
          if (response.ok) {
            message.success("Record deleted successfully");
            handleBack();
          }
        } catch (error) {
          message.error("An error occurred while deleting the record");
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
          )}
          {franchiseData.Status === 2 && (
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
            <Descriptions.Item label="Passbook Copy" span={2}>{franchiseData.passbookCopy}</Descriptions.Item>
            <Descriptions.Item label="PAN Card Copy" span={2}>{franchiseData.panCardCopy}</Descriptions.Item>
            <Descriptions.Item label="Aadhar Front Copy" span={2}>{franchiseData.aadharFrontCopy}</Descriptions.Item>
            <Descriptions.Item label="Aadhar Back Copy" span={2}>{franchiseData.aadharBackCopy}</Descriptions.Item>
          </Descriptions>
        </div>

        <div className="mt-4">
          <Descriptions bordered column={1} size="middle" title="Franchise Details">
            <Descriptions.Item label="GST Number">{franchiseData.gstNumber || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Franchise ID">{franchiseData.franchiseId || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Franchise Certificate URL">{franchiseData.franchiseCertificateUrl || "N/A"}</Descriptions.Item>
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
                />
              </Form.Item>
            </Form>
          </Modal>
      </div>
    </div>
  );
}
