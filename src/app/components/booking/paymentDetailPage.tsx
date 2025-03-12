'use client';

import { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

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
    photo?: string | null;
    aadharFrontCopy?: string | null;
    aadharBackCopy?: string | null;
    panCardCopy?: string | null;
    registryCopy?: string | null;
    franchise_id?: string | null;
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

export default function PaymentDetailPage({ booking }: { booking: BookingType }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [invoiceDate, setInvoiceDate] = useState('');

    useEffect(() => {
        setInvoiceDate(
            new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date())
        );
    }, []);

    const replaceOKLCHColors = (element: HTMLElement) => {
        const styles = window.getComputedStyle(element);
        const propsToCheck = ['color', 'backgroundColor', 'borderColor'];
    
        propsToCheck.forEach((prop) => {
            const value = styles.getPropertyValue(prop);
            if (value.includes('oklch')) {
                element.style.setProperty(prop, '#000000', 'important'); // Replace with black (or other valid color)
            }
        });
    
        Array.from(element.children).forEach((child) => {
            replaceOKLCHColors(child as HTMLElement);
        });
    };

    const downloadPDF = async () => {
        if (!cardRef.current) return;
    
        // Ensure colors are converted to supported formats
        replaceOKLCHColors(cardRef.current);
    
        const canvas = await html2canvas(cardRef.current, {
            scale: 2,
            backgroundColor: '#ffffff', // Force white background
            useCORS: true,
        });
    
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
    
        const imgWidth = 190; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(`Invoice_${booking.bookingId}.pdf`);
    };
    
    

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div>
            <div className="flex justify-end w-full mb-4 mr-1" ><Button onClick={downloadPDF} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Download Invoice</Button></div>
            <div ref={cardRef} className="w-full max-w-2xl sm:w-200">
                <Card className="bg-white shadow-lg rounded-2xl p-6 border border-gray-300">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Booking Invoice</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between border-b pb-4 mb-4">
                            <p className="text-sm text-gray-600">
                                Booking ID: <strong>{booking.bookingId}</strong>
                            </p>
                            <p className="text-sm text-gray-600">Invoice Date: <strong>{invoiceDate}</strong></p>
                        </div>
                        <div className="space-y-2 text-gray-800">
                            <h3 className="text-lg font-semibold">Customer Details</h3>
                            <p><strong>Name:</strong> {booking.name}</p>
                            <p><strong>Email:</strong> {booking.email}</p>
                            <p><strong>Aadhaar Number:</strong> {booking.aadhaarCardNumber}</p>
                            <p><strong>Work By:</strong> {booking.workBy}</p>
                            <p><strong>Work Through:</strong> {booking.workThrough}</p>
                            <p><strong>Plot Size:</strong> {booking.plotSize}</p>
                            <p><strong>Area:</strong> {booking.area} sq.ft.</p>
                        </div>
                        {booking.paymentDetails && (
                            <div className="mt-6 border-t pt-4 text-gray-800">
                                <h3 className="text-lg font-semibold">Payment Details</h3>
                                <p><strong>Method:</strong> {booking.paymentDetails.paymentMethod}</p>
                                <p><strong>Transaction ID:</strong> {booking.paymentDetails.transactionId}</p>
                                <p><strong>Amount:</strong> ₹ {booking.paymentDetails.amount}</p>
                                <p><strong>Status:</strong> {booking.paymentDetails.status}</p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="border-t pt-4 text-center w-full">
                        <p className="text-gray-600 text-sm font-semibold text-center w-full">
                            Om Miniraj Building & Construction Services Private Limited
                        </p>
                    </CardFooter>
                </Card>
            </div>
            </div>
        </div>
    );
}
