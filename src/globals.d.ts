export type Point = {
    x: number;
    y: number;
    r: number;
};

export type PointResult = Point & {
    result: boolean;
    userId: number;
};
