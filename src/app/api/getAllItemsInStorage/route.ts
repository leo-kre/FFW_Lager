import { NextResponse } from "next/server";
import { getAllItemsInStorage } from "../../db";

export async function POST(request: Request) {

      const items = await getAllItemsInStorage();

      return NextResponse.json(items);
}