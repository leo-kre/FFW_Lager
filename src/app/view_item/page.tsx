"use client";
import { useEffect, useState } from "react";

const possibleLocations: Array<string> = process.env.NEXT_PUBLIC_LOCATION_LIST?.split(", ") || [];

export default function ItemViewer() {
      const [title, setTitle] = useState("Titel");
      const [id, setId] = useState("");
      const [location, setLocation] = useState(possibleLocations[0]);
      const [description, setDescription] = useState("Beschreibung");
      const [inStock, setInStock] = useState(Boolean);

      const [apiData, setApiData] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            const params = new URLSearchParams(window.location.search);
            const idParam: any = params.get("id");
            setId(idParam);
      }, []);

      useEffect(() => {
            if (id) {
                  fetchDataFromAPI(id)
                        .then((dataFromApi) => {
                              setApiData(dataFromApi);
                              setLoading(false);

                              const d: ItemBody = dataFromApi;
                              setTitle(d.title);
                              setLocation(d.location);
                              setDescription(d.description);
                              setInStock(d.inStock);
                        })
                        .catch((err) => {
                              console.error("Failed to fetch data:", err);
                              setLoading(false);
                        });
            }
      }, [id]);

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
                  description: description,
                  inStock: inStock,
            });
      };

      if (!apiData) {
            return (
                  <main className="w-full min-h-screen">
                        <h1 className="text-black">No data found for item with id: {id}</h1>
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

      return (
            <main className="w-full min-h-screen text-black">
                  <input
                        value={title}
                        className="bg-transparent text-3xl font-bold"
                        onChange={(event) => {
                              setTitle(event.target.value);
                        }}
                  ></input>
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

                  <textarea
                        className="ring-gray-300"
                        maxLength={50}
                        value={description}
                        onChange={(event) => {
                              setDescription(event.target.value);
                        }}
                  ></textarea>

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

type ItemBody = {
      title: string;
      id: string;
      location: string;
      description: string;
      inStock: boolean;
};

type APIStatus = {
      status: string;
};
