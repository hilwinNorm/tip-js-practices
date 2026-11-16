"use strict";

// Для проверки разных тест-кейсов раскомментируйте нужную пару переменных
const totalInput = "   12   "; const completedInput = "5";         // Обычные строки с пробелами
// const totalInput = "";         const completedInput = "5";         // Пустая строка
// const totalInput = "   ";      const completedInput = "5";         // Строка из пробелов
// const totalInput = "abc";      const completedInput = "5";         // Текстовая строка
// const totalInput = "12";       const completedInput = "2.5";       // Дробное число
// const totalInput = "Infinity"; const completedInput = "5";         // Бесконечность
// const totalInput = null;       const completedInput = "5";         // Значение null
// const totalInput = undefined;  const completedInput = "5";         // Значение undefined

if (typeof totalInput !== "string" || typeof completedInput !== "string") {
    console.log("Ошибка: входные данные должны иметь строковый тип данных.");
} else {
    const totalTrimmed = totalInput.trim();
    const completedTrimmed = completedInput.trim();

    if (totalTrimmed === "" || completedTrimmed === "") {
        console.log("Ошибка: пустой ввод или строка из одних пробелов недопустимы.");
    } else {
        const totalTasks = Number(totalTrimmed);
        const completedTasks = Number(completedTrimmed);

        if (Number.isNaN(totalTasks) || Number.isNaN(completedTasks)) {
            console.log("Ошибка: строка содержит некорректные для числа символы.");
        } else if (!Number.isFinite(totalTasks) || !Number.isFinite(completedTasks)) {
            console.log("Ошибка: передано бесконечное значение (Infinity).");
        } else if (!Number.isInteger(totalTasks) || !Number.isInteger(completedTasks)) {
            console.log("Ошибка: количество задач должно быть целым числом.");
        } 
        else if (totalTasks < 0 || totalTasks > 1000 || completedTasks < 0) {
            console.log("Ошибка: числа выходят за допустимые границы (0-1000).");
        } else if (completedTasks > totalTasks) {
            console.log("Ошибка: выполнено больше задач, чем существует.");
        } 
        else if (totalTasks === 0 && completedTasks === 0) {
            console.log("Задач пока нет");
        } 
        else {
            const remainingTasks = totalTasks - completedTasks;
            const progressPercent = ((completedTasks / totalTasks) * 100).toFixed(1);
            
            let status = "";
            if (completedTasks === 0) {
                status = "Не начато";
            } else if (completedTasks === totalTasks) {
                status = "Завершено";
            } else {
                status = "В работе";
            }

            console.log(`Всего задач: ${totalTasks}`);
            console.log(`Выполнено: ${completedTasks}`);
            console.log(`Осталось: ${remainingTasks}`);
            console.log(`Прогресс: ${progressPercent}%`);
            console.log(`Статус: ${status}`);
        }
    }
}
