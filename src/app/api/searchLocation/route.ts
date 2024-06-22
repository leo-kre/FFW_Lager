import { NextResponse } from "next/server";
import { searchItem } from "../../db";

export async function POST(request: Request) {
      const data: RequestData = await request.json();

      const Items: Array<ItemBody> = await searchItem(data.title);

      return NextResponse.json(Items);
}

type ItemBody = {
      title: string;
      id: string;
      location: string;
      description: string;
      inStock: boolean;
};

type RequestData = {
      title: string;
};
