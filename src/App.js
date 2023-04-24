import React, { useState } from "react";
import axios from "axios";
import "./index.css";
import { Donut } from "react-dial-knob";
import Loader from "react-js-loader";
import { TextField, Button, Stack, Divider, Box } from "@mui/material";

export default function App() {
    const [value, setValue] = React.useState(5);
    var data = [];
    const [minimumComfortTemperature, setMinimumComfortTemperature] =
        useState();
    const [maximumComfortTemperature, setMaximumComfortTemperature] =
        useState();
    const [temperature, setTemperature] = useState();
    const [isMinValid, setIsMinValid] = useState(true);
    const [isManMode, setIsManMode] = useState(false);
    const [response, setResponse] = useState(0);
    const [isMaxValid, setIsMaxValid] = useState(true);
    const [isTempValid, setIsTempValid] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    var baseURL = `http://127.0.0.1:8000/adam?tmin=${minimumComfortTemperature}&tset=${temperature}&tmax=${maximumComfortTemperature}`;
    var baseURLPost = `http://127.0.0.1:8000/select_alpha`;
    const onSubmit = () => {
        if (minimumComfortTemperature === undefined) {
            setIsMinValid(false);
            return;
        }
        if (maximumComfortTemperature === undefined) {
            setIsMaxValid(false);
            return;
        }
        if (temperature === undefined) {
            setIsTempValid(false);
            return;
        }
        setShowSuccess(true);
        apiCall();
    };
    const apiCall = async () => {
        const res = await axios.get(baseURL);
        setResponse(res.data);
    };

    const apiCall1 = async () => {
        setShowSuccess(true);
        setResponse(0);
        const res = await axios.post(baseURLPost, {
            tmin: minimumComfortTemperature,
            tmax: maximumComfortTemperature,
            tset: temperature,
            alpha: (10 - value) / 10,
        });
        setShowSuccess(false);
    };
    const onMan = async () => {
        if (temperature === undefined) {
            setIsTempValid(false);
            return;
        }
        setShowSuccess(true);
        setResponse(0);
        const res = await axios.post(baseURLPost, {
            tset: temperature,
            alpha: 0,
        });
        setShowSuccess(false);
    };
    return (
        <div className="main-container">
            <h1 className="main-heading">Home Temperature Manager</h1>
            <div className="form-container">
                <div className="register-form">
                    {!isManMode && !showSuccess && (
                        <TextField
                            id="outlined-basic"
                            label="Minimum Acceptable Temperature"
                            variant="outlined"
                            className="form-field"
                            type="number"
                            name="field7"
                            onChange={(e) => {
                                setIsMinValid(true);
                                setMinimumComfortTemperature(e.target.value);
                            }}
                        />
                    )}
                    {!isManMode && !isMinValid && (
                        <span id="first-name-error">
                            Please enter the Minimum Acceptable Temperature
                        </span>
                    )}

                    {!showSuccess && (
                        <TextField
                            id="outlined-basic"
                            label="Desired Temperature"
                            variant="outlined"
                            className="form-field"
                            type="number"
                            name="field8"
                            onChange={(e) => {
                                setIsTempValid(true);
                                setTemperature(e.target.value);
                            }}
                        />
                    )}
                    {!isTempValid && (
                        <span id="first-name-error">
                            Please enter the Desired Temperature
                        </span>
                    )}
                    {!isManMode && !showSuccess && (
                        <TextField
                            id="outlined-basic"
                            label="Maximum Acceptable Temperature"
                            variant="outlined"
                            className="form-field"
                            type="number"
                            name="field8"
                            onChange={(e) => {
                                setIsMaxValid(true);
                                setMaximumComfortTemperature(e.target.value);
                            }}
                        />
                    )}
                    {!isManMode && !isMaxValid && (
                        <span id="first-name-error">
                            Please enter the Maximum Acceptable Temperature
                        </span>
                    )}
                    <Stack
                        direction="column"
                        spacing={1}
                        justifyContent={"center"}
                    >
                        {!isManMode && !showSuccess && (
                            <button onClick={onSubmit}>Submit</button>
                        )}
                        {isManMode && !showSuccess && (
                            <button onClick={onMan}>Submit</button>
                        )}
                    </Stack>

                    {!isManMode && showSuccess && response !== 0 && (
                        <>
                            <div class="one">
                                <h1>Comfort Level</h1>
                            </div>
                            <Donut
                                diameter={200}
                                min={0}
                                max={10}
                                step={1}
                                value={value}
                                theme={{
                                    donutColor: "Violet",
                                }}
                                style={{
                                    position: "relative",
                                    margin: "15px auto",
                                    width: "200px",
                                }}
                                onValueChange={setValue}
                                ariaLabelledBy={"my-label"}
                                spaceMaxFromZero={false}
                            >
                                <label
                                    id={"my-label"}
                                    style={{
                                        color: "#414141",
                                        fontSize: "30px",
                                        textAlign: "center",
                                        width: "200px",
                                        display: "block",
                                        paddingTop: "30px",
                                        padding: "10px 10px",
                                    }}
                                >
                                    Price - ₹{" "}
                                    {Math.round(
                                        response["adam_output"][10 - value]
                                            .overall_price * 10000
                                    ) / 10000}
                                </label>
                            </Donut>
                            <button onClick={apiCall1}>Submit</button>
                        </>
                    )}

                    {showSuccess && response === 0 && (
                        <div className={"item"}>
                            <Loader
                                type="spinner-cub"
                                bgColor={"black"}
                                color={"#FFFFFF"}
                                size={100}
                            />
                        </div>
                    )}
                </div>
            </div>
            {!showSuccess && (
                <button
                    variant="contained"
                    onClick={() => setIsManMode(!isManMode)}
                >
                    {isManMode ? "Automatic Mode" : "Manual Mode"}
                </button>
            )}
        </div>
    );
}
