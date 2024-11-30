import { useState } from "react";
// import { useBlock } from "@starknet-react/core";
import Header from "./components/Header";
import Login from "./scenes/Login/Login";
import Home from "./scenes/Home/Home";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <>
      { !isLoggedIn && <Login setIsLoggedIn={setIsLoggedIn} /> }
      { isLoggedIn && (
        <>
        {/* <Header/> */}
        <Home />
        </>
        )}
    </>
  );
}

export default App;
