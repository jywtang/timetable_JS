// Configuration
const week_start = 1 // from 0 to 6, 1 corresponding to Monday 
const num_weeks = 4
const headings = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]


var currentDate = moment().day(week_start).startOf('day')  // Initialise currentDate to start of week
var table = document.getElementById('timetable')
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    if ((this.readyState == 4 && this.status == 200)) {
        var events = Papa.parse(this.responseText)['data'];
        last_edit = moment(this.getResponseHeader('last-modified'))
        update_cal(events)
    }
}
xhr.open("GET", 'timetable/events.csv');
xhr.send();


function update_cal(events) {
    const events_iter = events.values() //create iterator object
    events_iter.next()                  //skip first row (headers)
    var event = null
    var eventDate = null

    function next_event() {
        event = events_iter.next()
        eventDate = moment(`${event.value[0]}-${event.value[1]}-${event.value[2]}`, 'YYYY-M-DD')
    }

    // Skip events before start of week
    while (!event || (event.done === false && eventDate.isBefore(currentDate))) {
        next_event()
    }

    // Create tr and th tags with headings
    var heading_row = document.createElement("tr")
    for (let day = 0; day < 7; day++) {
        var heading_cell = document.createElement("th");
        heading_cell.innerHTML = headings[(day + week_start)
            % 7];
        heading_row.appendChild(heading_cell)
    }
    table.appendChild(heading_row)


    // Create tr and td tags with dates
    for (let week = 0; week < num_weeks;
        week++) {
        var week_row = document.createElement("tr")
        for (let day = 0; day < 7;  //loop through days in a week
            day++, currentDate.add(1, 'd')) {
            var day_cell = document.createElement("td");

            if (currentDate.isBefore(moment().startOf('day'))) {
                var day_container = document.createElement('del')
            }
            else {
                var day_container = document.createElement('span')
            }
            day_container.innerHTML = currentDate.format("MMM DD");
            console.log
            day_cell.appendChild(day_container)
            while (event.done === false && eventDate.isSame(currentDate)) {
                var event_tag = document.createElement("div")
                event_tag.className = event.value[3]
                const event_tag_content = `${event.value[4]} ${event.value[5]} ${event.value[6]}`
                event_tag.innerHTML = event_tag_content
                day_cell.appendChild(event_tag)
                next_event()
            }
            week_row.appendChild(day_cell)
        }
        table.appendChild(week_row)
    }

    // Update footer
    footer = document.getElementsByTagName("footer")[0]
    footer.innerHTML = last_edit.format("[Last updated: ]D[/]MM[/]YYYY")

}