import { NextResponse } from "next/server";
import { searchItems } from "../../db";

export async function POST(request: Request) {
      const data: RequestData = await request.json();

      console.log(data.title);

      const Items = await searchItems(data.title);

      return NextResponse.json(Items);
}

type RequestData = {
      title: string;
};
