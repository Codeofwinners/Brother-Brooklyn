<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

$to = 'savvyonlinemarketing@gmail.com';
$subject = 'Brother Brooklyn - Client Onboarding Submission';

// Quick Details fields
$fullName = isset($_POST['full_name']) ? trim($_POST['full_name']) : '';
$clientEmail = isset($_POST['client_email']) ? trim($_POST['client_email']) : '';
$hostingInfo = isset($_POST['hosting_info']) ? trim($_POST['hosting_info']) : '';
$additionalInfo = isset($_POST['additional_info']) ? trim($_POST['additional_info']) : '';

// Collect websites (design inspiration)
$websites = [];
for ($i = 1; $i <= 3; $i++) {
    $val = isset($_POST["website_$i"]) ? trim($_POST["website_$i"]) : '';
    if ($val) $websites[] = $val;
}

// Goals
$goals = isset($_POST['goals']) ? $_POST['goals'] : [];
if (!is_array($goals)) $goals = [$goals];

// Other goals
$otherGoals = isset($_POST['other_goals']) ? trim($_POST['other_goals']) : '';

// Social media
$socials = [
    'Instagram' => isset($_POST['social_instagram']) ? trim($_POST['social_instagram']) : '',
    'TikTok' => isset($_POST['social_tiktok']) ? trim($_POST['social_tiktok']) : '',
    'YouTube' => isset($_POST['social_youtube']) ? trim($_POST['social_youtube']) : '',
    'Facebook' => isset($_POST['social_facebook']) ? trim($_POST['social_facebook']) : '',
    'Twitter / X' => isset($_POST['social_twitter']) ? trim($_POST['social_twitter']) : '',
    'LinkedIn' => isset($_POST['social_linkedin']) ? trim($_POST['social_linkedin']) : '',
];

// Server-side validation (required: full name, email, at least 1 website, at least 1 goal)
$errors = [];
if (empty($fullName)) $errors[] = 'Full name';
if (empty($clientEmail)) $errors[] = 'Gmail address';
if (count($websites) === 0) $errors[] = 'At least 1 website you like';
if (count($goals) === 0) $errors[] = 'At least 1 goal';

if (count($errors) > 0) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields: ' . implode(', ', $errors)]);
    exit;
}

// Handle file uploads
$datestamp = date('Y-m-d_His');
$uploadDir = __DIR__ . '/uploads/' . $datestamp . '/';
$uploadedFiles = [];
$attachments = [];
$fileCategories = ['headshots', 'events', 'bookcover', 'logo'];
$categoryLabels = [
    'headshots' => 'Professional Headshots',
    'events' => 'Event / Speaking Photos',
    'bookcover' => 'Book Cover',
    'logo' => 'BKX Studios Logo',
];

$baseUrl = 'https://bayareaweb.design/brother-brooklyn/onboarding/uploads/' . $datestamp . '/';

foreach ($fileCategories as $cat) {
    if (isset($_FILES[$cat]) && !empty($_FILES[$cat]['name'][0])) {
        $catDir = $uploadDir . $cat . '/';
        if (!is_dir($catDir)) {
            mkdir($catDir, 0755, true);
        }

        $fileCount = count($_FILES[$cat]['name']);
        for ($i = 0; $i < $fileCount; $i++) {
            if ($_FILES[$cat]['error'][$i] === UPLOAD_ERR_OK) {
                $tmpName = $_FILES[$cat]['tmp_name'][$i];
                $origName = basename($_FILES[$cat]['name'][$i]);
                $safeName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $origName);
                $dest = $catDir . $safeName;

                if (move_uploaded_file($tmpName, $dest)) {
                    $uploadedFiles[$cat][] = $safeName;
                    $attachments[] = [
                        'path' => $dest,
                        'name' => $safeName,
                        'category' => $categoryLabels[$cat] ?? $cat,
                    ];
                }
            }
        }
    }
}

// Build email body
$body = "==============================================\n";
$body .= "  BROTHER BROOKLYN - CLIENT ONBOARDING\n";
$body .= "  Submitted: " . date('F j, Y \a\t g:i A T') . "\n";
$body .= "==============================================\n\n";

$body .= "--- CLIENT DETAILS ---\n";
$body .= "  Full Name: $fullName\n";
$body .= "  Email: $clientEmail\n";
if ($hostingInfo) {
    $body .= "  Hosting / Domain Situation: $hostingInfo\n";
}
if ($additionalInfo) {
    $body .= "  Additional Notes: $additionalInfo\n";
}
$body .= "\n";

$body .= "--- DESIGN INSPIRATION (websites they like) ---\n";
foreach ($websites as $i => $w) {
    $body .= "  " . ($i + 1) . ". $w\n";
}
$body .= "\n";

$body .= "--- GOALS (6-12 months) ---\n";
foreach ($goals as $g) {
    $body .= "  - $g\n";
}
if ($otherGoals) {
    $body .= "  Other: $otherGoals\n";
}
$body .= "\n";

$body .= "--- SOCIAL MEDIA ---\n";
foreach ($socials as $platform => $url) {
    $status = $url ? $url : 'Not provided';
    $body .= "  $platform: $status\n";
}
$body .= "\n";

// Asset cloud link
$assetLink = isset($_POST['asset_link']) ? trim($_POST['asset_link']) : '';

$body .= "--- VISUAL ASSETS ---\n";
if (count($uploadedFiles) > 0) {
    foreach ($uploadedFiles as $cat => $files) {
        $label = $categoryLabels[$cat] ?? $cat;
        $body .= "  $label:\n";
        foreach ($files as $f) {
            $downloadUrl = $baseUrl . $cat . '/' . rawurlencode($f);
            $body .= "    - $f\n";
            $body .= "      Download: $downloadUrl\n";
        }
    }
    $body .= "\n  NOTE: Files are also attached to this email.\n";
} else {
    $body .= "  No files uploaded directly\n";
}
if ($assetLink) {
    $body .= "\n  Cloud link (Google Drive / Dropbox): $assetLink\n";
}
$body .= "\n";

$body .= "==============================================\n";
$body .= "  Submitted from: bayareaweb.design/brother-brooklyn/onboarding/\n";
$body .= "==============================================\n";

// Build multipart email with attachments
$boundary = md5(uniqid(time()));

$headers = "From: noreply@bayareaweb.design\r\n";
$headers .= "Reply-To: $clientEmail\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";

if (count($attachments) > 0) {
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

    $message = "--$boundary\r\n";
    $message .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $message .= $body . "\r\n\r\n";

    foreach ($attachments as $att) {
        $filePath = $att['path'];
        $fileName = $att['name'];

        if (file_exists($filePath) && filesize($filePath) < 10 * 1024 * 1024) {
            $fileData = file_get_contents($filePath);
            $fileEncoded = chunk_split(base64_encode($fileData));

            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mimeType = finfo_file($finfo, $filePath);
            finfo_close($finfo);
            if (!$mimeType) $mimeType = 'application/octet-stream';

            $message .= "--$boundary\r\n";
            $message .= "Content-Type: $mimeType; name=\"$fileName\"\r\n";
            $message .= "Content-Transfer-Encoding: base64\r\n";
            $message .= "Content-Disposition: attachment; filename=\"$fileName\"\r\n\r\n";
            $message .= $fileEncoded . "\r\n";
        }
    }

    $message .= "--$boundary--\r\n";
} else {
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $message = $body;
}

$sent = mail($to, $subject, $message, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Onboarding info sent successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send email. Please contact us directly.']);
}
