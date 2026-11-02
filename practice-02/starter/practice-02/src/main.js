import { demoTasks, variantNumber, variantTasks } from "./data.js";
import {
  createTask,
  findTaskById,
  getPendingTasks,
  getTaskTitles,
  getTaskStats,
  addTask,
  setTaskCompleted,
  renameTask,
  removeTask,
} from "./task-service.js";

console.log("ПР2. Заготовка демонстрационного сценария");
console.log("Количество задач в общем наборе:", demoTasks.length);
console.log("Номер варианта:", variantNumber);
console.log("Количество задач в индивидуальном наборе:", variantTasks.length);

// TODO: после реализации функций выполнить общий сценарий из раздела 6.5.
// Текущее состояние хранится в локальной переменной:
// let currentTasks = demoTasks;
// После успешной операции currentTasks получает result.tasks.
// При result.ok === false необходимо вывести ошибку, не заменяя состояние.
// Сводка выводится после каждого этапа; вычисления выполняются в task-service.js.

// TODO: выполнить отдельный сценарий для variantTasks по разделу 7.
// Общий набор demoTasks не заменяется данными варианта.

// TODO: показать хотя бы одну обработанную ошибку и неизменность исходных данных.
// Для удобного вывода объектов допустимо использовать console.table().

function showStats(tasks) {
  const { total, completed, pending, progress } = getTaskStats(tasks);
  console.log(`Всего: ${total}; выполнено: ${completed}; осталось: ${pending}`);
  if (total === 0) {
    console.log("Задач пока нет");
  } else {
    console.log(`Прогресс: ${progress.toFixed(1)}%`);
  }
}

let current = demoTasks;

console.log("Исходные задачи:", current);
console.log("Названия:", getTaskTitles(current));
console.log("Невыполненные:", getPendingTasks(current));
showStats(current);

let result = addTask(current, 20, "Добавить проверку", "high");
if (result.ok) current = result.tasks; else console.error(result.error);
showStats(current);

result = setTaskCompleted(current, 4, true);
if (result.ok) current = result.tasks; else console.error(result.error);
showStats(current);

result = renameTask(current, 10, "Подготовить инструкцию запуска");
if (result.ok) current = result.tasks; else console.error(result.error);
showStats(current);

result = removeTask(current, 7);
if (result.ok) current = result.tasks; else console.error(result.error);
showStats(current);

// демонстрация отказа: повторяющийся id
result = addTask(current, 20, "Дубль", "low");
if (!result.ok) console.error(`Ожидаемая ошибка: ${result.error}`);

// доказательство сохранности исходного набора
console.log("demoTasks не изменился:", demoTasks);