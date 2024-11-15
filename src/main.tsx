import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layout.tsx";
import HomePage from "./index/page.tsx";
import Dashboard from "./dashboard/page.tsx";
import Login from "./login/page.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<div>Signup</div>} />
                </Routes>
            </Layout>
        </Router>
    </StrictMode>
);
