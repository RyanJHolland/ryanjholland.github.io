<?php
$curl = curl_init("https://www.haloapi.com/profile/h5/profiles/VetoForBRS/emblem");
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl, CURLOPT_ENCODING, "");
curl_setopt($curl, CURLOPT_HTTPHEADER, array(
"Ocp-Apim-Subscription-Key: 84afd32e2c704a4a850f1216463e9e1a"//just changed this to double quotes so it was easier to see
));
$response = curl_exec($curl);
if ($response === FALSE) {
echo "cURL Error: " . curl_error($curl);
die();
}
curl_close($curl);
die($response);
?>