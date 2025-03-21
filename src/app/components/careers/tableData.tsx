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

export default function TableData({ careers }: { careers: CareerType[] }) {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [tableData, setTableData] = useState<CareerType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
  });
  
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination({ current: pagination.current!, pageSize: pagination.pageSize! });
  };

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setTableData(careers);
      setLoading(false);
    }, 2000);
  }, [careers]);

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
          const response = await fetch(`/api/careers/${id}`, { method: "DELETE" });
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
    router.push(`/admin/careers/${id}`);
  } 

  const handleSelectChange = (keys: React.Key[]) => setSelectedRowKeys(keys.map((key) => key as number));

  const isSearchMatch = (item: CareerType) => {
    const search = searchText.toLowerCase();
    return item.jobTitle.toLowerCase().includes(search) || item.jobCategory.toLowerCase().includes(search) || item.jobType.toLowerCase().includes(search) || item.jobLocation.toLowerCase().includes(search) || item.jobIdentifire.toLowerCase().includes(search);
  };

  

  const filteredData = tableData.filter((item) => isSearchMatch(item));

  const getStatusTag = (status: number) => (
    <Tooltip title={status ? "Active" : "Inactive"}>
      <Tag color={status ? "green" : "red"}>
        {status  ? <CheckCircleOutlined style={{ marginRight: 5 }} /> : <CloseCircleOutlined style={{ marginRight: 5 }} />} {status ? "Active" : "Inactive"}
      </Tag>
    </Tooltip>
  );

  const columns: ColumnsType<CareerType> = [
    { title: "Job Identifire", dataIndex: "jobIdentifire", sorter: (a, b) => a.jobIdentifire.localeCompare(b.jobIdentifire), width: 200 },
    { title: "Job Title", dataIndex: "jobTitle", sorter: (a, b) => a.jobTitle.localeCompare(b.jobTitle), width: 200 },
    { title: "Job Category", dataIndex: "jobCategory", sorter: (a, b) => a.jobCategory.localeCompare(b.jobCategory), width: 150 },
    { title: "Job Type", dataIndex: "jobType", sorter: (a, b) => a.jobType.localeCompare(b.jobType), width: 100 },
    { title: "Job Location", dataIndex: "jobLocation", sorter: (a, b) => a.jobLocation.localeCompare(b.jobLocation), width: 150 },
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
        <Input placeholder="Search by Job Name, Type, Category or Location..." prefix={<SearchOutlined />} onChange={handleSearch} className="w-1/4" />
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