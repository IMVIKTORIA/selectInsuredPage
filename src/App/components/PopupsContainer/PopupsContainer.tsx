import React, { useEffect } from "react";
import { selectRequestContext } from "../../stores/SelectRequestContext";

interface PopupsMessageProps {
  messages: string[],
  setMessages: (messages: string[]) => void;
}

/** Кнопка Выбрать */
export default function PopupsContainer({messages, setMessages}: PopupsMessageProps) {
  
  function clearMessagesList() {
    try {
      if(!messages.length) return
      setMessages([])
    } catch(e) {
      document.removeEventListener("click", clearMessagesList)
    }
  }
  
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
  useEffect(() => {
    if(!messages.length) document.removeEventListener("click", clearMessagesList)
    sleep(10).then(() => document.addEventListener("click", clearMessagesList))

    return () => document.removeEventListener("click", clearMessagesList)
  }, [messages])

  return (
    <div className="medpult-popups-container">
      {messages.map(message => (
        <div className="mk-simple-alert-box mk-simple-alert-box-error">
          {message}
        </div>
      ))}
    </div>
  );
}
