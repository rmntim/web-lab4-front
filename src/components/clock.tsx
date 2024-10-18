"use client";

import { useEffect, useState } from "react";

export default function Clock() {
    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
        setTime(new Date().toLocaleTimeString());
        const timerId = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center">
            <p className="text-white">
                Current Time: {time ?? "Loading..."}
            </p>
        </div>
    );
}
