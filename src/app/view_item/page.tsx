"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const possibleLocations: Array<string> = process.env.NEXT_PUBLIC_LOCATION_LIST?.split(", ") || [];

const closeIcon = require("../assets/cross.svg");
const saveIcon = require("../assets/check.svg");

export default function ItemViewer() {
      const [title, setTitle] = useState("Titel");
      const [id, setId] = useState("");
      const [location, setLocation] = useState(possibleLocations[0]);
      const [containedItems, setContainedItems] = useState<string[]>([]);
      const [inStock, setInStock] = useState(Boolean);

      const [apiData, setApiData] = useState({ id, title, location, containedItems: containedItems, inStock });
      const [loading, setLoading] = useState(true);

      const [wasChangeMade, setWasChangeMade] = useState(false);

      useEffect(() => {
            const params = new URLSearchParams(window.location.search);
            const idParam: any = params.get("id");

            setId(idParam);
      }, []);

      useEffect(() => {
            if (id) {
                  console.log("fetch Data");
                  fetchDataFromAPI(id)
                        .then((dataFromApi) => {
                              setApiData(dataFromApi);
                              setLoading(false);
                              setData(dataFromApi);
                        })
                        .catch((err) => {
                              console.error("Failed to fetch data:", err);
                              setLoading(false);
                        });
            }
      }, [id]);

      const setData = (dataFromApi: any) => {
            const data: ItemBody = dataFromApi;
            setTitle(data.title);
            setLocation(data.location);
            setContainedItems(data.containedItems);
            setInStock(data.inStock);
      };

      if (loading) {
            return (
                  <main className="w-full min-h-screen">
                        <h1 className="text-black">Loading...</h1>
                  </main>
            );
      }

      const saveData = () => {
            sendDataToAPI({
                  title: title,
                  id: id,
                  location: location,
                  containedItems: containedItems,
                  inStock: inStock,
            });
      };

      const createAndLoadItem = async () => {
            let data: ItemBody | null = await createItem(id);

            if(data == null) {
                  data = {
                        title: "Titel",
                        id: id,
                        location: possibleLocations[0],
                        containedItems: [],
                        inStock: true
                  }
            }

            setApiData(data); // Update apiData with the newly created item
            setData(data); // Update the form fields with the newly created item data
      };

      if (!apiData) {
            return (
                  <main className="w-full min-h-screen flex justify-center items-center">
                        <button
                              className="bg-gray-50 ring-accent-gray ring-1 p-1 rounded-default text-black"
                              onClick={async () => {
                                    createAndLoadItem();
                              }}
                        >
                              {"Gegenstand für #" + id + " erstellen"}
                        </button>
                  </main>
            );
      }

      let locationOptions = Array<any>();

      possibleLocations.forEach((location, index) => {
            locationOptions.push(
                  <option key={"option" + index} value={location}>
                        {location}
                  </option>
            );
      });

      const updateContainedItems = (index: number, value: string) => {
            const newData = [...containedItems];
            newData[index] = value;
            setContainedItems(newData);
      };

      const createNewContainedItem = () => {
            setContainedItems([...containedItems, ""]);
      };

      const deleteContainedItem = (index: number) => {
            console.log("delete Item, " + index);
            
            const newData = [...containedItems];
            newData.splice(index, 1);
            setContainedItems(newData);
          };

      let containedItemsBody = Array<any>();

      if(containedItems != null) {
            containedItems.forEach((containedItem: string, index: number) => {
                  containedItemsBody.push(
                        <div className="w-full flex border border-accent1 rounded-md bg-white" key={index}>
                              <button className="p-2 bg-[#FF3B30] rounded-md rounded-r-none border-r border-accent1" onClick={() => {
                                    deleteContainedItem(index);
                                    setWasChangeMade(true);
                              }}>🗑️</button>
                              <input
                              className="pl-2 w-full rounded-r-md"
                              type="text"
                              key={index}
                              value={containedItem}
                              onChange={(e) => updateContainedItems(index, e.target.value)}
                              />
                        </div>
                        
                  )
            });
      }

      return (
            <main className="w-full min-h-screen text-black p-4 bg-white">
                  <div className="w-full px-2 mb-3 flex justify-between content-center items-center">
                        <a href="/" className="w-9 aspect-square flex justify-center content-center items-center">
                        <Image alt="close" src={closeIcon} className="w-7 aspect-square"></Image>
                        </a>
                        <h1 className="font-bold text-3xl">ID: {id.toString().padStart(4, '0')}</h1>
                        <button className={wasChangeMade ? "bg-red-500" : "bg-green-500" + " aspect-square w-9 rounded-md flex justify-center content-center"} onClick={() => {
                              saveData();
                              setWasChangeMade(false);
                              }}>
                                    <Image alt="save" src={saveIcon} className="aspect-square w-7 fill-green-400"></Image>
                              </button>
                        
                  </div>
                  
                  <div className="w-full">
                        <input
                              value={title}
                              className="bg-transparent text-xl font-semibold border border-accent1 focus-none outline-none w-full px-2 py-1 mb-4 rounded-md"
                              onChange={(event) => {
                                    setTitle(event.target.value);
                                    setWasChangeMade(true);
                              }}
                        ></input>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                        <h1>Lagerort: </h1>
                        <select
                              value={location}
                              onChange={(event) => {
                                    setLocation(event.target.value);
                                    setWasChangeMade(true);
                              }}
                              className="bg-transparent border rounded p-2"
                        >
                              {locationOptions}
                        </select>
                  </div>

                  <div className="flex gap-1 mb-2">
                        <h1>Im Lager: </h1>
                        <button
                              className={"text-center min-w-10 px-2 flex justify-center items-center rounded-default " + (inStock ? "bg-green-500" : "bg-red-500")}
                              onClick={() => {
                                    setInStock(!inStock);
                                    setWasChangeMade(true);
                              }}
                        >
                              <h1 className="w-fit ">{inStock ? "Ja" : "Nein"}</h1>
                        </button>
                  </div>

                  <div className="w-full h-fit flex justify-left flex-col gap-2">
                        {containedItemsBody}
                  </div>

                  <button className="w-full border border-accent1 rounded-md mt-2 text-2xl" onClick={() => {
                        createNewContainedItem();
                        setWasChangeMade(true);
                        }}>+</button>

                  
            </main>
      );
}

async function fetchDataFromAPI(itemID: string) {
      try {
            const res = await fetch(process.env.NEXT_PUBLIC_HOSTDOMAIN + "/api/getItem", {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                        id: itemID,
                  }),
            });

            if (!res.ok) {
                  throw new Error("Failed to fetch data");
            }

            const data = await res.json();
            return data;
      } catch (err) {
            console.error(err);
            throw err;
      }
}

async function sendDataToAPI(itemData: ItemBody) {
      try {
            const res = await fetch(process.env.NEXT_PUBLIC_HOSTDOMAIN + "/api/setItem", {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  body: JSON.stringify(itemData),
            });
            const data: APIStatus = await res.json();
            return data;
      } catch (err) {
            console.error(err);
            throw err;
      }
}

async function createItem(id: string) {
      try {
            const res = await fetch(process.env.NEXT_PUBLIC_HOSTDOMAIN + "/api/addItem", {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ id: id }),
            });

            if(res == null) return null;

            const data: ItemBody = await res.json();
            return data;
      } catch (err) {
            console.error(err);
            throw err;
      }
}

type ItemBody = {
      title: string;
      id: string;
      location: string;
      containedItems: string[];
      inStock: boolean;
};

type APIStatus = {
      status: string;
};