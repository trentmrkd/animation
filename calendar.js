let activeCalendars = new Set();
let currentMobileDay = 0;

function initializeCalendar(data) {
    createFilterButtons(data);
    createCalendarView(data);
    initializeMobileView();
}

function createCalendarView(data, filter = null) {
    const calendarBody = document.getElementById('calendar-body');
    const mobileCalendarView = document.getElementById('mobile-calendar-view');
    calendarBody.innerHTML = '';
    mobileCalendarView.innerHTML = '';

    const timeSlots = Array.from({ length: 15 }, (_, i) => i + 6); // 6 AM to 8 PM

    const mobileTimeSlots = {};
    timeSlots.forEach(hour => {
        mobileTimeSlots[hour] = {
            element: document.createElement('div'),
            events: []
        };
        mobileTimeSlots[hour].element.className = 'mobile-time-slot';
        mobileTimeSlots[hour].element.innerHTML = `<h3>${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}</h3>`;
        mobileCalendarView.appendChild(mobileTimeSlots[hour].element);
    });

    timeSlots.forEach(hour => {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.textContent = `${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
        row.appendChild(timeCell);
        for (let day = 0; day < 7; day++) {
            const cell = document.createElement('td');
            cell.className = 'time-slot';
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    });

    data.calendars.forEach(calendar => {
        if (filter && !activeCalendars.has(calendar.id)) return;
        calendar.openHours.forEach(openHour => {
            openHour.daysOfTheWeek.forEach(day => {
                openHour.hours.forEach(hours => {
                    const startRow = hours.openHour - 6;
                    const duration = calendar.slotDuration;
                    const endTime = new Date(new Date().setHours(hours.openHour, hours.openMinute) + duration * 60000);
                    const event = createEventElement(calendar, hours, duration, endTime);
                    const cell = calendarBody.rows[startRow].cells[day === 7 ? 1 : day + 1];
                    placeEventInCell(event, cell);

                    if (day === currentMobileDay) {
                        const mobileEvent = createMobileEventElement(calendar, hours, duration, endTime);
                        mobileTimeSlots[hours.openHour].events.push(mobileEvent);
                    }
                });
            });
        });
    });

    Object.values(mobileTimeSlots).forEach(slot => {
        slot.events.forEach(event => slot.element.appendChild(event));
    });

    updateEmptySlots();
}

function createEventElement(calendar, hours, duration, endTime) {
    const event = document.createElement('a');
    event.href = `https://link.mrkd.io/widget/bookings/${calendar.widgetSlug}`;
    event.className = 'calendar-event';
    event.innerHTML = `${calendar.name}<br><span class="event-duration">${duration} min</span>`;
    event.style.backgroundColor = calendar.eventColor;
    event.style.top = `${(hours.openMinute / 60) * 100}%`;
    event.style.height = `${(duration / 60) * 100}%`;
    return event;
}

function createMobileEventElement(calendar, hours, duration, endTime) {
    const mobileEvent = document.createElement('a');
    mobileEvent.href = `https://link.mrkd.io/widget/bookings/${calendar.widgetSlug}`;
    mobileEvent.className = 'mobile-calendar-event';
    mobileEvent.innerHTML = `
        ${calendar.name}<br>
        <span class="mobile-event-duration">
            ${formatTime(hours.openHour, hours.openMinute)} - ${formatTime(endTime.getHours(), endTime.getMinutes())}
            (${duration} min)
        </span>
    `;
    mobileEvent.style.backgroundColor = calendar.eventColor;
    return mobileEvent;
}

function placeEventInCell(event, cell) {
    const existingEvents = cell.querySelectorAll('.calendar-event');
    if (existingEvents.length > 0) {
        const width = 100 / (existingEvents.length + 1);
        existingEvents.forEach((existing, index) => {
            existing.style.width = `${width}%`;
            existing.style.left = `${width * index}%`;
        });
        event.style.width = `${width}%`;
        event.style.left = `${width * existingEvents.length}%`;
    }
    cell.appendChild(event);
}

function updateEmptySlots() {
    document.querySelectorAll('.time-slot').forEach(slot => {
        if (slot.children.length === 0) {
            slot.classList.add('empty');
        } else {
            slot.classList.remove('empty');
        }
    });
}

function formatTime(hour, minute) {
    return `${hour % 12 || 12}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
}

function createFilterButtons(data) {
    const filterContainer = document.getElementById('calendar-filter');
    filterContainer.innerHTML = ''; // Clear existing filters
    const allButton = document.createElement('button');
    allButton.textContent = 'All';
    allButton.className = 'filter-btn active';
    allButton.onclick = () => filterCalendar('all');
    filterContainer.appendChild(allButton);
    data.calendars.forEach(calendar => {
        const button = document.createElement('button');
        button.textContent = calendar.name;
        button.className = 'filter-btn';
        button.onclick = () => filterCalendar(calendar.id);
        filterContainer.appendChild(button);
    });

    const classSelect = document.getElementById('class-select');
    classSelect.innerHTML = ''; // Clear existing options
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Classes';
    classSelect.appendChild(allOption);
    data.calendars.forEach(calendar => {
        const option = document.createElement('option');
        option.value = calendar.id;
        option.textContent = calendar.name;
        classSelect.appendChild(option);
    });
    classSelect.addEventListener('change', (e) => {
        filterCalendar(e.target.value);
    });
}

function filterCalendar(filterId) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (filterId === 'all') {
        activeCalendars.clear();
        buttons[0].classList.add('active');
    } else {
        activeCalendars.clear();
        activeCalendars.add(filterId);
        event.target.classList.add('active');
    }
    createCalendarView(window.calendarData, filterId !== 'all');
}

function initializeMobileView() {
    const daySelect = document.getElementById('day-select');
    daySelect.addEventListener('change', (e) => {
        currentMobileDay = parseInt(e.target.value);
        createCalendarView(window.calendarData);
    });
}

// This function will be called by calendar-loader.js after fetching the data
function initializeCalendar(data) {
    window.calendarData = data;
    createFilterButtons(data);
    createCalendarView(data);
    initializeMobileView();
}
