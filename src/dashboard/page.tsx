import { Container, Typography } from "@mui/material";

const Dashboard = () => (
    <Container maxWidth="lg" sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
            Dashboard
        </Typography>
        <Typography variant="body1">
            Welcome to the dashboard! Here you can explore more features.
        </Typography>
    </Container>
);

export default Dashboard;
