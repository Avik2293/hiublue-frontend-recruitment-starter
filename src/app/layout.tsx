import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import ThemeProvider from "@/theme/index";
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <html lang="en" suppressHydrationWarning>
                <body>
                    <InitColorSchemeScript attribute="class" />
                    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                        <ThemeProvider>
                            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                            <CssBaseline />
                            {props.children}
                            <Toaster
                                position="top-center"
                                reverseOrder={false}
                            />
                        </ThemeProvider>
                    </AppRouterCacheProvider>
                </body>
            </html>
        </AuthProvider>
    );
}
