<?php
// Suppress all output except JSON
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
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

// Get form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validate inputs
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Sanitize inputs to prevent header injection
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Email configuration
$to = 'enchalewazimeraw12@gmail.com';
$subject = 'New Contact Form Submission from ' . $name;
$body = "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Message:\n$message\n";

// Email headers
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Log the submission to a file for testing (since mail() won't work on localhost without SMTP)
$logFile = __DIR__ . '/contact_submissions.log';
$timestamp = date('Y-m-d H:i:s');
$logEntry = "[$timestamp] Name: $name | Email: $email | Message: $message\n";

if (file_put_contents($logFile, $logEntry, FILE_APPEND)) {
    // Attempt to send email via mail() function
    if (mail($to, $subject, $body, $headers)) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Email sent successfully! I will get back to you soon.'
        ]);
    } else {
        // mail() failed, but log was saved - still report success to user
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Thank you! Your message has been received. I will get back to you soon.'
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to save your message. Please try again later.'
    ]);
}
?>
