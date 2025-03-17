"use client";
import { Table, Input, Select, Button, Tag, Modal, Tooltip, Skeleton, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import '@ant-design/v5-patch-for-react-19';
import type { TablePaginationConfig } from "antd/es/table";
import PageTitle from "../admin/pagetitle";
import Loader from "../admin/loader";

interface ServiceType {
  id: number;
  serviceTitle: string;
  description: string;
  image: string;
  status: boolean;
  showOnHome: boolean;
}

export default function TableData({ services }: { services: ServiceType[] }) {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [tableData, setTableData] = useState<ServiceType[]>([]);
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
      setTableData(services);
      setLoading(false);
    }, 2000);
  }, [services]);

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
          const response = await fetch(`/api/services/${id}`, { method: "DELETE" });
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
    router.push(`/admin/services/${id}`);
  } 

  const handleSelectChange = (keys: React.Key[]) => setSelectedRowKeys(keys.map((key) => key as number));

  const isSearchMatch = (item: ServiceType) => {
    const search = searchText.toLowerCase();
    return item.serviceTitle.toLowerCase().includes(search) || item.description.toLowerCase().includes(search);
  };

  

  const filteredData = tableData.filter((item) => isSearchMatch(item));

  const getStatusTag = (status: boolean) => (
    <Tooltip title={status ? "Active" : "Inactive"}>
      <Tag color={status ? "green" : "red"}>
        {status  ? <CheckCircleOutlined style={{ marginRight: 5 }} /> : <CloseCircleOutlined style={{ marginRight: 5 }} />} {status ? "Active" : "Inactive"}
      </Tag>
    </Tooltip>
  );

  const getHomePageVisibilityTag = (status: boolean) => (
    <Tooltip title={status ? "True" : "False"}>
      <Tag color={status ? "green" : "red"}>
        {status ? (
          <CheckCircleOutlined style={{ marginRight: 5 }} />
        ) : (
          <CloseCircleOutlined style={{ marginRight: 5 }} />
        )}
        {status ? "True" : "False"}
      </Tag>
    </Tooltip>
  );

  const columns: ColumnsType<ServiceType> = [
    { title: "Service Title", dataIndex: "serviceTitle", sorter: (a, b) => a.serviceTitle.localeCompare(b.serviceTitle), width: 150 },
    { title: "Description", dataIndex: "description", sorter: (a, b) => a.description.localeCompare(b.description), render: (text: string) => (
      <span className="whitespace-nowrap overflow-hidden text-ellipsis block max-w-[160px]" title={text}>
          {text.length > 40 ? `${text.substring(0, 40)} .....` : text}
      </span>
    ), width: 150 },
    { title: "Status", dataIndex: "status", render: (_, record) => getStatusTag(record.status), width: 100 },
    { title: "Show On Home", dataIndex: "showOnHome",render: (_, record) => getHomePageVisibilityTag(record.showOnHome),  width: 150 },
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
      <PageTitle title="Services Records" />
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <Input placeholder="Search by Service Title or Description..." prefix={<SearchOutlined />} onChange={handleSearch} className="w-1/4" />
        <Select.Option key="active" value="1">
          Active
        </Select.Option>
        <Select.Option key="inactive" value="0">
          Inactive
        </Select.Option>
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