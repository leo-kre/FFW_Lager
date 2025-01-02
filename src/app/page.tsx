"use client";
import { useState } from "react";
import Header from "../components/Header";
import QR_Scanner from "../components/QRScanner";
import Input_ID from "@/components/Input_ID";

export default function Home() {
  const [inputMode, setInputMode] = useState("id");

  let inputField;

  if (inputMode == "qr-code") {
    inputField = <QR_Scanner></QR_Scanner>;
  } else {
    inputField = <Input_ID></Input_ID>;
  }

  return (
    <main className="flex min-h-screen bg-background w-full flex-col items-center">
      <Header title="FF-KLU" closeButton={true} addItemButton={true}></Header>

      <input placeholder="Search"></input>
      <div className="w-2/3 h-10 mt-6 flex flex-row justify-between">
        <div
          className={
            "bg-accent w-24 h-full rounded-3xl text-center content-center font-semibold text-xl " +
            (inputMode == "qr-code"
              ? "bg-accent text-white"
              : "bg-black/[0.2] text-black")
          }
          onClick={() => {
            setInputMode("qr-code");
          }}
        >
          QR
        </div>
        <div
          className={
            "bg-accent w-24 h-full rounded-3xl text-center content-center font-semibold text-xl " +
            (inputMode == "id"
              ? "bg-accent text-text"
              : "bg-black/[0.2] text-black")
          }
          onClick={() => setInputMode("id")}
        >
          ID
        </div>
      </div>
      <div className="m-2 w-2/3 flex items-center justify-center">
        {inputField}
      </div>
    </main>
  );
}

async function searchItemsOnDB(title: string) {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_HOSTDOMAIN + "/api/searchItem",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title }),
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data: Array<ItemBody> = await res.json();
    return data;
  } catch (err) {
    console.log("ERROR. " + err);

    console.error(err);
    throw err;
  }
}

function searchLocations(searchText: string) {
  const possibleLocations: Array<string> =
    process.env.NEXT_PUBLIC_LOCATION_LIST?.split(", ") || [];
}

type ItemBody = {
  title: string;
  id: string;
  location: string;
  description: string;
  inStock: boolean;
};
