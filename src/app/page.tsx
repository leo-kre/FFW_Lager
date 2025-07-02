"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import QR_Scanner from "../components/QRScanner";
import Input_ID from "@/components/Input_ID";

export default function Home() {
  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);;
  const [inputMode, setInputMode] = useState("id");

  let inputField;

  const searchInDatabase = (text: string) => {

    return;

    setSearchString(text);
    
    const data: any = fetchItemsFromDatabase(searchString);
    setSearchResults(data);

    console.log(searchResults);
    
  }
  
  let searchResultsBody = Array<any>();

  for(let i = 0; i < searchResults.length; i++) {
    const result = searchResults[i];
  
    searchResultsBody.push(
      <button value={result} className="w-full h-16 border-b border-l border-r text-black first:rounded-t-xl first:border-t last:rounded-b-xl" key={result}>{result}</button>
    )
  }

  if (inputMode == "qr-code") {
    inputField = <QR_Scanner></QR_Scanner>;
  } else {
    inputField = <Input_ID></Input_ID>;
  }

  return (
    <main className="flex min-h-screen bg-background w-full flex-col items-center">
      <Header title="FF-KLU" closeButton={true} addItemButton={true}></Header>

      <input placeholder="Suchen" className="text-black py-1 px-2" 
      onChange={(e) => {searchInDatabase(e.target.value)}}
      onFocus={(e) => {searchInDatabase(e.target.value)}}
      onBlur={() => setSearchString("")}
      ></input>

      <div className="w-full flex flex-col items-center">
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
      </div>

    <div className="w-2/3 top-32 absolute rounded-xl bg-white">
      {(searchString == "" ? "" : searchResultsBody)}
    </div>

    </main>
  );
}

async function fetchItemsFromDatabase(title: string): Promise<string[]> {
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

    const data: string[] = await res.json();

    console.log(data);
    

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}