"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Home, Printer } from "lucide-react";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// @ts-ignore
import QRCode from "qrcode";

function SuccessContent() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get("payment_id");
    const airline = searchParams.get("airline") || "Sky Explore Flight";
    const amount = searchParams.get("amount");
    const name = searchParams.get("name") || "Passenger";

    const generatePDF = async () => {
        const doc = new jsPDF();
        const qrData = `PASSENGER: ${name}\nAIRLINE: ${airline}\nPAYMENT: ${paymentId}\nTOTAL: INR ${amount}`;
        const qrCodeDataUri = await QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H', margin: 1, scale: 12 });

        doc.setFillColor(2, 6, 23); doc.rect(0, 0, 210, 45, "F");
        doc.setFontSize(26); doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold");
        doc.text("SKY EXPLORE", 105, 22, { align: "center" });
        doc.addImage(qrCodeDataUri, 'PNG', 150, 50, 45, 45, undefined, 'SLOW');

        autoTable(doc, {
            startY: 70, margin: { right: 65 },
            head: [['Description', 'Information']],
            body: [['Passenger Name', name.toUpperCase()], ['Airline', airline], ['Payment ID', paymentId || 'N/A'], ['Total', `INR ${amount}`], ['Status', 'CONFIRMED']],
            theme: 'grid', headStyles: { fillColor: [37, 99, 235] }
        });
        doc.save(`Ticket_${paymentId}.pdf`);
    };

    return (
        <div className="max-w-xl w-full text-center space-y-8 bg-slate-900/40 p-10 rounded-[50px] border border-slate-800 backdrop-blur-3xl">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
            <h1 className="text-4xl font-black tracking-tighter">Booking Confirmed!</h1>
            <div className="flex flex-col gap-4 mt-8">
                <Button onClick={generatePDF} className="bg-blue-600 font-black py-8 rounded-2xl flex gap-3"><Printer className="w-5 h-5" /> DOWNLOAD TICKET</Button>
                <Link href="/"><Button variant="outline" className="w-full py-8 border-slate-800 rounded-2xl">BACK TO HOME</Button></Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <main className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4">
            <Suspense fallback={<div className="text-blue-500 font-black animate-pulse">FINALIZING TICKET...</div>}>
                <SuccessContent />
            </Suspense>
        </main>
    );
}