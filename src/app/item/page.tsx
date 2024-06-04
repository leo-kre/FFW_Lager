"use client";

import { useSearchParams } from "next/navigation";

export default function ItemMenu() {
      const searchParams = useSearchParams();

      const id = searchParams.get("id");

      return (
            <main className="w-full min-h-screen">
                  <h1 className="text-black">{"Item with id: " + id}</h1>
            </main>
      );
}
