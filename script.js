var data = [];
var idCounter = 1;
var currentPage=1;
var rowsPerPage=3;
var currentSortColumn="";
var isAscending=true;
// Function to add new data row
function addRow() {
    var name = document.getElementById("nameInput").value;
    var age = document.getElementById("ageInput").value;
    var errorMessage = document.getElementById("errorMessage");

    // Reset error message
    errorMessage.innerText = "";

    // Input Validation
    if (name === "" || age === "") {
        errorMessage.innerText = "All fields are required!";
        return;
    }
    if (!isNaN(name)) {
        errorMessage.innerText = "Name must contain letters!";
        return;
    }
    if (isNaN(age) || age <= 0 || age>120) {
        errorMessage.innerText = "Age must be a number between 1 and 120!";
        return;
    }
    var isDuplicate=data.some(function(entry){
        return entry.name.toLowerCase()===name.toLowerCase();
    });
    if(isDuplicate){
        errorMessage.innerText="Duplicate name is not allowed!";
        return;
    }

    // Add data
    data.push({ id: idCounter, name: name, age: age });
    idCounter++;

    // Refresh the table
    displayTable();

    // Clear input fields
    document.getElementById("nameInput").value = "";
    document.getElementById("ageInput").value = "";
}
function displayTable() {
    var tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    var start = (currentPage - 1) * rowsPerPage;
    var end = start + rowsPerPage;
    var paginatedData = data.slice(start, end);

    for (var i = 0; i < paginatedData.length; i++) {
        var row = `<tr><td>${paginatedData[i].id}</td><td>${paginatedData[i].name}</td><td>${paginatedData[i].age}</td></tr>`;
        tableBody.innerHTML += row;
    }

    displayPagination();
}

// Display pagination buttons
function displayPagination() {
    var paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    var totalPages = Math.ceil(data.length / rowsPerPage);

    for (var i = 1; i <= totalPages; i++) {
        var btn = document.createElement("button");
        btn.innerText = i;
        btn.className = (i === currentPage) ? "active-page" : "";
        btn.addEventListener("click", function () {
            currentPage = parseInt(this.innerText);
            displayTable();
        });
        paginationContainer.appendChild(btn);
    }
    
}
// Function to filter table data
function filterTable() {
    var filter = document.getElementById("searchInput").value.toLowerCase();
    var tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    for (var i = 0; i < data.length; i++) {
        if (data[i].name.toLowerCase().includes(filter) || data[i].age.toString().includes(filter)) {
            var row = "<tr><td>" + data[i].id + "</td><td>" + data[i].name + "</td><td>" + data[i].age + "</td></tr>";
            tableBody.innerHTML += row;
        }
    }
}
function sortTable(column) {
    if (currentSortColumn === column) {
        // Toggle sort order if the same column is clicked
        isAscending = !isAscending;
    } else {
        // Set new column and reset to ascending
        currentSortColumn = column;
        isAscending = true;
    }

    // Sorting logic
    data.sort(function (a, b) {
        if (a[column] < b[column]) return isAscending ? -1 : 1;
        if (a[column] > b[column]) return isAscending ? 1 : -1;
        return 0;
    });

    displayTable(); // Refresh table after sorting
}


// Function to export data to CSV
function exportToCSV() {
    var csvContent = "ID,Name,Age\n";
    for (var i = 0; i < data.length; i++) {
        csvContent += data[i].id + "," + data[i].name + "," + data[i].age + "\n";
    }

    var blob = new Blob([csvContent], { type: "text/csv" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "table_data.csv";
    link.click();
}