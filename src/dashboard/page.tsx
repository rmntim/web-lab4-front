import { FormEvent, useEffect, useState } from "react";
import {
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    IconButton,
    Snackbar,
    Alert,
    Typography,
} from "@mui/material";
import {
    RootState,
    useAddUserPointMutation,
    useDeleteAllUserPointsMutation,
    useDeleteUserPointMutation,
    useLazyGetUserPointsQuery,
} from "../store";
import { Navigate } from "react-router-dom";
import { PointResult } from "../globals";
import Canvas from "./canvas";
import { DeleteOutline } from "@mui/icons-material";
import { useSelector } from "react-redux";

const Page = () => {
    const [trigger, { error }] = useLazyGetUserPointsQuery();

    const userId = useSelector((state: RootState) => state.user.id);

    const [points, setPoints] = useState<PointResult[]>([]);

    useEffect(() => {
        trigger()
            .unwrap()
            .then((data) => setPoints(data));
    }, [trigger]);

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [r, setR] = useState(3);
    const [addUserPoint] = useAddUserPointMutation();
    const [deleteAllUserPoints] = useDeleteAllUserPointsMutation();
    const [deleteUserPoint] = useDeleteUserPointMutation();

    const [deleteAllOpen, setDeleteAllOpen] = useState(false);

    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const handleToastClose = () => {
        setToastOpen(false);
        setToastMessage("");
    };

    const toast = (message: string) => {
        setToastOpen(true);
        setToastMessage(message);
    };

    const handleDeleteAllClose = () => {
        setDeleteAllOpen(false);
    };

    const sendPoint = async (x: number, y: number, r: number) => {
        try {
            const point = await addUserPoint({
                x,
                y,
                r,
            }).unwrap();
            console.log(point);
            setPoints((prev) => [...prev, point]);
        } catch (err) {
            toast("Failed to add point");
            console.error("Failed to add point", err);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await sendPoint(x, y, r);
    };

    const handleDeleteAll = async () => {
        try {
            await deleteAllUserPoints().unwrap();
            setPoints((points) =>
                [...points].filter((p) => p.userId !== userId)
            );
            setDeleteAllOpen(false);
        } catch (err) {
            toast("Failed to delete all points");
            console.error("Failed to delete all points", err);
        }
    };

    const handleDeletePoint = async (point: PointResult, index: number) => {
        try {
            await deleteUserPoint(point).unwrap();
            setPoints((prev) => prev.filter((_, i) => i !== index));
        } catch (err) {
            toast("Failed to delete point");
            console.error("Failed to delete point", err);
        }
    };

    const checkPoint = async (x: number, y: number) => {
        await sendPoint(x, y, r);
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
                <Typography variant="h5" gutterBottom>
                    Error
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Failed to load points
                </Typography>
            </Container>
        );
    }

    return (
        <Container
            style={{
                width: "100%",
                padding: "2rem",
                display: "flex",
                flexDirection: "row",
                gap: "4rem",
                justifyContent: "center",
                alignItems: "start",
            }}
        >
            <div>
                <Canvas radius={r} points={points} check={checkPoint} />
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                    }}
                >
                    <TextField
                        label="X"
                        type="number"
                        value={x}
                        onChange={(e) => setX(Number(e.target.value))}
                        slotProps={{
                            htmlInput: { min: -3, max: 3, step: "any" },
                        }}
                    />
                    <TextField
                        label="Y"
                        type="number"
                        value={y}
                        onChange={(e) => setY(Number(e.target.value))}
                        slotProps={{
                            htmlInput: { min: -3, max: 3, step: "any" },
                        }}
                    />
                    <TextField
                        label="R"
                        type="number"
                        value={r}
                        onChange={(e) => setR(Number(e.target.value))}
                        slotProps={{
                            htmlInput: { min: 0, max: 3, step: "any" },
                        }}
                    />
                    <Button variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        type="button"
                        onClick={() => setDeleteAllOpen(true)}
                    >
                        Delete All
                    </Button>
                    <Dialog
                        open={deleteAllOpen}
                        onClose={handleDeleteAllClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            Delete all points?
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete all points?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDeleteAllClose} autoFocus>
                                No
                            </Button>
                            <Button onClick={handleDeleteAll} color="error">
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </form>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>X</TableCell>
                            <TableCell>Y</TableCell>
                            <TableCell>R</TableCell>
                            <TableCell>Result</TableCell>
                            <TableCell>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {points.map((point, index) => (
                            <TableRow key={index}>
                                <TableCell>{point.x}</TableCell>
                                <TableCell>{point.y}</TableCell>
                                <TableCell>{point.r}</TableCell>
                                <TableCell>
                                    {point.result ? "True" : "False"}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        type="button"
                                        color="error"
                                        onClick={() =>
                                            handleDeletePoint(point, index)
                                        }
                                        disabled={point.userId !== userId}
                                    >
                                        <DeleteOutline />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar
                open={toastOpen}
                autoHideDuration={6000}
                onClose={handleToastClose}
            >
                <Alert severity="error">{toastMessage}</Alert>
            </Snackbar>
        </Container>
    );
};

export default Page;
