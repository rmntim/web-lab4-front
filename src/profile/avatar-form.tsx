import { PhotoCamera, Save as SaveIcon } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import { toast } from "mui-sonner";
import { useState } from "react";
import { useUpdateAvatarMutation } from "../store";
import { isBackendError } from "../globals";

const MAX_FILE_SIZE = 2 << 20;

type AvatarFormProps = {
    username: string;
    avatar: string;
    setAvatar: (avatar: string) => void;
};

const AvatarForm = ({ username, avatar, setAvatar }: AvatarFormProps) => {
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [updateAvatar] = useUpdateAvatarMutation();

    const handleUpdateAvatar = async () => {
        if (!avatarFile) {
            toast.error("No avatar selected.");
            return;
        }

        const formData = new FormData();
        formData.append("file", avatarFile);

        try {
            const userInfo = await updateAvatar(formData).unwrap();
            setAvatar(userInfo.avatarUrl);
            toast.success("Avatar updated successfully!");
        } catch (err) {
            console.error(err);
            if (isBackendError(err)) {
                toast.error(
                    "An error occurred while uploading." + err.data.message
                );
            }
        } finally {
            setAvatarFile(null);
        }
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                toast.error(
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

    return (
        <>
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
                    accept="image/png"
                    hidden
                    onChange={handleAvatarChange}
                />
            </IconButton>
            <IconButton
                aria-label="save avatar"
                color="primary"
                onClick={handleUpdateAvatar}
                disabled={!avatarFile}
            >
                <SaveIcon />
            </IconButton>
        </>
    );
};

export default AvatarForm;
