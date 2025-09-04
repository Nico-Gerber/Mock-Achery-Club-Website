<?php
header('Content-Type: application/json');


include('settings.php');

$con = new mysqli($host, $user, $pwd, $sql_db);


if ($con->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Connection failed: " . $con->connect_error]));
}

$sql = "
    SELECT 
      CONCAT(a.Fname, ' ', a.Lname) AS member,
      rsws.Time AS date,
      rsws.RoundScore AS score,
      rsws.RoundName AS round_type,
      a.DefaultBow AS DefaultBow,
      rs.ClassName AS age_bracket 
    FROM RoundShotWithScore rsws
    JOIN Archer a ON rsws.ArcherID = a.ArcherID
   
    JOIN RoundShot rs ON a.ArcherID = rs.ArcherID AND rsws.RoundShotID = rs.RoundShotID
    ORDER BY rsws.Time DESC
";

$result = $con->query($sql);
if (!$result) {
    http_response_code(500);
    die(json_encode(["error" => "SQL error: " . $con->error]));
}

$scores = [];
while ($row = $result->fetch_assoc()) {
    $scores[] = $row;
}

echo json_encode($scores);
$con->close();
?>
