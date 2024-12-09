import { Grid2 as Grid, TextField, Button } from "@mui/material";
import { useUpdateUserInfoMutation } from "../store";

type UpdateUserFormProps = {
    username: string;
    email: string;
    setUsername: (username: string) => void;
    setEmail: (email: string) => void;
};

const UpdateUserForm = ({
    username,
    email,
    setUsername,
    setEmail,
}: UpdateUserFormProps) => {
    const [updateUser] = useUpdateUserInfoMutation();

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
