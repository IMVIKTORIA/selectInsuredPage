import React, { } from "react";
import Scripts from "../../../shared/utils/clientScripts";
import { selectRequestContext, } from "../../../stores/SelectRequestContext";
import Button from "../../../../UIKit/Button/Button";
import { redirectSPA } from "../../../shared/utils/utils";

interface SelectButtonProps {
  showError(message: string): void
}

/** Кнопка Выбрать */
export default function SelectButton({showError}: SelectButtonProps) {
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

  function openRequest() {
    // Получение id обращения
    const url = new URL(window.location.href);
    const requestId = url.searchParams.get("request_id");
    
    const mode = new URLSearchParams(window.location.search).get("mode");
    const request_page_path = Scripts.getRequestPageCode();

    const redirectUrl = new URL(window.location.origin + "/" + request_page_path);
    if (mode) {
      redirectUrl.searchParams.set("mode", mode)
    } else {
      if(requestId) redirectUrl.searchParams.set("request_id", requestId)
    }
    
    redirectSPA(redirectUrl.toString())
  }

  // Установить застрахованного в обращение
  const setRequestInsured = async () => {
    const selectedContractorId = data.selectedItemsIds[0];

    const fieldId = new URLSearchParams(window.location.search).get("field_id");
    if (fieldId) await Scripts.assignInsured(fieldId, selectedContractorId);

    openRequest()
  } 

  /** Валидация списка застрахованных */
  async function validateInsuredList(selectedContractorsIds: string[]): Promise<string | undefined> {
    // Вылидация по договорам
    const contractValidation = await Scripts.validateInsuredListContracts(selectedContractorsIds);
    if(!contractValidation)  return "У выбранных контрагентов должен быть общий договор"

    return undefined
  }
  // Установить список застрахованного в обращении
  const setRequestInsuredList = async () => {
    const selectedContractorsIds = data.selectedItemsIds;

    // Валидация по договорам
    const validationMessage = await validateInsuredList(selectedContractorsIds);
    if(validationMessage) {
      showError(validationMessage)
      return;
    }

    await Scripts.assignInsuredList(selectedContractorsIds);

    openRequest()
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
