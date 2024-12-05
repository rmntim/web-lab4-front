import { useState } from "react";
import {
    AppBar,
    createTheme,
    CssBaseline,
    IconButton,
    ThemeProvider,
    Toolbar,
    Typography,
} from "@mui/material";
import { AccountCircle, Brightness4, Brightness7 } from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";
import Clock from "./clock";

const Layout = () => {
    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(true);

    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
        },
    });

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar
                    style={{
                        justifyContent: "space-between",
                        position: "relative",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate("/", { replace: true })}
                    >
                        Labwork 4
                    </Typography>

                    <Clock />

                    <div>
                        <IconButton color="inherit" onClick={toggleTheme}>
                            {darkMode ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                        <IconButton
                            color="inherit"
                            onClick={() => navigate("/profile")}
                        >
                            <AccountCircle />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            <Outlet />
        </ThemeProvider>
    );
};

export default Layout;
