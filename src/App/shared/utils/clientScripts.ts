import {
  FetchData,
  ItemData,
  ItemDataString,
  SortData,
} from "../../../UIKit/CustomList/CustomListTypes";
import { ObjectItem } from "../../../UIKit/Filters/FiltersTypes";
import { FetchInputData } from "../../../UIKit/shared/types/types";
import { SelectRequestFilters } from "../../stores/SelectRequestContext";
import { SelectRequestData } from "../types";

/** Заглушка ожидания ответа сервера */
function randomDelay() {
  const delay = Math.random() * 1000;
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

/** Получение списка обращений */
async function getAppeals(
  page: number,
  sortData?: SortData,
  searchData?: SelectRequestFilters
): Promise<FetchData<SelectRequestData>> {
  await randomDelay();

  console.log({
    page,
    sortData,
    searchData,
  });

  const mockData: SelectRequestData = {
    number: new ItemData({ value: "Иванов Иван Иванович", info: "test" }),
    birthDate: new ItemDataString("06.12.2023"),
    startDate: new ItemDataString("01.01.2023"),
    endDate: new ItemDataString("02.01.2023"),
    numberPolicy: new ItemData({ value: "12345", info: "test" }),
    product: new ItemData({ value: "пример", info: "test" }),
    telephone: new ItemData({ value: "+7 912 345 67 89", info: "test" }),
    email: new ItemData({ value: "test@test.com", info: "test" }),
    gender: new ItemData({ value: "муж", info: "test" }),
  };
  return {
    items: Array(5)
      .fill(0)
      .map((data, index) => {
        return {
          id: String(index),
          data: new SelectRequestData(mockData),
        };
      }),
    hasMore: true,
  };
}

/** Получение количества задач по фильтрам */
async function getRequestsCount(
  searchData?: SelectRequestFilters
): Promise<number> {
  return 0;
}

/** Получение статусов обращений */
async function getGenders(): Promise<ObjectItem[]> {
  await randomDelay();

  const genders: ObjectItem[] = [
    new ObjectItem({ code: "test", value: "муж" }),
    new ObjectItem({ code: "test1", value: "жен" }),
  ];

  return genders;
}

/** Получение id обращения по id задачи */
async function getRequestIdByTaskId(taskId: string): Promise<string> {
  return "test";
}

/** Получение ссылки для перехода на страницу обращения */
async function getRequestLink(): Promise<string> {
  return "#test";
}

/** Уровни доступа */
enum AccessLevel {
  /** Нет доступа, даже не видим */
  noAccess = 0,
  /** Только видим, не можем писать или менять */
  readOnly = 1,
  /** Видим, читаем и можем писать или нажимать на кнопку/ссылку */
  writeRead = 2,
}

/** Настройки доступа формы отбора задач */
interface ISelectTaskAccessSettings {
  searchButton: AccessLevel;
  appendResponsible: AccessLevel;
}

/** Получить настройки доступа формы отбора задач */
function getSelectRequestAccessSettings(): ISelectTaskAccessSettings {
  return {
    searchButton: 2,
    appendResponsible: 2,
  };
}

/** Получить ссылку формы отбора обращений */
function getSelectRequestLink(): string {
  return "#selectRequestTest";
}

/** Получить ссылку формы отбора застрахованных */
function getSelectInsuredLink(): string {
  return "#selectRequestTest";
}

export default {
  getAppeals,
  getRequestsCount,
  getGenders,
  getRequestIdByTaskId,
  getRequestLink,
  getSelectRequestAccessSettings,
  getSelectRequestLink,
  getSelectInsuredLink,
};
