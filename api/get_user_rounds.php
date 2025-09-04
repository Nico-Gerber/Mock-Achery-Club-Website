<?php
header('Content-Type: application/json');
include('settings.php');
$con = new mysqli($host, $user, $pwd, $sql_db);

if ($con->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connection failed']);
    exit;
}

$archerId = isset($_GET['archerId']) ? $_GET['archerId'] : '';


$sql = "SELECT rs.RoundShotID, rs.RoundName, rs.Time, rws.RoundScore
        FROM RoundShot rs
        JOIN RoundShotWithScore rws ON rs.RoundShotID = rws.RoundShotID
        WHERE rs.ArcherID = ?
        ORDER BY rs.Time DESC";

$stmt = $con->prepare($sql);
$stmt->bind_param("i", $archerId);
$stmt->execute();

$result = $stmt->get_result();
$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$stmt->close();
$con->close();
