<?php


header('Content-Type: application/json');


include('settings.php');

$con = new mysqli($host, $user, $pwd, $sql_db);

if ($con->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}



   $input = json_decode(file_get_contents("php://input"), true);
   $commentId = isset($input['commentId']) ? trim($input['commentId']) : '';



$sql = "DELETE FROM Comments    
      
        WHERE Comments.CommentID = ?";

$stmt = $con->prepare($sql);
$stmt->bind_param("i", $commentId);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    http_response_code(200);
    echo json_encode(['success' => true]);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Comment not found']);
}

$stmt->close();
$con->close();
?> 
