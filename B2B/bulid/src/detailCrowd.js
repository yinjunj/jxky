var obj = '';
//注意进度条依赖 element 模块，否则无法进行正常渲染和功能性操作

Vue.component("crowd-temp",{
    props:['list'],
    data: function () {
        return {
            days: '00',
            hours: '00',
            minutes: '00',
            seconds: '00',
            shareShow: false,
            num: this.list.minimum_order_quantity,//购买数量
            minNum: this.list.minimum_order_quantity,//起订量
            progra: '0',//进度条
            flTotal: '????',//返利
            start: false,//活动是否开始
            end: false,//活动是否结束
            jjh:false,//金嘉护
            total: '????'//应付金额
        }
    },
    mounted: function () {
        var that = this;

        if(that.list.product_title.indexOf("金嘉护") != -1){
            that.jjh = true;
        }


        layui.use('element', function(){
            var element = layui.element;
        });

        that.nowTime = new Date().getTime();

        obj = new mag('.show'+that.list.id, '.bigshow'+that.list.id, '.smallshow'+that.list.id, '.mask'+that.list.id, '.bigitem'+that.list.id ,'.prev'+that.list.id, '.next'+that.list.id, '.middle'+that.list.id, '.middle_box'+that.list.id ,that.list.pics.length);
        obj.init();

        if($(".middle"+that.list.id).children().length<=5){
            $(".smallshow"+that.list.id+">.next").css({
                'background': 'url(bulid/img/glass/next.png) no-repeat',
                'cursor': 'not-allowed'
            })
        }

        that.progra = Math.round(that.list.zc_now / that.list.zc_success * 10000) / 100.00;
        that.progra = that.progra<1&&that.progra!=0?1:that.progra;

        if(vm.loginIs){
            that.totalss();
        }
        

        setInterval(function () {
            var nowTime = new Date().getTime();//当前时间毫秒
            // var starttime = da.start_time;
            // starttime = starttime.replace(new RegExp("-", "gm"), "/");
            var starttimeHaoMiao = new Date(that.list.start_time).getTime(); //得到毫秒数
            var endtimeHaoMiao = new Date(that.list.end_time).getTime(); //得到毫秒数
            var mmsTime = '';
            var mmsTime1 = endtimeHaoMiao - nowTime;
            var mmsTime2 = starttimeHaoMiao - nowTime;
            console.log(mmsTime1);
            console.log(mmsTime2);
            if(mmsTime1>0&&mmsTime2<0){
                mmsTime = mmsTime1;//活动开始
                that.start = true;
            }else if(mmsTime2>0){
            //活动未开始
            }else{
                //活动结束
                that.end = true;
                return false;
            }
            that.formatDuring(mmsTime);
        }, 1000);

        // 滚动监听
        // window.addEventListener('scroll', this.handleScroll);
    },
    methods: {
        totalss:function(){
            this.total = (this.num*this.list.zc_price).toFixed(2);
            this.flTotal = ((this.list.zc_price-this.list.zc_success_price)*this.num).toFixed(2);
        },
        formatDuring: function (mss) {
            var that = this;
            var days = parseInt(mss / (1000 * 60 * 60 * 24));
            var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = (mss % (1000 * 60)) / 1000;
            if (seconds.toFixed(0) < 0) {
                seconds = 0;
            }
            that.days = days;
            that.hours = hours;
            that.minutes = minutes;
            that.seconds = seconds.toFixed(0);
            if (days < 10) {
                that.days = '0' + days;
            }
            if (hours < 10) {
                that.hours = '0' + hours;
            }
            if (minutes < 10) {
                that.minutes = '0' + minutes;
            }
            if (seconds < 10) {
                that.seconds = '0' + seconds.toFixed(0);
            }
        },
        numClick: function (e, v) {
            var el = e.currentTarget;
            if (v == '-') {
                if (this.num <= this.minNum) {
                    layer.msg('该商品最小起订量为'+this.minNum);
                    this.num = this.minNum;
                    return false;
                }
                this.num--;
            } else {
                if(this.num>=99999){
                    layer.msg('已超过该商品的库存！');
                    this.num = 99999;
                    return false;
                }
                this.num++;
            }
            this.totalss();
        },
        numInput:function(){
            if (this.num < this.minNum) {
                layer.msg('该商品最小起订量为'+this.minNum);
                this.num = this.minNum;
                return false;
            }else if(this.num>=99999){
                layer.msg('已超过该商品的库存！');
                this.num = 99999;
                return false;
            }
            this.totalss();
        },
        payClick: function () {
            var that = this;
            if(vm.loginIs){
                if(that.num<that.minNum){
                    layer.msg('该商品最小起订量为'+that.minNum);
                }else if(that.num>that.stock){
                    layer.msg('库存不足！');
                }else{
                    //捕获页
                    layer.open({
                        type: 1,
                        shade: .3,
                        area: ['450px', '300px'],
                        title: '选择支付方式', //不显示标题
                        btn: ['确认', '取消'],
                        content: $('#zffs'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
                        yes: function () {
                            that.ljzf();
                        }
                    });
                }
            }else{
                vm.loginModel();
            }
        },
        ljzf: function () {
            var that = this;
            var type = crowdVue.zfType;
            if(type=='Balance'){
                    layer.prompt({title: '请输入支付密码！', formType: 1}, function(pass, index){
                        var strB = "pay_pwd=" + pass + "&user_id="+vm.user.uId+"&key=H1ereN3nfdF6wZcoeBdYUfQv7tq1Pq5t";
                        var pwdS = md5(strB).toUpperCase();
                        $.ajax({
                            url: "/web_api/item/index.php?c=PC_order&m=order_add",
                            async: true,
                            data: {
                                'pay_type': type,
                                'is_car': 3,
                                'carid_proid': that.list.product_id,
                                'shop_id':12,
                                'pro_type':0,
                                'coupon_id':that.list.id,
                                'coupon_type':2,
                                'number':that.num,
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
            }else{
                $.ajax({
                    url: "/web_api/item/index.php?c=PC_order&m=order_add",
                    async: true,
                    data: {
                        'pay_type': type,
                        'is_car': 3,
                        'carid_proid': that.list.product_id,
                        'shop_id':12,
                        'pro_type':0,
                        'coupon_id':that.list.id,
                        'coupon_type':2,
                        'number':that.num,
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
        sureClick: function (e, type) {
            var el = e.currentTarget;
            if (!$(el).hasClass("active")) {
                $(el).addClass("active").siblings().removeClass("active");
                crowdVue.zfType = type;
            }
        },
        rule:function () {
            layer.alert('<img src="bulid/img/rule.png" alt="">', {
                    skin: 'layui-layer-molv'
                    ,closeBtn: 0
                    ,shadeClose:true
                    ,btn: false
                    ,area: ['800px', '585px']
                    ,title:false
                    ,anim: 4 //动画类型
                });
        }
    },
    template:'<section id="" class="cr dis_flex" style="position: relative;margin-top: 16px;background: #fff;padding: 20px;">\n' +
    ' <div id="zffs" style="display: none;width: 400px;margin: 0 auto;padding-top: 20px;">\n' +
    '        <div @click="sureClick($event,\'zfb\')" class="sure paySure active" style="width: 150px;text-align: center;margin: 7px auto;padding: 3px 0;">\n' +
    '            <i></i>\n' +
    '            <span class="fa">\n' +
    '                        <img style="width: 20px;margin: 3px;" src="bulid/img/zhifubao.png" alt="">\n' +
    '                    </span>\n' +
    '            支付宝支付\n' +
    '        </div>\n' +
    '        <div @click="sureClick($event,\'weixin\')" class="sure paySure" style="width: 150px;text-align: center;margin: 7px auto;padding: 6px 0;">\n' +
    '            <i></i>\n' +
    '            <span style="color:#77CE36;font-size: 1.2em" class="fa fa-weixin" aria-hidden="true"></span>\n' +
    '            微信支付\n' +
    '        </div>\n' +
    '        <div @click="sureClick($event,\'UnionPay\')" class="sure paySure" style="width: 150px;text-align: center;margin: 7px auto;padding: 3px 0;">\n' +
    '            <i></i>\n' +
    '            <span class="fa">\n' +
    '                            <img style="width: 26px;" src="bulid/img/yinlian.png" alt="">\n' +
    '                        </span>\n' +
    '            银联支付\n' +
    '        </div>\n' +
    '        <div @click="sureClick($event,\'Balance\')" class="sure paySure" style="width: 150px;text-align: center;padding: 6px 0;margin: 7px auto">\n' +
    '            <i></i>\n' +
    '            <span style="color:#D5282C;font-size: 1.2em; padding: 0 6px;" class="fa fa-usd" aria-hidden="true"></span>\n' +
    '            余额支付\n' +
    '        </div>\n' +
    '    </div>' +
    '            <div style="width: 430px;position: relative;">\n' +
    '                <div class="bg_left">\n' +
    '                    <div class="show" :class="\'show\'+list.id">\n' +
    '                        <img :src="list.pics[0]" alt="">\n' +
    '                        <div class="mask" :class="\'mask\'+list.id"></div>\n' +
    '                    </div>\n' +
    '                    <div class="smallshow" :class="\'smallshow\'+list.id">\n' +
    '                        <p class="prev prevnone hoverOpacity" :class="\'prev\'+list.id"></p>\n' +
    '                        <div class="middle_box" :class="\'middle_box\'+list.id">\n' +
    '                            <ul class="middle" :class="\'middle\'+list.id">\n' +
    '                                <li v-for="(item,index) in list.pics" v-if=\'index<=8\'><img :src="item" alt=""></li>\n' +
    '                            </ul>\n' +
    '                        </div>\n' +
    '                        <p class="next hoverOpacity" :class="\'next\'+list.id"></p>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div class="bg_right">\n' +
    '                    <div class="bigshow" :class="\'bigshow\'+list.id">\n' +
    '                        <div class="bigitem" :class="\'bigitem\'+list.id">\n' +
    '                            <img :src="list.pics[0]" alt="">\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div style="width: 553px;">\n' +
    '                <div style="font-size: 1.2em;font-weight: bold;color: #000;padding: 20px 10px 5px">{{list.product_title}}</div>\n' +
    // '                <div style="padding: 5px 10px;color: #D9272E;font-weight: bold;font-size: 1.1em" v-show="miaoshu!=\'\'">{{miaoshu}}</div>\n' +
    '                <div style="background: url(\'bulid/img/detailcbg.jpg\') no-repeat;width: 553px;height: 101px;">\n' +
    '                    <div style="padding: 12px 10px;" class="dis_flex">\n' +
    '                        <div>\n' +
    '                            <div style="display: inline-block;vertical-align: top;width: 80px;">\n' +
    '                                <div style="margin-top: 5px;">\n' +
    '                                    市场价：\n' +
    '                                </div>\n' +
    '                                <div style="margin-top: 5px;">\n' +
    '                                    当前价格：\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                            <div style="display: inline-block;">\n' +
    '                                <div>\n' +
    '                                    <div style="text-decoration: line-through;vertical-align: top;color: #000">\n' +
    '                                        ￥{{list.product_price}}\n' +
    '                                    </div>\n' +
    '                                    <div style="font-size: 1.1em;color: #D9272E">\n' +
    '                                        ￥<span style="font-size: 1.4em;font-weight: bold;">{{list.zc_price}}</span>\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                            <!--<div style="width: 80px;">-->\n' +
    '                            <!--店铺活动：-->\n' +
    '                            <!--</div>-->\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '\n' +
    '                <div style="margin-top: 15px;">\n' +
    '                    <span>距众筹<span v-if="!start">开始</span><span v-else>结束</span>还有：</span>\n' +
    '                    <div style="background: #000;color: #fff;padding: 3px;display: inline-block;">{{days}}</div>\n' +
    '                    <span style="font-weight: bold;color: #000">天</span>\n' +
    '                    <div style="background: #000;color: #fff;padding: 3px;display: inline-block;">{{hours}}</div>\n' +
    '                    <div style="color: #000;padding: 3px;font-weight: bold;display: inline-block;">:</div>\n' +
    '                    <div style="background: #000;color: #fff;padding: 3px;display: inline-block;">{{minutes}}</div>\n' +
    '                    <div style="color: #000;padding: 3px;font-weight: bold;display: inline-block;">:</div>\n' +
    '                    <div style="background: #000;color: #fff;padding: 3px;display: inline-block;">{{seconds}}</div>\n' +
    '                </div>\n' +
    '                <div style="margin: 15px 0;">众筹进度：<span style="color: #FC3838"><span v-if="jjh">金嘉护10W/40与15W/50，众筹合计满{{list.zc_success}}后仅{{list.zc_success_price}}元</span><span v-else>该商品市场价{{list.product_price}}元，众筹合计满{{list.zc_success}}后仅{{list.zc_success_price}}元</span></span></div>\n' +
    '                <div style="width: 90%;margin: 15px auto;">\n' +
    '                    <div class="layui-progress layui-progress-big" lay-showPercent="true">\n' +
    '                        <div class="layui-progress-bar layui-bg-red pr" :lay-percent="progra+\'%\'">\n' +
    '                        </div>\n' +
    '                        <div style="position: absolute;top: -40px;right: -10px;text-align: center">\n' +
    '                            <div>众筹成功价</div>\n' +
    '                            <div style="color: red;font-size: 1.5em"><span style="font-size: 1rem">￥</span>{{list.zc_success_price}}</div>\n' +
    '                        </div>\n' +
    '                        <div style="position: absolute;top: 20px;right: -10px;">\n' +
    '                            <div style="color: #7D4621;">{{list.zc_success}}桶</div>\n' +
    '                        </div>\n' +
    '                        <div style="color: #7D4621;position: absolute;top: 20px;right: 30%;-webkit-transform: translateX(-50%);-moz-transform: translateX(-50%);-ms-transform: translateX(-50%);-o-transform: translateX(-50%);transform: translateX(-50%);">\n' +
    '                           当前众筹{{list.zc_now}}桶\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '\n' +
    '\n' +
    '                <div class="dis_flex">\n' +
    '                    <div style="margin-top: 10px;">\n' +
    '                        <div style="display: inline-block;vertical-align: top;width: 74px;padding-top: 12px;">\n' +
    '                            数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 量：\n' +
    '                        </div>\n' +
    '                        <div style="display: inline-block;">\n' +
    '                            <div class="input-group" style="width: 120px;">\n' +
    '                                <div @click="numClick($event,\'-\')" class="input-group-addon hoverOpacity">－</div>\n' +
    '                                <input type="text" class="form-control" @input="numInput" onkeyup="value=value.replace(/[^\\d]/g,\'\')"\n' +
    '                                       style="text-align: center;width: 80px;" :value="num" v-model.number="num">\n' +
    '                                <div @click="numClick($event,\'+\')" class="input-group-addon hoverOpacity">＋</div>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '\n' +
    '                <div class="dis_flex pr" style="width: 100%;background: #f2f2f2;">\n' +
    '                    <div style="padding: 5px 15px;">\n' +
    '                        <div>\n' +
    '                            应付：<span style="color: #E5151E">￥</span><span style="font-size: 2em;color: #E5151E">{{total}}</span>\n' +
    '                        </div>\n' +
    '                        <div>\n' +
    '                            若众筹成功后可以返利 <span style="color: #E5151E;">￥{{flTotal}}</span>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div v-if="start" @click="payClick" class="hoverOpacity" style="font-size: 2em;text-align: center;color: #fff;background: #FE0F20;border-radius: 3px;display: inline-block;width: 50%;line-height: 70px">&nbsp;立即购买&nbsp;</div>\n' +
    '                    <div v-else-if="end" style="font-size: 2em;text-align: center;color: #fff;background: #ddd;border-radius: 3px;display: inline-block;width: 50%;line-height: 70px;cursor: not-allowed">&nbsp;已结束&nbsp;</div>\n' +
    '                    <div v-else style="font-size: 2em;text-align: center;color: #fff;background: #ddd;border-radius: 3px;display: inline-block;width: 50%;line-height: 70px;cursor: not-allowed">&nbsp;即将开始&nbsp;</div>\n' +
    '                    <div v-if="end"><img v-if="jjh" style="position: absolute;top: -134px;left: 55%;" src="bulid/img/crowdSuccess.png" alt="" />' +
    '                    <img v-else style="position: absolute;top: -134px;left: 55%;" src="bulid/img/crowdFalse.png" alt="" /></div>' +
    '                </div>\n' +
    '                <div style="margin-top: 10px;">\n' +
    '                    <div style="display: inline-block;vertical-align: top;width: 74px;">\n' +
    '                        服务承诺\n' +
    '                    </div>\n' +
    '                    <div style="display: inline-block;">\n' +
    '                        全平台商品厂家授权 正品保障\n' +
    '                        &nbsp;&nbsp;\n' +
    '                        众筹商品仅支持线上付款\n' +
    '                        <span class="dropdown hover_head" style="margin: 0 20px;">\n' +
    '                      <span class="dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown" data-hover="dropdown"\n' +
    '                            aria-haspopup="true" aria-expanded="true">\n' +
    '                        支付方式<span class="caret"></span>\n' +
    '                      </span>\n' +
    '                      <ul class="dropdown-menu" aria-labelledby="dropdownMenu1" style="color: #000;">\n' +
    '                        <li><span style="color:#D5282C;font-size: 1.2em;margin: 0 7.8px;" class="fa fa-usd" aria-hidden="true"></span> 余额</li>\n' +
    '                        <li><i class="fa"><img style="width: 26px;padding: 0 4px;" src="bulid/img/zhifubao.png" alt=""></i> 支付宝</li>\n' +
    '                        <li><i style="color:#77CE36;font-size: 1.2em;margin: 7px 2px 0 5px;vertical-align: bottom" class="fa fa-weixin" aria-hidden="true"></i> 微信支付</li>\n' +
    '                        <li><i class="fa"><img style="width: 26px;" src="bulid/img/yinlian.png" alt=""></i> 银联</li>\n' +
    '                      </ul>\n' +
    '                    </span>\n' +
    '                        <span v-if="shareShow" @mouseenter="shareShow = !shareShow" @mouseleave="shareShow = !shareShow"\n' +
    '                              class="hover_head pr">\n' +
    '                        分享 <i class="fa fa-share" aria-hidden="true"></i>\n' +
    '                            <!--分享-->\n' +
    '                        <transition name="slide-fade">\n' +
    '                            <div v-show="shareShow" style="position: absolute;top: 20px;width: 240px;left: -80px;">\n' +
    '                                <div class="bshare-custom icon-medium-plus"><div class="bsPromo bsPromo2"></div><a\n' +
    '                                        title="分享到QQ好友" class="bshare-qqim" href="javascript:void(0);"></a><a\n' +
    '                                        title="分享到微信" class="bshare-weixin" href="javascript:void(0);"></a><a\n' +
    '                                        title="分享到QQ空间" class="bshare-qzone" href="javascript:void(0);"></a><a\n' +
    '                                        title="分享到新浪微博" class="bshare-sinaminiblog"></a><a title="分享到腾讯微博"\n' +
    '                                                                                           class="bshare-qqmb"></a><a\n' +
    '                                        title="更多平台" class="bshare-more bshare-more-icon more-style-addthis"></a></div><script\n' +
    '                                    type="text/javascript" charset="utf-8"\n' +
    '                                    src="http://static.bshare.cn/b/buttonLite.js#style=-1&amp;uuid=&amp;pophcol=2&amp;lang=zh"></script><script\n' +
    '                                    type="text/javascript" charset="utf-8"\n' +
    '                                    src="http://static.bshare.cn/b/bshareC0.js"></script>\n' +
    '                            </div>\n' +
    '                        </transition>\n' +
    '                    </span>\n' +
    '                    </div>\n' +
    '\n' +
    '                </div>\n' +
    '\n' +
    '            </div>\n' +
    '            <!--平台热销-->\n' +
    '            <div style="width: 188px;position: absolute;right: 20px;top: 0;">\n' +
    '                <div class="right_list cr" style="border: none;width: 92px;">\n' +
    '                    <div @click="rule" class="right_list_head" style="background: #F5B7BC;color: #FEFAFA;border-radius: 0 0 16px 16px;"><span>众筹规则</span></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </section>'
});

var crowdVue = new Vue({
    el: "#index",
    data:{
        list:[],
        rule:'',
        zfType:'zfb',//支付方式
        crowdShow:false
    },
    mounted:function () {
        var that = this;
        $.ajax({
            url:'/web_api/item/index.php?c=PCHome&m=Crowdfunding&pagesize=10&page=0&source=PC&user_id='+vm.user.uId,
            type:"get",
            async:false,
            dataType:"json",
            success:function(data){
                if(data.status==1){
                    that.list = data.data.list;
                    that.rule = data.data.rule;
                    that.crowdShow = true;
                }else{
                    layer.msg(data.msg);
                }
            }
        });
    }
});