import { NextResponse } from "next/server";
import { getDataFromDatabase } from "../../db";

export async function POST(request: Request) {
      const data: RequestData = await request.json();

      console.log("GET DATA FROM API: " + data.id);

      const itemData: ItemBody | null = await getDataFromDatabase(data.id);

      console.log("DATA FROM DATABASE: " + itemData);

      return NextResponse.json(itemData);
}

type ItemBody = {
      title: string;
      id: string;
      location: string;
      description: string;
      inStock: boolean;
};

type RequestData = {
      id: string;
};
