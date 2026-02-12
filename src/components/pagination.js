import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {

let pageCount;
const applyPagination = (query, state, action) => {
    const limit = Number(state.rowsPerPage) || 10;
    let page = Number(state.page) || 1;

    if (action) switch(action.name) {
        case 'prev': page = Math.max(1, page - 1); break;
        case 'next': page = Math.min(pageCount, page + 1); break;
        case 'first': page = 1; break;
        case 'last': page = pageCount; break;
    }

    return Object.assign({}, query, {
        limit,
        page
    });
}

const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit);

    // переносим код, который делали под @todo: #2.4
    const pageTemplate = pages.firstElementChild.cloneNode(true); 
    const visiblePages = getPages(page, pageCount, 5);      
    pages.replaceChildren(...visiblePages.map(pageNumber => {        // перебираем их и создаём для них кнопку
        const el = pageTemplate.cloneNode(true);                    // клонируем шаблон, который запомнили ранее
        return createPage(el, pageNumber, pageNumber === page);        // вызываем колбэк из настроек, чтобы заполнить кнопку данными
    }))
    // переносим код, который делали под @todo: #2.5 (обратите внимание, что rowsPerPage заменена на limit)
        fromRow.textContent = (page - 1) * limit + 1;                    // С какой строки выводим
    toRow.textContent = Math.min((page * limit), total);    // До какой строки выводим, если это последняя страница, то отображаем оставшееся количество
    totalRows.textContent = total;    
}

return {
    updatePagination,
    applyPagination
};
}