import { AlertColor, Button, Grid2 as Grid, TextField } from "@mui/material";
import { useState } from "react";
import { useUpdatePasswordMutation } from "../store";
import { isBackendError } from "../globals";

type UpdatePasswordFormProps = {
    toast: (message: string, severity?: AlertColor) => void;
};

const UpdatePasswordForm = ({ toast }: UpdatePasswordFormProps) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [updatePassword] = useUpdatePasswordMutation();

    const handleUpdate = async () => {
        if (newPassword !== confirmPassword) {
            toast("New password and confirmation do not match.");
            return;
        }

        try {
            await updatePassword({
                currentPassword,
                newPassword,
            }).unwrap();
            toast("Password updated successfully.", "success");
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
                    label="New Password"
                    type="password"
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </Grid>
            <Grid size={12}>
                <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={newPassword.length === 0}
                />
            </Grid>
            <Grid size={12}>
                <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    variant="outlined"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={newPassword.length === 0}
                />
            </Grid>
            <Grid size={12} textAlign="center">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                    disabled={
                        newPassword.length === 0 ||
                        confirmPassword.length === 0 ||
                        currentPassword.length === 0
                    }
                >
                    Save
                </Button>
            </Grid>
        </Grid>
    );
};

export default UpdatePasswordForm;
