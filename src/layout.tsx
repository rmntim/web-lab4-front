import { useState } from "react";
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
import { Outlet, useNavigate } from "react-router-dom";
import { clearToken, RootState, useLogoutUserMutation } from "./store";
import { useDispatch, useSelector } from "react-redux";

const Layout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated =
        useSelector((state: RootState) => state.jwt.token) !== null;
    const [logoutUser] = useLogoutUserMutation();

    const [darkMode, setDarkMode] = useState(true);

    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
        },
    });

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
        } catch (err) {
            console.error(err);
        } finally {
            dispatch(clearToken());
            navigate("/");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1, cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        Labwork 4
                    </Typography>

                    {isAuthenticated ? (
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    ) : (
                        <>
                            <Button
                                color="inherit"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </Button>
                            <Button
                                color="inherit"
                                onClick={() => navigate("/signup")}
                            >
                                Signup
                            </Button>
                        </>
                    )}
                    <IconButton color="inherit" onClick={toggleTheme}>
                        {darkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Outlet />
        </ThemeProvider>
    );
};

export default Layout;
