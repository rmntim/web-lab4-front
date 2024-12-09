export type Point = {
    x: number;
    y: number;
    r: number;
};

export type PointResult = Point & {
    result: boolean;
    userId: UserInfo["id"];
};

export type UserInfo = {
    id: number;
    username: string;
    email: string;
    avatarUrl: string;
};

type BackendError = {
    data: {
        message: string;
    };
};

export const isBackendError = (error: unknown): error is BackendError => {
    if (
        error &&
        typeof error === "object" &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data &&
        "message" in error.data &&
        error.data.message &&
        typeof error.data.message === "string"
    )
        return true;
    return false;
};

export const hashUserIdForColor = (userId: number) => {
    const prime1 = 73856093;
    const prime2 = 19349663;
    const prime3 = 83492791;

    let hash = userId * prime1;
    hash ^= hash << 13;
    hash ^= hash >> 17;
    hash += prime2;
    hash ^= hash << 5;
    hash ^= prime3;

    return hash >>> 0;
};
