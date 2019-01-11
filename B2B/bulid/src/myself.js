var getObjectURL = function (file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
};

function changepic(e) {
    var oss_url = "https://img.aiucar.cn/";
    var $this = $(e);
    $.ajax({
        url: "/api/oss/get.php?dir=user",
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
                    //步骤五 如果能够进到这个判断 说明 数据 完美的回来了,并且请求的页面是存在的
                    img_url_submit(arr.dir + ImgName + '.jpg');
                    layer.msg('上传成功！');
                }
            };
        }
    });
}

function img_url_submit(url) {
    var newsrc = getObjectURL($("#imgHead")[0].files[0]);
    $.ajax({
        url: "/web_api/item/index.php?c=PCHome&m=UpdateUsersInfo",
        async: true,
        data: {'head_img': url},
        dataType: "json",
        beforeSend: function () {
            layer.load(1, {shade: .3});
        },
        success: function (data) {
            layer.closeAll();
            if (data.login_status == 0) {
                vm.loginModel();
            } else {
                if (data.status == 1) {
                    $('#show').attr('src', newsrc);
                } else {
                    layer.msg(data.msg);
                }
            }
        }
    });
}

function qhCred(e){
    if(!$(e).hasClass('active')){
        $(e).addClass('active').siblings().removeClass('active');
        $("#credDrop").children().eq($(e).index()).show().siblings().hide();
    }
}
function creditzf() {
    $("#zffs").find('.addxy').hide();
    layer.open({
        type: 1,
        shade: .3,
        area: ['450px', '380px'],
        title: '支付方式', //不显示标题
        btn: ['确认', '取消'],
        content: $('#zffs'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
        yes: function () {

        }
    })
}

var myselfs = new Vue({
    el: "#index",
    data: {
        activeDel: {
            'text-align': 'center',
            'color': '#fff',
            'background': 'rgba(0,0,0,.4)',
            'font-size': '2em',
            'z-index': '22',
            'position': 'absolute',
            'width': '100%',
            'height': '100%',
            'top': '0',
            'left': '0',
        },
        page: 0,
        pageTotal: 1,
        show: true,
        index: 1,
        spDetail: '',
        showAddr: false,//添加收货地址
        codes: '获取验证码',
        myCollect: [],//我的收藏
        collectShow: false,//我的收藏为空
        history: [],//我的足迹
        historyShow: false,//我的足迹为空
        myCart: [],//我的购物车
        cartShow: false,//我的购物车是否为空
        myOrder: [],//我的订单
        statusType: 'all',
        order1Num: 0,
        order2Num: 0,
        order3Num: 0,
        order4Num: 0,
        orderShow: false,//我的订单是否为空
        myAdr: [],//我的地址
        adrShow: false,//我的地址是否为空
        zfType: 'zfb',
        myself: [],
        //评论参数
        PLorder_id:'',
        PLorder_product_id:'',
        textVal: "",
        PLpic:'',
        PLnum1:0,
        PLnum2:0,
        PLnum3:0,
        PLnum4:0,
        PLnum5:0,
        PLpf1:0,
        PLpf2:0,
    },
    mounted: function () {
        var that = this;
        var index = sessionStorage.getItem("index");
        if (index != null) {
            $(".myselfHead>div:nth-child(" + index + ")").click();
        }
    },
    methods: {
        dgzhxx:function(){
            layer.open({
                type: 1,
                closeBtn: 0, //不显示关闭按钮
                anim: 2,
                area:["751px","284px"],
                shadeClose: true, //开启遮罩关闭
                title: false, //不显示标题
                content: '<div><img style="width: 751px;height: 284px;" src="../bulid/img/dgzhxx.png" alt=""></div>'
            });
        },
        credit:function(){//信用额度
            layer.open({
                type: 1,
                closeBtn: 0, //不显示关闭按钮
                anim: 2,
                area:["360px","360px"],
                shadeClose: true, //开启遮罩关闭
                title: false, //不显示标题
                content: '<div>' +
                '<div class="dis_flex credit">' +
                    '<span onclick="qhCred(this)" class="active hoverOpacity">账户明细</span>' +
                    '<span onclick="qhCred(this)" class="hoverOpacity">还款金额</span>' +
                '</div>' +
                '<div id="credDrop">' +
                '<div>' +
                    '<ul style="color: #000;max-height: 305px;overflow: auto">' +
                        '<li style="border-bottom: 1px solid #ddd;padding: 8px 15px;" class="dis_flex">' +
                            '<div><div style="font-weight: bold;font-size: 1.1em">订单编号:</div><div style="color: #666">54465PFFSD5456415</div></div>' +
                            '<div><div style="font-weight: bold;font-size: 1.1em">信用消费:<span style="color: red">￥33.00</span></div><div style="color: #666">2018-8-08-05 11:22</div></div>' +
                        '</li>' +
                        '<li style="border-bottom: 1px solid #ddd;padding: 8px 15px;" class="dis_flex">' +
                            '<div><div style="font-weight: bold;font-size: 1.1em">订单编号:</div><div style="color: #666">54465PFFSD5456415</div></div>' +
                            '<div><div style="font-weight: bold;font-size: 1.1em">信用消费:<span style="color: red">￥33.00</span></div><div style="color: #666">2018-8-08-05 11:22</div></div>' +
                        '</li>' +
                    '</ul>' +
                '</div>' +
                '<div class="dis_no" style="font-size: 1.2em;margin-top: 35px;">' +
                    '<div class="dis_flex" style="justify-content: center">' +
                        '<div>' +
                            '<div>使用额度：<span style="color: #1CACEC;font-weight: bold">￥5555.55</span></div>' +
                            '<div>使用账期：<span>20天</span></div>' +
                            '<div style="margin-top: 22px;">本期还款金额：<span style="color: red;font-weight: bold">￥555.55</span></div>' +
                            '<div>本期还款日期：<span>2018-08-08</span></div>' +
                            '<div onclick="creditzf()" style="margin-top: 22px"><span class="hoverOpacity" style="background: red;display: inline-block;padding: 10px 80px;color: #fff">立即还款</span></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '</div>' +
                '</div>'
            });
        },
        orderIdClick:function(id,pid){
            this.PLorder_product_id = id;
            this.PLorder_id = pid;
        },
        discuss:function(e){//提交评论
            var el = e.currentTarget;
            var that = this;
            if($(".imgAll").find('li')){
                $(".imsg").each(function () {
                    that.PLpic+=$(this).attr('value')+',';
                });
            }
            $.ajax({
                url: "/web_api/discuss/discuss_manage.php?m=Off_evaluate",
                async: true,
                data:{
                    uid:vm.user.uId,
                    uname:vm.user.userName,
                    order_id:that.PLorder_id,
                    order_product_id:that.PLorder_product_id,
                    content:that.textVal,
                    pic:that.PLpic,
                    num1:that.PLnum1,
                    num2:that.PLnum2,
                    num3:that.PLnum3,
                    num4:that.PLnum4,
                    num5:that.PLnum5,
                    pf1:that.PLpf1,
                    pf2:that.PLpf2,
                },
                dataType: "json",
                beforeSend: function () {
                    layer.load(1, {shade: .3});
                },
                success: function (data) {
                    layer.closeAll();
                    if(data.status==1){
                        layer.msg('评论成功！',{
                            time:2000,
                            end:function () {
                                $(el).siblings('.btn.btn-default').click();
                            }
                        });
                    }else{
                        layer.msg(data.msg);
                    }

                }
            });
        },
        // point:function(){
        //     var $list = '';
        //     $.ajax({
        //         url:"/order/user_car.php?m=balance_user",
        //         type:"get",
        //         async:false,
        //         dataType:"json",
        //         success:function(data){
        //             if(data.status==1){
        //                 var d = data.data.child_data;
        //                 $.each(d,function (i) {
        //                     $list+='<li class="laui-li cr">' +
        //                         '<div style="text-align: left;">' +
        //                         '<div style="margin-bottom: -5px">消费'+d[i].deta_amount+'元</div>' +
        //                         '<div style="color: #666;font-size: 13px;">'+d[i].add_time+'</div>' +
        //                         '</div>' +
        //                         '<div>' +
        //                         '<div style="text-align: right;line-height: 44px;font-weight: bold;">余额：<span style="color: #E92F00;">'+d[i].now_amount+'元</span></div>' +
        //                         '</div>' +
        //                         '</li>';
        //                 })
        //             }
        //         }
        //     });
        //     layer.alert('<div style="margin: -20px;text-align: center;font-size: 16px">' +
        //         '<div class="cr"><div class="fl" style="width: 50%;background: #EFEFEF;padding: 12px 0">账户明细</div>' +
        //         '<div class="fl" id="goYue" onclick="window.location.href=\'../balance.html\'" style="color: #fff;background: #E92F00;width: 50%;padding: 12px 0">进入余额专区</div>' +
        //         '</div><div>' +
        //         '<ul>' +
        //         $list+
        //         '</ul>' +
        //         '</div>' +
        //         '</div>', {
        //         skin: 'layui-layer-molv' //样式类名
        //         ,closeBtn: 0
        //         ,title:false
        //         ,btn:false
        //         ,area:["400px","320px"]
        //         ,shadeClose:true
        //     })
        // },
        sureClick: function (e, type) {
            var el = e.currentTarget;
            var that = this;
            if (!$(el).hasClass("active")) {
                $(el).addClass("active").siblings().removeClass("active");
                that.zfType = type;
            }
        },
        payList: function () {
            if (vm.checkedNames == '') {
                layer.msg('请选择商品！');
            } else {
                var url = window.btoa('carid_proid=' + vm.checkedNames + '&is_car=0');
                window.location.href = 'pay.html?' + url;
            }
        },
        indexClick: function (e) {
            var that = this;
            $(window).unbind("scroll");
            if (e == 1) {
                $.ajax({
                    url: "/web_api/item/index.php?c=PCHome&m=MyCenter",
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
                            if (data.status == 1) {
                                that.myself = data.data.UserInfo;
                            }
                        }
                    }
                });
            } else if (e == 2) {//我的订单
                that.page = 0;
                that.orderNum();
                that.myOrder = [];
                that.orderList(that.page, that.statusType);
            } else if (e == 3) {//购物车
                $.ajax({
                    url: "/web_api/item/index.php?c=PC_shoppingcar&m=shopping_list",
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
                            if (data.status == 1) {
                                that.myCart = data.data;
                                that.cartShow = true;
                            }
                            vm.imgHover();
                        }
                    }
                });
                // $(window).bind("scroll",function () {
                //     var scrollTop = $(this).scrollTop();
                //     var scrollHeight = $(document).height();
                //     var windowHeight = $(this).height();
                //     if(scrollTop + windowHeight >= scrollHeight-100){
                //
                //     }
                // });
            } else if (e == 4) {   // 我的收藏
                $.ajax({
                    url: "/web_api/item/index.php?c=PCGoods&m=UserGoodsCollectList",
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
                            if (data.status == 1) {
                                that.myCollect = data.data;
                                that.collectShow = true;
                                if (data.data.length == 0) {
                                    that.collectShow = false;
                                }
                            } else {
                                that.collectShow = false;
                            }

                        }
                    }
                })
            }
            // else if (e == 5) {//店铺收藏
            //     $(window).bind("scroll", function () {
            //         var scrollTop = $(this).scrollTop();
            //         var scrollHeight = $(document).height();
            //         var windowHeight = $(this).height();
            //         if (scrollTop + windowHeight >= scrollHeight - 100) {
            //
            //         }
            //     });
            // }
            else if (e == 5) {//收货地址
                $.ajax({
                    url: "/web_api/item/index.php?c=PC_address&m=address",
                    async: true,
                    dataType: "json",
                    beforeSend: function () {
                        layer.load(1, {shade: .3});
                    },
                    success: function (data) {
                        if (data.login_status == 0) {
                            vm.loginModel();
                        } else {
                            if (data.status == 1) {
                                that.myAdr = data.data;
                                that.adrShow = true;
                            }
                            layer.closeAll();
                        }
                    }
                })
            } else if (e == 6) {
                $.ajax({
                    url: "/web_api/item/index.php?c=PCHome&m=GoodsHistoryList",
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
                            if (data.status == 1) {

                                if (data.data.length == 0) {
                                    that.historyShow = false;
                                } else {
                                    var arr = [];
                                    $.each(data.data, function (i) {
                                        arr = arr.concat(data.data[i].child_data);
                                    });
                                    that.history = arr;
                                    that.historyShow = true;
                                }
                            } else {
                                that.historyShow = false;
                            }

                        }
                    }
                })
            } else {
                $(window).unbind("scroll");
            }
        },
        shfw: function (e) {
            var el = e.currentTarget;
            var $html1 = $(el).parents("tr").find("td:first-child").html();
            var $html2 = $(el).parents("tr").find("td:nth-child(2)").html();
            var $html3 = $(el).parents("tr").find("td:nth-child(3)").html();
            this.spDetail = '<table style="width: 90%;"><tr>' +
                '<td width="80%">' + $html1 + '</td>' +
                '<td width="10%">' + $html3 + '</td>' +
                '<td width="10%" style="text-align: center">' + $html2 + '</td>' +
                '</tr></table>';
        },
        qxdd: function (id) {//取消订单
            layer.confirm('是否确认取消该订单？', {
                title: '提示！',
                btn: ['确认', '取消'] //按钮
            }, function () {
                $.ajax({
                    url: "/web_api/item/index.php?c=PC_orderlist&m=order_cancel&order_id=" + id,
                    async: true,
                    dataType: "json",
                    beforeSend: function () {
                        layer.load(1, {shade: .3});
                    },
                    success: function (data) {
                        if (data.login_status == 0) {
                            vm.loginModel();
                        } else {
                            layer.closeAll();
                            if (data.status == 1) {
                                layer.msg(data.msg, {
                                    shade: .3,
                                    time: 1000,
                                    end: function () {
                                        location.reload();
                                    }
                                });
                            } else {
                                layer.msg(data.msg);
                            }

                        }
                    }
                })
            })
        },
        ljzf: function (sn, type) {
            if(type=='Balance'){
                layer.prompt({title: '请输入支付密码！', formType: 1}, function(pass, index){
                    var strB = "pay_pwd=" + pass +"&user_id="+vm.user.uId+"&key=H1ereN3nfdF6wZcoeBdYUfQv7tq1Pq5t";
                    var pwdS = md5(strB).toUpperCase();
                    $.ajax({
                        url: "/web_api/item/index.php?c=PC_orderlist&m=pay&order_seqnos=" + sn,
                        async: true,
                        data: {'pay_type': type,'pwd':pwdS},
                        dataType: "json",
                        success: function (data) {
                            if (data.login_status == 0) {
                                vm.loginModel();
                            } else {
                                if(data.status==5){
                                    layer.msg(data.msg,{
                                        time:2000,
                                        end:function () {
                                            location.reload();
                                        }
                                    })
                                }else{
                                    layer.msg(data.msg);
                                }
                            }
                        }
                        });
                })
            }else{
                $.ajax({
                    url: "/web_api/item/index.php?c=PC_orderlist&m=pay&order_seqnos=" + sn,
                    async: true,
                    data: {'pay_type': type},
                    dataType: "json",
                    success: function (data) {
                        if (data.login_status == 0) {
                            vm.loginModel();
                        } else {
                            if (data.status == 2) {//支付宝
                                window.location.href = '/web_api/alipay/pagepay/pagepay.php';
                            } else if (data.status == 3) {//微信
                                var $img = data.data;
                                var $id = data.order_id;
                                var $sn = data.order_seqno;
                                var setTime = function () {
                                    $.ajax({
                                        url: "/web_api/item/index.php?c=PC_order&m=query_order",
                                        async: false,
                                        data: {'order_seqno': $sn, 'order_id': $id},
                                        dataType: "json",
                                        success: function (data) {
                                            if (data.status == 1) {
                                                layer.msg(data.msg, {
                                                    shade: 0.3,
                                                    time: 1500,
                                                    end: function () {
                                                        location.replace('myself.html');
                                                        sessionStorage.setItem("index", 2);
                                                    }
                                                })
                                            }
                                        }
                                    })
                                };
                                var set = setInterval(setTime, 3000);
                                layer.open({
                                    type: 1,
                                    shade: .3,
                                    area: ['240px', '270px'],
                                    title: false,
                                    content: '<div style="padding: 10px;">' +
                                    '<div class="tc"><img style="width: 200px;" src="' + $img + '" alt=""></div>' +
                                    '<div style="display: flex; justify-content: space-between; width: 140px; margin: 5px auto;">' +
                                    '<div>' +
                                    '<img src="bulid/img/saoma.png" alt="" style="width: 32px;">' +
                                    '</div>' +
                                    '<div style="color: rgb(148, 148, 148); text-align: left;">' +
                                    '<div style="margin-top: -2px;">打开 <span style="color: rgb(255, 69, 2);">手机微信 &nbsp;&nbsp;&nbsp;</span></div>' +
                                    '<div style="margin-top: -4px;">扫一扫继续支付</div></div></div>' +
                                    '</div>',
                                    end: function () {
                                        window.clearInterval(set);
                                    }
                                });
                            } else if (data.status == 4) {//银联
                                window.location.href = '/web_api/unionpay/demo/api_01_gateway/Form_6_2_FrontConsume.php';
                            } else if (data.status == 1) {
                                layer.msg(data.msg, {
                                    time: 1500,
                                    end: function () {
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
        ggzf: function (sn) {//更改支付方式
            var that = this;
            //捕获页
            layer.open({
                type: 1,
                shade: .3,
                area: ['450px', '380px'],
                title: '修改支付方式', //不显示标题
                btn: ['确认', '取消'],
                content: $('#zffs'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
                yes: function () {
                    that.ljzf(sn, that.zfType);
                }
            });
        },
        scdd: function (e, id) {//删除订单
            var el = e.currentTarget;

            layer.confirm('是否确认删除该订单？', {
                title: '提示！',
                btn: ['确认', '取消'] //按钮
            }, function () {
                $.ajax({
                    url: "/web_api/item/index.php?c=PC_orderlist&m=order_del&order_id=" + id,
                    async: true,
                    dataType: "json",
                    success: function (data) {
                        if (data.login_status == 0) {
                            vm.loginModel();
                        } else {
                            if (data.status == 1) {
                                layer.msg(data.msg, {
                                    time: 1000,
                                    shade: 0.3,
                                    end: function () {
                                        location.reload();
                                    }
                                });
                            } else {
                                layer.msg(data.msg);
                            }
                        }
                    }
                })
            })
        },
        pjSpan: function (e,num) {
            var el = e.currentTarget;
            var that = this;
            if (!$(el).hasClass("active")) {
                $(el).addClass("active");
                if(num==1){
                    that.PLnum1 = 1;
                }else if(num==2){
                    that.PLnum2 = 1;
                }else if(num==3){
                    that.PLnum3 = 1;
                }else if(num==4){
                    that.PLnum4 = 1;
                }else{
                    that.PLnum5 = 1;
                }
            } else {
                $(el).removeClass("active");
                if(num==1){
                    that.PLnum1 = 0;
                }else if(num==2){
                    that.PLnum2 = 0;
                }else if(num==3){
                    that.PLnum3 = 0;
                }else if(num==4){
                    that.PLnum4 = 0;
                }else{
                    that.PLnum5 = 0;
                }
            }

        },
        star: function (e,num) {
            var el = e.currentTarget;
            var index = $(el).index();
            var that = this;
            if(num==1){
                that.PLpf1 = index;
            }else{
                that.PLpf2 = index;
            }
            $(el).siblings().removeClass("active");
            $(el).prevAll().addClass("active");
            $(el).addClass("active");
        },
        codeClick: function (e, type) {
            var el = e.currentTarget;
            var phone = $(el).parent().siblings().find(".phoneReg").val();
            var that = this;
            if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
                layer.msg("请输入正确的手机号码！")
            } else {
                if(that.myself.mobile!=phone){
                    layer.msg('您输入的手机号码与绑定的手机号码不一致！');
                    return false;
                }
                if (this.codes === "获取验证码") {
                    var that = this;
                    var timestamp = Date.parse(new Date());
                    timestamp = timestamp / 1000;
                    var StrA = "m=" + type + "&mobile=" + phone + "&timestamp=" + timestamp + "&key=6ljH6wpC4vDPy%Ruqlr4JJmG0kLo%^yN";
                    var parms = {
                        'm': type,
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
        submit: function (e, type) {
            var el = e.currentTarget;
            var phone = $(el).parent().siblings().find(".phoneReg").val();
            var code = $(el).parent().siblings().find(".codeReg").val();
            var pass1 = $(el).parent().siblings().find(".pass1").val();
            var pass2 = $(el).parent().siblings().find(".pass2").val();
            if (pass1 == "" || pass2 == "") {
                layer.msg('请输入密码！');
                return false;
            }else if(pass1.length>16||pass1.length<6){
                layer.msg('请输入6~16位的密码！');
                return false;
            } else if (pass1 != pass2) {
                layer.msg('您两次输入的密码不一致！');
                return false;
            }

            var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;
            var parms = {};
            if (type == 'UserSetPayPassWord') {
                var strB = "pay_pwd=" + pass1 + "&user_id="+vm.user.uId+"&key=H1ereN3nfdF6wZcoeBdYUfQv7tq1Pq5t";
                var pwdS = md5(strB).toUpperCase();
                var StrA = "c=PCHome&code=" + code + "&m=" + type + "&mobile=" + phone + "&paypassword=" + pwdS + "&timestamp=" + timestamp + "&key=6ljH6wpC4vDPy%Ruqlr4JJmG0kLo%^yN";
                parms = {
                    'c': 'PCHome',
                    'm': type,
                    'mobile': phone,
                    'code': code,
                    'paypassword': pwdS,
                    'timestamp': timestamp,
                    'sign': md5(StrA).toUpperCase()
                };
            } else {
                var strB = "pwd=" + pass1 + "&key=!qJwHh!8Ln6ELn3rbFMk5c$vW#l13QLe";
                var pwdS = md5(strB).toUpperCase();
                var StrA = "c=PCHome&code=" + code + "&m=UserSetPassWord&mobile=" + phone +"&pwd=" + pwdS + "&timestamp=" + timestamp + "&type=" + type + "&key=6ljH6wpC4vDPy%Ruqlr4JJmG0kLo%^yN";
                parms = {
                    'c': 'PCHome',
                    'm': 'UserSetPassWord',
                    'mobile':phone,
                    'type': type,
                    'code': code,
                    'pwd': pwdS,
                    'timestamp': timestamp,
                    'sign': md5(StrA).toUpperCase()
                };
            }

            $.ajax({
                url: "/web_api/item/index.php",
                type: "post",
                data: parms,
                dataType: "json",
                success: function (data) {
                    if (data.status == 1) {
                        layer.msg('修改成功！',{
                            time: 1500,
                            end: function () {
                                $(".close").click();
                                $(el).parent().siblings().find(".phoneReg").val("");
                                $(el).parent().siblings().find(".codeReg").val("");
                                $(el).parent().siblings().find(".pass1").val("");
                                $(el).parent().siblings().find(".pass2").val("");
                            }
                        })
                    } else {
                        layer.msg(data.msg)
                    }
                }
            })

        },
        handleClick: function (e) {
            var that = this;
            var el = e.currentTarget;
            this.index = $(el).index() + 1;
            sessionStorage.setItem("index", this.index);//保存下标
            if (!$(el).hasClass("active")) {
                $(el).addClass("active").siblings().removeClass("active");
            }
            that.indexClick(this.index);
        },
        //地址管理
        addrOpen: function () {
            this.showAddr = true;
            $(".pick-area").html(" ");
            $(".pick-area6").pickArea({
                // "format":"上海市/市辖区/普陀区", //格式
                "width": "340",
                "borderColor": "#ff8c00",//文本边框的色值
                "arrowColor": "#ff8c00",//下拉箭头颜色
                "listBdColor": "#ff8c00",//下拉框父元素ul的border色值
                "color": "#ff8c00",//字体颜色
                "hoverColor": "#ff8c00",
                //"preSet":"山东省/临沂市/兰陵县",
                "getVal": function () {
                    // console.log($(".pick-area-hidden").val())
                    // console.log($(".pick-area-dom").val())
                    // var thisdom = $("."+$(".pick-area-dom").val());
                    // thisdom.next().val($(".pick-area-hidden").val());
                }
            });
        },
        addrNorm: function (e, id) {
            var el = e.currentTarget;
            $.ajax({
                url: "/web_api/item/index.php?c=PC_address&m=stat&id=" + id,
                async: true,
                dataType: "json",
                success: function (data) {
                    if (data.login_status == 0) {
                        vm.loginModel();
                    } else {
                        layer.msg(data.msg);
                        if (data.status == 1) {
                            $(el).removeClass("active");
                            $(el).parent().parent().siblings().children().removeClass("active");
                            $(el).parent().parent().siblings().children().find(".normal_btn_set").addClass("active");
                            $(el).parent().parent().children(":first").addClass("active");
                        }
                    }
                }
            });
        },
        addrUpdate: function (e, id) {
            var el = e.currentTarget;
            var $html = $(el).html();
            if ($html == "修改") {
                $(el).html("确认").parent().siblings().find(".updInput").attr("disabled", false).css("background", "#FBF8D0");
            } else {
                var nameadr = $(el).parent().siblings().find(".nameInp").val();
                var adradr = $(el).parent().siblings().find(".adrInp").val();
                var phoneadr = $(el).parent().siblings().find(".phoneInp").val();
                if (nameadr == "") {
                    layer.msg('请输入姓名！');
                } else if (phoneadr == "") {
                    layer.msg('请输入联系电话！');
                } else {
                    $.ajax({
                        url: "/web_api/item/index.php?c=PC_address&m=add_address",
                        async: true,
                        data: {
                            'name': nameadr,
                            'mobile': phoneadr,
                            'address': adradr,
                            'id': id
                        },
                        dataType: "json",
                        success: function (data) {
                            if (data.login_status == 0) {
                                vm.loginModel();
                            } else {
                                layer.msg(data.msg);
                                if (data.status == 1) {
                                    $(el).html("修改").parent().siblings().find(".updInput").attr("disabled", true).css("background", "transparent");
                                }
                            }
                        }
                    });
                }
            }
        },
        addrDel: function (e, id) {
            var el = e.currentTarget;
            layer.confirm('是否确认删除该地址信息？', {
                title: '提示！',
                btn: ['确认', '取消'] //按钮
            }, function () {
                $.ajax({
                    url: "/web_api/item/index.php?c=PC_address&m=dell",
                    async: true,
                    data: {'id': id},
                    dataType: "json",
                    success: function (data) {
                        if (data.login_status == 0) {
                            vm.loginModel();
                        } else {
                            layer.msg(data.msg);
                            if (data.status == 1) {
                                $(el).parents(".adr_old").remove();
                            }
                        }
                    }
                })

            }, function () {

            });
        },
        //删除单个购物车
        delCart: function (e, id) {
            var el = e.currentTarget;
            layer.confirm('是否确认删除该商品？', {
                title: '提示！',
                btn: ['确认', '取消'] //按钮
            }, function () {

                $.ajax({
                    url: "/web_api/item/index.php?c=PC_shoppingcar&m=car_del&car_id=" + id,
                    async: true,
                    dataType: "json",
                    success: function (data) {
                        if (data.login_status == 0) {
                            vm.loginModel();
                        } else {
                            layer.msg(data.msg);
                            if (data.status == 1) {
                                if ($(el).parents("tbody").find("tr").length == 2) {
                                    $(el).parents("tbody").remove();
                                } else {
                                    $(el).parents("tr").remove();
                                }
                                vm.inputNum();
                            }
                        }
                    }
                });
            }, function () {

            });
        },
        //删除多个购物车
        delCartCheck: function () {
            if (vm.checkedNames != '') {
                layer.confirm('是否确认删除选中商品？', {
                    title: '提示！',
                    btn: ['确认', '取消'] //按钮
                }, function () {

                    $.ajax({
                        url: "/web_api/item/index.php?c=PC_shoppingcar&m=car_del&car_id=" + vm.checkedNames,
                        async: true,
                        dataType: "json",
                        success: function (data) {
                            if (data.login_status == 0) {
                                vm.loginModel();
                            } else {
                                layer.msg(data.msg);
                                if (data.status == 1) {
                                    location.reload();
                                }
                            }
                        }
                    });


                }, function () {

                });
            }


        },
        //我的订单
        orDetail: function (id) {
            var url = window.btoa('aid=' + id);
            window.open('orderDetail.html?' + url)
        },
        orderNum: function () {//订单数量
            var that = this;
            $.ajax({
                url: "/web_api/item/index.php?c=PC_orderlist&m=order_number",
                async: true,
                dataType: "json",
                success: function (data) {
                    that.order1Num = data.stay_payment;
                    that.order2Num = data.stay_shipment;
                    that.order3Num = data.stay_take;
                    that.order4Num = data.stay_evaluate;
                }
            });
        },
        orderList: function (page, status) {
            var that = this;
            that.page = page;
            $.ajax({
                url: "/web_api/item/index.php?c=PC_orderlist&m=order_list&pagesize=10",
                async: true,
                data: {'page': page, 'list': status},
                dataType: "json",
                beforeSend: function () {
                    layer.load(1, {shade: .3});
                },
                success: function (data) {
                    layer.closeAll();
                    if (data.login_status == 0) {
                        vm.loginModel();
                    } else {
                        if (data.status == 1) {
                            that.myOrder = that.myOrder.concat(data.data.order_list);
                            that.pageTotal = data.data.order_number;
                            that.orderShow = true;
                            $(window).bind("scroll", function () {
                                var scrollTop = $(this).scrollTop();
                                var scrollHeight = $(document).height();
                                var windowHeight = $(this).height();
                                if (scrollTop + windowHeight == scrollHeight) {
                                    $(window).unbind("scroll");
                                    if (that.page >= that.pageTotal / 10) {
                                        return false;
                                    }
                                    that.page++;
                                    that.orderList(that.page, that.statusType);
                                }
                            });
                        }
                        vm.imgHover();
                    }
                }
            });
        },
        orderStatus: function (e, status) {
            var el = e.currentTarget;
            var that = this;
            if (!$(el).hasClass("active")) {
                $(el).addClass("active").siblings().removeClass("active");
                that.myOrder = [];
                that.statusType = status;
                that.orderList(0, that.statusType);
            }
        },
        //店铺收藏
        collectDel: function (e) {
            var el = e.currentTarget;
            layer.confirm('是否确认删除该店铺？', {
                title: '提示！',
                btn: ['确认', '取消'] //按钮
            }, function () {
                $(el).parents(".collect").remove();
                layer.closeAll();
            }, function () {

            });
        },
        dorHead: function (e) {
            var el = e.currentTarget;
            if (!$(el).hasClass("active")) {
                $(el).addClass("active").siblings().removeClass("active");
            }
        },
        onceAgain:function (id) {//再来一单
            var that = this;
            var again = [];//当前订单
            var proId = '';//产品ID
            var nums = '';//数量
            var shoId = '';//店铺ID
            // var motionId = '';
            $.each(that.myOrder,function (i) {
                if(that.myOrder[i].aid==id){
                    again = that.myOrder[i].child_data;
                    shoId = that.myOrder[i].shop_id;
                }
            });
            $.each(again,function (i) {
                proId+=again[i].product_id+',';
                nums+=again[i].quantity+',';
                // motionId+=again[i].motion_id||0+',';
            });
            $.ajax({
                url:'/web_api/item/index.php?c=PC_orderlist&m=order_shopping_add',
                type:"get",
                data:{
                    'pro_id':proId,
                    'number':nums,
                    'shop_id':shoId,
                    // 'motion_id':motionId
                },
                dataType:"json",
                success:function(data){
                    if (data.login_status == 0) {
                        vm.loginModel();
                    } else {
                        if(data.status==0){
                            layer.msg(data.msg);
                        }else{
                            sessionStorage.setItem("index", 3);
                            location.reload();
                        }
                    }
                }
            });


        }

    }
});