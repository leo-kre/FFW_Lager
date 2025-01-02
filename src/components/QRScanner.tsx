"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BrowserMultiFormatReader } from "@zxing/library";

export default function QRScanner() {
  const router = useRouter();
  const [result, setResult] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    // Ensure navigator.mediaDevices is available before accessing it
    if (typeof window !== "undefined" && navigator.mediaDevices) {
      if (videoRef.current) {
        codeReader.decodeFromVideoDevice(
          null,
          videoRef.current,
          (result, error) => {
            if (result) {
              setResult(result.getText());
            }
            if (error) {
              //console.error(error);
            }
          },
        );
      }
    } else {
      setHasPermission(false); // If not available, we disable scanning
    }

    return () => {
      // Clean up the camera stream when the component unmounts
      codeReader.reset();
    };
  }, []);

  useEffect(() => {
    if (result) {
      if (/^\d{4}$/.test(result)) {
        router.push(`/view_item?id=${result}`);
      }
    }
  }, [result, router]);

  return (
    <main className="flex flex-col items-center bg-black w-full h-full">
      {!hasPermission && (
        <p className="text-white mt-4">
          Camera access is not available. Please ensure you're on HTTPS and the
          browser supports camera access.
        </p>
      )}
      {hasPermission && (
        <video ref={videoRef} style={{ width: "100%", height: "auto" }} />
      )}
      {result && <p className="text-white mt-4">Scanned Result: {result}</p>}
    </main>
  );
}
