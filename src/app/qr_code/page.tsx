"use client";

import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import Image from "next/image";
import cameraImage from "../../../public/camera.svg";
import Header from "@/components/Header";

const scannerSize = 300;
const errorMessageTimeoutInSeconds = 3;

export default function QR_Scanner() {
      const router = useRouter();
      const [result, setResult] = useState("No result");
      const [scannerInitialized, setScannerInitialized] = useState(false);
      const [html5QrCode, setHtml5QrCode] = useState(null);
      const [errorMessage, setErrorMessage] = useState("");

      useEffect(() => {
            if (result !== "No result") {
                  if (/^\d{4}$/.test(result)) {
                        router.push("/view_item?id=" + result);
                  } else {
                        setErrorMessage("Ungültiger Code");
                        setTimeout(() => {
                              setErrorMessage("");
                              setResult("No result");
                        }, errorMessageTimeoutInSeconds * 1000);
                  }
            }
      }, [result, router]);

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
                        zoom: 4,
                  },
            };

            const qrCodeSuccessCallback = (decodedText: string) => {
                  setResult(decodedText);
            };

            const scanner: any = new Html5Qrcode("reader");
            setHtml5QrCode(scanner);
            scanner
                  .start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
                  .then(() => setScannerInitialized(true))
                  .catch((error: Error) => {
                        console.error("Unable to start the QR scanner. ", error);
                  });
      };

      useEffect(() => {
            return () => {
                  const htmlCode: any = html5QrCode;
                  if (htmlCode) {
                        htmlCode.stop().catch((error: Error) => {
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
                  <div className="w-full h-full flex flex-col justify-around items-center mt-10">
                        <h1 className="text-accent-red text-xl font-extrabold h-8 w-full text-center">{errorMessage}</h1>
                        <div id="container" className="aspect-square w-fit min-h-[300px] max-w-[90%] h-fit ring-2 rounded-default relative">
                              <div id="reader" className="top-0 left-0 w-full h-full rounded-default ring-2 rounded-default"></div>

                              {!scannerInitialized && (
                                    <button onClick={handleManualScan} className="text-black p-2 rounded absolute inset-0 flex justify-center items-center">
                                          <Image src={cameraImage} alt="QR Code" width={100} height={100} />
                                    </button>
                              )}
                        </div>
                  </div>
            </main>
      );
}
