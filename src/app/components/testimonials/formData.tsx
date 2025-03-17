"use client";
import { useState, useEffect } from "react";
import { Descriptions, Tag, Button, Modal, message,Skeleton, Card } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import '@ant-design/v5-patch-for-react-19';
import { usePathname, useRouter } from "next/navigation";
import PageTitle from "../admin/pagetitle";
import Loader from "../admin/loader";

interface TestimonialType {
  id: number;
  customerName: string;
  reviewMessage: string;
  showOnHome: boolean;
}

export default function FranchiseDetails({ testimonial }: { testimonial: TestimonialType }) {
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname() || "/admin";
  
  const getShowOnHomePageTag = () => {
    const tagStyle = { fontSize: "15px", padding: "2px 12px" };
    if(!testimonial.showOnHome){
      return <Tag color="red" style={tagStyle}>No</Tag>;
    } else {
      return <Tag color="green" style={tagStyle}>Yes</Tag>;
    }
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
    if (testimonial) {
      setIsLoading(false);
    }
  }, [testimonial]);


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
          const response = await fetch(`/api/testimonials/${testimonial.id}`, { method: "DELETE" });
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
      router.push(`/admin/testimonials/update/${testimonial.id}`);
  };

  return (
    <div>
      <PageTitle title={`Customer review`} />
      <div className="p-6 bg-white shadow-md rounded-lg space-y-6">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          <span>Review Submitted By : {testimonial.customerName}</span>
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
        <Descriptions bordered column={1} size="middle" title="Basic Details">
          <Descriptions.Item label="Customer Name">{testimonial.customerName}</Descriptions.Item>
          <Descriptions.Item label="Show on Home Page"> {getShowOnHomePageTag()}</Descriptions.Item>
          <Descriptions.Item label="Review Message" >{testimonial.reviewMessage}</Descriptions.Item>
        </Descriptions>
      </div>
      </div>
      {loading && (<Loader/>)}
    </div>
  );
}
