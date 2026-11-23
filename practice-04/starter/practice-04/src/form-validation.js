const ALLOWED_PRIORITIES = new Set(["low", "medium", "high"]);

// Чистая проверка формы: не обращается к DOM и не меняет входные данные.
export function validateTaskDraft(draft, tasks, editingId = null) {
  const source = draft && typeof draft === "object" ? draft : {};
  const errors = {};
  let id;

  if (editingId !== null) {
    id = editingId;
    if (!Number.isSafeInteger(id) || id <= 0 || !tasks.some((task) => task.id === id)) {
      errors.id = "Нельзя редактировать задачу: корректный идентификатор не найден.";
    }
  } else {
    const rawId = source.id;
    const hasId = typeof rawId === "number"
      || (typeof rawId === "string" && rawId.trim().length > 0);
    id = hasId ? Number(rawId) : NaN;

    if (!Number.isSafeInteger(id) || id <= 0) {
      errors.id = "Введите положительный целый идентификатор.";
    } else if (tasks.some((task) => task.id === id)) {
      errors.id = `Задача с id ${id} уже существует.`;
    }
  }

  let title = "";
  if (typeof source.title !== "string") {
    errors.title = "Название задачи должно быть строкой.";
  } else {
    title = source.title.trim();
    if (title.length === 0) {
      errors.title = "Введите название задачи.";
    } else if (title.length > 100) {
      errors.title = "Название не должно превышать 100 символов.";
    }
  }

  const priority = source.priority;
  if (!ALLOWED_PRIORITIES.has(priority)) {
    errors.priority = "Выберите один из допустимых приоритетов.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: { id, title, priority } };
}
