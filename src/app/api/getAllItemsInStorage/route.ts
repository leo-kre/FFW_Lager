import { NextResponse } from "next/server";
import { getAllItemsInStorage } from "../../db";

export async function POST(request: Request) {

      const items = await getAllItemsInStorage();

      console.log(items);

      return NextResponse.json(items);
}