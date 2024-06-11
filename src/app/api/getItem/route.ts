import { NextResponse } from "next/server";

export async function POST(request: Request) {
      const data: RequestData = await request.json();

      const item: ItemBody = {
            title: "Test",
            id: data.id,
            location: "MTF - A3.1",
            description: "Test description",
            stored: false,
      };

      return NextResponse.json(item);
}

type ItemBody = {
      title: string;
      id: string;
      location: string;
      description: string;
      stored: boolean;
};

type RequestData = {
      id: string;
};
