/**
 * Created by cdd on 2017/7/7.
 */
(function ($) {


    /**
     * 主插件对象
     * @param options 配置参数对象
     * @constructor
     */
    $.fn.UpDataTool =  function(options){

        var opt = $.fn.extend({},$.fn.UpDataTool.Mod_Defaults,options); // 参数覆盖

        // 绑定选择对象上的事件
        this.on('click',function () {

            // 参数检查
            var info = $.fn.UpDataTool.TestOptinos(opt);
            if (info.RS != 1){
                opt.callback_Error(info);
                return false;
            }


            // 检查是否已经创建文件表单对象
            var dom_file_id = $(this).data("input_id");

            if (typeof (dom_file_id) !== 'undefined' && dom_file_id !== ''){

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


                // 是否允许多选
                var m = "";
                if (opt.Multiple){
                    m = "multiple='true'";
                }
                //添加对象
                $("body").append("<input class='"+opt.ModClassName+"' id='"+input_id+"' type='file' accept='"+opt.Accept+"' "+m+">");


                // 保存已经新建的文件表单ID
                $(this).data("input_id",input_id);
                // 添加class名
                $(this).addClass("UpDataTool");

                //激活 filsInput对象
                $("body #"+input_id).click();

                // 绑定对象传输
                var ThisDomData = $(this);


                // 根据上传模式 激活上传方式
                switch (opt.SendType){

                    // 选择完成，自动上传，
                    case 1:

                        // 表单选择 绑定事件
                        $("#"+input_id).on('change',function () {

                            // 执行数据上传动作
                            $.fn.UpDataTool.LoadPost_fun(opt,this.files,ThisDomData);


                        });

                        break ;

                    // 手动点击上传
                    case 2:

                        // 绑定点击事件
                        $(opt.SendDomObj).off("click");
                        $(opt.SendDomObj).on("click",function () {

                            // 执行数据上传动作
                            if ($("#"+input_id).length != 0){
                                $.fn.UpDataTool.LoadPost_fun(opt,$("#"+input_id)[0].files,ThisDomData);
                            }else {
                                opt.callback_LocalPreview({RS:-1,Msg:'请先选择需要上传的文件'});
                            }

                        });


                        // 检查本地预览功能状态
                        if (opt.LocalPreview){

                            // 判断是否文件是否为 png jpg
                            if (opt.Accept.indexOf('png') > -1 || opt.Accept.indexOf('jpeg') > -1 ){

                                // 表单选择 绑定事件
                                $("#"+input_id).on('change',function () {

                                    // 执行数据上传动作
                                    var data = this.files;
                                    $.each(data,function (i,o) {

                                        var reader = new FileReader();
                                        reader.readAsDataURL(o); // file 文件路径
                                        reader.onload = function(e){
                                            // 加载完成后返回地址
                                            opt.callback_LocalPreview({RS:1,Msg:this.result});
                                        }

                                    });

                                });

                            }else {

                                opt.callback_Error({RS:-1,Msg:'本地预览功能，当前只支持图片[png][jpg]格式'});

                            }


                        }


                        break ;
                }



            }

        })


    };


    /**
     * 数据准备
     * @param Optinos 参数配置
     * @param FileData 文件数据白 数组类型
     * @returns {{}} 返回准备上传的数据包
     * @constructor
     */
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
        $.each(FileData,function (i,o) {
            fd.append(Optinos.UpDataKey+'_'+i, o);
        });

        //如果额外需要同时发送其他数据，直接使用[append(键值,对象)]方法添加数据;

        //判断是否有额外的内容
        if (!$.isEmptyObject(Optinos.OtherData) && !$.isArray(Optinos.OtherData)){
            //循环枚举对象。obj对象
            for(var key in Optinos.OtherData){
                var obj = Optinos.OtherData[key];
                //添加数据
                fd.append(key, obj);
            }

        }

        //数据准备完毕

        infoObj.Info = true;
        infoObj.Data = fd;

        return infoObj;


    };

    //
    /**
     * 数据提交发送
     * @param Optinos 配置参数
     * @param Data    准备完成的数据包
     * @param DomData 被激活的绑定对象
     * @constructor
     */
    $.fn.UpDataTool.DataSend_fun = function (Optinos,Data,DomData) {

        // 开始
        var LoadStart = function (data) {

            $("body").append($.fn.UpDataTool.LoadProgressHTML());
            $("#"+Optinos.ModClassName+"_LoadProgress").show();

            var obj = {};
            obj.RS = 1;
            obj.Msg = '开始';

            Optinos.callback_LoadStart(obj);

        }


        // 数据处理中
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

            $("#"+Optinos.ModClassName+"_LoadProgress").css('width',obj.PercentComplete+"%");

            Optinos.callback_LoadProgress(obj);

        }

        // 完成
        var LoadComplete = function (data) {

            // 修改绑定对象相关信息
            // 从对象获取数 fileInput dom ID
            $("#"+DomData.data("input_id")).remove();
            ///
            //  清空 fileInput dom ID
            DomData.data("input_id",'');
            // 删除绑定对象上的class
            DomData.removeClass("UpDataTool");
            // 修改插件数量
            var l = $("body").data("UpDataTool_length");
            if (l == 0){
                $("body").data("UpDataTool_length",'');
            }else {
                $("body").data("UpDataTool_length",l--);
            }
            /// 删除 上传进度块
            $("#"+Optinos.ModClassName+"_LoadProgressHTML_Back").remove();
            $("#"+Optinos.ModClassName+"_LoadProgressHTML").remove();
            ///

            Optinos.callback_LoadComplete(data.target.responseText);
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


    /**
     * 数据检查提交操作
     * @param Optinos 配置参数
     * @param Data    数据包对象
     * @param DomData 被激活的绑定对象
     * @constructor
     */
    $.fn.UpDataTool.LoadPost_fun = function (Optinos,Data,DomData) {

        // 获取对象
        var FilesData = ($.fn.UpDataTool.DataPost_Fun(Optinos,Data));

        // 数据通过检查
        if (FilesData.Info){

            // 发送数据包
            $.fn.UpDataTool.DataSend_fun(Optinos,FilesData.Data,DomData);

        }

    };

    /**
     * 加载条件HTML
     * @returns {string} HTML
     * @constructor
     */
    $.fn.UpDataTool.LoadProgressHTML = function () {

        var html  = '<Div id="'+$.fn.UpDataTool.Mod_Defaults.ModClassName+'_LoadProgressHTML_Back" style="position: fixed; left:0; top: 0; opacity: 0.7; background-color: #fff; width: 100%; height: 100%; z-index: 9;"></Div>' +
            '<DIV class="'+$.fn.UpDataTool.Mod_Defaults.ModClassName+'_LoadHTMLBox" id="'+$.fn.UpDataTool.Mod_Defaults.ModClassName+'_LoadProgressHTML" style=" position: fixed; z-index: 10; top: 30%; left: 25%; z-index: 10; width: 700px; border:2px solid #00a6a6; border-radius: 5px; background-color: #ffffff;">' +
            '<div class="titel" style="width: 90%; padding: 0 5%; line-height: 60px; border-bottom: 1px solid #e7e7e7; font-size: 14px; color: #010101;">上传文件中 </div> ' +
            '<div class="box" style="width: 90%; padding: 0 5%;"> ' +
                '<ul class="jd" style="width: 100%; height: 35px; margin: 0; padding:0;  margin-top: 28px; margin-bottom: 15px; float: left; background-color: #f1f1f1; border: 1px solid #d6d6d6; border-radius: 5px; list-style-type:none;"> ' +
                    '<li id="'+$.fn.UpDataTool.Mod_Defaults.ModClassName+'_LoadProgress" style="width: 0; height: 35px; background-color: #00a6a6; float: left; list-style-type:none;"></li> ' +
                '</ul> ' +
                '<ul class="u2" style="width: 100%; float: left; text-align: center; color: #606060;padding: 0; padding-bottom: 30px; margin: 0;"> ' +
                    '<li class="t" id="" style="font-size: 18px; color: #00a6a6; list-style-type:none;"></li> ' +
                    '<li style="list-style-type:none;">正在更新数据，请不要关闭或刷新页面</li> ' +
                '</ul> ' +
            '</div>' +
            '</DIV>';

        return html;

    };



    /**
     * 默认参数
     */
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

        var obj = {RS:1};

        $.each(Optinos,function (i,o) {

            // 上传模式
            if (i === 'SendType'){
                if (o === 1 || o === 2){

                }else {
                    obj.RS = -1;
                    obj.Msg = '参数[SendType]错误：当前只支持两种模式，int[2]手动触发上传事件，int[1]选择图片后自动触发上传事件';

                }
            }


            // 触发上传事件的对象
            if (i === 'SendDomObj'){
                if (o === 2){

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
                if (o === ''){
                    obj.RS = -1;
                    obj.Msg = "参数[Server]错误：请输入正确的服务端接受路径";
                }
            }


            // 是否允许多选
            if (i === 'Multiple'){

                if (typeof (o) === 'boolean'){

                }else {

                    obj.RS = -1;
                    obj.Msg = "参数[Multiple]错误：请输入正确的类型[true][false]";

                }
            }


            // 本地预览图是否返回
            if (i === 'LocalPreview'){

                if (o === true){

                    if (Optinos.SendType === 2){

                    }else {

                        obj.RS = -1;
                        obj.Msg = "参数[LocalPreview]错误：本地预览功能，只在手动上传模式下开启，请设置参数[SendType]为[2]";

                    }

                }


            }


            // 每个文件的大小限制
            if (i === 'FileSize'){
                if ($.isNumeric(o) && o > 0){

                }else {
                    obj.RS = -1;
                    obj.Msg = "参数[FileSize]错误：请输入正确的类型int[1048576]";
                }
            }

            //其他数据
            if (i === 'OtherData'){

                for(var key in o){

                    if ($.isArray(o[key]) || $.isPlainObject(o[key])){
                        obj.RS = -1;
                        obj.Msg = 'OtherData:参数数据中值不能为数组或对象类型';
                    }

                }

            }


        })
        return obj;

    }



})(jQuery);