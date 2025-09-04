<?php
// api/comments.php

header('Content-Type: application/json');

include('settings.php');
$con = new mysqli($host, $user, $pwd, $sql_db);

if ($con->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

if ($method == 'GET') {
    $articleId = isset($_GET['articleId']) ? $_GET['articleId'] : null;

    if (!$articleId) {
        http_response_code(400);
        echo json_encode(["error" => "Missing articleId"]);
        exit;
    }

    $stmt = $con->prepare("
        SELECT 
            c.CommentID,
            c.CommentText,
            c.CommentDate,
            a.ArcherID,
            a.Fname,
            a.Lname,
            a.YearBorn,
            a.Gender
        FROM Comments c
        JOIN Archer a ON c.ArcherID = a.ArcherID
        WHERE c.ArticleID = ?
        ORDER BY c.CommentDate DESC
    ");

    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["error" => "Prepare failed", "details" => $con->error]);
        exit;
    }

    $stmt->bind_param("i", $articleId);
    $stmt->execute();
    $result = $stmt->get_result();
    $comments = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($comments);
}
elseif ($method == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['articleId'], $data['archerId'], $data['commentText'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing data"]);
        exit;
    }

    $stmt = $con->prepare("INSERT INTO Comments (ArticleID, ArcherID, CommentText) VALUES (?, ?, ?)");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["error" => "Prepare failed", "details" => $con->error]);
        exit;
    }

    $stmt->bind_param("iis", $data['articleId'], $data['archerId'], $data['commentText']);
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to save comment"]);
    }
}
else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>
