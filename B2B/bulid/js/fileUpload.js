// var newsrc = '';
// function imgLoad(e) {
//     var oss_url = "https://img.aiucar.cn/";
//     var $this = $(e);
//     $.ajax({
//         url: "/api/oss/get.php?dir=fk",
//         type: "get",
//         async: false,
//         dataType: "json",
//         success: function (arr) {
//             var form = document.getElementById("form");
//             var data = new FormData;
//             var headdata = new FormData(form);
//             var d = new Date();
//             var ImgName = d.getTime() + '' + Math.random() * 1e17;
//             var file = $this.attr("name");
//
//             data.set('key', arr.dir + ImgName + '.jpg');
//             data.set('policy', arr.policy);
//             data.set('OSSAccessKeyId', arr.accessid);
//             data.set('success_action_status', '200');
//             data.set('expire', arr.expire);
//             data.set('host', arr.host);
//             data.set('Signature', arr.signature);
//             data.append("file", headdata.get(file));
//
//             var request = new XMLHttpRequest();
//             request.open("POST", oss_url);
//             request.send(data);
//             request.onreadystatechange = function () {
//                 if (request.readyState == 4 && request.status == 200) {
//
//                     // that.pic2 = arr.dir + ImgName + '.jpg';
//                     //步骤五 如果能够进到这个判断 说明 数据 完美的回来了,并且请求的页面是存在的
//                     imgUrlSubmit(e,arr.dir + ImgName + '.jpg');
//                     // $this.siblings().find('.imgSrc').attr('src', arr.dir + ImgName + '.jpg');
//                     // layer.msg('上传成功！');
//                 }
//             };
//         }
//     });
// }
// function getObjectURL(file){
//     var url = null;
//     if (window.createObjectURL != undefined) { // basic
//         url = window.createObjectURL(file);
//     } else if (window.URL != undefined) { // mozilla(firefox)
//         url = window.URL.createObjectURL(file);
//     } else if (window.webkitURL != undefined) { // webkit or chrome
//         url = window.webkitURL.createObjectURL(file);
//     }
//     return url;
// }
// function imgUrlSubmit(el,url){
//     // var newsrc = this.getObjectURL($("#imgHead")[0].files[0]);
//     newsrc = this.getObjectURL($(el)[0].files[0]);
//
// }
~(function(win){var htmls='<form id="form"><input type="file" name="file" id="" class="imgFiles" style="display: none" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" multiple>'+
    '<div class="header">'+
    '    <span class="imgTitle">'+
    '        上传图片'+
    '    </span>'+
    '    <span class="imgClick">' +
    '       <span style="background: #f5f5f5;padding: 0 5px;" class="hoverRed">选择图片</span>'+
    '    </span>'+
    '    <span class="imgcontent">'+
    '        选择图片'+
    '    </span>'+
    '</div>'+
    '<div class="imgAll">'+
    '    <ul>'+
    '    </ul>'+
    '</div></form>';
var ImgUploadeFiles=function(obj,fn){
    var _this=this;
    this.bom=document.querySelector(obj);
    if(fn)fn.call(_this);
    this.ready();
};
ImgUploadeFiles.prototype={
    init:function(o){
        this.MAX=o.MAX||5;
        this.callback=o.callback;
        this.MW=o.MW||10000;
        this.MH=o.MH||10000;
        },
    ready:function(){
        var _self=this;
        this.dom=document.createElement('div');
        this.dom.className='imgFileUploade';
        this.dom.innerHTML=htmls;
        this.bom.appendChild(this.dom);
        this.files=this.bom.querySelector('.imgFiles');
        this.fileClick=this.bom.querySelector('.imgClick');
        this.fileBtn(this.fileClick,this.files);
        this.imgcontent=this.bom.querySelector('.imgcontent');
        this.imgcontent.innerHTML='可最多上传<b style="color:red">'+this.MAX+'</b>张图片';
        },
    fileBtn:function(c,f){
        var _self=this;
        var _imgAll=$(c).parent().parent().find('.imgAll ul');

        $(c).off().on('click',function(){
            $(f).click();
            $(f).off().on('change',function(){
                var _this=this;
                var oss_url = "https://img.aiucar.cn/";
                var $this = $(_this);
                $.ajax({
                    url: "/api/oss/get.php?dir=fk",
                    type: "get",
                    async: false,
                    dataType: "json",
                    success: function (arr) {
                        var form = document.getElementById("form");
                        var data = new FormData;
                        var headdata = new FormData(form);
                        var d = new Date();
                        var ImgName = d.getTime() + '' + Math.random() * 1e17;
                        var file = $this.attr("name");

                        data.set('key', arr.dir + ImgName + '.jpg');
                        data.set('policy', arr.policy);
                        data.set('OSSAccessKeyId', arr.accessid);
                        data.set('success_action_status', '200');
                        data.set('expire', arr.expire);
                        data.set('host', arr.host);
                        data.set('Signature', arr.signature);
                        data.append("file", headdata.get(file));

                        var request = new XMLHttpRequest();
                        request.open("POST", oss_url);
                        request.send(data);
                        request.onreadystatechange = function () {
                            if (request.readyState == 4 && request.status == 200) {

                                // that.pic2 = arr.dir + ImgName + '.jpg';
                                //步骤五 如果能够进到这个判断 说明 数据 完美的回来了,并且请求的页面是存在的
                                newSrc = arr.dir + ImgName + '.jpg';
                                // $this.siblings().find('.imgSrc').attr('src', arr.dir + ImgName + '.jpg');
                                // layer.msg('上传成功！');
                                _private.startUploadImg(_imgAll,_this.files,_self.MAX,_self.callback,_self.MW,_self.MH,newSrc);
                            }
                        };
                    }
                });

            });
        });
    }
};
var _dataArr=[];
var _private={
    startUploadImg:function(o,files,MAX,callback,W,H,nsrc){
        _dataArr.length=0;
        var _this=this;
        var fileImgArr=[];
        if(files.length>MAX){
            alert('上传数量不能大于'+MAX+'张');
            return false;
        };
        var lens=$(o).find('li').length;
        if(lens>=MAX){alert('上传数量不能大于'+MAX+'张');
        return false;
        };
        for(var i=0,file;file=files[i++];){
            var reader=new FileReader();
            reader.onload=(function(file){return function(ev){
                var image=new Image();
                image.onload=function(){
                    var width=image.width;
                    var height=image.height;
                    fileImgArr.push({fileSrc:ev.target.result,fileName:file.name,fileSize:file.size,height:height,width:width});
                };
                image.src=ev.target.result;};})(file);reader.readAsDataURL(file);}
        var imgTimeSlice=_this.timeChunk(fileImgArr,function(file){
            if(file.width>W||file.height>H){alert('上传图片不能大于'+W+'*'+H+'像素');return false;
            }
            var up=new ImgFileupload(o,file.fileName,file.fileSrc,file.fileSize,callback,nsrc);
            up.init();
            },1);
        imgTimeSlice();
        },
    timeChunk:function(arr,fn,count){
        var obj,t;
        var len=arr.length;
        var start=function(){
            for(var i=0;i<Math.min(count||1,arr.length);i++){
                var obj=arr.shift();
                fn(obj)}
        };return function(){
            t=setInterval(function(){
                if(arr.length===0){return clearInterval(t);
                }
            start();
                },200)}
    }
};
var ImgFileupload=function(b,imgName,imgSrc,imgSize,callback,newsrc){
    this.b=b;
    this.newsrc = newsrc;
    this.imgName=imgName;
    this.imgSize=imgSize;
    this.imgSrc=imgSrc;
    this.callback=callback;
};
var _delId=1;
ImgFileupload.prototype.init=function(){
    _delId++;
    var _self=this;
    this.dom=document.createElement('li');
    this.dom.innerHTML='    <img src="img/login.gif" alt="" value="'+this.newsrc+'" data-src="'+this.imgSrc+'" class="imsg">'+
    '    <i class="delImg">'+
    '        X'+
    '    </i>';
    $(this.dom).attr({'data-delId':_delId,'data-delName':this.imgName});
    $(this.b).append(this.dom);
    var _Img=new Image();
    _Img.src=$(this.dom).find('img').attr('data-src');
    _Img.onload=function(){
        $(_self.dom).find('img').attr('src',_Img.src);
    }
    _dataArr.push({'delId':_delId,src:this.imgSrc});
    _self.callback(_dataArr);
    var _delAll=$(this.b).find('.delImg');
    for(var i=0;i<_delAll.length;i++){
        $(_delAll[i]).off().on('click',function(){$(this).parent().fadeOut('slow',function(){$(this).remove();
        });
        var _deid=$(this).parent().attr('data-delId');
        for(var n=0;n<_dataArr.length;n++){
            if(_dataArr[n].delId==_deid){_dataArr.splice(n,1);}
        }
        _self.callback(_dataArr)});
    };
    var _Imgpreview=$(this.b).find('img');
    for(var k=0;k<_Imgpreview.length;k++){$(_Imgpreview[k]).off().on('click',function(){
        console.log($(this).attr('src'))
    })}
}
    win.ImgUploadeFiles=ImgUploadeFiles;
})(window);