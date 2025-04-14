"use client";
import { useState, useEffect } from "react";
import { Descriptions, Tag, Button, Modal, message,Skeleton, Card, Image } from "antd";
import { DownloadOutlined, CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import '@ant-design/v5-patch-for-react-19';
import { usePathname, useRouter } from "next/navigation";
import PageTitle from "../admin/pagetitle";
import Loader from "../admin/loader";
import { format } from "date-fns";

const isImage = (url:string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
const isPDF = (url:string) => /\.pdf$/i.test(url);

interface CareerType {
  id: number;
  jobIdentifire: string;
  jobTitle: string;
  jobDescription: string;
  jobCategory: string;
  jobType: string;
  jobLocation: string;
  status: number;
  createdAt: string | Date;
}

interface JobApplicationType {
  id: number;
  name: string;
  email: string;
  contact: string;
  coverLetter: string;
  resume: string;
  status: number; // 0 - Pending, 1 - Accepted, 2 - Rejected
  createdAt: string | Date;
  submittedBy: number; // 0 - User, 1 - Admin
  jobId: number;
  job?:  CareerType | null;
}

export default function JobDetails({ job }: { job: JobApplicationType }) {
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

  const getStatusTag = (status: number) => {
    const tagStyle = { fontSize: "15px", padding: "2px 12px" };
  
    const statusMap: Record<number, { label: string; color: string; icon: React.ReactNode }> = {
      0: { label: "Pending", color: "orange", icon: <ExclamationCircleOutlined /> },
      1: { label: "Accepted", color: "green", icon: <CheckCircleOutlined /> },
      2: { label: "Rejected", color: "red", icon: <CloseCircleOutlined /> },
    };
  
    const { label, color, icon } = statusMap[status] ?? statusMap[0]; // Default to "Pending"
  
    return (
      <Tag icon={icon} color={color} style={tagStyle}>
        {label}
      </Tag>
    );
  };


  useEffect(() => {
    const historyStack: string[] = JSON.parse(sessionStorage.getItem("historyStack") || "[]");

    if (historyStack.length === 0 || historyStack[historyStack.length - 1] !== pathname) {
      historyStack.push(pathname);
      sessionStorage.setItem("historyStack", JSON.stringify(historyStack));
    }
  }, [pathname]);

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
            alt="image"
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

  const handleBack = () => {
    const historyStack: string[] = JSON.parse(sessionStorage.getItem("historyStack") || "[]");

    if (historyStack.length > 1) {
      historyStack.pop(); // Remove current page
      const prevPage = historyStack[historyStack.length - 1]; // Get new previous page
      sessionStorage.setItem("historyStack", JSON.stringify(historyStack));
      router.push(prevPage);
    } else {
      router.push("/admin"); // Fallback to dashboard if no history exists
    }
  };

  const updateStatus = async (status: number) => {
      Modal.confirm({
        title: "Update Status",
        content: "Are you sure you want to update the status?",
        onOk: async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/jobs/updateStatus`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: job.id, status }), // Using bookingData.id directly
                });
                const result = await response.json();
                if (response.ok) {
                    message.success(result.message || "Status updated successfully!");
                    router.refresh();
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

  useEffect(() => {
    if (job) {
      setIsLoading(false);
    }
  }, [job]);


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

  const handleDelete = async () => {
    Modal.confirm({
      title: "Are you sure you want to delete this record?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/jobs/${job.id}`, { method: "DELETE" });
          if (response.ok) {
            message.success("Record deleted successfully");
            handleBack();
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

  return (
    <div>
      <PageTitle title={`${job.name} - Application`} />
      <div className="p-6 bg-white shadow-md rounded-lg space-y-6">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          <span>Application Status : {getStatusTag(job.status)}</span>
        </h2>
        <div className="space-x-3">

        { job.status == 0 && (
          <>
            <Button type="primary"
            size="large"
            className="bg-orange-500 hover:bg-orange-600 text-white h-[60px] text-xl font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center"
            icon={<CheckCircleOutlined />}
            onClick={() => updateStatus(1)}>
              Accept
            </Button>
            <Button type="dashed" danger
            size="large"
            className="bg-red-500 hover:bg-green-600 text-white h-[60px] text-xl font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center"
            icon={<CloseCircleOutlined />}
            onClick={() => updateStatus(2)}>
              Reject
            </Button>
            </>
        )}

        { job.status == 1 && (
            <Button type="dashed" danger
            size="large"
            className="bg-red-500 hover:bg-green-600 text-white h-[60px] text-xl font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center"
            icon={<CloseCircleOutlined />}
            onClick={() => updateStatus(2)}>
              Reject
            </Button>
        )}

          <Button
              type="primary"
              size="large"
              danger
              className="bg-gray-700 text-white w-[160px] h-[56px] text-xl font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-gray-800 hover:shadow-lg flex items-center justify-center"
              icon={<DeleteOutlined />}
              onClick={handleDelete} >Delete</Button>
        </div>
      </div>
      <div>
        <Descriptions bordered column={1} size="middle" title="Basic Details">
          <Descriptions.Item label="Name">{job.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{job.email}</Descriptions.Item>
          <Descriptions.Item label="Conatct">{job.contact}</Descriptions.Item>
          <Descriptions.Item label="Cover letter">{job.coverLetter}</Descriptions.Item>
          <Descriptions.Item label="Job Title">{job.job?.jobTitle} &nbsp; 
            <a 
              href={`/admin/careers/${job.job?.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Job
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="Application Status">{getStatusTag(job.status)}</Descriptions.Item>
          <Descriptions.Item label="Resume">
            {renderDocument("Resume", job.resume)}
          </Descriptions.Item>
          <Descriptions.Item label="Submitted At">
            {format(new Date(job.createdAt), "dd MMM yyyy, hh:mm a")}
          </Descriptions.Item>
        </Descriptions>
        {previewVisible && (
        <Image.PreviewGroup
          preview={{
            visible: previewVisible,
            onVisibleChange: (visible) => !visible && setPreviewVisible(false),
          }}
        >
          <Image src={previewImage} width={0} height={0} alt="image" />
        </Image.PreviewGroup>
      )}
      </div>
      </div>
      {loading && (<Loader/>)}
    </div>
  );
}