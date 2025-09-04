<?php
header('Content-Type: application/json');

include('settings.php');
$con = new mysqli($host, $user, $pwd, $sql_db);


if ($con->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $con->connect_error]);
    exit;
}


$input = json_decode(file_get_contents("php://input"), true);
$commentId = isset($input['commentId']) ? trim($input['commentId']) : '';
$editCommentText = isset($input['editCommentText']) ? trim($input['editCommentText']) : '';


if (!is_numeric($commentId) || $commentId <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid or missing CommentID"]);
    exit;
}


$stmt = $con->prepare("UPDATE Comments SET CommentText = ? WHERE CommentID = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Prepare failed: " . $con->error]);
    exit;
}


$stmt->bind_param("si", $editCommentText, $commentId);


if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["message" => "Comment updated successfully"]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "No comment found with CommentID = $commentId"]);
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Execution failed: " . $stmt->error]);
}

$stmt->close();
$con->close();
?>
