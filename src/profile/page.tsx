import { useEffect, useState } from "react";
import {
    Avatar,
    Button,
    Container,
    Grid2 as Grid,
    IconButton,
    TextField,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    useDeleteUserMutation,
    useLazyGetUserInfoQuery,
    useLogoutUserMutation,
    useUpdateUserInfoMutation,
} from "../store";
import { Navigate, useNavigate } from "react-router-dom";

const MAX_FILE_SIZE = 2 << 20;

const ProfilePage = () => {
    const [trigger, { error, isLoading }] = useLazyGetUserInfoQuery();
    const [logout] = useLogoutUserMutation();
    const navigate = useNavigate();
    const [username, setUsername] = useState("John Doe");
    const [email, setEmail] = useState("john.doe@example.com");

    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserInfoMutation();

    useEffect(() => {
        trigger().then(({ data }) => {
            if (data) {
                setUsername(data.username);
                setEmail(data.email);
            }
        });
    }, [trigger]);

    const [avatar, setAvatar] = useState("/placeholder-avatar.png");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleUpdateAvatar = () => {
        if (avatarFile) {
            // Implement file upload logic here (API call)
            alert("Avatar updated successfully!");
            setAvatarFile(null);
        } else {
            alert("No avatar selected.");
        }
    };

    const handleUpdate = async () => {
        try {
            await updateUser({
                username,
                email,
            }).unwrap();
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                alert(
                    `File size exceeds ${MAX_FILE_SIZE >> 20} MiB. Please choose a smaller file.`
                );
                return;
            }

            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setAvatar(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
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
                {/* Avatar Section */}
                <Grid size={12} textAlign="center">
                    <Avatar
                        alt={username}
                        src={avatar}
                        sx={{ width: 100, height: 100, margin: "0 auto" }}
                    />
                    <IconButton
                        aria-label="upload avatar"
                        color="primary"
                        component="label"
                    >
                        <PhotoCamera />
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleAvatarChange}
                        />
                    </IconButton>
                    <IconButton
                        aria-label="save avatar"
                        color="primary"
                        onClick={handleUpdateAvatar}
                        disabled={!avatarFile} // Disable button if no file is selected
                    >
                        <SaveIcon />
                    </IconButton>
                </Grid>

                {/* Username and Email Section */}
                <Grid size={12}>
                    <TextField
                        fullWidth
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Grid>
                <Grid size={12}>
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Grid>

                <Grid size={12}>
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
                            variant="contained"
                            color="primary"
                            onClick={handleUpdate}
                        >
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => setOpenDialog(true)}
                        >
                            Delete Account
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleLogout}
                        >
                            Log out
                        </Button>
                    </Container>
                </Grid>
            </Grid>

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
