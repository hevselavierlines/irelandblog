<?php
/**
 * Created by PhpStorm.
 * User: Afaci
 * Date: 04/04/2017
 * Time: 17:19
 */

header('Access-Control-Allow-Origin: *');
ini_set ('memory_limit', '-1');

$rawdata = file_get_contents('php://input');

$imagename = "image" . date('Y-m-d-H-i-s') . rand(1,1000000) . ".jpg";
$folder = 'images/';
$host = "http://www.appc.at/irishblog/";
$imagepath = $folder . $imagename;

$exif = @exif_read_data($rawdata);
$exploded = explode(',', $rawdata, 2);
$encoded = $exploded[1];
$decoded = base64_decode($encoded);
$image = imagecreatefromstring($decoded);

unset($rawdata);
unset($exploded);
unset($encoded);
unset($decoded);

gc_enable();

if (!empty($exif['Orientation'])) {
    if(!empty($exif['ExifImageWidth'])) {
        if($exif['ExifImageWidth'] > 1600) {
            $newimage = imagescale($image, 1600);
            imagedestroy($image);
            $image = $newimage;
        }
    }
    switch ($exif['Orientation']) {
        case 3:
            $newimage = imagerotate($image, 180, 0);
            imagedestroy($image);
            $image = $newimage;
            break;

        case 6:
            $image = imagerotate($image, -90, 0);
            imagedestroy($image);
            $image = $newimage;
            break;

        case 8:
            $image = imagerotate($image, 90, 0);
            imagedestroy($image);
            $image = $newimage;
            break;
    }
}

imagejpeg($image, $imagepath);
imagedestroy($image);
unset($image);

gc_enable();

/*
$splited = explode(',', substr( $rawdata , 5 ) , 2);

$mime=$splited[0];
$data=$splited[1];
unset($rawdata);

$imagepath = $folder . $imagename;

$base64decode = base64_decode($data);
file_put_contents($imagepath, $base64decode);
unset($data);
unset($base64decode);
unset($splited);

$exif = @exif_read_data($imagepath);

$image = imagecreatefromstring($)

if (!empty($exif['Orientation'])) {
    switch ($exif['Orientation']) {
        case 3:
            $image = imagecreatefromjpeg ( $imagepath);
            $imagenew = imagerotate($image, 180, 0);
            break;

        case 6:
            $image = imagecreatefromjpeg ( $imagepath);
            $imagenew = imagerotate($image, -90, 0);
            break;

        case 8:
            $image = imagecreatefromjpeg ( $imagepath);
            $imagenew = imagerotate($image, 90, 0);
            break;
    }

    if(isset($image)) {
        imagejpeg($imagenew, $imagepath);
        imagedestroy($image);
        imagedestroy($imagenew);
        unset($image);
        unset($imagnew);
    }
}*/

$result =  array('image' => $host . $imagepath, 'memusage' => memory_get_usage());
print(json_encode($result));
?>