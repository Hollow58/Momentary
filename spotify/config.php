<?php

// Local overrides are loaded first and should never be committed.
if (file_exists(__DIR__ . '/config.local.php')) {
    require_once __DIR__ . '/config.local.php';
}

/**
 * Read a config value from env; fallback to a safe placeholder for local setup.
 */
function envOrDefault(string $key, string $default): string {
    $value = getenv($key);
    if ($value === false || $value === null || trim($value) === '') {
        return $default;
    }
    return $value;
}

// ── Spotify credentials ───────────────────────────────────────────────────────
if (!defined('CLIENT_ID')) {
    define('CLIENT_ID', envOrDefault('SPOTIFY_CLIENT_ID', 'your_spotify_client_id_here'));
}
if (!defined('CLIENT_SECRET')) {
    define('CLIENT_SECRET', envOrDefault('SPOTIFY_CLIENT_SECRET', 'your_spotify_client_secret_here'));
}
if (!defined('REDIRECT_URI')) {
    define('REDIRECT_URI', envOrDefault('SPOTIFY_REDIRECT_URI', 'https://your-domain.example/spotify/callback.php'));
}
if (!defined('SCOPES')) {
    define('SCOPES', 'user-read-currently-playing user-read-playback-state');
}

// Last.fm API key — get one free at https://www.last.fm/api/account/create
if (!defined('LASTFM_API_KEY')) {
    define('LASTFM_API_KEY', envOrDefault('LASTFM_API_KEY', 'your_lastfm_api_key_here'));
}

// Directory where per-user token files are stored.
define('TOKENS_DIR', __DIR__ . '/tokens');

/**
 * Returns the token file path for the given session ID.
 * Creates the tokens directory if it doesn't exist.
 */
function getTokenFile(string $sessionId): string {
    if (!is_dir(TOKENS_DIR)) {
        mkdir(TOKENS_DIR, 0700, true);
    }
    // Only allow alphanumeric + dash/underscore to prevent path traversal
    $safe = preg_replace('/[^a-zA-Z0-9_-]/', '', $sessionId);
    return TOKENS_DIR . '/tokens_' . $safe . '.json';
}
