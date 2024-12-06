import React, {ReactNode} from "react";
import {useSnapshot} from "valtio/react";
import {state} from "@/store";
import Loader from "@/components/style/Loader/Loader";

export default function Layout({ children }: { children: ReactNode }) {
    const currentState = useSnapshot(state)
    return <div className="bg-light-background dark:bg-dark-background
                text-light-text dark:text-dark-text h-dvh">
        <Loader color="orange" isLoading={currentState.isLoading} />
        {children}
    </div>
}