import {
  ItemData,
  ItemDataString,
} from "../../UIKit/CustomList/CustomListTypes";

export interface IInputData<DataType = any> {
  value: string;
  data?: DataType;
}

export class SelectRequestData {
  // Номер задачи - строчька
  number?: ItemData;
  numberPolicy?: ItemData;
  product?: ItemData;
  telephone?: ItemData;
  email?: ItemData;
  // Дата создания - дата с по
  birthDate?: ItemDataString;
  startDate?: ItemDataString;
  endDate?: ItemDataString;
  // Исполнитель - поиск по названию
  gender?: ItemData;

  constructor({
    number,
    telephone,
    email,
    birthDate,
    startDate,
    endDate,
    gender,
    numberPolicy,
    product,
  }: SelectRequestData) {
    this.number = number;
    this.numberPolicy = numberPolicy;
    this.product = product;
    this.telephone = telephone;
    this.email = email;
    this.startDate = startDate;
    this.endDate = endDate;
    this.birthDate = birthDate;
    this.gender = gender;
  }
}
