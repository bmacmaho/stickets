import { useState } from "react";
import Login from "./scenes/Login/Login";
import Home from "./scenes/Home/Home";
import EventOverview from "./scenes/EventOverview/EventOverview";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isBuyTicketsOpen, setBuyTicketsIsOpen] = useState(false)

  return (
    <>
      { !isLoggedIn && <Login setIsLoggedIn={setIsLoggedIn} /> }
      { isLoggedIn && !isBuyTicketsOpen && <Home setBuyTicketsIsOpen={setBuyTicketsIsOpen}/>}
      { isLoggedIn && isBuyTicketsOpen && <EventOverview setBuyTicketsIsOpen={setBuyTicketsIsOpen}/>}
    </>
  );
}

export default App;
