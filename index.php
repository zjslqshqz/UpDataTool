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
    <script type="text/javascript" src="UpDataTool.min.js"></script>
</head>
<body>
<input type="button" id="open" value="选择">
<input type="button" id="up" value="上传">
<input type="button" id="open1" value="选择2">

<script type="text/javascript">

    var abc = {id:1};

    $("#open").UpDataTool({
        Accept:"application/pdf",

        SendType:2,

        Server:"server.php",

        event_OtherData:function () {

            return abc;

        },

        callback_Error:function (data) {

            console.log(data);

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

        Server:"server.php",

        callback_Error:function (data) {

            console.log(data.Msg);

        }
    });



</script>
</body>
</html>
