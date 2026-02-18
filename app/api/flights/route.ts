import { amadeus } from "@/lib/amadeus";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");
    const date = searchParams.get("date");

    try {
        const response = await amadeus.shopping.flightOffersSearch.get({
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate: date,
            adults: '1'
        });

        // Agar data nahi hai toh empty array bhejien
        return NextResponse.json(response.data || []);
    } catch (error: any) {
        console.error("Flight Search Error:", error.response?.data || error.message);
        return NextResponse.json({ error: "Failed to fetch flights" }, { status: 500 });
    }
}