"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Box, Button, FormControl, FormLabel, MenuItem, Select, TextField, Typography, RadioGroup, FormControlLabel, Radio, Checkbox, InputAdornment } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  plan_type: yup.string().oneOf(["monthly", "yearly", "pay_as_you_go"], "Invalid plan type").required("Plan type is required"),
  additions: yup.array().of(yup.string().oneOf(["refundable", "on_demand", "negotiable"])),
  user_id: yup.number().required("User is required"),
  expired: yup.string().required("Expiration date is required"),
  price: yup.number().typeError("Price must be a number").required("Price is required").positive("Price must be positive"),
});

const OnboardingView = () => {

  const { control, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting }, trigger } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange", // Ensure validation runs on every change
    // criteriaMode: "all",
    defaultValues: {
      plan_type: "monthly",
      additions: [],
      user_id: undefined,
      expired: "",
      price: undefined,
    },
  });

  const [users, setUsers] = useState([]);
  const { token } = useAuth();

  // const formValues = watch(); // Watch all form values

  useEffect(() => {
    axios
      .get("https://dummy-1.hiublue.com/api/users?page=1&per_page=5", {
        headers: { Authorization: `Bearer ${token}`, },
      })
      .then((response) => setUsers(response.data.data))
      .catch((error) => console.error("Error fetching users", error));
  }, []);

  const onSubmit = async (data: any) => {
    // console.log(data);

    // Manually trigger validation for all fields
    const isValid = await trigger();

    // If the form is not valid, show an error toast and return
    if (!isValid) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await axios.post(
        "https://dummy-1.hiublue.com/api/offers",
        data,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      console.log("Offer created", response.data);
      toast.success("Offer created successfully");
      reset();
    } catch (error: any) {
      console.error("Error creating offer", error);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };


  return (
    <Box sx={{ maxWidth: 720, mx: "auto", mt: 1, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "background.paper" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", }}>
        <Typography variant="h5" mb={0}>Create Offer</Typography>
        <Typography mb={2} sx={{ color: "gray", fontSize: 14, fontWeight: 400 }}>Send onboarding offer to new user</Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ color: "black", }}>Plan Type</FormLabel>
          <Controller
            name="plan_type"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <RadioGroup {...field} row>
                  <FormControlLabel value="pay_as_you_go" control={<Radio sx={{ color: "#637381", "&.Mui-checked": { color: "#00A76F" }, }} />} label="Pay As You Go" />
                  <FormControlLabel value="monthly" control={<Radio sx={{ color: "#637381", "&.Mui-checked": { color: "#00A76F" }, }} />} label="Monthly" />
                  <FormControlLabel value="yearly" control={<Radio sx={{ color: "#637381", "&.Mui-checked": { color: "#00A76F" }, }} />} label="Yearly" />
                </RadioGroup>
                {error && <Typography variant="caption" color="error">{error.message}</Typography>}
              </>
            )}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ color: "black", }}>Additions</FormLabel>
          <Controller
            name="additions"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <Box>
                  {["refundable", "on_demand", "negotiable"].map((option) => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={(field.value || []).includes(option)} // Ensure field.value is an array
                          // checked={field.value?.includes(option) ?? false}
                          onChange={(event) => {
                            const checked = event.target.checked;
                            const updatedValues = checked
                              ? [...(field.value || []), option] // Add to array if checked
                              : (field.value || []).filter((v) => v !== option); // Remove from array if unchecked
                            field.onChange(updatedValues); // Update form state
                          }}
                          // onChange={() => {
                          //   setValue(
                          //     "additions",
                          //     // (field.value || []).includes(option)
                          //     //   ? (field.value || []).filter((v: string) => v !== option)
                          //     //   : [...(field.value || []), option]
                          //     field.value
                          //       ?.filter((v): v is string => v !== undefined) // Type predicate ensures correct filtering
                          //       .filter((v) => v !== option) ?? []
                          //     // field.value?.includes(option)
                          //     // ? field.value.filter((v: string) => v !== option) ?? []
                          //     // : [...(field.value ?? []), option]
                          //   );
                          // }}
                          sx={{ color: "#637381", "&.Mui-checked": { color: "#00A76F" }, }}
                        />
                      }
                      label={option.charAt(0).toUpperCase() + option.slice(1)}
                    />
                  ))}
                </Box>
                {error && <Typography variant="caption" color="error">{error.message}</Typography>}
              </>
            )}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ color: "black", }}>User</FormLabel>
          <Controller
            name="user_id"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <Select {...field} displayEmpty sx={{ marginTop: 1 }}
                  value={field.value || ""}
                  onChange={(event) => field.onChange(event.target.value ? Number(event.target.value) : "")} // Convert to number
                  error={!!error}
                >
                  <MenuItem value="" disabled>Select a user</MenuItem>
                  {users.map((user: any) => (
                    <MenuItem key={user.id} value={user.id} >{user.name}</MenuItem>
                  ))}
                </Select>
                {error && <Typography variant="caption" color="error">{error.message}</Typography>}
              </>
            )}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ color: "black", }}>Expired</FormLabel>
          <Controller
            name="expired"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <TextField {...field} fullWidth margin="dense" type="date" error={!!error} />
                {error && <Typography variant="caption" color="error">{error.message}</Typography>}
              </>
            )}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <FormLabel sx={{ color: "black", }}>Price</FormLabel>
          <Controller
            name="price"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <TextField {...field} fullWidth margin="dense" type="number"
                  // InputProps={{ startAdornment: "$" }}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    },
                  }}
                  value={field.value || ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(value ? parseFloat(value) : ""); // Convert to number
                  }}
                  error={!!error}
                />
                {error && <Typography variant="caption" color="error">{error.message}</Typography>}
              </>
            )}
          />
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          sx={{
            color: "white",
            "&:hover": { backgroundColor: "gray" },
            backgroundColor: "#1C252E",
            width: "110px",
            display: "flex",
            justifySelf: "flex-end",
            mt: 2,
          }}
          disabled={isSubmitting}
        >
          Send Offer
        </Button>
      </form>
    </Box>
  );
};

export default OnboardingView;
