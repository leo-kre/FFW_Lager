"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";

export default function QR_Scanner() {
      const router = useRouter();
      const [result, setResult] = useState("No result");

      if (result != "No result") {
            router.push("/item?id=" + result);
      }

      useEffect(() => {
            const config = { fps: 30, qrbox: { width: 300, height: 300 } };
            const qrCodeSuccessCallback = (decodedText: any, decodedResult: any) => {
                  setResult(decodedText);
            };
            const qrCodeErrorCallback = (errorMessage: any) => {
                  console.error(errorMessage);
            };

            const html5QrcodeScanner = new Html5QrcodeScanner("reader", config, false);
            html5QrcodeScanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);

            // Clean up the scanner when the component unmounts
            return () => {
                  html5QrcodeScanner.clear().catch((error) => {
                        console.error("Failed to clear html5QrcodeScanner. ", error);
                  });
            };
      }, []);

      return (
            <main className="bg-slate-50 w-full min-h-screen flex flex-col justify-around items-center">
                  <div className="w-[300px] h-[300px] bg-red-600">
                        <div id="reader" className="ring-2 ring-black"></div>
                  </div>
                  <div></div>
            </main>
      );
}
