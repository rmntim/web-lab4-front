import { Container, Typography, Avatar, Skeleton } from "@mui/material";
import { useLazyGetUserInfoByIdQuery } from "../store";
import { useEffect } from "react";
import { colorFromUserId } from "../globals";

type UserTooltipProps = {
    userId: number;
};

const UserTooltip = ({ userId }: UserTooltipProps) => {
    const [trigger, { data, isLoading, isError, error }] =
        useLazyGetUserInfoByIdQuery();

    useEffect(() => {
        trigger(userId).unwrap();
    }, [trigger, userId]);

    const color = colorFromUserId(userId);

    if (isLoading) {
        return (
            <Container
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="circular" width={40} height={40} />
            </Container>
        );
    }

    if (isError) {
        if ("message" in error) {
            return (
                <Typography variant="body2" color="error">
                    Failed to load user info:
                    {error?.message || "Unknown error"}
                </Typography>
            );
        }

        return (
            <Typography variant="body2" color="error">
                Failed to load user info: Unknown error
            </Typography>
        );
    }

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
                padding: 2,
                borderRadius: 1,
                border: `1px solid ${color}`,
            }}
        >
            <Avatar
                alt={data?.username ?? "avatar"}
                src={data?.avatarUrl ?? "/placeholder-avatar.png"}
                sx={{ width: 64, height: 64 }}
            />
            <Container
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {data?.username && (
                    <Typography variant="h6">{data.username}</Typography>
                )}
                {data?.email && (
                    <Typography variant="body1">{data.email}</Typography>
                )}
            </Container>
        </Container>
    );
};

export default UserTooltip;
