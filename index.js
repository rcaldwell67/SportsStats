//Page Load Events
//creating database structure
const db = new Dexie("SportsStats App");
//db.version(1).stores({ stats: "++id, stat" });
db.version(1).stores({ stats: "++id, StatId, First_Name, Last_Name, IsActive" });

const form = document.querySelector("#new-task-form");
const input = document.querySelector("#new-task-input");
const statType = document.querySelector("#new-stat-input");
const list_el = document.querySelector("#tasks");

var url = "http://localhost:5000";
var remoteStats;
var localStats;
var array;

// Connect To Database
const getStatsDB = async () => {
    console.log("getStatsDB");
    $.getJSON(url, await function (objArray) {
        //REFERENCE:
        //{recordsets} is the Top Level Object
        // It contains {recordset} which has multiple Arrays of Objects
        // Also contains {recordsets} which has one Array of an Array of Objects
        //console.log("objArray");
        //console.log(objArray);
        //console.log("objArray.recordsets");
        //console.log(objArray.recordsets);
        //console.log("objArray.recordsets Count");
        //console.log(objArray.recordsets.length);
        //console.log("objArray Object Properties/Keys");
        //console.log(Object.keys(objArray));
        //console.log("objArray Object Properties/Keys Count");
        //console.log(Object.keys(objArray).length);
        objectParser(objArray);

        array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        //let myTable = document.querySelector('#statstable');
        let stats = array["recordset"]; // JSON.stringify(objArray)
        
        //console.log(array["recordset"]); //objArray);
        //console.log(stats);
        //console.log("Remote Object: " + stats["0"]);
        remoteStats = stats; // JSON.stringify(objArray["recordsets"])
        /*console.log("Remote Object: " + remoteStats);*/
        var stat = stats["0"]; // stats.sort(objectComparisonCallback)["0"]; //stats.sort.Id;
        //console.log("Remote Stats Count: " + Object.keys(stat).length);
        //console.log("Stats: " + stat.count());
        //console.log("Stats: " + objArray.length);
        console.log("Stats Keys: " + Object.keys(stat));
        //return stat.count().value;
        //remoteStats = Object.keys(stat).length;
        console.log("Remote Stats Count: " + Object.keys(stat).length);

        //Uncomment after figuring out to properly work with Objects
        //getIndexedDB();
        //getStats();
    });
    
}
window.onload = getStatsDB;



//db.syncable.connect(
//    "myProtocol",
//    "https://remote-server/...",
//    { options...})
//    .catch(err => {
//        console.error(`Failed to connect: ${err.stack || err}`);
//    });

//Sync indexedDB with Database
// Populate from AJAX:
function getIndexedDB() {
    console.log("getIndexedDB");
    db.on('ready', function (db) {
        // on('ready') event will fire when database is open but
        // before any other queued operations start executing.
        // By returning a Promise from this event,
        // the framework will wait until promise completes before
        // resuming any queued database operations.
        // Let's start by using the count() method to detect if
        // database has already been populated.
        // If already populated then we need to sync with the Database
        return db.stats.count(function (count) {
            if (count > 0) {
                console.log("Local Stats Count: " + count);
                localStats = db.stats;
                console.log("Local Stats Keys: " + Object.keys(localStats));
                //Local Stats Count: db,_tx,name,schema,hook,core
                //console.log("Local Stats Keys.db: " + Object.keys(localStats));
                console.log("Local Stats Keys Value");
                Object.keys(localStats).forEach(function (key) {
                    console.log(key); // logs keys in myObject
                    console.log(localStats[key]); // logs values in myObject
                });
                console.log("For Loop - localStats.stats");
                for (const index in localStats[stats]) {
                    console.log(localStats[stats][index]);
                    //for (const index2 in localStats.stats[index]) {
                    //    console.log(localStats.stats[index][index2]);
                    //    console.log(localStats.stats[index][index2]["StatId"]);
                    //}
                }

                console.log("Already populated");
                ////Check Database and sync if row count is different
                //var statsDBCount = getStatsDB();
                //console.log("Remote Stats Count: " + remoteStats);
                //console.log("Syncing Database from ajax call...");
                //// We want framework to continue waiting, so we encapsulate
                //// the ajax call in a Promise that we return here.
                //return new Promise(function (resolve, reject) {
                //    $.ajax(url, {
                //        type: 'get',
                //        dataType: 'json',
                //        error: function (xhr, textStatus) {
                //            // Rejecting promise to make db.open() fail.
                //            reject(textStatus);
                //        },
                //        success: function (data) {
                //            // Resolving Promise will launch then() below.
                //            //console.log(data);
                //            resolve(data);
                //        }
                //    });
                //}).then(function (data) {
                //    console.log("Got ajax response. We'll now sync.");
                //    // By returning the a promise, framework will keep
                //    // waiting for this promise to complete before resuming other
                //    // db-operations.
                //    console.log("Calling update() to update/add objects...");
                //    var array = typeof data != 'object' ? JSON.parse(data) : data;
                //    //console.log(array);
                //    let statsData = array["recordsets"];
                //    //console.log(statsData);
                //    var stat = statsData["0"];
                //    //console.log(stat);
                //    console.log("Attempting To Update...");
                //    //return db.stats.bulkAdd(stat); // data.recordsets);
                //    return db.stats.update(stat); // data.recordsets);
                //}).then(function () {
                //    console.log("Done populating.");
                //});
            } else {
                console.log("Database is empty. Populating from ajax call...");
                // We want framework to continue waiting, so we encapsulate
                // the ajax call in a Promise that we return here.
                return new Promise(function (resolve, reject) {
                    $.ajax(url, {
                        type: 'get',
                        dataType: 'json',
                        error: function (xhr, textStatus) {
                            // Rejecting promise to make db.open() fail.
                            reject(textStatus);
                        },
                        success: function (data) {
                            // Resolving Promise will launch then() below.
                            //console.log(data);
                            resolve(data);
                        }
                    });
                }).then(function (data) {
                    console.log("Got ajax response. We'll now add the objects.");
                    // By returning the a promise, framework will keep
                    // waiting for this promise to complete before resuming other
                    // db-operations.
                    console.log("Calling bulkAdd() to insert objects...");
                    var array = typeof data != 'object' ? JSON.parse(data) : data;
                    //console.log(array);
                    let statsData = array["recordsets"];
                    //console.log(statsData);
                    var stat = statsData["0"];
                    //console.log(stat);
                    return db.stats.bulkAdd(stat); // data.recordsets);
                }).then(function () {
                    console.log("Done populating.");
                });
            }
        });
    });
    var test;
    // Following operation will be queued until we're finished populating data:
    db.stats.each(function (obj) {
        // When we come here, data is fully populated and we can log all objects.
        //console.log("Object Keys: " + Object.keys(obj));
        //console.log("Found object: " + JSON.stringify(obj));
        //var array = typeof obj != 'object' ? JSON.parse(obj) : obj;
        //test = typeof obj != 'object' ? JSON.parse(obj) : obj;
        test = JSON.stringify(obj);
        console.log("Local Object: " + test);
        //console.log("Remote Object: " + remoteStats);
        //console.log(JSON.parse(remoteStats.length));
        //console.log("Keys: " + Object.keys(remoteStats));
        //console.log("Keys:");

        //let text = "";
        //for (let i = 0; i < remoteStats.length; i++) {
        //    //text += remoteStats[i] + "<br>";
        //    //console.log(JSON.parse(remoteStats));
        //    console.log("Remote Object: " + Object.getOwnPropertyNames(remoteStats[StatId]));
        //}
        //console.log("Remote Stats Count: " + Object.keys(array["recordsets"]).length);
        console.log("Objects");
        Object.keys(remoteStats).forEach(function (key) {
            console.log(key); // logs keys in myObject
            console.log(remoteStats[key]); // logs values in myObject
        });

        console.log("Arrays");
        for (const index in array) {
            console.log(array[index])
        }
        //console.log(JSON.stringify(remoteStats));
        //if (remoteStats.hasOwnProperty("StatId")) {
        //    console.log(remoteStats.StatId);
        //}
    }).then(function (obj) {
        //console.log("Object Keys: " + Object.keys(obj));
        //console.log("Found object: " + JSON.stringify(obj));
        //var array = typeof obj != 'object' ? JSON.parse(obj) : obj;
        //console.log(array);
        //console.log(test);
        console.log("Finished.");
        getStats();
    }).catch(function (error) {
        // In our each() callback above fails, OR db.open() fails due to any reason,
        // including our ajax call failed, this operation will fail and we will get
        // the error here!
        console.log("Error At The End Of The Line.")
        console.error(error.stack || error);
        // Note that we could also have catched it on db.open() but in this sample,
        // we show it here.
    });
}

//add stat
form.onsubmit = async (event) => {
  event.preventDefault();
  const stat = input.value;
  await db.stats.add({ stat });
    await getStats();
    //getStatsDB();
  form.reset();
};

//display stat
const getStats = async () => {
  //console.log("getStats");
  const allStats = await db.stats.reverse().toArray();
  list_el.innerHTML = allStats
    .map(
      (stat) => `
    
    <div class="task">
    <div class="content">
    <input id="edit" class="text" readonly="readonly" type="text" value= ${stat.StatId}>
    <input id="edit" class="text" readonly="readonly" type="text" value= ${stat.First_Name}>
    <input id="edit" class="text" readonly="readonly" type="text" value= ${stat.Last_Name}>
    <input id="edit" class="text" readonly="readonly" type="text" value= ${stat.IsActive}>
    </div>
    <div class="actions">
    <button class="delete" onclick="deleteStat(event, ${stat.id})">Delete</button>
    </div>
    </div>
    `
    )
        .join("");

    //createStatsTable();
    //getDateTime();
    //await getStatsDB();
};
/*window.onload = getStatsDB;*/

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

//const getStats = async () => {
//function getStatsDB() {
//const getStatsDB = async () => {
//    $.getJSON('http://localhost:5000', function (objArray) {
//        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
//        //let myTable = document.querySelector('#statstable');
//        let stats = array["recordsets"]; // JSON.stringify(objArray)
//        //console.log(stats);
//        //console.log(stats["0"]);
//        var stat = stats["0"]; // stats.sort(objectComparisonCallback)["0"]; //stats.sort.Id;
//        console.log("Remote Stats Count: " + Object.keys(stat).length);
//        //console.log("Stats: " + stat.count());
//        //console.log("Stats: " + objArray.length);
//        //return stat.count().value;
//        remoteStats = Object.keys(stat).length;
//    });
//}
//window.onload = getStatsDB;

function createStatsTable() {
    //clearcontent('statstable'); 
    $.getJSON('http://localhost:5000', function (objArray) {
        
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        //console.log("Stats: " + Object.keys(array["recordsets"]).length);
        //let myTable = document.querySelector('#statstable');
        let stats = array["recordsets"]; // JSON.stringify(objArray)
        //console.log(stats);
        //console.log(stats["0"]);
        //console.log("Stats: " + Object.keys(stats["0"]).length);
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
        //getStats();
        //getStatsDB();
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

function objectParser(objArray) {
    console.log("objectParser");
    console.log("objArray");
    console.log(objArray);
    console.log("objArray.recordsets");
    console.log(objArray.recordsets);
    console.log("objArray.recordsets Count");
    console.log(objArray.recordsets.length);
    console.log("objArray Object Properties/Keys");
    console.log(Object.keys(objArray));
    console.log("objArray Object Properties/Keys Count");
    console.log(Object.keys(objArray).length);
    console.log("For Loop - objArray");
    for (const index in objArray) {
        console.log(objArray[index]);
        //console.log(objArray[index].StatId);
    }
    console.log("For Loop - objArray.recordsets");
    for (const index in objArray.recordsets) {
        console.log(objArray.recordsets[index]);
        //console.log(objArray.recordsets[index]["0"]);
    }
    console.log("For Loop - objArray.recordsets.recordset");
    for (const index in objArray.recordsets) {
        //console.log(objArray.recordsets[index]);
        for (const index2 in objArray.recordsets[index]) {
            console.log(objArray.recordsets[index][index2]);
            console.log(objArray.recordsets[index][index2]["StatId"]);
        }
        
    }
    getIndexedDB();
}