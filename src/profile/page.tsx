import { useEffect, useState } from "react";
import {
    Button,
    Container,
    Grid2 as Grid,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    useDeleteUserMutation,
    useLazyGetUserInfoQuery,
    useLogoutUserMutation,
} from "../store";
import { Navigate, useNavigate } from "react-router-dom";
import AvatarForm from "./avatar-form";
import UpdateUserForm from "./update-user-form";
import UpdatePasswordForm from "./update-password-form";

const ProfilePage = () => {
    const [trigger, { error, isLoading }] = useLazyGetUserInfoQuery();
    const [logout] = useLogoutUserMutation();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("/placeholder-avatar.png");

    const [deleteUser] = useDeleteUserMutation();

    useEffect(() => {
        trigger().then(({ data }) => {
            if (data) {
                setUsername(data.username);
                setEmail(data.email);
                setAvatar(data.avatarUrl);
            }
        });
    }, [trigger]);

    const [openDialog, setOpenDialog] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleDeleteAccount = async () => {
        setOpenDialog(false);
        try {
            await deleteUser().unwrap();
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    if (error) {
        if ("status" in error && error.status === 401) {
            return <Navigate to="/login" />;
        }

        return (
            <Container
                style={{
                    width: "100%",
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4rem",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography variant="h5">Error</Typography>
                <Typography variant="body1">
                    Failed to load user info
                </Typography>
            </Container>
        );
    }

    if (isLoading) {
        return (
            <Container
                style={{
                    width: "100%",
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4rem",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography variant="h5">Loading...</Typography>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Profile Page
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid size={12} textAlign="center">
                    <AvatarForm
                        username={username}
                        avatar={avatar}
                        setAvatar={setAvatar}
                    />
                </Grid>

                <Grid size={12}>
                    <UpdateUserForm
                        username={username}
                        email={email}
                        setUsername={setUsername}
                        setEmail={setEmail}
                    />
                </Grid>

                <Grid size={12}>
                    <UpdatePasswordForm />
                </Grid>
            </Grid>

            <Container
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: "1rem",
                }}
            >
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    Delete Account
                </Button>
                <Button variant="outlined" color="error" onClick={handleLogout}>
                    Log out
                </Button>
            </Container>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="delete-account-dialog-title"
                aria-describedby="delete-account-dialog-description"
            >
                <DialogTitle id="delete-account-dialog-title">
                    Delete Account
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-account-dialog-description">
                        Are you sure you want to delete your account? This
                        action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenDialog(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteAccount}
                        color="error"
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProfilePage;
