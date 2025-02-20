import { Card, CardContent, Typography } from '@mui/material';
import Image from 'next/image';
import upIcon from "../../../assets/ic-solar_double-alt-arrow-up-bold-duotone.png";
import downIcon from "../../../assets/ic-solar_double-alt-arrow-down-bold-duotone.png";
import { JSX } from 'react';

// Define TypeScript types for props
interface InfoCardProps {
    title: string;
    value: number | null | undefined; // Allow for null or undefined values
    previousValue: number | null | undefined; // Allow for null or undefined values
    unit: string;
}

export const InfoCard = ({ title, value, previousValue, unit }: InfoCardProps) => {
    // Function to calculate percentage change (always positive)
    const getPercentageChange = (current: number, previous: number): string => {
        if (previous === 0) return '0%'; // Avoid division by zero
        const change = ((current - previous) / previous) * 100;
        return `${Math.abs(change).toFixed(1)}%`; // Use Math.abs to ensure positive value
    };

    // Function to determine arrow direction
    const getArrowDirection = (current: number, previous: number): JSX.Element | string => {
        if (current > previous) {
            return (
                <Image
                    src={upIcon}
                    alt="upIcon"
                    style={{ objectFit: "contain", }}
                />
            );
        } else if (current < previous) {
            return (
                <Image
                    src={downIcon}
                    alt="downIcon"
                    style={{ objectFit: "contain", }}
                />
            );
        } else {
            return ''; // No arrow if there's no change
        }
    };


    return (
        <Card>
            <CardContent>
                <Typography color="textPrimary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h5" component="div">
                    {((value || 0) / 1000).toFixed(1)} {unit}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {getArrowDirection((value || 0), (previousValue || 0))} {getPercentageChange((value || 0), (previousValue || 0))} previous month
                </Typography>
            </CardContent >
        </Card >
    );
};