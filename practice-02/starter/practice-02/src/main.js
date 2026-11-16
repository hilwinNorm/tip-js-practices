import { demoTasks, variantNumber, variantTasks } from "./data.js";
import {
  getPendingTasks,
  getTaskTitles,
  getTaskStats,
  addTask,
  setTaskCompleted,
  renameTask,
  removeTask,
} from "./task-service.js";

function showStats(tasks) {
  const { total, completed, pending, progress } = getTaskStats(tasks);
  console.log(`Всего: ${total}; выполнено: ${completed}; осталось: ${pending}`);
  if (total === 0) {
    console.log("Задач пока нет");
  } else {
    console.log(`Прогресс: ${progress.toFixed(1)}%`);
  }
}

function showTasks(tasks) {
  console.table(tasks);
}

function applyOperation(label, currentTasks, operation) {
  console.log(`\n${label}`);
  const result = operation(currentTasks);

  if (!result.ok) {
    console.error(`Ожидаемый отказ: ${result.error}`);
    console.log("Список после отказа не изменился:", currentTasks);
    return currentTasks;
  }

  showTasks(result.tasks);
  showStats(result.tasks);
  return result.tasks;
}

console.log("========== ОБЩИЙ НАБОР ==========");
let current = demoTasks;

console.log("Исходные задачи:");
showTasks(current);
console.log("Названия:", getTaskTitles(current));
console.log("Невыполненные задачи:");
showTasks(getPendingTasks(current));
showStats(current);

current = applyOperation("1. Добавление задачи id = 20", current,
  (tasks) => addTask(tasks, 20, "Добавить проверку", "high"));
current = applyOperation("2. Выполнение задачи id = 4", current,
  (tasks) => setTaskCompleted(tasks, 4, true));
current = applyOperation("3. Переименование задачи id = 10", current,
  (tasks) => renameTask(tasks, 10, "Подготовить инструкцию запуска"));
current = applyOperation("4. Удаление задачи id = 7", current,
  (tasks) => removeTask(tasks, 7));

console.log("5. Проверка отказа: повторное добавление id = 20");
const beforeDuplicate = current;
const duplicateResult = addTask(current, 20, "Дубликат", "low");
if (!duplicateResult.ok) {
  console.error(`Ожидаемая ошибка: ${duplicateResult.error}`);
}
console.log("Текущий массив сохранён:", current === beforeDuplicate);
console.log("Итоговый общий список:");
showTasks(current);
showStats(current);
console.log("Исходный demoTasks не изменился:");
showTasks(demoTasks);

console.log("\n========== ИНДИВИДУАЛЬНЫЙ НАБОР ==========");
console.log("Номер варианта:", variantNumber);
let currentVariantTasks = variantTasks;
const originalVariantSnapshot = variantTasks.map((task) => ({ ...task }));

console.log("Исходные индивидуальные задачи:");
showTasks(currentVariantTasks);
console.log("Названия:", getTaskTitles(currentVariantTasks));
console.log("Невыполненные задачи:");
showTasks(getPendingTasks(currentVariantTasks));
showStats(currentVariantTasks);

currentVariantTasks = applyOperation(
  '1. Добавление задачи id = 80',
  currentVariantTasks,
  (tasks) => addTask(tasks, 80, "Подготовить конфигурацию релиза", "high"),
);

currentVariantTasks = applyOperation(
  "2. Установка completed = true для id = 11",
  currentVariantTasks,
  (tasks) => setTaskCompleted(tasks, 11, true),
);

currentVariantTasks = applyOperation(
  "3. Переименование задачи id = 23",
  currentVariantTasks,
  (tasks) => renameTask(tasks, 23, "Настроить и проверить линтер"),
);

currentVariantTasks = applyOperation(
  "4. Удаление задачи id = 37",
  currentVariantTasks,
  (tasks) => removeTask(tasks, 37),
);

console.log("5. Проверка отказа: повторное добавление id = 80");
const beforeVariantDuplicate = currentVariantTasks;
const variantDuplicateResult = addTask(
  currentVariantTasks,
  80,
  "Повторная задача",
  "medium",
);
if (!variantDuplicateResult.ok) {
  console.error(`Ожидаемая ошибка: ${variantDuplicateResult.error}`);
}
console.log("Список после отказа не изменился:", currentVariantTasks === beforeVariantDuplicate);

console.log("Итоговые индивидуальные задачи:");
showTasks(currentVariantTasks);
showStats(currentVariantTasks);
console.log(
  "Исходный variantTasks не изменился:",
  JSON.stringify(variantTasks) === JSON.stringify(originalVariantSnapshot),
);
console.log("Исходный variantTasks:");
showTasks(variantTasks);
