new Vue({
    el: "#index",
    data: {
        show: true,
        more: false,
        hotlist: [],
        listHead: [],//公告
        list: [],
        detail: [],
        textR: '',
        id: ''
    },
    mounted: function () {
        let that = this;
        $.ajax({
            url: '/web_api/notice/notice.php?m=hotlist',
            type: "get",
            async: false,
            dataType: "json",
            success: function (data) {
                that.hotlist = data.data;
            }
        });
        $.ajax({
            url: '/web_api/notice/notice.php?m=headlist',
            type: "get",
            async: false,
            dataType: "json",
            success: function (data) {
                that.listHead = data.data;
                that.id = that.listHead[0].id;
                that.lists(that.id);
            }
        });
        if(GetQueryString("id")!=null){
            that.mess(GetQueryString("id"));
        }
    },
    methods: {
        lists: function (e) {
            let that = this;
            that.show = true;
            that.more = false;
            that.id = e;
            $.ajax({
                url: '/web_api/notice/notice.php?m=articellist&id=' + e,
                type: "get",
                async: false,
                dataType: "json",
                success: function (data) {
                    that.list = data.data;
                }
            });
        },
        mess: function (id) {
            let that = this;
            that.show = false;
            $.ajax({
                url: '/web_api/notice/notice.php?m=messageprt&id=' + id,
                type: "get",
                async: false,
                dataType: "json",
                success: function (data) {
                    that.detail = data.data[0];
                }
            });
        },
        returnMess: function () {
            this.show = true;
        },
        research: function () {
            let that = this;
            that.show = true;
            $.ajax({
                url: '/web_api/notice/notice.php?m=articellist',
                type: "get",
                data: {'id': that.id, 'title': that.textR},
                async: false,
                dataType: "json",
                success: function (data) {
                    if(data.data.length==0){
                        layer.msg('没有搜索到相关信息！');
                        return false;
                    }
                    that.list = data.data;
                }
            });
        }
    }
});