"use client";
import { useState, useEffect } from "react";
import { Descriptions, Button, Modal, message,Skeleton, Card, Image } from "antd";
import { format } from "date-fns";
import { DownloadOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import '@ant-design/v5-patch-for-react-19';
import { usePathname, useRouter } from "next/navigation";
import PageTitle from "../admin/pagetitle";
import Loader from "../admin/loader";

const isImage = (url:string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

interface ClientType {
  id: number;
  type: number;
  srNo: number | null;
  name: string | null;
  location: string | null;
  image: string | null;
  createdAt: string | Date;
}

export default function FormData({ client }: { client: ClientType }) {
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

  const renderDocument = (fileUrl:string) => {
    if (!fileUrl) return "N/A";

    if (isImage(fileUrl)) {
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
    if (client) {
      setIsLoading(false);
    }
  }, [client]);


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
          const response = await fetch(`/api/clients/${client.id}`, { method: "DELETE" });
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
      router.push(`/admin/clients/update/${client.id}`);
  };

  return (
    <div>
      <PageTitle title={`Client Detail - ${client.type ==0 ?client.id:client.name}`} />
      <div className="p-6 bg-white shadow-md rounded-lg space-y-6">
        <div className="flex justify-between items-center mb-4">
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
        <Descriptions bordered column={1} size="middle" title="Basic Details">
        {client.type === 0 ? (
          <Descriptions.Item label="Type">Image</Descriptions.Item>
        ) : client.type === 1 ? (
          <Descriptions.Item label="Type">List</Descriptions.Item>
        ) : (
          <Descriptions.Item label="Type">Unknown</Descriptions.Item>
        )}
        {client.type !== 0 && (
          <Descriptions.Item label="Client Name">
            {client.name ?? "N/A"}
          </Descriptions.Item>
        )}

        {client.type !== 0 && (
          <Descriptions.Item label="Client Location">
            {client.location ? client.location : "N/A"}
          </Descriptions.Item>
        )}

        {client.type !== 1 && (
          <Descriptions.Item label="Client Image">
            {renderDocument(client.image as string)}
          </Descriptions.Item>
        )}
          <Descriptions.Item label="Sr. No.">{client.srNo??"N/A"}</Descriptions.Item>
          <Descriptions.Item label="Created At">
              {format(new Date(client.createdAt), "dd MMM yyyy, hh:mm a")}
            </Descriptions.Item>
        </Descriptions>
        {previewVisible && (
            <Image.PreviewGroup
              preview={{
                visible: previewVisible,
                onVisibleChange: (visible) => !visible && setPreviewVisible(false),
              }}
            >
              <Image src={previewImage} width={0} height={0} alt="Client Image" />
            </Image.PreviewGroup>
          )}
      </div>
      </div>
      {loading && (<Loader/>)}
    </div>
  );
}
