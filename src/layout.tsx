import React, { useState } from "react";
import {
    AppBar,
    Button,
    createTheme,
    CssBaseline,
    IconButton,
    ThemeProvider,
    Toolbar,
    Typography,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
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
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Labwork 4
                    </Typography>
                    <Button color="inherit" onClick={() => navigate("/login")}>
                        Login
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/signup")}>
                        Signup
                    </Button>
                    <IconButton color="inherit" onClick={toggleTheme}>
                        {darkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                </Toolbar>
            </AppBar>
            {children}
        </ThemeProvider>
    );
};

export default Layout;
