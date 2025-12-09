// --- 1. Получение данных из data.json ---
async function fetchCourses() {
    try {
        // Используем относительный путь от catalog.js к data.json
        const response = await fetch('../data/data.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Courses fetched in catalog.js:", data);
        return data;
    } catch (error) {
        console.error("Could not fetch courses in catalog.js:", error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}

// --- 2. Функция создания HTML-карточки курса ---
function createCourseCard(course) {
    const cardElement = document.createElement('li');
    cardElement.classList.add('main__catalog-list__item');

    // Получаем класс для категории.
    const categoryClassName = course.categoryClass ? course.categoryClass : `category-${course.category.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Формируем HTML для карточки курса
    cardElement.innerHTML = `
        <div class="main__catalog-card">
            <img src="${course.imageUrl}" alt="${course.title}" class="main__catalog-card__img">
            <div class="main__catalog-card__content">
                 
                 <!-- Используем класс категории для стилизации -->
                 <div class="main__catalog-card__category ${categoryClassName}"> 
                    ${course.category}
                </div>
                
                <h3 class="main__catalog-card__title">${course.title}</h3>
                <div class="main__catalog-card__details">
                    <span class="main__catalog-card__price">${course.price}</span>
                    <span class="main__catalog-card__instructor">by ${course.instructor}</span>
                </div>
            </div>
        </div>
    `;
    return cardElement;
}

// --- 3. Функция для отображения каталога курсов ---
// Эта функция теперь будет принимать список курсов для отображения.
// Изначально она будет получать все курсы.
async function renderCatalog(coursesToRender = []) { // По умолчанию пустой массив, чтобы избежать ошибок
    const catalogList = document.querySelector('.main__catalog-list');
    if (!catalogList) {
        console.error("Catalog list element not found in catalog.js.");
        return;
    }

    // Очищаем список перед добавлением новых карточек
    catalogList.innerHTML = '';

    if (coursesToRender.length === 0) {
        catalogList.innerHTML = '<p>No courses found.</p>'; // Сообщение, если ничего не найдено
        return;
    }

    coursesToRender.forEach(course => {
        const courseCard = createCourseCard(course);
        catalogList.appendChild(courseCard);
    });
}

// --- 4. Глобальные переменные для состояния ---
// Эти переменные будут использоваться main.js для управления фильтрацией и поиском.
let allCourses = []; // Здесь будут храниться ВСЕ загруженные курсы
let currentFilter = 'All'; // Текущий выбранный фильтр
let currentSearchQuery = ''; // Текущий поисковый запрос

// --- 5. Функция для загрузки всех курсов (используется main.js) ---
async function loadAllCourses() {
    allCourses = await fetchCourses();
    return allCourses;
}

// --- 6. Функция фильтрации (используется main.js) ---
function filterCoursesByCategory(category) {
    currentFilter = category; // Сохраняем выбранный фильтр

    let filteredCourses = allCourses;

    // Применяем фильтр категории
    if (category !== 'All') {
        filteredCourses = allCourses.filter(course => course.category === category);
    }

    // Применяем поисковый запрос к отфильтрованным курсам
    if (currentSearchQuery) {
        filteredCourses = filteredCourses.filter(course => 
            course.title.toLowerCase().includes(currentSearchQuery) ||
            course.category.toLowerCase().includes(currentSearchQuery) ||
            course.instructor.toLowerCase().includes(currentSearchQuery)
        );


}
    
    renderCatalog(filteredCourses); // Отображаем результат
}

// --- 7. Функция поиска (используется main.js) ---
function searchCourses(query) {
    currentSearchQuery = query.toLowerCase().trim(); // Сохраняем поисковый запрос

    let searchedCourses = allCourses;

    // Применяем поисковый запрос
    if (currentSearchQuery) {
        searchedCourses = allCourses.filter(course => 
            course.title.toLowerCase().includes(currentSearchQuery) ||
            course.category.toLowerCase().includes(currentSearchQuery) ||
            course.instructor.toLowerCase().includes(currentSearchQuery)
        );
    }

    // Применяем текущий фильтр категории к результатам поиска
    if (currentFilter !== 'All') {
        searchedCourses = searchedCourses.filter(course => course.category === currentFilter);
    }

    renderCatalog(searchedCourses); // Отображаем результат
}

// --- 8. Обновление счетчиков категорий ---
function updateCategorySpanCounts() {
    const categorySpans = document.querySelectorAll('.main__top-span');
    
    if (!allCourses || allCourses.length === 0) {
        console.warn("No courses available to count spans in catalog.js.");
        categorySpans.forEach(span => span.textContent = '0');
        return;
    }

    const categoryCounts = {
        'All': allCourses.length
    };
    allCourses.forEach(course => {
        categoryCounts[course.category] = (categoryCounts[course.category] || 0) + 1;
    });

    categorySpans.forEach(span => {
        const categoryName = span.parentNode.firstChild.textContent.trim();
        span.textContent = categoryCounts[categoryName] || 0;
    });
}

// --- 9. Экспорт всего, что нужно main.js ---
export { 
    loadAllCourses, // Для загрузки всех данных
    renderCatalog,  // Для отображения конкретного списка
    filterCoursesByCategory, // Для фильтрации
    searchCourses,  // Для поиска
    updateCategorySpanCounts, // Для обновления цифр
    allCourses, // Доступ ко всем данным
    currentFilter, // Доступ к текущему фильтру 
    currentSearchQuery // Доступ к текущему запросу поиска
};