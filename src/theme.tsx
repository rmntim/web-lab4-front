import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
    cssVariables: true,
    palette: {
        mode: "dark",
        background: {
            default: "#1E1E1E",
        },
    },
});

export default theme;
