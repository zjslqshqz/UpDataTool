# UpDataTool 插件说明

### 纯HTML5 JS 文件上传工具，理论上支持所有文件格式

>使用方法

默认方式，选择图片后即自动上传文件

```js
    $("#open1").UpDataTool({

        Server:"server.php",

        callback_Error:function (data) {

            console.log(data.Msg);

        }
    });
```

 手动模式
```js
    $("#open").UpDataTool({
        Accept:"application/pdf",

        OtherData:{
            a:1
        },

        SendType:2,

        Server:"server.php",
        
        SendDomObj : '#up',

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

        }

    });
```

>参数说明

```js
    var Option = {
        
        //==================常用参数
        //上传模式 默认 1 ，自动上传 ， 2 ，手动触发
        SendType : 1,

        //提交按钮对象，手动模式 必须参数
        SendDomObj:'',
        
        //服务端接收路径,传输模式默认为post ,必须参数
        Server : '',
         
        //如果同时需要额外传输其他数据时，填写。{"key":0,"key":"val"}(键值,参数),不需要，则为空
        OtherData : {},
                 
         
        //是否允许多选 默认不允许
        Multiple : false,
                 

        // 本地预览图是否返回
        LocalPreview : false,
                 

        // 设置或返回指示文件传输的 MIME 类型的列表（逗号分隔）。 默认选择 图片 类型 ，如需选择其他类型，自行查找正确文件类型，传入参数即可
        Accept: 'image/png,image/jpeg',
                 
        //====================

        //input对象,ID名字  【默认参数即可，不推荐修改】
        InputObj : 'Mod_UpDataTool',  
        


        //DOM类文件类名字    【默认参数即可，不推荐修改】
        ModClassName: 'Mod_UpDataTool',
        

        //上传文件对象键值，后台获取文件时需要，必须一致 【默认参数即可，不推荐修改】
        // 后台可以使用新的方式获取数据
        UpDataKey : 'Mod_UpDataTool_file',
        


        //每个文件的大小限制,默认10mb,单位
        FileSize:1048576,
        
        //========================回调参数
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
        //========================

    };
```
>该插件需要jqery库支持，低版本浏览器不适用
  
    jqery库推荐使用3.0以上版本

>进度表
- [x] 文件对象选择 
- [x] 数据传输 
- [x] 参数检查
- [X] 图片文件本地预览功能
- [x] 默认加载动作显示
- [ ] 服务端代码整理