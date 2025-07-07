"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import QR_Scanner from "../components/QRScanner";
import Input_ID from "@/components/Input_ID";

type Item = {
  id: number;
  title: string;
};

export default function Home() {
  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [inputMode, setInputMode] = useState<"id" | "qr-code">("id");
  const [itemsInStorage, setItemsInStorage] = useState<Item[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchItemsFromDatabase();
        setItemsInStorage(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const searchInDatabase = (text: string) => {
    const lowered = text.trim().toLowerCase();
    setSearchString(text);
    setSearchResults(
      itemsInStorage.filter((item) =>
        item.title.toLowerCase().includes(lowered)
      )
    );
  };

  const searchResultsBody = searchResults.map((item) => (
    <a
      key={`${item.id}-${item.title}`}
      href={`/view_item?id=${item.id}`}
      className="block w-full h-16 px-4 py-2 border-b border-l border-r text-black first:rounded-t-xl first:border-t last:rounded-b-xl hover:bg-gray-100"
    >
      <div className="text-base font-medium">{item.title}</div>
      <div className="text-sm text-gray-500">ID: {item.id}</div>
    </a>
  ));

  const inputField =
    inputMode === "qr-code" ? (
      <QR_Scanner />
    ) : (
      <Input_ID/>
    );

  return (
    <main className="flex min-h-screen bg-background w-full flex-col items-center">
      <Header title="FF-KLU" closeButton={true} addItemButton={true} />

      <input
        placeholder="Suchen"
        className="text-black py-1 px-2"
        value={searchString}
        onChange={(e) => searchInDatabase(e.target.value)}
        onFocus={(e) => searchInDatabase(e.target.value)}
      />

      <div className="w-full flex flex-col items-center">
        <div className="w-2/3 h-10 mt-6 flex flex-row justify-between">
          <div
            className={
              "w-24 h-full rounded-3xl text-center content-center font-semibold text-xl cursor-pointer " +
              (inputMode === "qr-code"
                ? "bg-accent text-white"
                : "bg-black/[0.2] text-black")
            }
            onClick={() => setInputMode("qr-code")}
          >
            QR
          </div>
          <div
            className={
              "w-24 h-full rounded-3xl text-center content-center font-semibold text-xl cursor-pointer " +
              (inputMode === "id"
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
      </div>

      <div className="w-2/3 top-32 absolute rounded-xl bg-white">
        {searchString !== "" && searchResultsBody}
      </div>
    </main>
  );
}

async function fetchItemsFromDatabase(): Promise<Item[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_HOSTDOMAIN}/api/getAllItemsInStorage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch data");
  return (await res.json()) as Item[];
}