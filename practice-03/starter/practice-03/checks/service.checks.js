import assert from "node:assert/strict";
import {
  createTask, findTaskById, getPendingTasks, getTaskTitles, getTaskStats,
  addTask, setTaskCompleted, renameTask, removeTask,
} from "../src/task-service.js";

let passed = 0;
let failed = 0;
function check(name, action) {
  try {
    action();
    passed += 1;
    console.log(`OK: ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL: ${name}`);
    console.error(error.message);
  }
}
function fixture() {
  return [
    { id: 1, title: "Изучить функции", completed: true, priority: "medium" },
    { id: 4, title: "Подготовить модель задач", completed: false, priority: "high" },
    { id: 7, title: "Проверить методы массивов", completed: false, priority: "low" },
    { id: 10, title: "Оформить README", completed: true, priority: "medium" },
  ];
}
function expectFailure(result) {
  assert.equal(result.ok, false);
  assert.equal(typeof result.error, "string");
  assert.ok(result.error.length > 0);
}

check("01 createTask: корректная задача", () => {
  assert.deepEqual(createTask(20, "Новая задача", "high"), {
    ok: true,
    task: { id: 20, title: "Новая задача", completed: false, priority: "high" },
  });
});
check("02 createTask: приоритет по умолчанию", () => {
  assert.equal(createTask(20, "Новая").task.priority, "medium");
});
check("03 createTask: удаление пробелов по краям", () => {
  assert.equal(createTask(20, "  Проверить данные  ").task.title, "Проверить данные");
});
check("04 createTask: минимальная длина", () => {
  assert.equal(createTask(20, "А").ok, true);
});
check("05 createTask: длина 100", () => {
  assert.equal(createTask(20, "А".repeat(100)).ok, true);
});
check("06 createTask: пустое название отклоняется", () => {
  expectFailure(createTask(20, "   "));
});
check("07 createTask: название длиннее 100 отклоняется", () => {
  expectFailure(createTask(20, "А".repeat(101)));
});
check("08 createTask: неверный тип названия отклоняется", () => {
  expectFailure(createTask(20, 42));
});
check("09 createTask: нулевой id отклоняется", () => {
  expectFailure(createTask(0, "Задача"));
});
check("10 createTask: небезопасный id отклоняется", () => {
  expectFailure(createTask(Number.MAX_SAFE_INTEGER + 1, "Задача"));
});
check("11 createTask: неизвестный приоритет отклоняется", () => {
  expectFailure(createTask(20, "Задача", "urgent"));
});
check("12 createTask: каждый вызов создаёт новый объект", () => {
  const first = createTask(20, "Задача").task;
  const second = createTask(20, "Задача").task;
  assert.notEqual(first, second);
});
check("13 findTaskById: поиск id 4", () => {
  assert.equal(findTaskById(fixture(), 4).title, "Подготовить модель задач");
});
check("14 findTaskById: отсутствующий id", () => {
  assert.equal(findTaskById(fixture(), 777), undefined);
});
check("15 findTaskById: строгое сравнение типов", () => {
  assert.equal(findTaskById(fixture(), "4"), undefined);
});
check("16 getPendingTasks: правильные id", () => {
  assert.deepEqual(getPendingTasks(fixture()).map((task) => task.id), [4, 7]);
});
check("17 getPendingTasks: возвращается новый массив", () => {
  const tasks = fixture();
  assert.notEqual(getPendingTasks(tasks), tasks);
});
check("18 getTaskTitles: названия в исходном порядке", () => {
  assert.deepEqual(getTaskTitles(fixture()), [
    "Изучить функции", "Подготовить модель задач", "Проверить методы массивов", "Оформить README",
  ]);
});
check("19 getTaskStats: общий набор", () => {
  assert.deepEqual(getTaskStats(fixture()), { total: 4, completed: 2, pending: 2, progress: 50 });
});
check("20 getTaskStats: пустой массив", () => {
  assert.deepEqual(getTaskStats([]), { total: 0, completed: 0, pending: 0, progress: 0 });
});
check("21 getTaskStats: точный числовой прогресс", () => {
  assert.ok(Math.abs(getTaskStats(fixture().slice(0, 3)).progress - 33.3333333333) < 0.000001);
});
check("22 addTask: задача добавляется в конец", () => {
  const result = addTask(fixture(), 20, "Новая", "high");
  assert.equal(result.ok, true);
  assert.deepEqual(result.tasks.map((task) => task.id), [1, 4, 7, 10, 20]);
});
check("23 addTask: исходный массив не изменяется", () => {
  const tasks = fixture();
  addTask(tasks, 20, "Новая");
  assert.equal(tasks.length, 4);
});
check("24 addTask: повторяющийся id отклоняется", () => {
  expectFailure(addTask(fixture(), 4, "Дубликат"));
});
check("25 addTask: некорректные данные отклоняются", () => {
  expectFailure(addTask(fixture(), 20, "   "));
});
check("26 setTaskCompleted: статус меняется", () => {
  const result = setTaskCompleted(fixture(), 4, true);
  assert.equal(result.ok, true);
  assert.equal(findTaskById(result.tasks, 4).completed, true);
});
check("27 setTaskCompleted: остальные поля и старый объект сохранены", () => {
  const tasks = fixture();
  const oldTask = findTaskById(tasks, 4);
  const result = setTaskCompleted(tasks, 4, true);
  assert.notEqual(findTaskById(result.tasks, 4), oldTask);
  assert.equal(oldTask.completed, false);
  assert.equal(findTaskById(result.tasks, 4).priority, "high");
});
check("28 setTaskCompleted: строковый статус отклоняется", () => {
  expectFailure(setTaskCompleted(fixture(), 4, "true"));
});
check("29 setTaskCompleted: отсутствующая задача отклоняется", () => {
  expectFailure(setTaskCompleted(fixture(), 777, true));
});
check("30 renameTask: название очищается", () => {
  const result = renameTask(fixture(), 10, "  Новый README  ");
  assert.equal(findTaskById(result.tasks, 10).title, "Новый README");
});
check("31 renameTask: статус и приоритет сохраняются", () => {
  const result = renameTask(fixture(), 4, "Новое название");
  assert.deepEqual(findTaskById(result.tasks, 4), {
    id: 4, title: "Новое название", completed: false, priority: "high",
  });
});
check("32 renameTask: неверное название отклоняется", () => {
  expectFailure(renameTask(fixture(), 4, "   "));
});
check("33 renameTask: отсутствующая задача отклоняется", () => {
  expectFailure(renameTask(fixture(), 777, "Название"));
});
check("34 removeTask: задача удаляется без перестановки остальных", () => {
  const result = removeTask(fixture(), 7);
  assert.equal(result.ok, true);
  assert.deepEqual(result.tasks.map((task) => task.id), [1, 4, 10]);
});
check("35 removeTask: отсутствие задачи возвращает ошибку", () => {
  expectFailure(removeTask(fixture(), 777));
});

console.log(`\nВсего: ${passed + failed}. Пройдено: ${passed}. Ошибок: ${failed}.`);
if (failed > 0) process.exitCode = 1;
