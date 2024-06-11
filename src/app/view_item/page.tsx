"use client";
import { useEffect, useState } from "react";

export default function ItemMenu() {
      const [title, setTitle] = useState("");
      const [id, setId] = useState("");
      const [location, setLocation] = useState("");
      const [description, setDescription] = useState("");
      const [stored, setStored] = useState(Boolean);

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
                              if (title == "") setTitle(d.title);
                              if (location == "") setLocation(d.location);
                              if (description == "") setDescription(d.description);
                              if (stored == null) setStored(d.stored);
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

      if (!apiData) {
            return (
                  <main className="w-full min-h-screen">
                        <h1 className="text-black">No data found for item with id: {id}</h1>
                  </main>
            );
      }

      const saveData = () => {
            sendDataToAPI({
                  title: title,
                  id: id,
                  location: location,
                  description: description,
                  stored: stored,
            });
      };

      return (
            <main className="w-full min-h-screen text-black">
                  <h1>Title: {title}</h1>
                  <h1>Item with id: {id}</h1>
                  <h1>location: {location}</h1>
                  <h1>stored: {JSON.stringify(stored)}</h1>
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
            const res = await fetch(`localhost:5000/api/getItem`, {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                        id: itemID,
                  }),
            });

            const data = await res.json();
            console.log(data);

            return data;
      } catch (err) {
            console.error(err);
            throw err;
      }
}

async function sendDataToAPI(itemData: ItemBody) {
      try {
            const res = await fetch(`localhost:5000/api/setItem`, {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  body: JSON.stringify(itemData),
            });
            const data = await res.json();
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
      stored: boolean;
};

type APIStatus = {
      status: string;
};
