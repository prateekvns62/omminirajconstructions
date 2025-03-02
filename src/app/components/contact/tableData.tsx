"use client";
import { Table, Input, Select, Button, Tag, Modal, Tooltip, DatePicker, Skeleton, message  } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, isWithinInterval, parseISO } from "date-fns";
import '@ant-design/v5-patch-for-react-19';

const { RangePicker } = DatePicker;

interface ContactType {
  id: number;
  name: string;
  mobile_number: string;
  email: string;
  message: string;
  status: number;
  created_at: string;
}

export default function TableData({ users }: { users: ContactType[] }) {
  const [searchText, setSearchText] = useState<string>("");
  const [filteredStatus, setFilteredStatus] = useState<number | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [tableData, setTableData] = useState<ContactType[]>([]);
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);
  const [loading, setLoading] = useState<boolean>(true); // Shimmer effect state

  const router = useRouter();

  // Simulate data fetching delay
  useEffect(() => {
    setTimeout(() => {
      setTableData(users);
      setLoading(false); // Stop loading after data is fetched
    }, 2000);
  }, [users]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleStatusFilterChange = (value: number | null) => {
    setFilteredStatus(value);
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setDateRange([dates[0]?.toISOString() || null, dates[1]?.toISOString() || null]);
    } else {
      setDateRange([null, null]);
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
          const response = await fetch(`/api/contact/${id}`, {
            method: "DELETE",
          });
  
          if (response.ok) {
            setTableData((prevData) => prevData.filter((item) => item.id !== id));
            message.success("Record deleted successfully"); // Show success toast
          } else {
            console.error("Failed to delete the record from the database.");
            message.error("Failed to delete record"); // Show error toast
          }
        } catch (error) {
          console.error("Error deleting record:", error);
          message.error("An error occurred while deleting the record"); // Show error toast
        }
      },
    });
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/contact/${id}`);
  };

  const showBulkDeleteConfirm = () => {
    Modal.confirm({
      title: "Confirm Bulk Deletion",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete ${selectedRowKeys.length} selected contacts?`,
      okText: "Continue",
      cancelText: "Cancel",
      onOk: () => {
        setTableData((prevData) => prevData.filter((item) => !selectedRowKeys.includes(item.id)));
        setSelectedRowKeys([]);
      },
    });
  };

  const handleSelectChange = (keys: React.Key[]) => {
    setSelectedRowKeys(keys.map((key) => key as number));
  };

  const isSearchMatch = (item: ContactType) => {
    const search = searchText.toLowerCase();
    return (
      item.name.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search) ||
      item.mobile_number.includes(search)
    );
  };

  const isDateInRange = (createdAt: string) => {
    if (!dateRange[0] || !dateRange[1]) return true;
    return isWithinInterval(parseISO(createdAt), {
      start: new Date(dateRange[0]),
      end: new Date(dateRange[1]),
    });
  };

  const filteredData = tableData.filter(
    (item) =>
      isSearchMatch(item) &&
      (filteredStatus !== null ? item.status === filteredStatus : true) &&
      isDateInRange(item.created_at)
  );

  const getStatusTag = (status: number) => {
    return (
      <Tooltip title={status === 1 ? "Unread" : "Read"}>
        <Tag color={status === 1 ? "red" : "green"}>
          {status === 1 ? <EyeInvisibleOutlined style={{ marginRight: 5 }} /> : <EyeOutlined style={{ marginRight: 5 }} />}
          {status === 1 ? "Unread" : "Read"}
        </Tag>
      </Tooltip>
    );
  };

  const columns: ColumnsType<ContactType> = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Mobile",
      dataIndex: "mobile_number",
      sorter: (a, b) => a.mobile_number.localeCompare(b.mobile_number),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Message",
      dataIndex: "message",
      ellipsis: true, // Shows '...' for long text
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => getStatusTag(record.status),
      sorter: (a, b) => a.status - b.status,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      render: (created_at: string) => format(new Date(created_at), "dd MMM yyyy, hh:mm a"),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record.id)} />
          <Button type="default" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h4 className="font-semibold mb-4">Contact Management</h4>
      <div className="flex gap-4 mb-4">
        <Input placeholder="Search by name, email, or mobile..." prefix={<SearchOutlined />} onChange={handleSearch} className="w-1/4" />
        <Select placeholder="Filter by status" onChange={handleStatusFilterChange} allowClear className="w-1/4">
          <Select.Option value={1}>Active</Select.Option>
          <Select.Option value={0}>Inactive</Select.Option>
        </Select>
        <RangePicker onChange={handleDateRangeChange} className="w-1/2" />
      </div>
      
      {loading ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <Table
          rowSelection={{ selectedRowKeys, onChange: handleSelectChange }}
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 20 }}
          rowKey="id"
        />
      )}
    </div>
  );
}
