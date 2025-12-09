import { 
    loadAllCourses, 
    renderCatalog, 
    filterCoursesByCategory, 
    searchCourses, 
    updateCategorySpanCounts,
    allCourses 
} from './components/catalog.js';

function initializeApp() {
    console.log("Main.js: App starting...");

    // 1. Загружаем ВСЕ курсы при старте
    loadAllCourses().then(() => {
        if (allCourses.length > 0) { // Если данные загрузились успешно
            console.log("Main.js: Data loaded, rendering initial catalog...");
            renderCatalog(allCourses); // Отображаем все курсы
            updateCategorySpanCounts(); // Обновляем счетчики
            console.log("Main.js: Initial rendering and span counts updated.");

            // --- Обработчики событий для ФИЛЬТРАЦИИ ---
            const categoryListItems = document.querySelectorAll('.main__top-list__item');
            let activeCategoryButton = null; // Для отслеживания активной кнопки

            categoryListItems.forEach(item => {
                item.addEventListener('click', () => {
                    // Получаем название категории из текста элемента (без цифры)
                    const category = item.firstChild.textContent.trim(); 
                    console.log(`Main.js: Category button clicked: "${category}"`);

                    // Снимаем выделение с предыдущей кнопки
                    if (activeCategoryButton) {
                        activeCategoryButton.classList.remove('active-category');
                    }
                    // Выделяем текущую кнопку
                    item.classList.add('active-category');
                    activeCategoryButton = item; // Сохраняем текущую как активную

                    filterCoursesByCategory(category); // Фильтруем
                    console.log(`Main.js: Filtering by category: "${category}"`);
                });
            });

            // --- Обработчик событий для ПОИСКА ---
            const searchInput = document.querySelector('.main__top-search__input');

            // Событие 'input' срабатывает при каждом вводе символа
            searchInput.addEventListener('input', () => {
                console.log(`Main.js: Search input changed: "${searchInput.value}"`);
                searchCourses(searchInput.value); // Запускаем поиск
            });

            // --- Инициализация: Выделяем кнопку "All" по умолчанию ---
            const allButton = document.querySelector('.main__top-list li.main__top-list__item'); 
            if (allButton) {
                allButton.classList.add('active-category');
                activeCategoryButton = allButton;
                console.log("Main.js: 'All' button activated by default.");
            }
        } else {
            console.error("Main.js: Failed to load courses. Rendering empty catalog.");
            // Если данные не загрузились, renderCatalog(allCourses) отобразит "No courses found."
            renderCatalog([]); // Отобразим сообщение об ошибке или пустой список
        }
    }).catch(error => {
        console.error("Main.js: Error during initial app setup:", error);
        // Если что-то пошло не так в loadAllCourses, здесь тоже будет ошибка
        renderCatalog([]); // Отобразим сообщение об ошибке или пустой список
    });
}

// Запускаем инициализацию, когда весь HTML загружен
document.addEventListener('DOMContentLoaded', initializeApp);