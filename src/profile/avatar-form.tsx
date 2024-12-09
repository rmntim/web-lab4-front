import { PhotoCamera, Save as SaveIcon } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import { toast } from "mui-sonner";
import { useState } from "react";

const MAX_FILE_SIZE = 2 << 20;

type AvatarFormProps = {
    username: string;
};

const AvatarForm = ({ username }: AvatarFormProps) => {
    const [avatar, setAvatar] = useState("/placeholder-avatar.png");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const handleUpdateAvatar = () => {
        if (avatarFile) {
            toast.success("Avatar updated successfully!");
            setAvatarFile(null);
        } else {
            toast.error("No avatar selected.");
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
                    accept="image/*"
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
