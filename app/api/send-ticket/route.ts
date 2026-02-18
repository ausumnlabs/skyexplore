import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { passenger, airline, payment_id, amount } = body;

        const { data, error } = await resend.emails.send({
            from: 'Sky Explore <onboarding@resend.dev>',
            to: [passenger.email], // Yahan wahi email use karein jo Resend par registered hai
            subject: `Booking Confirmed: ${airline}`,
            html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #2563eb;">SKY EXPLORE</h2>
          <p>Hi <strong>${passenger.name}</strong>,</p>
          <p>Aapki <strong>${airline}</strong> ki ticket book ho gayi hai!</p>
          <hr/>
          <p><strong>Payment ID:</strong> ${payment_id}</p>
          <p><strong>Total Amount:</strong> ₹${amount}</p>
          <p style="font-size: 12px; color: #666;">Note: Yeh ek test mail hai.</p>
        </div>
      `,
        });

        if (error) {
            console.error("Resend Error:", error);
            return NextResponse.json({ error }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        console.error("Email Route Crash:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}