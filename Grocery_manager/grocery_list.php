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
if (isset($_POST['groceryItems'])) {
  $groceryItemsJson = $_POST['groceryItems'];
  $groceryItems = json_decode($groceryItemsJson, true);
  $insertSql = "INSERT INTO grocery_items (name, quantity, price) VALUES ";

  $values = array();
  foreach ($groceryItems as $item) {
    $name = $item['name'];
    $quantity = $item['quantity'];
    $price = $item['price'];
    $values[] = "('$name', $quantity, $price)";
  }

  $insertSql .= implode(",", $values);
  if (mysqli_query($conn, $insertSql)) {
    echo "success";
  } else {
    echo "error";
  }
} else {
  $selectSql = "SELECT * FROM grocery_items";
  $result = mysqli_query($conn, $selectSql);
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
  echo json_encode($savedList);
}

// Close the database connection
mysqli_close($conn);
?>
