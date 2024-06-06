"use client";

import Header from "../../components/Header";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState, FormEvent, KeyboardEvent } from "react";

export default function Input_ID() {
      const router = useRouter();

      const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

      const [id, setID] = useState<string>("");

      if (id.length >= 4) {
            router.push("/item?id=" + id);
      }

      useEffect(() => {
            const timer = setTimeout(() => {
                  const firstInput = inputRefs[0].current;
                  if (firstInput) {
                        firstInput.focus();
                  }
            }, 100);

            return () => clearTimeout(timer);
      }, []);

      const handleInput = (e: FormEvent<HTMLInputElement>, index: number) => {
            const target = e.target as HTMLInputElement;
            const value = target.value.replace(/[^0-9]/g, "");
            target.value = value;
            if (value && index < inputRefs.length - 1) {
                  inputRefs[index + 1].current?.focus();
            }
            const newCode = inputRefs.map((ref) => ref.current?.value || "").join("");
            setID(newCode);
      };

      const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
            if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
                  inputRefs[index - 1].current?.focus();
            }
            const newCode = inputRefs.map((ref) => ref.current?.value || "").join("");
            setID(newCode);
      };

      return (
            <main className="w-full min-h-screen">
                  <Header title="" closeButton={true} addItemButton={false}></Header>
                  <div className="w-full flex justify-around mt-6 px-4">
                        {inputRefs.map((ref, index) => (
                              <div key={index} className="ring-4 ring-slate-300 rounded-default w-16 h-32 flex justify-center items-center">
                                    <input ref={ref} className="text-black font-extrabold text-6xl w-16 h-32 text-center" type="text" maxLength={1} pattern="[0-9]*" inputMode="numeric" onInput={(e) => handleInput(e, index)} onKeyDown={(e) => handleKeyDown(e, index)} />
                              </div>
                        ))}
                  </div>
            </main>
      );
}
