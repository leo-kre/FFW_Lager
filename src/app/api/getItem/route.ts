import { NextResponse } from "next/server";
import { getDataFromDatabase } from "../../db";

export async function POST(request: Request) {
      const data: RequestData = await request.json();

      const itemData: ItemBody | null = await getDataFromDatabase(data.id);

      return NextResponse.json(itemData);
}

type ItemBody = {
      title: string;
      id: string;
      location: string;
      containedItems: string[];
      inStock: boolean;
};

type RequestData = {
      id: string;
};
