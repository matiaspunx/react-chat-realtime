import React from "react";

const Message = ({ message }) => {
  return (
    <div className="chat__message">
      <div className="chat__messageInfo">
        <img src={message.photoURL} alt={message.displayName} />
        <span>
          {message.displayName} <span>{message.date}</span>
        </span>
      </div>
      <div className="chat__messageText">{message.message}</div>
    </div>
  );
};

export default Message;
