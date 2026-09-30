<?php
/**
 * Contact Form Handler
 * Logs submissions and attempts to send via mail()
 * For Gmail SMTP, install PHPMailer: composer require phpmailer/phpmailer
 */

error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get and validate form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Sanitize inputs
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Log the submission to file
$logFile = __DIR__ . '/contact_submissions.log';
$timestamp = date('Y-m-d H:i:s');
$logEntry = "[$timestamp] Name: $name | Email: $email | Message: $message\n";

if (!file_put_contents($logFile, $logEntry, FILE_APPEND)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to process your message']);
    exit;
}

// Attempt to send email via mail()
$to = 'enchalewazimeraw12@gmail.com';
$subject = 'New Contact Form Submission from ' . $name;
$body = "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Message:\n$message\n";

$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Suppress errors and try to send
@mail($to, $subject, $body, $headers);

// Return success (email might fail on localhost, but submission is logged)
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Thank you! Your message has been received. I will get back to you soon.'
]);
?>
