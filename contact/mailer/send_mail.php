<?php
 
$mail_address = 'hiroppied@gmail.com'; //送信先メールアドレスを設定する;
 
//通信を許可する設定;
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: X-Requested-With');
//結果はjsonで返す;
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
 
mb_language('japanese');
mb_internal_encoding('UTF-8');
 
//XMLHttpRequest以外からのアクセスの処理;
if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] !== 'XMLHttpRequest') {
    die(json_encode(array('result' => false), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP));
}
 
$name = trim(rm_indention($_POST['name']));
$email = trim(rm_indention($_POST['email']));
$from = trim(rm_indention($_POST['from']));
$message = trim($_POST['message']);
 
//nameとmessageがあれば。メール送信;
if($name !== '' && $message !== '') {
    $to = $mail_address;
    $subject = rm_indention(trim($_POST['subject']));
    $body = 'Referer: ' . $_SERVER['HTTP_REFERER'] . "\n";
    $body .= 'Name: ' . $name . "\n";
    $body .= 'Email: ' . $email . "\n";
    $body .= "\n" . $message;
    $header = 'From: ' . 'mail@' . $from . "\n";
    if($email !== '') {
        $header .= 'Reply-To: ' . $email . "\n";
    }
    $header .= 'MIME-Version: 1.0' . "\n";
    $parameters = "-f" . $mail_address;
 
    //メール送信;
    $success = mb_send_mail($to, $subject, $body, $header, $parameters);
}else {
    $success = false;
}
$response = array('result' => $success);
echo json_encode($response, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
 
//改行を消す(メールヘッダ・インジェクション対策);
function rm_indention($str) {
    if(isset($str)) {
        str_replace(array("\r\n", "\r", "\n"), '', $str);
    }
    return $str;
}

