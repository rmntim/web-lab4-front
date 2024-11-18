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
} from "@mui/material";
import { useSelector } from "react-redux";
import {
    RootState,
    useAddUserPointMutation,
    useDeleteAllUserPointsMutation,
} from "../store";
import { Navigate } from "react-router-dom";
import { PointResult } from "../globals";
import { apiClient } from "../client";
import Canvas from "./canvas";

const Page = () => {
    const isAuthenticated = useSelector(
        (state: RootState) => state.jwt.token !== null
    );

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    } else {
        return <Dashboard />;
    }
};

const Dashboard = () => {
    const [points, setPoints] = useState<PointResult[]>([]);
    const token = useSelector((state: RootState) => state.jwt.token);

    useEffect(() => {
        apiClient
            .get<PointResult[]>(`/api/user/points`)
            .then((response) => {
                setPoints(response.data);
            })
            .catch((err) => {
                console.error("Failed to load points", err);
            });
    }, [token]);

    const [x, setX] = useState("");
    const [y, setY] = useState("");
    const [r, setR] = useState("3");
    const [error, setError] = useState<{ x: string; y: string; r: string }>({
        x: "",
        y: "",
        r: "",
    });
    const [addUserPoint] = useAddUserPointMutation();
    const [deleteAllUserPoints] = useDeleteAllUserPointsMutation();

    const [deleteAllOpen, setDeleteAllOpen] = useState(false);

    const handleDeleteAllClose = () => {
        setDeleteAllOpen(false);
    };

    const validateInput = () => {
        setError({ x: "", y: "", r: "" });

        const numX = parseFloat(x);
        const numY = parseFloat(y);
        const numR = parseFloat(r);

        if (isNaN(numX) || numX < -3 || numX > 3) {
            setError((err) => ({ ...err, x: "X must be between -3 and 3" }));
        }
        if (isNaN(numY) || numY < -3 || numY > 3) {
            setError((err) => ({ ...err, y: "Y must be between -3 and 3" }));
        }
        if (isNaN(numR) || numR < 0 || numR > 3) {
            setError((err) => ({ ...err, r: "R must be between 0 and 3" }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        validateInput();
        if (error.x || error.y || error.r) {
            return;
        }

        try {
            const point = await addUserPoint({
                x: parseFloat(x),
                y: parseFloat(y),
                r: parseFloat(r),
            }).unwrap();
            setPoints((prev) => [...prev, point]);
        } catch (err) {
            console.error("Failed to add point", err);
        }
    };

    const handleDeleteAll = async () => {
        try {
            await deleteAllUserPoints().unwrap();
            setPoints([]);
            setDeleteAllOpen(false);
        } catch (err) {
            console.error("Failed to delete all points", err);
        }
    };

    const checkPoint = (x: number, y: number) => {
        let result = false;
        try {
            addUserPoint({
                x,
                y,
                r: parseFloat(r),
            })
                .unwrap()
                .then((point) =>
                    setPoints((prev) => {
                        result = point.result;
                        return [...prev, point];
                    })
                );
        } catch (err) {
            console.error("Failed to add point", err);
        }
        return result;
    };

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
                <Canvas
                    radius={Math.min(Math.max(Number(r), 0), 3)}
                    points={points}
                    check={checkPoint}
                />
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
                        value={x}
                        onChange={(e) => setX(e.target.value)}
                        error={!!error.x}
                        helperText={error.x}
                    />
                    <TextField
                        label="Y"
                        value={y}
                        onChange={(e) => setY(e.target.value)}
                        error={!!error.y}
                        helperText={error.y}
                    />
                    <TextField
                        label="R"
                        value={r}
                        onChange={(e) => setR(e.target.value)}
                        error={!!error.r}
                        helperText={error.r}
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Page;
