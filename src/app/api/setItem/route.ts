import { NextResponse } from "next/server";

export async function POST(request: Request) {
      const data = await request.json();

      console.log(data);

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
