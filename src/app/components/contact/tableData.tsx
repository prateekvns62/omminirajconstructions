import { useState, useMemo } from "react";
import { Table, Input, Select, Button, Tag } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  key: number;
  name: string;
  age: number;
  role: string;
  status: string;
}

const data: DataType[] = [
  { key: 1, name: "John Doe", age: 28, role: "Developer", status: "Active" },
  { key: 2, name: "Jane Smith", age: 34, role: "Designer", status: "Inactive" },
  { key: 3, name: "Sam Johnson", age: 24, role: "Manager", status: "Active" },
  { key: 4, name: "Lisa Brown", age: 30, role: "Developer", status: "Inactive" },
  { key: 5, name: "Emily Davis", age: 27, role: "HR", status: "Active" },
  { key: 6, name: "Michael Scott", age: 45, role: "Manager", status: "Inactive" },
];

export const TableData = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [filteredRole, setFilteredRole] = useState<string | null>(null);
  const [filteredStatus, setFilteredStatus] = useState<string | null>(null);
  const [tableData, setTableData] = useState<DataType[]>(data);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleFilterChange = (value: string | null) => {
    setFilteredRole(value);
  };

  const handleStatusFilterChange = (value: string | null) => {
    setFilteredStatus(value);
  };

  const handleDelete = (key: number) => {
    setTableData((prevData) => prevData.filter((item) => item.key !== key));
  };

  const handleEdit = (key: number) => {
    alert(key);
  };

  const handleBulkDelete = () => {
    setTableData((prevData) => prevData.filter((item) => !selectedRowKeys.includes(item.key)));
    setSelectedRowKeys([]);
  };

  const handleSelectChange = (keys: React.Key[]) => {
    setSelectedRowKeys(keys.map((key) => key as number)); // Explicitly casting keys to number[]
  };

  const roleFilters = useMemo(() => {
    const uniqueRoles = [...new Set(data.map((item) => item.role))];
    return uniqueRoles.map((role) => ({ text: role, value: role }));
  }, []);

  const statusFilters = useMemo(() => {
    const uniqueStatuses = [...new Set(data.map((item) => item.status))];
    return uniqueStatuses.map((status) => ({ text: status, value: status }));
  }, []);

  const isSearchMatch = (item: DataType) => {
    const search = searchText.toLowerCase();
    return (
      item.name.toLowerCase().includes(search) ||
      item.age.toString().includes(search) ||
      item.role.toLowerCase().includes(search) ||
      item.status.toLowerCase().includes(search)
    );
  };

  const filteredData = tableData.filter(
    (item) =>
      isSearchMatch(item) &&
      (filteredRole ? item.role === filteredRole : true) &&
      (filteredStatus ? item.status === filteredStatus : true)
  );

  const getStatusTag = (status: string) => {
    return status === "Active" ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>;
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Age",
      dataIndex: "age",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Role",
      dataIndex: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => getStatusTag(record.status),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex gap-2">
            <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record.key)} />
          <Button type="default" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)} />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h4 className="font-semibold mb-4">Contact Us</h4>
      <div className="flex gap-4 mb-4">
        <Input placeholder="Search everything..." prefix={<SearchOutlined />} onChange={handleSearch} className="w-1/3" />
        <Select placeholder="Filter by role" onChange={handleFilterChange} allowClear className="w-1/3">
          {roleFilters.map(({ value, text }) => (
            <Select.Option key={value} value={value}>{text}</Select.Option>
          ))}
        </Select>
        <Select placeholder="Filter by status" onChange={handleStatusFilterChange} allowClear className="w-1/3">
          {statusFilters.map(({ value, text }) => (
            <Select.Option key={value} value={value}>{text}</Select.Option>
          ))}
        </Select>
      </div>
      <Button type="primary" danger onClick={handleBulkDelete} disabled={!selectedRowKeys.length} className="mb-4">
        Delete Selected
      </Button>
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: handleSelectChange,
        }}
        columns={columns} 
        dataSource={filteredData} 
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};