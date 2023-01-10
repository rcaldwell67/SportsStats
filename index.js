//creating database structure

const db = new Dexie("SportsStats App");
//db.version(1).stores({ stats: "++id, stat" });
db.version(1).stores({ stats: "++id, StatId, First_Name, Last_Name, IsActive" });

const form = document.querySelector("#new-task-form");
const input = document.querySelector("#new-task-input");
const statType = document.querySelector("#new-stat-input");
const list_el = document.querySelector("#tasks");

//add stat
form.onsubmit = async (event) => {
  event.preventDefault();
  const stat = input.value;
  await db.stats.add({ stat });
  await getStats();
  form.reset();
};

//display stat
const getStats = async () => {
  const allStats = await db.stats.reverse().toArray();
  list_el.innerHTML = allStats
    .map(
      (stat) => `
    
    <div class="task">
    <div class="content">
    <input id="edit" class="text" readonly="readonly" type="text" value= ${stat.StatId}>
    <input id="edit" class="text" readonly="readonly" type="text" value= ${stat.First_Name}>
    </div>
    <div class="actions">
    <button class="delete" onclick="deleteTodo(event, ${stat.id})">Delete</button>
    </div>
    </div>
    `
    )
        .join("");

    createStatsTable();
    //getDateTime();
};
window.onload = getStats;

//delete stat
const deleteStat = async (event, id) => {
  await db.stats.delete(id);
  await getStats();
};

//Create Table
function createTable() {
    let myTable = document.querySelector('#table');
    let employees = [
        { name: 'James', age: 21, country: 'United States' },
        { name: 'Rony', age: 31, country: 'United Kingdom' },
        { name: 'Peter', age: 58, country: 'Canada' },
        { name: 'Marks', age: 20, country: 'Spain' }
    ]
    let headers = ['Name', 'Age', 'Country'];
    // btnGet.addEventListener('click', () => {
    let table = document.createElement('table');
    let headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        let header = document.createElement('th');
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);
    employees.forEach(emp => {
        let row = document.createElement('tr');
        Object.values(emp).forEach(text => {
            let cell = document.createElement('td');
            let textNode = document.createTextNode(text);
            cell.appendChild(textNode);
            row.appendChild(cell);
        })
        table.appendChild(row);
    });
    myTable.appendChild(table);
    //});
}

function createStatsTable() {
    //clearcontent('statstable'); 
    $.getJSON('http://localhost:5000', function (objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        //console.log(objArray);
        //console.log(JSON.stringify(objArray));
        
        //for (var i = 0; i < array.length; i++) {
        //    var text = `ID: ${array[i].Id}<br>
        //                        FirstName: ${array[i].First_Name}<br>
        //                        LasstName: ${array[i].Last_Name}<br>
        //                        IsActive: ${array[i].IsActive}`
        //}
        //var text = `ID: ${data[0].Id}<br>
        //                FirstName: ${data[0].First_Name}<br>
        //                LasstName: ${data[0].Last_Name}<br>
        //                IsActive: ${data[0].IsActive}`


    //    $(".mypanel").html(text);
    /*});*/
        let myTable = document.querySelector('#statstable');

    //let stats = [
    //    { name: 'James', age: 21, country: 'United States' },
    //    { name: 'Rony', age: 31, country: 'United Kingdom' },
    //    { name: 'Peter', age: 58, country: 'Canada' },
    //    { name: 'Marks', age: 20, country: 'Spain' }
    //]
    let stats = array["recordsets"]; // JSON.stringify(objArray)
        //console.log(stats);
        //console.log(stats["0"]);
        var stat = stats["0"]; // stats.sort(objectComparisonCallback)["0"]; //stats.sort.Id;
        //stat.sort();
    let headers = ['Id', 'StatId', 'First_Name', 'Last_Name', 'IsActive'];
    // btnGet.addEventListener('click', () => {
    let table = document.createElement('table');
    let headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        let header = document.createElement('th');
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);
    stat.forEach(emp => {
        let row = document.createElement('tr');
        Object.values(emp).forEach(text => {
            let cell = document.createElement('td');
            let textNode = document.createTextNode(text);
            cell.appendChild(textNode);
            row.appendChild(cell);
        })
        table.appendChild(row);
    });
        //myTable.appendChild(table);
        $("#statstable").html(table);
    });
}

//Date and Time
function getDateTime() {
    $.getJSON('http://time.jsontest.com', function (data) {
        //console.log(data);
        var text1 = `Date: ${data.date}<br>
                    Time: ${data.time}<br>
                    Unix time: ${data.milliseconds_since_epoch}`

        $(".mypanel2").html(text1);
    });
}

//Refresher
var counter = 10;
window.setInterval(function () {
    counter--;
    if (counter >= 0) {
        var span;
        span = document.getElementById("cnt");
        span.innerHTML = counter;
    }
    if (counter === 0) {
        counter = 10;
        getStats();
    }

}, 1000);

//Utils
function clearcontent(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

const objectComparisonCallback = (arrayItemA, arrayItemB) => {
    if (arrayItemA.Id < arrayItemB.Id) {
        return -1
    }

    if (arrayItemA.Id > arrayItemB.Id) {
        return 1
    }

    return 0
}