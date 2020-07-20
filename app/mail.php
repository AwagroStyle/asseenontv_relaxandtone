<?php

$recepient = "info@asseenontv.by".",";
$recepient .= "zakazy.all@awagro.by";
$sitename = "Массажёр RelaxAndTone";

$product = trim($_POST["productname"]);
$name = trim($_POST["clientname"]);
$phone = trim($_POST["clientphone"]);
$message = trim($_POST["clientmessage"]);

//$headers = "From: <squishy.by>\r\n"; 

$headers = "From: <web@asseenontv.by>\r\n"; 

$headers .= "Content-type: text/plain; charset=\"utf-8\"\n"; 

$message = "Товар: $product \nИмя клиента: $name \nНомер телефона: $phone \nСообщение: $message";

$pagetitle = "Заявка с сайта \"$sitename\"";
mail($recepient, $pagetitle, $message, $headers);
?>
