import { amadeus } from "@/lib/amadeus";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const keyword = searchParams.get("keyword");

        if (!keyword || keyword.length < 2) {
            return NextResponse.json([]);
        }

        const response = await amadeus.referenceData.locations.get({
            keyword,
            subType: 'AIRPORT,CITY',
        });

        const suggestions = response.data.map((loc: any) => ({
            name: loc.name,
            detailedName: loc.detailedName,
            iataCode: loc.iataCode,
        }));

        return NextResponse.json(suggestions);
    } catch (error: any) {
        console.error("Airport API Error:", error);
        return NextResponse.json({ error: "API Failed" }, { status: 500 });
    }
}