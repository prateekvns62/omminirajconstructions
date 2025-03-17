import { NextApiRequest, NextApiResponse } from "next";
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.key_id!,
    key_secret: process.env.key_secret,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
        const { amount, currency } = (await req.body) as {
            amount: string;
            currency: string;
        };

        const options = {
            amount: amount,
            currency: currency,
            receipt: 'rcp1',
        };
        const order = await razorpay.orders.create(options);
        console.log(order);
        res.status(200).json({ orderId: order.id ,amount,currency});
    } catch (error) {
      res.status(500).json({ message: "Error deleting record", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
