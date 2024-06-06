"use client";

import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import Image from "next/image";
import cameraImage from "../../../public/camera.svg"; // Importiere das Bild korrekt

export default function QR_Scanner() {
      const router = useRouter();
      const [result, setResult] = useState("No result");
      const [scannerInitialized, setScannerInitialized] = useState(false);
      const [html5QrCode, setHtml5QrCode] = useState(null);

      if (result != "No result") {
            router.push("/item?id=" + result);
      }

      const startScanner = () => {
            const config = { fps: 10, qrbox: { width: 300, height: 300 }, rememberLastUsedCamera: true };
            const qrCodeSuccessCallback = (decodedText: any) => {
                  setResult(decodedText);
            };
            const qrCodeErrorCallback = (errorMessage: any) => {
                  // Do nothing if no QR code is found
            };

            const scanner = new Html5Qrcode("reader");
            setHtml5QrCode(scanner);
            scanner.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, qrCodeErrorCallback).catch((error) => {
                  console.error("Unable to start the QR scanner. ", error);
            });
            setScannerInitialized(true);
      };

      useEffect(() => {
            return () => {
                  if (html5QrCode) {
                        html5QrCode.stop().catch((error) => {
                              console.error("Failed to stop html5QrcodeScanner. ", error);
                        });
                  }
            };
      }, [html5QrCode]);

      const handleManualScan = () => {
            if (!scannerInitialized) {
                  startScanner();
            }
      };

      return (
            <main className="bg-slate-50 w-full min-h-screen flex flex-col justify-around items-center">
                  <div id="container" className="w-[300px] aspect-square ring-2 rounded-default relative">
                        <div id="reader" className="absolute top-0 left-0 w-full h-full"></div>
                        {!scannerInitialized && (
                              <button onClick={handleManualScan} className=" text-black p-2 rounded absolute w-full h-full flex justify-center items-center">
                                    <Image src={cameraImage} alt="QR Code" width={100} height={100} />
                              </button>
                        )}
                  </div>
            </main>
      );
}
