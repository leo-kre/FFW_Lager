import { NextResponse } from "next/server";
import { saveDataToDatabase } from "../../db";

export async function POST(request: Request) {
      const data = await request.json();

      await saveDataToDatabase(data);

      return NextResponse.json({
            status: "saved",
      });
}
