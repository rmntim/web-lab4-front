import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ScopedCssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./index/page.tsx";
import { ThemeProvider } from "@mui/material";
import theme from "./theme.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Index />,
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <ScopedCssBaseline enableColorScheme>
                <RouterProvider router={router} />
            </ScopedCssBaseline>
        </ThemeProvider>
    </StrictMode>
);
