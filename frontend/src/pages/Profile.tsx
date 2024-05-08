import React, {useState, useEffect} from "react";
// import LoadingSpinner from "../components/LoadingSpinner";

import {fetchApiWithJwt} from "../utils/fetchApi";

import {RootState} from "../redux/store";
import {useDispatch, useSelector} from "react-redux";
import {loadingStatus} from "../redux/loadingSlice";
import {update} from "../redux/userSlice";

import styles from "./Profile.module.css";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Skeleton from "@mui/material/Skeleton";
import {useFormContext, useWatch} from "react-hook-form";
import CustomAlert from "../components/CustomAlert/CustomAlert";

const Profile = (): JSX.Element => {

    //================
    // React Hook Form
    //================

    interface FormValues {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
    }

    const {
        handleSubmit,
        setValue,
        getValues,
        setError,
        clearErrors,
        register,
        reset,
        formState: {isSubmitSuccessful, errors},
    } = useFormContext<FormValues>();

    const formHasNoError = Object.keys(errors).length === 0;

    const email = getValues('email');
    const {name, password, confirmPassword} = useWatch()

    const fieldErrorMessages = {
        name: "Name is required",
        email: "Email is required",
        password: "Password is required",
        confirmPassword: "Password is required",
        passwordsDoNotMatch: "Passwords do not match!",
    };

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset(
                {
                    password: "",
                    confirmPassword: "",
                },
                {
                    keepIsSubmitted: false,
                    keepErrors: false,
                    keepIsValid: false,
                }
            );
        }
    }, [isSubmitSuccessful, reset]);

    //================
    // Form Setup
    //================

    const isLoading = useSelector((state: RootState) => state.loading.isLoading);
    const dispatch = useDispatch();

    const [alertMessage, setAlertMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    useEffect(() => {
        if (password !== confirmPassword) {
            setError('confirmPassword', {type: 'custom', message: fieldErrorMessages.passwordsDoNotMatch})
        }
        if (password === confirmPassword && errors.confirmPassword) {
            clearErrors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [password, confirmPassword]);

    //================
    // GET - Fetch user data from API (by their email)
    //================

    const getUserInfo = async () => {
        dispatch(loadingStatus());
        try {
            const {status, data} = await fetchApiWithJwt(
                `/api/users/profile`, 'Get'
            );

            if (status === 200) {
                setValue('name', data.name);
                setValue('email', data.email);
            }
        } catch (err) {
            console.log(err);
        }
        dispatch(loadingStatus());
    };

    useEffect(() => {
        getUserInfo();
        // eslint-disable-next-line
    }, []);

    //================
    // POST - Update current user
    //================

    const submitRequest = async () => {
        if (formHasNoError) {
            dispatch(loadingStatus());
            try {
                const {status, data} = await fetchApiWithJwt(
                    `/api/users/update`, 'Post',
                    {
                        name: name,
                        password: password,
                    }
                );

                if (status === 200) {
                    setAlertMessage(data.message);
                    dispatch(update(name));
                    getUserInfo();
                }
            } catch (err) {
                console.log(err);
            }
            dispatch(loadingStatus());
        }
    };

    return (
        <>
            <div className={styles.container}>
                <>
                    <CustomAlert
                        alertMessage={alertMessage}
                        setAlertMessage={setAlertMessage}
                    />

                    <div className={styles.profile}>
                        <Container maxWidth="sm">
                            <Box>
                                <br/>
                                <h3>Update Profile</h3>
                                <br/>
                            </Box>

                            {/*MUI form component*/}
                            <Box
                                component="form"
                                autoComplete="off"
                                onSubmit={handleSubmit(() => {
                                    try {
                                        submitRequest();
                                    } catch (err) {
                                        console.log(err)
                                    }
                                })}
                            >

                                {isLoading ? (
                                    <Skeleton height={70} width="100%">
                                        <TextField/>
                                    </Skeleton>
                                ) : (
                                    <>
                                        <TextField
                                            fullWidth
                                            id="outlined-name"
                                            label="Name"
                                            type="text"
                                            defaultValue={name}
                                            {...register("name", {
                                                required: fieldErrorMessages.name,
                                            })}
                                        />
                                    </>
                                )}

                                <Divider sx={{mt: 2, mb: 2}}/>

                                {isLoading ? (
                                    <Skeleton height={70} width="100%">
                                        <TextField/>
                                    </Skeleton>
                                ) : (
                                    <TextField
                                        disabled
                                        fullWidth
                                        id="outlined"
                                        label="Email"
                                        type="email"
                                        defaultValue={email}
                                    />
                                )}


                                {isLoading ? (
                                    <Skeleton height={70} width="100%">
                                        <OutlinedInput/>
                                    </Skeleton>
                                ) : (
                                    <>
                                        <br/> <br/>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel htmlFor="outlined-adornment-password">
                                                Password
                                            </InputLabel>
                                            <OutlinedInput
                                                label="Password"
                                                id="standard-adornment-password"
                                                type={showPassword ? "text" : "password"}
                                                defaultValue={password}
                                                {...register("password", {
                                                    required: fieldErrorMessages.password,
                                                })}
                                                error={password !== confirmPassword}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                        >
                                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                    </>
                                )}


                                {isLoading ? (
                                    <Skeleton height={70} width="100%">
                                        <OutlinedInput/>
                                    </Skeleton>
                                ) : (
                                    <>

                                        <br/> <br/>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel htmlFor="outlined-adornment-confirm-password">
                                                Confirm Password
                                            </InputLabel>
                                            <OutlinedInput
                                                label="Password"
                                                id="standard-adornment-confirm-password"
                                                type={showPassword ? "text" : "password"}
                                                defaultValue={confirmPassword}
                                                {...register("confirmPassword", {
                                                    required: fieldErrorMessages.confirmPassword,
                                                })}
                                                error={password !== confirmPassword}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                        >
                                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                            {errors.confirmPassword && (
                                                <FormHelperText error>{errors.confirmPassword.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </>
                                )}


                                {isLoading ? (
                                    <Skeleton height={50} width="100%">
                                        <Button/>
                                    </Skeleton>
                                ) : (
                                    <>
                                        <br/> <br/>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            type="submit"
                                            size="large"
                                            sx={{bgcolor: "black"}}
                                            disabled={!formHasNoError}
                                        >
                                            Update
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Container>
                    </div>
                </>
            </div>
        </>
    );
};

export default Profile;
