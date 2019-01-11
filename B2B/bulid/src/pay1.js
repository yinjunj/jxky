new Vue({
    el: "#index",
    data: {
        balanShow:false,//余额选中
        show: false,
        pIndex: '',//促销下标
        goodsPay: [],//订单商品
        adrArr: [],//收货地址
        adrName: '',//默认姓名
        adrAdr: '',//默认地址
        adrPhone: '',//默认号码
        order_type: '送货上门',//配送方式
        totals: 0,//商品总价
        sendPrice:0,//物流费
        sendPrice1:0,//物流费
        message:[],//留言
        payFs:'zfb',//支付方式
        motionId:[],//单品促销ID
        motionZid:[],//赠品促销ID
        caridProid:[],//购物车ID
        specialId:'',//促销id
        shopId:'',//店铺id
        numBuy:1,
        balance:'0.00',//总余额
        syBalnce:true
    },
    mounted: function () {
        var that = this;
        var pram = {
            'carid_proid':'',//购物车
            'is_car':'',//购物车
            'type':'',
            'shop_id':'',
            'number':'',
            'motion_id':'',
            'motion_zpid':'',
        };
        pram.is_car = GetQueryStringAtob('is_car');
        pram.carid_proid = GetQueryStringAtob('carid_proid');
        if(GetQueryStringAtob('is_car')==1){//立即购买
            pram.type = GetQueryStringAtob('type');
            pram.shop_id = GetQueryStringAtob('shop_id');
            that.shopId = GetQueryStringAtob('shop_id');
            pram.number = GetQueryStringAtob('number');
            that.numBuy = GetQueryStringAtob('number');
            pram.motion_id = GetQueryStringAtob('motion_id');
            pram.motion_zpid = GetQueryStringAtob('motion_zpid');
        }
        $.ajax({
            url: "/web_api/item/index.php?c=PC_shoppingcar&m=pay_list",
            async: false,
            data: pram,
            dataType: "json",
            success: function (data) {
                if (data.login_status == 0) {
                    vm.loginModel();
                } else {
                    if (data.status == 1) {
                        if(data.data.ress_address.length!=0){
                            that.adrArr = data.data.ress_address;
                            that.adrName = data.data.ress_address[0].user_name;
                            that.adrAdr = data.data.ress_address[0].province + data.data.ress_address[0].city + data.data.ress_address[0].area + data.data.ress_address[0].address;
                            that.adrPhone = data.data.ress_address[0].mobile;
                        }
                        that.goodsPay = data.data.goods;
                        that.balance = data.data.b2b_balance;
                        that.sendPrice = parseFloat(data.data.special_money);
                        that.sendPrice1 = parseFloat(data.data.special_money);
                        that.totals = data.data.amount_pay-that.sendPrice;
                        var d = data.data.goods;
                        $.each(d,function (i) {
                            var arr = '';
                            var arr1 = [];
                            var arr2 = '';
                            that.specialId += (d[i].special_id||0)+',';
                            $.each(d[i].data_child,function (n) {
                                arr += (d[i].data_child[n].motion_id||0)+',';
                                arr1.push(d[i].data_child[n].motion_zpid||0);
                                arr2 += d[i].data_child[n].id+',';
                            });
                            that.motionId.push(arr);
                            that.motionZid.push(arr1);
                            that.caridProid.push(arr2);
                        });
                        vm.imgHover();
                    } else {
                        layer.msg(data.msg);
                    }
                }
            }
        });
    },
    methods: {
        promoIndex: function (e, in1, in2, num, price) {
            var el = e.currentTarget;
            var that = this;
            that.pIndex = $(el).val();
            var val = that.goodsPay[in1].data_child[in2].Promotion;
            $(el).parent().siblings().find(".promoTitle").html(val[that.pIndex].title);
            $(el).parent().siblings().find(".promoZP").hide();
            that.motionId=[];
            that.motionZid=[];

            $.each(that.goodsPay,function (i) {
                var arr = '';
                var arr1 = [];
                $.each(that.goodsPay[i].data_child,function (n) {
                    if(i==in1&&n==in2){
                        $.each(that.goodsPay[i].data_child[n].Promotion,function (m) {
                            if(m==that.pIndex){
                                arr += (that.goodsPay[i].data_child[n].Promotion[m].id||0)+',';
                                $.each(that.goodsPay[i].data_child[n].Promotion[m].titles,function (l) {
                                    arr1 += (that.goodsPay[i].data_child[n].Promotion[m].titles.id||0)+',';
                                });
                            }
                        });
                    }else{
                        arr += (that.goodsPay[i].data_child[n].motion_id||0)+',';
                        arr1.push(that.goodsPay[i].data_child[n].motion_zpid||0);
                    }


                });
                that.motionId.push(arr);
                that.motionZid.push(arr1);
            });
            if (val[that.pIndex].type == 'mzhe') {//满折
                var $z = Math.floor(num / val[that.pIndex].mzhe_number);
                if ($z > 0) {
                    $z*val[that.pIndex].reduce_amount>val[that.pIndex].point?$z=10-val[that.pIndex].point:$z=$z*val[that.pIndex].reduce_amount;
                    var total = (num * price * (1 - ($z * 0.1))).toFixed(2);
                    $(el).parent().siblings().find(".total").html('￥' + total);
                }
            } else if (val[that.pIndex].type == 'mjy') {//钱满减
                if (num * price >= val[that.pIndex].full_amount) {
                    var total = (num * price - val[that.pIndex].reduce_amount).toFixed(2);
                    $(el).parent().siblings().find(".total").html('￥' + total);
                }
            } else if (val[that.pIndex].type == 'mjt') {//数量满减
                if (num >= val[that.pIndex].mj_number) {
                    var total = (num * price - val[that.pIndex].reduce_amount).toFixed(2);
                    $(el).parent().siblings().find(".total").html('￥' + total);
                }
            } else if (val[that.pIndex].type == 'mzeng') {//满赠
                var $html = '赠：';
                $.each(val[that.pIndex].titles, function (i) {
                    $html += '<img class="toolimg" alt="' + val[that.pIndex].titles[i].zp_title + '" src="' + val[that.pIndex].titles[i].zp_pro_img + '"/>';
                });
                $(el).parent().siblings().find(".promoZP").show().html($html);
                var total = (num * price).toFixed(2);
                $(el).parent().siblings().find(".total").html('￥' + total);
                vm.imgHover();
            }
            that.totalz();
            that.total();
        },
        totalz: function(){//单家店总价计算物流费
            var that = this;
            that.sendPrice = 0;
            that.sendPrice1 = 0;
            $('tbody').each(function () {
                var tot = 0;
                var $index = $(this).index()-1;
                $(this).find('.total').each(function () {
                    var price = parseFloat($(this).text().substring(1));
                    tot += price;
                });
                var val = that.goodsPay[$index];
                if(val.full_money&&tot>=val.full_money){
                    that.sendPrice -= Math.floor(tot)*val.reduce_percen*0.01;
                    that.sendPrice1 -= Math.floor(tot)*val.reduce_percen*0.01;
                }else if(val.full_money&&tot>=val.droop_moneys){
                    that.sendPrice += Math.floor(tot)*val.collect_percen*0.01;
                    that.sendPrice1 += Math.floor(tot)*val.collect_percen*0.01;
                }else if(val.collect_money){
                    that.sendPrice += parseFloat(val.collect_money);
                    that.sendPrice1 += parseFloat(val.collect_money);
                }
            });
        },
        total: function () {//商品总价
            var that = this;
            that.totals = 0;
            $('.total').each(function () {
                var price = parseFloat($(this).text().substring(1));
                that.totals += price;
            });
        },
        payClick: function () {//提交订单
            var that = this;
            if(that.order_type=='送货上门'&&that.adrName==''){
                layer.msg('请添加收货地址！');
                return false;
            }
            if(that.payFs=='Balance'){
                if(that.totals+that.sendPrice>that.balance){
                    layer.msg('您的余额不足！请选择其他支付方式或者前往充值！');
                    return false;
                }else{
                    layer.prompt({title: '请输入支付密码！', formType: 1}, function(pass, index){
                        var timestamp = Date.parse(new Date());
                        timestamp = timestamp / 1000;
                        var strB = "pay_pwd=" + pass + "&timestamp=" + timestamp + "&user_id="+vm.user.uId+"&key=H1ereN3nfdF6wZcoeBdYUfQv7tq1Pq5t";
                        var pwdS = md5(strB).toUpperCase();
                        $.ajax({
                            url: "/web_api/item/index.php?c=PC_order&m=order_add",
                            async: true,
                            data: {
                                'dealer_name': that.adrName,
                                'dealer_mobile': that.adrPhone,
                                'dealer_address': that.adrAdr,
                                'message': that.message,
                                'order_type': that.order_type,
                                'pay_type': that.payFs,
                                'motion_id': that.motionId,
                                'motion_zpid': that.motionZid,
                                'pay_device': 'PC',
                                'coupon_id': '',
                                'is_car': GetQueryStringAtob('is_car'),
                                'carid_proid': that.caridProid,
                                'special_id': that.specialId,
                                'shop_id':that.shopId,
                                'number':that.numBuy,
                                'pwd':pwdS
                            },
                            dataType: "json",
                            success: function (data) {
                                if (data.login_status == 0) {
                                    vm.loginModel();
                                } else {
                                    if(data.status == '5'){
                                        layer.closeAll();
                                        layer.msg(data.msg,{
                                            time:2000,
                                            end:function () {
                                                location.replace('myself.html');
                                                sessionStorage.setItem("index", 2);
                                            }
                                        });
                                    }else{
                                        layer.msg(data.msg);
                                    }
                                }
                            }
                        });
                    });
                }
            }else{
                $.ajax({
                    url: "/web_api/item/index.php?c=PC_order&m=order_add",
                    async: true,
                    data: {
                        'dealer_name': that.adrName,
                        'dealer_mobile': that.adrPhone,
                        'dealer_address': that.adrAdr,
                        'message': that.message,
                        'order_type': that.order_type,
                        'pay_type': that.payFs,
                        'motion_id': that.motionId,
                        'motion_zpid': that.motionZid,
                        'pay_device': 'PC',
                        'coupon_id': '',
                        'is_car': GetQueryStringAtob('is_car'),
                        'carid_proid': that.caridProid,
                        'special_id': that.specialId,
                        'shop_id':that.shopId,
                        'number':that.numBuy,
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data.login_status == 0) {
                            vm.loginModel();
                        } else {
                            if (data.status == 2) {//支付宝
                                location.replace('/web_api/alipay/pagepay/pagepay.php');
                            } else if(data.status == 3){//微信
                                var $img  = data.data;
                                var $id = data.order_id;
                                var $sn = data.order_seqno;
                                var setTime = function () {
                                    $.ajax({
                                        url: "/web_api/item/index.php?c=PC_order&m=query_order",
                                        async: false,
                                        data: {'order_seqno':$sn,'order_id':$id},
                                        dataType: "json",
                                        success: function (data) {
                                            if(data.status==1){
                                                layer.msg(data.msg,{
                                                    shade:0.3,
                                                    time:1500,
                                                    end:function () {
                                                        location.replace('myself.html');
                                                        sessionStorage.setItem("index", 2);
                                                    }
                                                })
                                            }
                                        }
                                    })
                                };
                                var set = setInterval(setTime,3000);
                                layer.open({
                                    type: 1,
                                    shade: .3,
                                    area:['240px','270px'],
                                    title:false,
                                    content: '<div style="padding: 10px;">' +
                                    '<div class="tc"><img style="width: 200px;" src="'+$img+'" alt=""></div>' +
                                    '<div style="display: flex; justify-content: space-between; width: 140px; margin: 5px auto;">' +
                                    '<div>' +
                                    '<img src="bulid/img/saoma.png" alt="" style="width: 32px;">' +
                                    '</div>' +
                                    '<div style="color: rgb(148, 148, 148); text-align: left;">' +
                                    '<div style="margin-top: -2px;">打开 <span style="color: rgb(255, 69, 2);">手机微信 &nbsp;&nbsp;&nbsp;</span></div>' +
                                    '<div style="margin-top: -4px;">扫一扫继续支付</div></div></div>'+
                                    '</div>',
                                    end:function () {
                                        location.replace('myself.html');
                                        sessionStorage.setItem("index", 2);
                                    }
                                });
                            }  else if(data.status == 4){//银联
                                location.replace('/web_api/unionpay/demo/api_01_gateway/Form_6_2_FrontConsume.php');
                            }else if(data.status == 1){
                                location.replace('myself.html');
                                sessionStorage.setItem("index", 2);
                            }
                        }
                    }
                });
            }

        },
        modelAdr: function () {
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
        sureClick: function (e, type , py) {
            var el = e.currentTarget;
            var that = this;
            if (!$(el).hasClass("active")) {
                $(el).addClass("active").siblings().removeClass("active");
            }
            if (type == 'adr') {
                that.adrName = $(el).children().eq(0).text().split("：")[1];
                that.adrAdr = $(el).children().eq(1).text().split("：")[1];
                that.adrPhone = $(el).children().eq(2).text().split("：")[1];
            } else if (type == 'deliver') {
                that.order_type = $(el).text();
                if($(el).index()==0){//送货上门
                    that.sendPrice = that.sendPrice1;
                }else{
                    that.sendPrice = 0;
                }
            }else if(type == 'pay'){
                that.payFs = py;
                if(py=='Balance'){
                    that.balanShow = true;
                    that.syBalnce = true;
                }else{
                    that.balanShow = false;
                    that.syBalnce = false;
                }
            }
        }
    }
});