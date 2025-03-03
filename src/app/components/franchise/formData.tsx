"use client";
import { useState } from "react";
import { Descriptions, Tag } from "antd";
import { format } from "date-fns";
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import '@ant-design/v5-patch-for-react-19';

interface FranchiseRecord {
  id: number;
  name: string;
  email: string;
  address: string;
  doYouHave: string;
  mobileNumber: string;
  message: string;
  gstNumber?: string;
  franchiseId?: string;
  franchiseCertificateUrl?: string;
  aadhaarCardNumber: string;
  accountNumber: string;
  ifscCode: string;
  passbookCopy: string;
  panCardCopy: string;
  aadharFrontCopy: string;
  aadharBackCopy: string;
  createdAt: string;
  updatedAt: string;
  Status: number;
}

const getStatusTag = (status: number) => {
  switch (status) {
    case 0:
      return <Tag icon={<ClockCircleOutlined />} color="blue">Submitted</Tag>;
    case 1:
      return <Tag icon={<CheckCircleOutlined />} color="green">Approved</Tag>;
    case 2:
      return <Tag icon={<CloseCircleOutlined />} color="red">Rejected</Tag>;
    default:
      return <Tag color="default">Unknown</Tag>;
  }
};

export default function FranchiseDetails({ franchise }: { franchise: FranchiseRecord }) {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-xl font-bold mb-4">
        Franchise Detail | Submitted by: {franchise.name}
      </h2>

      <div>
        <Descriptions bordered column={2} size="middle" title="Basic Details">
          <Descriptions.Item label="Name">{franchise.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{franchise.email}</Descriptions.Item>
          <Descriptions.Item label="Mobile Number">{franchise.mobileNumber}</Descriptions.Item>
          <Descriptions.Item label="Aadhaar Card Number">{franchise.aadhaarCardNumber}</Descriptions.Item>
          <Descriptions.Item label="Account Number">{franchise.accountNumber}</Descriptions.Item>
          <Descriptions.Item label="IFSC Code">{franchise.ifscCode}</Descriptions.Item>
          <Descriptions.Item label="Address" span={2}>{franchise.address}</Descriptions.Item>
          <Descriptions.Item label="Do You Have" span={2}>{franchise.doYouHave}</Descriptions.Item>
          <Descriptions.Item label="Passbook Copy" span={2}>{franchise.passbookCopy}</Descriptions.Item>
          <Descriptions.Item label="PAN Card Copy" span={2}>{franchise.panCardCopy}</Descriptions.Item>
          <Descriptions.Item label="Aadhar Front Copy" span={2}>{franchise.aadharFrontCopy}</Descriptions.Item>
          <Descriptions.Item label="Aadhar Back Copy" span={2}>{franchise.aadharBackCopy}</Descriptions.Item>
          <Descriptions.Item label="Message" span={2}>{franchise.message}</Descriptions.Item>
        </Descriptions>
      </div>

        <div className="mt-4">
          <Descriptions bordered column={1} size="middle" title="Franchise Details">
            <Descriptions.Item label="GST Number">{franchise.gstNumber || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Franchise ID">{franchise.franchiseId || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Franchise Certificate URL">{franchise.franchiseCertificateUrl || "N/A"}</Descriptions.Item>
          </Descriptions>
        </div>
        <div className="mt-4">
          <Descriptions bordered column={3} size="middle" title="Status & Timestamps">
            <Descriptions.Item label="Status">{getStatusTag(franchise.Status)}</Descriptions.Item>
            <Descriptions.Item label="Created At">
              {format(new Date(franchise.createdAt), "dd MMM yyyy, hh:mm a")}
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated At">
              {format(new Date(franchise.updatedAt), "dd MMM yyyy, hh:mm a")}
            </Descriptions.Item>
          </Descriptions>
        </div>
    </div>
  );
}
