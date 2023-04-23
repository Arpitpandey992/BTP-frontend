import React, { useState } from "react";
import axios from "axios";
import "./index.css";
import { Donut } from 'react-dial-knob'
import Loader from "react-js-loader";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

export default function App() {
  const [value, setValue] = React.useState(5)
  var data=[]
  const [minimumComfortTemperature,setMinimumComfortTemperature]= useState();
  const [maximumComfortTemperature,setMaximumComfortTemperature]= useState();
  const [temperature,setTemperature]= useState();
  const [isMinValid,setIsMinValid]= useState(true)
  const [isManMode,setIsManMode]= useState(false)
  const [response,setResponse]= useState(0)
  const [isMaxValid,setIsMaxValid]= useState(true)
  const [isTempValid,setIsTempValid]= useState(true)
  const [showSuccess,setShowSuccess]= useState(false)
  var baseURL = `http://127.0.0.1:8000/adam?tmin=${minimumComfortTemperature}&tset=${temperature}&tmax=${maximumComfortTemperature}`
  var baseURLPost = `http://127.0.0.1:8000/select_alpha`
  const onSubmit = () => {
    if (minimumComfortTemperature === undefined){
      setIsMinValid(false);
    return;
   }
   if (maximumComfortTemperature === undefined){
    setIsMaxValid(false);
    return;
   }
   if (temperature === undefined){
    setIsTempValid(false);
    return;
   }
   setShowSuccess(true)
   apiCall()
  }
  const apiCall = async() => {
    const res = await axios.get(baseURL)
    setResponse(res.data)
    
}

const apiCall1= async() => {
  const res = await axios.post(baseURLPost,{ tmin: minimumComfortTemperature,tmax:maximumComfortTemperature,tset:temperature,alpha:(value/10) })
  window.location.reload(false);

}
const onMan= async() => {
  if (temperature === undefined){
    setIsTempValid(false);
    return;
   }
  const res = await axios.post(baseURLPost,{ tset:temperature,alpha:0 })
}
  return (
    <>
     <button className="form-field" onClick={()=>setIsManMode(!isManMode)}>
          {isManMode? 'Automatic Mode':'Manual Mode'}
        </button>
    <div className="form-container">
      <div className="register-form">
       {!isManMode&&!showSuccess&& <input
          id="field7"
          className="form-field"
          type="number"
          placeholder="Minimum comfort temperature"
          name="field7"
          onChange={(e)=>{
            setIsMinValid(true)
            setMinimumComfortTemperature(e.target.value)}
          }
        />}
      {!isManMode&&!isMinValid&& <span id="first-name-error">Please enter the Minimum comfort temperature</span> }
      {!isManMode&&!showSuccess&&<input
          id="field8"
          className="form-field"
          type="number"
          placeholder="Maximum comfort temperature"
          name="field8"
          onChange={(e)=>{
            setIsMaxValid(true)
            setMaximumComfortTemperature(e.target.value)}}
        />}
        {!isManMode&&!isMaxValid && <span id="first-name-error">Please enter the Maximum comfort temperature</span> }
        {!showSuccess&&<input
          id="field8"
          className="form-field"
          type="number"
          placeholder="Temperature"
          name="field8"
          onChange={(e)=>{
            setIsTempValid(true)
            setTemperature(e.target.value)}}
        />}
        {!isTempValid && <span id="first-name-error">Please enter the Temperature</span> }
        {!isManMode&&!showSuccess&&<button className="form-field" onClick={onSubmit}>
          Submit
        </button>}
        {isManMode&&!showSuccess&&<button className="form-field" onClick={onMan}>
          Submit
        </button>}
        
       {!isManMode&&showSuccess && response!==0  &&
       <>
       <div class="one">
  <h1>Comfort Factor</h1>
</div>
       <Donut
        diameter={200}
        min={0}
        max={10}
        step={1}
        value={value}
        theme={{
            donutColor: 'Violet'
        }}
        style={{
          position: 'relative',
          margin: '15px auto',
          width: '200px'
        }}
        onValueChange={setValue}
        ariaLabelledBy={'my-label'}
        spaceMaxFromZero={false}
    >
        <label id={'my-label'} style={{
          color:'black',
          fontSize:'30px',
          textAlign: 'center',
          width: '200px',
          display: 'block',
          paddingTop:'30px',
          padding: '10px 10px'
        }}>Price - ₹ {Math.round(response['adam_output'][10-value].overall_price*10000)/10000}</label>
    </Donut>
    <button className="form-field" onClick={apiCall1}>
          Submit
        </button>
    </>}
    {!isManMode&&showSuccess && response===0 && (<div className={"item"}>
              <Loader type="spinner-cub" bgColor={"black"} color={'#FFFFFF'} size={100} />
            </div>)}
      
      </div>
    </div>
</>

  );
}
