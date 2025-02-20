"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    InputAdornment,
    Box,
    IconButton,
    ButtonGroup,
    Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";


interface TableData {
    id: number;
    user_name: string;
    email: string;
    phone: string;
    company: string;
    jobTitle: string;
    type: string;
    status: string;
    price: number;
}

interface ApiResponse {
    data: TableData[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

const OfferListTable: React.FC = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [search, setSearch] = useState("");
    const [total, setTotal] = useState(0);
    const [data, setData] = useState<TableData[]>([]);
    const [searchField, setSearchField] = useState<keyof TableData>("user_name");
    const [typeFilter, setTypeFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const { token } = useAuth();

    // get data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<ApiResponse>(
                    `https://dummy-1.hiublue.com/api/offers?page=${page + 1}&per_page=${rowsPerPage}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setData(response.data.data);
                setTotal(response.data.meta.total);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {

            }
        };

        fetchData();
    }, [page, rowsPerPage]);

    // for page change
    const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // data filtering
    const filteredOffers = data.filter((offer) => {
        const searchTerm = search.toLowerCase();
        const fieldValue = String(offer[searchField]).toLowerCase();
        return (
            fieldValue.includes(searchTerm) &&
            (typeFilter === "All" || offer.type.toLowerCase() === typeFilter.toLowerCase()) &&
            (statusFilter === "All" || offer.status.toLowerCase() === statusFilter.toLowerCase())
        );
    });

    return (
        <Card >
            <CardContent>
                <Typography component="h6" sx={{ fontWeight: "700", margin: "10px 0", fontSize: 20, }}>Offer List</Typography>

                {/* // buttons for different type */}
                <Box>
                    <ButtonGroup
                        size="small"
                        sx={{
                            border: 'none',
                            backgroundColor: "transparent",
                            borderRadius: "0",
                            margin: "20px 0"
                        }}
                    >
                        {["All", "accepted", "rejected", "pending"].map((status) => (
                            <Button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                variant="text"
                                sx={{
                                    textTransform: 'capitalize',
                                    color: statusFilter === status ? '#000' : 'gray',
                                    borderBottom: statusFilter === status ? '2px solid black' : 'none',
                                    backgroundColor: 'transparent',
                                    textDecoration: 'none',
                                    borderRadius: '0',
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        borderBottom: statusFilter === status ? '2px solid black' : 'none',
                                        color: statusFilter === status ? '#000' : 'gray'
                                    },
                                    mx: "1rem",
                                }}
                            >
                                {status}
                            </Button>
                        ))}
                    </ButtonGroup>
                </Box>

                {/* // data search and filter type */}
                <Box sx={{ display: "flex", gap: "1rem", flexDirection: { xs: "column", sm: "row" }, }}>
                    {/* Search Input with Icon */}
                    <TextField
                        label="Search..."
                        variant="outlined"
                        fullWidth
                        // sx={{ width: "50%" }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Filter Type Dropdown (Reduced Width) */}
                    <Box sx={{ width: "100%" }}>
                        <FormControl sx={{ width: "50%" }}>
                            <InputLabel>Type</InputLabel>
                            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="Type">
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Monthly">Monthly</MenuItem>
                                <MenuItem value="Yearly">Yearly</MenuItem>
                                <MenuItem value="Pay As You Go">Pay As You Go</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </CardContent>

            {/* // table  */}
            <Box style={{ overflowX: "auto" }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Job Title</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredOffers.map((offer) => (
                                <TableRow key={offer?.id}>
                                    <TableCell>
                                        <Typography fontWeight="bold">{offer?.user_name}</Typography>
                                        <Typography variant="body2" color="textSecondary">{offer?.email}</Typography>
                                    </TableCell>
                                    <TableCell>{offer?.phone}</TableCell>
                                    <TableCell>{offer?.company}</TableCell>
                                    <TableCell>{offer?.jobTitle}</TableCell>
                                    <TableCell style={{ textTransform: 'capitalize' }}>{offer?.type}</TableCell>
                                    <TableCell>
                                        <span style={{
                                            textTransform: 'capitalize',
                                            padding: "4px 8px",
                                            borderRadius: "4px",
                                            fontWeight: "bold",
                                            backgroundColor: "#FFAB0029",
                                            color: offer?.status === "accepted" ? "#118D57" : offer?.status === "rejected" ? "#B71D18" : "#B76E00",
                                        }}>
                                            {offer?.status}
                                        </span>
                                    </TableCell>
                                    <TableCell sx={{ display: "flex" }}>
                                        <IconButton>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton>
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* // table pagination  */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={total}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Card>
    );
};

export default OfferListTable;
