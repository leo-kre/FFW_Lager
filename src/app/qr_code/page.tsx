"use client";
import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/router"; // Changed import for useRouter
import Image from "next/image";
import cameraImage from "../../../public/camera.svg";
import Header from "@/components/Header";

export default function QR_Scanner() {
      const router = useRouter();
      const [result, setResult] = useState("No result");
      const [scannerInitialized, setScannerInitialized] = useState(false);
      const [html5QrCode, setHtml5QrCode] = useState(null);

      useEffect(() => {
            const startScanner = async () => {
                  try {
                        const config = { fps: 10, qrbox: { width: 350, height: 350 }, rememberLastUsedCamera: true };
                        const qrCodeSuccessCallback = (decodedText) => {
                              setResult(decodedText);
                        };
                        const qrCodeErrorCallback = (errorMessage) => {
                              // Do nothing if no QR code is found
                        };

                        const scanner = new Html5Qrcode("reader");
                        setHtml5QrCode(scanner);
                        await scanner.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, qrCodeErrorCallback);
                        setScannerInitialized(true);
                  } catch (error) {
                        console.error("Error starting scanner:", error);
                  }
            };

            if (!scannerInitialized) {
                  startScanner();
            }

            return () => {
                  if (html5QrCode) {
                        html5QrCode.stop().catch((error) => {
                              console.error("Failed to stop html5QrcodeScanner. ", error);
                        });
                  }
            };
      }, [scannerInitialized, html5QrCode]);

      return (
            <main className="w-full min-h-screen flex flex-col items-center">
                  <Header addItemButton={false} title="" closeButton={true}></Header>
                  <div className="w-full h-full flex flex-col justify-around items-center mt-10"></div>
                  <div id="container" className="w-[350px] min-h-[350px] h-fit ring-2 rounded-default relative">
                        <div id="reader" className="absolute top-0 left-0 w-full h-full"></div>
                        {!scannerInitialized && (
                              <button className="hidden text-black p-2 rounded absolute w-full h-full flex justify-center items-center" id="scannerButton">
                                    <Image src={cameraImage} alt="QR Code" width={100} height={100} />
                              </button>
                        )}
                  </div>
            </main>
      );
}
