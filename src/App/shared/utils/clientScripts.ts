import { FetchData, ItemData, ItemDataString, SortData } from "../../../UIKit/CustomList/CustomListTypes";
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
async function getAppeals(page: number, sortData?: SortData, searchData?: SelectRequestFilters): Promise<FetchData<SelectRequestData>> {
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
async function getRequestsCount(searchData?: SelectRequestFilters): Promise<number> {
  return 0;
}

/** Получение статусов обращений */
async function getGenders(): Promise<ObjectItem[]> {
  await randomDelay();

  const genders: ObjectItem[] = [new ObjectItem({ code: "test", value: "муж" }), new ObjectItem({ code: "test1", value: "жен" })];

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

// При переносе удалить
declare const Context: any;
/**
 * Из оригинальных скриптов
 */
/** Получение кода страницы Догвор */
function getTreatyPageCode(): string {
  return Context.data.insurance_treaty_page_code ?? "";
}

/** Получение кода страницы Отбор задач */
function getSelectTaskPageCode(): string {
  return Context.data.select_task_page_code ?? "";
}

/** Получение кода страницы Обращение */
function getRequestPageCode(): string {
  return Context.data.request_page_path ?? "";
}

/**
 * Установить застрахованного в фильтр (Из оригинальных скриптов)
 */
/** Данные поля формы */
interface IInputData {
  /** Строковое значение */
  value: string;
  /** Дополнительные данные */
  data?: any;
}

/** Значение поля ввода типа Категория */
class InputDataCategory implements IInputData {
  value: string;
  data: {
    code: string;
  };

  constructor(value?: string, code?: string) {
    this.value = value ?? "";
    this.data = { code: code ?? "" };
  }
}
/** Получение контагента по id */
async function getContractorById(id: string): Promise<InputDataCategory> {
  const contractor = await Context.fields.contractors.app
    .search()
    .where((f) => f.__id.eq(id))
    .first();
  return new InputDataCategory(contractor?.data.__name, contractor?.data.__id);
}

/** Установить застрахованного в фильтр */
async function setFilterInsured(contractorId: string) {
  const draftKey = "medpult-select-task-draft";
  const draftData = localStorage.getItem(draftKey);

  const contractorData = await getContractorById(contractorId);
  if (draftData) {
    const data = JSON.parse(draftData);

    data.filters.insured.value = {
      value: contractorData.value,
      code: contractorData.data.code,
    };

    localStorage.setItem(draftKey, JSON.stringify(data));
  }
}

/** Установить застрахованного в договор */
async function setContractInsured(contractorId: string) {
  const treatyDraftKey = "medpult-treaty-insured-data-draft";
  const draftData = localStorage.getItem(treatyDraftKey);

  if (draftData) {
    const data = JSON.parse(draftData);
    data.fullname = await getContractorById(contractorId);

    localStorage.setItem(treatyDraftKey, JSON.stringify(data));
  }
}

/** Запись Застрахованного в черновик
 * @param fieldId Идентификатор html элемента, в который запишется значение
 * @param contractorId Идентификатор контрагента
 */
async function assignInsured(fieldId: string, contractorId: string) {
  const draftData = localStorage.getItem("medpult-draft");
  if (!draftData) return;

  const draftObj = JSON.parse(draftData);
  const draftItem = {
    fieldId: fieldId,
    contractorId: contractorId,
  };

  if (draftObj == undefined) {
    localStorage.setItem("medpult-draft", JSON.stringify([draftItem]));
    return;
  }

  const itemIndex = draftObj.findIndex((d: any) => d.fieldId === fieldId);
  if (itemIndex === -1) {
    draftObj.push(draftItem);
  } else {
    draftObj[itemIndex] = draftItem;
  }

  localStorage.setItem("medpult-draft", JSON.stringify(draftObj));
}

/** Запись Застрахованного в черновик
 * @param contractorsIds Идентификаторы контрагентов
 */
async function assignInsuredList(contractorsIds: string[]) {
  // TODO: Просто присвоить в сам объект новых застрахованных
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

  getTreatyPageCode,
  getSelectTaskPageCode,
  getRequestPageCode,
  setFilterInsured,
  setContractInsured,
  assignInsured,
  assignInsuredList,
};
