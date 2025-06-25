<?php
include_once __DIR__ . '/../core/cors.php';
include_once __DIR__ . '/../config/database.php';

// The text will be sent as a POST request body
$request_body = file_get_contents('php://input');
$data = json_decode($request_body);
$text_to_parse = $data->text ?? '';

if (empty($text_to_parse)) {
    http_response_code(400);
    echo json_encode(['error' => 'No text provided to parse.']);
    exit;
}

$api_key = GEMINI_API_KEY;
$api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' . $api_key;

// Craft the prompt for Gemini
$prompt = "You are an expert event scheduler's assistant. Analyze the following text and extract the event details into a valid JSON object. The JSON object must have the following keys: 'title', 'date', 'location', and 'description'. For the date, provide it in a machine-readable format like YYYY-MM-DD HH:MM:SS. If any detail is missing, set its value to an empty string. Here is the text: \n\n" . $text_to_parse;

$payload = [
    'contents' => [
        [
            'parts' => [
                ['text' => $prompt]
            ]
        ]
    ]
];

// Use cURL to send the request
$ch = curl_init($api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Process the response
header('Content-Type: application/json');

if ($http_code == 200) {
    $result = json_decode($response, true);
    // The model's response is often wrapped in markdown, so we need to extract the JSON part
    $json_str = $result['candidates'][0]['content']['parts'][0]['text'];
    $json_str = str_replace(['```json', '```'], '', $json_str);
    
    // Send the extracted JSON string back to the client
    echo trim($json_str);
} else {
    http_response_code($http_code);
    echo $response;
}
?> 