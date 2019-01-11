//搜索商品
var text = GetQueryString("search");
var type = GetQueryString("type");
var vg = new Vue({
    data:{
        page:0,
        searchText: GetQueryString("search")||'',//搜索词条
        cate:GetQueryString("cate")||'',//分类
        brand:GetQueryString("brand")||'',//品牌
        priceMin:'',
        priceMax:'',
        sales:'',
        priceSore:'',
        shopList:[]
    },
    methods: {
        goods:function(page){
            vg.page = page;
            var that = this;
            var minPri = 0;
            if(this.priceMin==''){
                minPri = 0;
            }else{
                minPri = this.priceMin;
            }
            $.ajax({
                url:'/web_api/item/index.php?c=PCGoods&m=ProductList&pagesize=20&page='+page+'&search='+this.searchText+'&cate='+this.cate+'&brand='+this.brand+'&price_range='+minPri+','+this.priceMax+'&sales='+this.sales+'&price='+this.priceSore,
                type:"get",
                async:true,
                dataType:"json",
                beforeSend:function(){
                    layer.load(1, {shade: .3});
                    $(window).unbind("scroll");
                },
                success:function(data){

                    if(data.status==1&&data.data.length!=0){
                        layer.closeAll();
                        var d = data.data;
                        if(page==0){
                            $("#goodsL").html('');
                        }
                        var $html ='';
                        $.each(d,function (i) {
                            //促销参数
                            var moMess = {'moId':0,'moZid':0};

                            if(d[i].promotion.length!=0){
                                moMess.moId = d[i].promotion[0].id;
                                if(d[i].promotion[0].gift.length!=0){
                                    moMess.moZid = '';
                                    $.each(d[i].promotion[0].gift,function (n) {
                                        moMess.moZid+=d[i].promotion[0].gift[n].id+',';
                                    });
                                    moMess.moZid=(moMess.moZid.substring(moMess.moZid.length-1)==',')?moMess.moZid.substring(0,moMess.moZid.length-1):moMess.moZid;
                                }
                            }



                            var collec ='<div title="加入收藏" onclick="goCollect(this,'+d[i].goods_id+')" style="display: inline-block;width: 33px;height: 33px;text-align: center;border-left: 1px solid #ddd;line-height: 33px"><i class="fa fa-star" aria-hidden="true"></i></div>';
                            if(d[i].collect==1){
                                collec ='<div title="加入收藏" class="active" onclick="goCollect(this,'+d[i].goods_id+')" style="display: inline-block;width: 33px;height: 33px;text-align: center;border-left: 1px solid #ddd;line-height: 33px;color: red;"><i class="fa fa-star" aria-hidden="true"></i></div>';
                            }
                            var $dor = d[i].shop_name;
                            if($dor=='健行快养旗舰店'){
                                $dor = '同致相伴旗舰店';
                            }
                            var $tit = '<div class="triangle" style="position: absolute;top: 0;left: 0;">'+d[i].dealer+'</div>';
                            if(d[i].dealer!='自营'){
                                $tit = '';
                            }
                            $html+='            <div class="hoverGoods pr" style="background: #fff;width: 233px;height: 352px;border: 1px solid #ddd;float: left;margin: 6px;">\n' +
                                '                <div onclick="vm.dorShopDetail('+d[i].product_id+',\'\')">\n' +
                                '                    <div style="width: 233px;height: 215px;padding: 24px;overflow: hidden;padding-bottom: 0;display: table-cell;vertical-align: middle;text-align: center;">\n' +
                                '                        <img style="max-height: 185px;max-width: 185px;margin: 0 auto;" src="'+d[i].pic+'" alt="" />\n' +
                                '                    </div>\n' +
                                '                    <div style="padding: 0 6px;">\n' +
                                '                        <span style="color: #e62129;font-size: 1.5em;"><span style="font-size: .8em">￥</span>'+d[i].seal_price+'</span>\n' +
                                '                    </div>\n' +
                                '                    <div>\n' +
                                '                        <div style="padding: 0 8px;color: #000;height: 40px;overflow: hidden;font-size: 1em" title="'+d[i].product_title+'">'+d[i].product_title+'</div>\n' +
                                '                    </div>\n' +
                                '                    <div style="color: #949494;padding: 0 8px;margin-top: 5px">'+$dor+'</div>' +
                                '                </div>\n' +
                                '                <div style="border-top: 1px solid #ddd;margin-top: 6px">' +
                                '<div style="display: inline-block;width: 165px;height: 33px;text-align: center;line-height: 33px">该款月销 <span style="color: #FF4502">'+d[i].sales+'</span> 件</div>' +
                                collec+
                                '<div title="加入购物车" onclick="vm.goCart(this,\'list\','+d[i].product_id+','+d[i].shop_id+',0,'+moMess.moId+','+moMess.moZid+','+d[i].minimum_order_quantity+')" style="display: inline-block;width: 33px;height: 33px;text-align: center;border-left: 1px solid #ddd;line-height: 33px"><i class="fa fa-shopping-cart" aria-hidden="true"></i></div>' +
                                '               </div>' +
                                                $tit +
                                '            </div>';
                        });
                        $("#goodsL").append($html);
                        $(window).bind("scroll", function () {
                            var scrollTop = $(this).scrollTop();
                            var scrollHeight = $(document).height();
                            var windowHeight = $(this).height();
                            if (scrollTop + windowHeight == scrollHeight) {
                                that.goods(++that.page);
                                $(window).unbind("scroll");
                            }
                        });
                    }else{
                        $(window).unbind("scroll");
                        layer.closeAll();
                        layer.msg('没有更多商品了', {time: 2000, icon: 5});
                    }
                }
            });
        },
    }
});
new Vue({
    el: "#index",
    data:{
        show:false,
        typeShow:true,
        btnPrice:false,
    },
    mounted: function () {
        var that = this;
        document.addEventListener('click',function(e){
            if(e.target.className!='rangePri'){
                that.btnPrice=false;
            }
        });
    },
    methods:{
        moreDor:function(el,e,id){
            var that = this;
            var em = el.currentTarget;
            var type = $(em).siblings().find('.btn-default.active').attr('value');
            if($(em).find('span').html() == '查看更多'){
                $.ajax({
                    url:'/web_api/item/index.php?c=PCHome&m=UserGoodsLists&pagesize=100&shop_id='+id+'&sort='+type,
                    type:"get",
                    async:false,
                    dataType:"json",
                    success:function(data){
                        $(em).find('span').html('收起');
                        vg.shopList[e].child_data = data.data;
                    }
                });
            }else{
                var xsDorList = [];
                $(em).find('span').html('查看更多');
                $.each(vg.shopList[e].child_data,function (i) {
                    if(i==5){
                        return false;
                    }
                    xsDorList.push(vg.shopList[e].child_data[i]);
                });
                vg.shopList[e].child_data = xsDorList;
            }
        },
        priceVal:function(e){
            this.btnPrice = true;
        },
        priceSure:function(){
            this.btnPrice = false;
            vg.goods(0);
        },
        priceCancel:function(){
            this.btnPrice = false;
        },
        priceTB:function(e){
            var el = e.currentTarget;
            if($(el).hasClass("price")){
                $(el).removeClass().addClass("price1 pri").siblings().removeClass("active");
                vg.priceSore = 'asc';
            }else if($(el).hasClass("price1")){
                $(el).removeClass().addClass("price2 pri");
                vg.priceSore = 'desc';
            }else{
                $(el).removeClass().addClass("price pri");
                vg.priceSore = '';
            }
            vg.goods(0);
        },
        search:function (e,type) {
            var el = e.currentTarget;
            if(!$(el).hasClass("active")){
                $(el).addClass("active").siblings().removeClass("active");
                this.typeShow = !this.typeShow;
                if(type==2){
                    vm.Searchtype = 1;
                    //门店列表
                    $.ajax({
                        url:'/web_api/item/index.php?c=PCHome&m=UserShopLists&search='+vg.searchText,
                        type:"get",
                        async:false,
                        dataType:"json",
                        success:function(data){
                            vg.shopList = data.data;
                        }
                    });
                    $(window).unbind("scroll");
                }else{
                    vm.Searchtype = 0;
                    vg.goods(0);
                }
            }
        },
        sort:function(e,val){
            var el = e.currentTarget;
            if(!$(el).hasClass("active")){
                $(el).addClass("active").siblings().removeClass("active").siblings(".pri").removeClass().addClass('price pri');
                vg.priceSore = '';
                if(val=="sales"){
                    vg.sales = 'desc';
                }else{
                    vg.sales = '';
                }
                vg.goods(0);
            }
        },
        dorHead:function (e,type,index,id) {
            var el = e.currentTarget;
            var that = this;
            if(!$(el).hasClass("active")){
                $(el).addClass("active").siblings().removeClass("active");
                $.ajax({
                    url:'/web_api/item/index.php?c=PCHome&m=UserGoodsLists&pagesize=100&shop_id='+id+'&sort='+type,
                    type:"get",
                    async:false,
                    dataType:"json",
                    success:function(data){
                        vg.shopList[index].child_data = data.data;
                        if($(el).parent().siblings().find('span').html()=='查看更多'){
                            var xsDorList = [];
                            $.each(vg.shopList[index].child_data,function (i) {
                                if(i==5){
                                    return false;
                                }
                                xsDorList.push(vg.shopList[index].child_data[i]);
                            });
                            vg.shopList[index].child_data = xsDorList;
                        }
                    }
                });
            }
        }
    }
});
// $(function () {
//     $(".price_t input").click(function (e) {
//         $(".btn_money").show();
//         e.stopPropagation();
//     });
//     $('body').on('click',function(){
//         $('.btn_money').hide();
//     })
// })
if(type=='1'){
//门店列表
    $.ajax({
        url:'/web_api/item/index.php?c=PCHome&m=UserShopLists&search='+vg.searchText,
        type:"get",
        async:false,
        dataType:"json",
        success:function(data){
            vg.shopList = data.data;
        }
    });
}else{
    vg.goods(vg.page);
}