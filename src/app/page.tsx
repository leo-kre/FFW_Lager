import Header from "../components/Header";
import Image from "next/image";

const QR_CODE = "/qr-code.svg";
const PASSWORD = "/password.svg";

export default function Home() {
      return (
            <main className="flex min-h-screen w-full flex-col items-center">
                  <Header title="FFW-KLU Lager" closeButton={true} addItemButton={true}></Header>
                  <div className="p-1 pl-2 flex items-center w-2/3 bg-slate-300 rounded-default">
                        <h1 className="text-black">Suchen</h1>
                  </div>

                  <div className="w-4/5 max-w-[80%] flex flex-col justify-center items-center gap-4 mt-5">
                        <a className="bg-accent-red w-fit rounded-xl flex justify-center items-center" href="./qr_code">
                              <div className="w-fit h-fit flex justify-center items-center p-4">
                                    <Image src={QR_CODE} alt="QR Code" width={175} height={175} />
                              </div>
                        </a>

                        <a className="bg-accent-blue w-fit rounded-xl flex justify-center items-center" href="./id">
                              <div className="w-fit h-fit flex justify-center items-center p-4">
                                    <Image src={PASSWORD} alt="PASSWORD" width={175} height={175} />
                              </div>
                        </a>
                  </div>
            </main>
      );
}
