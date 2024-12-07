import { MouseEvent, useCallback, useEffect, useRef } from "react";
import { useTheme } from "@mui/material";
import { hashUserIdForColor, PointResult } from "../globals";

type CanvasProps = {
    radius: number;
    width?: number;
    height?: number;
    points: PointResult[];
    check: (x: number, y: number) => Promise<void>;
};

const Canvas = ({
    radius: r,
    width = 300,
    height = 300,
    points,
    check,
}: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const theme = useTheme();
    const MULTIPLIER = width / 7.5;
    const sign = r >= 0 ? 1 : -1;
    const radius = Math.abs(r);

    const colorFromUserId = (result: boolean, userId: number) => {
        const colorCode = hashUserIdForColor(userId);

        const red = Math.floor(Math.floor(colorCode / 256) / 256) % 256;
        const green = Math.floor(Math.floor(colorCode / 256) % 256);
        const blue = Math.floor(colorCode % 256);

        console.log(red, green, blue);

        return `rgba(${red}, ${green}, ${blue}, ${result ? 1 : 0.33})`;
    };

    const addPoint = useCallback(
        (
            canvas: HTMLCanvasElement,
            ctx: CanvasRenderingContext2D,
            point: PointResult
        ) => {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const { x, y, result, id: userId } = point;

            const actualX = x * MULTIPLIER + centerX;
            const actualY = centerY - y * MULTIPLIER;

            ctx.beginPath();
            ctx.arc(actualX, actualY, 3, 0, 2 * Math.PI, true);
            ctx.closePath();
            ctx.fillStyle = colorFromUserId(result, userId);
            ctx.fill();
        },
        [MULTIPLIER]
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext("2d")!;

        canvas.width = width;
        canvas.height = height;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw quarter-circle (top-right quadrant)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * MULTIPLIER, 0, -Math.PI / 2, true);
        ctx.lineTo(centerX, centerY);
        ctx.closePath();
        ctx.fillStyle = theme.palette.primary.main;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + radius * MULTIPLIER, centerY);
        ctx.lineTo(centerX, centerY + (radius / 2) * MULTIPLIER);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = theme.palette.primary.main;
        ctx.closePath();
        ctx.fill();

        // Draw rectangle (bottom-left quadrant)
        ctx.beginPath();
        ctx.rect(
            centerX - radius * MULTIPLIER,
            centerY,
            radius * MULTIPLIER,
            radius * MULTIPLIER
        );
        ctx.closePath();
        ctx.fillStyle = theme.palette.primary.main;
        ctx.fill();

        // Draw axes
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, canvas.height);
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.strokeStyle = theme.palette.text.primary;
        ctx.lineWidth = 1;
        ctx.stroke();

        points.forEach((point) => {
            addPoint(canvas, ctx, point);
        });
    }, [radius, width, height, theme, MULTIPLIER, sign, points, addPoint]);

    const handleCanvasClick = async (event: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const dx = (x - centerX) / MULTIPLIER;
        const dy = (centerY - y) / MULTIPLIER;
        await check(dx, dy);
    };

    return (
        <canvas
            ref={canvasRef}
            style={{ border: "1px solid" }}
            onClick={handleCanvasClick}
        ></canvas>
    );
};

export default Canvas;
