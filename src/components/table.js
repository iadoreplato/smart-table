
import { cloneTemplate } from "../lib/utils";
/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    //root — это один объект-контейнер для модуля таблицы, внутри которого могут храниться клонированные шаблоны.
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы  
    root.beforeTemplates = {};
    root.afterTemplates = {};

before.reverse().forEach((id) => {
    //<template id="table">...</template>
   root[id] = cloneTemplate(id);
   root.container.prepend(root[id].container); 
   root.beforeTemplates[id] = root[id]
   })

after.forEach((id) => {
   root[id] = cloneTemplate(id);
   root.container.appendChild(root[id].container); 
   root.afterTemplates[id] = root[id];
   })

    // @todo: #1.3 —  обработать события и вызвать onAction()
   root.container.addEventListener('change', (e) => {
    onAction();
   })
   
   root.container.addEventListener('reset', (e) => {
    setTimeout(onAction);
   })

   root.container.addEventListener('submit', (e) => {
   e.preventDefault();
   onAction(e.submitter);
   })

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
         const nextRows = data.map(item => { 
            const row = cloneTemplate(rowTemplate); //возвращает объект с контейнером (клоном шаблона) и именованными элементами (data-name)
            //берёт объект и возвращает массив его собственных ключей
            Object.keys(item).forEach(key => { 
                //проверяем, существует ли определенный ключ в data-name в шаблоне
                if (row.elements[key]) {
                    //если он есть, присваиваем ему данные опрделенного продаца по заданному ключу
                   row.elements[key].textContent = item[key];
                }
            });
            //root.container - это ключ из объекта - клонированный элемент, вся таблица 
            return row.container
         });
         //root.elements - ключ из объекта соотвествующий data-name: значение
         root.elements.rows.replaceChildren(...nextRows);
    }
        return {...root, render};
}
/* root — не DOM-узел, а объект с двумя ключевыми свойствами:
	1.	container → сам DOM-элемент (всё, что клонировали из tableTemplate)
	2.	elements → объект с DOM-узлами внутри шаблона, определяемыми по data-name
    root = {
  container: <form class="table">…</form>, // DOM-узел всей таблицы
  elements: {
    rows: <div class="table-content" data-name="rows"></div>,  // контейнер для строк
    header: <div class="table-row header-row">…</div>,
    filter: <div class="table-row filter-row">…</div>
  }
} */