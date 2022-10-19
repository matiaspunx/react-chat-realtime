import { useEffect, useRef, useState } from "react";
import { app } from "../Firebase/Credenciales";
import { getFirestore, doc, setDoc, collection, getDocs, onSnapshot, where, query, orderBy, limit, limitToLast } from "firebase/firestore";
import Message from "./Message";
const db = getFirestore(app);

const ChatScreen = ({ channel, user }) => {
  const [inputMsg, setInputMgs] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const anchor = useRef();
  const chatDiv = useRef();

  const wordsFilter = (msg) => {
    const filtro = ["forro", "sorete", "puto", "hijo de puta"];
    const arr = msg.split(" ");
    arr.forEach((word, index) => {
      if (filtro.includes(word)) {
        arr[index] = "****";
      }
    });

    return arr.join(" ");
  };

  const handleMsg = (e) => {
    e.preventDefault();

    if (inputMsg !== "") {
      const filter = wordsFilter(inputMsg);
      const timestamp = Date.now();
      const ref = doc(db, `canales/${channel}/mensajes/${new Date().getTime()}`);
      setDoc(ref, {
        photoURL: user.photoURL,
        displayName: user.displayName,
        message: filter,
        id: new Date().getTime(),
        date: new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(timestamp),
      });

      setInputMgs("");
    } else {
      alert("Escribí un mensaje!");
    }
  };

  useEffect(() => {
    chatDiv.current.scrollTop = chatDiv.current.scrollHeight;
  }, [messagesList]);

  useEffect(() => {
    const q = query(collection(db, `canales/${channel}/mensajes`), orderBy("date", "asc"), limitToLast(25));

    const unSub = onSnapshot(q, (querySnapshot) => {
      // Obtengo todos los documentos de la colección...
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      // Actualizo el estado
      setMessagesList(data);
    });

    // dejo de escuchar el listener...
    return () => {
      unSub();
    };

    chatDiv.current.scrollTop = chatDiv.current.scrollHeight;
  }, [channel]);

  return (
    <div className="chat">
      <div className="chat__header__inn">📢 {channel || ""}</div>
      <div className="chat__messages" ref={chatDiv}>
        {messagesList ? messagesList.map((msg, i) => <Message key={i} message={msg} />) : null}
        <div ref={anchor} style={{ marginBottom: "10px" }}></div>
      </div>
      <div className="chat__input">
        <form onSubmit={handleMsg}>
          <input
            type="text"
            name="msg"
            id="msg"
            disabled={channel ? false : true}
            value={inputMsg}
            onChange={(e) => setInputMgs(e.target.value)}
            placeholder={`Escribí tu mensaje en ${channel || ""}`}
          />
          <button disabled={channel ? false : true}>Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default ChatScreen;
