(function() {
  // Find the calendar container
  var container = document.getElementById('calendar-container');
  
  // Get the subaccount ID from the data attribute
  var subAccountId = container.getAttribute('data-subaccount');

  if (!subAccountId) {
    console.error('No subaccount ID provided in the calendar container data attribute');
    return;
  }

  // Load CSS
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/gh/trentmrkd/animation@main/calendar.css';
  document.head.appendChild(link);

  // Fetch calendar HTML
  fetch('https://cdn.jsdelivr.net/gh/trentmrkd/animation@main/calendar-template.html')
    .then(response => response.text())
    .then(html => {
      // Insert calendar HTML into container
      container.innerHTML = html;

      // Load calendar.js
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/trentmrkd/animation@main/calendar.js';
      script.onload = function() {
        // Fetch calendar data
        fetch(`https://cdn.jsdelivr.net/gh/trentmrkd/animation@main/${subAccountId}.json`)
          .then(response => response.json())
          .then(data => {
            // Initialize calendar with fetched data
            initializeCalendar(data);
          })
          .catch(error => console.error('Error loading calendar data:', error));
      };
      document.head.appendChild(script);
    })
    .catch(error => console.error('Error loading calendar HTML:', error));
})();
