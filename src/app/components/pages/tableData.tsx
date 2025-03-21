"use client";
import { Table, Input, Button, Modal, DatePicker, Skeleton, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, isWithinInterval, parseISO } from "date-fns";
import '@ant-design/v5-patch-for-react-19';
import type { TablePaginationConfig } from "antd/es/table";
import PageTitle from "../admin/pagetitle";
import Loader from "../admin/loader";

const { RangePicker } = DatePicker;

interface PagesType {
  id: number;
  identifier: string;
  title: string;
  html: string;
  css: string;
  createdAt: string | Date;
}

export default function TableData({ pages }: { pages: PagesType[] }) {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [tableData, setTableData] = useState<PagesType[]>([]);
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);
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
      setTableData(pages);
      setLoading(false);
    }, 2000);
  }, [pages]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          const response = await fetch(`/api/pages/${id}`, { method: "DELETE" });
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
    router.push(`/admin/pages/${id}`);
  } 

  const handleSelectChange = (keys: React.Key[]) => setSelectedRowKeys(keys.map((key) => key as number));

  const isSearchMatch = (item: PagesType) => {
    const search = searchText.toLowerCase();
    return item.identifier.toLowerCase().includes(search) || item.title.toLowerCase().includes(search);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isDateInRange = (createdAt: any) => {
    if (!dateRange[0] || !dateRange[1]) return true;
    
    return isWithinInterval(parseISO(createdAt), {
      start: parseISO(dateRange[0]),
      end: parseISO(dateRange[1]),
    });
  };
  

  const filteredData = tableData.filter((item) => isSearchMatch(item) && isDateInRange(format(new Date(item.createdAt), "yyyy-MM-dd")));


  const columns: ColumnsType<PagesType> = [
    { title: "Identifire", dataIndex: "identifier", sorter: (a, b) => a.identifier.localeCompare(b.identifier), width: 150 },
    { title: "Title", dataIndex: "title", sorter: (a, b) => a.title.localeCompare(b.title), width: 120 },
    { title: "Created At", dataIndex: "createdAt", sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(), render: (createdAt: string) => format(new Date(createdAt), "dd MMM yyyy, hh:mm a"), width: 180 },
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
      <PageTitle title="Dynamic Pages Records" />
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <Input placeholder="Search by Identifire or Title..." prefix={<SearchOutlined />} onChange={handleSearch} className="w-1/4" />
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
    {isLoading && (
      <Loader/>
    )}
    </div>
  );
}