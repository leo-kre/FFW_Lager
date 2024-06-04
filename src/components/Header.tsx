import Image from "next/image";
const closeButton = "../../public/cross.svg";

export default function Header(props: HeaderProps) {
      return (
            <div className="w-full flex justify-between items-center my-5 mt-2 px-5">
                  {props.closeButton ? <Image src={closeButton} alt={"Close Button"} width={50} height={50}></Image> : null}
                  <h1 className="text-black font-extrabold text-4xl">{props.title}</h1>
                  {props.closeButton ? <div className="w-5 h-5 bg-black"></div> : null}
            </div>
      );
}

type HeaderProps = {
      title: string;
      closeButton: boolean;
      addItemButton: boolean;
};
