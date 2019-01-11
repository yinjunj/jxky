var obj = '';

var detailVue = new Vue({
    el: "#index",
    data: {
        cartMess:{'proId':'','shopId':'','type':'0','moId':'','moZid':'','moType':''},//购物车参数
        buycarid_proid:'',//立即购买参数
        buyshop_id:'',//立即购买参数
        buymoId:'',//立即购买参数
        buymoZid:'',//立即购买参数
        indexId:0,
        shareShow: false,
        nowTime:'',//当前时间
        show: false,
        detail: [],
        pics:[],//产品图
        cate_title:'',
        title:'',
        miaoshu:'',
        picsDetail:[],//产品详情
        picFirst: '',//第一张图片
        markPriceOld:'',//零售价
        markPrice:'',//市场价
        sealPrice:'',//销售价
        promotion:[],//当前时间段促销信息
        promoShow:false,//是否显示促销
        spec:[],//规格
        dorShop:[],//店长推荐
        AppShop:[],//平台热销
        appPage:0,//平台热销页数
        num: 1,//购买数量
        score: '5.0',//分数
        redStar: 5,//红心
        witStar: 0,//白心
        fixeShow: false,//底部悬浮条
        assesShow: true,
        couponShow: false,
        minNum:1,//起订量
        stock:0,//库存
        sale:0,//销量
        plList:[],//评论列表
        biaoqian:'',//评论标签
        plHp:0,//好评
        plZp:0,//中评
        plCp:0,//差评
    },
    mounted: function () {
        var that = this;
        that.nowTime = new Date().getTime();
        $.ajax({
            url:'/web_api/discuss/discuss_manage.php?m=Discuss_list&goods_id='+GetQueryStringAtob('id')+'&status=0',
            type:"get",
            async:true,
            dataType:"json",
            success:function(data){
                if(data.status==1){
                    that.plList = data.data;
                    that.biaoqian = data.impression;
                    that.score = (parseInt(data.feedback.hpl)*0.05).toFixed(1);
                    that.redStar = Math.round(parseInt(data.feedback.hpl)*0.05);
                    that.witStar = 5-that.redStar;
                    that.plHp = data.hpnumber.hpnumber;
                    that.plZp = data.zpnumber.zpnumber;
                    that.plCp = data.cpnumber.cpnumber;
                    vm.imgHoverBig();
                }

            }
        });
        $.ajax({
            url:'/web_api/item/index.php?c=PCGoods&m=IndexGoodsList&call_index=webdztj',
            type:"get",
            async:true,
            dataType:"json",
            success:function(data){
                    that.dorShop = data.data;
            }
        });
        $.ajax({
            url: "/web_api/item/index.php?c=PCGoods&m=IndexGoodsList&call_index=webptrx",
            async: true,
            dataType: "json",
            success: function (data) {
                    that.AppShop = data.data;
            }
        });

        $.ajax({
            url: "/web_api/item/index.php?c=PCGoods&m=GetGoodsInfo",
            async: false,
            data: {'pid':GetQueryStringAtob('pid'),'id':GetQueryStringAtob('id')},
            dataType: "json",
            success: function (data) {
                var d = data.data;
                if (data.status = 1) {
                    that.detail = d.goods;
                    that.buyshop_id = d.shop.ID;
                    that.spec = d.product;
                    var $promotion ='';
                    if(GetQueryStringAtob('pid')==''){
                        that.title = d.product[0].product_title;
                        that.miaoshu = d.product[0].miaoshu;
                        that.picFirst = d.product[0].imgs[0];
                        that.pics = d.product[0].imgs;
                        that.picsDetail = d.product[0].contents_mobi;
                        that.indexId =0;
                        that.markPriceOld = d.product[0].b2c_seal_price;
                        that.markPrice = d.product[0].market_price;
                        that.sealPrice = d.product[0].seal_price;
                        that.stock = d.product[0].stock_headquarters;
                        that.sale = d.product[0].sales;
                        that.cate_title = d.product[0].cate_title;
                        that.minNum = d.product[0].minimum_order_quantity;
                        that.num = d.product[0].minimum_order_quantity;
                        // 默认加入购物车参数，
                        that.cartMess.proId = d.product[0].product_id;
                        that.cartMess.shopId = d.product[0].shop_id;
                        // 默认加入购物车促销参数，
                        that.cartMess.moType = d.product[0].promotion[0].type;
                        //默认购买参数
                        that.buycarid_proid = d.product[0].product_id;
                        // 促销信息
                        $promotion = d.product[0].promotion;
                    }
                    $.each(that.spec,function (i) {
                        if(that.spec[i].product_id==GetQueryStringAtob('pid')){
                            that.picFirst = d.product[i].imgs[0];
                            that.title = d.product[i].product_title;
                            that.miaoshu = d.product[i].miaoshu;
                            that.pics = d.product[i].imgs;
                            that.picsDetail = d.product[i].contents_mobi;
                            that.indexId = i;
                            that.markPriceOld = d.product[i].b2c_seal_price;
                            that.markPrice = d.product[i].market_price;
                            that.stock = d.product[i].stock_headquarters;
                            that.sale = d.product[i].sales;
                            that.sealPrice = d.product[i].seal_price;
                            that.cate_title = d.product[i].cate_title;
                            that.minNum = d.product[i].minimum_order_quantity;
                            that.num = d.product[i].minimum_order_quantity;
                            // 默认加入购物车参数，
                            that.cartMess.proId = d.product[i].product_id;
                            that.cartMess.shopId = d.product[i].shop_id;
                            //默认购买参数
                            that.buycarid_proid = d.product[i].product_id;

                            // 促销信息
                            $promotion = d.product[i].promotion;
                        }
                    });
                    $.each($promotion,function (i){
                        var starttime = $promotion[i].start_time.replace(new RegExp("-","gm"),"/");
                        var endtime = $promotion[i].end_time.replace(new RegExp("-","gm"),"/");
                        var starttimeHaoMiao = (new Date(starttime)).getTime();
                        var endtimeHaoMiao = (new Date(endtime)).getTime();
                        if(that.nowTime>=starttimeHaoMiao&&that.nowTime<=endtimeHaoMiao){
                            that.promotion.push($promotion[i]);
                            that.promoShow = true;
                        }
                    });

                    if(that.promotion.length!=0){
                        // 加入购物车促销参数
                        that.cartMess.moId = that.promotion[0].id;
                        that.buymoId = that.promotion[0].id;
                        that.cartMess.moZid = '';
                        that.buymoZid = '';
                        if(that.promotion[0].gift.length!=0) {
                            if(that.promotion[0].zp_type==2){
                                that.cartMess.moZid += that.promotion[0].gift[0].id + ',';
                            }else{
                                $.each(that.promotion[0].gift, function (n) {
                                    that.cartMess.moZid += that.promotion[0].gift[n].id + ',';
                                });
                            }
                            $.each(that.promotion[0].gift, function (n) {
                                that.buymoZid += that.promotion[0].gift[n].id + ',';
                            });
                        }
                    }

                }
            }
        });
        // that.appHot(0,6);
        this.redStar = Math.round(this.score);
        this.witStar = 5 - this.redStar;
        // 滚动监听
        window.addEventListener('scroll', this.handleScroll);
    },
    methods: {
        changePl:function(id){
            var that = this;
            $.ajax({
                url:'/web_api/discuss/discuss_manage.php?m=Discuss_list&goods_id='+GetQueryStringAtob('id')+'&status='+id,
                type:"get",
                async:true,
                dataType:"json",
                success:function(data){
                    if(data.status==1){
                        that.plList = data.data;
                        vm.imgHoverBig();
                    }

                }
            });
        },
        //平台热销
        // appHot:function(e,size){
        //     var that = this;
        //     $.ajax({
        //         url: "/web_api/item/index.php?c=PCGoods&m=UserLike&pagesize="+size+"&page="+e,
        //         async: true,
        //         dataType: "json",
        //         success: function (data) {
        //             if(data.status==1){
        //                 that.AppShop = that.AppShop.concat(data.data);
        //             }
        //         }
        //     });
        // },
        handleScroll:function() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop >= 800) {
                this.fixeShow = true;
            } else {
                this.fixeShow = false;
            }
        },
        guige: function (e) {
            var el = e.currentTarget;
            var that = this;
            if (!$(el).hasClass("active")) {
                var index = $(el).index();
                $(el).addClass("active").siblings().removeClass("active");
                that.markPriceOld = that.spec[index].b2c_seal_price;
                that.markPrice = that.spec[index].market_price;
                that.stock = that.spec[index].stock_headquarters;
                that.sale = that.spec[index].sales;
                that.title =  that.spec[index].product_title;
                that.miaoshu = that.spec[index].miaoshu;
                that.sealPrice = that.spec[index].seal_price;
                that.picFirst = that.spec[index].imgs[0];
                that.pics = that.spec[index].imgs;
                that.picsDetail = that.spec[index].contents_mobi;
                that.minNum = that.spec[index].minimum_order_quantity;
                that.num = that.spec[index].minimum_order_quantity;
                // 加入购物车参数，
                that.cartMess.proId = that.spec[index].product_id;
                that.cartMess.shopId = that.spec[index].shop_id;
                that.buycarid_proid = that.spec[index].product_id;

                obj = new mag('.show', '.bigshow', '.smallshow', '.mask', '.bigitem' , that.pics.length);
                obj.init();
                // 促销信息
                //时间
                var $promotion = that.spec[index].promotion;
                that.promotion = [];
                if($promotion.length==0){
                    that.promoShow = false;
                    that.cartMess.moId = '';
                    that.cartMess.moZid = '';
                    that.buymoId = '';
                    that.buymoZid = '';
                }else{
                    $.each($promotion,function (i){
                        var starttime = $promotion[i].start_time.replace(new RegExp("-","gm"),"/");
                        var endtime = $promotion[i].end_time.replace(new RegExp("-","gm"),"/");
                        var starttimeHaoMiao = (new Date(starttime)).getTime(); //得到毫秒数
                        var endtimeHaoMiao = (new Date(endtime)).getTime(); //得到毫秒数
                        if(that.nowTime>=starttimeHaoMiao&&that.nowTime<=endtimeHaoMiao){
                            that.promotion.push($promotion[i]);
                            that.promoShow = true;
                        }

                        if(that.promotion.length!=0){
                            // 加入购物车促销参数
                            that.cartMess.moId = that.promotion[0].id;
                            that.buymoId = that.promotion[0].id;
                            that.cartMess.moZid = '';
                            that.buymoZid = '';
                            if(that.promotion[0].gift.length!=0) {

                                if(that.promotion[0].zp_type==2){
                                    that.cartMess.moZid += that.promotion[0].gift[0].id + ',';
                                }else{
                                    $.each(that.promotion[0].gift, function (n) {
                                        that.cartMess.moZid += that.promotion[0].gift[n].id + ',';
                                    });
                                }
                                $.each(that.promotion[0].gift, function (n) {
                                    that.buymoZid += that.promotion[0].gift[n].id + ',';
                                });

                            }
                        }

                    });
                }


            }
        },
        detailClick: function (e) {
            var el = e.currentTarget;
            if(!$(el).hasClass('active')){
                $(el).css({
                    "background": "#D5282C",
                    "color": "#fff"
                }).siblings().css({
                    "background": "transparent",
                    "color": "#949494"
                });
                $(el).addClass('active').siblings().removeClass('active');
                this.assesShow = !this.assesShow;
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
                this.num++;
            }
        },
        numInput:function(){
            if (this.num < this.minNum) {
                layer.msg('该商品最小起订量为'+this.minNum);
                this.num = this.minNum;
                return false;
            }
        },
        payClick: function () {
            var that = this;
            if(vm.loginIs){
                if(that.num<that.minNum){
                    layer.msg('该商品最小起订量为'+that.minNum);
                }else if(that.num>that.stock){
                    layer.msg('库存不足！');
                }else{
                    var url = window.btoa('carid_proid='+that.buycarid_proid+'&is_car=1&type=0&number='+that.num+'&shop_id='+that.buyshop_id+'&motion_id='+that.buymoId+'&motion_zpid='+that.buymoZid);
                    window.location.href = 'pay.html?'+url;
                }
            }else{
                vm.loginModel();
            }
        },
    }
});
window.onload = function () {
    /*
     show  //正常状态的框
     bigshow   // 放大的框的盒子
     smallshow  //缩小版的框
     mask   //放大的区域（黑色遮罩）
     bigitem  //放大的框
     */
    obj = new mag('.show', '.bigshow', '.smallshow', '.mask', '.bigitem' , detailVue.pics.length);
    obj.init();

    if($(".middle").children().length<=5){
        $(".smallshow>.next").css({
            'background': 'url(bulid/img/glass/next.png) no-repeat',
            'cursor': 'not-allowed'
        })
    }


    var $width = $(".ptrx>li").height();
    // var num = 0;
    $(".nextjt").click(function () {
        var $len = $(".ptrx>li").length;
        if ($('.ptrx').position().top <= -188 * ($len - 3)) {
            $('.ptrx').position().top = -188 * ($len - 3);
        } else {
            $('.ptrx').animate({top: '-=570'}, 100);
        }
        // num++;
        // if(num>=detailVue.appPage){
        //     detailVue.appHot(++detailVue.appPage,6);
        // }
    });
    $(".prevjt").click(function () {
        if ($('.ptrx').position().top >= 0) {
            $('.ptrx').animate({top: 0}, 100);
        } else {
            $('.ptrx').animate({top: '+=570'}, 100);
            // num--;
        }
    })
}