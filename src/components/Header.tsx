"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import closeButton from "../../public/close.svg";
import addButton from "../../public/cross.svg";

export default function Header(props: HeaderProps) {
      const router = useRouter();

      const navigateToHomeScreen = () => {
            router.back();
      };

      return (
            <div className="w-full flex justify-between items-center md:my-5 my-2 mt-2 px-3">
                  {props.closeButton ? (
                        <div className="aspect-square w-8 flex">
                              <Image
                                    src={closeButton}
                                    alt={"Close Button"}
                                    width={20}
                                    height={20}
                                    onClick={() => {
                                          navigateToHomeScreen();
                                    }}
                                    className="cursor-pointer "
                              ></Image>
                        </div>
                  ) : null}
                  <h1 className="text-black font-extrabold md:text-4xl text-2xl mt-1">{props.title}</h1>
                  {props.closeButton ? (
                        <div className="aspect-square w-8">
                              <Image src={addButton} alt={"Add Button"} width={50} height={50} onClick={() => {}} className="cursor-pointer "></Image>
                        </div>
                  ) : null}
            </div>
      );
}

type HeaderProps = {
      title: string;
      closeButton: boolean;
      addItemButton: boolean;
};
