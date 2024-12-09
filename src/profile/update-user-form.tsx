import { Grid2 as Grid, TextField, Button, AlertColor } from "@mui/material";
import { useUpdateUserInfoMutation } from "../store";
import { isBackendError } from "../globals";

type UpdateUserFormProps = {
    username: string;
    email: string;
    setUsername: (username: string) => void;
    setEmail: (email: string) => void;
    toast: (message: string, severity?: AlertColor) => void;
};

const UpdateUserForm = ({
    username,
    email,
    setUsername,
    setEmail,
    toast,
}: UpdateUserFormProps) => {
    const [updateUser] = useUpdateUserInfoMutation();

    const handleUpdate = async () => {
        try {
            await updateUser({
                username,
                email,
            }).unwrap();
            toast("Profile updated successfully.", "success");
        } catch (error) {
            console.error(error);
            if (isBackendError(error)) {
                toast(error.data.message);
            }
        }
    };

    return (
        <Grid container spacing={2} alignItems="center">
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
            <Grid size={12} textAlign="center">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                >
                    Save
                </Button>
            </Grid>
        </Grid>
    );
};

export default UpdateUserForm;
