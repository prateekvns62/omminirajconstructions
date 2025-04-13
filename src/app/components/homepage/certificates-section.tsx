"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

// Interface for certificates
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

export function CertificatesSection() {
  const [certificates, setCertificates] = useState<CertificateType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/certificates/certificates")
      .then((res) => res.json())
      .then((data) => {
        if (data.certificates && data.certificates.length > 0) {
          const filteredCertificates = data.certificates
            .filter((certificate: CertificateType) => certificate.showOnHome)
            .slice(0, 4);
          setCertificates(filteredCertificates);
        }
      })
      .catch((error) => console.error("Error fetching certificates:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-12 bg-white text-black">
      <div className="container mx-auto px-4 max-w-7xl md:px-0">
        <h2 className="text-xl font-bold mb-6 text-center">CIN - U45299DL2023PTC413854</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-center">
          {loading
            ? // Show shimmer effect while loading
              [...Array(4)].map((_, index) => <SkeletonCertificate key={index} />)
            : // Show actual certificates after loading
              certificates.map((certificate) => (
                <div key={certificate.id} className="p-2">
                  <Image
                    src={certificate.img}
                    alt={certificate.title}
                    width={300}
                    height={300}
                    className="mx-auto"
                  />
                  <p className="text-center text-md font-bold mt-4">{certificate.title}</p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

// Skeleton Shimmer Component
function SkeletonCertificate() {
  return (
    <div className="p-2 animate-pulse">
      <div className="w-[300px] h-[300px] bg-gray-300 rounded-md mx-auto"></div>
      <div className="h-4 w-3/4 bg-gray-300 rounded-md mx-auto mt-4"></div>
    </div>
  );
}
