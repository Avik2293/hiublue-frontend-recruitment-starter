"use client";

import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, useMediaQuery } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import dashboardIcon from "../assets/dashboardIcon.png";
import onboardingIcon from "../assets/onboardingIcon.png";

// type
interface SidebarProps {
    isSmallScreen: boolean;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

const drawerWidth = 240;

const Sidebar: React.FC<SidebarProps> = ({ isSmallScreen, sidebarOpen, setSidebarOpen }) => {
    return (
        <Drawer
            variant={isSmallScreen ? "temporary" : "permanent"}
            open={isSmallScreen ? sidebarOpen : true}
            onClose={() => setSidebarOpen(false)}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
            }}
        >
            <Toolbar /> {/* Adds spacing below the TopNav */}

            <Typography variant="overline" gutterBottom sx={{ color: "gray", ml: "1.2rem" }}>Overview</Typography>

            {/* links  */}
            <List>
                <Link href={'dashboard'} passHref legacyBehavior>
                    <ListItem component="a" sx={{ textDecoration: "none" }}>
                        <ListItemIcon>
                            <Image
                                src={dashboardIcon}
                                alt="dashboardIcon"
                                width={24}
                                height={24}
                                style={{ objectFit: "contain" }}
                            />
                        </ListItemIcon>
                        <ListItemText primary={"Dashboard"} sx={{ color: "gray" }} />
                    </ListItem>
                </Link>

                <Link href={'onboarding'} passHref legacyBehavior>
                    <ListItem component="a" sx={{ textDecoration: "none" }}>
                        <ListItemIcon>
                            <Image
                                src={onboardingIcon}
                                alt="onboardingIcon"
                                width={24}
                                height={24}
                                style={{ objectFit: "contain" }}
                            />
                        </ListItemIcon>
                        <ListItemText primary={"Onboarding"} sx={{ color: "gray" }} />
                    </ListItem>
                </Link>
            </List>
        </Drawer>
    );
};

export default Sidebar;