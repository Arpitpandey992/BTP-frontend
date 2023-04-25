import React, { useState } from "react";
import axios from "axios";
import "./index.css";
import { Donut } from "react-dial-knob";
import Loader from "react-js-loader";
import { TextField, Stack } from "@mui/material";
import dummy_response from "./dummy.json";

var backendUrl = `http://127.0.0.1:8000`;
export default function App() {
    const [value, setValue] = React.useState(5);
    const [minimumComfortTemperature, setMinimumComfortTemperature] =
        useState();
    const [maximumComfortTemperature, setMaximumComfortTemperature] =
        useState();
    const [temperature, setTemperature] = useState();
    const [isMinValid, setIsMinValid] = useState(true);
    const [isManMode, setIsManMode] = useState(false);
    const [response, setResponse] = useState(dummy_response);
    const plot = `${backendUrl}/${
        response["adam_output"][10 - value].plot_location
    }`;
    const [isMaxValid, setIsMaxValid] = useState(true);
    const [isTempValid, setIsTempValid] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    var adamApiUrl = `${backendUrl}/adam?tmin=${minimumComfortTemperature}&tset=${temperature}&tmax=${maximumComfortTemperature}`;
    var selectAlphaApiUrl = `${backendUrl}/select_alpha`;
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
        adamApiCall();
    };
    const adamApiCall = async () => {
        const res = await axios.get(adamApiUrl);
        setResponse(res.data);
    };

    const setAlphaApiCall = async () => {
        setShowSuccess(true);
        setResponse(dummy_response);
        await axios.post(selectAlphaApiUrl, {
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
        setResponse(dummy_response);
        await axios.post(selectAlphaApiUrl, {
            tset: temperature,
            tmax: temperature,
            tmin: temperature,
            alpha: 0,
            manual_mode: true,
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
                            name="field7"
                            value={minimumComfortTemperature}
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
                            name="field8"
                            value={temperature}
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
                            name="field8"
                            value={maximumComfortTemperature}
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

                    {!isManMode &&
                        showSuccess &&
                        response !== dummy_response && (
                            <div className="donut-box">
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
                                            donutColor: "#414141",
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
                                            {Math.trunc(
                                                Math.round(
                                                    response["adam_output"][
                                                        10 - value
                                                    ].overall_price * 10000
                                                ) / 10000
                                            )}
                                        </label>
                                    </Donut>
                                    <button onClick={setAlphaApiCall}>
                                        Submit
                                    </button>
                                </>
                            </div>
                        )}

                    {showSuccess && response === dummy_response && (
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
                {!isManMode && showSuccess && response !== dummy_response && (
                    <div className="img-container">
                        {<img className="plot-img" src={plot} alt="plot"></img>}
                    </div>
                )}
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
