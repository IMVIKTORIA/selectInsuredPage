import React, { useEffect } from "react";
import { selectRequestContext } from "../../stores/SelectRequestContext";

interface PopupsMessageProps {}

/** Кнопка Выбрать */
export default function PopupsContainer({ }: PopupsMessageProps) {
  const { data, setValue } = selectRequestContext.useContext();
  
  function clearMessagesList() {
    try {
      if(!data.errorMessages.length) return
      setValue("errorMessages", [])
    } catch(e) {
      document.removeEventListener("click", clearMessagesList)
    }
  }
  
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
  useEffect(() => {
    if(!data.errorMessages.length) document.removeEventListener("click", clearMessagesList)
    sleep(10).then(() => document.addEventListener("click", clearMessagesList))

    return () => document.removeEventListener("click", clearMessagesList)
  }, [data.errorMessages])

  return (
    <div className="medpult-popups-container">
      {data.errorMessages.map(message => (
        <div className="mk-simple-alert-box mk-simple-alert-box-error">
          {message}
        </div>
      ))}
    </div>
  );
}
