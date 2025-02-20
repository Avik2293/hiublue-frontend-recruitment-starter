"use client";

import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, useMediaQuery } from "@mui/material";
import Image from "next/image";
import logo from "../assets/logo.png";
import profile from "../assets/profile.jpeg";
import MenuIcon from "@mui/icons-material/Menu";

// type
interface TopNavProps {
    isSmallScreen: boolean;
    setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

const TopNav: React.FC<TopNavProps> = ({ isSmallScreen, setSidebarOpen }) => {
    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: "transparent",
                boxShadow: "none",
            }}
        >
            <Toolbar>
                {/* Menu Button for Small Screens */}
                {isSmallScreen && (
                    <IconButton
                        edge="start"
                        // color="inherit"
                        aria-label="menu"
                        onClick={() => setSidebarOpen((prev) => !prev)}
                        sx={{
                            mr: 2,
                            color: "black", // Set color using the `sx` prop
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                {/* Logo on the left */}
                <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                    <Image
                        src={logo}
                        alt="Logo"
                        width={isSmallScreen ? 30 : 40}
                        height={isSmallScreen ? 30 : 40}
                        style={{ objectFit: "contain" }}
                    />
                </Box>

                {/* Profile image on the right */}
                <IconButton sx={{ p: 0, border: 2, borderColor: "#00A76F" }}>
                    <Avatar
                        alt="Profile"
                        src={profile.src}
                        sx={{ width: isSmallScreen ? 30 : 35, height: isSmallScreen ? 30 : 35, m: "0.1rem" }}
                    />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default TopNav;