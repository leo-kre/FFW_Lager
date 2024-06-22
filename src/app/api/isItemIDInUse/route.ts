import { NextResponse } from "next/server";
import { isItemIDInUse } from "../../db";

export async function POST(request: Request) {
      const data: RequestData = await request.json();

      const itemData: boolean = await isItemIDInUse(Number(data.id));

      return NextResponse.json(itemData);
}

type RequestData = {
      id: string;
};
