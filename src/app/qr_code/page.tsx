"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import cameraImage from "../../../public/camera.svg";
import Header from "@/components/Header";

const scannerSize = 300;

export default function QR_Scanner() {
      const router = useRouter();
      const [result, setResult] = useState("No result");

      const handleInputChange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                  try {
                        const imageData = await decodeImage(file);
                        const code = jsQR(imageData.data, imageData.width, imageData.height);
                        if (code) {
                              setResult(code.data);
                              router.push("/item?id=" + code.data);
                        } else {
                              setResult("No QR code found");
                        }
                  } catch (error) {
                        console.error("Error decoding image: ", error);
                        setResult("Error decoding image");
                  }
            }
      };

      const handleManualScan = () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.capture = "camera";
            input.onchange = handleInputChange;
            input.click();
      };

      return (
            <main className="w-full min-h-screen flex flex-col items-center">
                  <Header addItemButton={false} title="" closeButton={true}></Header>
                  <div className="w-full h-full flex flex-col justify-around items-center mt-10"></div>
                  <div id="container" className="w-[250px] min-h-[250px] h-fit ring-2 rounded-default relative">
                        <button onClick={handleManualScan} className="text-black p-2 rounded absolute w-full h-full flex justify-center items-center">
                              <Image src={cameraImage} alt="QR Code" width={100} height={100} />
                        </button>
                  </div>
            </main>
      );
}
