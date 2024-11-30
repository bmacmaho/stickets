import Login from "./scenes/Login/Login";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <>
      {!isLoggedIn ?
        <Login setIsLoggedIn={setIsLoggedIn}/> : 
        (
          <div>
            <h1>Welcome to the app!</h1>
            <button onClick={() => setIsLoggedIn(false)}>Logout</button>
          </div>
        )}
    </>
  );
}

export default App;
