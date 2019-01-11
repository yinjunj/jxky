new Vue({
    el: "#index",
    data: {
        show: false,
        list: [],
    },
    mounted: function () {
        let that = this;
        $.ajax({
            url: "/web_api/item/index.php?c=PC_orderlist&m=order_details&order_id=" + GetQueryStringAtob('aid'),
            async: false,
            dataType: "json",
            beforeSend: function () {
                layer.load(1, {shade: .3});
            },
            success: function (data) {
                if (data.login_status == 0) {
                    vm.loginModel();
                } else {
                    if (data.status == 1) {
                        that.list = data.data.order_details;
                        vm.imgHover();
                    }
                    layer.closeAll();
                }
            }
        });
    },
    methods: {}
});