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
import Button from "../../../UIKit/Button/Button";
import SelectButton from "./SelectButton/SelectButton";
import Loader from "../../../UIKit/Loader/Loader";
import Scripts from "../../shared/utils/clientScripts";
import {
  StringFilter,
  DateFilter,
  ListFilter,
} from "../../../UIKit/Filters/FiltersTypes";
import PopupsContainer from "../PopupsContainer/PopupsContainer";

/** Форма отбора обращений */
export default function SelectRequestForm() {
  const [data, setValue] = selectRequestContext.useState();
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  // Инициализация с черновиком
  const initializeWithDraft = (filtersData: SelectRequestData) => {
    try {
      const draftData: SelectRequestData | undefined = getDataFromDraft();
      if (draftData) {
        for(const key of Object.keys(draftData.filters)) {
          const resetBuffer = filtersData.filters[key].reset;
          filtersData.filters[key] = draftData.filters[key];
          filtersData.filters[key].reset = resetBuffer;
        }

        filtersData.filterStates = draftData.filterStates;
      }
    } catch (e) {
      throw new Error("Ошибка получения данных из черновика: " + e);
    }
  };

  const [isMultipleSelect, setIsMultipleSelect] = useState<boolean>(false);
  const [isSelectable, setIsSelectable] = useState<boolean>(false);

  // Инициализация с параметрами
  const initializeWithParams = (filtersData: SelectRequestData) => {
    // Поиск по ФИО
    const fieldId = new URLSearchParams(window.location.search).get("field_id");
    const fullname = new URLSearchParams(window.location.search).get(
      "fullname"
    );

    // Множественный выбор
    const selectMultiple = new URLSearchParams(window.location.search).get(
      "select_multiple"
    );
    if (selectMultiple != undefined) {
      setIsMultipleSelect(true);
    }

    if (fieldId != undefined) {
      setIsSelectable(true);
      if (fullname) {
        filtersData.filters.number.value = fullname;
        filtersData.filterStates.number = true;
      }
    }
  };

  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Подгрузка данных
  useEffect(() => {
    Scripts.OnInit().then(() => {
      // Данные формы из черновика
      let filtersData: SelectRequestData = new SelectRequestData();

      initializeWithDraft(filtersData);
      initializeWithParams(filtersData);

      // Установка фильтров
      setValue("filters", filtersData.filters);
      // Установка состояния оберток фильтров
      setValue("filterStates", filtersData.filterStates);

      setIsInitializing(false);
    });
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
    const element = document.querySelector(".select-request-form__content");
    const width = element?.getBoundingClientRect().width ?? 0;
    setListWidth(width);
  };

  const setContentWrapperRef = (element: HTMLDivElement) => {
    handleResizeWrapper();
  };

  const [messages, setMessages] = useState<string[]>([])

  function showError(message: string) {
    setMessages([...messages, message]);
  }

  return (
    <selectRequestContext.Provider value={{ data, setValue }}>
      <PopupsContainer messages={messages} setMessages={setMessages}/>
      <div className="select-request-form">
        {isInitializing && (
          <div className="select-request-form__loader">
            <Loader />
          </div>
        )}
        {!isInitializing && (
          <>
            <div className="select-request-form__header">
              <Header
                clickFilterHandler={toggleShowFilters}
                elementsCount={data.elementsCount}
                title="Форма отбора застрахованных"
              >
                <SelectButton showError={showError}/>
              </Header>
            </div>
            <div
              className="select-request-form__content"
              ref={setContentWrapperRef}
            >
              <div
                className={`select-request-form__filters${
                  !isShowFilters ? " select-request-form__filters_hidden" : ""
                }`}
              >
                <SelectRequestFiltersForm />
              </div>
              <div className="select-request-form__list">
                <div>
                  <SelectRequestList
                    isMultipleSelect={isMultipleSelect}
                    isSelectable={isSelectable}
                    width={listWidth}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </selectRequestContext.Provider>
  );
}
