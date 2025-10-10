import React from "react";
import Scripts from "../../../shared/utils/clientScripts";
import { selectRequestContext } from "../../../stores/SelectRequestContext";
import Button from "../../../../UIKit/Button/Button";
import { redirectSPA } from "../../../shared/utils/utils";

interface SelectButtonProps {
  showError(message: string): void;
  phoneContractor?: string;
}

/** Кнопка Выбрать */
export default function SelectButton({
  showError,
  phoneContractor,
}: SelectButtonProps) {
  const { data, setValue } = selectRequestContext.useContext();

  //Разделение составного Id
  function parseSelectedId(id: string): {
    contractorId: string;
    policyId?: string;
  } {
    const [contractorId, policyId] = id.split("_");
    return { contractorId, policyId };
  }

  // Установить контрагента в договор
  const setTreatyContractor = async () => {
    const selectedContractorId = data.selectedItemsIds[0];
    const { contractorId } = parseSelectedId(selectedContractorId);
    await Scripts.setContractInsured(contractorId);

    const insurance_treaty_page_code = Scripts.getTreatyPageCode();
    redirectSPA(insurance_treaty_page_code);
  };

  // Установить контрагента в фильтр
  const setFilterInsured = async () => {
    const selectedContractorId = data.selectedItemsIds[0];
    const { contractorId } = parseSelectedId(selectedContractorId);

    await Scripts.setFilterInsured(contractorId);
    const select_task_page_code = Scripts.getSelectTaskPageCode();
    redirectSPA(select_task_page_code);
  };

  function openRequest() {
    // Получение id обращения
    const url = new URL(window.location.href);
    const requestId = url.searchParams.get("request_id");

    const mode = new URLSearchParams(window.location.search).get("mode");
    const request_page_path = Scripts.getRequestPageCode();

    const redirectUrl = new URL(
      window.location.origin + "/" + request_page_path
    );
    if (mode) {
      redirectUrl.searchParams.set("mode", mode);
    } else {
      if (requestId) redirectUrl.searchParams.set("request_id", requestId);
    }

    redirectSPA(redirectUrl.toString());
  }

  // Установить застрахованного в обращение
  const setRequestInsured = async () => {
    const selectedContractorId = data.selectedItemsIds[0];
    const { contractorId } = parseSelectedId(selectedContractorId);

    const fieldId = new URLSearchParams(window.location.search).get("field_id");
    if (fieldId) await Scripts.assignInsured(fieldId, contractorId);

    openRequest();
  };

  /** Валидация списка застрахованных */
  async function validateInsuredList(
    selectedContractorsIds: string[]
  ): Promise<string | undefined> {
    // Вылидация по договорам
    const contractValidation = await Scripts.validateInsuredListContracts(
      selectedContractorsIds
    );
    if (!contractValidation)
      return "У выбранных контрагентов должен быть общий договор";

    return undefined;
  }
  // Установить список застрахованного в обращении
  const setRequestInsuredList = async () => {
    //const selectedContractorsIds = data.selectedItemsIds;
    const contractorIds = data.selectedItemsIds.map(
      (id) => parseSelectedId(id).contractorId
    );
    // Валидация по договорам
    const validationMessage = await validateInsuredList(contractorIds);
    if (validationMessage) {
      showError(validationMessage);
      return;
    }

    await Scripts.assignInsuredList(contractorIds);

    openRequest();
  };

  //Выбрать застрахованного для формы входящего звонка
  const getInsuredIncomigCall = async () => {
    const selectedInsuredrId = data.selectedItemsIds[0];
    const { contractorId, policyId } = parseSelectedId(selectedInsuredrId);
    // Получить телефон
    const phone = phoneContractor || undefined;

    const link = Scripts.getIcomingCallLink();
    const redirectUrl = new URL(window.location.origin + "/" + link);
    if (phone) redirectUrl.searchParams.set("phone", phone);
    if (contractorId) redirectUrl.searchParams.set("insuredId", contractorId);
    if (policyId) redirectUrl.searchParams.set("policyId", policyId);
    redirectSPA(redirectUrl.toString());
  };
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
      case "select-call-insured":
        await getInsuredIncomigCall();
        break;
    }
  };

  return (
    <>
      {Boolean(data.selectedItemsIds.length) && (
        <Button
          title={"Выбрать" + `: ${data.selectedItemsIds.length}`}
          clickHandler={handleSelectClick}
        />
      )}
    </>
  );
}
