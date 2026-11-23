// Прикладная логика из ПР2. Модуль не обращается к DOM и не выводит данные.
const priorities = ["low", "medium", "high"];

function isValidId(id) {
  return Number.isSafeInteger(id) && id > 0;
}

function failure(message) {
  return { ok: false, error: message };
}

export function createTask(id, title, priority = "medium") {
  if (!isValidId(id)) {
    return failure("Идентификатор должен быть положительным безопасным целым числом");
  }
  if (typeof title !== "string") {
    return failure("Название задачи должно быть строкой");
  }

  const normalizedTitle = title.trim();
  if (normalizedTitle.length === 0 || normalizedTitle.length > 100) {
    return failure("Длина названия должна быть от 1 до 100 символов");
  }
  if (!priorities.includes(priority)) {
    return failure("Приоритет должен быть low, medium или high");
  }

  return {
    ok: true,
    task: {
      id,
      title: normalizedTitle,
      completed: false,
      priority,
    },
  };
}

export function findTaskById(tasks, id) {
  return tasks.find((task) => task.id === id);
}

export function getPendingTasks(tasks) {
  return tasks.filter((task) => task.completed === false);
}

export function getTaskTitles(tasks) {
  return tasks.map((task) => task.title);
}

export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed === true).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : (completed / total) * 100;

  return { total, completed, pending, progress };
}

export function addTask(tasks, id, title, priority = "medium") {
  const created = createTask(id, title, priority);
  if (!created.ok) return created;
  if (findTaskById(tasks, id)) {
    return failure(`Задача с id ${id} уже существует`);
  }

  return { ok: true, tasks: [...tasks, created.task] };
}

export function setTaskCompleted(tasks, id, completed) {
  if (!isValidId(id)) {
    return failure("Идентификатор должен быть положительным безопасным целым числом");
  }
  if (typeof completed !== "boolean") {
    return failure("Статус completed должен быть логическим значением");
  }
  if (!findTaskById(tasks, id)) {
    return failure(`Задача с id ${id} не найдена`);
  }

  const updatedTasks = tasks.map((task) => (
    task.id === id ? { ...task, completed } : task
  ));
  return { ok: true, tasks: updatedTasks };
}

export function renameTask(tasks, id, title) {
  if (!isValidId(id)) {
    return failure("Идентификатор должен быть положительным безопасным целым числом");
  }
  if (typeof title !== "string") {
    return failure("Название задачи должно быть строкой");
  }
  const normalizedTitle = title.trim();
  if (normalizedTitle.length === 0 || normalizedTitle.length > 100) {
    return failure("Длина названия должна быть от 1 до 100 символов");
  }
  if (!findTaskById(tasks, id)) {
    return failure(`Задача с id ${id} не найдена`);
  }

  const updatedTasks = tasks.map((task) => (
    task.id === id ? { ...task, title: normalizedTitle } : task
  ));
  return { ok: true, tasks: updatedTasks };
}

export function removeTask(tasks, id) {
  if (!isValidId(id)) {
    return failure("Идентификатор должен быть положительным безопасным целым числом");
  }
  if (!findTaskById(tasks, id)) {
    return failure(`Задача с id ${id} не найдена`);
  }

  return { ok: true, tasks: tasks.filter((task) => task.id !== id) };
}
