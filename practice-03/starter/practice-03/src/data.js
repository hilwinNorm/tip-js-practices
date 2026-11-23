// Общий контрольный набор из методички ПР2/ПР3.
export const demoTasks = [
  { id: 1, title: "Изучить функции", completed: true, priority: "medium" },
  { id: 4, title: "Подготовить модель задач", completed: false, priority: "high" },
  { id: 7, title: "Проверить методы массивов", completed: false, priority: "low" },
  { id: 10, title: "Оформить README", completed: true, priority: "medium" },
];

// Порядковый номер из ПР1 — 12. По правилу ПР2: ((12 - 1) % 8) + 1 = 4.
// Вариант 4: подготовка семинара. Первые три задачи выполнены изначально.
export const variantNumber = 4;
export const variantTasks = [
  { id: 11, title: "Определить тему и цель семинара", completed: true, priority: "high" },
  { id: 23, title: "Собрать источники и учебные материалы", completed: true, priority: "medium" },
  { id: 37, title: "Подготовить план выступления", completed: true, priority: "low" },
  { id: 41, title: "Создать презентацию", completed: false, priority: "high" },
  { id: 58, title: "Подготовить демонстрационные примеры", completed: false, priority: "medium" },
  { id: 64, title: "Проверить тайминг и отрепетировать выступление", completed: false, priority: "low" },
];
