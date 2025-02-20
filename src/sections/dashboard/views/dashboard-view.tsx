'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Box, FormControl, Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { InfoCard } from './infoCard';
import OfferListTable from './table';
import ApexChart from './webcharts';
import { useAuth } from '@/context/AuthContext';

interface DashboardData {
  current: {
    active_users: number;
    clicks: number;
    appearances: number;
  };
  previous: {
    active_users: number;
    clicks: number;
    appearances: number;
  };
}

interface ChartData {
  website_visits: {
    [day: string]: {
      desktop: number;
      mobile: number;
    };
  };
  offers_sent: {
    [day: string]: number;
  };
}

// Function to map full day names to abbreviated forms
const mapDayToAbbreviation = (day: string): string => {
  const dayMap: { [key: string]: string } = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
  };
  return dayMap[day.toLowerCase()] || day; // Fallback to the original day name if not found
};

export default function DashboardView() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('this-week');

  const { token } = useAuth();

  // fo week change
  const handleChange = (event: SelectChangeEvent<string>) => {
    setSearchQuery(event.target.value as string);
  };

  // data get as week
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard summary data
        const summaryResponse = await axios.get<DashboardData>(
          `https://dummy-1.hiublue.com/api/dashboard/summary?filter=${searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDashboardData(summaryResponse.data);

        // Fetch chart data
        const chartResponse = await axios.get<ChartData>(
          `https://dummy-1.hiublue.com/api/dashboard/stat?filter=${searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChartData(chartResponse.data);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

  // if (!dashboardData) return <div>Loading...</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!dashboardData) return <div>No data available</div>;

  // Transform website visits data for the chart
  const websiteVisitsData = chartData ? {
    categories: Object.keys(chartData.website_visits).map(mapDayToAbbreviation),
    desktop: Object.values(chartData.website_visits).map((day) => day.desktop),
    mobile: Object.values(chartData.website_visits).map((day) => day.mobile),
  } : {
    categories: [],
    desktop: [],
    mobile: [],
  };

  // Transform offers sent data for the chart
  const offersSentData = chartData ? {
    categories: Object.keys(chartData.offers_sent).map(mapDayToAbbreviation),
    offers: Object.values(chartData.offers_sent),
  } : {
    categories: [],
    offers: [],
  };

  return (
    <Box>
      {/*  Dashboard header with searchQuery select */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography component="h4" sx={{ fontSize: "20px", fontWeight: "700" }} >Dashboard</Typography>

        <FormControl sx={{ minWidth: 120, marginBottom: "1rem" }}>
          {/* <InputLabel >searchQuery</InputLabel> */}
          <Select
            value={searchQuery}
            onChange={handleChange}
            defaultValue="this-week"
          >
            <MenuItem value="this-week">This Week</MenuItem>
            <MenuItem value="prev-week">Previous Week</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* // three card data */}
      <Grid container spacing={3} sx={{ mb: '1rem' }}>
        <Grid item xs={12} md={4}>
          <InfoCard
            title="Total active users"
            value={dashboardData?.current?.active_users || 0}
            previousValue={dashboardData?.previous?.active_users || 0}
            unit="k"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <InfoCard
            title="Total clicks"
            value={dashboardData?.current?.clicks || 0}
            previousValue={dashboardData?.previous?.clicks || 0}
            unit="k"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <InfoCard
            title="Total appearances"
            value={dashboardData?.current?.appearances || 0}
            previousValue={dashboardData?.previous?.appearances || 0}
            unit="k"
          />
        </Grid>
      </Grid>

      {/* two chart */}
      <Grid container spacing={3} sx={{ mb: '1rem' }}>
        <Grid item xs={12} md={6}>
          <ApexChart
            title="Website Visits"
            type="bar"
            categories={websiteVisitsData.categories}
            series={[
              { name: 'Desktop', data: websiteVisitsData.desktop },
              { name: 'Mobile', data: websiteVisitsData.mobile },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ApexChart
            title="Offers Sent"
            type="line"
            categories={offersSentData.categories}
            series={[{ name: 'Offers', data: offersSentData.offers }]}
          />
        </Grid>
      </Grid>

      {/* table */}
      <OfferListTable />
    </Box>
  );
};