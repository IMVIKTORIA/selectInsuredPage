import React, { useEffect, useRef, useState } from "react";
import {
  selectRequestContext,
  SelectRequestData,
  SelectRequestFilters,
} from "../../stores/SelectRequestContext";
import Header from "../Header/Header";
import SelectRequestFiltersForm from "../SelectRequestFiltersForm/SelectRequestFiltersForm";
import SelectRequestList from "../SelectRequestList/SelectRequestList";
import { getDataFromDraft, redirectSPA } from "../../shared/utils/utils";
import { StringFilter } from "../../../UIKit/Filters/FiltersTypes";
import Button from "../../../UIKit/Button/Button";
import SelectButton from "./SelectButton/SelectButton";

/** Форма отбора обращений */
export default function SelectRequestForm() {
  const [data, setValue] = selectRequestContext.useState();
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  // Инициализация с черновиком
  const initializeWithDraft = (filtersData: SelectRequestData) => {
    try {
      const draftData: SelectRequestData | undefined = getDataFromDraft();
      if (draftData) {
        filtersData.filters = draftData.filters;
        filtersData.filterStates = draftData.filterStates;
      }
    } catch (e) {
      throw new Error("Ошибка получения данных из черновика: " + e);
    }
  }

  const [isMultipleSelect, setIsMultipleSelect] = useState<boolean>(false);
  const [isSelectable, setIsSelectable] = useState<boolean>(false);

  // Инициализация с параметрами
  const initializeWithParams = (filtersData: SelectRequestData) => {
    // Поиск по ФИО
    const fieldId = new URLSearchParams(window.location.search).get("field_id");
    const fullname = new URLSearchParams(window.location.search).get("fullname");

    // Множественный выбор
    const selectMultiple = new URLSearchParams(window.location.search).get("select_multiple");
    if (selectMultiple != undefined) {
      setIsMultipleSelect(true)
    }

    if (fieldId != undefined) {
      setIsSelectable(true);

      if (fullname) {
        filtersData.filters.number.value = fullname;
        filtersData.filterStates.number = true;
      }
    }
  }

  // Подгрузка данных
  React.useLayoutEffect(() => {
    // Данные формы из черновика
    let filtersData: SelectRequestData = new SelectRequestData();

    initializeWithDraft(filtersData)
    initializeWithParams(filtersData);

    // Установка фильтров
    setValue("filters", filtersData.filters);
    // Установка состояния оберток фильтров
    setValue("filterStates", filtersData.filterStates);
  }, []);

  const [isShowFilters, setIsShowFilters] = useState<boolean>(true);

  const toggleShowFilters = () => setIsShowFilters(!isShowFilters);

  // Ширина списка
  const [listWidth, setListWidth] = useState<number>(0);

  // Назначение обработчиков событий
  useEffect(() => {
    handleResizeWrapper();
    window.addEventListener("resize", handleResizeWrapper);

    return () => {
      window.removeEventListener("resize", handleResizeWrapper);
    };
  }, []);

  // Обработчик изменения размера
  const handleResizeWrapper = () => {
    const width = contentWrapperRef.current?.getBoundingClientRect().width ?? 0;
    setListWidth(width);
  };

  return (
    <selectRequestContext.Provider value={{ data, setValue }}>
      <div className="select-request-form">
        <div className="select-request-form__header">
          <Header
            clickFilterHandler={toggleShowFilters}
            elementsCount={data.elementsCount}
            title="Форма отбора застрахованных"
          >
            <SelectButton />
          </Header>
        </div>
        <div className="select-request-form__content" ref={contentWrapperRef}>
          <div className={`select-request-form__filters${!isShowFilters ? " select-request-form__filters_hidden" : ""}`}>
            <SelectRequestFiltersForm />
          </div>
          <div className="select-request-form__list">
            <div>
              <SelectRequestList isMultipleSelect={isMultipleSelect} isSelectable={isSelectable} width={listWidth} />
            </div>
          </div>
        </div>
      </div>
    </selectRequestContext.Provider>
  );
}
