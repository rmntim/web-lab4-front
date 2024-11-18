import {
    Alert,
    Box,
    Button,
    Container,
    Grid2 as Grid,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { setToken, useLoginUserMutation } from "../store";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loginUser] = useLoginUserMutation();

    const handleLogin = async (email: string, password: string) => {
        try {
            const { token } = await loginUser({ email, password }).unwrap();
            dispatch(setToken(token));
            navigate("/dashboard");
        } catch (err) {
            console.error("Failed to login", err);
            setError("Login failed. Please try again.");
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        await handleLogin(email, password);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    Login
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    sx={{ mt: 2 }}
                    onSubmit={handleSubmit}
                >
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                variant="outlined"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Password"
                                variant="outlined"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
