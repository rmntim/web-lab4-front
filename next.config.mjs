/** @type {import("next").NextConfig} */
const nextConfig = {
    // output: "export",
    reactStrictMode: true,
    // basePath: "/web-lab4-front",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i1.sndcdn.com",
                port: "",
            },
        ],
    },
};

export default nextConfig;
