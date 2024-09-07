(function() {
  // Fetch sub-account ID from script tag data attribute
  var script = document.currentScript;
  var subAccountId = script.getAttribute('data-subaccount-id');

  // Fetch calendar HTML
  fetch('<https://your-domain.com/calendar-template.html>')
    .then(response => response.text())
    .then(html => {
      // Insert calendar HTML into container
      document.getElementById('calendar-container').innerHTML = html;

      // Fetch calendar data
      return fetch(`https://your-api-domain.com/calendar-data/${subAccountId}`);
    })
    .then(response => response.json())
    .then(data => {
      // Initialize calendar with fetched data
      initializeCalendar(data);
    })
    .catch(error => console.error('Error loading calendar:', error));
})();

function initializeCalendar(data) {
  // Your existing calendar initialization code here
  // ...
}
