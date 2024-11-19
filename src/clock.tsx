import { Typography } from "@mui/material";
import { useState } from "react";

const Clock = () => {
    let time = new Date().toLocaleTimeString();

    const [ctime, setTime] = useState(time);
    const UpdateTime = () => {
        time = new Date().toLocaleTimeString();
        setTime(time);
    };
    setInterval(UpdateTime);
    return <Typography variant="h6">{ctime}</Typography>;
};

export default Clock;
