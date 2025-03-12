"use client";
import { Table, Input, Select, Button, Tag, Modal, Tooltip, DatePicker, Skeleton, message } from "antd";
import { CloseCircleOutlined, CheckCircleOutlined, ClockCircleOutlined, SearchOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, isWithinInterval, parseISO } from "date-fns";
import '@ant-design/v5-patch-for-react-19';
import type { TablePaginationConfig } from "antd/es/table";
import PageTitle from "../admin/pagetitle";

const { RangePicker } = DatePicker;

interface FranchiseRecord {
  id: number;
  name: string;
  email: string;
  address: string;
  mobileNumber: string;
  createdAt: string | Date;
  Status: number;
  franchiseId?: string | null;
}

export default function TableData({ records }: { records: FranchiseRecord[] }) {
  const [searchText, setSearchText] = useState("");
  const [filteredStatus, setFilteredStatus] = useState<number | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [tableData, setTableData] = useState<FranchiseRecord[]>([]);
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
  });

  const router = useRouter();

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination({ current: pagination.current!, pageSize: pagination.pageSize! });
  };

  useEffect(() => {
    setTimeout(() => {
      setTableData(records);
      setLoading(false);
    }, 2000);
  }, [records]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value);
  const handleStatusFilterChange = (value: number | null) => setFilteredStatus(value ?? null);

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates ? [dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD")] : [null, null]);
  };

  const getStatusTag = (status: number) => {
    switch (status) {
      case 0: return <Tag icon={<ClockCircleOutlined />} color="blue">Submitted</Tag>;
      case 1: return <Tag icon={<CheckCircleOutlined />} color="green">Approved</Tag>;
      case 2: return <Tag icon={<CloseCircleOutlined />} color="red">Rejected</Tag>;
      default: return <Tag color="default">Unknown</Tag>;
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this record?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await fetch(`/api/franchise/${id}`, { method: "DELETE" });
          if (response.ok) {
            setTableData((prev) => prev.filter((item) => item.id !== id));
            message.success("Record deleted successfully");
          } else {
            message.error("Failed to delete record");
          }
        } catch (error) {
          message.error("An error occurred while deleting the record");
        }
      },
    });
  };

  const handleEdit = (id: number) => router.push(`/admin/franchise/${id}`);
  const handleSelectChange = (keys: React.Key[]) => setSelectedRowKeys(keys.map((key) => key as number));

  const filteredData = tableData.filter((item) => {
    return (
      (searchText.trim() === "" || item.name.toLowerCase().includes(searchText.toLowerCase()) || item.email.toLowerCase().includes(searchText.toLowerCase()) || item.mobileNumber.includes(searchText)) &&
      (filteredStatus === null || item.Status === filteredStatus) &&
      (!dateRange[0] || !dateRange[1] || isWithinInterval(parseISO(format(new Date(item.createdAt), "yyyy-MM-dd")), { start: new Date(dateRange[0]), end: new Date(dateRange[1]) }))
    );
  });

  const columns: ColumnsType<FranchiseRecord> = [
    { title: "Name", dataIndex: "name", sorter: (a, b) => a.name.localeCompare(b.name), width: 150 },
    { title: "Email", dataIndex: "email",sorter: (a, b) => a.email.localeCompare(b.email), width: 200 },
    { title: "Mobile", dataIndex: "mobileNumber", sorter: (a, b) => a.mobileNumber.localeCompare(b.mobileNumber), width: 120 },
    { title: "Address", dataIndex: "address", width: 250 },
    { title: "Franchise ID", dataIndex: "franchiseId", width: 150 },
    { title: "Status", dataIndex: "Status", render: getStatusTag,sorter: (a, b) => a.Status - b.Status, width: 150 },
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
      <PageTitle title="Franchise Records" />
      <div className="p-4">
        <div className="flex gap-4 mb-4">
          <Input placeholder="Search by name, email, or mobile..." prefix={<SearchOutlined />} onChange={handleSearch} className="w-1/4" />
          <Select placeholder="Filter by status" onChange={handleStatusFilterChange} allowClear className="w-1/4">
            <Select.Option value={0}>Submitted</Select.Option>
            <Select.Option value={1}>Approved</Select.Option>
            <Select.Option value={2}>Rejected</Select.Option>
          </Select>
          <RangePicker onChange={handleDateRangeChange} className="w-1/2" />
        </div>
        {loading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <Table rowSelection={{ selectedRowKeys, onChange: handleSelectChange }} columns={columns} dataSource={filteredData} pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  showSizeChanger: true,  // Allow changing page size
                  pageSizeOptions: ["10", "20", "50", "100"],
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,
                  onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
              }} rowKey="id" onChange={handleTableChange} />
        )}
      </div>
    </div>
  );
}