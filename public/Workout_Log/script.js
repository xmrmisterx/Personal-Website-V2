// create server URL variable

// const serverURL = "https://nguyenbo-personal-website.herokuapp.com/api"; 
const serverURL = "https://nguyenbo-website-d62b4830b849.herokuapp.com/api"; 
// const serverURL = "postgres://ue4ladd0heslkf:p885b1ed81a9e330617033050d23165f0a50d441f71d06fa88839040452afb112@caij57unh724n3.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d9uhqmpgn3to31";



// create table and form variables

const table = document.getElementById("workoutsTable");
const addForm = document.getElementById("addForm");

// create row number variable to keep track of the number of rows to dynamically name the button ids

var numberOfRows = 1;

const makeTable = (allRows) => {

    // create table and set id

    var table = document.createElement("table");
    table.id = "workoutsTable";

    // create header row

    var firstRow = document.createElement("tr");

    // create all the header row columns

    var col1 = document.createElement("th"); 
    var col2 = document.createElement("th"); 
    col2.innerHTML = "name";
    var col3 = document.createElement("th"); 
    col3.innerHTML = "reps";
    var col4 = document.createElement("th"); 
    col4.innerHTML = "weight";
    var col5 = document.createElement("th"); 
    col5.innerHTML = "unit";
    var col6 = document.createElement("th"); 
    col6.innerHTML = "date";

    // append columns to first row

    firstRow.appendChild(col1);
    firstRow.appendChild(col2);
    firstRow.appendChild(col3);
    firstRow.appendChild(col4);
    firstRow.appendChild(col5);
    firstRow.appendChild(col6);

    // append first row to table

    table.appendChild(firstRow);

    // make a row for each element in our tableData array

    for (var i=0; i<allRows.length; i++) {
        
        // call makeRow to make each row

        var newRow = makeRow(allRows[i]);

        // increment number of rows variable

        numberOfRows ++;

        // append each new row to the table

        table.appendChild(newRow);
    }

    // get header element

    header1 = document.getElementById("header1");

    // append table to header element

    header1.append(table);
}

const deleteTable = (table) => {

    // delete all rows from the table

    table.remove();
}

const makeRow = (row) => {

    // create a new row

    var newRow = document.createElement("tr");

    // create data cells for each of the 6 columns in the row and append to the new row

    var newCell1 = makeCell("hidden", "id", row.id);
    newRow.appendChild(newCell1);
    var newCell2 = makeCell("text", "name", row.name);
    newRow.appendChild(newCell2);
    var newCell3 = makeCell("number", "reps", row.reps);
    newRow.appendChild(newCell3);
    var newCell4 = makeCell("number", "weight", row.weight);
    newRow.appendChild(newCell4);

    // make radio cells

    var newCell5 = makeRadioCell(newRow, row.unit);
    newRow.appendChild(newCell5);

    // format the date so that only the first 10 characters of the returned date are shown

    formattedDate = formatDate(row.date);

    var newCell6 = makeCell("date", "date", formattedDate);
    newRow.appendChild(newCell6);

    // create edit and delete buttons and append to row

    var editButton = makeEditButton();
    var deleteButton = makeDeleteButton();

    newRow.appendChild(editButton);
    newRow.appendChild(deleteButton);

    // return new row

    return newRow;
    
}

const formatDate = (date) => {

    // only take first then characters of JSON date string

    correct_date = "";
    for (var i=0; i<10; i++) {
        correct_date += date[i];
    }
    
    return correct_date;
}

const makeCell = (type, name, value) => {

    // create a table data element and input element

    var new_cell = document.createElement("td"); 
    var new_input = document.createElement("input");

    // set input type, name, and value, and append input to new cell 

    new_input.type = type;
    new_input.name = name;
    new_input.value = value;
    new_input.id = numberOfRows+name;
    new_cell.append(new_input);

    // return new cell

    return new_cell;
}

const getRadioValue = () => {

    // check if lbs is checked, if so, get that value, otherwise get kgs value

    var lbs = document.getElementById("lbs");
    var kgs = document.getElementById("kgs");
    if (lbs.checked){
        var radioVal = lbs.value;
    }
    else {
        var radioVal = kgs.value;
    }
    return radioVal;
}

const makeRadioCell = (newRow, unitValue) => {

    // create table data element

    cell = document.createElement("td");

    // create form element

    form = document.createElement("form");

    // create 2 label elements and set text

    lbsLabel = document.createElement("label");
    kgsLabel = document.createElement("label");
    lbsLabel.innerHTML = "lbs";
    kgsLabel.innerHTML = "kgs";

    // create lbs and kgs input elements

    lbsInput = document.createElement("input");
    kgsInput = document.createElement("input");

    // create type, name, id, and value properties

    lbsInput.type = "radio";
    lbsInput.name = "unit";
    lbsInput.value = "0";
    lbsInput.id = numberOfRows.toString() + "lbs";

    kgsInput.type = "radio";
    kgsInput.name = "unit";
    kgsInput.value = "1";
    kgsInput.id = numberOfRows.toString() + "kgs";

    // if row.unit value is 0, check the lbs selection, otherwise check the kgs selection

    if (unitValue == 0){
        lbsInput.checked = "checked";
    } else {
        kgsInput.checked = "checked";
    }

    // append input to label, then label to new row

    lbsLabel.appendChild(lbsInput);
    kgsLabel.appendChild(kgsInput);

    newRow.appendChild(lbsLabel);
    newRow.appendChild(kgsLabel);

    // append label to form, then form to cell

    form.appendChild(lbsLabel);
    form.appendChild(kgsLabel);
    cell.appendChild(form);

    // return radio cell 

    return cell;

}

const makeEditButton = () => {

    // create table data and button elements

    var TD = document.createElement("td");
    var editButton = document.createElement("button");

    // set button text and id

    editButton.innerHTML = "Save";
    editButton.id = numberOfRows.toString();

    // add event listener

    editButton.addEventListener("click", function(){

        // update the row with the button id

        onEdit(editButton.id);

        // get new table data, delete old table, and make new table

        (async () => {
            let stringObject = await getData();
            let tableData = JSON.parse(stringObject.results);

            // get table element

            var table = document.getElementById("workoutsTable"); 

            deleteTable(table);

            makeTable(tableData);
        })();
    });

    // append edit button to table data element

    TD.appendChild(editButton);

    // return edit button

    return editButton;

}

const makeDeleteButton = () => {
    
    // create table data and button elements

    var TD = document.createElement("td");
    var deleteButton = document.createElement("button");

    // set button text and id

    deleteButton.innerHTML = "Delete";
    deleteButton.id = numberOfRows.toString();

    // add event listener

    deleteButton.addEventListener("click", function(){

        // delete row with button id

        onDelete(deleteButton.id);

        // get new table data, delete old table, and make new table

        (async () => {
            let stringObject = await getData();
            let tableData = JSON.parse(stringObject.results);

            // get table element

            var table = document.getElementById("workoutsTable"); 

            deleteTable(table);

            makeTable(tableData);
        })();

    });

    // append delete button to table data element

    TD.appendChild(deleteButton);

    // return delete button

    return deleteButton;

}

const getObject = (docElement, rowID=0) => {

    // if row id is 0, then make JSON object for form element

    if (rowID == 0){

        // get form element values

        var name = docElement.name.value;
        var reps = docElement.reps.value;
        var weight = docElement.weight.value;
        var unit = getRadioValue();
        var date = docElement.date.value;

        // create form JSON object and stringify

        var inputObject = {"name":name, "reps":reps, "weight":weight, "unit":unit, "date":date};
        var JSONObject = JSON.stringify(inputObject);


    // if row id is not 0, then make JSON object for table row

    } else {

        // get all the IDs for each table data element in the row

        var nameID = rowID.toString() + "name";
        var repsID = rowID.toString() + "reps";
        var weightID = rowID.toString() + "weight";
        var dateID = rowID.toString() + "date";
        var idID = rowID.toString() + "id";

        // get radio IDs

        var lbsID = rowID.toString() + "lbs";
        var kgsID = rowID.toString() + "kgs";

        // get all the table data elements

        var name = document.getElementById(nameID);
        var reps = document.getElementById(repsID);
        var weight = document.getElementById(weightID);
        var date = document.getElementById(dateID);
        var ID = document.getElementById(idID);

        // get the unit elements

        var lbsInput = document.getElementById(lbsID);
        var kgsInput = document.getElementById(kgsID);

        // determine which radio button is checked to set unit

        if (lbsInput.checked) {
            unit = lbsInput;
        } else {
            unit = kgsInput;
        }

        // create JSON object and stringify

        var inputObject = {"name":name.value, "reps":reps.value, "weight":weight.value, "unit":unit.value, "date":date.value, "id": ID.value};
        var JSONObject = JSON.stringify(inputObject);
    }
    
    // return JSON object

    event.preventDefault();
    return JSONObject;
}

const onEdit = (buttonID) => {

    // send put request to server

    var req = new XMLHttpRequest();
    req.open("PUT", serverURL, false);
    req.setRequestHeader('Content-Type', 'application/json');

    // create JSON object and send

    var JSONObject = getObject(table, buttonID);
    req.send(JSONObject);

    response = JSON.parse(req.responseText);
    // console.log(response);

}
const onDelete = (buttonID) => {

    // send delete request to server

    var req = new XMLHttpRequest();
    req.open("DELETE", serverURL, false);
    req.setRequestHeader('Content-Type', 'application/json');

    // create JSON object and send

    var JSONObject = getObject(table, buttonID);
    req.send(JSONObject);

    response = JSON.parse(req.responseText);
    // console.log(response);
}

const getData = () => {

    var req = new XMLHttpRequest();
    req.open("GET", serverURL, false);
    req.send(null);
    console.log('getData response:', req.responseText);
    var rows = JSON.parse(req.responseText);
    // console.log("rows from getData: ", rows);
    return rows;
}

const insertData = () => {
    var req = new XMLHttpRequest();
    req.open("POST", serverURL, false);
    req.setRequestHeader('Content-Type', 'application/json');
    var JSONObject = getObject(addForm);
    console.log('JSONObject:', JSONObject);
    req.send(JSONObject);
    var rows = JSON.parse(req.responseText)
}

// add event listener to form

addForm.addEventListener("submit", function(){  

    // call insert data

    insertData();

    // get new data back, delete table, and remake table

    (async () => {
        let stringObject = await getData();
        let tableData = JSON.parse(stringObject.results);

        // get table element

        var table = document.getElementById("workoutsTable"); 

        deleteTable(table);

        makeTable(tableData);
    })();

});

// start client application with a get data call into a make table call

(async () => {
    let stringObject = await getData();
    let tableData = JSON.parse(stringObject.results);
    // console.log("tableData: ", tableData);
    makeTable(tableData);
})();

