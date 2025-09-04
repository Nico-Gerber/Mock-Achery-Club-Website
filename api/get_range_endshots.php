<?php
header('Content-Type: application/json');
include('settings.php');

$con = new mysqli($host, $user, $pwd, $sql_db);

if ($con->connect_error) {
  http_response_code(500);
  echo json_encode(['error' => 'DB connection failed']);
  exit;
}

$rangeShotId = isset($_GET['rangeShotId']) ? intval($_GET['rangeShotId']) : 0;

$sql = "SELECT EndShotID, Arrow1, Arrow2, Arrow3, Arrow4, Arrow5, Arrow6
        FROM EndShot
        WHERE RangeShotID = ?
        ORDER BY EndShotID";

$stmt = $con->prepare($sql);
$stmt->bind_param("i", $rangeShotId);
$stmt->execute();
$result = $stmt->get_result();

$ends = [];
while ($row = $result->fetch_assoc()) {
  $ends[] = $row;
}

echo json_encode($ends);
$stmt->close();
$con->close();
