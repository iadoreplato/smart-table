import {sortCollection, sortMap} from "../lib/sort.js";
export function initSorting(columns) { //инициализирует сортировку и возвращает функцию, которое принимает данные, состояние и действие и возвращает отсортированный массив
    return (data, state, action) => { //columns - массив кнопок сортировки 
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // @todo: #3.1 — запомнить выбранный режим сортировки
       action.dataset.value = sortMap[action.dataset.value];
        field = action.dataset.field;
        order = action.dataset.value;

            // @todo: #3.2 — сбросить сортировки остальных колонок
            columns.forEach(column => {                                    // Перебираем элементы (в columns у нас массив кнопок)
    if (column.dataset.field !== action.dataset.field) {    // Если это не та кнопка, что нажал пользователь
        column.dataset.value = 'none';                        // тогда сбрасываем её в начальное состояние
    }
});
        }  else {
            // если кнопка не нажата, ищем активную колонку
            columns.forEach(column => {
                if (column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

        // возвращаем отсортированный массив
        return sortCollection(data, field, order);
    };
}