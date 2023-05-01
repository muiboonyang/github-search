import React, {useState, useEffect} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

import {RootState} from "../redux/store";
import {useDispatch, useSelector} from "react-redux";
import {loadingStatus} from "../redux/loadingSlice";
import {login} from "../redux/userSlice";

import styles from "./Login.module.css";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";

import {useFormContext, useWatch} from "react-hook-form";
import FormHelperText from "@mui/material/FormHelperText";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CustomAlert from "../components/CustomAlert/CustomAlert";
import Cookies from "js-cookie";
import {axiosApi} from "../utils/fetchApi";

const Login = (): JSX.Element => {

    //================
    // React Hook Form
    //================

    interface FormValues {
        email: string;
        password: string;
    }

    const {
        handleSubmit,
        register,
        reset,
        formState: {isSubmitSuccessful, errors},
    } = useFormContext<FormValues>();

    const formHasNoError = Object.keys(errors).length === 0;
    const {email, password} = useWatch()

    const fieldErrorMessages = {
        email: "Email is required",
        password: "Password is required",
    };

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset(
                {
                    email: "",
                    password: "",
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
    const navigate = useNavigate();

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

    //================
    // POST - Log in
    //================

    const loginUser = async () => {
        dispatch(loadingStatus());

        /////////////////////////////
        // 1) Using Fetch
        /////////////////////////////

        // try {
        //     const {status, data} = await fetchApi(
        //         `/api/Sessions/login`,
        //         {
        //             method: "POST",
        //             headers: {
        //                 "Content-Type": "application/json",
        //             },
        //             credentials: "include",
        //             body: JSON.stringify({
        //                 email: email,
        //                 password: password,
        //             }),
        //         }
        //     );
        //
        //     if (status === 200) {
        //         // unable to see alert for successful log in due to redirect to login page
        //         setAlertMessage(data.message);
        //         dispatch(login(data));
        //         navigate("/");
        //     } else {
        //         setAlertMessage(data.message);
        //     }
        //
        // } catch (err) {
        //     console.log(err);
        // }

        /////////////////////////////
        // 2) Using Axios
        /////////////////////////////

        try {
            const {status, data} = await axiosApi(`/api/Sessions/login`,
            {
                method: 'post',
                withCredentials: true,
                headers: {'content-type': 'application/json'},
                data: {
                    email: email,
                    password: password,
                }})

            if (status === 200) {
                // unable to see alert for successful log in due to redirect to login page
                setAlertMessage(data.message);
                dispatch(login(data));
                navigate("/");
            } else {
                setAlertMessage(data.message);
            }

        } catch (err) {
            console.log(err);
        }

        dispatch(loadingStatus());
    };

    const isLoggedIn = Cookies.get('isLoggedIn');
    if (isLoggedIn) return <Navigate replace to="/"/>;
    if (isLoading) return <LoadingSpinner/>;

    return (
        <div className={styles.container}>

            <CustomAlert
                alertMessage={alertMessage}
                setAlertMessage={setAlertMessage}
            />

            <div className={styles.login}>
                <Container maxWidth="sm">
                    <Box>
                        <br/>
                        <h3>Log In</h3>
                        <br/>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit(() => {
                        try {
                            loginUser();
                        } catch (err) {
                            console.log(err)
                        }
                    })}>
                        <TextField
                            fullWidth
                            id="outlined-required"
                            label="Email"
                            type="email"
                            autoComplete="current-email"
                            {...register("email", {
                                required: fieldErrorMessages.email,
                            })}
                        />
                        {errors.email && (
                            <FormHelperText error>{errors.email.message}</FormHelperText>
                        )}
                        <br/> <br/>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">
                                Password
                            </InputLabel>
                            <OutlinedInput
                                label="Password"
                                id="standard-adornment-password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                {...register("password", {
                                    required: fieldErrorMessages.password,
                                })}
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
                        {errors.password && (
                            <FormHelperText error>{errors.password.message}</FormHelperText>
                        )}
                        <br/> <br/>
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            size="large"
                            sx={{bgcolor: "black"}}
                            disabled={!formHasNoError}
                        >
                            Submit
                        </Button>
                        <hr/>
                        <Button
                            variant="outlined"
                            color="inherit"
                            size="large"
                            fullWidth
                            onClick={() => {
                                navigate("/register");
                            }}
                            sx={{color: "gray"}}
                        >
                            Create Account
                        </Button>
                    </Box>
                </Container>
            </div>
        </div>
    );
};

export default Login;
