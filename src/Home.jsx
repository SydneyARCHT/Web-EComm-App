import React from "react";
import NavigationBar from "./NavigationBar";
import "./AppStyles.css"; 

export function Home(){
  return (

    <div>
        <NavigationBar />
        <div className="home-page">
        <h1></h1>
        <p>Where prices are fair and inflation hasn't hit us yet! You are welcome</p>
        </div>
    </div>
  )
}