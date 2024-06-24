"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Image from "next/image";

const QR_CODE = "/qr-code.svg";
const PASSWORD = "/password.svg";

export default function Home() {
      const [searchTerm, setSearchTerm] = useState("");
      const [searchResult, setSearchResult] = useState<Array<ItemBody>>([]);
      const [showSearchResults, setShowSearchResults] = useState(true);

      useEffect(() => {
            if (searchTerm && searchTerm.length > 0) {
                  const handleSearch = async () => {
                        const d: Array<ItemBody> = await searchItemsOnDB(searchTerm);
                        setSearchResult(d);
                  };

                  handleSearch();
            }
      }, [searchTerm]);

      const searchResultObjectList: Array<any> = [];

      searchResultObjectList.push(<h1 className="text-black">{"Items: " + searchTerm + " : " + searchResult.length}</h1>);

      searchResult.forEach((item, index) => {
            searchResultObjectList.push(
                  <a href={"/view_item?id=" + item.id} key={index} className="border-t border-black w-full last:border-y">
                        <h1 className="text-black">{item.title}</h1>
                        <h2 className="text-accent-gray">{item.id}</h2>
                  </a>
            );
      });

      console.log(searchResultObjectList);

      return (
            <main className="flex min-h-screen w-full flex-col items-center">
                  <Header title="FFW-KLU Lager" closeButton={true} addItemButton={true}></Header>

                  <input
                        type="text"
                        placeholder="Suchen"
                        value={searchTerm}
                        onInput={(e) => {
                              const text = (e.target as HTMLInputElement).value;
                              setSearchTerm(text);
                        }}
                        onFocus={() => setShowSearchResults(true)}
                        onBlur={() => setShowSearchResults(false)}
                        className="bg-gray-50 ring-accent-gray ring-1 p-1 pl-2 rounded-md text-black"
                  ></input>

                  <div className="w-full h-full flex flex-col justify-center">
                        {showSearchResults && searchTerm.length > 0 ? (
                              <div className="w-full flex flex-col items-center gap-2 mt-2">{searchResultObjectList}</div>
                        ) : (
                              <div className="w-full h-full flex justify-center">
                                    <div className="w-4/5 h-full flex flex-col justify-center items-center gap-4 mt-5">
                                          <a className="bg-accent-red w-4/5 aspect-square rounded-xl flex justify-center items-center" href="./qr_code">
                                                <div className="w-fit h-fit flex justify-center items-center p-4">
                                                      <Image src={QR_CODE} alt="QR Code" width={200} height={200} />
                                                </div>
                                          </a>

                                          <a className="bg-accent-blue w-4/5 aspect-square rounded-xl flex justify-center items-center" href="./id">
                                                <div className="w-fit h-fit flex justify-center items-center p-4">
                                                      <Image src={PASSWORD} alt="PASSWORD" width={200} height={200} />
                                                </div>
                                          </a>
                                    </div>
                              </div>
                        )}
                  </div>
            </main>
      );
}

async function searchItemsOnDB(title: string) {
      try {
            const res = await fetch(process.env.NEXT_PUBLIC_HOSTDOMAIN + "/api/searchItem", {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ title: title }),
            });

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
      const possibleLocations: Array<string> = process.env.NEXT_PUBLIC_LOCATION_LIST?.split(", ") || [];
}

type ItemBody = {
      title: string;
      id: string;
      location: string;
      description: string;
      inStock: boolean;
};
