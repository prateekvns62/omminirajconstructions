"use client";
import { Table, Input, Select, Button, Tag, Modal, Tooltip, DatePicker, Skeleton, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, isWithinInterval, parseISO } from "date-fns";
import '@ant-design/v5-patch-for-react-19';
import type { TablePaginationConfig } from "antd/es/table";
import PageTitle from "../admin/pagetitle";
import Loader from "../admin/loader";

const { RangePicker } = DatePicker;

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

export default function TableData({ certificates }: { certificates: CertificateType[] }) {
  const [searchText, setSearchText] = useState<string>("");
  const [filteredStatus, setFilteredStatus] = useState<number | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [tableData, setTableData] = useState<CertificateType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
  });

  const [previousUrl, setPreviousUrl] = useState<string | null>(null);

  
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination({ current: pagination.current!, pageSize: pagination.pageSize! });
  };

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setTableData(certificates);
      setLoading(false);
    }, 2000);
  }, [certificates]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value);

  const handleStatusFilterChange = (value: number | null) => setFilteredStatus(value ?? null);


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
          const response = await fetch(`/api/certificates/${id}`, { method: "DELETE" });
          if (response.ok) {
            setTableData((prev) => prev.filter((item) => item.id !== id));
            message.success("Record deleted successfully");
          } else {
            message.error("Failed to delete record");
          }
        } catch (error) {
          message.error("An error occurred while deleting the record");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleEdit = (id: number) => {
    setIsLoading(true);
    router.push(`/admin/certificates/${id}`);
  } 

  const handleSelectChange = (keys: React.Key[]) => setSelectedRowKeys(keys.map((key) => key as number));

  const isSearchMatch = (item: CertificateType) => {
    const search = searchText.toLowerCase();
    return item.title.toLowerCase().includes(search) || item.certificateId.toLowerCase().includes(search) || item.identifier.includes(search);
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

  const columns: ColumnsType<CertificateType> = [
    { title: "Identifier", dataIndex: "identifier", sorter: (a, b) => a.identifier.localeCompare(b.identifier), width: 150 },
    { title: "Certificate Id", dataIndex: "certificateId", sorter: (a, b) => a.certificateId.localeCompare(b.certificateId), width: 150 },
    { title: "Certificate Name", dataIndex: "title", sorter: (a, b) => a.title.localeCompare(b.title), width: 200 },
    { title: "Status", dataIndex: "status", render: (_, record) => getStatusTag(record.status), width: 100 },
    { title: "Approve at", dataIndex: "certificateApprovalDate", sorter: (a, b) => new Date(a.certificateApprovalDate).getTime() - new Date(b.certificateApprovalDate).getTime(), render: (created_at: string) => format(new Date(created_at), "dd MMM yyyy, hh:mm a"), width: 180 },
    { title: "Expire at", dataIndex: "certificateApprovalDate", sorter: (a, b) => new Date(a.certificateApprovalDate).getTime() - new Date(b.certificateApprovalDate).getTime(), render: (created_at: string) => format(new Date(created_at), "dd MMM yyyy, hh:mm a"), width: 180 },
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
      <PageTitle title="Certificates Records" />
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <Input placeholder="Search by name, email, or mobile..." prefix={<SearchOutlined />} onChange={handleSearch} className="w-1/4" />
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