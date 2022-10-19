import { app } from "../Firebase/Credenciales";
import { getFirestore, doc, setDoc, collection, getDocs } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import ChatScreen from "../components/ChatScreen";
import ChannelItem from "../components/ChannelItem";

const db = getFirestore(app);
const auth = getAuth(app);

const Chat = ({ user }) => {
  const [canales, setCanales] = useState();
  const [activeChannel, setActiveChannel] = useState(null);

  const createChannel = () => {
    const nombre = prompt("Escribí un nombre para tu canal");
    const desc = prompt("Descripción corta para tu canal");

    if (nombre) {
      const ref = doc(db, `canales/${nombre}`);
      setDoc(ref, {
        id: `canal-${user.uid}`,
        nombre: nombre,
        user: user.displayName,
        user_id: user.uid,
        descripcion: desc,
      });
    } else {
      alert("Por lo menos tenés que ponerle un nombre al chat...");
    }
  };

  const getChannels = async () => {
    let canalesList = [];
    const ref = collection(db, "canales");
    const canales = await getDocs(ref);
    canales.forEach((canal) => {
      canalesList.push(canal.data());
    });
    //console.log(canalesList);
    setCanales(canalesList);
  };

  const changeChannel = (canal) => {
    setActiveChannel(canal);
  };

  //  createChannel();

  useEffect(() => {
    getChannels();
  }, []);

  return (
    <div className="chat__wrapper">
      <div className="chat__header">
        <h1>📢 Winterchat</h1>
        <div className="chat__profile">
          <span>Hola, {user.displayName} 👋</span>
          <button onClick={() => createChannel()}>Crear canal</button>
          <button onClick={() => signOut(auth)}>Salir</button>
        </div>
      </div>

      <div className="chat__panel">
        <div className="chat__sidebar">
          <h2>Elegí un canal para chatear ❤️</h2>
          <ul>
            {canales
              ? canales.map((canal, index) => {
                  return (
                    <div key={`${index}-${canal.nombre}`} onClick={() => changeChannel(canal.nombre)}>
                      <ChannelItem channel={canal.nombre} />
                    </div>
                  );
                })
              : null}
          </ul>
        </div>
        <div className="chat__screen">
          <ChatScreen channel={activeChannel} user={user} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
