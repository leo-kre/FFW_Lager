import { NextResponse } from "next/server";

import dbConnection from "../../../../db";

export async function POST(request: Request) {
      const data: RequestData = await request.json();

      const item: ItemBody = {
            title: "Test",
            id: data.id,
            location: "MTF - A1.1",
            description: "Test description",
            inStock: true,
      };

      const itemData = await getDataFromDatabase(data.id);
      console.log(itemData);

      return NextResponse.json(item);
}

async function getDataFromDatabase(id: string) {
      let ID: Number = Number(id);

      console.log("call database");

      const [rows] = await dbConnection.query("SELECT * FROM Item;");
      console.log("called database");

      return rows;
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
