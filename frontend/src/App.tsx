import { useState } from "react";
import Login from "./scenes/Login/Login";
import Home from "./scenes/Home/Home";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <>
      { !isLoggedIn && <Login setIsLoggedIn={setIsLoggedIn} /> }
      { isLoggedIn && <Home/>}
    </>
  );
}

export default App;
