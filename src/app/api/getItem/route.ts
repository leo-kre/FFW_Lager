import { NextResponse } from "next/server";

import connection from "../../../../lib/db";

export async function POST(request: Request) {
      const data: RequestData = await request.json();

      const item: ItemBody = {
            title: "Test",
            id: data.id,
            location: "MTF - A1.1",
            description: "Test description",
            stored: true,
      };

      return NextResponse.json(item);
}

function getDataFromDatabase(id: string) {
      let ID: Number = Number(id);
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
