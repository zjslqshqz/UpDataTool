/**
 * Created by cdd on 2017/7/7.
 */
(function ($) {

    var Mod_Defaults = {

        //上传模式 默认 1 ，自动上传 ， 2 ，手动触发
        SendType : 1,

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

        //是否允许多选 默认不允许
        Multiple : false,

        // 本地预览图是否返回
        LocalPreview : false,

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
            console.log(data)
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

            console.log(data.target.responseText)
            return data;
        },

        //错误信息
        callback_LoadError:function (data) {
            console.log('尝试上传文件时出错');
            return data;
        },

        //其他
        callback_LoadCanceled:function (data) {
            console.log('用户已取消上载或浏览器中断连接')
            return data;
        },

        // 本地预览图 返回
        callback_LocalPreview:function (data) {

            return data;
        }


    }


    // 数据传输方法
    var DataPost_Fun = function (FileData) {

        // 错误状态
        var errInfo = 0;
        // 循环检查
        $.each(FileData,function (i,o) {
            Mod_Defaults.callback(o);

            // 文件类型判断
            if (Mod_Defaults.Accept.indexOf(o.type) == '-1'){

                Mod_Defaults.callback_FileError('请选择正确的文件类型');
                // 修改状态
                errInfo = 1;
                return false;

            }

            var MB = Math.round(o.size * 100 / (1024 * 1024)) / 100;
            var KB = Math.round(o.size * 100 / 1024) / 100;

            // 文件大小判断
            if (o.size > Mod_Defaults.FileSize){

                if (MB > 10) {
                    alert("图片文件不能大于10MB");
                    // 修改状态
                    errInfo = 1;
                    return false;
                }

            }

            Mod_Defaults.callback(MB);
            Mod_Defaults.callback(KB);

        })

        // 判断错误信息
        if (errInfo != 0){
            return false
        }

        //准备上传数据，新建数据对象
        var fd = new FormData();

        // 循环添加
        for(var key in FileData){

            //使用[append(键值,对象)]方法添加数据，文件对象
            fd.append(Mod_Defaults.UpDataKey+'_'+key, FileData[key]);

        }

        //如果额外需要同时发送其他数据，直接使用[append(键值,对象)]方法添加数据;

        //判断是否有额外的内容
        if (!$.isEmptyObject(Mod_Defaults.OtherData) && !$.isArray(Mod_Defaults.OtherData)){
            //循环枚举对象。obj对象
            for(var key in Mod_Defaults.OtherData){
                var obj = Mod_Defaults.OtherData[key];
                //添加数据
                if ($.isArray(obj) || $.isPlainObject(obj)){
                    alert("OtherData:参数数据中值不能为数组或对象类型");
                    return false;
                }
                fd.append(key, obj);
            }
        }

        //数据准备完毕

        // 检查提交模式
        if (Mod_Defaults.SendType == 1){

            DataSend_fun(fd);

        }


    }

    // 数据提交发送
    var DataSend_fun = function (data) {

        //新建异步提交方法
        var xhr = new XMLHttpRequest();
        //监听对象声明，绑定事件触发方法

        //loadstart,第一次接收到服务反回值时触发
        xhr.addEventListener("loadstart",Mod_Defaults.callback_LoadStart,false);

        //progress,在接收回返值期间，持续周期性触发，计算进度条主要触发对象
        xhr.upload.addEventListener("progress", Mod_Defaults.callback_LoadProgress, false);

        //load，接收返回值结束后，触发，完成发送任务
        xhr.addEventListener("load", Mod_Defaults.callback_LoadComplete, false);

        //error,发生错误时触发
        xhr.addEventListener("error", Mod_Defaults.callback_LoadError, false);

        //abort,其他情况
        xhr.addEventListener("abort", Mod_Defaults.callback_LoadCanceled, false);
        //打开传输通道，接收对象路径
        xhr.open("POST", Mod_Defaults.Server);
        //发送数据
        xhr.send(data);


    }


    $(function () {

        // 准备事件
        $("body").on("change","."+Mod_Defaults.ModClassName,function () {

            // 获取对象
            var dom = $("body ."+Mod_Defaults.ModClassName)[0].files;

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

            Mod_Defaults = $.extend(Mod_Defaults,opt); // 参数覆盖


            //添加对象
            $("body").append("<input class='"+Mod_Defaults.ModClassName+"' id='"+Mod_Defaults.InputObj+"' type='file' accept='"+Mod_Defaults.Accept+"' multiple='true'>");
            //激活对象
            $("body #"+Mod_Defaults.InputObj).click();



        }


    }

})(jQuery);