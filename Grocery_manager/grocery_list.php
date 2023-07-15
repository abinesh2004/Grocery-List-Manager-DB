<?php
// Establish a connection to the database
$host = "localhost"; // Update with your database host
$username = "root"; // Update with your database username
$password = ""; // Update with your database password
$database = "21bce5275"; // Update with your database name
$conn = mysqli_connect($host, $username, $password, $database);

if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

// Check if the groceryItems data is sent from the client-side
if (isset($_POST['groceryItems'])) {
  // Retrieve the groceryItems JSON string from the client-side
  $groceryItemsJson = $_POST['groceryItems'];

  // Convert the JSON string to an array
  $groceryItems = json_decode($groceryItemsJson, true);

  // Prepare a SQL statement to insert each grocery item into the grocery_items table
  $insertSql = "INSERT INTO grocery_items (name, quantity, price) VALUES ";

  $values = array();
  foreach ($groceryItems as $item) {
    $name = $item['name'];
    $quantity = $item['quantity'];
    $price = $item['price'];

    // Build the values for the SQL statement
    $values[] = "('$name', $quantity, $price)";
  }

  $insertSql .= implode(",", $values);

  // Execute the insert SQL statement
  if (mysqli_query($conn, $insertSql)) {
    // Send a success response
    echo "success";
  } else {
    // Send an error response
    echo "error";
  }
} else {
  // Prepare a SQL statement to retrieve all rows from the grocery_items table
  $selectSql = "SELECT * FROM grocery_items";

  // Execute the select SQL statement
  $result = mysqli_query($conn, $selectSql);

  // Create an array to store the saved grocery list items
  $savedList = array();

  if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
      $item = array(
        "id" => $row['id'],
        "name" => $row['name'],
        "quantity" => intval($row['quantity']),
        "price" => floatval($row['price'])
      );

      $savedList[] = $item;
    }
  }

  // Convert the saved grocery list to JSON format and send the response
  echo json_encode($savedList);
}

// Close the database connection
mysqli_close($conn);
?>
