'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import Label from '@/components/ui/Label';
import { useRouter } from "next/navigation";
import { message,Skeleton, Card } from "antd";
import Loader from '../admin/loader';

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
    photo?: string | null;  // <-- Allow null
    aadharFrontCopy?: string | null; 
    aadharBackCopy?: string | null; 
    panCardCopy?: string | null; 
    registryCopy?: string | null; 
    franchise_id?: string | null;
    status: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    paymentDetails?: PaymentDetailsType | null;  // <-- Allow null
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

export default function BookingPayment({ booking }: { booking: BookingType }) {
    const [currency] = useState('INR');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (booking) {
          setIsLoading(false);
        }
      }, [booking]);

    const createOrderId = async () => {
        try {
            const response = await fetch('/api/order/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: Number(booking.plotSize) * 100, currency }),
            });

            if (!response.ok) throw new Error('Failed to create order');

            const data = await response.json();
            return data.orderId;
        } catch (error) {
            message.error('Something went wrong!');
            return null;
        }
    };

    const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderId = await createOrderId();
            if (!orderId) {
                message.error('Failed to create order. Please try again.');
                setLoading(false);
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: Number(booking.plotSize) * 100,
                currency,
                name: process.env.NEXT_PUBLIC_BUSINESS_NAME,
                description: process.env.NEXT_PUBLIC_PAYMENT_DESCRIPTION,
                order_id: orderId,
                handler: async (response: any) => {
                    const data = {
                        orderCreationId: orderId,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature: response.razorpay_signature,
                        bookingId: String(booking.bookingId),
                        amount: Number(booking.plotSize),
                    };

                    const result = await fetch('/api/order/verify', {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: { 'Content-Type': 'application/json' },
                    });

                    const res = await result.json();
                    res.isOk ? router.refresh() : message.error(res.message);
                },
                prefill: { name: booking.name, email: booking.email },
                theme: { color: '#3399cc' },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.on('payment.failed', (response: any) => {
                message.error(response.error.description);
            });
            paymentObject.open();
        } catch (error) {
            message.error('Payment error');
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
          <div className="p-6 bg-white shadow-md rounded-lg space-y-6">
            <Skeleton active />
            <Card className="p-4">
              <Skeleton active paragraph={{ rows: 4 }} />
            </Card>
            <Card className="p-4">
              <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
          </div>
        );
      }

    return (
        <>
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js"/>
            <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 sm:w-200">
                <h2 className="text-xl font-semibold text-center mb-4">Complete Your Booking Payment</h2>
                <form className="flex flex-col gap-6" onSubmit={processPayment}>
                    <div>
                        <label className="block text-gray-600 font-medium">Full Name</label>
                        <p className="border p-3 rounded-lg bg-gray-50">{booking.name}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-medium">Email</label>
                        <p className="border p-3 rounded-lg bg-gray-50">{booking.email}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-medium">Aadhar Card Name</label>
                        <p className="border p-3 rounded-lg bg-gray-50">{booking.aadhaarCardNumber}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-medium">Work By</label>
                        <p className="border p-3 rounded-lg bg-gray-50">{booking.workBy}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-medium">Plot Area</label>
                        <p className="border p-3 rounded-lg bg-gray-50">{booking.area} sq. ft.</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-medium">Amount Payable</label>
                        <p className="border p-3 rounded-lg bg-gray-50">{booking.plotSize} INR</p>
                    </div>
                    <div>
                        <label className="block text-gray-600 font-medium">Payment Details</label>
                        <p className="p-3">
                            As per your booking of <strong>{booking.area}</strong> sq. ft., you have to pay <strong>{booking.plotSize} INR</strong> for the booking.
                        </p>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Pay Now"}
                    </button>
                </form>
            </div>
        </div>
        {loading && ( <Loader/> )}
        </>
    );
}
