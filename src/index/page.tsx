import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <Container
            maxWidth="lg"
            sx={{
                mt: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <Box
                sx={{
                    backgroundImage:
                        "url(https://via.placeholder.com/1500x500)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "300px",
                    borderRadius: "8px",
                }}
            />

            <Box
                sx={{
                    mt: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Welcome to Our Website
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Discover amazing content and features by exploring our
                    dashboard.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => navigate("/dashboard")}
                >
                    Go to Dashboard
                </Button>
            </Box>
        </Container>
    );
};

export default HomePage;
