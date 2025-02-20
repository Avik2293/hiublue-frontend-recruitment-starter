"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, Typography } from "@mui/material";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ChartType = "bar" | "line";

type ChartProps = {
    title: string;
    type: ChartType;
    categories: string[];
    series: {
        name: string;
        data: number[];
    }[];
};

const ApexChart: React.FC<ChartProps> = ({ title, type, categories, series }) => {
    const options: ApexOptions = {
        chart: {
            type,
            toolbar: { show: false },
        },
        xaxis: {
            categories,
        },
        stroke: {
            curve: type === "line" ? "smooth" : undefined,
        },
        dataLabels: {
            enabled: false,
            //     enabled: type === "bar",
            //     style: {
            //         fontSize: "12px",
            //         fontWeight: "bold",
            //         colors: ["#000"],
            //     },
            //     offsetY: -20,
            //     formatter: (val, opts) => {
            //         return opts.seriesIndex === 0 ? "Desktop" : "Mobile";
            //     },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            offsetX: 40,
            markers: {
                // size: 7,
                shape: undefined,
                // strokeWidth: 1,
                // fillColors: undefined,
                // customHTML: undefined,
                // onClick: undefined,
                // offsetX: 0,
                // offsetY: 0
            },
        },
        // plotOptions: {
        //     bar: {
        //         dataLabels: {
        //             position: "top", // Moves text to upper side
        //         },
        //         columnWidth: "50%", // Adjusts width for better alignment
        //     },
        // },
        colors: [type === "line" ? "#1C252E" : "#007867", "#FFAB00"],
        responsive: [
            {
                breakpoint: 768,
                options: {
                    chart: {
                        width: "100%",
                    },
                },
            },
        ],
    };

    return (
        <Card sx={{ p: 2, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                <Chart options={options} series={series} type={type} height={300} />
            </CardContent>
        </Card>
    );
};

export default ApexChart;
