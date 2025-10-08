import React, { useEffect, useRef, useState } from "react";
import { ItemData, ListColumnData } from "../CustomListTypes";
import icons from "../../../App/shared/icons";

interface ListColumnProps extends ListColumnData {
  data: ItemData<any>;
  listRef?: React.RefObject<HTMLDivElement>;
}

/** Столбец одной строки таблицы */
function CustomListRowColumn(props: ListColumnProps) {
  const {
    fr,
    data,
    isLink: isLinkProp,
    onClick,
    listRef,
    isRollable,
    code,
    isIcon,
  } = props;

  const isLink = code === "numberPolicy" ? data?.isLink === true : isLinkProp;

  const onClickColumn = isLink && onClick ? () => onClick(data) : () => {};

  const wrapperRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  const [isShowMore, setIsShowMore] = useState<boolean>(false);

  const showMore = () => {
    if (!isRollable) return;

    setIsShowMore(true);

    if (!spanRef.current) return;
    if (!wrapperRef.current) return;
    if (!listRef?.current) return;

    spanRef.current.style.width =
      wrapperRef.current.getBoundingClientRect().width + "px";
  };

  useEffect(() => {
    if (!isShowMore) return;
    if (!spanRef.current) return;
    if (!wrapperRef.current) return;
    if (!listRef?.current) return;

    const moreWrapperBottom = spanRef.current.getBoundingClientRect().bottom;
    const rowBottom =
      spanRef.current
        .closest(".custom-list-row-column")
        ?.getBoundingClientRect().bottom ?? 0;
    const listWrapperBottom = listRef.current.getBoundingClientRect().bottom;

    if (moreWrapperBottom > listWrapperBottom) {
      const test = rowBottom - listWrapperBottom;
      spanRef.current.style.marginTop =
        52 - spanRef.current.getBoundingClientRect().height - test + "px";
    }
  }, [isShowMore]);

  const hideMore = () => {
    setIsShowMore(false);

    if (!spanRef.current) return;
    spanRef.current.style.removeProperty("margin-top");
  };

  const iconToShow =
    code === "isIntegration" && data?.info === true
      ? icons.IntegrationButton
      : null;
  return (
    <div
      className={
        isLink
          ? "custom-list-row-column custom-list-row-column__link"
          : "custom-list-row-column"
      }
      style={{ flex: fr }}
      ref={wrapperRef}
    >
      <span
        onMouseEnter={showMore}
        onMouseOut={hideMore}
        ref={spanRef}
        title={isRollable ? "" : data.value}
        onClick={onClickColumn}
        className={
          isShowMore
            ? "custom-list-row-column__more"
            : "custom-list-row-column__less"
        }
      >
        {/* Отображение колонки с изображением */}
        {isIcon && iconToShow}
        {/* Отображение кастомной колонки */}
        {props.getCustomColumComponent && props.getCustomColumComponent(data)}
        {/* Отображение стандартной колонки */}
        {!isIcon && !props.getCustomColumComponent && data.value}
      </span>
    </div>
  );
}

export default CustomListRowColumn;
