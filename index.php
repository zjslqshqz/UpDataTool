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
<input type="button" id="but" value="按钮">

<script type="text/javascript">


    $("#but").click(function () {
        $.UpDataTool.Up()
    })

</script>
</body>
</html>
