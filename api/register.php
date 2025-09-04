<?php
include('settings.php');

header('Content-Type: application/json');

$con = @mysqli_connect($host, $user, $pwd, $sql_db);
if (!$con) {
    http_response_code(500);
    echo json_encode(['message' => 'Connection failed: ' . mysqli_connect_error()]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $archerId = isset($_POST['archerId']) ? trim($_POST['archerId']) : '';
    $firstName = isset($_POST['firstName']) ? trim($_POST['firstName']) : '';
    $lastName = isset($_POST['lastName']) ? trim($_POST['lastName']) : '';
    $yearBorn = isset($_POST['yearBorn']) ? trim($_POST['yearBorn']) : '';
    $gender = isset($_POST['gender']) ? trim($_POST['gender']) : '';
    $bowtype = isset($_POST['bowtype']) ? trim($_POST['bowtype']) : '';

    
    $checkStmt = $con->prepare("SELECT ArcherID FROM Archer WHERE ArcherID = ?");
    if ($checkStmt === false) {
        http_response_code(500);
        echo json_encode(['message' => 'Error preparing check statement: ' . $con->error]);
        exit;
    }
    $checkStmt->bind_param("i", $archerId);
    $checkStmt->execute();
    $checkStmt->store_result();
    if ($checkStmt->num_rows > 0) {
        http_response_code(400);
        echo json_encode(['Error: Archer ID already exists.']);
        $checkStmt->close();
        exit;
    }
    $checkStmt->close();


    $stmt = $con->prepare("INSERT INTO Archer (ArcherID, Fname, Lname, YearBorn, Gender, DefaultBow) VALUES (?, ?, ?, ?, ?, ?)");
    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(['message' => 'Error preparing statement: ' . $con->error]);
        exit;
    }

 
    $archerIdInt = (int)$archerId;
    $yearBornInt = (int)$yearBorn;
    $stmt->bind_param("ississ", $archerIdInt, $firstName, $lastName, $yearBornInt, $gender, $bowtype);

    
    if ($stmt->execute()) {
        echo json_encode('Signup successful!');
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Error: ' . $stmt->error]);
    }

    $stmt->close();
}

$con->close();
?>