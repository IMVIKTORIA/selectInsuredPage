import React, { useEffect, useState } from "react";
import FiltersWrapper from "../../../UIKit/Filters/FiltersWrapper/FiltersWrapper";
import FilterItemString from "../../../UIKit/Filters/FilterItems/FilterItemString/FilterItemString";
import { selectRequestContext } from "../../stores/SelectRequestContext";
import { IFilter, ObjectItem } from "../../../UIKit/Filters/FiltersTypes";
import FilterItemDates from "../../../UIKit/Filters/FilterItems/FilterItemDates/FilterItemDates";
import FilterItemSearch from "../../../UIKit/Filters/FilterItems/FilterItemSearch/FilterItemSearch";
import FilterItemCategory from "../../../UIKit/Filters/FilterItems/FilterItemCategory/FilterItemCategory";
import Scripts from "../../shared/utils/clientScripts";
import { saveState } from "../../shared/utils/utils";
import { applyPhoneMask } from "../../shared/utils/masks";

interface SelectRequestFiltersProps {}

/** Фильтры формы отбора обращений */
export default function SelectRequestFiltersForm({}: SelectRequestFiltersProps) {
  const { data, setValue } = selectRequestContext.useContext();
  const filters = data.filters;

  /** Статусы */
  const [genders, setGenders] = useState<ObjectItem[]>([]);

  /** Получение вариантов категорий */
  React.useLayoutEffect(() => {
    Scripts.getGenders().then((items) => setGenders(items));
  }, []);

  /** Изменение значения конкретного фильтра */
  const changeFilterValue = (key: string, value: IFilter) => {
    const currentFilters = filters;
    currentFilters[key] = value;
    setValue("filters", currentFilters);
  };

  const changeValueConstructor = (key: string) => {
    return (value: IFilter) => changeFilterValue(key, value);
  };

  /** Сброс фильтров */
  const resetFilters = () => {
    data.filters.reset();
    setValue("filters", data.filters);
  };

  /** Обработчик нажатия на кнопку поиска */
  const searchHandler = async () => {
    // Количество отобранных элементов
    const elementsCount = await Scripts.getRequestsCount(data.filters);
    setValue("elementsCount", elementsCount);

    // Поиск
    data.onClickSearch();
  };

  // Установка состояния обертки
  const setIsOpenFactory = (code: string) => {
    return (isOpen: boolean) => {
      const filterStates = data.filterStates;

      filterStates[code] = isOpen;

      setValue("filterStates", filterStates);
    };
  };

  /** Сохранение состояния формы */
  const saveStateHandler = () => {
    saveState(data);
  };

  /** Ссылка на форму отбора обращения */
  const selectRequestHref = Scripts.getSelectRequestLink();
  /** Ссылка на форму отбора застрахованного */
  const selectInsuredHref = Scripts.getSelectInsuredLink();

  return (
    <FiltersWrapper
      searchHandler={searchHandler}
      resetHandler={resetFilters}
      isSearchButtonDisabled={
        Scripts.getSelectRequestAccessSettings().searchButton < 2
      }
    >
      <FilterItemString
        setIsOpenInit={setIsOpenFactory(data.filters.number.fieldCode)}
        isOpenInit={data.filterStates.number}
        title={data.filters.number.fieldName}
        filterValue={data.filters.number}
        setFilterValue={changeValueConstructor(data.filters.number.fieldCode)}
      />
      <FilterItemDates
        setIsOpenInit={setIsOpenFactory(data.filters.birthDate.fieldCode)}
        isOpenInit={data.filterStates.birthDate}
        title={data.filters.birthDate.fieldName}
        filterValue={data.filters.birthDate}
        setFilterValue={changeValueConstructor(
          data.filters.birthDate.fieldCode
        )}
      />
      <FilterItemCategory
        setIsOpenInit={setIsOpenFactory(data.filters.gender.fieldCode)}
        isOpenInit={data.filterStates.gender}
        title={data.filters.gender.fieldName}
        filterValue={data.filters.gender}
        variants={genders}
        setFilterValue={changeValueConstructor(data.filters.gender.fieldCode)}
      />
      <FilterItemString
        setIsOpenInit={setIsOpenFactory(data.filters.numberPolicy.fieldCode)}
        isOpenInit={data.filterStates.numberPolicy}
        title={data.filters.numberPolicy.fieldName}
        filterValue={data.filters.numberPolicy}
        setFilterValue={changeValueConstructor(
          data.filters.numberPolicy.fieldCode
        )}
      />

      <FilterItemString
        setIsOpenInit={setIsOpenFactory(data.filters.product.fieldCode)}
        isOpenInit={data.filterStates.product}
        title={data.filters.product.fieldName}
        filterValue={data.filters.product}
        setFilterValue={changeValueConstructor(data.filters.product.fieldCode)}
      />
      <FilterItemString
        setIsOpenInit={setIsOpenFactory(data.filters.telephone.fieldCode)}
        isOpenInit={data.filterStates.telephone}
        title={data.filters.telephone.fieldName}
        filterValue={data.filters.telephone}
        setFilterValue={changeValueConstructor(
          data.filters.telephone.fieldCode
        )}
        maskFunction={applyPhoneMask}
        placeholder={"+7 000 000 00 00"}
      />
      <FilterItemString
        setIsOpenInit={setIsOpenFactory(data.filters.email.fieldCode)}
        isOpenInit={data.filterStates.email}
        title={data.filters.email.fieldName}
        filterValue={data.filters.email}
        setFilterValue={changeValueConstructor(data.filters.email.fieldCode)}
      />
      <FilterItemString
        setIsOpenInit={setIsOpenFactory(data.filters.insurer.fieldCode)}
        isOpenInit={data.filterStates.insurer}
        title={data.filters.insurer.fieldName}
        filterValue={data.filters.insurer}
        setFilterValue={changeValueConstructor(data.filters.insurer.fieldCode)}
      />
      <FilterItemString
        setIsOpenInit={setIsOpenFactory(data.filters.contract.fieldCode)}
        isOpenInit={data.filterStates.contract}
        title={data.filters.contract.fieldName}
        filterValue={data.filters.contract}
        setFilterValue={changeValueConstructor(data.filters.contract.fieldCode)}
      />
      {/* <FilterItemString setIsOpenInit={setIsOpenFactory(data.filters.request.fieldCode)} isOpenInit={data.filterStates.request} title={data.filters.request.fieldName} filterValue={data.filters.request} setFilterValue={changeValueConstructor(data.filters.request.fieldCode)} /> */}
      {/* <FilterItemString isOpenInit={data.filterStates.insured} title={data.filters.insured.fieldName} filterValue={data.filters.insured} setFilterValue={changeValueConstructor(data.filters.insured.fieldCode)} /> */}
    </FiltersWrapper>
  );
}
