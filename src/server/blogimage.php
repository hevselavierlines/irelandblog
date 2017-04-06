<?php
/**
 * Created by PhpStorm.
 * User: Afaci
 * Date: 04/04/2017
 * Time: 17:19
 */

header('Access-Control-Allow-Origin: *');
ini_set ('memory_limit', '800M');

$rawdata = file_get_contents('php://input');

$imagename = "image" . date('Y-m-d-H-i-s') . ".jpg";
$folder = 'images/';
$host = "http://www.appc.at/irishblog/";

$splited = explode(',', substr( $rawdata , 5 ) , 2);

$mime=$splited[0];
$data=$splited[1];
unset($rawdata);

$imagepath = $folder . $imagename;

$base64decode = base64_decode($data);
file_put_contents($imagepath, $base64decode);
unset($data);
unset($base64decode);

$exif = @exif_read_data($imagepath);

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
    imagedestroy($image);
    unset($image);
}


$result =  array('image' => $host . $imagepath);
print(json_encode($result));
?>