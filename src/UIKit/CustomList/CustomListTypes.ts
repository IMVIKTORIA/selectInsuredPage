/** Атрибуты функции получения разметки деталей строки списка */
export interface getDetailsLayoutAttributes {
  /** Сокращенные данные строки */
  rowData: any;
  /** Обработчик нажатия на строку */
  onClickRowHandler: any;
  /** Перезагрузка списка */
  reloadData: () => void;
}

/** Данные сортировки */
export class SortData {
  /** Код колонки списка */
  code: string;
  /** Флажок по возрастанию */
  isAscending: boolean;

  constructor({ code, isAscending }: { code?: string; isAscending?: boolean }) {
    this.code = code ?? "";
    this.isAscending = isAscending ?? true;
  }
}

/** Данные столбца таблицы */
export class ListColumnData {
  /** Коэффициент соотношения ширины столбца */
  fr: number;
  /** Можно ли по этому столбцу сортировать */
  isSortable: boolean;
  /** Хранит ли по столбец ссылки */
  isLink: boolean;
  /** Название столбца */
  name: string;
  /** Код значения */
  code: string;
  /** Обработчик нажатия */
  onClick?: (props: ItemData) => any;
  /** Разворачиваемый ли столбец */
  isRollable: boolean;
  /** Хранит ли по столбец иконку */
  isIcon?: boolean;
  /** Кастомный компонент колонки */
  getCustomColumComponent?: (props: any) => JSX.Element;

  constructor({
    name,
    code,
    fr,
    isSortable,
    isLink,
    onClick,
    isRollable,
    isIcon,
    getCustomColumComponent,
  }: {
    name: string;
    code: string;
    fr?: number;
    isSortable?: boolean;
    isLink?: boolean;
    onClick?: (props: any) => any;
    isRollable?: boolean;
    isIcon?: boolean;
    getCustomColumComponent?: (props: any) => JSX.Element;
  }) {
    this.fr = fr ?? 1;
    this.isSortable = isSortable ?? false;
    this.isLink = isLink ?? false;
    this.isIcon = isIcon ?? false;

    if (onClick) this.onClick = onClick;
    if (getCustomColumComponent)
      this.getCustomColumComponent = getCustomColumComponent;

    this.name = name;
    this.code = code;
    this.isRollable = isRollable ?? false;
  }
}

/** Значение колонки */
export class ItemData<InfoType = string> {
  /** Значение */
  value: string;
  /** Дополнительная информация */
  info?: InfoType;
  /** Ссылка нужна? */
  isLink?: boolean;

  constructor({
    value,
    info,
    isLink = false,
  }: {
    value?: string;
    info?: InfoType;
    isLink?: boolean;
  }) {
    this.value = value ?? "";
    if (info) this.info = info;
    this.isLink = isLink;
  }
}

/** Строковое значение колонки */
export class ItemDataString extends ItemData<undefined> {
  value: string;

  constructor(value: string) {
    super({ value: value });
  }
}

/** Значение элемента списка */
export interface FetchItem<DataType = any> {
  /** Идентификатор элемента */
  id: string;
  /** Данные элемента */
  data: DataType;
}

/** Ответ запроса данных с сервера */
export interface FetchData<DataType> {
  /** Данные */
  items: FetchItem<DataType>[];
  /** Доступны ли еще данные для подгрузки? */
  hasMore: boolean;
}
