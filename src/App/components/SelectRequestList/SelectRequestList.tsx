import React, { useEffect, useState } from "react";
import CustomList from "../../../UIKit/CustomList/CustomList";
import {
  ItemData,
  ListColumnData,
} from "../../../UIKit/CustomList/CustomListTypes";
import Scripts from "../../shared/utils/clientScripts";
import {
  SelectRequestFilters,
  selectRequestContext,
} from "../../stores/SelectRequestContext";
import { SelectRequestData } from "../../shared/types";
import utils, { redirectSPA } from "../../shared/utils/utils";
import { localStorageDraftKey } from "../../shared/utils/constants";
import ColumnWithValidation from "../ColumnWithValidation/ColumnWithValidation";

interface SelectRequestListProps {
  /** Ширина списка */
  width: number;
  /** Возможность выбора строки */
  isSelectable: boolean;
  /** Множественный выбор */
  isMultipleSelect: boolean;
}

/** Фильтры формы отбра задач */
export default function SelectRequestList({
  width,
  isMultipleSelect,
  isSelectable,
}: SelectRequestListProps) {
  const { data, setValue } = selectRequestContext.useContext();

  /** Установка обработчика нажатия на поиск */
  const setSearchHandler = (callback: () => void) => {
    console.log("setSearchHandler");
    setValue("onClickSearch", callback);
  };

  /** Обработчик нажатия на номер задачи */
  const onClickFullname = async (props: ItemData) => {
    const contractorId = props.info;
    if (!contractorId) return;

    // Запись текущего url в localStorage
    window.localStorage.setItem(
      "medpultPathBefore",
      window.location.pathname + window.location.search
    );
    localStorage.setItem("medpultContractorId", contractorId);
    localStorage.setItem(localStorageDraftKey, JSON.stringify(data));

    // Переход
    const link = Scripts.getContractorPageCode();
    redirectSPA(link);
  };

  // Вычислить количество отобранных элементов
  useEffect(() => {
    Scripts.getRequestsCount(data.filters).then((count) =>
      setValue("elementsCount", count)
    );
  }, []);

  /** Доступ к поиску */
  const searchAccess =
    Scripts.getSelectRequestAccessSettings().searchButton == 2;

  /** Присвоить выбранные элементы */
  const setSelectedItems = (ids: string[]) => {
    setValue("selectedItemsIds", ids);
  };

  /** Обработчик нажатия на номер полиса */
  const onClickNumberPolicy = async (props: ItemData) => {
    const policyId = props.info;
    if (!policyId) return;
    // Запись текущего url в localStorage
    window.localStorage.setItem(
      "medpultPathBefore",
      window.location.pathname + window.location.search
    );

    // Получение id договора по идентификатору полиса
    const treatyId = await Scripts.getTreatyIdByPolicyId(policyId);
    if (!treatyId) return;

    // Переход на договор
    const contractorId = await Scripts.getContracortId(policyId);
    if (!contractorId) return;
    localStorage.setItem("medpult-treaty-insured-id-draft", contractorId);
    localStorage.setItem("medpult-treaty-id", treatyId);
    const link = Scripts.getTreatyPageCode();

    redirectSPA(link);
  };

  /** Колонки списка */
  const columns = [
    new ListColumnData({
      name: "",
      code: "isIntegration",
      fr: 0.2,
      isIcon: true,
    }),
    new ListColumnData({
      name: data.filters.numberPolicy.fieldName,
      code: data.filters.numberPolicy.fieldCode,
      fr: 1,
      isSortable: searchAccess,
      isLink: true,
      onClick: onClickNumberPolicy,
    }),
    new ListColumnData({
      name: data.filters.number.fieldName,
      code: data.filters.number.fieldCode,
      fr: 1,
      isSortable: searchAccess,
      isLink: true,
      onClick: onClickFullname,
    }),
    new ListColumnData({
      name: data.filters.birthDate.fieldName,
      code: data.filters.birthDate.fieldCode,
      fr: 1,
      isSortable: searchAccess,
    }),
    new ListColumnData({
      name: data.filters.gender.fieldName,
      code: data.filters.gender.fieldCode,
      fr: 0.5,
      isSortable: searchAccess,
    }),
    new ListColumnData({
      name: data.filters.startDate.fieldName,
      code: data.filters.startDate.fieldCode,
      fr: 1,
      isSortable: searchAccess,
    }),
    new ListColumnData({
      name: data.filters.endDate.fieldName,
      code: data.filters.endDate.fieldCode,
      fr: 1,
      isSortable: searchAccess,
      getCustomColumComponent: ColumnWithValidation,
    }),
    new ListColumnData({
      name: data.filters.product.fieldName,
      code: data.filters.product.fieldCode,
      fr: 1,
      isSortable: searchAccess,
    }),
    new ListColumnData({
      name: data.filters.telephone.fieldName,
      code: data.filters.telephone.fieldCode,
      fr: 1,
      isSortable: searchAccess,
    }),
    new ListColumnData({
      name: data.filters.email.fieldName,
      code: data.filters.email.fieldCode,
      fr: 1,
      isSortable: searchAccess,
    }),
    new ListColumnData({
      name: data.filters.insurer.fieldName,
      code: data.filters.insurer.fieldCode,
      fr: 1,
      isSortable: searchAccess,
    }),
    new ListColumnData({
      name: data.filters.contract.fieldName,
      code: data.filters.contract.fieldCode,
      fr: 1,
      isSortable: searchAccess,
    }),
  ];

  return (
    <div className="select-request-list">
      <CustomList<SelectRequestFilters, SelectRequestData>
        isMultipleSelect={isMultipleSelect}
        setSearchHandler={setSearchHandler}
        searchData={data.filters}
        columnsSettings={columns}
        getDataHandler={Scripts.getAppeals}
        height="70vh"
        listWidth={width}
        isSelectable={isSelectable}
        setSelectedItems={setSelectedItems}
      />
    </div>
  );
}
