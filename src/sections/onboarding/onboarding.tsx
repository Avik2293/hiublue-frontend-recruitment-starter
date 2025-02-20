"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import OnboardingView from "@/sections/onboarding/views/onboarding-view";
import { Box, Toolbar, useMediaQuery } from "@mui/material";
import { useState } from "react";

export default function OnboardingClient() {
    const isSmallScreen = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // for authenticated users
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) return null;

    return (
        // dashboard layout
        <Box sx={{ display: "flex" }}>
            <Sidebar isSmallScreen={isSmallScreen} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <TopNav isSmallScreen={isSmallScreen} setSidebarOpen={setSidebarOpen} />
                <Toolbar /> {/* Adds spacing below the TopNav */}
                <OnboardingView />
            </Box>
        </Box>
    );
}