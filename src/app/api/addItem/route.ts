import { NextResponse } from "next/server";
import { createEntityInDatabase } from "../../db";

export async function POST(request: Request) {
  const data: idBody = await request.json();

  console.log("ADD ITEM: " + data.id);

  const result = await createEntityInDatabase(data.id);

  if (result === null) {
    return NextResponse.json({ status: "failed to create or retrieve item" }, { status: 500 });
  }

  if ("status" in result) {
    return NextResponse.json(result);
  }

  return NextResponse.json(result);
}

type idBody = {
  id: string;
};

type ItemBody = {
  title: string;
  id: number;
  location: string;
  containedItems: string[];
  inStock: boolean;
};