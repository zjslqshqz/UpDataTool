<?php
/**
 * Created by PhpStorm.
 * User: cdd
 * Date: 2017/7/10
 * Time: 下午3:19
 */
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script type="text/javascript" src="jquery-3.2.1.slim.min.js"></script>
    <script type="text/javascript" src="UpData.js"></script>
</head>
<body>
<input type="button" id="open" value="选择">
<input type="button" id="up" value="上传">
<input type="button" id="open1" value="选择2">
<input type="button" id="up1" value="上传2">

<script type="text/javascript">

    $("#open").UpDataTool({
        Accept:"application/pdf",

        OtherData:{
            a:1,
            b:2
        },

        SendType:2,

        Server:"server.php",

        callback_Error:function (data) {

            alert(data);

        },

        callback_LoadStart:function (data) {

            console.log(data);

        },

        callback_LoadProgress:function(data){

            console.log(data);

        },

        callback_LoadComplete:function (data) {

            console.log(data);

        },

        SendDomObj : '#up'
    });

    $("#open1").UpDataTool({
        callback_Error:function (data) {

            console.log(data);

        }
    });


</script>
</body>
</html>
