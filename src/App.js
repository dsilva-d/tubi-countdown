import React from "react";
import CountDown from "./components/CountDown";

export default function App() {
  return (
    <CountDown
      // Optional: customize
      // target={new Date("2025-11-07T20:00:00")} // example 8pm local time
      // buttonText="Add to Calendar"
      // onButtonClick={() => console.log("cta")}
    />
  );
}
