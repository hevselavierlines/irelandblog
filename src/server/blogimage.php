<?php
/**
 * Created by PhpStorm.
 * User: Afaci
 * Date: 04/04/2017
 * Time: 17:19
 */

header('Access-Control-Allow-Origin: *');

$rawdata = file_get_contents('php://input');

$imagename = "image" . date('Y-m-d-H-i-s') . ".jpg";
$folder = 'images/';
$host = "http://www.appc.at/irishblog/";

$splited = explode(',', substr( $rawdata , 5 ) , 2);
$mime=$splited[0];
$data=$splited[1];

$mime_split_without_base64=explode(';', $mime,2);
$mime_split=explode('/', $mime_split_without_base64[0],2);

$imagepath = $folder . $imagename;

file_put_contents($imagepath, base64_decode($data) );

$exif = exif_read_data($imagepath);

if (!empty($exif['Orientation'])) {
    $image = imagecreatefromjpeg ( $imagepath);
    switch ($exif['Orientation']) {
        case 3:
            $image = imagerotate($image, 180, 0);
            break;

        case 6:
            $image = imagerotate($image, -90, 0);
            break;

        case 8:
            $image = imagerotate($image, 90, 0);
            break;
    }
    imagejpeg($image, $imagepath);
}

$result =  array('image' => $host . $imagepath);
print(json_encode($result));
?>