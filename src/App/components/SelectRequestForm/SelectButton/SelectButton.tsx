import React, { } from "react";
import Scripts from "../../../shared/utils/clientScripts";
import { selectRequestContext, } from "../../../stores/SelectRequestContext";
import Button from "../../../../UIKit/Button/Button";
import { redirectSPA } from "../../../shared/utils/utils";

interface SelectButtonProps {
}

/** Кнопка Выбрать */
export default function SelectButton({ }: SelectButtonProps) {
  const { data, setValue } = selectRequestContext.useContext();

  // Установить контрагента в договор
  const setTreatyContractor = async () => {
    const selectedContractorId = data.selectedItemsIds[0];
    await Scripts.setContractInsured(selectedContractorId);

    const insurance_treaty_page_code = Scripts.getTreatyPageCode();
    redirectSPA(insurance_treaty_page_code);
  }

  // Установить контрагента в фильтр
  const setFilterInsured = async () => {
    const selectedContractorId = data.selectedItemsIds[0];

    await Scripts.setFilterInsured(selectedContractorId);
    const select_task_page_code = Scripts.getSelectTaskPageCode();
    redirectSPA(select_task_page_code);
  }

  // Установить застрахованного в обращение
  const setRequestInsured = async () => {
    const selectedContractorId = data.selectedItemsIds[0];

    const fieldId = new URLSearchParams(window.location.search).get("field_id");
    if (fieldId) await Scripts.assignInsured(fieldId, selectedContractorId);

    const mode = new URLSearchParams(window.location.search).get("mode");
    const request_page_path = Scripts.getRequestPageCode();
    if (mode) {
      redirectSPA(request_page_path + "?mode=" + mode)
    } else {
      redirectSPA(request_page_path)
    }
  }

  // Установить список застрахованного в обращении
  const setRequestInsuredList = async () => {
    const selectedContractorsIds = data.selectedItemsIds;
    await Scripts.assignInsuredList(selectedContractorsIds);

    const mode = new URLSearchParams(window.location.search).get("mode");
    const request_page_path = Scripts.getRequestPageCode();
    if (mode) {
      redirectSPA(request_page_path + "?mode=" + mode)
    } else {
      redirectSPA(request_page_path)
    }
  }

  // Нажатие на кнопку выбрать
  const handleSelectClick = async () => {
    const fieldId = new URLSearchParams(window.location.search).get("field_id");

    switch (fieldId) {
      case "medpult-treaty-contractor":
        await setTreatyContractor();
        break;
      case "select-task-insured":
        await setFilterInsured();
        break;
      case "medpult-request-insured-list":
        await setRequestInsuredList();
        break;
      case "medpult-insured-fullname-initial":
        await setRequestInsured();
        break;
    }
  };

  return (
    <>
      {Boolean(data.selectedItemsIds.length) && <Button title={"Выбрать" + `: ${data.selectedItemsIds.length}`} clickHandler={handleSelectClick} />}
    </>
  );
}
