"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BrowserMultiFormatReader } from "@zxing/browser";
import Image from "next/image";
import cameraImage from "../../../public/camera.svg";
import Header from "@/components/Header";

const scannerSize = 300;

export default function QR_Scanner() {
      const router = useRouter();
      const [result, setResult] = useState("No result");
      const [scannerInitialized, setScannerInitialized] = useState(false);
      const [scanner, setScanner] = useState<BrowserMultiFormatReader | null>(null);
      const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

      useEffect(() => {
            if (scannerInitialized && !scanner) {
                  const codeReader = new BrowserMultiFormatReader();
                  navigator.mediaDevices
                        .getUserMedia({ video: { facingMode: "environment" } })
                        .then((stream) => {
                              setVideoStream(stream);
                              const videoElement = document.getElementById("video");
                              if (videoElement) {
                                    videoElement.srcObject = stream;
                                    videoElement.play();
                              }
                              return codeReader.decodeFromVideoElement(videoElement, (res, err) => {
                                    if (res) {
                                          setResult(res.getText());
                                    }
                              });
                        })
                        .catch((err) => console.error(err));
                  setScanner(codeReader);
            }
      }, [scannerInitialized, scanner]);

      useEffect(() => {
            return () => {
                  if (videoStream) {
                        videoStream.getTracks().forEach((track) => track.stop());
                  }
                  if (scanner) {
                        const videoElement = document.getElementById("video");
                        if (videoElement) {
                              videoElement.removeEventListener("play", scanner.decodeFromVideoElement);
                        }
                  }
            };
      }, [videoStream, scanner]);

      useEffect(() => {
            if (result !== "No result") {
                  router.push("/item?id=" + result);
            }
      }, [result, router]);

      const handleManualScan = () => {
            setScannerInitialized(true);
      };

      return (
            <main className="w-full min-h-screen flex flex-col items-center">
                  <Header addItemButton={false} title="" closeButton={true}></Header>
                  <div className="w-full h-full flex flex-col justify-around items-center mt-10"></div>
                  <div id="container" className="w-[250px] min-h-[250px] h-fit ring-2 rounded-default relative">
                        {scannerInitialized ? (
                              <video id="video" className="absolute top-0 left-0 w-full h-full rounded-default" />
                        ) : (
                              <button onClick={handleManualScan} className="text-black p-2 rounded absolute w-full h-full flex justify-center items-center">
                                    <Image src={cameraImage} alt="QR Code" width={100} height={100} />
                              </button>
                        )}
                  </div>
            </main>
      );
}
