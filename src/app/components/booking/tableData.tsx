"use client";
import { Table, Input, Select, Button, Tag, Modal, Tooltip, DatePicker, Skeleton, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, isWithinInterval, parseISO } from "date-fns";
import '@ant-design/v5-patch-for-react-19';
import type { TablePaginationConfig } from "antd/es/table";
import PageTitle from "../admin/pagetitle";

const { RangePicker } = DatePicker;

interface BookingType {
  id: number;
  bookingId: string;
  name: string;
  email: string;
  aadhaarCardNumber: number;
  workBy: string;
  workThrough: string;
  plotSize: string;
  area: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  paymentDetails?: PaymentDetailsType | null;
}

interface PaymentDetailsType {
  id: number;
  bookingId: string;
  paymentMethod: string;
  transactionId: string;
  amount: number;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export default function TableData({ booking }: { booking: BookingType[] }) {
  const [searchText, setSearchText] = useState<string>("");
  const [tableData, setTableData] = useState<BookingType[]>([]);
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
  });
  
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setTableData(booking);
      setLoading(false);
    }, 2000);
  }, [booking]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value);
  const handleDateRangeChange = (dates: any) => {
    if (!dates || !dates[0] || !dates[1]) {
        setDateRange([null, null]);
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
        try {
          const response = await fetch(`/api/booking/${id}`, { method: "DELETE" });
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

  const handleEdit = (id: number) => router.push(`/admin/booking/${id}`);

  const filteredData = tableData.filter((item) => 
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<BookingType> = [
    { title: "Booking ID", dataIndex: "bookingId", width: 150 },
    { title: "Name", dataIndex: "name", width: 150 },
    { title: "Email", dataIndex: "email", width: 200 },
    { title: "Aadhaar Card Number", dataIndex: "aadhaarCardNumber", width: 180 },
    { title: "Work By", dataIndex: "workBy", width: 150 },
    { title: "Work Through", dataIndex: "workThrough", width: 150 },
    { title: "Area", dataIndex: "area", width: 100 },
    { title: "Amount", dataIndex: "plotSize", render: (plotSize: string) => `${plotSize} INR`, width: 120 },
    { title: "Created At", dataIndex: "createdAt", render: (date) => format(new Date(date), "dd MMM yyyy, hh:mm a"), width: 180 },
    {
      title: "Status",
      dataIndex: "paymentDetails",
      key: "status",
      render: (paymentDetails: PaymentDetailsType | null) => {
        if (!paymentDetails) return <Tag color="default">Unknown</Tag>;
        switch (paymentDetails.status) {
          case "SUCCESS":
            return <Tag color="green">Success</Tag>;
          default:
            return <Tag color="red">Unknown</Tag>;
        }
      }
    },
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
      <PageTitle title="Booking Records" />
      <div className="p-4">
        <div className="flex gap-4 mb-4">
          <Input placeholder="Search by name or email..." prefix={<SearchOutlined />} onChange={handleSearch} className="w-1/3" />
          <RangePicker onChange={handleDateRangeChange} className="w-1/3" />
        </div>

        {loading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,
              onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
            }}
            rowKey="id"
          />
        )}
      </div>
    </div>
  );
}
