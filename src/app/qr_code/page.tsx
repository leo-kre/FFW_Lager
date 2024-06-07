"use client";

import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import Image from "next/image";
import cameraImage from "../../../public/camera.svg";
import Header from "@/components/Header";

const scannerSize = 300;

export default function QR_Scanner() {
      const router = useRouter();
      const [result, setResult] = useState("No result");
      const [scannerInitialized, setScannerInitialized] = useState(false);
      const [html5QrCode, setHtml5QrCode] = useState(null);
      const [error, setError] = useState(null);

      if (result !== "No result") {
            router.push("/item?id=" + result);
      }

      const startScanner = () => {
            const config = {
                  fps: 30,
                  qrbox: { width: scannerSize, height: scannerSize },
                  aspectRatio: 1.0,
                  experimentalFeatures: {
                        useBarCodeDetectorIfSupported: true,
                  },
                  videoConstraints: {
                        facingMode: "environment",
                        zoom: 4, // Apply a slight zoom
                  },
            };

            const qrCodeSuccessCallback = (decodedText: string) => {
                  setResult(decodedText);
            };

            const qrCodeErrorCallback = (errorMessage: any) => {
                  setError(errorMessage);
            };

            const scanner: any = new Html5Qrcode("reader");
            setHtml5QrCode(scanner);
            scanner
                  .start({ facingMode: "environment" }, config, qrCodeSuccessCallback, qrCodeErrorCallback)
                  .then(() => setScannerInitialized(true))
                  .catch((error: Error) => {
                        console.error("Unable to start the QR scanner. ", error);
                  });
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
                  setScannerInitialized(true);
                  startScanner();
            }
      };

      return (
            <main className="w-full min-h-screen flex flex-col items-center">
                  <Header addItemButton={false} title="" closeButton={true}></Header>
                  <div className="w-full h-full flex flex-col justify-around items-center mt-10">
                        <div id="container" className="w-[350px] min-h-[350px] h-fit ring-2 rounded-default relative">
                              <div id="reader" className="absolute top-0 left-0 w-full h-full"></div>
                              {!scannerInitialized && (
                                    <button onClick={handleManualScan} className="text-black p-2 rounded absolute w-full h-full flex justify-center items-center">
                                          <Image src={cameraImage} alt="QR Code" width={100} height={100} />
                                    </button>
                              )}
                        </div>
                  </div>
            </main>
      );
}
