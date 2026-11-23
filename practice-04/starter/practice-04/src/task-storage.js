export const STORAGE_VERSION = 1;

const ALLOWED_PRIORITIES = new Set(["low", "medium", "high"]);

function copyTasks(tasks) {
  return tasks.map((task) => ({ ...task }));
}

function failure(error) {
  return { ok: false, error };
}

export function isValidTaskList(value) {
  if (!Array.isArray(value)) return false;

  const ids = new Set();
  for (const task of value) {
    if (task === null || typeof task !== "object" || Array.isArray(task)) return false;
    if (!Number.isSafeInteger(task.id) || task.id <= 0 || ids.has(task.id)) return false;
    if (typeof task.title !== "string") return false;
    const title = task.title.trim();
    if (title.length === 0 || title.length > 100 || title !== task.title) return false;
    if (typeof task.completed !== "boolean") return false;
    if (!ALLOWED_PRIORITIES.has(task.priority)) return false;
    ids.add(task.id);
  }
  return true;
}

export function loadTasks(storage, key, fallbackTasks) {
  const fallback = copyTasks(fallbackTasks);

  try {
    const raw = storage.getItem(key);
    if (raw === null) {
      return { ok: true, source: "initial", tasks: fallback };
    }

    const parsed = JSON.parse(raw);
    if (
      parsed === null
      || typeof parsed !== "object"
      || Array.isArray(parsed)
      || parsed.version !== STORAGE_VERSION
      || !isValidTaskList(parsed.tasks)
    ) {
      return failureWithFallback("Сохранённые данные имеют неизвестную версию или неверную структуру.", fallback);
    }

    return { ok: true, source: "storage", tasks: copyTasks(parsed.tasks) };
  } catch (error) {
    return failureWithFallback(`Не удалось прочитать сохранённые данные: ${error.message}`, fallback);
  }
}

function failureWithFallback(error, fallback) {
  return { ok: false, source: "fallback", tasks: fallback, error };
}

export function saveTasks(storage, key, tasks) {
  if (!isValidTaskList(tasks)) {
    return failure("Список задач не соответствует допустимой структуре и не был сохранён.");
  }

  try {
    storage.setItem(key, JSON.stringify({ version: STORAGE_VERSION, tasks }));
    return { ok: true };
  } catch (error) {
    return failure(`Не удалось сохранить данные: ${error.message}`);
  }
}

export function removeSavedTasks(storage, key) {
  try {
    storage.removeItem(key);
    return { ok: true };
  } catch (error) {
    return failure(`Не удалось удалить сохранённые данные: ${error.message}`);
  }
}
