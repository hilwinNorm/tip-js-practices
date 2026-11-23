import { getVisibleTasks } from "../src/task-selectors.js";
import { createTaskElement, renderTaskList, renderSummary, renderEmptyState } from "../src/task-view.js";

const results = document.querySelector("#check-results");
const log = document.querySelector("#check-log");
const summary = document.querySelector("#check-summary");
const fixtureRoot = document.querySelector("#test-fixture");
const frame = document.querySelector("#test-frame");
let passed = 0;
let failed = 0;
const transcript = [];

function assert(condition, message = "Условие не выполнено") {
  if (!condition) throw new Error(message);
}
function same(actual, expected, message = "Результаты отличаются") {
  assert(JSON.stringify(actual) === JSON.stringify(expected),
    `${message}: получено ${JSON.stringify(actual)}, ожидалось ${JSON.stringify(expected)}`);
}
async function check(name, action) {
  fixtureRoot.replaceChildren();
  const item = document.createElement("li");
  try {
    await action();
    passed += 1;
    item.className = "check-pass";
    item.textContent = `OK: ${name}`;
  } catch (error) {
    failed += 1;
    item.className = "check-fail";
    item.textContent = `FAIL: ${name} — ${error.message}`;
  }
  results.append(item);
  transcript.push(item.textContent);
  log.textContent = transcript.join("\n");
}
function tasks() {
  return [
    { id: 1, title: "Изучить функции", completed: true, priority: "medium" },
    { id: 4, title: "Подготовить модель задач", completed: false, priority: "high" },
    { id: 7, title: "Проверить методы массивов", completed: false, priority: "low" },
    { id: 10, title: "Оформить README", completed: true, priority: "medium" },
  ];
}
function element(tag = "div") {
  const node = document.createElement(tag);
  fixtureRoot.append(node);
  return node;
}
function summaryElement() {
  const node = element();
  ["total", "completed", "pending", "progress", "visible"].forEach((name) => {
    const value = document.createElement("span");
    value.dataset.stat = name;
    node.append(value);
  });
  return node;
}
function appDocument() {
  return frame.contentDocument;
}
function waitForFrame() {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error("iframe не загрузился")), 5000);
    frame.addEventListener("load", () => {
      window.clearTimeout(timeout);
      resolve();
    }, { once: true });
    frame.src = "./index.html?check=" + Date.now();
  });
}

await check("01 selector all возвращает все записи", () => {
  same(getVisibleTasks(tasks(), "all").map((task) => task.id), [1, 4, 7, 10]);
});
await check("02 selector pending отбирает невыполненные", () => {
  same(getVisibleTasks(tasks(), "pending").map((task) => task.id), [4, 7]);
});
await check("03 selector completed отбирает выполненные", () => {
  same(getVisibleTasks(tasks(), "completed").map((task) => task.id), [1, 10]);
});
await check("04 selector all сохраняет порядок", () => {
  same(getVisibleTasks(tasks(), "all").map((task) => task.id), [1, 4, 7, 10]);
});
await check("05 selector не изменяет исходные данные", () => {
  const source = tasks();
  getVisibleTasks(source, "pending");
  same(source.map((task) => task.completed), [true, false, false, true]);
});
await check("06 selector возвращает пустой массив для неизвестного фильтра", () => {
  same(getVisibleTasks(tasks(), "unknown"), []);
});
await check("07 карточка создаётся как li.task-card", () => {
  const card = createTaskElement(tasks()[0]);
  assert(card.tagName === "LI" && card.classList.contains("task-card"));
});
await check("08 карточка содержит числовой id в data-task-id", () => {
  assert(createTaskElement(tasks()[1]).dataset.taskId === "4");
});
await check("09 название выводится как текст, а не HTML", () => {
  const card = createTaskElement({ ...tasks()[0], title: '<strong>Текст</strong>' });
  assert(card.querySelector(".task-title").textContent === "<strong>Текст</strong>");
  assert(card.querySelector(".task-title strong") === null);
});
await check("10 выполненная карточка получает is-completed", () => {
  assert(createTaskElement(tasks()[0]).classList.contains("is-completed"));
});
await check("11 невыполненная карточка не получает is-completed", () => {
  assert(!createTaskElement(tasks()[1]).classList.contains("is-completed"));
});
await check("12 отображается статус выполненной задачи", () => {
  assert(createTaskElement(tasks()[0]).querySelector(".task-status").textContent === "Выполнена");
});
await check("13 отображается статус задачи в работе", () => {
  assert(createTaskElement(tasks()[1]).querySelector(".task-status").textContent === "В работе");
});
await check("14 приоритет low отображается по-русски", () => {
  assert(createTaskElement(tasks()[2]).querySelector(".task-priority").textContent === "Низкий");
});
await check("15 приоритет medium отображается по-русски", () => {
  assert(createTaskElement(tasks()[0]).querySelector(".task-priority").textContent === "Средний");
});
await check("16 приоритет high отображается по-русски", () => {
  assert(createTaskElement(tasks()[1]).querySelector(".task-priority").textContent === "Высокий");
});
await check("17 кнопка статуса имеет type=button", () => {
  assert(createTaskElement(tasks()[0]).querySelector('[data-action="toggle"]').type === "button");
});
await check("18 кнопка статуса имеет data-action=toggle", () => {
  assert(createTaskElement(tasks()[0]).querySelector('[data-action="toggle"]') !== null);
});
await check("19 aria-pressed установлен true у выполненной", () => {
  assert(createTaskElement(tasks()[0]).querySelector('[data-action="toggle"]').getAttribute("aria-pressed") === "true");
});
await check("20 aria-pressed установлен false у невыполненной", () => {
  assert(createTaskElement(tasks()[1]).querySelector('[data-action="toggle"]').getAttribute("aria-pressed") === "false");
});
await check("21 подпись кнопки статуса постоянная", () => {
  assert(createTaskElement(tasks()[0]).querySelector('[data-action="toggle"] .action-label').textContent === "Выполнена");
});
await check("22 кнопка удаления имеет нужные атрибуты", () => {
  const button = createTaskElement(tasks()[0]).querySelector('[data-action="delete"]');
  assert(button && button.type === "button" && button.querySelector(".action-label").textContent === "Удалить");
});
await check("23 renderTaskList отображает переданные карточки", () => {
  const list = element("ul");
  renderTaskList(list, tasks());
  assert(list.children.length === 4);
});
await check("24 повторный renderTaskList не дублирует карточки", () => {
  const list = element("ul");
  renderTaskList(list, tasks());
  renderTaskList(list, tasks());
  assert(list.children.length === 4);
});
await check("25 renderTaskList([]) очищает список, но сохраняет ul", () => {
  const list = element("ul");
  renderTaskList(list, tasks());
  renderTaskList(list, []);
  assert(list.tagName === "UL" && list.children.length === 0 && list.isConnected);
});
await check("26 renderSummary выводит total", () => {
  const node = summaryElement();
  renderSummary(node, tasks(), 2);
  assert(node.querySelector('[data-stat="total"]').textContent === "4");
});
await check("27 renderSummary выводит completed", () => {
  const node = summaryElement();
  renderSummary(node, tasks(), 2);
  assert(node.querySelector('[data-stat="completed"]').textContent === "2");
});
await check("28 renderSummary выводит pending", () => {
  const node = summaryElement();
  renderSummary(node, tasks(), 2);
  assert(node.querySelector('[data-stat="pending"]').textContent === "2");
});
await check("29 renderSummary форматирует прогресс", () => {
  const node = summaryElement();
  renderSummary(node, tasks(), 2);
  assert(node.querySelector('[data-stat="progress"]').textContent === "50.0%");
});
await check("30 renderSummary выводит количество видимых задач", () => {
  const node = summaryElement();
  renderSummary(node, tasks(), 3);
  assert(node.querySelector('[data-stat="visible"]').textContent === "3");
});
await check("31 renderEmptyState показывает полностью пустой список", () => {
  const node = element("p");
  renderEmptyState(node, 0, 0);
  assert(node.hidden === false && node.textContent === "Список задач пуст.");
});
await check("32 renderEmptyState показывает отсутствие совпадений фильтра", () => {
  const node = element("p");
  renderEmptyState(node, 3, 0);
  assert(node.hidden === false && node.textContent === "Нет задач по выбранному фильтру.");
});
await check("33 renderEmptyState скрывает сообщение при наличии карточек", () => {
  const node = element("p");
  renderEmptyState(node, 3, 2);
  assert(node.hidden === true && node.textContent === "");
});

try {
  await waitForFrame();
} catch (error) {
  console.error(error);
}
await check("34 приложение запускается с общим набором", () => {
  const doc = appDocument();
  assert(doc && doc.querySelectorAll("#task-list .task-card").length === 4);
});
await check("35 фильтр В работе отображает id 4 и 7", () => {
  const doc = appDocument();
  doc.querySelector('[data-filter="pending"]').click();
  same([...doc.querySelectorAll("#task-list [data-task-id]")].map((item) => Number(item.dataset.taskId)), [4, 7]);
});
await check("36 переключение статуса и удаление обновляют список", () => {
  const doc = appDocument();
  const toggle = doc.querySelector('[data-task-id="4"] [data-action="toggle"]');
  toggle.click();
  assert(doc.querySelector('#task-summary [data-stat="completed"]').textContent === "3");
  doc.querySelector('[data-filter="all"]').click();
  doc.querySelector('[data-task-id="7"] [data-action="delete"]').click();
  assert(doc.querySelectorAll('#task-list [data-task-id="7"]').length === 0);
  assert(doc.querySelector('#task-summary [data-stat="total"]').textContent === "3");
});

summary.textContent = `Всего: ${passed + failed}. Пройдено: ${passed}. Ошибок: ${failed}.`;
