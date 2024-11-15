import { Container, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store";

const Dashboard = () => {
    const isAuthenticated = useSelector(
        (state: RootState) => state.jwt.token !== null
    );

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Typography variant="body1">
                Welcome to the dashboard! Here you can explore more features.
            </Typography>
        </Container>
    );
};

export default Dashboard;
