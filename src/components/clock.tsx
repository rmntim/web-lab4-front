"use client";

import { useEffect, useState } from "react";

export default function Clock() {
    const [time, setTime] = useState<Date>(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center">
            <p className="text-white">
                Current Time: {time.toLocaleTimeString()}
            </p>
        </div>
    );
}
