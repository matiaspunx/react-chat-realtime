import React, { useState } from "react";
import Chat from "./routes/Chat";
import Login from "./routes/Login";
import { app } from "./Firebase/Credenciales";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth(app);

const App = () => {
  const [globalUser, setGlobalUser] = useState(null);
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      setGlobalUser(firebaseUser.providerData[0]);
    } else {
      setGlobalUser(null);
    }
  });
  return <>{globalUser ? <Chat user={globalUser} /> : <Login />}</>;
};

export default App;
