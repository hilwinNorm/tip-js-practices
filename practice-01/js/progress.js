"use strict";

const totalTasks = 12;
const completedTasks = 5;

if (typeof totalTasks !== "number" || typeof completedTasks !== "number" || 
    !Number.isInteger(totalTasks) || !Number.isInteger(completedTasks)) {
    console.log("Ошибка: количество задач должно быть целым числовым значением.");
} 
else if (totalTasks < 0 || totalTasks > 1000 || completedTasks < 0) {
    console.log("Ошибка: недопустимые границы значений или отрицательное количество.");
} 
else if (completedTasks > totalTasks) {
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
