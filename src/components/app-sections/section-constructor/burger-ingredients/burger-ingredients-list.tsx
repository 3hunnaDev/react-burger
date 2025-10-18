import React, { useEffect, useMemo, useRef, useCallback } from "react";
import { InView } from "react-intersection-observer";
import ingredientsListStyles from "./burger-ingredients.module.css";
import BurgerIngredientsItem from "./burger-ingredients-item";
import type {
  BurgerIngredientsListProps,
  IngredientType,
} from "../section-constructor.type";

const SCROLL_TIMEOUT_MS = 350;

const BurgerIngredientsList: React.FC<BurgerIngredientsListProps> = React.memo(
  ({
    groupedData,
    activeTab,
    getCounterById,
    onIngredientSelect,
    onGroupInView,
    shouldScrollToActive,
    onScrollAligned,
    labelToType,
    typeToLabel,
  }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const isProgrammaticScrollRef = useRef(false);
    const timerRef = useRef<number | null>(null);
    const visibleSectionsRef = useRef<Set<IngredientType>>(new Set());
    const lastNotifiedSectionRef = useRef<IngredientType | null>(null);

    const notifyFirstVisibleSection = useCallback(() => {
      const nextType = groupedData.find(({ type }) =>
        visibleSectionsRef.current.has(type)
      )?.type;

      if (!nextType) {
        lastNotifiedSectionRef.current = null;
        return;
      }

      if (lastNotifiedSectionRef.current === nextType) {
        return;
      }

      const label = typeToLabel[nextType];
      if (!label) {
        return;
      }

      lastNotifiedSectionRef.current = nextType;
      onGroupInView(label);
    }, [groupedData, onGroupInView, typeToLabel]);

    useEffect(() => {
      lastNotifiedSectionRef.current = labelToType[activeTab] ?? null;
    }, [activeTab, labelToType]);

    useEffect(() => {
      return () => {
        if (timerRef.current !== null) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }, []);

    useEffect(() => {
      if (!shouldScrollToActive) return;

      const container = containerRef.current;
      if (!container) {
        onScrollAligned();
        return;
      }

      const activeType = labelToType[activeTab];
      const target = container.querySelector<HTMLElement>(
        `[data-type="${activeType}"]`
      );

      if (!target) {
        onScrollAligned();
        return;
      }

      isProgrammaticScrollRef.current = true;

      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });

        if (timerRef.current !== null) {
          window.clearTimeout(timerRef.current);
        }
        timerRef.current = window.setTimeout(() => {
          isProgrammaticScrollRef.current = false;
          onScrollAligned();
          timerRef.current = null;
        }, SCROLL_TIMEOUT_MS);
      });
    }, [activeTab, labelToType, onScrollAligned, shouldScrollToActive]);

    const handleInViewChange = useCallback(
      (inView: boolean, entry: IntersectionObserverEntry) => {
        const el = entry.target as HTMLElement;
        const sectionType = el.getAttribute("data-type") as IngredientType;

        if (!sectionType) {
          return;
        }

        if (inView) {
          visibleSectionsRef.current.add(sectionType);
        } else {
          visibleSectionsRef.current.delete(sectionType);
        }

        if (isProgrammaticScrollRef.current) {
          return;
        }

        notifyFirstVisibleSection();
      },
      [notifyFirstVisibleSection]
    );

    const headingIds = useMemo(() => {
      return new Map<IngredientType, string>(
        groupedData.map(({ type, name }) => [type, `group-heading-${type}`])
      );
    }, [groupedData]);

    return (
      <div ref={containerRef} className={ingredientsListStyles.list}>
        {groupedData.map(({ name, type, items }) => (
          <InView
            as="section"
            key={type}
            root={containerRef.current ?? undefined}
            threshold={0}
            onChange={handleInViewChange}
            data-type={type}
            className={ingredientsListStyles.listGroup}
            aria-labelledby={headingIds.get(type)}
            role="region"
          >
            <h2
              id={headingIds.get(type)}
              className={`${ingredientsListStyles.groupTitle} text text_type_main-medium`}
            >
              {name}
            </h2>

            <ul className={ingredientsListStyles.groupItems}>
              {items.map((ingredient) => (
                <BurgerIngredientsItem
                  key={`${ingredient._id}-${type}`}
                  ingredient={ingredient}
                  counter={getCounterById(ingredient._id)}
                  onSelect={onIngredientSelect}
                />
              ))}
            </ul>
          </InView>
        ))}
      </div>
    );
  }
);

BurgerIngredientsList.displayName = "BurgerIngredientsList";

export default BurgerIngredientsList;
