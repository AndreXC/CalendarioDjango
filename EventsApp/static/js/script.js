// document.addEventListener('DOMContentLoaded', () => {
//     lucide.createIcons();

//     // --- Seletores do DOM ---
//     const dom = {
//         viewContainer: document.getElementById('view-container'),
//         currentPeriodDisplay: document.getElementById('current-period-display'),
//         prevBtn: document.getElementById('prev-btn'),
//         nextBtn: document.getElementById('next-btn'),
//         todayBtn: document.getElementById('today-btn'),
//         viewSwitcherBtns: document.querySelectorAll('.view-btn'),
//         addEventFab: document.getElementById('add-event-fab'),
//         modal: document.getElementById('event-modal'),
//         closeModalBtn: document.getElementById('close-modal-btn'),
//         eventForm: document.getElementById('event-form'),
//         modalTitle: document.getElementById('modal-title'),
//         eventIdInput: document.getElementById('event-id'),
//         deleteEventBtn: document.getElementById('delete-event-btn'),
//         themeToggleBtn: document.getElementById('theme-toggle-btn'),
//         tooltip: document.getElementById('tooltip'),
//         toast: document.getElementById('toast'),
//         notificationSound: document.getElementById('notification-sound'),
//         confirmDeleteModal: document.getElementById('confirm-delete-modal'),
//         cancelDeleteBtn: document.getElementById('cancel-delete-btn'),
//         confirmDeleteActionBtn: document.getElementById('confirm-delete-action-btn'),
//         searchInput: document.getElementById('search-input'),
//         creatorFilterInput: document.getElementById('creator-filter-input'),
//     };

//     // --- Estado da Aplicação ---
//     let state = {
//         currentDate: new Date(),
//         currentView: 'month',
//         events: JSON.parse(localStorage.getItem('calendarEventsPro')) || [],
//         eventIdToDelete: null,
//     };

//     // --- LÓGICA DE DRAG AND DROP ---
//     const addDragAndDropListeners = (element) => {
//         element.addEventListener('dragstart', handleDragStart);
//         element.addEventListener('dragend', handleDragEnd);
//     };

//     const handleDragStart = (e) => {
//         e.dataTransfer.setData('text/plain', e.target.dataset.eventId);
//         e.target.classList.add('dragging');
//     };

//     const handleDragEnd = (e) => {
//         e.target.classList.remove('dragging');
//     };

//     const handleDragOver = (e) => {
//         e.preventDefault();
//         e.currentTarget.classList.add('drag-over');
//     };

//     const handleDragLeave = (e) => {
//         e.currentTarget.classList.remove('drag-over');
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         e.currentTarget.classList.remove('drag-over');
//         const eventId = e.dataTransfer.getData('text/plain');
//         const newDateString = e.currentTarget.dataset.date;

//         const eventToMove = state.events.find(event => event.id === eventId);
//         if (eventToMove) {
//             const oldTime = eventToMove.date.split('T')[1] || '00:00';
//             eventToMove.date = `${newDateString}T${oldTime}`;
//             saveAndRerender();
//         }
//     };

//     // --- FUNÇÕES DE RENDERIZAÇÃO (com D&D integrado) ---

//     const createDayCell = (day, month, year, classes = [], baseClass = 'calendar-day') => {
//         const cell = createDayCellElement(day, month, year, classes, baseClass);
//         if (!classes.includes('other-month')) {
//             cell.addEventListener('dragover', handleDragOver);
//             cell.addEventListener('dragleave', handleDragLeave);
//             cell.addEventListener('drop', handleDrop);
//         }
//         return cell;
//     };

//     const renderEventsInGrid = () => {
//         if (state.currentView === 'agenda') return;
//         document.querySelectorAll('.events-container').forEach(c => c.innerHTML = '');

//         getFilteredEvents().forEach(event => {
//             const dayCell = document.querySelector(`[data-date="${event.date.split('T')[0]}"]`);
//             if (dayCell) {
//                 const eventPill = createEventPill(event);
//                 dayCell.querySelector('.events-container').appendChild(eventPill);
//             }
//         });
//     };

//     const createEventPill = (event) => {
//         const eventPill = document.createElement('div');
//         eventPill.className = 'event-pill';
//         eventPill.dataset.eventId = event.id;
//         eventPill.setAttribute('draggable', true);

//         const { icon, pillClass } = getEventStatus(event);
//         if (pillClass) eventPill.classList.add(pillClass);
//         eventPill.style.backgroundColor = (pillClass !== 'event-completed') ? event.color : '';
//         eventPill.innerHTML = `<span class="event-icon">${icon}</span> <span class="event-text">${event.name}</span>`;

//         eventPill.addEventListener('click', e => { e.stopPropagation(); openModal(event.date, event.id); });
//         addTooltipEvents(eventPill, event);
//         addDragAndDropListeners(eventPill);
//         return eventPill;
//     };


//     // --- LÓGICA DO MODAL DE EXCLUSÃO ---

//     const showConfirmDeleteModal = (eventId) => {
//         state.eventIdToDelete = eventId;
//         dom.confirmDeleteModal.classList.add('show');
//     };

//     const hideConfirmDeleteModal = () => {
//         dom.confirmDeleteModal.classList.remove('show');
//         state.eventIdToDelete = null;
//     };

//     dom.cancelDeleteBtn.addEventListener('click', hideConfirmDeleteModal);

//     dom.confirmDeleteActionBtn.addEventListener('click', () => {
//         if (state.eventIdToDelete) {
//             state.events = state.events.filter(event => event.id !== state.eventIdToDelete);
//             saveAndRerender();
//         }
//         hideConfirmDeleteModal();
//         closeModal();
//     });

//     // --- LÓGICA DO MODAL DE EDIÇÃO (Atualizado) ---

//     dom.deleteEventBtn.addEventListener('click', () => {
//         const eventId = dom.eventIdInput.value;
//         if (eventId) {
//             showConfirmDeleteModal(eventId);
//         }
//     });

//     // --- INICIALIZAÇÃO E RESTANTE DO CÓDIGO ---

//     const {
//         viewContainer, currentPeriodDisplay, prevBtn, nextBtn, todayBtn, viewSwitcherBtns, addEventFab, modal,
//         closeModalBtn, eventForm, modalTitle, eventIdInput, themeToggleBtn, tooltip, toast,
//         notificationSound, searchInput, creatorFilterInput
//     } = dom;

//     const createDayCellElement = (day, month, year, classes = [], baseClass = 'calendar-day') => {
//         const cell = document.createElement('div');
//         cell.className = baseClass;
//         if (classes.length > 0) cell.classList.add(...classes);
//         const date = new Date(year, month, day);
//         cell.dataset.date = date.toISOString().split('T')[0];
//         const dayNumber = document.createElement('span');
//         dayNumber.className = 'day-number';
//         dayNumber.textContent = day;
//         cell.appendChild(dayNumber);
//         if (isToday(date)) cell.classList.add('today');
//         if (baseClass === 'calendar-day' && !classes.includes('other-month')) {
//             cell.addEventListener('click', () => openModal(cell.dataset.date));
//         }
//         const eventsContainer = document.createElement('div');
//         eventsContainer.className = 'events-container';
//         cell.appendChild(eventsContainer);
//         return cell;
//     };
//     const getFilteredEvents = () => { const searchTerm = searchInput.value.toLowerCase(); const creatorFilter = creatorFilterInput.value.toLowerCase(); return state.events.filter(event => ((event.name || '').toLowerCase().includes(searchTerm)) && ((event.creator || '').toLowerCase().includes(creatorFilter))); };
//     const getEventStatus = (event) => { const now = new Date(); const eventDate = new Date(event.date); let icon = '', pillClass = '', textClass = ''; if (isToday(eventDate) && event.status !== 'completed' && eventDate > now) icon = '📌'; if (event.status === 'completed') { icon = '✅'; pillClass = 'event-completed'; textClass = 'text-completed'; } else if (eventDate < now) { icon = '⌛'; pillClass = 'event-expired'; textClass = 'text-expired'; } return { icon, pillClass, textClass }; };
//     const renderMonthView = () => { const year = state.currentDate.getFullYear(); const month = state.currentDate.getMonth(); currentPeriodDisplay.textContent = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(state.currentDate); const grid = document.createElement('div'); grid.className = 'calendar-grid'; const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']; weekDays.forEach(day => grid.appendChild(createDayHeader(day))); const firstDayOfMonth = new Date(year, month, 1).getDay(); const lastDateOfMonth = new Date(year, month + 1, 0).getDate(); const lastDateOfLastMonth = new Date(year, month, 0).getDate(); for (let i = firstDayOfMonth; i > 0; i--) { grid.appendChild(createDayCell(lastDateOfLastMonth - i + 1, month - 1, year, ['other-month'])); } for (let i = 1; i <= lastDateOfMonth; i++) { grid.appendChild(createDayCell(i, month, year)); } const totalCells = firstDayOfMonth + lastDateOfMonth; const nextMonthDays = (7 - (totalCells % 7)) % 7; for (let i = 1; i <= nextMonthDays; i++) { grid.appendChild(createDayCell(i, month + 1, year, ['other-month'])); } viewContainer.appendChild(grid); };
//     const renderWeekView = () => { currentPeriodDisplay.textContent = `Semana de ${new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long' }).format(getWeekStart(state.currentDate))}`; const grid = document.createElement('div'); grid.className = 'week-view-grid'; const weekStart = getWeekStart(state.currentDate); for (let i = 0; i < 7; i++) { const day = new Date(weekStart); day.setDate(day.getDate() + i); grid.appendChild(createDayHeader(`${day.toLocaleDateString('pt-BR', { weekday: 'short' })} ${day.getDate()}`)); } for (let i = 0; i < 7; i++) { const day = new Date(weekStart); day.setDate(day.getDate() + i); grid.appendChild(createDayCell(day.getDate(), day.getMonth(), day.getFullYear(), [], 'week-day')); } viewContainer.appendChild(grid); };
//     const renderAgendaView = () => { currentPeriodDisplay.textContent = 'Agenda de Eventos'; const list = document.createElement('div'); list.className = 'agenda-view-list'; const filteredEvents = getFilteredEvents().sort((a, b) => new Date(a.date) - new Date(b.date)); if (filteredEvents.length === 0) { list.innerHTML = '<p>Nenhum evento encontrado.</p>'; viewContainer.appendChild(list); return; } const groupedEvents = filteredEvents.reduce((acc, event) => { const dateKey = new Date(event.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }); if (!acc[dateKey]) acc[dateKey] = []; acc[dateKey].push(event); return acc; }, {}); for (const dateKey in groupedEvents) { const groupEl = document.createElement('div'); groupEl.className = 'agenda-day-group'; groupEl.innerHTML = `<h3>${dateKey}</h3>`; groupedEvents[dateKey].forEach(event => { const itemEl = document.createElement('div'); itemEl.className = 'agenda-event-item'; itemEl.style.borderLeftColor = event.color; const time = new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); const { icon, textClass } = getEventStatus(event); itemEl.innerHTML = `<div class="agenda-event-time">${time}</div><div class="agenda-event-details"><p class="agenda-event-name ${textClass}">${event.name}</p><p class="agenda-event-creator">por ${event.creator}</p></div><div class="agenda-event-status">${icon}</div>`; itemEl.addEventListener('click', () => openModal(event.date, event.id)); groupEl.appendChild(itemEl); }); list.appendChild(groupEl); } viewContainer.appendChild(list); };
//     const render = async () => { viewContainer.classList.add('loading'); await new Promise(res => setTimeout(res, 200)); viewContainer.innerHTML = ''; switch (state.currentView) { case 'month': renderMonthView(); break; case 'week': renderWeekView(); break; case 'agenda': renderAgendaView(); break; } renderEventsInGrid(); viewContainer.classList.remove('loading'); lucide.createIcons(); };
//     const createDayHeader = (text) => { const header = document.createElement('div'); header.className = 'calendar-header'; header.textContent = text; return header; };
//     const addTooltipEvents = (element, event) => { element.addEventListener('mousemove', e => { tooltip.textContent = `Criador: ${event.creator}\nDescrição: ${event.description || 'Nenhuma'}`; tooltip.style.left = `${e.pageX + 15}px`; tooltip.style.top = `${e.pageY + 15}px`; }); element.addEventListener('mouseenter', () => tooltip.classList.add('visible')); element.addEventListener('mouseleave', () => tooltip.classList.remove('visible')); };
//     const saveAndRerender = () => { localStorage.setItem('calendarEventsPro', JSON.stringify(state.events)); render(); };
//     const openModal = (dateString, eventId = null) => { modal.classList.add('show'); eventForm.reset(); const eventNameInput = document.getElementById('event-name'); const eventCreatorInput = document.getElementById('event-creator'); const eventDateInput = document.getElementById('event-date'); const eventDescriptionInput = document.getElementById('event-description'); const eventColorInput = document.getElementById('event-color'); const eventCompletedCheckbox = document.getElementById('event-completed-checkbox'); if (eventId) { const event = state.events.find(e => e.id === eventId); modalTitle.textContent = 'Editar Evento'; eventIdInput.value = event.id; eventNameInput.value = event.name; eventCreatorInput.value = event.creator || ''; eventDateInput.value = event.date; eventDescriptionInput.value = event.description; eventColorInput.value = event.color; eventCompletedCheckbox.checked = event.status === 'completed'; dom.deleteEventBtn.style.display = 'flex'; } else { modalTitle.textContent = 'Adicionar Evento'; eventIdInput.value = ''; const now = new Date(); const hours = now.getHours().toString().padStart(2, '0'); const minutes = now.getMinutes().toString().padStart(2, '0'); eventDateInput.value = `${dateString}T${hours}:${minutes}`; dom.deleteEventBtn.style.display = 'none'; } };
//     const closeModal = () => modal.classList.remove('show');
//     eventForm.addEventListener('submit', (e) => { e.preventDefault(); const eventNameInput = document.getElementById('event-name'); const eventCreatorInput = document.getElementById('event-creator'); const eventDateInput = document.getElementById('event-date'); const eventDescriptionInput = document.getElementById('event-description'); const eventColorInput = document.getElementById('event-color'); const eventCompletedCheckbox = document.getElementById('event-completed-checkbox'); const eventData = { id: eventIdInput.value || Date.now().toString(), name: eventNameInput.value, creator: eventCreatorInput.value, date: eventDateInput.value, description: eventDescriptionInput.value, color: eventColorInput.value, status: eventCompletedCheckbox.checked ? 'completed' : 'pending' }; if (eventIdInput.value) { state.events = state.events.map(event => event.id === eventIdInput.value ? eventData : event); } else { state.events.push(eventData); } saveAndRerender(); closeModal(); });
//     closeModalBtn.addEventListener('click', closeModal); addEventFab.addEventListener('click', () => openModal(new Date().toISOString().split('T')[0]));
//     prevBtn.addEventListener('click', () => { if (state.currentView === 'month') state.currentDate.setMonth(state.currentDate.getMonth() - 1); else if (state.currentView === 'week') state.currentDate.setDate(state.currentDate.getDate() - 7); render(); });
//     nextBtn.addEventListener('click', () => { if (state.currentView === 'month') state.currentDate.setMonth(state.currentDate.getMonth() + 1); else if (state.currentView === 'week') state.currentDate.setDate(state.currentDate.getDate() + 7); render(); });
//     todayBtn.addEventListener('click', () => { state.currentDate = new Date(); render(); });
//     viewSwitcherBtns.forEach(btn => { btn.addEventListener('click', () => { viewSwitcherBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); state.currentView = btn.dataset.view; render(); }); });
//     searchInput.addEventListener('input', () => { state.currentView === 'agenda' ? render() : renderEventsInGrid(); }); creatorFilterInput.addEventListener('input', () => { state.currentView === 'agenda' ? render() : renderEventsInGrid(); });
//     const showToast = (message) => { toast.innerHTML = `<i data-lucide="bell"></i> ${message}`; lucide.createIcons(); toast.classList.add('show'); notificationSound.play().catch(e => console.log("Interação do usuário necessária para tocar som.")); setTimeout(() => toast.classList.remove('show'), 5000); };

//     // --- FUNÇÃO DE NOTIFICAÇÃO (ATUALIZADA) ---
//     const checkUpcomingEvents = () => {
//         const now = new Date();
//         const oneHour = 3600000; // 60 * 60 * 1000

//         state.events.forEach(event => {
//             const eventDate = new Date(event.date);
//             if (event.status === 'pending' && !event.notified) {
//                 const timeDiff = eventDate.getTime() - now.getTime();

//                 if (timeDiff > 0 && timeDiff < oneHour) {
//                     // CÁLCULO DO TEMPO RESTANTE EM MINUTOS
//                     const remainingMinutes = Math.round(timeDiff / (1000 * 60));

//                     // MENSAGEM DINÂMICA
//                     showToast(`Evento próximo: "${event.name}" em aprox. ${remainingMinutes} minutos!`);

//                     event.notified = true; // Marca para não notificar de novo
//                 }
//             }
//         });

//         // Salva o status 'notified' no localStorage para persistir
//         localStorage.setItem('calendarEventsPro', JSON.stringify(state.events));
//     };

//     const getWeekStart = (date) => { const d = new Date(date); const day = d.getDay(); const diff = d.getDate() - day; return new Date(d.setDate(diff)); };
//     const isToday = (date) => { const today = new Date(); return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear(); };
//     const applyTheme = (theme) => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('theme', theme); };
//     themeToggleBtn.addEventListener('click', () => { const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'; applyTheme(newTheme); });

//     // --- INICIALIZAÇÃO ---
//     applyTheme(localStorage.getItem('theme') || 'light');
//     render();
//     setInterval(checkUpcomingEvents, 30000); // Verifica a cada 30 segundos
// });

// document.addEventListener('DOMContentLoaded', () => {
//     lucide.createIcons();

//     // --- LÓGICA DE API E SEGURANÇA (DJANGO) ---
//     function getCookie(name) {
//         let cookieValue = null;
//         if (document.cookie && document.cookie !== '') {
//             const cookies = document.cookie.split(';');
//             for (let i = 0; i < cookies.length; i++) {
//                 const cookie = cookies[i].trim();
//                 if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                     break;
//                 }
//             }
//         }
//         return cookieValue;
//     }
//     const csrftoken = getCookie('csrftoken');

//     // --- Seletores do DOM ---
//     const dom = {
//         viewContainer: document.getElementById('view-container'),
//         currentPeriodDisplay: document.getElementById('current-period-display'),
//         prevBtn: document.getElementById('prev-btn'),
//         nextBtn: document.getElementById('next-btn'),
//         todayBtn: document.getElementById('today-btn'),
//         viewSwitcherBtns: document.querySelectorAll('.view-btn'),
//         addEventFab: document.getElementById('add-event-fab'),
//         modal: document.getElementById('event-modal'),
//         closeModalBtn: document.getElementById('close-modal-btn'),
//         eventForm: document.getElementById('event-form'),
//         modalTitle: document.getElementById('modal-title'),
//         eventIdInput: document.getElementById('event-id'),
//         deleteEventBtn: document.getElementById('delete-event-btn'),
//         themeToggleBtn: document.getElementById('theme-toggle-btn'),
//         tooltip: document.getElementById('tooltip'),
//         toast: document.getElementById('toast'),
//         notificationSound: document.getElementById('notification-sound'),
//         confirmDeleteModal: document.getElementById('confirm-delete-modal'),
//         cancelDeleteBtn: document.getElementById('cancel-delete-btn'),
//         confirmDeleteActionBtn: document.getElementById('confirm-delete-action-btn'),
//         searchInput: document.getElementById('search-input'),
//         creatorFilterInput: document.getElementById('creator-filter-input'),
//     };

//     // --- Estado da Aplicação ---
//     let state = {
//         currentDate: new Date(),
//         currentView: 'month',
//         events: [],
//         eventIdToDelete: null,
//     };

//     // --- FUNÇÃO PARA CARREGAR EVENTOS DO BANCO DE DADOS ---
//     const loadEventsFromDB = async () => {
//         try {
//             const response = await fetch('/api/events/');
//             if (!response.ok) throw new Error('Falha ao carregar eventos do servidor.');
//             state.events = await response.json();
//             render();
//         } catch (error) {
//             console.error('Erro:', error);
//         }
//     };

//     // --- LÓGICA DE DRAG AND DROP ---
//     const handleDrop = async (e) => {
//         e.preventDefault();
//         e.currentTarget.classList.remove('drag-over');
//         const eventId = e.dataTransfer.getData('text/plain');
//         const newDateString = e.currentTarget.dataset.date;

//         const eventToMove = state.events.find(event => event.id == eventId);
//         if (eventToMove) {
//             const oldTime = eventToMove.event_date.split('T')[1] || '00:00:00';
//             const newDateTime = `${newDateString}T${oldTime}`;

//             const { id, ...eventData } = eventToMove;
//             const updatedEventData = { ...eventData, event_date: newDateTime };

//             const response = await fetch(`/api/events/${eventId}/`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
//                 body: JSON.stringify(updatedEventData)
//             });

//             if (response.ok) loadEventsFromDB();
//             else console.error('Falha ao atualizar evento com Drag and Drop.');
//         }
//     };

//     // --- LÓGICA DO MODAL DE EXCLUSÃO ---
//     dom.confirmDeleteActionBtn.addEventListener('click', async () => {
//         if (state.eventIdToDelete) {
//             const response = await fetch(`/api/events/${state.eventIdToDelete}/`, {
//                 method: 'DELETE',
//                 headers: { 'X-CSRFToken': csrftoken }
//             });
//             if (response.ok) loadEventsFromDB();
//             else console.error('Falha ao excluir o evento.');
//         }
//         hideConfirmDeleteModal();
//         closeModal();
//     });

//     // --- LÓGICA DO FORMULÁRIO ---
//     dom.eventForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const eventData = {
//             title: document.getElementById('event-name').value,
//             creator_name: document.getElementById('event-creator').value,
//             event_date: document.getElementById('event-date').value,
//             description: document.getElementById('event-description').value,
//             color: document.getElementById('event-color').value,
//             status: document.getElementById('event-completed-checkbox').checked ? 'completed' : 'pending'
//         };
//         const eventId = dom.eventIdInput.value;
//         let url = '/api/events/';
//         let method = 'POST';
//         if (eventId) {
//             url = `/api/events/${eventId}/`;
//             method = 'PUT';
//         }
//         const response = await fetch(url, {
//             method: method,
//             headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
//             body: JSON.stringify(eventData)
//         });
//         if (response.ok) {
//             loadEventsFromDB();
//             closeModal();
//         } else {
//             alert('Ocorreu um erro ao salvar. Verifique os dados e tente novamente.');
//         }
//     });

//     // --- FUNÇÕES DE RENDERIZAÇÃO E OUTRAS ---
//     const renderEventsInGrid = () => {
//         if (state.currentView === 'agenda') return;
//         document.querySelectorAll('.events-container').forEach(c => c.innerHTML = '');
//         getFilteredEvents().forEach(event => {
//             const dayCell = document.querySelector(`[data-date="${event.event_date.split('T')[0]}"]`);
//             if (dayCell) {
//                 const eventPill = createEventPill(event);
//                 dayCell.querySelector('.events-container').appendChild(eventPill);
//             }
//         });
//     };

//     const createEventPill = (event) => {
//         const eventPill = document.createElement('div');
//         eventPill.className = 'event-pill';
//         eventPill.dataset.eventId = event.id;
//         eventPill.setAttribute('draggable', true);
//         const { icon, pillClass } = getEventStatus(event);
//         if (pillClass) eventPill.classList.add(pillClass);
//         eventPill.style.backgroundColor = (pillClass !== 'event-completed') ? event.color : '';
//         eventPill.innerHTML = `<span class="event-icon">${icon}</span> <span class="event-text">${event.title}</span>`;
//         eventPill.addEventListener('click', e => { e.stopPropagation(); openModal(event.event_date, event.id); });
//         addTooltipEvents(eventPill, event);
//         addDragAndDropListeners(eventPill);
//         return eventPill;
//     };

//     const openModal = (dateString, eventId = null) => {
//         dom.modal.classList.add('show');
//         dom.eventForm.reset();
//         if (eventId) {
//             const event = state.events.find(e => e.id == eventId);
//             dom.modalTitle.textContent = 'Editar Evento';
//             dom.eventIdInput.value = event.id;
//             document.getElementById('event-name').value = event.title;
//             document.getElementById('event-creator').value = event.creator_name;
//             document.getElementById('event-date').value = event.event_date.slice(0, 16); // Ajuste para formato datetime-local
//             document.getElementById('event-description').value = event.description;
//             document.getElementById('event-color').value = event.color;
//             document.getElementById('event-completed-checkbox').checked = event.status === 'completed';
//             dom.deleteEventBtn.style.display = 'flex';
//         } else {
//             dom.modalTitle.textContent = 'Adicionar Evento';
//             dom.eventIdInput.value = '';
//             const now = new Date();
//             const hours = now.getHours().toString().padStart(2, '0');
//             const minutes = now.getMinutes().toString().padStart(2, '0');
//             document.getElementById('event-date').value = `${dateString}T${hours}:${minutes}`;
//             dom.deleteEventBtn.style.display = 'none';
//         }
//     };

//     const checkUpcomingEvents = () => {
//         const now = new Date();
//         const oneHour = 3600000;
//         state.events.forEach(event => {
//             const eventDate = new Date(event.event_date);
//             if (event.status === 'pending') {
//                 const timeDiff = eventDate.getTime() - now.getTime();
//                 if (timeDiff > 0 && timeDiff < oneHour) {
//                     const remainingMinutes = Math.round(timeDiff / (1000 * 60));
//                     showToast(`Evento próximo: "${event.title}" em aprox. ${remainingMinutes} minutos!`);
//                 }
//             }
//         });
//     };

//     const getEventStatus = (event) => {
//         const now = new Date();
//         const eventDate = new Date(event.event_date);
//         let icon = '', pillClass = '', textClass = ''; if (isToday(eventDate) && event.status !== 'completed' && eventDate > now) icon = '📌'; if (event.status === 'completed') { icon = '✅'; pillClass = 'event-completed'; textClass = 'text-completed'; } else if (eventDate < now) { icon = '⌛'; pillClass = 'event-expired'; textClass = 'text-expired'; } return { icon, pillClass, textClass };
//     };

//     const { viewContainer, currentPeriodDisplay, prevBtn, nextBtn, todayBtn, viewSwitcherBtns, addEventFab, modal, closeModalBtn, themeToggleBtn, tooltip, notificationSound, searchInput, creatorFilterInput } = dom;

//     // CORRIGIDO: Nome da função ajustado de volta para createDayCell
//     const createDayCell = (day, month, year, classes = [], baseClass = 'calendar-day') => { const cell = document.createElement('div'); cell.className = baseClass; if (classes.length > 0) cell.classList.add(...classes); const date = new Date(year, month, day); cell.dataset.date = date.toISOString().split('T')[0]; const dayNumber = document.createElement('span'); dayNumber.className = 'day-number'; dayNumber.textContent = day; cell.appendChild(dayNumber); if (isToday(date)) cell.classList.add('today'); if (baseClass === 'calendar-day' && !classes.includes('other-month')) { cell.addEventListener('click', () => openModal(cell.dataset.date)); cell.addEventListener('dragover', handleDragOver); cell.addEventListener('dragleave', handleDragLeave); cell.addEventListener('drop', handleDrop); } const eventsContainer = document.createElement('div'); eventsContainer.className = 'events-container'; cell.appendChild(eventsContainer); return cell; };
//     const getFilteredEvents = () => { const searchTerm = searchInput.value.toLowerCase(); const creatorFilter = creatorFilterInput.value.toLowerCase(); return state.events.filter(event => ((event.title || '').toLowerCase().includes(searchTerm)) && ((event.creator_name || '').toLowerCase().includes(creatorFilter))); };
//     const renderMonthView = () => { const year = state.currentDate.getFullYear(); const month = state.currentDate.getMonth(); currentPeriodDisplay.textContent = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(state.currentDate); const grid = document.createElement('div'); grid.className = 'calendar-grid'; const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']; weekDays.forEach(day => grid.appendChild(createDayHeader(day))); const firstDayOfMonth = new Date(year, month, 1).getDay(); const lastDateOfMonth = new Date(year, month + 1, 0).getDate(); const lastDateOfLastMonth = new Date(year, month, 0).getDate(); for (let i = firstDayOfMonth; i > 0; i--) { grid.appendChild(createDayCell(lastDateOfLastMonth - i + 1, month - 1, year, ['other-month'])); } for (let i = 1; i <= lastDateOfMonth; i++) { grid.appendChild(createDayCell(i, month, year)); } const totalCells = firstDayOfMonth + lastDateOfMonth; const nextMonthDays = (7 - (totalCells % 7)) % 7; for (let i = 1; i <= nextMonthDays; i++) { grid.appendChild(createDayCell(i, month + 1, year, ['other-month'])); } viewContainer.appendChild(grid); };
//     const renderWeekView = () => { currentPeriodDisplay.textContent = `Semana de ${new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long' }).format(getWeekStart(state.currentDate))}`; const grid = document.createElement('div'); grid.className = 'week-view-grid'; const weekStart = getWeekStart(state.currentDate); for (let i = 0; i < 7; i++) { const day = new Date(weekStart); day.setDate(day.getDate() + i); grid.appendChild(createDayHeader(`${day.toLocaleDateString('pt-BR', { weekday: 'short' })} ${day.getDate()}`)); } for (let i = 0; i < 7; i++) { const day = new Date(weekStart); day.setDate(day.getDate() + i); grid.appendChild(createDayCell(day.getDate(), day.getMonth(), day.getFullYear(), [], 'week-day')); } viewContainer.appendChild(grid); };
//     const renderAgendaView = () => { currentPeriodDisplay.textContent = 'Agenda de Eventos'; const list = document.createElement('div'); list.className = 'agenda-view-list'; const filteredEvents = getFilteredEvents().sort((a, b) => new Date(a.event_date) - new Date(b.event_date)); if (filteredEvents.length === 0) { list.innerHTML = '<p>Nenhum evento encontrado.</p>'; viewContainer.appendChild(list); return; } const groupedEvents = filteredEvents.reduce((acc, event) => { const dateKey = new Date(event.event_date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }); if (!acc[dateKey]) acc[dateKey] = []; acc[dateKey].push(event); return acc; }, {}); for (const dateKey in groupedEvents) { const groupEl = document.createElement('div'); groupEl.className = 'agenda-day-group'; groupEl.innerHTML = `<h3>${dateKey}</h3>`; groupedEvents[dateKey].forEach(event => { const itemEl = document.createElement('div'); itemEl.className = 'agenda-event-item'; itemEl.style.borderLeftColor = event.color; const time = new Date(event.event_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); const { icon, textClass } = getEventStatus(event); itemEl.innerHTML = `<div class="agenda-event-time">${time}</div><div class="agenda-event-details"><p class="agenda-event-name ${textClass}">${event.title}</p><p class="agenda-event-creator">por ${event.creator_name}</p></div><div class="agenda-event-status">${icon}</div>`; itemEl.addEventListener('click', () => openModal(event.event_date, event.id)); groupEl.appendChild(itemEl); }); list.appendChild(groupEl); } viewContainer.appendChild(list); };
//     const render = async () => { viewContainer.classList.add('loading'); await new Promise(res => setTimeout(res, 200)); viewContainer.innerHTML = ''; switch (state.currentView) { case 'month': renderMonthView(); break; case 'week': renderWeekView(); break; case 'agenda': renderAgendaView(); break; } renderEventsInGrid(); viewContainer.classList.remove('loading'); lucide.createIcons(); };
//     const createDayHeader = (text) => { const header = document.createElement('div'); header.className = 'calendar-header'; header.textContent = text; return header; };
//     const addDragAndDropListeners = (element) => { element.addEventListener('dragstart', handleDragStart); element.addEventListener('dragend', handleDragEnd); };
//     const handleDragStart = (e) => { e.dataTransfer.setData('text/plain', e.target.dataset.eventId); e.target.classList.add('dragging'); };
//     const handleDragEnd = (e) => { e.target.classList.remove('dragging'); };
//     const handleDragOver = (e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); };
//     const handleDragLeave = (e) => { e.currentTarget.classList.remove('drag-over'); };
//     const addTooltipEvents = (element, event) => { element.addEventListener('mousemove', e => { tooltip.textContent = `Criador: ${event.creator_name}\nDescrição: ${event.description || 'Nenhuma'}`; tooltip.style.left = `${e.pageX + 15}px`; tooltip.style.top = `${e.pageY + 15}px`; }); element.addEventListener('mouseenter', () => tooltip.classList.add('visible')); element.addEventListener('mouseleave', () => tooltip.classList.remove('visible')); };
//     const closeModal = () => modal.classList.remove('show');
//     const hideConfirmDeleteModal = () => { dom.confirmDeleteModal.classList.remove('show'); state.eventIdToDelete = null; };
//     closeModalBtn.addEventListener('click', closeModal); addEventFab.addEventListener('click', () => openModal(new Date().toISOString().split('T')[0]));
//     prevBtn.addEventListener('click', () => { if (state.currentView === 'month') state.currentDate.setMonth(state.currentDate.getMonth() - 1); else if (state.currentView === 'week') state.currentDate.setDate(state.currentDate.getDate() - 7); render(); });
//     nextBtn.addEventListener('click', () => { if (state.currentView === 'month') state.currentDate.setMonth(state.currentDate.getMonth() + 1); else if (state.currentView === 'week') state.currentDate.setDate(state.currentDate.getDate() + 7); render(); });
//     todayBtn.addEventListener('click', () => { state.currentDate = new Date(); render(); });
//     viewSwitcherBtns.forEach(btn => { btn.addEventListener('click', () => { viewSwitcherBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); state.currentView = btn.dataset.view; render(); }); });
//     searchInput.addEventListener('input', () => { state.currentView === 'agenda' ? render() : renderEventsInGrid(); }); creatorFilterInput.addEventListener('input', () => { state.currentView === 'agenda' ? render() : renderEventsInGrid(); });
//     const showToast = (message) => { toast.innerHTML = `<i data-lucide="bell"></i> ${message}`; lucide.createIcons(); toast.classList.add('show'); notificationSound.play().catch(e => console.log("Interação do usuário necessária para tocar som.")); setTimeout(() => toast.classList.remove('show'), 5000); };
//     const getWeekStart = (date) => { const d = new Date(date); const day = d.getDay(); const diff = d.getDate() - day; return new Date(d.setDate(diff)); };
//     const isToday = (date) => { const today = new Date(); return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear(); };
//     const applyTheme = (theme) => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('theme', theme); };
//     themeToggleBtn.addEventListener('click', () => { const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'; applyTheme(newTheme); });

//     // --- INICIALIZAÇÃO ---
//     applyTheme(localStorage.getItem('theme') || 'light');
//     loadEventsFromDB();
//     setInterval(checkUpcomingEvents, 30000);

// });



document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // --- LÓGICA DE API E SEGURANÇA (DJANGO) ---
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    // --- Seletores do DOM ---
    const dom = {
        viewContainer: document.getElementById('view-container'),
        currentPeriodDisplay: document.getElementById('current-period-display'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        todayBtn: document.getElementById('today-btn'),
        viewSwitcherBtns: document.querySelectorAll('.view-btn'),
        addEventFab: document.getElementById('add-event-fab'),
        modal: document.getElementById('event-modal'),
        closeModalBtn: document.getElementById('close-modal-btn'),
        eventForm: document.getElementById('event-form'),
        modalTitle: document.getElementById('modal-title'),
        eventIdInput: document.getElementById('event-id'),
        deleteEventBtn: document.getElementById('delete-event-btn'),
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
        tooltip: document.getElementById('tooltip'),
        toast: document.getElementById('toast'),
        notificationSound: document.getElementById('notification-sound'),
        confirmDeleteModal: document.getElementById('confirm-delete-modal'),
        cancelDeleteBtn: document.getElementById('cancel-delete-btn'),
        confirmDeleteActionBtn: document.getElementById('confirm-delete-action-btn'),
        searchInput: document.getElementById('search-input'),
        creatorFilterInput: document.getElementById('creator-filter-input'),
    };

    // --- Estado da Aplicação ---
    let state = {
        currentDate: new Date(),
        currentView: 'month',
        events: [],
        eventIdToDelete: null,
    };

    // --- FUNÇÃO PARA CARREGAR EVENTOS DO BANCO DE DADOS ---
    const loadEventsFromDB = async () => {
        try {
            const response = await fetch('/api/events/');
            if (!response.ok) throw new Error('Falha ao carregar eventos do servidor.');
            state.events = await response.json();
            render();
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    // --- LÓGICA DE DRAG AND DROP ---
    const handleDrop = async (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const eventId = e.dataTransfer.getData('text/plain');
        const newDateString = e.currentTarget.dataset.date;

        const eventToMove = state.events.find(event => event.id == eventId);
        if (eventToMove) {
            const oldTime = eventToMove.event_date.split('T')[1] || '00:00:00';
            const newDateTime = `${newDateString}T${oldTime}`;

            const { id, ...eventData } = eventToMove;
            const updatedEventData = { ...eventData, event_date: newDateTime };

            const response = await fetch(`/api/events/${eventId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
                body: JSON.stringify(updatedEventData)
            });

            if (response.ok) loadEventsFromDB();
            else console.error('Falha ao atualizar evento com Drag and Drop.');
        }
    };

    // --- LÓGICA DO MODAL DE EXCLUSÃO ---
    const showConfirmDeleteModal = (eventId) => {
        state.eventIdToDelete = eventId;
        dom.confirmDeleteModal.classList.add('show');
    };
    const hideConfirmDeleteModal = () => {
        dom.confirmDeleteModal.classList.remove('show');
        state.eventIdToDelete = null;
    };
    dom.cancelDeleteBtn.addEventListener('click', hideConfirmDeleteModal);

    // CORRIGIDO: Adicionado "async"
    dom.confirmDeleteActionBtn.addEventListener('click', async () => {
        if (state.eventIdToDelete) {
            const response = await fetch(`/api/events/${state.eventIdToDelete}/`, {
                method: 'DELETE',
                headers: { 'X-CSRFToken': csrftoken }
            });

            if (response.ok) {
                loadEventsFromDB();
            } else {
                console.error('Falha ao excluir o evento.');
            }
        }
        hideConfirmDeleteModal();
        closeModal();
    });

    dom.deleteEventBtn.addEventListener('click', () => {
        const eventId = dom.eventIdInput.value;
        if (eventId) {
            showConfirmDeleteModal(eventId);
        }
    });

    // --- LÓGICA DO FORMULÁRIO ---
    dom.eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const eventData = {
            title: document.getElementById('event-name').value,
            creator_name: document.getElementById('event-creator').value,
            event_date: document.getElementById('event-date').value,
            description: document.getElementById('event-description').value,
            color: document.getElementById('event-color').value,
            status: document.getElementById('event-completed-checkbox').checked ? 'completed' : 'pending'
        };
        const eventId = dom.eventIdInput.value;
        let url = '/api/events/';
        let method = 'POST';
        if (eventId) {
            url = `/api/events/${eventId}/`;
            method = 'PUT';
        }
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken },
            body: JSON.stringify(eventData)
        });
        if (response.ok) {
            loadEventsFromDB();
            closeModal();
        } else {
            alert('Ocorreu um erro ao salvar. Verifique os dados e tente novamente.');
        }
    });

    // --- FUNÇÕES DE RENDERIZAÇÃO E OUTRAS ---
    const renderEventsInGrid = () => {
        if (state.currentView === 'agenda') return;
        document.querySelectorAll('.events-container').forEach(c => c.innerHTML = '');
        getFilteredEvents().forEach(event => {
            const dayCell = document.querySelector(`[data-date="${event.event_date.split('T')[0]}"]`);
            if (dayCell) {
                const eventPill = createEventPill(event);
                dayCell.querySelector('.events-container').appendChild(eventPill);
            }
        });
    };

    const createEventPill = (event) => {
        const eventPill = document.createElement('div');
        eventPill.className = 'event-pill';
        eventPill.dataset.eventId = event.id;
        eventPill.setAttribute('draggable', true);
        const { icon, pillClass } = getEventStatus(event);
        if (pillClass) eventPill.classList.add(pillClass);
        eventPill.style.backgroundColor = (pillClass !== 'event-completed') ? event.color : '';
        eventPill.innerHTML = `<span class="event-icon">${icon}</span> <span class="event-text">${event.title}</span>`;
        eventPill.addEventListener('click', e => { e.stopPropagation(); openModal(event.event_date, event.id); });
        addTooltipEvents(eventPill, event);
        addDragAndDropListeners(eventPill);
        return eventPill;
    };

    const openModal = (dateString, eventId = null) => {
        dom.modal.classList.add('show');
        dom.eventForm.reset();
        if (eventId) {
            const event = state.events.find(e => e.id == eventId);
            dom.modalTitle.textContent = 'Editar Evento';
            dom.eventIdInput.value = event.id;
            document.getElementById('event-name').value = event.title;
            document.getElementById('event-creator').value = event.creator_name;
            document.getElementById('event-date').value = event.event_date.slice(0, 16);
            document.getElementById('event-description').value = event.description;
            document.getElementById('event-color').value = event.color;
            document.getElementById('event-completed-checkbox').checked = event.status === 'completed';
            dom.deleteEventBtn.style.display = 'flex';
        } else {
            dom.modalTitle.textContent = 'Adicionar Evento';
            dom.eventIdInput.value = '';
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            document.getElementById('event-date').value = `${dateString}T${hours}:${minutes}`;
            dom.deleteEventBtn.style.display = 'none';
        }
    };

    const checkUpcomingEvents = () => {
        const now = new Date();
        const oneHour = 3600000;
        state.events.forEach(event => {
            const eventDate = new Date(event.event_date);
            if (event.status === 'pending') {
                const timeDiff = eventDate.getTime() - now.getTime();
                if (timeDiff > 0 && timeDiff < oneHour) {
                    const remainingMinutes = Math.round(timeDiff / (1000 * 60));
                    showToast(`Evento próximo: "${event.title}" em aprox. ${remainingMinutes} minutos!`);
                }
            }
        });
    };

    const getEventStatus = (event) => {
        const now = new Date();
        const eventDate = new Date(event.event_date);
        let icon = '', pillClass = '', textClass = ''; if (isToday(eventDate) && event.status !== 'completed' && eventDate > now) icon = '📌'; if (event.status === 'completed') { icon = '✅'; pillClass = 'event-completed'; textClass = 'text-completed'; } else if (eventDate < now) { icon = '⌛'; pillClass = 'event-expired'; textClass = 'text-expired'; } return { icon, pillClass, textClass };
    };

    const { viewContainer, currentPeriodDisplay, prevBtn, nextBtn, todayBtn, viewSwitcherBtns, addEventFab, modal, closeModalBtn, themeToggleBtn, tooltip, notificationSound, searchInput, creatorFilterInput } = dom;

    const createDayCell = (day, month, year, classes = [], baseClass = 'calendar-day') => { const cell = document.createElement('div'); cell.className = baseClass; if (classes.length > 0) cell.classList.add(...classes); const date = new Date(year, month, day); cell.dataset.date = date.toISOString().split('T')[0]; const dayNumber = document.createElement('span'); dayNumber.className = 'day-number'; dayNumber.textContent = day; cell.appendChild(dayNumber); if (isToday(date)) cell.classList.add('today'); if (baseClass === 'calendar-day' && !classes.includes('other-month')) { cell.addEventListener('click', () => openModal(cell.dataset.date)); cell.addEventListener('dragover', handleDragOver); cell.addEventListener('dragleave', handleDragLeave); cell.addEventListener('drop', handleDrop); } const eventsContainer = document.createElement('div'); eventsContainer.className = 'events-container'; cell.appendChild(eventsContainer); return cell; };
    const getFilteredEvents = () => { const searchTerm = searchInput.value.toLowerCase(); const creatorFilter = creatorFilterInput.value.toLowerCase(); return state.events.filter(event => ((event.title || '').toLowerCase().includes(searchTerm)) && ((event.creator_name || '').toLowerCase().includes(creatorFilter))); };
    const renderMonthView = () => { const year = state.currentDate.getFullYear(); const month = state.currentDate.getMonth(); currentPeriodDisplay.textContent = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(state.currentDate); const grid = document.createElement('div'); grid.className = 'calendar-grid'; const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']; weekDays.forEach(day => grid.appendChild(createDayHeader(day))); const firstDayOfMonth = new Date(year, month, 1).getDay(); const lastDateOfMonth = new Date(year, month + 1, 0).getDate(); const lastDateOfLastMonth = new Date(year, month, 0).getDate(); for (let i = firstDayOfMonth; i > 0; i--) { grid.appendChild(createDayCell(lastDateOfLastMonth - i + 1, month - 1, year, ['other-month'])); } for (let i = 1; i <= lastDateOfMonth; i++) { grid.appendChild(createDayCell(i, month, year)); } const totalCells = firstDayOfMonth + lastDateOfMonth; const nextMonthDays = (7 - (totalCells % 7)) % 7; for (let i = 1; i <= nextMonthDays; i++) { grid.appendChild(createDayCell(i, month + 1, year, ['other-month'])); } viewContainer.appendChild(grid); };
    const renderWeekView = () => { currentPeriodDisplay.textContent = `Semana de ${new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long' }).format(getWeekStart(state.currentDate))}`; const grid = document.createElement('div'); grid.className = 'week-view-grid'; const weekStart = getWeekStart(state.currentDate); for (let i = 0; i < 7; i++) { const day = new Date(weekStart); day.setDate(day.getDate() + i); grid.appendChild(createDayHeader(`${day.toLocaleDateString('pt-BR', { weekday: 'short' })} ${day.getDate()}`)); } for (let i = 0; i < 7; i++) { const day = new Date(weekStart); day.setDate(day.getDate() + i); grid.appendChild(createDayCell(day.getDate(), day.getMonth(), day.getFullYear(), [], 'week-day')); } viewContainer.appendChild(grid); };
    const renderAgendaView = () => { currentPeriodDisplay.textContent = 'Agenda de Eventos'; const list = document.createElement('div'); list.className = 'agenda-view-list'; const filteredEvents = getFilteredEvents().sort((a, b) => new Date(a.event_date) - new Date(b.event_date)); if (filteredEvents.length === 0) { list.innerHTML = '<p>Nenhum evento encontrado.</p>'; viewContainer.appendChild(list); return; } const groupedEvents = filteredEvents.reduce((acc, event) => { const dateKey = new Date(event.event_date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }); if (!acc[dateKey]) acc[dateKey] = []; acc[dateKey].push(event); return acc; }, {}); for (const dateKey in groupedEvents) { const groupEl = document.createElement('div'); groupEl.className = 'agenda-day-group'; groupEl.innerHTML = `<h3>${dateKey}</h3>`; groupedEvents[dateKey].forEach(event => { const itemEl = document.createElement('div'); itemEl.className = 'agenda-event-item'; itemEl.style.borderLeftColor = event.color; const time = new Date(event.event_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); const { icon, textClass } = getEventStatus(event); itemEl.innerHTML = `<div class="agenda-event-time">${time}</div><div class="agenda-event-details"><p class="agenda-event-name ${textClass}">${event.title}</p><p class="agenda-event-creator">por ${event.creator_name}</p></div><div class="agenda-event-status">${icon}</div>`; itemEl.addEventListener('click', () => openModal(event.event_date, event.id)); groupEl.appendChild(itemEl); }); list.appendChild(groupEl); } viewContainer.appendChild(list); };
    const render = async () => { viewContainer.classList.add('loading'); await new Promise(res => setTimeout(res, 200)); viewContainer.innerHTML = ''; switch (state.currentView) { case 'month': renderMonthView(); break; case 'week': renderWeekView(); break; case 'agenda': renderAgendaView(); break; } renderEventsInGrid(); viewContainer.classList.remove('loading'); lucide.createIcons(); };
    const createDayHeader = (text) => { const header = document.createElement('div'); header.className = 'calendar-header'; header.textContent = text; return header; };
    const addDragAndDropListeners = (element) => { element.addEventListener('dragstart', handleDragStart); element.addEventListener('dragend', handleDragEnd); };
    const handleDragStart = (e) => { e.dataTransfer.setData('text/plain', e.target.dataset.eventId); e.target.classList.add('dragging'); };
    const handleDragEnd = (e) => { e.target.classList.remove('dragging'); };
    const handleDragOver = (e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); };
    const handleDragLeave = (e) => { e.currentTarget.classList.remove('drag-over'); };
    const addTooltipEvents = (element, event) => { element.addEventListener('mousemove', e => { tooltip.textContent = `Criador: ${event.creator_name}\nDescrição: ${event.description || 'Nenhuma'}`; tooltip.style.left = `${e.pageX + 15}px`; tooltip.style.top = `${e.pageY + 15}px`; }); element.addEventListener('mouseenter', () => tooltip.classList.add('visible')); element.addEventListener('mouseleave', () => tooltip.classList.remove('visible')); };
    const closeModal = () => modal.classList.remove('show');
    closeModalBtn.addEventListener('click', closeModal); addEventFab.addEventListener('click', () => openModal(new Date().toISOString().split('T')[0]));
    prevBtn.addEventListener('click', () => { if (state.currentView === 'month') state.currentDate.setMonth(state.currentDate.getMonth() - 1); else if (state.currentView === 'week') state.currentDate.setDate(state.currentDate.getDate() - 7); render(); });
    nextBtn.addEventListener('click', () => { if (state.currentView === 'month') state.currentDate.setMonth(state.currentDate.getMonth() + 1); else if (state.currentView === 'week') state.currentDate.setDate(state.currentDate.getDate() + 7); render(); });
    todayBtn.addEventListener('click', () => { state.currentDate = new Date(); render(); });
    viewSwitcherBtns.forEach(btn => { btn.addEventListener('click', () => { viewSwitcherBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); state.currentView = btn.dataset.view; render(); }); });
    searchInput.addEventListener('input', () => { state.currentView === 'agenda' ? render() : renderEventsInGrid(); }); creatorFilterInput.addEventListener('input', () => { state.currentView === 'agenda' ? render() : renderEventsInGrid(); });
    const showToast = (message) => { toast.innerHTML = `<i data-lucide="bell"></i> ${message}`; lucide.createIcons(); toast.classList.add('show'); notificationSound.play().catch(e => console.log("Interação do usuário necessária para tocar som.")); setTimeout(() => toast.classList.remove('show'), 5000); };
    const getWeekStart = (date) => { const d = new Date(date); const day = d.getDay(); const diff = d.getDate() - day; return new Date(d.setDate(diff)); };
    const isToday = (date) => { const today = new Date(); return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear(); };
    const applyTheme = (theme) => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('theme', theme); };
    themeToggleBtn.addEventListener('click', () => { const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'; applyTheme(newTheme); });

    // --- INICIALIZAÇÃO ---
    applyTheme(localStorage.getItem('theme') || 'light');
    loadEventsFromDB();
    setInterval(checkUpcomingEvents, 30000);

});