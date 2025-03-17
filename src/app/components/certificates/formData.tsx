"use client";
import { useState, useEffect } from "react";
import { Descriptions, Tag, Button, Modal, message,Skeleton, Card, Image } from "antd";
import { format } from "date-fns";
import { DownloadOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import '@ant-design/v5-patch-for-react-19';
import { usePathname, useRouter } from "next/navigation";
import PageTitle from "../admin/pagetitle";
import Loader from "../admin/loader";

const isImage = (url:string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
const isPDF = (url:string) => /\.pdf$/i.test(url);

interface CertificateType {
  id: number;
  identifier: string;
  title: string;
  pdf: string;
  img: string;
  status: boolean;
  certificateId: string;
  certificateApprovalDate: string | Date;
  expiredDate: string | Date;
  priority: number;
  showOnHome: boolean;
}

export default function FranchiseDetails({ certificate }: { certificate: CertificateType }) {
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

  const getStatusTag = () => {
    const tagStyle = { fontSize: "15px", padding: "2px 12px" };
    if(!certificate.status){
      return <Tag icon={<CloseCircleOutlined />} color="red" style={tagStyle}>Inactive</Tag>;
    } else {
      return <Tag icon={<CheckCircleOutlined />} color="green" style={tagStyle}>Active</Tag>;
    }
  };
  
  
  const getShowOnHomePageTag = () => {
    const tagStyle = { fontSize: "15px", padding: "2px 12px" };
    if(!certificate.showOnHome){
      return <Tag color="red" style={tagStyle}>No</Tag>;
    } else {
      return <Tag color="green" style={tagStyle}>Yes</Tag>;
    }
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

  useEffect(() => {
    const historyStack: string[] = JSON.parse(sessionStorage.getItem("historyStack") || "[]");

    if (historyStack.length === 0 || historyStack[historyStack.length - 1] !== pathname) {
      historyStack.push(pathname);
      sessionStorage.setItem("historyStack", JSON.stringify(historyStack));
    }
  }, [pathname]);

  

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

  useEffect(() => {
    if (certificate) {
      setIsLoading(false);
    }
  }, [certificate]);


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
          const response = await fetch(`/api/certificates/${certificate.id}`, { method: "DELETE" });
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

  const handleEdit = () => {
      router.push(`/admin/certificates/update/${certificate.id}`);
  };

  return (
    <div>
      <PageTitle title={`Certificate Detail #${certificate.identifier}`} />
      <div className="p-6 bg-white shadow-md rounded-lg space-y-6">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          {getStatusTag()}
          <span>Certificate Id : {certificate.certificateId}</span>
        </h2>
        <div className="space-x-3">
        <Button
            type="primary"
            size="large"
            className="bg-blue-600 text-white w-[160px] h-[56px] text-xl font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg flex items-center justify-center"
            icon={<EditOutlined />}
            onClick={handleEdit}
        >
            Edit
        </Button>
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
          <Descriptions bordered column={2} size="middle" title="Basic Details">
            <Descriptions.Item label="Identifier">{certificate.identifier}</Descriptions.Item>
            <Descriptions.Item label="Title">{certificate.title ? certificate.title : "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Priority">{certificate.priority}</Descriptions.Item>
            <Descriptions.Item label="Show on Home Page"> {getShowOnHomePageTag()}</Descriptions.Item>
          </Descriptions>
        </div>

        <div className="mt-4">
        <Descriptions title="Certificate Document" bordered column={2}>
          <Descriptions.Item label="Certificate Image" span={2}>
            {renderDocument("Certificate Image", certificate.img)}
          </Descriptions.Item>
          <Descriptions.Item label="Certificate PDF" span={2}>
            {renderDocument("Certificate PDF", certificate.pdf)}
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

        
        <div className="mt-4">
          <Descriptions bordered column={3} size="middle" title="Expiry and Status">
            <Descriptions.Item label="Status">{getStatusTag()}</Descriptions.Item>
            <Descriptions.Item label="Certificate Approved on">
              {format(new Date(certificate.certificateApprovalDate), "dd MMM yyyy, hh:mm a")}
            </Descriptions.Item>
            <Descriptions.Item label="Certificate Expired on">
              {format(new Date(certificate.expiredDate), "dd MMM yyyy, hh:mm a")}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
      {loading && (<Loader/>)}
    </div>
  );
}
