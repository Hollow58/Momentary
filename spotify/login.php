<?php
require_once __DIR__ . '/config.php';

// Start (or resume) the visitor's session so we have a stable session ID
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$params = http_build_query([
    'response_type' => 'code',
    'client_id'     => CLIENT_ID,
    'scope'         => SCOPES,
    'redirect_uri'  => REDIRECT_URI,
    // Pass session ID as state so callback.php knows which user to save tokens for
    'state'         => session_id(),
]);

header('Location: https://accounts.spotify.com/authorize?' . $params);
exit;
