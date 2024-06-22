import { NextResponse } from "next/server";
import { createEntityInDatabase } from "../../db";

export async function POST(request: Request) {
      const data: idBody = await request.json();

      console.log("ADD ITEM: " + data.id);

      const itemData: ItemBody | null = await createEntityInDatabase(data.id);

      return NextResponse.json(itemData);
}

type idBody = {
      id: string;
};

type ItemBody = {
      title: string;
      id: number;
      location: string;
      description: string;
      inStock: boolean;
};
