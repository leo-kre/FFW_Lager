"use client";

import { useRouter } from "next/navigation";
import { useRef, useEffect, useState, FormEvent, KeyboardEvent } from "react";

export default function Input_ID() {
  const router = useRouter();

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [id, setID] = useState<string>("");

  if (id.length >= 4) {
    router.push("/view_item?id=" + id);
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
    <main className="w-full h-full">
      <div className="w-full flex justify-between mt-12">
        {inputRefs.map((ref, index) => (
          <input
            key={index}
            ref={ref}
            className="bg-background ring-4 ring-black/[0.2] focus:ring-accent focus:outline-none text-black font-semibold text-6xl w-1/5 h-32 text-center rounded-default"
            type="text"
            maxLength={1}
            pattern="[0-9]*"
            inputMode="numeric"
            onInput={(e) => handleInput(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>
    </main>
  );
}
