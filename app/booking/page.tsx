"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ChevronLeft, Ticket, User, Mail, Phone } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function BookingPage() {
    const searchParams = useSearchParams();
    const apiPrice = Number(searchParams.get("price") || 0);
    const airline = searchParams.get("airline") || "Flight";

    // Passenger Details State
    const [passenger, setPassenger] = useState({
        name: "",
        email: "",
        phone: ""
    });

    const displayBaseFare = Math.round(apiPrice * 0.8);
    const displayTaxes = (apiPrice - displayBaseFare) + 700;
    const discount = 600;
    const grandTotal = (displayBaseFare + displayTaxes) - discount;

    const handlePayment = async () => {
        // Validation: Check if details are filled
        if (!passenger.name || !passenger.email || !passenger.phone) {
            alert("Please fill all passenger details first!");
            return;
        }

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: grandTotal }),
            });
            const order = await response.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                name: "SKY EXPLORE",
                description: `Booking for ${airline}`,
                order_id: order.id,
                handler: async function (response: any) {
                    // Send Email and Redirect
                    await fetch("/api/send-ticket", {
                        method: "POST",
                        body: JSON.stringify({
                            payment_id: response.razorpay_payment_id,
                            passenger,
                            airline,
                            amount: grandTotal
                        })
                    });
                    window.location.href = `/booking/success?payment_id=${response.razorpay_payment_id}&amount=${grandTotal}&airline=${airline}&name=${passenger.name}`;
                },
                prefill: {
                    name: passenger.name,
                    email: passenger.email,
                    contact: passenger.phone,
                },
                theme: { color: "#2563eb" },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main className="min-h-screen bg-[#020617] text-white p-4 md:p-12">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h1 className="text-4xl font-black italic">PASSENGER DETAILS</h1>

                        <Card className="bg-slate-900/40 border-slate-800 p-8 rounded-3xl">
                            <div className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-4 h-5 w-5 text-slate-500" />
                                    <input
                                        placeholder="Passenger Full Name"
                                        className="w-full bg-slate-950 border-slate-800 p-4 pl-12 rounded-xl text-sm outline-none focus:border-blue-600"
                                        onChange={(e) => setPassenger({ ...passenger, name: e.target.value })}
                                    />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-4 h-5 w-5 text-slate-500" />
                                    <input
                                        type="email"
                                        placeholder="Email Address (For Ticket)"
                                        className="w-full bg-slate-950 border-slate-800 p-4 pl-12 rounded-xl text-sm outline-none focus:border-blue-600"
                                        onChange={(e) => setPassenger({ ...passenger, email: e.target.value })}
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-4 h-5 w-5 text-slate-500" />
                                    <input
                                        placeholder="Mobile Number"
                                        className="w-full bg-slate-950 border-slate-800 p-4 pl-12 rounded-xl text-sm outline-none focus:border-blue-600"
                                        onChange={(e) => setPassenger({ ...passenger, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-slate-900 border-slate-800 p-8 rounded-[40px] shadow-2xl">
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400 font-bold">Total Amount</span>
                                    <span className="text-3xl font-black">₹{grandTotal.toLocaleString()}</span>
                                </div>
                            </div>
                            <Button
                                onClick={handlePayment}
                                className="w-full mt-10 bg-blue-600 hover:bg-blue-700 text-white font-black py-8 rounded-2xl"
                            >
                                CONFIRM & PAY
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}