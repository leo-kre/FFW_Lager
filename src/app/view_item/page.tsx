"use client";
import { log } from "console";
import { useEffect, useState } from "react";

const possibleLocations: Array<string> = process.env.NEXT_PUBLIC_LOCATION_LIST?.split(", ") || [];

export default function ItemViewer() {
      const [title, setTitle] = useState("Titel");
      const [id, setId] = useState("");
      const [location, setLocation] = useState(possibleLocations[0]);
      const [containedItems, setContainedItems] = useState<string[]>([]);
      const [inStock, setInStock] = useState(Boolean);

      const [apiData, setApiData] = useState({ id, title, location, containedItems: containedItems, inStock });
      const [loading, setLoading] = useState(true);

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
            const data: ItemBody | null = await createItem(id);

            if(data == null) return;

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
                        <div className="w-full flex" key={index}>
                              <button className="p-1 mr-3 bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-md" onClick={() => deleteContainedItem(index)}>🗑️</button>
                              <input
                              className="w-full mr-3 p-2 rounded-sm"
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
            <main className="w-full min-h-screen text-black p-4">
                  <div className="w-full">
                        <input
                              value={title}
                              className="bg-transparent text-3xl font-bold border border-b-black focus-none outline-none w-full px-2 py-1"
                              onChange={(event) => {
                                    setTitle(event.target.value);
                              }}
                        ></input>
                  </div>

                  <h1>Item with id: {id}</h1>

                  <div className="flex items-center gap-1">
                        <h1>Lagerort: </h1>
                        <select
                              value={location}
                              onChange={(event) => {
                                    setLocation(event.target.value);
                              }}
                              className="bg-transparent border rounded p-2"
                        >
                              {locationOptions}
                        </select>
                  </div>

                  <div className="w-full h-fit flex justify-left flex-col gap-2">
                        {containedItemsBody}
                  </div>

                  <button className="p-2" onClick={() => {createNewContainedItem()}}>Add contained Item</button>

                  <div className="flex gap-1">
                        <h1>Im Lager: </h1>
                        <button
                              className={"text-center min-w-10 px-2 flex justify-center items-center rounded-default " + (inStock ? "bg-green-500" : "bg-accent-red")}
                              onClick={() => {
                                    setInStock(!inStock);
                              }}
                        >
                              <h1 className="w-fit ">{inStock ? "Ja" : "Nein"}</h1>
                        </button>
                  </div>

                  <button
                        className="bg-green-500 p-2 rounded-default"
                        onClick={() => {
                              saveData();
                        }}
                  >
                        Save Data
                  </button>
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