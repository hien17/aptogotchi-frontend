import Header from "@/components/Header";
import { Body } from "./home/Body";

export default function Home() {
  return (
    <div className="flex sm:justify-center sm:items-center sm:h-screen sm:overflow-hidden">
      <div className="w-screen sm:w-[1200px] sm:h-[800px] sm:m-auto border-4 border-black border-solid">
        <Header />
        <Body />
      </div>
    </div>
  );
}
