"use client";

import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import Image from "next/image";
import cameraImage from "../../../public/camera.svg";
import Header from "@/components/Header";

export default function QR_Scanner() {
      const router = useRouter();
      const [result, setResult] = useState("No result");
      const [scannerInitialized, setScannerInitialized] = useState(false);
      const [html5QrCode, setHtml5QrCode] = useState(null);

      if (result != "No result") {
            router.push("/item?id=" + result);
      }

      const startScanner = () => {
            const config = {
                  fps: 30, // Increased FPS for better scanning performance
                  qrbox: { width: 250, height: 250 }, // Adjusted QR box size
                  rememberLastUsedCamera: true,
                  aspectRatio: 1.0,
                  experimentalFeatures: {
                        useBarCodeDetectorIfSupported: true, // Use barcode detector if supported
                  },
            };

            const qrCodeSuccessCallback = (decodedText: string) => {
                  setResult(decodedText);
            };

            const qrCodeErrorCallback = (errorMessage: any) => {
                  // Do nothing if no QR code is found
            };

            const scanner: any = new Html5Qrcode("reader");
            setHtml5QrCode(scanner);
            scanner.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, qrCodeErrorCallback).catch((error: Error) => {
                  console.error("Unable to start the QR scanner. ", error);
            });
            setScannerInitialized(true);
      };

      useEffect(() => {
            return () => {
                  const htmlQR: any = html5QrCode;
                  if (html5QrCode) {
                        htmlQR.stop().catch((error: Error) => {
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
            <main className="w-full min-h-screen flex flex-col items-center">
                  <Header addItemButton={false} title="" closeButton={true}></Header>
                  <div className="w-full h-full flex flex-col justify-around items-center mt-10"></div>
                  <div id="container" className="w-[250px] min-h-[250px] h-fit ring-2 rounded-default relative">
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
