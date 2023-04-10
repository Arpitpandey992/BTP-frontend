import React, { useState } from "react";
import axios from "axios";
import "./index.css";

export default function App() {
  const [minimumComfortTemperature,setMinimumComfortTemperature]= useState();
  const [maximumComfortTemperature,setMaximumComfortTemperature]= useState();
  const [isMinValid,setIsMinValid]= useState(true)
  const [response,setResponse]= useState(0)
  const [isMaxValid,setIsMaxValid]= useState(true)
  const [showSuccess,setShowSuccess]= useState(false)
  var baseURL = `https://api.thingspeak.com/update?api_key=DXAHHTGT4Y0XL1GE&field7=${minimumComfortTemperature}&field8=${maximumComfortTemperature}`
  const onSubmit = () => {
    setResponse(0)
    if (minimumComfortTemperature === undefined){
      setIsMaxValid(false);
    return;
   }
   if (maximumComfortTemperature === undefined){
    setIsMinValid(false);
    return;
   }
   setShowSuccess(true)
   apiCall()
  }
  const apiCall = async() => {
    const res = await axios.get(baseURL)
      if(response===0 &&res.data>0)setResponse(res.data);
}
  return (
    <div className="form-container">
      <div className="register-form">
        {showSuccess&& <div className="success-message">Success! Thank you for submitting data.{response}</div> }
        <input
          id="field7"
          className="form-field"
          type="number"
          placeholder="Minimum comfort temperature"
          name="field7"
          onChange={(e)=>{
            setIsMinValid(true)
            setMinimumComfortTemperature(e.target.value)}
          }
        />
      {!isMinValid&& <span id="first-name-error">Please enter the Minimum comfort temperature</span> }
        <input
          id="field8"
          className="form-field"
          type="number"
          placeholder="Maximum comfort temperature"
          name="field8"
          onChange={(e)=>{
            setIsMaxValid(true)
            setMaximumComfortTemperature(e.target.value)}}
        />
        {!isMaxValid && <span id="first-name-error">Please enter the Maximum comfort temperature</span> }
        <button className="form-field" onClick={onSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
