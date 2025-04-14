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

interface BranchType {
  id: number;
  branchCode: string;
  branchName: string;
  location: string;
  priority: number;
  image: string;
  status: boolean;
  mapIframe: string;
  createdAt: string | Date;
}

export default function TableData({ branches }: { branches: BranchType[] }) {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [tableData, setTableData] = useState<BranchType[]>([]);
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
      setTableData(branches);
      setLoading(false);
    }, 2000);
  }, [branches]);

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
          const response = await fetch(`/api/branches/${id}`, { method: "DELETE" });
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
    router.push(`/admin/branches/${id}`);
  } 

  const handleSelectChange = (keys: React.Key[]) => setSelectedRowKeys(keys.map((key) => key as number));

  const isSearchMatch = (item: BranchType) => {
    const search = searchText.toLowerCase();
    return item.branchName.toLowerCase().includes(search) || item.branchCode.toLowerCase().includes(search) || item.location.toLowerCase().includes(search);
  };

  

  const filteredData = tableData.filter((item) => isSearchMatch(item));

  const getStatusTag = (status: boolean) => (
    <Tooltip title={status ? "Active" : "Inactive"}>
      <Tag color={status ? "green" : "red"}>
        {status  ? <CheckCircleOutlined style={{ marginRight: 5 }} /> : <CloseCircleOutlined style={{ marginRight: 5 }} />} {status ? "Active" : "Inactive"}
      </Tag>
    </Tooltip>
  );

  const columns: ColumnsType<BranchType> = [
    { title: "Branch Name", dataIndex: "branchName", sorter: (a, b) => a.branchName.localeCompare(b.branchName), width: 200 },
    { title: "Branch Code", dataIndex: "branchCode", sorter: (a, b) => a.branchCode.localeCompare(b.branchCode), width: 100 },
    { title: "Branch Location", dataIndex: "location", sorter: (a, b) => a.location.localeCompare(b.location), width: 150 },
    { title: "Priority", dataIndex: "priority",  width: 80 },
    { title: "Status", dataIndex: "status", render: (_, record) => getStatusTag(record.status), width: 100 },
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
      <PageTitle title="Branch Records" />
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <Input placeholder="Search by Branch name, code or location..." prefix={<SearchOutlined />} onChange={handleSearch} className="w-1/4" />
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