<?php
include_once __DIR__ . '/../core/cors.php';
include_once __DIR__ . '/../config/database.php';

$request_body = file_get_contents('php://input');
$data = json_decode($request_body);
$text_to_summarize = $data->text ?? '';

if (empty($text_to_summarize)) {
    http_response_code(400);
    echo json_encode(['error' => 'No text provided to summarize.']);
    exit;
}

$api_key = GEMINI_API_KEY;
$api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' . $api_key;

$prompt = "Summarize the following event description in one or two concise sentences. Here is the text:\n\n" . $text_to_summarize;

$payload = [
    'contents' => [
        [
            'parts' => [
                ['text' => $prompt]
            ]
        ]
    ]
];

$ch = curl_init($api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

header('Content-Type: application/json');

if ($http_code == 200) {
    $result = json_decode($response, true);
    $summary = $result['candidates'][0]['content']['parts'][0]['text'];
    echo json_encode(['summary' => trim($summary)]);
} else {
    http_response_code($http_code);
    echo $response;
}
?> 