import React from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useRouter } from 'next/navigation'


export default function Home()   {
    const router = useRouter();
    return (
        <div className=" flex flex-col justify-center items-center h-full">
            <h1 className="text-center my-5">Welcome to Ranker Poll</h1>
            <div className="mb-12 flex flex-col justify-center">
                <button
                    className="box btn-orange dark:text-white  my-2"
                    onClick={() => router.push("/create")}
                >
                    Create New Poll
                </button>
                <button
                    className="box btn-purple dark:text-white my-2"
                    onClick={() => router.push("/join")}
                >
                    Join Existing Poll
                </button>
                <div className="flex gap-1 mx-auto mt-5 text-xl">
                    Theme: <ThemeToggle/>
                </div>
            </div>
        </div>
    );
};

