<?php
header('Content-Type: application/json');
include('settings.php');
$con = new mysqli($host, $user, $pwd, $sql_db);

if ($con->connect_error) {
  http_response_code(500);
  echo json_encode(['error' => 'DB connection failed: ' . $con->connect_error]);
  exit;
}

$roundShotId = isset($_GET['roundShotId']) ? intval($_GET['roundShotId']) : 0;

$sql = "
SELECT 
  rwt.RangeShotID,
  rd.Distance AS RangeDistance,
  rd.Face AS RangeDesc,
  rwt.RangeTotal
FROM RangeShotWithTotal rwt
JOIN RangeDef rd ON rwt.RangeID = rd.RangeID
WHERE rwt.RoundShotID = ?
";

$stmt = $con->prepare($sql);
if ($stmt === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Prepare failed: ' . $con->error]);
    exit;
}

$stmt->bind_param("i", $roundShotId);
$stmt->execute();
$result = $stmt->get_result();

$ranges = [];
while ($row = $result->fetch_assoc()) {
  $ranges[] = $row;
}

echo json_encode($ranges);

$stmt->close();
$con->close();
