const MS_IN_DAY = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const getDayLabel = (target: Date): string => {
  const today = new Date();
  const diff = startOfDay(today) - startOfDay(target);
  const diffDays = Math.floor(diff / MS_IN_DAY);

  if (diffDays === 0) {
    return "Сегодня";
  }

  if (diffDays === 1) {
    return "Вчера";
  }

  if (diffDays > 1) {
    return `${diffDays} дней назад`;
  }

  return "Сегодня";
};

export const formatOrderDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const time = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${getDayLabel(date)}, ${time}`;
};
