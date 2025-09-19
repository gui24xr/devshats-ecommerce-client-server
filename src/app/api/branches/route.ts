import { NextResponse } from "next/server";
import DataService from "@/lib/DataService";

export async function GET() {
    const branches = await DataService.getBranches();
    return NextResponse.json({
        branches: branches,

    })
}

