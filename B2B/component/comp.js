//判断是否为移动端
function isMobile() {

    var ua = navigator.userAgent;

    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),

        isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),

        isAndroid = ua.match(/(Android)\s+([\d.]+)/);

      var  isMobile = isIphone || isAndroid;

    return isMobile;

}
if(isMobile()){
    window.location.href='appPhone.html'
}
function GetQueryStringAtob(name) {
    var decodeDatass = window.location.search.substr(1);//解码
    if(decodeDatass.search("&bsh_bid=") != -1){
        decodeDatass = decodeDatass.split('&bsh_bid=')[0];
    }
    decodeDatass = window.atob(decodeDatass);
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = decodeDatass.match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function GetQueryString(name) {
    var decodeDatass = window.location.search.substr(1);
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = decodeDatass.match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}



function goCollect(e, id) {
    var el = e.currentTarget || e;
    $.ajax({
        url: "/web_api/item/index.php?c=PCGoods&m=UserGoodsCollect&goods_id=" + id,
        type: "get",
        dataType: "json",
        success: function (data) {
            if (data.login_status == 0) {
                vm.loginModel();
            } else {
                if (!$(el).hasClass("active")) {
                    $(el).addClass("active").css("color", "red");
                    layer.msg('收藏成功！', {time: 2000, icon: 6});
                } else {
                    $(el).removeClass("active").css("color", "#949494");
                    layer.msg('取消收藏！', {time: 2000, icon: 5});
                }
            }

        }
    });
}

//loading...

// class="tamp-img" alt="loading" src="bulid/img/ajax-loader-big.gif" data-

// window.onscroll = function () {
//     var bodyScrollHeight = document.documentElement.scrollTop;// body滚动高度
//     var windowHeight = window.innerHeight;// 视窗高度
//     var imgs = document.getElementsByClassName('tamp-img');
//     for (var i = 0; i < imgs.length; i++) {
//         var imgHeight = imgs[i].offsetTop;// 图片距离顶部高度
//         if (imgHeight < windowHeight + bodyScrollHeight - 200) {
//             imgs[i].src = imgs[i].getAttribute('data-src');
//             imgs[i].className = imgs[i].className.replace('tamp-img', '');
//         }
//     }
// };
//公用属性
var vm = new Vue({
    data: {
        cartNum: 1,
        orderNum: 0,
        total: 0,
        Searchtype: 0,
        loginIs: false,
        phoneAdr:'',
        nameAdr:'',
        adrAdr:'',
        checkedNames:'',
        user:{"userName":'','shopCar':'','head_img':'','uId':''},
        //反馈参数
        fkImg:'',
        fkcont:'',
    },
    methods: {
        loginModel:function(){
            layer.open({
                type: 1,
                shade: .3,
                shadeClose: true,
                closeBtn: false,
                title: false, //不显示标题
                content: $("#loginModel"), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
            });
        },
        loginOut: function () {
            $.ajax({
                url: "/web_api/item/index.php?c=PCHome&m=LoginOut",
                type: "get",
                dataType: "json",
                success: function (data) {
                    if (data.status == 1) {
                        window.location.href = 'login.html';
                    } else {
                        layer.msg(data.msg);
                    }
                }
            })
        },
        dorShopDetail:function(pid,id){//子ID 主ID   商品详情
            var url = window.btoa('pid='+pid+'&id='+id);
            window.open('detail.html?'+url);
        },
        clickIndex: function () {
            window.location.href = 'index.html';
        },
        imgHover:function(){
            // 图片放大
            $(function(){
                var x = 10;
                var y = 20;
                $("img.toolimg").mouseover(function(e){
                    var tooltip = "<div id='tooltip'>"+this.alt+"<img style='width: 50px;' src='"+ this.src +"' alt='产品预览图'/><\/div>"; //创建 div 元素
                    $("body").append(tooltip);	//把它追加到文档中
                    $("#tooltip")
                        .css({
                            "top": (e.pageY+y) + "px",
                            "left":  (e.pageX+x)  + "px"
                        }).show("fast");	  //设置x坐标和y坐标，并且显示
                }).mouseout(function(){

                    $("#tooltip").remove();	 //移除
                }).mousemove(function(e){
                    $("#tooltip")
                        .css({
                            "top": (e.pageY+y) + "px",
                            "left":  (e.pageX+x)  + "px"
                        });
                });
            });
        },
        imgHoverBig:function(){
            // 图片放大
            $(function () {
                var x = 10;
                var y = 20;
                $("img.toolimg").mouseover(function (e) {
                    var tooltip = "<div id='tooltip'><img src='" + this.src + "' alt='产品预览图'/><\/div>"; //创建 div 元素
                    $("body").append(tooltip);	//把它追加到文档中
                    $("#tooltip")
                        .css({
                            "top": (e.pageY + y) + "px",
                            "left": (e.pageX + x) + "px"
                        }).show("fast");	  //设置x坐标和y坐标，并且显示
                }).mouseout(function () {

                    $("#tooltip").remove();	 //移除
                }).mousemove(function (e) {
                    $("#tooltip")
                        .css({
                            "top": (e.pageY + y) + "px",
                            "left": (e.pageX + x) + "px"
                        });
                });
            });
        },
        goCart: function (e,form,proId,shopId,type,moId,moZid,num) {
            var that = this;
            var el = e.currentTarget || e;
            var $this = $(el);
            var cart = $('#cartFly');
            var imgtodrag = '';


            $.ajax({
                url:'/web_api/item/index.php?c=PC_shoppingcar&m=shopping_add',
                type:"get",
                data:{
                    'pro_id':proId,
                    'number':(form == 'detail')?detailVue.num:num,
                    'shop_id':shopId,
                    'type':type,
                    'motion_id':moId,
                    'motion_zpid':moZid,
                    'motion_type':(form == 'detail')?num:'',
                },
                dataType:"json",
                success:function(data){
                    if (data.login_status == 0) {
                        vm.loginModel();
                    } else {
                        if(data.status==0){
                            layer.msg(data.msg);
                        }else{
                            that.user.shopCar = 1;
                            if (form == 'detail') {//详情页
                                imgtodrag = $this.find('img');
                                // that.cartNum += detailVue.num;
                            } else {
                                imgtodrag = $this.parent().siblings().find('img');
                                // that.cartNum++;//购物车数量加1
                            }
                            if (imgtodrag) {
                                var imgclone = imgtodrag.clone().offset({
                                    top: imgtodrag.offset().top,
                                    left: imgtodrag.offset().left
                                }).css({
                                    'opacity': '0.5',
                                    'position': 'absolute',
                                    'height': '100px',
                                    'width': '100px',
                                    'z-index': '99999'
                                }).appendTo($('body')).animate({
                                    'top': cart.offset().top,
                                    'left': cart.offset().left,
                                    'width': 35,
                                    'height': 35
                                }, 500, 'linear');
                                imgclone.animate({
                                    'width': 0,
                                    'height': 0
                                }, function () {
                                    $(this).detach();
                                });

                            }
                        }
                    }
                }
            });


        },
        inputAll: function (e) {
            var el = e.currentTarget;
            if ($(el).is(":checked")) {
                $(el).parents('table').find("input[type=checkbox]:not('.isDel')").prop("checked", true);
            } else {
                $(el).parents('table').find("input[type=checkbox]:not('.isDel')").prop("checked", false);
            }
            this.inputNum();
        },
        inputTwo: function (e) {
            var el = e.currentTarget;
            if ($(el).is(":checked")) {
                $(el).parents('tbody').find(".inputOne:not('.isDel')").prop("checked", true);
            } else {
                $(el).parents('tbody').find(".inputOne:not('.isDel')").prop("checked", false);
            }
            this.inputNum();
        },
        addAdr:function(){//新增地址
            var that = this;
            var province = $(".pick-province").html();//省
            var city = $(".pick-city").html();//市
            var county = $(".pick-county").html();//县

            if(vm.nameAdr==""){
                layer.msg('请输入姓名！');
            }else if(vm.phoneAdr==""){
                layer.msg('请输入手机号码！');
            }else if(province=="请选择省"||city=="请选择市"||county=="请选择县"){
                layer.msg('请输入地址！');
            }else {
                $.ajax({
                    url: "/web_api/item/index.php?c=PC_address&m=add_address",
                    async: true,
                    data: {
                        'name': vm.nameAdr,
                        'mobile': vm.phoneAdr,
                        'province': province,
                        'city': city,
                        'area': county,
                        'address': vm.adrAdr,
                        'id': '-1'
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data.login_status == 0) {
                            vm.loginModel();
                        } else {
                            if (data.status == 1) {
                                layer.msg(data.msg,{
                                    time:2000,
                                    end:function () {
                                        location.reload();
                                    }
                                });
                            } else {
                                layer.msg(data.msg);
                            }

                        }
                    }
                })
            }
        },
        inputNum: function (e) {
            var that = this;
            var totals = 0;
            that.orderNum = 0;
            that.checkedNames='';
            $(".inputOne").each(function () {
                var $this = $(this);
                if ($this.is(":checked")) {
                    totals += parseFloat($this.parents("td").siblings().find(".priceXj").html());
                    var lenTotal = $this.parents("tbody").find(".inputOne").length;
                    var lenChecked = $this.parents("tbody").find(".inputOne:checked").length;
                    that.orderNum++;
                    that.checkedNames+=$(this).val()+',';
                    if (lenTotal == lenChecked) {
                        $(this).parents("tbody").find(".inputTwo").prop("checked", true);
                    } else {
                        $(this).parents("tbody").find(".inputTwo").prop("checked", false);
                    }
                }else{
                    $(this).parents("tbody").find(".inputTwo").prop("checked", false);
                }
            });


            var lenTotalTotal = $(".checkSon").length;
            var lenCheckedTotal = $(".checkSon:checked").length;
            if (lenTotalTotal == lenCheckedTotal) {
                $(".allCheck").prop("checked", true);
            } else {
                $(".allCheck").prop("checked", false);
            }
            vm.total = totals;
        },
        isLogin: function () {
            $.ajax({
                url: "/web_api/item/index.php?c=PCIndex&m=SessionUserInfo",
                type: "post",
                async: false,
                dataType: "json",
                success: function (data) {
                    if(data.uid!=0){
                        vm.loginIs = true;
                        vm.user.userName = data.uname;
                        vm.user.uId = data.uid;
                        vm.user.shopCar = data.shopping_car;
                        vm.user.head_img = data.head_img;
                    }
                }
            })
        },
        goColl:function (e) {//加入收藏
            $.ajax({
                url: "/web_api/item/index.php?c=PCGoods&m=UserGoodsCollect&goods_id=" + e,
                type: "get",
                dataType: "json",
                success: function (data) {
                    if (data.login_status == 0) {
                        vm.loginModel();
                    } else {
                        if (data.status==1) {
                            layer.msg('收藏成功！', {time: 2000, icon: 6});
                        } else {
                            $.ajax({
                                url: "/web_api/item/index.php?c=PCGoods&m=UserGoodsCollect&goods_id=" + e,
                                type: "get",
                                dataType: "json",
                                success: function (data) {
                                    layer.msg('该商品你已收藏！', {time: 2000, icon: 6});
                                }
                            });
                        }
                    }

                }
            });
        }
    }
});
vm.isLogin();
//图片上传
Vue.component("jxky-pic", {
    props: ['title'],
    mounted: function () {
        var that = this;
        var imgFile1 = new ImgUploadeFiles('.imgFilebox' + this.title, function (e) {
            this.init({
                MAX: 5,
                MH: 1800, //像素限制高度
                MW: 1900, //像素限制宽度
                callback: function (arr) {
                    // $.each(arr,function (i) {
                    //    vm.fkImg.push(arr[i].src);
                    // });
                }
            });
        });
    },
    template: '<div :class="\'imgFilebox\'+this.title" style="width:100%;margin:20px auto"></div>'
});
Vue.component("jxky-num", {
    props:['title'],
    data: function () {
        return {
            num: this.title.num,
            numMin: this.title.numMin,
            carId: this.title.carId,
            stock: this.title.stock,
            proId: this.title.proId,
        }
    },
    mounted:function(){
        if(parseInt(this.num)>parseInt(this.stock)){
            this.num = this.stock;
            $.ajax({
                url: "/web_api/item/index.php?c=PC_shoppingcar&m=update_number&car_id="+this.carId,
                data:{'number':this.num,'pro_id':this.proId},
                dataType: "json",
                success: function (data) {}
            })
        }
    },
    methods: {
        inputChange: function (e,id) {
            if(this.num<this.numMin){
                layer.msg('不能小于起订量！');
                this.num = this.numMin;
            }else if(this.num>this.stock){
                layer.msg('库存还有！'+this.stock+'！');
                this.num = this.stock;
            }
            var el = e.currentTarget;
            var val = parseFloat($(el).parents('td').siblings().find(".price").html());
            var priValAll = $(el).parents('td').siblings().find(".priceXj");
            priValAll.html((val * this.num).toFixed(2));
            vm.inputNum();

            $.ajax({
                    url: "/web_api/item/index.php?c=PC_shoppingcar&m=update_number&car_id="+this.carId,
                    data:{'number':this.num,'pro_id':id},
                    dataType: "json",
                    success: function (data) {
                        $.ajax({
                            url: "/web_api/item/index.php?c=PC_shoppingcar&m=shopping_list",
                            async: true,
                            dataType: "json",
                            success: function (data) {
                                    if (data.status == 1) {
                                        myselfs.myCart = data.data;
                                    }
                            }
                        });
                    }
            })

        },
        numClick: function (e,v,id) {
            var el = e.currentTarget;
            var priValAll = $(el).parents('td').siblings().find(".priceXj");
            var val = parseFloat($(el).parents('td').siblings().find(".price").html());
            if (v == '-') {
                if (this.num == this.numMin) {
                    layer.msg('不能小于起订量！');
                    return false;
                }
                this.num--;
            } else {
                if (this.num == this.stock) {
                    layer.msg('库存还有'+this.stock+'！');
                    return false;
                }
                this.num++;
            }
            priValAll.html((val * this.num).toFixed(2));
            vm.inputNum();
            $.ajax({
                url: "/web_api/item/index.php?c=PC_shoppingcar&m=update_number&car_id="+this.carId,
                data:{'number':this.num,'pro_id':id},
                dataType: "json",
                success: function (data) {
                    $.ajax({
                        url: "/web_api/item/index.php?c=PC_shoppingcar&m=shopping_list",
                        async: true,
                        dataType: "json",
                        success: function (data) {
                            if (data.status == 1) {
                                myselfs.myCart = data.data;
                            }
                        }
                    });
                }
            })
        },
    },
    template: ' <div class="input-group" style="width: 114px;">\n' +
    '                            <div @click="numClick($event,\'-\',title.proId)" class="input-group-addon hoverOpacity" style="padding: 0 8px;">－</div>\n' +
    '                            <input type="text" class="form-control" @change="inputChange($event,title.proId)" onkeyup="value=value.replace(/[^\\d]/g,\'\')" style="text-align: center;padding: 0;height: 26px;" :value="num" v-model.number="num">\n' +
    '                            <div @click="numClick($event,\'+\',title.proId)" class="input-group-addon hoverOpacity" style="padding: 0 8px;">＋</div>\n' +
    '                        </div>'
});
//小logo
Vue.component("jxky-logo", {
    props: ['pic'],
    template: '<h1 style="margin-top: 3px;"><img :src="pic" alt=""></h1>'
});
//侧边栏
Vue.component("jxky-drawer", {
    data: function () {
        return {
            show: false,
        }
    },
    methods: {
        returnTop: function () {
            $("body,html").animate({scrollTop: 0}, 500)
        },
        loginClick: function (e) {
            vm.isLogin();
            if(vm.loginIs){
                if (e == "order") {
                    sessionStorage.setItem("index", 2);
                } else if (e == "cart") {
                    sessionStorage.setItem("index", 3);
                } else if (e == "collect") {
                    sessionStorage.setItem("index", 4);
                }
                window.location.href = 'myself.html';
            }else{
                vm.loginModel();
            }
        },
        fkSubmit:function () {
            vm.fkImg = '';
                if($(".imgAll").find('li')){
                    $(".imsg").each(function () {
                        vm.fkImg+=$(this).attr('value')+',';
                    });
                }
            $.ajax({
                    url:'/web_api/coupleback/feedback.php?m=info',
                    type:"post",
                    data:{
                        userid:vm.user.uId||'',
                        username:vm.user.userName||'',
                        imgage:vm.fkImg,
                        content:vm.fkcont
                    },
                    dataType:"json",
                    success:function(data){
                        if(data.status==1){
                            layer.alert("提交成功！非常感谢您的建议，我们会提交给相关的工作人员作为参考，感谢您对我们平台的支持！",{
                                title:'',
                                closeBtn:0,
                                end:function () {
                                    $("#fkclose").click();
                                    vm.fkcont='';
                                    vm.fkImg='';
                                    $(".imgAll ul").children().remove();
                                }
                            });
                        }else{
                            layer.msg(data.msg);
                        }
                    }
                })

        }
    },
    template: '<div>\n' +
    '    <ul class="drawer">\n' +
    '        <li>\n' +
    '            <a @click="loginClick(\'order\')" href="javascript:;">\n' +
    '                <span><i class="fa fa-tags" aria-hidden="true"></i></span>\n' +
    '            </a>\n' +
    '            <ul>\n' +
    '                <li>\n' +
    '                    <a href="javascript:;"><span>我的订单</span></a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </li>\n' +
    '        <li>\n' +
    '            <a @click="loginClick(\'cart\')" href="javascript:;">\n' +
    '                <span id="cartFly" class="pr"><span v-if="vm.user.shopCar!=0" style="background: #FF4502;color: #fff;border-radius: 50%;width: 10px;height: 10px;position: absolute;top: -8px;right: -4px;padding-top: 2px;overflow: hidden;"></span><i class="fa fa-shopping-cart" aria-hidden="true"></i></span>\n' +
    '            </a>\n' +
    '            <ul>\n' +
    '                <li>\n' +
    '                    <a href="javascript:;"><span>购物车</span></a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </li>\n' +
    '        <li>\n' +
    '            <a @click="loginClick(\'collect\')" href="javascript:;">\n' +
    '                <span><i class="fa fa-heart-o" aria-hidden="true"></i></span>\n' +
    '            </a>\n' +
    '            <ul>\n' +
    '                <li>\n' +
    '                    <a href="javascript:;"><span>我的收藏</span></a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </li>\n' +
    '        <li style="background: #fff;width: 60%;height: 1px;margin: 30px auto;"></li>\n' +
    '        <li @mouseenter="show = true" @mouseleave="show = false">\n' +
    '            <a href="javascript:;">\n' +
    '                <span><i class="fa fa-qrcode" aria-hidden="true"></i></span>\n' +
    '            </a>\n' +
    '            <ul>\n' +
    '                <li class="pr" style="z-index: 1">\n' +
    '                    <span style="background: #FF4502;position: absolute;top: -123px;left: 0;z-index: 1"><img v-show="show" style="width: 139px;height: 163px;" src="bulid/img/gzhCode.png" alt="">' +
    '                    </span><a style="width: 139px;" href="javascript:;"></a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </li>\n' +
    '        <li>\n' +
    '            <a data-toggle="modal" data-target="#feedBack" href="javascript:;">\n' +
    '                <span><i class="fa fa-pencil-square-o" aria-hidden="true"></i></span>\n' +
    '            </a>\n' +
    '            <ul>\n' +
    '                <li>\n' +
    '                    <a href="javascript:;"><span>反 馈</span></a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </li>\n' +
    '        <li style="border-top: 8px solid #f5f5f5;" @click="returnTop">\n' +
    '            <a href="javascript:;">\n' +
    '                <span><i class="fa fa-arrow-up" aria-hidden="true"></i></span>\n' +
    '            </a>\n' +
    '            <ul>\n' +
    '                <li>\n' +
    '                    <a href="javascript:;"><span>返回顶部</span></a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </li>\n' +
    '    </ul>' +
    '    <div data-backdrop="static" data-keyboard="false" class="modal fade" id="feedBack" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\n' +
    '        <div class="pa_tc" role="document">\n' +
    '            <div class="modal-content">\n' +
    '                <div class="modal-header">\n' +
    '                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n' +
    '                    <h4 class="modal-title" id="myModalLabel">反馈</h4>\n' +
    '                </div>\n' +
    '                <div class="modal-body">\n' +
    '                    <div class="input-group">\n' +
    '                        <div style="background: #F5F5F5;padding: 8px 20px;"><span style="border-left: 3px solid #D5282C;padding-left: 8px;display: inline-block;text-align: left;">感谢您使用同致相伴，请留下您的交易纠纷、意见或者建议，我们会关注您的反馈不断优化，为您提供更好的服务！</span></div>\n' +
    '                        <textarea name="" v-model="vm.fkcont" class="form-control" id="" cols="30" rows="5"></textarea>\n' +
    '                    </div>' +
    '                       <div style="padding: 0 5px;"><jxky-pic title="1"></jxky-pic></div>' +
    '                </div>\n' +
    '                <div class="modal-footer">\n' +
    '                    <button type="button" @click="fkSubmit" class="btn btn-primary">提交</button>\n' +
    '                    <button type="button" hidden id="fkclose" data-dismiss="modal"></button>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>'
});
Vue.component("jxky-friend", {
    template: '  <div><div class="tc" style="margin-top: 30px;background: #F5F5F5;padding: 25px 0;"> <img src="bulid/img/botImg.png" alt=""></div>\n' +
    // '    <div style="background: #fff"><section class="dis_flex" style="padding: 10px 100px;">\n' +
    // '        <div class="dis_flex" style="width: 820px;">\n' +
    // '            <div v-for="item in 5">\n' +
    // '                <div style="font-size: 1.2em;margin-bottom: 10px;">购物指南</div>\n' +
    // '                <div v-for="item in 8" class="hoverRed">联系客服</div>\n' +
    // '            </div>\n' +
    // '        </div>\n' +
    // '        <div>\n' +
    // '            <img src="bulid/img/twoCode.png" alt="">\n' +
    // '        </div>\n' +
    // '    </section></div>' +
    '</div>'
});
//页尾
Vue.component("jxky-foot", {
    data: function () {
        return {
            htmls: '<footer class="footbg" style="width: 1275px;">' +
            '<div class="main">' +
            '      <div class="link">' +
            // '        <span>友情链接</span>' +
            '        <nav>' +
            '          <div class="cr"></div>' +
            '        </nav>' +
            '      </div>' +
            '      <div class="onexs">' +
            '      <p style="font-size: 12px;color: #828282">Copyright © 2016 <a href="http://www.yntzxb.com">云南天行健营销服务股份有限公司</a>版权所有&nbsp;网站备案号：滇ICP备16001742号&nbsp;电信增值业务经营许可证：滇B2-20160041&nbsp;&nbsp;滇公网安备：53010302000386号&nbsp;网站建设支持：深圳健行快养网络科技有限公司&nbsp;<script type="text/javascript">var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id=\'cnzz_stat_icon_1262834456\'%3E%3C/span%3E%3Cscript src=\'" + cnzz_protocol + "s13.cnzz.com/z_stat.php%3Fid%3D1262834456%26show%3Dpic\' type=\'text/javascript\'%3E%3C/script%3E"));</script><span id="cnzz_stat_icon_1262834456"><a href="http://www.cnzz.com/stat/website.php?web_id=1262834456" target="_blank" title="站长统计"><img border="0" hspace="0" vspace="0" src="http://icon.cnzz.com/img/pic.gif"></a></span><script src=" http://s13.cnzz.com/z_stat.php?id=1262834456&amp;show=pic" type="text/javascript"></script><script src="http://c.cnzz.com/core.php?web_id=1262834456&amp;show=pic&amp;t=z" charset="utf-8" type="text/javascript"></script></p>' +
            '      </div>' +
            '      <div class="moarwe">' +
            '        <nav style="width: 21%;">' +
            '          <a href="https://tsm.miit.gov.cn/pages/home.aspx" target="_blank" alt="经营性网站备案信息">' +
            '            <p class="fl ps"><img src="bulid/img/ind36.gif" alt="经营性网站备案信息"></p>' +
            '            <p class="p2 fr">经营性网站<br>备案信息</p>' +
            '          </a>' +
            '          <a href="http://wljg.ynaic.gov.cn/ynwjww/indexquery/indexqueryAction!dizview.dhtml?chr_id=22c800adabed9d4564c180fd774bf662&amp;bus_ent_id=530100D000618471&amp;bus_ent_chr_id=790b4912fb2c4167bb56e322991f82f4" target="_blank" alt="工商网监电子标识">' +
            '            <p class="fl ps"><img src="bulid/img/ind37.jpg" alt="工商网监电子标识"></p>' +
            '            <p class="p2 fr">工商网监<br>电子标识</p>' +
            '          </a>' +
            '          <div class="cr"></div>' +
            '        </nav>' +
            '      </div>' +
            '      <div style="width:235px;margin:0 auto; padding:5px 0 20px 0;">' +
            '         <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=53010302000386" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;">' +
            '             <img src="bulid/img/beian.png" style="float:left;"><p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">滇公网安备 53010302000386号</p>' +
            '         </a>' +
            '      </div>' +
            '    </div>' +
            '          </footer>'
        }
    },
    template: '<div v-html="this.htmls"></div>'
});
// 登录注册
Vue.component("jxky-login", {
    props: ['title'],
    data: function () {
        return {
            isLogin: true,
            ok: true,
            loginType: '账号密码登录',
            logType: '验证码登录',
            codes: '获取验证码',
            loginCode: false,
            typeShow: true,
            nameUser: '',//用户名
            passUser: '',//用户密码
            login_time: true,
        }
    },
    methods: {
        logTypeClick: function () {
            if (this.ok) {
                this.isLogin = true;
                this.logType = '密码登录';
                this.loginType = '手机验证码登录';
                this.ok = false;
            } else {
                this.isLogin = true;
                this.loginType = '账号密码登录';
                this.logType = '验证码登录';
                this.ok = true;
            }
        },
        submitUpdate: function (e) {//修改登录密码
            var el = e.currentTarget;
            var that = this;
            var phone = $(el).parent().siblings().find(".promPhone").val();
            var code = $(el).parent().siblings().find(".codeReg").val();
            var pass1 = $(el).parent().siblings().find(".passLogi").val();
            if (pass1 == "") {
                layer.msg('请输入密码！');
                return false;
            }else if(pass1.length>16||pass1.length<6){
                layer.msg('请输入6~16位的密码！');
                return false;
            }
            var strB = "pwd=" + pass1 + "&key=!qJwHh!8Ln6ELn3rbFMk5c$vW#l13QLe";
            var pwdS = md5(strB).toUpperCase();
            var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;
            var StrA = "c=PCHome&code=" + code + "&m=UserSetPassWord&mobile=" + phone +"&pwd=" + pwdS + "&timestamp=" + timestamp + "&type=UserSetPassWord&key=6ljH6wpC4vDPy%Ruqlr4JJmG0kLo%^yN";
            var  parms = {
                    'c': 'PCHome',
                    'm': 'UserSetPassWord',
                    'mobile':phone,
                    'type': 'UserSetPassWord',
                    'code': code,
                    'pwd': pwdS,
                    'timestamp': timestamp,
                    'sign': md5(StrA).toUpperCase()
                };
            $.ajax({
                url: "/web_api/item/index.php",
                type: "post",
                data: parms,
                dataType: "json",
                success: function (data) {
                    if (data.status == 1) {
                        var StrB = "c=PCLogin&login_type=password&m=login&pwd=" + pwdS + "&timestamp=" + timestamp + "&usern=" + phone + "&key=6ljH6wpC4vDPy%Ruqlr4JJmG0kLo%^yN";
                        var parm = {
                            'c': 'PCLogin',
                            'm': 'login',
                            'login_type': 'password',
                            'usern': phone,
                            'pwd': pwdS,
                            'timestamp': timestamp,
                            'sign': md5(StrB).toUpperCase()
                        };
                        $.ajax({
                            url: "/web_api/item/index.php",
                            type: "post",
                            data: parm,
                            dataType: "json",
                            success: function (data) {
                                if (data.status == 1) {
                                    window.location.href = 'index.html';
                                }
                            }
                        })
                    } else {
                        layer.msg(data.msg);
                    }
                }
            })

        },
        codeClickUp: function (e) {
            var el = e.currentTarget;
            var phone = $(el).parent().siblings().find(".promPhone").val();
            var that = this;
            if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
                layer.msg("请输入正确的手机号码！")
            } else {
                if (this.codes === "获取验证码") {
                    var timestamp = Date.parse(new Date());
                    timestamp = timestamp / 1000;
                    var StrA = "m=UserSetPassWord&mobile=" + phone + "&timestamp=" + timestamp + "&key=6ljH6wpC4vDPy%Ruqlr4JJmG0kLo%^yN";
                    var parms = {
                        'm': 'UserSetPassWord',
                        'mobile': phone,
                        'timestamp': timestamp,
                        'sign': md5(StrA).toUpperCase()
                    };
                    $.ajax({
                        url: "/web_api/messages/send.php",
                        type: "post",
                        data: parms,
                        dataType: "json",
                        success: function (data) {
                            if (data.Message != "OK") {
                                layer.msg('发送短信过于频繁，请稍后重试');
                            } else {
                                var ms = 60;
                                that.codes = '重新发送(' + ms + ')';
                                var time = setInterval(function () {
                                    ms--;
                                    if (ms === 0) {
                                        that.codes = "获取验证码";
                                        clearInterval(time);
                                    } else {
                                        that.codes = '重新发送(' + ms + ')';
                                    }
                                }, 1000);
                            }
                        }
                    })
                }
            }
        },
        codeClick: function (e) {
            var el = e.currentTarget;
            var phone = $(el).parent().siblings().find(".promPhone").val();
            if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))){
                layer.msg("请输入正确的手机号码！")
            }else{
                if (this.codes === "获取验证码") {
                    var that = this;


                    var timestamp = Date.parse(new Date());
                    timestamp = timestamp / 1000;
                    var StrA = "m=login&mobile="+phone+"&timestamp=" + timestamp + "&key=6ljH6wpC4vDPy%Ruqlr4JJmG0kLo%^yN";

                    var parms = {
                        'm': 'login',
                        'mobile': phone,
                        'timestamp': timestamp,
                        'sign': md5(StrA).toUpperCase()
                    };
                    $.ajax({
                        url: "/web_api/messages/send.php",
                        type: "post",
                        data: parms,
                        dataType: "json",
                        success: function (data) {
                            if(data.Message!="OK"){
                                layer.msg('发送短信过于频繁，请稍后重试');
                            }else{
                                var ms = 60;
                                that.codes = '重新发送(' + ms + ')';
                                var time = setInterval(function () {
                                    ms--;
                                    if (ms === 0) {
                                        that.codes = "获取验证码";
                                        clearInterval(time);
                                    } else {
                                        that.codes = '重新发送(' + ms + ')';
                                    }
                                }, 1000);
                            }
                        }
                    })
                }
            }

        },
        loginPhone:function(e){
            var el = e.currentTarget;
            var phone = $(el).parent().siblings().find(".promPhone").val();
            var code = $(el).parent().siblings().find(".codeReg").val();
            if(!(/^1(3|4|5|7|8)\d{9}$/.test(phone))){
                layer.msg("请输入正确的手机号码！");
                return false;
            }else if(code==""){
                layer.msg("请输入验证码！");
                return false;
            }
            var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;
            var StrA = "c=PCLogin&login_type=mobile&m=login&pwd=" + code + "&timestamp=" + timestamp + "&usern=" + phone + "&key=6ljH6wpC4vDPy%Ruqlr4JJmG0kLo%^yN";

            var parms = {
                'c': 'PCLogin',
                'm': 'login',
                'login_type': 'mobile',
                'usern': phone,
                'pwd': code,
                'timestamp': timestamp,
                'sign': md5(StrA).toUpperCase()
            };
                $.ajax({
                    url: "/web_api/item/index.php",
                    type: "post",
                    data: parms,
                    dataType: "json",
                    success: function (data) {
                        if (data.status == 1) {
                                window.location.href = 'index.html';
                        } else {
                            layer.msg(data.msg);
                        }
                    }
                })
        },
        isLoginClick: function () {
            this.isLogin = false;
            this.loginType = '更换登录密码';
        },
        loginUser: function () {
            var that = this;
            if (this.nameUser == "" || this.passUser == "") {
                layer.msg("用户名或密码不能为空！");
            } else {
                var strB = "pwd=" + this.passUser + "&key=!qJwHh!8Ln6ELn3rbFMk5c$vW#l13QLe";
                var pwd = md5(strB).toUpperCase();
                var timestamp = Date.parse(new Date());
                timestamp = timestamp / 1000;
                var StrA = "c=PCLogin&login_type=password&m=login&pwd=" + pwd + "&timestamp=" + timestamp + "&usern=" + this.nameUser + "&key=6ljH6wpC4vDPy%Ruqlr4JJmG0kLo%^yN";

                var parms = {
                    'c': 'PCLogin',
                    'm': 'login',
                    'login_type': 'password',
                    'usern': this.nameUser,
                    'pwd': pwd,
                    'timestamp': timestamp,
                    'sign': md5(StrA).toUpperCase()
                };
                if(that.login_time){
                    $.ajax({
                        url: "/web_api/item/index.php",
                        type: "post",
                        data: parms,
                        dataType: "json",
                        success: function (data) {
                            if (data.status == 1 && data.login_time < 6) {
                                if (that.title == 'model') {
                                    window.location.reload();
                                } else {
                                    window.location.href = 'index.html';
                                }
                            } else if (data.login_time >= 6) {
                                that.login_time = false;
                                that.loginCode = true;
                                $("#captcha").html("");
                                jigsaw.init(document.getElementById('captcha'), function () {
                                    $.ajax({
                                        url: "/web_api/item/index.php",
                                        type: "post",
                                        data: parms,
                                        dataType: "json",
                                        success: function (data) {
                                            if (data.status == 1) {
                                                if (that.title == 'model') {
                                                    window.location.reload();
                                                } else {
                                                    window.location.href = 'index.html';
                                                }
                                            } else {
                                                that.loginCode = false;
                                                layer.msg(data.msg);
                                            }
                                        }
                                    })
                                })
                            } else {
                                layer.msg(data.msg);
                            }
                        }
                    })
                }else{
                    that.loginCode = true;
                    $("#captcha").html("");
                    jigsaw.init(document.getElementById('captcha'), function () {
                        $.ajax({
                            url: "/web_api/item/index.php",
                            type: "post",
                            data: parms,
                            dataType: "json",
                            success: function (data) {
                                if (data.status == 1) {
                                    if (that.title == 'model') {
                                        window.location.reload();
                                    } else {
                                        window.location.href = 'index.html';
                                    }
                                } else {
                                    that.loginCode = false;
                                    layer.msg(data.msg);
                                }
                            }
                        })
                    })
                }

            }

        }
    },
    template: '<div id="borOut" class="pr">' +
    '<div style="position: absolute;    right: 35px;top: 44px;z-index: 18;font-size: 2.4em;color: #C1C1C1;">' +
    // '<span @click="typeShow = !typeShow" title="二维码登录" v-if="typeShow" class="glyphicon glyphicon-qrcode hoverRed" aria-hidden="true"></span>' +
    // '<i @click="typeShow = !typeShow" title="账号密码登录" v-else class="fa fa-keyboard-o hoverRed" aria-hidden="true"></i>' +
    '</div>' +
    '               <div id="box">' +
    '                    <div v-show="typeShow" style="font-weight: bold;font-size: 18px">{{loginType}}</div>' +
    '                    <div v-show="!typeShow" style="font-weight: bold;font-size: 18px">&nbsp;&nbsp;&nbsp;&nbsp;扫码登录</div>' +
    '                    <div v-show="typeShow"><div v-if="isLogin">' +
    '                       <div v-if="ok">' +
    '                           <div class="loginmt">' +
    '                                <span class="iBor"><i class="fa fa-user" aria-hidden="true"></i></span>' +
    '                                <input @keyup.13="loginUser" class="loginInput" v-model="nameUser" type="text" placeholder="请输入用户名">' +
    '                           </div>' +
    '                           <div class="loginmt">' +
    '                            <span class="iBor"><i class="fa fa-unlock-alt" aria-hidden="true"></i></span>' +
    '                               <input @keyup.13="loginUser" class="loginInput" type="password" v-model="passUser" placeholder="请输入密码">' +
    '                            </div>' +
    '                            <div class="loginmt">' +
    '                              <div @click="loginUser" class="loginBtn">登 录</div>' +
    '                           </div>' +
    '                        </div>' +
    '                        <div v-else>' +
    '                           <div class="loginmt bor">' +
    '                           <span class="borBT">' +
    '                                <i class="fa fa-mobile" style="font-size: 30px" aria-hidden="true"></i>' +
    '                            </span>' +
    '                                <input type="text" class="intBor promPhone" id="loginPhone" onkeyup="value=value.replace(/[^\\d]/g,\'\')" maxlength="11" placeholder="请输入手机号码">' +
    '                            </div>' +
    '                            <div class="loginmt bor">  ' +
    '                          <span class="borBT">' +
    '                               <i class="fa fa-check-square-o" aria-hidden="true"></i>' +
    '                           </span>' +
    '                                <input type="text" id="codeLogin" class="intBor codeReg" style="width: 112px;" maxlength="6" placeholder="请输入验证码">                       ' +
    '         <span class="vert" @click="codeClick($event)">{{codes}}</span>   ' +
    '                         </div>                   ' +
    '         <div class="loginmt">            ' +
    '                    <div @click="loginPhone($event)" class="loginBtn">登 录</div>        ' +
    '                    </div>                  ' +
    '      </div>  ' +
    '                  </div>      ' +
    '              <div v-else>    ' +
    '                    <div class="loginmt1 bor">             ' +
    '               <span class="borBT">                ' +
    '                <i class="fa fa-mobile" style="font-size: 30px" aria-hidden="true"></i>      ' +
    '                      </span>                      ' +
    '      <input type="text" class="intBor promPhone" maxlength="11" placeholder="请输入手机号码">  ' +
    '                      </div>               ' +
    '         <div class="loginmt1 bor">    ' +
    '                        <span class="borBT">      ' +
    '                          <i class="fa fa-check-square-o" aria-hidden="true"></i>   ' +
    '                         </span>                         ' +
    '   <input type="text" class="intBor codeReg" style="width: 112px;" maxlength="6" placeholder="请输入验证码">   ' +
    '                         <span class="vert" @click="codeClickUp($event)">{{codes}}</span>       ' +
    '                 </div>          ' +
    '              <div class="loginmt1 bor">                    ' +
    '        <span class="borBT">                          ' +
    '      <i class="fa fa-unlock-alt" aria-hidden="true"></i>              ' +
    '              </span>                        ' +
    '    <input type="password" class="intBor passLogi" placeholder="请输入新密码">     ' +
    '                   </div>                ' +
    '        <div class="loginmt1">                        ' +
    '    <div class="loginBtn reg" @click="submitUpdate($event)">登 录</div>          ' +
    '              </div>                ' +
    '    </div></div>' +
    '<div v-show="!typeShow" style="text-align: center;margin-top: 26px;">' +
    '<img style="width: 150px;" src="bulid/img/twocodeLogin.png" alt="">' +
    '<div style="display: flex;justify-content: space-between;width: 140px;margin: 16px auto;">' +
    '<div><img style="width: 32px" src="bulid/img/saoma.png" alt=""></div>' +
    '<div style="color: #949494;text-align: left">' +
    '<div style="margin-top: -2px">打开 <span style="color: #FF4502">同致相伴 &nbsp;&nbsp;&nbsp;</span></div>' +
    '<div style="margin-top: -4px">扫一扫登录</div>' +
    '</div>' +
    '</div>' +
    '</div>      ' +
    '              <div v-show="typeShow" class="loginmt text">   ' +
    '                     <div>                      ' +
    '      <span style="display: inline-block;width: 74px;" @click="logTypeClick">{{logType}}</span>&nbsp; ' +
    '                           <span @click="isLoginClick">忘记密码</span>&nbsp;              ' +
    '              <span @click="window.location.href=\'napaStore.html\'">下载APP注册</span>&nbsp;                ' +
    '        </div>             ' +
    '       </div>           ' +
    '         <div id="footLogo">      ' +
    '                  <jxky-logo pic="bulid/img/logo.png"></jxky-logo>           ' +
    '         </div>    ' +
    '            </div>     ' +
    '           <div v-show="loginCode" id="zheZhao"></div>' +
    '           <div v-show="loginCode" id="captcha" class="pa_tc" style="position: fixed;z-index: 999;background: #fff;"></div>' +
    '       ' +
    '</div>'
});
// header
Vue.component("jxky-header", {
    data: function () {
        return {
            user: '',
        }
    },
    methods: {
        loginClick: function (e) {
            vm.isLogin();
            if(vm.loginIs){
                if (e == "user") {
                    sessionStorage.setItem("index", 1);
                } else if (e == "cart") {
                    sessionStorage.setItem("index", 3);
                } else if (e == "collect") {
                    sessionStorage.setItem("index", 4);
                }
                window.location.href = 'myself.html';
            }else{
                vm.loginModel();
            }
        }
    },
    template: '<div style="background: #fff;position: absolute;top: 0;border-bottom: 1px solid #e5e5e5;width: 100%;padding: 5px 0;">' +
    '        <section class="dis_flex">' +
    '            <div>欢迎来到同致相伴B2B汽车养护采购平台</div>' +
    '            <div style="color: #a5a5a5">' +
    '                <span v-show="!vm.loginIs" style="color: #FF4502;padding-right: 40px">' +
    '                     <a style="color: #FF4502" href="login.html">登录</a> ' +
    '                     |' +
    '                     <a style="color: #FF4502" href="napaStore.html">下载APP注册</a> ' +
    '                </span>' +
    '                <span v-show="vm.loginIs" style="color: #FF4502;padding-right: 40px">' +
    '                   {{vm.user.userName}} 欢迎您! [ <span @click="vm.loginOut" class="hover_head">退出</span>]' +
    '                </span>' +
    '                <span class="hover_head" style="padding-right: 20px;" @click="loginClick(\'user\')">用户中心</span>' +
    '                <span @click="loginClick(\'collect\')" class="hover_head" style="padding-right: 20px;"><i class="fa fa-heart" style="color: #FF4502" aria-hidden="true"></i> 我的收藏</span>' +
    '                <span @click="loginClick(\'cart\')" class="hover_head" style="padding-right: 20px;"><i class="fa fa-shopping-cart" style="color: #FF4502" aria-hidden="true"></i> 我的购物车</span>' +
    '                <span @click="window.location.href=\'napaStore.html\'" data-toggle="modal" data-target="#myModalPhone" class="hover_head" style="padding-right: 20px;"><i class="fa fa-download" style="color: #FF4502" aria-hidden="true"></i> 手机版</span>' +
    '                <span class="hover_head" @click="window.open(\'/sitemag/login.html\')" style="padding-right: 20px;">企业入口</span>' +
    // '                <span class="dropdown hover_head" style="padding-right: 20px;">' +
    // '                  <span class="dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown" data-hover="dropdown" aria-haspopup="true" aria-expanded="true">' +
    // '                    客户服务' +
    // '                    <span class="caret"></span>' +
    // '                  </span>' +
    // '                  <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
    // '                    <li><a href="javascript:;">Action</a></li>' +
    // '                    <li><a href="javascript:;">Another action</a></li>' +
    // '                    <li><a href="javascript:;">Something else here</a></li>' +
    // '                    <li role="separator" class="divider"></li>' +
    // '                    <li><a href="javascript:;">Separated link</a></li>' +
    // '                  </ul>' +
    // '                </span>' +
    '            </div>' +
    '        </section>' +
    '    </div>'
});
// 导航栏
Vue.component("jxky-nav", {
    data: function () {
        return {
            show: true,
            searchText: '',//搜索词条
            brandAll:[],
            text:['嘉实多','百适通','同致相伴']
        }
    },
    props: ['title'],
    mounted: function () {
        var that = this;
        $.ajax({
            url:'/web_api/item/index.php?c=PCGoods&m=IndexCategory',
            type:"get",
            async:true,
            dataType:"json",
            success:function(data){
                that.brandAll = data.data;
            }
        });

        if (this.title == "search") {
            var text = GetQueryString("search");
            var type = GetQueryString("type");
            if (text && text != "") {
                this.searchText = decodeURI(text);
            } else {
                this.searchText = "";
            }
            if (type == 1) {
                $("#typeSearch>li:nth-child(2)").click();
            }
            this.show = false;
        } else if (this.title == 'myself') {
            this.show = false;
        }
    },
    methods: {
        hotClick: function (e) {
            var el = e.currentTarget;
            this.searchText = $(el).html();
            this.search();
        },
        search: function () {
            if (vm.Searchtype == 1) {
                window.location.href = 'search.html?' + encodeURI(encodeURI('type=1&search=' + this.searchText));
            } else {
                window.location.href = 'search.html?' + encodeURI(encodeURI('search=' + this.searchText));
            }
        },
        logoClick: function () {
            window.location.href = 'index.html';
        }
    },
    template: '<section style="margin-top: 30px" class="cr">\n' +
    '        <div @click="logoClick" class="fl" style="width: 208px;height: 146px;border-radius: 5px;cursor: pointer;overflow: hidden;">\n' +
    '            <img src="bulid/img/indexLogo.png" alt="">\n' +
    '        </div>\n' +
    '        <div class="fl">\n' +
    '            <div style="height: 106px;">\n' +
    '                <div style="padding: 34px 0 0 200px;">\n' +
    '                    <div class="input-group" style="width: 500px;">\n' +
    '                        <div class="input-group-addon" style="color: #fff;background: #FF4502;border: none;"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></div>\n' +
    '                        <input @keyup.13="search" type="text" class="form-control" style="border: 1px solid #ff4502;" placeholder="查询关键字..." v-model.trim="searchText">\n' +
    '                        <div @click="search" class="input-group-addon hoverOpacity" style="color: #fff;background: #FF4502;border: none;">搜 索</div>\n' +
    '                    </div>\n' +
    '                    <div>' +
    '           <div v-for="(item,ind) in text" style="color: #949494;float: left;">&nbsp;<span @click="hotClick($event)" class="hoverOpacity">{{item}}</span>  <span v-if="ind < 2">&nbsp;|</span></div>        ' +
    '           </div>' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div v-if="show" class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">\n' +
    '                <ul class="nav navbar-nav">\n' +
    '                    <li class="dropdown">\n' +
    '                        <span class="btn btn-orange dropdown-toggle hoverOpacity" data-toggle="dropdown" data-hover="dropdown" aria-haspopup="true" aria-expanded="false">\n' +
    '                            全部分类 <span class="caret"></span>\n' +
    '                        </span>\n' +
    '                        <div class="dropdown-menu" style="width: 1230px;padding-bottom: 60px;left: -223px;top: 44px;border: none; border-top: 2px solid #ff4502;font-family: \'Lantinghei SC\',Tahoma, Helvetica, SimSun, sans-serif;">\n' +
    '                            <div class="dis_flex" style="padding: 0 150px 0 220px;">\n' +
    '                                <div v-for="item in brandAll" style="width: 110px;color: #aaa;">\n' +
    '                                    <div class="hoverRed" style="font-weight: bold;padding: 20px 0 35px;color: #000;"><span class="hoverRed" @click="window.location.href=\'search.html?cate=\'+item.category_id">{{item.category_name}}</span></div>\n' +
    '                                    <div v-for="it in item.data" style="padding-bottom: 5px"><span @click="window.location.href=\'search.html?cate=\'+item.category_id+\'&brand=\'+it.id" class="hover_head">{{it.title}}</span></div>\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                            <div style="padding-top: 20px; padding-left: 220px;"><span @click="window.location.href=\'search.html\'" class="hover_head">查看全部商品</span></div>\n' +
    '                        </div>\n' +
    '                    </li>\n' +
    '                    <li class="hoverOpacity" @click="window.location.href=\'search.html?cate=1\'"><a style="background: transparent" href="javascript:;">润滑系统</a></li>\n' +
    '                    <li class="hoverOpacity" @click="window.location.href=\'search.html?cate=206\'"><a style="background: transparent" href="javascript:;">冷却系统</a></li>\n' +
    '                    <li class="hoverOpacity" @click="window.location.href=\'search.html?cate=4\'"><a style="background: transparent" href="javascript:;">DIY养护</a></li>\n' +
    '                    <li class="hoverOpacity" @click="window.location.href=\'search.html?cate=3\'"><a style="background: transparent" href="javascript:;">刹车系统</a></li>\n' +
    // '                    <li class="hoverOpacity" @click="window.location.href=\'search.html?type=1\'"><a style="background: transparent" href="javascript:;">商家门店</a></li>\n' +
    // '                    <li class="hoverOpacity" @click="window.location.href=\'search.html\'"><a style="background: transparent" href="javascript:;">设备项目</a></li>\n' +
    // '                    <li class="hoverOpacity" @click="window.location.href=\'question.html\'"><a style="background: transparent" href="javascript:;">关于我们</a></li>\n' +
    '                    <li class="hoverOpacity" @click="window.location.href=\'napaStore.html\'"><a style="background: transparent" href="javascript:;">招商加盟</a></li>\n' +
    '                </ul>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>'
});
//新闻滚动
Vue.component("jxky-news",{
    props:['title'],
    data:function(){
        return{
            arr:[],
        }
    },
    mounted:function(){
        var that =this;
        $.ajax({
            url:'/web_api/notice/notice.php?m=articellist&id='+that.title,
            type:"get",
            async:false,
            dataType:"json",
            success:function(data){
                that.arr = data.data;
            }
        });
        var auto = true;
        if($(".ulAdv>li").length<5){
            auto = false;
        }
        $(".ulAdv").bootstrapNews({

            newsPerPage: 5,

            autoplay: auto,

            navigation: false,

            pauseOnHover:true,

            direction: 'up',

            newsTickerInterval: 4000,

            onToDo: function () {

                //console.log(this);

            }

        });
    },
    template:'<div class="panel">\n' +
    '                                <div class="panel-body">\n' +
    '                                    <ul class="ulAdv">\n' +
    '                                        <li v-for="item in arr"><a :href="\'messing.html?id=\'+item.id">{{item.title}}</a></li>\n' +
    '                                        <li v-if="!arr.length"><div style="font-size: 1em;text-align: center;">\n' +
                    '                             <span>\n' +
                    '                                暂无任何信息\n' +
                    '                            </span>\n' +
                    '                           </div>' +
    '                                       </li>' +
    '                                    </ul>\n' +
    '                                </div>\n' +
    '                            </div>'
});
//分类头部
Vue.component("jxky-oil", {
    props: ['title'],
    data: function () {
        return {
            textEn: 'LUBRICATING OIL',
            cate:1
        }
    },
    mounted: function () {
        if (this.title == '变速箱油') {
            this.textEn = 'TRANSMISSION OIL';
        } else if (this.title == 'DIY养护') {
            this.textEn = 'DIY MAINTENANCE';
        } else if (this.title == '项目加盟') {
            this.textEn = 'PROJECT TO JOIN';
        }
    },
    methods:{
      more:function () {
          if (this.title == '变速箱油') {
              this.cate = 254;
          } else if (this.title == 'DIY养护') {
              this.cate = 4;
          } else if (this.title == '项目加盟') {
              this.cate = '';
          }
          window.location.href='search.html?cate='+this.cate;
      }
    },
    template: ' <section style="margin-top: 35px;" class="dis_flex">\n' +
    '        <div><span style="border-left: 6px solid #000;padding: 0 10px;color: #000;font-size: 1.3em;font-weight: bold;">{{title}} <span style="vertical-align: middle">{{textEn}}</span></span><img src="bulid/img/icon.png" alt=""></div>\n' +
    '        <div class="dis_flex" style="font-size: 1em;font-weight: bold;padding-top: 7px;">\n' +
    '            <div class="hoverOpacity" @click="more()" style="padding: 0 8px;">更多</div>\n' +
    // '            <div class="hoverOpacity" style="padding: 0 8px;">静音</div>\n' +
    // '            <div class="hoverOpacity" style="padding: 0 8px;">静音</div>\n' +
    // '            <div class="hoverOpacity" style="padding: 0 8px;">静音</div>\n' +
    // '            <div class="hoverOpacity" style="padding: 0 8px;">静音</div>\n' +
    '        </div>\n' +
    '    </section>'
});
//分类商品
Vue.component("jxky-goods", {
    props: ['title','goods'],
    // data: function () {
    //     return {
    //         src: 'bulid/img/diy.png'
    //     }
    // },
    // mounted: function () {
    //     if (this.title == "变速箱油") {
    //         this.src = 'bulid/img/transmission.png';
    //     } else if (this.title == "DIY养护") {
    //         this.src = 'bulid/img/diy.png';
    //     }
    // },
    methods: {
        detail: function () {
            window.open('detail.html');
        }
    },
    template: '<section class="dis_flex">\n' +
    '        <div class="hoverOpacity" style="width: 233px;height: 616px;margin-top: 16px;">\n' +
    '            <a :href="title[0].http_url"><img :src="title[0].img_url" alt=""></a>\n' +
    '        </div>\n' +
    '        <div style="width: 980px;" class="dis_flex flex-wrap">\n' +
    '            <div v-for="item in goods" style="background: #fff;width: 233px;height: 300px;margin-top: 16px;">\n' +
    '                <div class="hoverGoods" @click="vm.dorShopDetail(item.product_id,\'\')">\n' +
    '                    <div style="width: 233px;height: 220px;padding: 10px 24px;overflow: hidden;display: table-cell;vertical-align: middle;text-align: center;">\n' +
    '                        <img style="max-height: 185px;max-width: 185px;margin: 0 auto;" :src="item.img_url" alt="" />\n' +
    '                    </div>\n' +
    '                    <div>\n' +
    '                        <div style="padding: 0 31px;color: #000;height:40px;overflow: hidden;font-size: 1em">{{item.product_title}}</div>\n' +
    '                    </div>\n' +
    '                    <div class="tc" style="padding: 5px 0 10px;">\n' +
    '                        <span style="color: #e62129;font-size: 1.44em;">￥{{item.seal_price}}</span>\n' +
    // '                        <span style="text-decoration: line-through;color: #aaa">￥{{item.market_price}}</span>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>'
});
//码上购
Vue.component("jxky-sys", {
    props: ['form'],
    data: function () {
        return {
            show: false,
            style: 'top:27px;'
        }
    },
    mounted: function () {
        if (this.form == 'bottom') {
            this.style = 'bottom:27px;'
        }
    },
    template: '  <div @mouseenter="show = true" @mouseleave="show = false" class="pr">\n' +
    '                            <span class="btn hoverOpacity" style="background: #fff;color:#D9272E;border-radius: 10px;padding: 2px 12px;" type="button">\n' +
    '                                码上购 <span style="background: #D9272E;" class="badge"><span style="color: #fff;" class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></span>\n' +
    '                            </span>\n' +
    '                            <transition name=\'slide-fade\'>\n' +
    '                                <div v-show="show" style="position: absolute;" :style="style">\n' +
    '                                    <img src="bulid/img/phone.png" alt="">\n' +
    '                                </div>\n' +
    '                            </transition>\n' +
    '                        </div>'
});
//搜索词条
Vue.component("jxky-search", {
    data: function () {
        return {
            category: [],//分类
            brand: [],//品牌
            brandAll: [],//品牌
            cateId:GetQueryString("cate")||'',
            brandId:GetQueryString("brand")||'',
        }
    },
    mounted: function () {
        var that = this;
        //    商品分类及品牌
        $.ajax({
            url: '/web_api/item/index.php?c=PCGoods&m=Category',
            type: "get",
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.status == 1) {
                    that.category = data.data.category;
                    that.brand = data.data.brand;
                    that.brandAll = data.data.brand;
                }
            }
        });
        if(that.cateId!=''){
            $.ajax({
                url: '/web_api/item/index.php?c=PCGoods&m=BrandList&id='+that.cateId,
                type: "get",
                dataType: "json",
                success: function (data) {
                    if (data.status == 1) {
                        that.brand = data.data;
                    }
                }
            });
        }
    },
    methods: {
        search: function (e, val, id) {
            var that = this;
            var el = e.currentTarget;
            if (!$(el).hasClass("active")) {
                $(el).addClass("active").siblings().removeClass("active");
                if (val == "分类") {
                    vg.cate = id;
                    vg.brand = '';
                    $(el).parents(".input-group").siblings().find('li').removeClass("active");
                    $.ajax({
                        url: '/web_api/item/index.php?c=PCGoods&m=BrandList&id='+id,
                        type: "get",
                        dataType: "json",
                        success: function (data) {
                            if (data.status == 1) {
                                that.brand = data.data;
                            }
                        }
                    });
                } else {
                    vg.brand = id;
                }
            } else {
                $(el).removeClass("active");
                if (val == "分类") {
                    vg.cate = '';
                    that.brand = that.brandAll;
                } else {
                    vg.brand = '';
                }
            }
            vg.goods(0);
        }
    },
    template: ' <div>' +
    '<div class="input-group" style="margin: 5px 0;">\n' +
    '            <span class="input-group-addon"><span style="border-left: 3px solid #D5282C;padding-left: 8px;display: inline-block;width: 75px;text-align: left;margin-left: 10px;">分类</span></span>\n' +
    '            <ul id="cateUl" class="form-control cr" style="height: auto;padding: 0;border: none">\n' +
    '                <li v-for="item in category" :class="{active:item.id==cateId}" @click="search($event,\'分类\',item.id)" class="searchLi sure fl hoverOpacity pr">{{item.title||item.category_name}}<i></i></li>\n' +
    '            </ul>\n' +
    '        </div>'+
    ' <div class="input-group" style="margin: 5px 0;">\n' +
        '            <span class="input-group-addon"><span style="border-left: 3px solid #D5282C;padding-left: 8px;display: inline-block;width: 75px;text-align: left;margin-left: 10px;">品牌</span></span>\n' +
    '            <ul class="form-control cr" style="height: auto;padding: 0;border: none">\n' +
    '                <li v-for="item in brand" :class="{active:item.id==brandId}" @click="search($event,\'品牌\',item.id)" class="searchLi sure fl hoverOpacity pr">{{item.title||item.category_name}}<i></i></li>\n' +
    '            </ul>\n' +
    '        </div>' +
    '</div>'
});
//个人中心商品
Vue.component("jxky-mygoods", {
    methods: {
        detail: function () {
            window.open('detail.html');
        }
    },
    template: '<div class="dis_flex1"><div v-for="item in 5" class="hoverOpacity" @click="detail" style="background: #fff;width: 206px;height: 267px;">\n' +
    '                            <div style="width: 208px;height: 188px;padding: 24px;overflow: hidden;text-align: center;display: table-cell;vertical-align: middle;">\n' +
    '                                <img style="max-height: 140px;max-width: 160px;margin: 0 auto;" alt="loading" src="bulid/img/20171211104047314.png" alt="" />\n' +
    '                            </div>\n' +
    '                            <div>\n' +
    '                                <div style="padding: 0 8px;color: #000;height: 26px;overflow: hidden;font-size: 1.2em">嘉实多嘉实多嘉实多嘉实多嘉实多</div>\n' +
    '                            </div>\n' +
    '                            <div class="tc">\n' +
    '                                <span style="color: #e62129;font-size: 1.5em;">￥666.00</span>\n' +
    '                                <span style="text-decoration: line-through;color: #aaa">￥999.00</span>\n' +
    '                            </div>\n' +
    '                        </div></div>'
});

Vue.component("jxky-selfgoods", {
    props: ['title','type'],
    methods: {
        del: function (e,id) {
            var that = this;
            var el = e.currentTarget;
            layer.confirm('是否确认删除该商品？', {
                title: '提示！',
                btn: ['确认', '取消'] //按钮
            }, function () {
                var url = '/web_api/item/index.php?c=PCGoods&m=UserGoodsCollect&goods_id=';
                if(that.type=='history'){
                    url = '/web_api/item/index.php?c=PCHome&m=DeleteUserHistory&goods_ids=';
                }
                $.ajax({
                    url: url+id,
                    async: true,
                    dataType: "json",
                    beforeSend: function () {
                        layer.load(1, {shade: .3});
                    },
                    success: function (data) {
                        layer.closeAll();
                        if (data.login_status == 0) {
                            vm.loginModel();
                        } else {
                            $(el).parent().parent().remove();
                        }
                    }
                });

            });
        }
    },
    template: '<div class="cr">\n' +
    '                <div v-for="item in title" class="hoverGoods pr" style="background: #fff;width: 233px;height: 338px;border: 1px solid #ddd;float: left;margin: 6px;">\n' +
    '                    <div style="padding-bottom: 11px;position: relative;">' +
    '                       <div @click="vm.dorShopDetail(\'\',item.goods_id||item.id)">' +
    '                        <div style="width: 233px;height: 215px;padding: 24px;overflow: hidden;padding-bottom: 0;display: table-cell;vertical-align: middle;text-align: center;">\n' +
    '                            <img style="max-height: 185px;max-width: 185px;margin: 0 auto;" :src="item.img_url" alt="" />\n' +
    '                        </div>\n' +
    '                        <div>\n' +
    '                            <div style="padding: 0 8px;color: #000;height: 42px;overflow: hidden;font-size: 1.1em">{{item.title}}</div>\n' +
    '                        </div>\n' +
    '                        <div style="padding: 3px 6px;">\n' +
    '                            <span style="color: #e62129;font-size: 1.5em;"><span style="font-size: .8em">￥</span>{{item.price}}</span>\n' +
    '                        </div>' +
    '                       </div>' +
    '                       <div v-if="item.isset==1" style="position: absolute;top: 0;text-align: center;height: 100%;;width: 100%;line-height: 300px;color: #fff;background: rgba(0,0,0,.4);z-index: 22;font-size: 2em">商品已失效</div>' +
    '                    </div>\n' +
    '                    <div style="border-top: 1px solid #ddd;">\n' +
    '                        <div class="hoverRed" style="display: inline-block;width: 93px;height: 33px;text-align: center;line-height: 33px">找相似</div>\n' +
    '                        <div class="hoverRed" style="display: inline-block;width: 93px;height: 33px;text-align: center;border-left: 1px solid #ddd;line-height: 33px">进入店铺</div>\n' +
    '                        <div class="hoverRed" title="删除" @click="del($event,item.goods_id||item.id)" style="display: inline-block;width: 33px;height: 33px;text-align: center;border-left: 1px solid #ddd;line-height: 33px"><i class="fa fa-trash-o" aria-hidden="true"></i></div>\n' +
    '                    </div>\n' +
    '                    <div class="triangle" style="position: absolute;top: 0;left: 0;">\n' +
    '                        自营\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>'
});
