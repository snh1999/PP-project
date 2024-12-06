import React, {ReactNode} from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Layout({ children }: { children: ReactNode }) {
    return <div className="bg-light-background dark:bg-dark-background
                text-light-text dark:text-dark-text h-dvh">
        {children}
    </div>
}