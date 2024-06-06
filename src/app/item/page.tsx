"use client";

import { useRouter } from "next/router";

export default function ItemMenu() {
      const router = useRouter();
      const id = router.query.id;

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
