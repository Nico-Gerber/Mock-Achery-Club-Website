<?php
header('Content-Type: application/json');
include('settings.php');
$con = new mysqli($host, $user, $pwd, $sql_db);

if ($con->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connection failed']);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$archerId = isset($input['archerId']) ? $input['archerId'] : '';
$yearBorn = isset($input['yearBorn']) ? $input['yearBorn'] : '';


$sql = "SELECT a.ArcherID, a.Fname, a.Lname, a.YearBorn, a.Gender, a.DefaultBow
        FROM Archer a
      
        WHERE a.ArcherID = ? AND a.YearBorn = ?";

$stmt = $con->prepare($sql);
$stmt->bind_param("is", $archerId, $yearBorn);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user) {
    echo json_encode($user);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
}

$stmt->close();
$con->close();
