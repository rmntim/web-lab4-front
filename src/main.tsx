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
import Signup from "./signup/page.tsx";
import store from "./store.tsx";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </Layout>
            </Router>
        </Provider>
    </StrictMode>
);
