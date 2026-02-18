import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!, // Apni key .env.local mein daalein
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
    try {
        const { amount } = await request.json();

        const options = {
            amount: Math.round(amount * 100), // Razorpay paise mein amount leta hai (₹1 = 100 paise)
            currency: "INR",
            receipt: "rcpt_" + Math.random().toString(36).substring(7),
        };

        const order = await razorpay.orders.create(options);
        return NextResponse.json(order);
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
    }
}