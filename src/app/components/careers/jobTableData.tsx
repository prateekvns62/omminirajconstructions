"use client";
import { Table, Input, Button, Tag, Modal, Tooltip, Skeleton, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import '@ant-design/v5-patch-for-react-19';
import type { TablePaginationConfig } from "antd/es/table";
import PageTitle from "../admin/pagetitle";
import Loader from "../admin/loader";
import { format } from "date-fns";

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


export default function TableData({ jobs }: { jobs: JobApplicationType[] }) {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [tableData, setTableData] = useState<JobApplicationType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
  });

  console.log(jobs);
  
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination({ current: pagination.current!, pageSize: pagination.pageSize! });
  };

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setTableData(jobs);
      setLoading(false);
    }, 2000);
  }, [jobs]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value);

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this record?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      onOk: async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
          if (response.ok) {
            setTableData((prev) => prev.filter((item) => item.id !== id));
            message.success("Record deleted successfully");
          } else {
            message.error("Failed to delete record");
          }
        } catch (error) {
          console.log(error);
          message.error("An error occurred while deleting the record");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleEdit = (id: number) => {
    setIsLoading(true);
    router.push(`/admin/careers/jobs/${id}`);
  } 

  const handleSelectChange = (keys: React.Key[]) => setSelectedRowKeys(keys.map((key) => key as number));

  const isSearchMatch = (item: JobApplicationType) => {
    const search = searchText.toLowerCase();
    return item.name.toLowerCase().includes(search) || item.email.toLowerCase().includes(search) || item.contact.toLowerCase().includes(search) || item.job?.jobTitle.toLowerCase().includes(search);
  };

  

  const filteredData = tableData.filter((item) => isSearchMatch(item));

  const getStatusTag = (status: number) => {
    const statusMap: Record<number, { label: string; color: string; icon: React.ReactNode }> = {
      0: { label: "Pending", color: "orange", icon: <ExclamationCircleOutlined /> },
      1: { label: "Accepted", color: "green", icon: <CheckCircleOutlined /> },
      2: { label: "Rejected", color: "red", icon: <CloseCircleOutlined /> },
    };
  
    const { label, color, icon } = statusMap[status] || statusMap[0]; // Default to "Pending" if status is unknown
  
    return (
      <Tooltip title={label}>
        <Tag color={color}>
          {icon} {label}
        </Tag>
      </Tooltip>
    );
  };

  const columns: ColumnsType<JobApplicationType> = [
    { title: "Name", dataIndex: "name", sorter: (a, b) => a.name.localeCompare(b.name), width: 200 },
    { title: "Email", dataIndex: "email", sorter: (a, b) => a.email.localeCompare(b.email), width: 150 },
    { title: "Contact", dataIndex: "contact", sorter: (a, b) => a.contact.localeCompare(b.contact), width: 150 },
    {
      title: "For Job",
      dataIndex: "job",
      key: "jobTitle",
      width: 150,
      render: (job) => job?.jobTitle || "N/A", // Avoids errors if job is null
    },
    { title: "Status", dataIndex: "status", render: (_, record) => getStatusTag(record.status), width: 80 },
    { title: "Created At", dataIndex: "createdAt",sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(), render: (createdAt) => format(new Date(createdAt), "dd MMM yyyy, hh:mm a"), width: 180 },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record.id)} />
          <Button type="default" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </div>
      ),
      fixed: "right",
      width: 120,
    },
  ];

  return (
    <div>
      <PageTitle title="Jobs Records" />
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <Input placeholder="Search by Name, contact or email..." prefix={<SearchOutlined />} onChange={handleSearch} className="w-1/4" />
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <Table
            rowSelection={{ selectedRowKeys, onChange: handleSelectChange }}
            columns={columns}
            dataSource={filteredData}
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                showSizeChanger: true,  // Allow changing page size
                pageSizeOptions: ["10", "20", "50", "100"],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,
                onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
            }}
            rowKey="id"
            onChange={handleTableChange}
        />
      )}
    </div>
    {isLoading && (
      <Loader/>
    )}
    </div>
  );
}