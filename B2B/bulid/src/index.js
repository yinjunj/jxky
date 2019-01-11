new Vue({
    el: "#index",
    data: {
        show: false,
        hours: '00',  //限时特惠
        minutes: '00',
        seconds: '00',
        LeftBannerA:'',//
        LeftBannerB:'',//
        banner:[],//轮播图
        sals:[],//限时特惠
        salsGood:[],//限时特惠
        category:[],//分类
        brand:[],//品牌
        rhy:[],//润滑油
        rhyGood:[],//润滑油
        bsx:[],//变速箱
        bsxGood:[],//润滑油
        diy:[],//DIY
        diyGood:[],//润滑油
        xm:[],//项目加盟
        xmGood:[],//项目加盟
        Advertising:'',//广告
        listHead:[],//公告
    },
    mounted: function () {
        var that = this;
        setInterval(function () {
            var nowTime = new Date().getTime();//当前时间毫秒
            // var starttime = da.start_time;
            // starttime = starttime.replace(new RegExp("-", "gm"), "/");
            var starttimeHaoMiao = new Date('2222-02-22T00:00:00').getTime(); //得到毫秒数
            var mmsTime = starttimeHaoMiao - nowTime;
            that.formatDuring(mmsTime);
        }, 1000);
        //    首页图片
        $.ajax({
            url:'/web_api/item/index.php?c=PCHome&m=index',
            type:"get",
            async:false,
            dataType:"json",
            success:function(data){
                if(data.status==1){
                    that.category = data.data.cate;
                    that.brand = data.data.brand;
                    that.LeftBannerA = data.data.LeftBannerA;
                    that.LeftBannerB = data.data.LeftBannerB;
                    that.banner = data.data.Banner;
                    that.sals = data.data.sals;
                    that.rhy = data.data.rhy;
                    that.bsx = data.data.bsx;
                    that.diy = data.data.diy;
                    that.xm = data.data.xmjm;
                    that.Advertising = data.data.Advertising;
                }
            }
        });

        $.ajax({
            url:'/web_api/item/index.php?c=PCGoods&m=IndexGoodsList&call_index=webxsth',
            type:"get",
            async:false,
            dataType:"json",
            success:function(data){
                that.salsGood = data.data;
            }
        });
        $.ajax({
            url:'/web_api/item/index.php?c=PCGoods&m=IndexGoodsList&call_index=webrhy',
            type:"get",
            async:false,
            dataType:"json",
            success:function(data){
                that.rhyGood = data.data;
            }
        });
        $.ajax({
            url:'/web_api/item/index.php?c=PCGoods&m=IndexGoodsList&call_index=webbsxy',
            type:"get",
            async:false,
            dataType:"json",
            success:function(data){
                that.bsxGood = data.data;
            }
        });
        $.ajax({
            url:'/web_api/item/index.php?c=PCGoods&m=IndexGoodsList&call_index=webdiy',
            type:"get",
            async:false,
            dataType:"json",
            success:function(data){
                that.diyGood = data.data;
            }
        });
        $.ajax({
            url:'/web_api/item/index.php?c=PCGoods&m=IndexGoodsList&call_index=webxm',
            type:"get",
            async:false,
            dataType:"json",
            success:function(data){
                that.xmGood = data.data;
            }
        });
        $.ajax({
            url:'/web_api/notice/notice.php?m=headlist',
            type:"get",
            async:false,
            dataType:"json",
            success:function(data){
                that.listHead = data.data;
            }
        });
    },
    methods: {
        userClick: function (e) {
            if (e == "user") {
                sessionStorage.setItem("index", 1);
            }
            window.location.href = 'myself.html';
        },
        detail: function () {
            window.open("detail.html");
        },
        formatDuring: function (mss) {
            var days = parseInt(mss / (1000 * 60 * 60 * 24));
            var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = (mss % (1000 * 60)) / 1000;
            if (seconds.toFixed(0) < 0) {
                seconds = 0;
            }
            this.hours = hours;
            this.minutes = minutes;
            this.seconds = seconds.toFixed(0);
            if (hours < 10) {
                this.hours = '0' + hours;
            }
            if (minutes < 10) {
                this.minutes = '0' + minutes;
            }
            if (seconds < 10) {
                this.seconds = '0' + seconds.toFixed(0);
            }
        },
        crowd:function () {
            if(!vm.loginIs){
                vm.loginModel()
            }else{
                window.location.href='detailCrowd.html';
            }

        }
    }
});
window.onload=function(){
    //滚动元素id，左切换按钮，右切换按钮，切换元素个数id,滚动方式，切换方向，是否自动滚动，滚动距离，滚动时间，滚动间隔，显示个数
    //限时特惠
    LbMove('BoxUlP', 'btnlP', 'btnrP', false, true, 'left', true, 210, 1000, 6000, 4);
    //商标
    LbMove('BoxUl', 'btnl', 'btnr', false, true, 'right', true, 154, 1000, 9000, 6);

    $("#crowd").removeClass('dis_no').addClass("animated bounceInDown");
};