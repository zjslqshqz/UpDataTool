/**
 * Created by cdd on 2017/7/7.
 */
(function ($) {

    //主插件对象
    $.fn.UpDataTool =  function(options){

        var opt = $.fn.extend({},$.fn.UpDataTool.Mod_Defaults,options); // 参数覆盖

        // 绑定选择对象上的事件
        this.on('click',function () {

            var info = $.fn.UpDataTool.TestOptinos(opt);
            if (info.RS != 1){
                opt.callback_Error(info);
                return false;
            }


            // 检查是否已经创建文件表单对象
            var dom_file_id = $(this).data("input_id");

            if (dom_file_id){

                // 直接激活已经创建的对象
                $("#"+dom_file_id).click();

            }else {
                // 为创建文件表单对象


                //检查插件激活次数
                var Mod_length = $("body").data("UpDataTool_length");

                if (!$.isNumeric(Mod_length)){

                    // 没有数据就初始化为0
                    Mod_length = 0;
                    $("body").data("UpDataTool_length",Mod_length);

                }else {

                    // 绑定后增加,并保存
                    $("body").data("UpDataTool_length",Mod_length++);

                }


                //文件表单ID标示
                var input_id = opt.InputObj+"_"+Mod_length;

                //添加对象
                $("body").append("<input class='"+opt.ModClassName+"' id='"+input_id+"' type='file' accept='"+opt.Accept+"' multiple='true'>");


                // 保存已经新建的文件表单ID
                $(this).data("input_id",input_id);
                // 添加class名
                $(this).addClass("UpDataTool");

                //激活对象
                $("body #"+input_id).click();


                // 根据上传模式 激活上传方式
                switch (opt.SendType){

                    // 选择完成，自动上传，
                    case 1:

                        // 表单选择 绑定事件
                        $("#"+input_id).on('change',function () {

                            // 执行数据上传动作
                            $.fn.UpDataTool.LoadPost_fun(opt,this.files);


                        })

                        break ;

                    // 手动点击上传
                    case 2:

                        // 绑定点击事件
                        $(opt.SendDomObj).on("click",function () {

                            // 执行数据上传动作
                            $.fn.UpDataTool.LoadPost_fun(opt,$("#"+input_id)[0].files);


                        })


                        break ;
                }



            }

        })


    };


    // 数据准备
    $.fn.UpDataTool.DataPost_Fun = function (Optinos,FileData) {

        var infoObj = {};

        // 错误状态
        var errInfo = 0;
        // 循环检查
        $.each(FileData,function (i,o) {

            // 文件类型判断
            if (Optinos.Accept.indexOf(o.type) == '-1'){

                Optinos.callback_Error({RS:-1,Msg:'请选择正确的文件类型'});
                // 修改状态
                errInfo = 1;
                return false;

            }

            var MB = Math.round(o.size * 100 / (1024 * 1024)) / 100;
            var KB = Math.round(o.size * 100 / 1024) / 100;

            // 文件大小判断
            if (o.size > Optinos.FileSize){

                if (MB > 10) {
                    Optinos.callback_Error({RS:-1,Msg:'图片文件不能大于10MB'});
                    // 修改状态
                    errInfo = 1;
                    return false;
                }

            }


        })

        // 判断错误信息
        if (errInfo != 0){
            infoObj.Info = false;
            return infoObj;
        }

        //准备上传数据，新建数据对象
        var fd = new FormData();

        // 循环添加
        for(var key in FileData){

            //使用[append(键值,对象)]方法添加数据，文件对象
            fd.append(Optinos.UpDataKey+'_'+key, FileData[key]);

        }

        //如果额外需要同时发送其他数据，直接使用[append(键值,对象)]方法添加数据;

        //判断是否有额外的内容
        if (!$.isEmptyObject(Optinos.OtherData) && !$.isArray(Optinos.OtherData)){
            //循环枚举对象。obj对象
            for(var key in Optinos.OtherData){
                var obj = Optinos.OtherData[key];
                //添加数据
                if ($.isArray(obj) || $.isPlainObject(obj)){
                    Optinos.callback_Error({RS:-1,Msg:'OtherData:参数数据中值不能为数组或对象类型'});
                    return false;
                }
                fd.append(key, obj);
            }
        }

        //数据准备完毕

        infoObj.Info = true;
        infoObj.Data = fd;

        return infoObj;


    };

    // 数据提交发送
    $.fn.UpDataTool.DataSend_fun = function (Optinos,Data) {

        // 开始
        var LoadStart = function (data) {

            var obj = {};
            obj.RS = 1;
            obj.Msg = '开始';

            Optinos.callback_LoadStart(obj);

        }

        // 数据处理
        var LoadProgress = function (data) {

            var obj = {};

            if (data.lengthComputable) {
                // 计算数值
                obj.RS = 1;
                obj.PercentComplete = Math.round(data.loaded * 100 / data.total);
            }else {
                obj.RS = -1;
                obj.Msg = '无法计算';
            }

            Optinos.callback_LoadProgress(obj);

        }

        // 完成
        var LoadComplete = function (data) {

            var obj = {RS:1,Msg:data.target.responseText}

            Optinos.callback_LoadComplete(obj);
        }

        // 上传发送错误
        var LoadError = function (data) {

            var obj = {}
            obj.RS = -1;
            obj.Msg = '尝试上传文件时出错';

            Optinos.callback_LoadError(obj);

        }

        // 其他情况 取消操作
        var LoadCanceled = function (data) {

            var obj = {}
            obj.RS = -1;
            obj.Msg = '用户已取消上载或浏览器中断连接';

            Optinos.callback_LoadCanceled(obj);

        }


        //新建异步提交方法
        var xhr = new XMLHttpRequest();
        //监听对象声明，绑定事件触发方法

        //loadstart,第一次接收到服务反回值时触发
        xhr.addEventListener("loadstart",LoadStart,false);

        //progress,在接收回返值期间，持续周期性触发，计算进度条主要触发对象
        xhr.upload.addEventListener("progress",LoadProgress, false);

        //load，接收返回值结束后，触发，完成发送任务
        xhr.addEventListener("load",LoadComplete, false);

        //error,发生错误时触发
        xhr.addEventListener("error",LoadError, false);

        //abort,其他情况
        xhr.addEventListener("abort",LoadCanceled, false);
        //打开传输通道，接收对象路径
        xhr.open("POST", Optinos.Server);
        //发送数据
        xhr.send(Data);


    };


    // 数据检查提交操作
    $.fn.UpDataTool.LoadPost_fun = function (Optinos,Data) {

        // 获取对象
        var FilesData = ($.fn.UpDataTool.DataPost_Fun(Optinos,Data));

        // 数据通过检查
        if (FilesData.Info){

            // 发送数据包
            $.fn.UpDataTool.DataSend_fun(Optinos,FilesData.Data);

        }

    };


    // 默认参数
    $.fn.UpDataTool.Mod_Defaults = {

        //上传模式 默认 1 ，自动上传 ， 2 ，手动触发
        SendType : 1,

        //提交按钮对象
        SendDomObj:'',

        //input对象,ID名字
        InputObj : 'Mod_UpDataTool',

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

        //通用错误信息
        callback_Error:function (data) {
            console.log(data);
        },

        //接收到服务器响应后触发
        callback_LoadStart:function (data) {

            console.log(data);
        },

        //接收响应期间持续触发
        callback_LoadProgress:function (data) {


            console.log(data);
        },

        //文件上传完毕时，返回服务器信息
        callback_LoadComplete:function (data) {

            console.log(data);
        },

        //错误信息
        callback_LoadError:function (data) {

            console.log(data);
        },

        //其他
        callback_LoadCanceled:function (data) {

            console.log(data);
        },

        // 本地预览图 返回
        callback_LocalPreview:function (data) {

            console.log(data);
        }




    };


    // 检查参数内容
    $.fn.UpDataTool.TestOptinos = function (Optinos) {

        // $.each(Optinos,function (i,o) {
        //
        //     console.log(o)
        //
        // })
        var obj = {RS:1};

        $.each(Optinos,function (i,o) {

            // 上传模式
            if (i === 'SendType'){
                if (Optinos.SendType === 1 || Optinos.SendType === 2){

                }else {
                    obj.RS = -1;
                    obj.Msg = '参数[SendType]错误：当前只支持两种模式，int[2]手动触发上传事件，int[1]选择图片后自动触发上传事件';

                }
            }


            // 触发上传事件的对象
            if (i === 'SendDomObj'){
                if (Optinos.SendType === 2){

                    // 检查对象是否正确
                    if (Optinos.SendDomObj !== ''){

                    }else {
                        obj.RS = -1;
                        obj.Msg = "参数[SendDomObj]错误：只接受字符类型，如[#id][.className]";

                    }
                }
            }


            // 服务端路径
            if (i === 'Server'){
                if (Optinos.Server === ''){
                    obj.RS = -1;
                    obj.Msg = "参数[Server]错误：请输入正确的服务端接受路径";
                }
            }


            // 是否允许多选
            if (i === 'Multiple'){

                if (typeof (Optinos.Multiple) === 'boolean'){

                }else {

                    obj.RS = -1;
                    obj.Msg = "参数[Multiple]错误：请输入正确的类型[true][false]";

                }
            }


            // 本地预览图是否返回
            if (i === 'LocalPreview'){
                if (typeof (Optinos.LocalPreview) === 'boolean'){

                }else {
                    obj.RS = -1;
                    obj.Msg = "参数[LocalPreview]错误：请输入正确的类型[true][false]";
                }
            }


            // 每个文件的大小限制
            if (i === 'FileSize'){
                if ($.isNumeric(Optinos.FileSize) && Optinos.FileSize > 0){

                }else {
                    obj.RS = -1;
                    obj.Msg = "参数[FileSize]错误：请输入正确的类型int[1048576]";
                }
            }

        })
        return obj;

    }



})(jQuery);