"use strict";

const totalTasks = 12;
const completedTasks = 5;
const dailyLimit = 3;

if (typeof totalTasks !== "number" || typeof completedTasks !== "number" || typeof dailyLimit !== "number" ||
    !Number.isInteger(totalTasks) || !Number.isInteger(completedTasks) || !Number.isInteger(dailyLimit)) {
    console.log("Ошибка: все входные данные должны быть целыми числами.");
} else if (totalTasks < 0 || totalTasks > 1000 || completedTasks < 0) {
    console.log("Ошибка: недопустимые границы значений задач или отрицательное количество.");
} else if (completedTasks > totalTasks) {
    console.log("Ошибка: выполнено больше задач, чем существует.");
} else if (dailyLimit < 1 || dailyLimit > 1000) {
    console.log("Ошибка: дневной лимит должен быть от 1 до 1000.");
} else {
    let remaining = totalTasks - completedTasks;
    console.log(`Осталось задач: ${remaining}`);

    if (remaining === 0) {
        if (totalTasks > 0) {
            console.log("Все задачи уже выполнены.");
        }
        console.log("Потребуется дней: 0");
    } else {
        let day = 0;
        while (remaining > 0) {
            day++;
            const doneToday = Math.min(dailyLimit, remaining);
            remaining -= doneToday;
            console.log(`День ${day}: выполнено ${doneToday}, осталось ${remaining}`);
        }
        console.log(`Потребуется дней: ${day}`);
    }
}
