<?php
require_once __DIR__ . '/config.php';

if (empty($_GET['code'])) {
    http_response_code(400);
    echo 'Missing authorization code.';
    exit;
}

// Retrieve the session ID we passed as state in login.php
$state = $_GET['state'] ?? '';
$safe  = preg_replace('/[^a-zA-Z0-9_-]/', '', $state);
if (!$safe) {
    http_response_code(400);
    echo 'Invalid state parameter.';
    exit;
}

$postData = http_build_query([
    'grant_type'   => 'authorization_code',
    'code'         => $_GET['code'],
    'redirect_uri' => REDIRECT_URI,
]);

$auth    = base64_encode(CLIENT_ID . ':' . CLIENT_SECRET);
$context = stream_context_create([
    'http' => [
        'method'  => 'POST',
        'header'  => "Authorization: Basic {$auth}\r\n"
                   . "Content-Type: application/x-www-form-urlencoded\r\n",
        'content' => $postData,
    ],
]);

$response = @file_get_contents('https://accounts.spotify.com/api/token', false, $context);
$data     = json_decode($response, true);

if (!$data || isset($data['error'])) {
    http_response_code(500);
    echo 'Authentication failed: ' . ($data['error_description'] ?? 'unknown error');
    exit;
}

// Save tokens to this user's own token file
$tokenFile = getTokenFile($safe);
file_put_contents($tokenFile, json_encode([
    'access_token'  => $data['access_token'],
    'refresh_token' => $data['refresh_token'],
    'expires_at'    => time() + $data['expires_in'] - 60,
]));

// Resume the user's session and store their session ID so api.php can find the file
if (session_status() === PHP_SESSION_NONE) {
    session_id($safe);
    session_start();
}
$_SESSION['sid'] = $safe;

header('Location: ./index.html');
exit;
