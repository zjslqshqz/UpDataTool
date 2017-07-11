/**
 * Created by cdd on 2017/7/7.
 */
(function ($) {

    var defaults = {

        //input对象,ID名字
        InputObj : 'ModUploadImgObj',

        //DOM类文件类名字
        ModClassName: 'Mod_UpDataTool',

        //上传文件对象键值，后台获取文件时需要，必须一致
        UpDataKey : 'Mod_UpDataTool_file',

        //如果同时需要额外传输其他数据时，填写。{"key":0,"key":"val"}(键值,参数),不需要，则为空
        OtherData : {},

        //服务端接收路径,传输模式默认为post
        Server : '',

        // 设置或返回指示文件传输的 MIME 类型的列表（逗号分隔）。 默认选择 图片 类型 ，如需选择其他类型，自行查找正确文件类型，传入参数即可
        Accept: 'image/png,image/jpeg',

        //每个文件的大小限制,默认10mb,单位
        FileSize:1048576,

        // 回调方法
        callback:function (data) {

            return data;

        },

        //文件错误 回调
        callback_FileError:function (data) {

            return data;
        },

        //接收到服务器响应后触发
        callback_LoadStart:function (data) {

            console.log('开始')
            return data;
        },
        
        //接收响应期间持续触发
        callback_LoadProgress:function (data) {

            if (data.lengthComputable) {
                // 计算数值
                var percentComplete = Math.round(data.loaded * 100 / data.total);
                console.log(percentComplete)
            }else {
                console.log('无法计算');
            }

            return data;
        },

        //文件上传完毕时，返回服务器信息
        callback_LoadComplete:function (data) {
            console.log('结束')
            return data;
        },

        //错误信息
        callback_LoadError:function (data) {
            return data;
        },

        //其他
        callback_LoadCanceled:function (data) {
            return data;
        }


    }




    $(function () {

        // 准备事件
        $("body").on("change","."+defaults.ModClassName,function () {

            // 获取对象
            var dom = $("body ."+defaults.ModClassName)[0].files;

            var arr = [];
            $.each(dom,function (i,o) {

                arr.push(o);

            });
            DataPost_Fun(arr);

        })

    })

    //主插件对象
    $.UpDataTool =  {

        // 上传方法
        Up: function (opt) {

            defaults = $.extend(defaults,opt); // 参数覆盖


            //添加对象
            $("body").append("<input class='"+defaults.ModClassName+"' id='"+defaults.InputObj+"' type='file' accept='"+defaults.Accept+"' multiple='true'>");
            //激活对象
            $("body #"+defaults.InputObj).click();



        }


    }

    // 数据传输方法
    var DataPost_Fun = function (FileData) {

        // 循环检查
        $.each(FileData,function (i,o) {
            defaults.callback(o);

            // 文件类型判断
            if (defaults.Accept.indexOf(o.type) == '-1'){

                alert('请选择正确的文件类型');
                return false;

            }

            var MB = Math.round(o.size * 100 / (1024 * 1024)) / 100;
            var KB = Math.round(o.size * 100 / 1024) / 100;

            // 文件大小判断
            if (o.size > defaults.FileSize){

                if (MB > 10) {
                    alert("图片文件不能大于10MB");
                }
                return false;
            }

            defaults.callback(MB);
            defaults.callback(KB);

        })


        //准备上传数据，新建数据对象
        var fd = new FormData();

        //使用[append(键值,对象)]方法添加数据，文件对象
        fd.append(defaults.UpDataKey, FileData[0]);

        //如果额外需要同时发送其他数据，直接使用[append(键值,对象)]方法添加数据;

        //判断是否有额外的内容
        if (!$.isEmptyObject(defaults.OtherData)){
            //循环枚举对象。obj对象
            for(var key in defaults.OtherData){
                //添加数据
                fd.append(key, defaults.OtherData[key]);
            }
        }

        //数据准备完毕
        //新建异步提交方法
        var xhr = new XMLHttpRequest();
        //监听对象声明，绑定事件触发方法

        //loadstart,第一次接收到服务反回值时触发
        xhr.addEventListener("loadstart",defaults.callback_LoadStart,false);

        //progress,在接收回返值期间，持续周期性触发，计算进度条主要触发对象
        xhr.upload.addEventListener("progress", defaults.callback_LoadProgress, false);

        //load，接收返回值结束后，触发，完成发送任务
        xhr.addEventListener("load", defaults.callback_LoadComplete, false);

        //error,发生错误时触发
        xhr.addEventListener("error", defaults.callback_LoadError, false);

        //abort,其他情况
        xhr.addEventListener("abort", defaults.callback_LoadCanceled, false);
        //打开传输通道，接收对象路径
        xhr.open("POST", defaults.Server);
        //发送数据
        xhr.send(fd);


    }



//     //  配置数组
//     OpenUpdataModSetArray = {};
//     OpenUpdataModSetArray["inputObj"] = "ModUploadImgObj";//input对象,ID名字
//     OpenUpdataModSetArray["upDataKey"] = "ModUploadObj";//上传文件对象键值，后台获取文件时需要，必须一致
//     OpenUpdataModSetArray["OtherData"] = "";//如果同时需要额外传输其他数据时，填写。{"key":0,"key":"val"}(键值,参数),不需要，则为空
//     OpenUpdataModSetArray["Server"] = "";//服务端接收路径,传输模式默认为post
//
// //  激活
//     function OpenUpdataMOD () {
//         document.getElementById(OpenUpdataModSetArray["inputObj"]).click();
//     }
// //  数据准备发送提交
//     function MODGetFilesDataInfo_fun () {
//         //获取文件对象
//         var file = document.getElementById(OpenUpdataModSetArray["inputObj"]).files[0];
//         //判断是否正确
//         if (file) {
//             var fileSize = 0;
//             //检测文件大小
//             if (file.size > 1024 * 1024){
//                 var l = Math.round(file.size * 100 / (1024 * 1024)) / 100;
//
//                 if (l > 10) {
//                     alert("图片文件不能大于10MB");
//                 };
//                 fileSize = (l).toString() + 'MB';
//             }else{
//                 var l = Math.round(file.size * 100 / 1024) / 100;
//                 fileSize = (l).toString() + 'KB';
//             }
//             //检查文件类型
//             if (file.type != "image/jpeg" && file.type != "image/png") {
//                 MODUploadImgData("请选择图片");
//                 return false;
//             }else{
//                 // console.log('名称: ' + file.name);
//                 // console.log('文件大小: ' + fileSize);
//                 // console.log('文件属性: ' + file.type);
//                 //
//                 //准备上传数据，新建数据对象
//                 var fd = new FormData();
//                 //使用[append(键值,对象)]方法添加数据，文件对象
//                 fd.append(OpenUpdataModSetArray["upDataKey"], file);
//                 //如果额外需要同时发送其他数据，直接使用[append(键值,对象)]方法添加数据;
//                 //判断是否有额外的内容
//                 if (OpenUpdataModSetArray["OtherData"] != "") {
//                     //循环枚举对象。obj对象
//                     for(var key in OpenUpdataModSetArray["OtherData"]){
//                         //添加数据
//                         fd.append(key, OpenUpdataModSetArray["OtherData"][key]);
//                     }
//                 };
//                 //数据准备完毕
//                 //新建异步提交方法
//                 var xhr = new XMLHttpRequest();
//                 //监听对象声明，绑定事件触发方法
//                 xhr.addEventListener("loadstart",Modloadstart,false);//loadstart,第一次接收到服务反回值时触发
//                 xhr.upload.addEventListener("progress", MODuploadProgress, false);//progress,在接收回返值期间，持续周期性触发，计算进度条主要触发对象
//                 xhr.addEventListener("load", MODuploadComplete, false);//load，接收返回值结束后，触发，完成发送任务
//                 xhr.addEventListener("error", MODuploadFailed, false);//error,发生错误时触发
//                 xhr.addEventListener("abort", MODuploadCanceled, false);//abort,其他情况
//                 //打开传输通道，接收对象路径
//                 xhr.open("POST", OpenUpdataModSetArray["Server"]);
//                 //发送数据
//                 xhr.send(fd);
//             }
//         }else{
//             alert("未选择图片");
//         }
//     }
//     /* 文件错误时 */
//     function MODUploadImgData (data) {
//         alert(data);
//     }
//     /* 接收到服务器响应后触发 */
//     function Modloadstart (evt) {
//         $(".LoadingMod").show();
//     }
//     /* 接收响应期间持续触发 */
//     function MODuploadProgress(evt) {
//         if (evt.lengthComputable) {
//             var percentComplete = Math.round(evt.loaded * 100 / evt.total);
//             document.getElementById('ModUpLoadNumber').innerHTML = '上传进度: ' + percentComplete.toString() + '%';
//             $(".LoadingMod .box .jd li").css("width",percentComplete+"%");
//         }else {
//             document.getElementById('ModUpLoadNumber').innerHTML = '无法计算';
//         }
//     }
//     /* 文件上传完毕时，返回服务器信息 */
//     function MODuploadComplete(evt) {
//         //evt.target.responseText   获取服务端返回对象方法
//         $(".LoadingMod").hide();
//         $(".LoadingMod .box .jd li").css("width",0);
//         //
//         ModUpadataRstat_Tager(evt.target.responseText);
//     }
//     /* 错误信息 */
//     function MODuploadFailed(evt) {
//         alert("尝试上传文件时出错");
//     }
//     /* 其他 */
//     function MODuploadCanceled(evt) {
//         alert("用户已取消上载或浏览器中断连接");
//     }
// //////////////////////////////////////////////////////
// //////////////////////////////////////////////////////
//
// // OpenUpdataMOD(); //激活方法
//
// // 服务端返回触发
// // function ModUpadataRstat_Tager (data) {
// //     alert(data);
// // }

})(jQuery);