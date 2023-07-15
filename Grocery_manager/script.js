var groceryItems = [];
function addItem() {
  var itemInput = document.getElementById("itemName");
  var quantityInput = document.getElementById("itemQuantity");
  var priceInput = document.getElementById("itemPrice");
  var itemName = itemInput.value.trim();
  var itemQuantity = parseInt(quantityInput.value);
  var itemPrice = parseFloat(priceInput.value);
  if (itemName !== "" && !isNaN(itemQuantity) && !isNaN(itemPrice) && itemQuantity > 0 && itemPrice > 0) {
    var item = {
      name: itemName,
      quantity: itemQuantity,
      price: itemPrice
    };

    groceryItems.push(item);
    displayItems();
    clearInputs();
    calculateTotalCost();
  }
}
function displayItems() {
  var itemsContainer = document.getElementById("itemsContainer");
  itemsContainer.innerHTML = "";
  for (var i = 0; i < groceryItems.length; i++) {
    var item = groceryItems[i];
    var itemElement = document.createElement("div");
    itemElement.className = "item";
    itemElement.innerHTML = "<p>" + item.name + " - Quantity: " + item.quantity + ", Price: Rs." + item.price.toFixed(2) + "</p>";
    itemsContainer.appendChild(itemElement);
  }
}
function clearInputs() {
  document.getElementById("itemName").value = "";
  document.getElementById("itemQuantity").value = "";
  document.getElementById("itemPrice").value = "";
}

function calculateTotalCost() {
  var totalCost = 0;

  for (var i = 0; i < groceryItems.length; i++) {
    var item = groceryItems[i];
    totalCost += item.quantity * item.price;
  }

  var totalCostElement = document.getElementById("totalCost");
  totalCostElement.textContent = totalCost.toFixed(2);
}
function saveList() {
  if (groceryItems.length === 0) {
    alert("No items in the grocery list to save.");
    return;
  }
  var groceryItemsJson = JSON.stringify(groceryItems);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "grocery_list.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (xhr.status === 200) {
      alert("Grocery list saved successfully!");
      // Clear the groceryItems array and reload the saved list
      groceryItems = [];
      displayItems();
      displaySavedList();
    } else {
      alert("Error saving grocery list. Please try again.");
    }
  };
  xhr.send("groceryItems=" + encodeURIComponent(groceryItemsJson));
}
function displaySavedList() {
  var savedListTable = document.getElementById("savedListTable");
  var tableBody = savedListTable.getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "grocery_list.php", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var savedListItems = JSON.parse(xhr.responseText);
      for (var i = 0; i < savedListItems.length; i++) {
        var item = savedListItems[i];
        var row = document.createElement("tr");
        var idCell = document.createElement("td");
        var nameCell = document.createElement("td");
        var quantityCell = document.createElement("td");
        var priceCell = document.createElement("td");
        var actionsCell = document.createElement("td");
        idCell.textContent = i + 1;
        nameCell.textContent = item.name;
        quantityCell.textContent = item.quantity;
        priceCell.textContent = "Rs." + item.price.toFixed(2);
        var updateBtn = document.createElement("button");
        updateBtn.textContent = "Update";
        updateBtn.classList.add("action-button");
        updateBtn.dataset.itemId = i;
        updateBtn.addEventListener("click", updateItem.bind(null, i));
        var deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("action-button");
        deleteBtn.dataset.itemId = i;
        deleteBtn.addEventListener("click", deleteItem.bind(null, i));
        actionsCell.appendChild(updateBtn);
        actionsCell.appendChild(deleteBtn);
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(quantityCell);
        row.appendChild(priceCell);
        row.appendChild(actionsCell);
        tableBody.appendChild(row);
      }
    } else {
      alert("Error retrieving saved grocery list. Please try again.");
    }
  };
  xhr.send();
}
function updateItem(itemId) {
  var item = groceryItems[itemId];
  var itemName = prompt("Enter the updated item name:", item.name);
  var itemQuantity = parseInt(prompt("Enter the updated item quantity:", item.quantity));
  var itemPrice = parseFloat(prompt("Enter the updated item price:", item.price));
  if (itemName !== null && !isNaN(itemQuantity) && !isNaN(itemPrice) && itemQuantity > 0 && itemPrice > 0) {
    item.name = itemName;
    item.quantity = itemQuantity;
    item.price = itemPrice;
    displayItems();
    calculateTotalCost();
    saveList();
  }
}
function deleteItem(itemId) {
  groceryItems.splice(itemId, 1);
  displayItems();
  calculateTotalCost();
  saveList(); 
}
document.getElementById("showAddItemBtn").addEventListener("click", function () {
  var addItemContainer = document.getElementById("addItemContainer");
  var showAddItemBtn = document.getElementById("showAddItemBtn");
  if (addItemContainer.style.display === "none") {
    addItemContainer.style.display = "block";
    showAddItemBtn.textContent = "Hide Add Item";
  } else {
    addItemContainer.style.display = "none";
    showAddItemBtn.textContent = "Add Item";
  }
});
document.getElementById("addItemBtn").addEventListener("click", addItem);
document.getElementById("calculateTotalBtn").addEventListener("click", calculateTotalCost);
document.getElementById("saveListBtn").addEventListener("click", saveList);

// Load the saved grocery list when the page is ready
document.addEventListener("DOMContentLoaded", function () {
  displaySavedList();
});
