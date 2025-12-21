import React, { useRef } from "react";
import {
  ConstructorElement,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrag, useDrop } from "react-dnd";
import type { XYCoord } from "dnd-core";
import burgerConstructorStyles from "./burger-constructor.module.css";
import type { BurgerConstructorProps } from "../section-constructor.type";

const FILLING_DND_TYPE = "constructor-filling";

interface ConstructorFillingDragItem {
  uid: string;
  index: number;
}

interface ConstructorFillingItemProps {
  index: number;
  item: BurgerConstructorProps["items"][number];
  moveItem: BurgerConstructorProps["moveItem"];
  removeItem: BurgerConstructorProps["removeItem"];
}

const ConstructorFillingItem: React.FC<ConstructorFillingItemProps> = ({
  index,
  item,
  moveItem,
  removeItem,
}) => {
  const ref = useRef<HTMLLIElement | null>(null);

  const [, drop] = useDrop<ConstructorFillingDragItem>(
    () => ({
      accept: FILLING_DND_TYPE,
      hover(dragItem, monitor) {
        if (!ref.current) {
          return;
        }

        const dragIndex = dragItem.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) {
          return;
        }

        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset() as XYCoord | null;

        if (!clientOffset) {
          return;
        }

        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }

        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }

        moveItem(dragIndex, hoverIndex);
        dragItem.index = hoverIndex;
      },
    }),
    [index, moveItem]
  );

  const [{ isDragging }, drag] = useDrag<
    ConstructorFillingDragItem,
    void,
    { isDragging: boolean }
  >({
    type: FILLING_DND_TYPE,
    item: () => ({
      uid: item.uid,
      index,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      className={burgerConstructorStyles.item}
      style={{ opacity: isDragging ? 0.3 : 1 }}
      data-cy={`constructor-filling-${item.ingredient._id}`}
    >
      <div className={burgerConstructorStyles.dragIconWrapper}>
        <DragIcon type="primary" />
      </div>
      <ConstructorElement
        text={item.ingredient.name}
        price={item.ingredient.price}
        thumbnail={item.ingredient.image_mobile}
        handleClose={() => removeItem(item.ingredient._id, item.uid)}
        extraClass={burgerConstructorStyles.constructorElementFilling}
      />
    </li>
  );
};

export default ConstructorFillingItem;
