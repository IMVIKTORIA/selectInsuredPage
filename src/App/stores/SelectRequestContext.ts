import React from "react";
import { initGlobalContext } from "./GlobalContext";
import {
  AppFilter,
  DateFilter,
  IFiltersData,
  ListFilter,
  StringFilter,
} from "../../UIKit/Filters/FiltersTypes";

/** Данные формы отбора обращения */
export class SelectRequestData {
  /** Фильтры поиска */
  filters: SelectRequestFilters;
  /** Состояние оберток фильтров */
  filterStates: SelectRequestFiltersStates;
  /** Обработчик нажатия на кнопку поиск */
  onClickSearch: () => Promise<void>;
  /** Количество отобранных элементов */
  elementsCount: number;

  constructor() {
    this.filters = new SelectRequestFilters();
    this.filterStates = new SelectRequestFiltersStates();
    this.onClickSearch = async () => {
      alert("test");
    };
    this.elementsCount = 0;
  }
}

/** Состояние оберток фильтров */
export class SelectRequestFiltersStates {
  /** Номер задачи */
  number: boolean;
  /** Дата рождения */
  birthDate: boolean;
  /** Дата начала */
  startDate: boolean;
  /** Дата окончания */
  endDate: boolean;
  /** Пол */
  gender: boolean;
  /** Номер полиса */
  numberPolicy: boolean;
  /** Продукт */
  product: boolean;
  /** Телефон */
  telephone: boolean;
  /** Email */
  email: boolean;

  constructor() {
    this.number = false;
    this.telephone = false;
    this.email = false;
    this.gender = false;
    this.numberPolicy = false;
    this.product = false;
    this.birthDate = false;
    this.startDate = false;
    this.endDate = false;
  }
}

/** Значения фильтров формы отбора задач */
export class SelectRequestFilters implements IFiltersData {
  /** Полное наименование */
  number: StringFilter;
  /** Дата рождения */
  birthDate: DateFilter;
  /** Дата начала */
  startDate: DateFilter;
  /** Дата окончания */
  endDate: DateFilter;
  /** Пол */
  gender: ListFilter;
  /** Телефон */
  telephone: StringFilter;
  /** Email */
  email: StringFilter;
  /** Номер полиса */
  numberPolicy: StringFilter;
  /** Продукт */
  product: StringFilter;

  constructor() {
    this.number = new StringFilter("number", "полное наименование");
    this.birthDate = new DateFilter("birthDate", "дата рождения");
    this.startDate = new DateFilter("startDate", "дата начала");
    this.endDate = new DateFilter("endDate", "дата окончания");
    this.gender = new ListFilter("gender", "пол");
    this.numberPolicy = new StringFilter("numberPolicy", "номер полиса");
    this.product = new StringFilter("product", "продукт");
    this.telephone = new StringFilter("telephone", "телефон");
    this.email = new StringFilter("email", "email");
  }

  reset() {
    this.number.reset();
    this.birthDate.reset();
    this.startDate.reset();
    this.endDate.reset();
    this.gender.reset();
    this.numberPolicy.reset();
    this.product.reset();
    this.telephone.reset();
    this.email.reset();
  }
}

export const selectRequestContext = initGlobalContext<SelectRequestData>(
  new SelectRequestData()
);
