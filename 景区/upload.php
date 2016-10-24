<?php
use sinacloud\sae\Storage as Storage;

$onOff1 = false;
$onOff2 = false;

test();
fnStorage();

function test(){
    $error =  $video['error'] && $file['error'];
    if($error){
      exit("上传失败");
    }
}

function fnStorage(){
    $s = new Storage();
    if(!$s->getBucket("xiangmu")){
        $s->putBucket("xiangmu",".r:*");
    }

    if($s->putObjectFile($_FILES['video']['tmp_name'], "xiangmu", $_FILES['video']['name'])){
        $onOff1 = true;
    }
    if($s->putObjectFile($_FILES['file']['tmp_name'], "xiangmu", $_FILES['file']['name'])){
        $onOff2 = true;
    }

    if( $onOff1 && $onOff2 ){
      echo "|全部上传成功";
    }else if($onOff1){
      echo "|视频上传成功";
    }else if($onOff2){
      echo "|图片上传成功";
    }else{
      echo "|上传失败";
    }
}

 ?>