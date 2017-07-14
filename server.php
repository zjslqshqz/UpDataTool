<?php
/**
 * Created by PhpStorm.
 * User: cdd
 * Date: 2017/7/11
 * Time: 下午4:10
 */

// 后续将服务端代码，整理改写成类包，进行调用



foreach ($_FILES as $key => $obj){
    var_dump($obj);
}


var_dump($_POST);

// 服务端移动文件方法

/**
 * @param $FileObj 文件对象
 * @param $FileSrc  新的文件路径
 * @param $FileName 文件名称
 * @return bool     返回结果
 */
function FilesMoveUploaded($FileObj, $FileSrc, $FileName){

    // 判断文件路径是否存在
    if (!file_exists($FileSrc)) {
        //创建文件夹
        @mkdir($FileSrc, 0777);
    }
    //移动文件
    $TmpPath = $FileObj["tmp_name"];//取得上传文件。当前的临时路径
    //
    $SavePath = $FileSrc.$FileName;//正式文件路径和名字
    //
    $trace = move_uploaded_file($TmpPath, $SavePath);//将上传的临时文件目录里的文件,立即移动到新的位置进行重命名保存

    // 返回执行结果
    return $trace;

}


?>