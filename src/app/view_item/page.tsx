"use client";
import { useEffect, useState } from "react";

export default function ItemMenu() {
      const [id, setId] = useState();

      useEffect(() => {
            const params = new URLSearchParams(window.location.search);
            const idParam: any = params.get("id");
            setId(idParam);
      }, []);

      if (!id) {
            // Handle the case where id is not available
            return (
                  <main className="w-full min-h-screen">
                        <h1 className="text-black">Loading...</h1>
                  </main>
            );
      }

      return (
            <main className="w-full min-h-screen">
                  <h1 className="text-black">Item with id: {id}</h1>
            </main>
      );
}
