"use client";
import { Table, Input, Select, Button, Tag, Modal, Tooltip, DatePicker, Skeleton, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, isWithinInterval, parseISO } from "date-fns";
import '@ant-design/v5-patch-for-react-19';
import type { TablePaginationConfig } from "antd/es/table";
import PageTitle from "../admin/pagetitle";
import Loader from "../admin/loader";

const { RangePicker } = DatePicker;

interface ProfileType {
  id: number;
  name: string;
  username: string;
  email: string;
  status: number;
  created_at: string | Date;
  last_login: string | Date;
}

export default function TableData({ users }: { users: ProfileType[] }) {
  const [searchText, setSearchText] = useState<string>("");
  const [filteredStatus, setFilteredStatus] = useState<number | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [tableData, setTableData] = useState<ProfileType[]>([]);
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
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
      setTableData(users);
      setLoading(false);
    }, 2000);
  }, [users]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value);

  const handleStatusFilterChange = (value: number | null) => setFilteredStatus(value ?? null);


  const handleDateRangeChange = (dates: any) => {
    if (!dates || !dates[0] || !dates[1]) {
        setDateRange([null, null]); // Reset if no dates selected
        return;
      }
      setDateRange([
        dates[0].format("YYYY-MM-DD"),
        dates[1].format("YYYY-MM-DD"),
      ]);
  };

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
          const response = await fetch(`/api/profile/${id}`, { method: "DELETE" });
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
    router.push(`/admin/profile/${id}`);
  }

  const handleSelectChange = (keys: React.Key[]) => setSelectedRowKeys(keys.map((key) => key as number));

  const isSearchMatch = (item: ProfileType) => {
    const search = searchText.toLowerCase();
    return item.name.toLowerCase().includes(search) || item.email.toLowerCase().includes(search) || item.username.includes(search);
  };

  const isDateInRange = (created_at: any) => {
    if (!dateRange[0] || !dateRange[1]) return true;
    
    return isWithinInterval(parseISO(created_at), {
      start: parseISO(dateRange[0]),
      end: parseISO(dateRange[1]),
    });
  };
  

  const filteredData = tableData.filter((item) => isSearchMatch(item) && (filteredStatus === null || item.status === filteredStatus) && isDateInRange(format(new Date(item.created_at), "yyyy-MM-dd")));

  const getStatusTag = (status: number) => (
    <Tooltip title={status === 1 ? "Active" : "Inactive"}>
      <Tag color={status === 1 ? "green" : "red"}>
        {status === 1 ? <EyeInvisibleOutlined style={{ marginRight: 5 }} /> : <EyeOutlined style={{ marginRight: 5 }} />} {status === 1 ? "Active" : "Inactive"}
      </Tag>
    </Tooltip>
  );

  const columns: ColumnsType<ProfileType> = [
    { title: "Name", dataIndex: "name", sorter: (a, b) => a.name.localeCompare(b.name), width: 150 },
    { title: "Username", dataIndex: "username", sorter: (a, b) => a.username.localeCompare(b.username), width: 120 },
    { title: "Email", dataIndex: "email", sorter: (a, b) => a.email.localeCompare(b.email), width: 200 },
    { title: "Status", dataIndex: "status", render: (_, record) => getStatusTag(record.status), sorter: (a, b) => a.status - b.status, width: 100 },
    { title: "Created At", dataIndex: "created_at", sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(), render: (created_at: string) => format(new Date(created_at), "dd MMM yyyy, hh:mm a"), width: 180 },
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
      <PageTitle title="Admin Users Records" />
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <Input placeholder="Search by name, email, or mobile..." prefix={<SearchOutlined />} onChange={handleSearch} className="w-1/4" />
        <Select
          placeholder="Filter by status"
          onChange={handleStatusFilterChange}
          allowClear
          className="w-1/4"
          value={filteredStatus}
        >
          {[...new Set(tableData.map(item => item.status))].map(status => (
            <Select.Option key={status} value={status}>
              {status === 1 ? "Active" : "Inactive"}
            </Select.Option>
          ))}
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
    {isLoading && (<Loader/>)}
    </div>
  );
}