<?php
require_once __DIR__ . '/config.php';

// Start session so we know which user is making this request
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');
header('Cache-Control: no-store');

// Resolve this visitor's token file
$sid       = $_SESSION['sid'] ?? session_id();
$tokenFile = getTokenFile($sid);

// ── Token helpers ──────────────────────────────────────────────────────

function loadTokens() {
    global $tokenFile;
    if (!file_exists($tokenFile)) return null;
    return json_decode(file_get_contents($tokenFile), true);
}

function saveTokens(array $tokens) {
    global $tokenFile;
    file_put_contents($tokenFile, json_encode($tokens));
}

function getAccessToken() {
    $tokens = loadTokens();
    if (!$tokens) return null;

    // Token is still valid
    if (time() < $tokens['expires_at']) {
        return $tokens['access_token'];
    }

    // Refresh
    $postData = http_build_query([
        'grant_type'    => 'refresh_token',
        'refresh_token' => $tokens['refresh_token'],
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

    $resp = @file_get_contents('https://accounts.spotify.com/api/token', false, $context);
    $data = json_decode($resp, true);
    if (!$data || isset($data['error'])) return null;

    $tokens['access_token'] = $data['access_token'];
    $tokens['expires_at']   = time() + $data['expires_in'] - 60;
    if (!empty($data['refresh_token'])) {
        $tokens['refresh_token'] = $data['refresh_token'];
    }
    saveTokens($tokens);
    return $tokens['access_token'];
}

// ── Server-side palette extraction (GD — no client canvas) ───────────────────

$FALLBACK_PALETTE = ['#1c1c1c','#242424','#2e2e2e','#1a1a1a','#222222','#282828'];

function extractPalette(string $imageUrl): array {
    global $FALLBACK_PALETTE;

    if (!extension_loaded('gd')) return $FALLBACK_PALETTE;

    $ctx  = stream_context_create(['http' => ['timeout' => 5]]);
    $blob = @file_get_contents($imageUrl, false, $ctx);
    if (!$blob) return $FALLBACK_PALETTE;

    $src = @imagecreatefromstring($blob);
    if (!$src) return $FALLBACK_PALETTE;

    // Downsample to 50×50 for fast processing
    $sample = imagecreatetruecolor(50, 50);
    imagecopyresampled($sample, $src, 0, 0, 0, 0, 50, 50, imagesx($src), imagesy($src));
    imagedestroy($src);

    // Collect pixels, skip near-black and near-white
    $pixels = [];
    for ($x = 0; $x < 50; $x++) {
        for ($y = 0; $y < 50; $y++) {
            $rgb = imagecolorat($sample, $x, $y);
            $r   = ($rgb >> 16) & 0xFF;
            $g   = ($rgb >>  8) & 0xFF;
            $b   =  $rgb        & 0xFF;
            $brightness = ($r + $g + $b) / 3;
            if ($brightness < 4 || $brightness > 250) continue;
            $pixels[] = [$r, $g, $b];
        }
    }
    imagedestroy($sample);

    if (count($pixels) < 6) {
        // Truly black image — return dark neutral palette
        return ['#1c1c1c','#242424','#2e2e2e','#1a1a1a','#222222','#282828'];
    }

    // K-means, k = 6, 8 iterations
    $k = 6;
    shuffle($pixels);
    $centroids  = array_slice($pixels, 0, $k);
    $n          = count($pixels);
    $assignments = array_fill(0, $n, 0);

    for ($iter = 0; $iter < 8; $iter++) {
        // Assign
        for ($i = 0; $i < $n; $i++) {
            $best = 0; $bestDist = PHP_INT_MAX;
            for ($c = 0; $c < $k; $c++) {
                $dr = $pixels[$i][0] - $centroids[$c][0];
                $dg = $pixels[$i][1] - $centroids[$c][1];
                $db = $pixels[$i][2] - $centroids[$c][2];
                $d  = $dr*$dr + $dg*$dg + $db*$db;
                if ($d < $bestDist) { $bestDist = $d; $best = $c; }
            }
            $assignments[$i] = $best;
        }
        // Update
        $sums   = array_fill(0, $k, [0, 0, 0]);
        $counts = array_fill(0, $k, 0);
        for ($i = 0; $i < $n; $i++) {
            $c = $assignments[$i];
            $sums[$c][0] += $pixels[$i][0];
            $sums[$c][1] += $pixels[$i][1];
            $sums[$c][2] += $pixels[$i][2];
            $counts[$c]++;
        }
        for ($c = 0; $c < $k; $c++) {
            if ($counts[$c] > 0) {
                $centroids[$c] = [
                    $sums[$c][0] / $counts[$c],
                    $sums[$c][1] / $counts[$c],
                    $sums[$c][2] / $counts[$c],
                ];
            } else {
                // Reinitialize empty cluster from random pixel
                $centroids[$c] = $pixels[array_rand($pixels)];
            }
        }
    }

    $palette = [];
    foreach ($centroids as $c) {
        $palette[] = sprintf('#%02x%02x%02x', (int)round($c[0]), (int)round($c[1]), (int)round($c[2]));
    }
    return $palette;
}

// ── Last.fm album art fallback ────────────────────────────────────────────────

/**
 * Try to find album art on Last.fm using artist + track/album name.
 * Returns a URL string on success, or null if nothing is found.
 *
 * @param string $artist
 * @param string $track
 * @param string $album
 * @return string|null
 */
function fetchLastFmArt(string $artist, string $track, string $album): ?string {
    $key = defined('LASTFM_API_KEY') ? LASTFM_API_KEY : '';
    if (!$key || $key === 'your_lastfm_api_key_here') return null;

    // Try album.getInfo first (more accurate art), then track.getInfo as fallback
    $attempts = [];

    if ($album && $album !== 'Local Files' && $album !== '') {
        $attempts[] = http_build_query([
            'method'  => 'album.getinfo',
            'artist'  => $artist,
            'album'   => $album,
            'api_key' => $key,
            'format'  => 'json',
        ]);
    }

    $attempts[] = http_build_query([
        'method'  => 'track.getInfo',
        'artist'  => $artist,
        'track'   => $track,
        'api_key' => $key,
        'format'  => 'json',
    ]);

    $ctx = stream_context_create(['http' => ['timeout' => 4]]);

    foreach ($attempts as $query) {
        $url  = 'https://ws.audioscrobbler.com/2.0/?' . $query;
        $raw  = @file_get_contents($url, false, $ctx);
        if (!$raw) continue;

        $data = json_decode($raw, true);
        if (!$data || isset($data['error'])) continue;

        // album.getinfo response
        $images = $data['album']['image'] ?? $data['track']['album']['image'] ?? [];

        // Pick the largest image (extralarge or mega preferred)
        $best = null;
        foreach ($images as $img) {
            if (!empty($img['#text'])) {
                $best = $img['#text'];
                if (in_array($img['size'], ['extralarge', 'mega'])) break;
            }
        }

        if ($best) return $best;
    }

    return null;
}

// ── Main ──────────────────────────────────────────────────────────────────────

$action = $_GET['action'] ?? 'now-playing';

if ($action === 'status') {
    echo json_encode(['authenticated' => file_exists($tokenFile)]);
    exit;
}

if ($action === 'logout') {
    // Delete the user's token file and destroy their session
    if (file_exists($tokenFile)) {
        unlink($tokenFile);
    }
    session_unset();
    session_destroy();
    echo json_encode(['type' => 'unauthenticated']);
    exit;
}

$token = getAccessToken();
if (!$token) {
    echo json_encode(['type' => 'unauthenticated']);
    exit;
}

// Call Spotify
$context = stream_context_create([
    'http' => [
        'header'        => "Authorization: Bearer {$token}\r\n",
        'timeout'       => 6,
        'ignore_errors' => true,
    ],
]);

$response = @file_get_contents(
    'https://api.spotify.com/v1/me/player/currently-playing',
    false,
    $context
);

// Parse HTTP status from response headers
$httpStatus = 200;
foreach ($http_response_header as $h) {
    if (preg_match('/HTTP\/[\d.]+ (\d+)/', $h, $m)) {
        $httpStatus = (int)$m[1];
    }
}

if ($httpStatus === 204 || !$response) {
    echo json_encode(['type' => 'idle']);
    exit;
}

if ($httpStatus === 401) {
    // Force refresh on next poll
    $tokens = loadTokens();
    if ($tokens) { $tokens['expires_at'] = 0; saveTokens($tokens); }
    echo json_encode(['type' => 'error', 'message' => 'Token expired, retrying…']);
    exit;
}

if ($httpStatus === 429) {
    echo json_encode(['type' => 'error', 'message' => 'Rate limited by Spotify, retrying…']);
    exit;
}

$data = json_decode($response, true);

if (!$data || empty($data['is_playing']) || empty($data['item'])) {
    echo json_encode(['type' => 'idle']);
    exit;
}

$item        = $data['item'];
$albumArtUrl = $item['album']['images'][0]['url'] ?? null;
$isLocal     = !empty($item['is_local']);

// Local files always have id = null — build a unique fingerprint instead
// so back-to-back local tracks are detected as a change.
$trackId = $item['id'] ?? null;
if (!$trackId) {
    $trackId = 'local::' . md5(
        strtolower(trim($item['name'] ?? '')) . '::' .
        strtolower(trim(implode(',', array_column($item['artists'], 'name'))))
    );
}

// If Spotify has no art (local files etc.) try Last.fm as fallback
if (!$albumArtUrl) {
    $albumArtUrl = fetchLastFmArt(
        implode(', ', array_column($item['artists'], 'name')),
        $item['name'],
        $item['album']['name'] ?? ''
    );
}

$palette = $albumArtUrl ? extractPalette($albumArtUrl) : $GLOBALS['FALLBACK_PALETTE'];

echo json_encode([
    'type'       => 'track',
    'id'         => $trackId,
    'title'      => $item['name'],
    'artist'     => implode(', ', array_column($item['artists'], 'name')),
    'album'      => $item['album']['name'] ?? '',
    'albumArt'   => $albumArtUrl,
    'isLocal'    => $isLocal,
    'palette'    => $palette,
    'progressMs' => $data['progress_ms'] ?? 0,
    'durationMs' => $item['duration_ms'] ?? 0,
]);
