import {
  ItemData,
  ItemDataString,
} from "../../UIKit/CustomList/CustomListTypes";

export interface IInputData<DataType = any> {
  value: string;
  data?: DataType;
}

export class SelectRequestData {
  id?: ItemDataString;
  //Получен по интеграции
  isIntegration?: ItemData<boolean>;
  // Номер задачи - строчька
  number?: ItemData;
  numberPolicy?: ItemData;
  product?: ItemData;
  telephone?: ItemData;
  email?: ItemData;
  contract?: ItemData;
  insurer?: ItemData;
  // Дата создания - дата с по
  birthDate?: ItemDataString;
  startDate?: ItemDataString;
  endDate?: DataWithValidation;
  // Исполнитель - поиск по названию
  gender?: ItemData;

  constructor({
    id,
    isIntegration,
    number,
    telephone,
    email,
    birthDate,
    startDate,
    endDate,
    gender,
    numberPolicy,
    product,
    contract,
    insurer,
  }: SelectRequestData) {
    this.id = id;
    this.isIntegration = isIntegration;
    this.number = number;
    this.numberPolicy = numberPolicy;
    this.product = product;
    this.telephone = telephone;
    this.email = email;
    this.startDate = startDate;
    this.endDate = endDate;
    this.birthDate = birthDate;
    this.gender = gender;
    this.contract = contract;
    this.insurer = insurer;
  }
}

/** Данные со значением валидации */
export interface DataWithValidation {
  /** Значение */
  value: string;
  /** Значение валидно? */
  isValid: boolean;
  /** Идентификатор - если есть */
  id?: string;
}
