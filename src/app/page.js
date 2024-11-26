'use client';

import Image from "next/image";

import { useEffect , useState } from "react";
import { GetHelloInfo } from "@/services/root";

export default function Home() {

  const [helloInfo, setHelloInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await GetHelloInfo();
      setHelloInfo(data.data);
    }
    fetchData();
  }, []);

  // console.log(helloInfo);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          { helloInfo.map((item, index ) => (
            <li key={item.id}>{item.saludo}</li>
          )) 
          }
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
