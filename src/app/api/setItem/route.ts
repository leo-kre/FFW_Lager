import { NextResponse } from "next/server";
import { saveDataToDatabase } from "../../db";

export async function POST(request: Request) {
      const data = await request.json();

      const Promise: any = await saveDataToDatabase(data);

      return NextResponse.json({
            status: "saved",
      });
}

type ItemBody = {
      title: string;
      id: number;
      location: string;
      description: string;
      inStock: boolean;
};
