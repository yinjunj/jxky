function GetQueryStringAtob(name) {
    let decodeDatass = window.atob(window.location.search.substr(1));//解码
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = decodeDatass.match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
function GetQueryString(name) {
    let decodeDatass = window.location.search.substr(1);//解码
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = decodeDatass.match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
function goCollect(e) {
    let el = e.currentTarget || e;
    if (!$(el).hasClass("active")) {
        $(el).addClass("active").css("color", "red");
        layer.msg('收藏成功！', {time: 2000, icon: 6});
    } else {
        $(el).removeClass("active").css("color", "#949494");
        layer.msg('取消收藏！', {time: 2000, icon: 5});
    }
}
//loading...
window.onscroll = function () {
    let bodyScrollHeight = document.documentElement.scrollTop;// body滚动高度
    let windowHeight = window.innerHeight;// 视窗高度
    let imgs = document.getElementsByClassName('tamp-img');
    for (let i = 0; i < imgs.length; i++) {
        let imgHeight = imgs[i].offsetTop;// 图片距离顶部高度
        if (imgHeight < windowHeight + bodyScrollHeight - 200) {
            imgs[i].src = imgs[i].getAttribute('data-src');
            imgs[i].className = imgs[i].className.replace('tamp-img', '');
        }
    }
};
//公用属性
let vm = new Vue({
    data: {
        cartNum: 1,
        orderNum:0,
        total: 0,
        Searchtype: 0,

    },

    methods: {
        clickIndex: function () {
            window.location.href = 'index.html';
        },
        goCart: function (e,form) {
            let el = e.currentTarget || e;
            let $this = $(el);
            let cart = $('#cartFly');
            let imgtodrag = '';
            if(form == 'detail'){
                imgtodrag= $this.find('img');
                this.cartNum+=detailVue.num;
            }else{
                imgtodrag = $this.parent().siblings().find('img');
                this.cartNum++;//购物车数量加1
            }
            if (imgtodrag) {
                let imgclone = imgtodrag.clone().offset({
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
        },
        inputAll: function (e) {
            let el = e.currentTarget;
            if ($(el).is(":checked")) {
                $(el).parents('table').find("input[type=checkbox]").prop("checked", true);
            } else {
                $(el).parents('table').find("input[type=checkbox]").prop("checked", false);
            }
            this.inputNum();
        },
        inputTwo: function (e) {
            let el = e.currentTarget;
            if ($(el).is(":checked")) {
                $(el).parents('tbody').find(".inputOne").prop("checked", true);
            } else {
                $(el).parents('tbody').find(".inputOne").prop("checked", false);
            }
            this.inputNum();
        },
        inputNum: function () {
            let that = this;
            let totals = 0;
            that.orderNum = 0;
            $(".inputOne").each(function () {
                let $this = $(this);
                if ($this.is(":checked")) {
                    totals += parseFloat($this.parents("td").siblings().find(".priceXj").html());
                    let lenTotal = $this.parents("tbody").find(".inputOne").length;
                    let lenChecked = $this.parents("tbody").find(".inputOne:checked").length;
                    that.orderNum++;
                    if (lenTotal == lenChecked) {
                        $(this).parents("tbody").find(".inputTwo").prop("checked", true);
                    } else {
                        $(this).parents("tbody").find(".inputTwo").prop("checked", false);
                    }
                }
            });


            let lenTotalTotal = $(".checkSon").length;
            let lenCheckedTotal = $(".checkSon:checked").length;
            if (lenTotalTotal == lenCheckedTotal) {
                $(".allCheck").prop("checked", true);
            } else {
                $(".allCheck").prop("checked", false);
            }
            vm.total = totals;
        }
    }
});
//图片上传
Vue.component("jxky-pic", {
    props: ['title'],
    mounted: function () {
        let imgFile1 = new ImgUploadeFiles('.imgFilebox' + this.title, function (e) {
            this.init({
                MAX: 5,
                MH: 1800, //像素限制高度
                MW: 1900, //像素限制宽度
                callback: function (arr) {
                    console.log(arr)
                }
            });
        });
    },
    template: '<div :class="\'imgFilebox\'+this.title" style="width:100%;margin:20px auto"></div>'
});
Vue.component("jxky-num", {
    data: function () {
        return {
            num: 1
        }
    },
    methods: {
        inputChange: function (e) {
            let el = e.currentTarget;
            let val = parseFloat($(el).parents('td').siblings().find(".price").html());
            let priValAll = $(el).parents('td').siblings().find(".priceXj");
            priValAll.html((val * this.num).toFixed(2));
            vm.inputNum();
        },
        numClick: function (e, v) {
            let el = e.currentTarget;
            let priValAll = $(el).parents('td').siblings().find(".priceXj");
            let val = parseFloat($(el).parents('td').siblings().find(".price").html());
            if (v == '-') {
                if (this.num == 1) {
                    return false;
                }
                this.num--;
            } else {
                this.num++;
            }
            priValAll.html((val * this.num).toFixed(2));
            vm.inputNum();
        },
    },
    template: ' <div class="input-group" style="width: 114px;">\n' +
    '                            <div @click="numClick($event,\'-\')" class="input-group-addon hoverOpacity" style="padding: 0 8px;">－</div>\n' +
    '                            <input type="text" class="form-control" @change="inputChange($event)" onkeyup="value=value.replace(/[^\\d]/g,\'\')" style="text-align: center;padding: 0;height: 26px;" :value="num" v-model="num">\n' +
    '                            <div @click="numClick($event,\'+\')" class="input-group-addon hoverOpacity" style="padding: 0 8px;">＋</div>\n' +
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
            $("body,html").animate({scrollTop: 0}, 1000)
        },
        loginClick: function (e) {
            if (e == "order") {
                sessionStorage.setItem("index", 2);
            } else if (e == "cart") {
                sessionStorage.setItem("index", 3);
            } else if (e == "collect") {
                sessionStorage.setItem("index", 4);
            }
            window.location.href = 'myself.html';
        }
    },
    template: '<div>\n' +
    '    <ul class="drawer">\n' +
    '        <li>\n' +
    '            <a @click="loginClick(\'order\')" href="javascript:;">\n' +
    '                <span><i class="fa fa-file-text-o" aria-hidden="true"></i></span>\n' +
    '            </a>\n' +
    '            <ul>\n' +
    '                <li>\n' +
    '                    <a href="javascript:;"><span>我的订单</span></a>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '        </li>\n' +
    '        <li>\n' +
    '            <a @click="loginClick(\'cart\')" href="javascript:;">\n' +
    '                <span id="cartFly" class="pr"><span v-if="vm.cartNum!=0" style="background: #FF4502;color: #fff;border-radius: 50%;width: 20px;height: 20px;position: absolute;top: -15px;right: -10px;padding-top: 2px;overflow: hidden;">{{vm.cartNum>=99?99:vm.cartNum}}</span><i class="fa fa-shopping-cart" aria-hidden="true"></i></span>\n' +
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
    '                    <span style="background: #FF4502;position: absolute;top: -96px;left: 0;z-index: 1"><img v-show="show" style="width: 100px;height: 100px;" src="bulid/img/twoCode.png" alt="">' +
    '                    </span><a style="width: 100px;" href="javascript:;"><span>广告语</span></a>\n' +
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
    '                        <textarea name="" class="form-control" id="" cols="30" rows="5"></textarea>\n' +
    '                    </div>' +
    '                       <div style="padding: 0 5px;"><jxky-pic title="1"></jxky-pic></div>' +
    '                </div>\n' +
    '                <div class="modal-footer">\n' +
    '                    <button type="button" class="btn btn-primary">提交</button>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>'
});
Vue.component("jxky-friend", {
    template: '  <div><div class="tc" style="margin-top: 30px;background: #F5F5F5;padding: 25px 0;"> <img src="bulid/img/botImg.png" alt=""></div>\n' +
    '    <div style="background: #fff"><section class="dis_flex" style="padding: 10px 100px;">\n' +
    '        <div class="dis_flex" style="width: 820px;">\n' +
    '            <div v-for="item in 5">\n' +
    '                <div style="font-size: 1.2em;margin-bottom: 10px;">购物指南</div>\n' +
    '                <div v-for="item in 8" class="hoverRed">联系客服</div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div>\n' +
    '            <img src="bulid/img/twoCode.png" alt="">\n' +
    '        </div>\n' +
    '    </section></div></div>'
});
//页尾
Vue.component("jxky-foot", {
    data: function () {
        return {
            htmls: '<footer class="footbg">' +
            '<div class="main">' +
            '      <div class="link">' +
            '        <span>友情链接</span>' +
            '        <nav>' +
            '          <div class="cr"></div>' +
            '        </nav>' +
            '      </div>' +
            '      <div class="onexs">' +
            '      <p style="font-size: 12px;color: #828282">Copyright © 2016 <a href="http://www.yntzxb.com">云南天行健营销服务股份有限公司</a>版权所有&nbsp;&nbsp;&nbsp;网站备案号：滇ICP备16001742号&nbsp;&nbsp;电信增值业务经营许可证：滇B2-20160041&nbsp;&nbsp;滇公网安备：53010302000386号&nbsp;&nbsp;<a href="http://www.ynyes.com" title="昆明天度网络公司" target="_blank">网站建设</a>支持：<a href="http://www.ynyes.com" title="昆明天度网络公司" target="_blank">天度网络</a>&nbsp;&nbsp;<script type="text/javascript">var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id=\'cnzz_stat_icon_1262834456\'%3E%3C/span%3E%3Cscript src=\'" + cnzz_protocol + "s13.cnzz.com/z_stat.php%3Fid%3D1262834456%26show%3Dpic\' type=\'text/javascript\'%3E%3C/script%3E"));</script><span id="cnzz_stat_icon_1262834456"><a href="http://www.cnzz.com/stat/website.php?web_id=1262834456" target="_blank" title="站长统计"><img border="0" hspace="0" vspace="0" src="http://icon.cnzz.com/img/pic.gif"></a></span><script src=" http://s13.cnzz.com/z_stat.php?id=1262834456&amp;show=pic" type="text/javascript"></script><script src="http://c.cnzz.com/core.php?web_id=1262834456&amp;show=pic&amp;t=z" charset="utf-8" type="text/javascript"></script></p>' +
            '      </div>' +
            '      <div class="moarwe">' +
            '        <nav>' +
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
    data: function () {
        return {
            isLogin: true,
            ok: true,
            loginType: '账号密码登录',
            logType: '验证码登录',
            codes: '获取验证码',
            loginCode: false,
            typeShow:true
        }
    },
    mounted: function () {
        jigsaw.init(document.getElementById('captcha'), function () {
            layer.msg("登录成功", {time: 2000, icon: 6});
        })
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
        codeClick: function () {
            if (this.codes === "获取验证码") {
                let that = this;
                let ms = 60;
                that.codes = '重新发送(' + ms + ')';
                let time = setInterval(function () {
                    ms--;
                    if (ms === 0) {
                        that.codes = "获取验证码";
                        clearInterval(time);
                    } else {
                        that.codes = '重新发送(' + ms + ')';
                    }
                }, 1000);

            }
        },
        isLoginClick: function () {
            this.isLogin = false;
            this.loginType = '更换登录密码';
        },
        loginUser: function () {
            $.ajax({
                url: "qapi/login/login.php",
                type: "post",
                async: true,
                dataType: "json",
                success: function (data) {

                }
            })
        }
    },
    template: '<div id="borOut" class="pr">' +
    '<div style="position: absolute;    right: 35px;top: 44px;z-index: 999;font-size: 2.4em;color: #C1C1C1;">' +
    '<span @click="typeShow = !typeShow" title="二维码登录" v-if="typeShow" class="glyphicon glyphicon-qrcode hoverRed" aria-hidden="true"></span>' +
    '<i @click="typeShow = !typeShow" title="账号密码登录" v-else class="fa fa-keyboard-o hoverRed" aria-hidden="true"></i>' +
    '</div>' +
    '               <div id="box">' +
    '                    <div v-show="typeShow" style="font-weight: bold;font-size: 18px">{{loginType}}</div>' +
    '                    <div v-show="!typeShow" style="font-weight: bold;font-size: 18px">&nbsp;&nbsp;&nbsp;&nbsp;扫码登录</div>' +
    '                    <div v-show="typeShow"><div v-if="isLogin">' +
    '                       <div v-if="ok">' +
    '                           <div class="loginmt">' +
    '                                <span class="iBor"><i class="fa fa-user" aria-hidden="true"></i></span>' +
    '                                <input class="loginInput" type="text" placeholder="请输入用户名">' +
    '                           </div>' +
    '                           <div class="loginmt">' +
    '                            <span class="iBor"><i class="fa fa-unlock-alt" aria-hidden="true"></i></span>' +
    '                               <input class="loginInput" type="password" placeholder="请输入密码">' +
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
    '                                <input type="text" class="intBor" maxlength="11" placeholder="请输入手机号码">' +
    '                            </div>' +
    '                            <div class="loginmt bor">  ' +
    '                          <span class="borBT">' +
    '                               <i class="fa fa-check-square-o" aria-hidden="true"></i>' +
    '                           </span>' +
    '                                <input type="text" class="intBor" style="width: 120px;" maxlength="6" placeholder="请输入验证码">                       ' +
    '         <span class="vert" @click="codeClick">{{codes}}</span>   ' +
    '                         </div>                   ' +
    '         <div class="loginmt">            ' +
    '                    <div class="loginBtn">登 录</div>        ' +
    '                    </div>                  ' +
    '      </div>  ' +
    '                  </div>      ' +
    '              <div v-else>    ' +
    '                    <div class="loginmt1 bor">             ' +
    '               <span class="borBT">                ' +
    '                <i class="fa fa-mobile" style="font-size: 30px" aria-hidden="true"></i>      ' +
    '                      </span>                      ' +
    '      <input type="text" class="intBor" maxlength="11" placeholder="请输入手机号码">  ' +
    '                      </div>               ' +
    '         <div class="loginmt1 bor">    ' +
    '                        <span class="borBT">      ' +
    '                          <i class="fa fa-check-square-o" aria-hidden="true"></i>   ' +
    '                         </span>                         ' +
    '   <input type="text" class="intBor" style="width: 120px;" maxlength="6" placeholder="请输入验证码">   ' +
    '                         <span class="vert" @click="codeClick">{{codes}}</span>       ' +
    '                 </div>          ' +
    '              <div class="loginmt1 bor">                    ' +
    '        <span class="borBT">                          ' +
    '      <i class="fa fa-unlock-alt" aria-hidden="true"></i>              ' +
    '              </span>                        ' +
    '    <input type="password" class="intBor" placeholder="请输入新密码">     ' +
    '                   </div>                ' +
    '        <div class="loginmt1">                        ' +
    '    <div class="loginBtn reg">登 录</div>          ' +
    '              </div>                ' +
    '    </div></div>' +
    '<div v-show="!typeShow" style="text-align: center;margin-top: 26px;">' +
    '<img style="width: 150px;" src="bulid/img/twoCodeLogin.png" alt="">' +
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
    methods: {
        loginClick: function (e) {
            if (e == "user") {
                sessionStorage.setItem("index", 1);
            } else if (e == "cart") {
                sessionStorage.setItem("index", 3);
            } else if (e == "collect") {
                sessionStorage.setItem("index", 4);
            }
            window.location.href = 'myself.html';
        }
    },
    template: '<div style="background: #fff;position: absolute;top: 0;border-bottom: 1px solid #e5e5e5;width: 100%;padding: 5px 0;">' +
    '        <section class="dis_flex">' +
    '            <div>欢迎来到同致相伴B2B汽车养护采购平台</div>' +
    '            <div style="color: #a5a5a5">' +
    '                <span style="color: #FF4502;padding-right: 40px">' +
    '                     <a style="color: #FF4502" href="login.html">登录</a> ' +
    '                     |' +
    '                     <a style="color: #FF4502" href="napaStore.html">免费注册</a> ' +
    '                </span>' +
    '                <span class="hover_head" style="padding-right: 20px;" @click="loginClick(\'user\')">用户中心</span>' +
    '                <span @click="loginClick(\'collect\')" class="hover_head" style="padding-right: 20px;"><i class="fa fa-heart" style="color: #FF4502" aria-hidden="true"></i> 我的收藏</span>' +
    '                <span @click="loginClick(\'cart\')" class="hover_head" style="padding-right: 20px;"><i class="fa fa-shopping-cart" style="color: #FF4502" aria-hidden="true"></i> 我的购物车</span>' +
    '                <span @click="window.location.href=\'napaStore.html\'" data-toggle="modal" data-target="#myModalPhone" class="hover_head" style="padding-right: 20px;"><i class="fa fa-download" style="color: #FF4502" aria-hidden="true"></i> 手机版</span>' +
    '                <span class="hover_head" style="padding-right: 20px;">企业入口</span>' +
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
        }
    },
    props: ['title'],
    mounted: function () {
        if (this.title == "search") {
            let text = GetQueryString("search");
            let type = GetQueryString("type");
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
            let el = e.currentTarget;
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
    '                        <input @keyup.13="search" type="text" class="form-control" style="border: 1px solid #ff4502;" placeholder="查询关键字..." v-model="searchText">\n' +
    '                        <div @click="search" class="input-group-addon hoverOpacity" style="color: #fff;background: #FF4502;border: none;">搜 索</div>\n' +
    '                    </div>\n' +
    '                    <div>' +
    '           <div v-for="item in 3" style="color: #949494;float: left;">&nbsp;&nbsp;&nbsp;<span @click="hotClick($event)" class="hoverOpacity">嘉实多</span>  <span v-if="item != 3">&nbsp;|</span></div>        ' +
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
    '                                <div v-for="item in 8" style="width: 110px;color: #aaa;">\n' +
    '                                    <div style="font-weight: bold;padding: 20px 0 45px;color: #000">特惠组合套餐</div>\n' +
    '                                    <div class="hover_head" style="padding-bottom: 5px">日常补货套餐</div>\n' +
    '                                    <div class="hover_head" style="padding-bottom: 5px">日常补货套餐</div>\n' +
    '                                    <div class="hover_head" style="padding-bottom: 5px">日常补货套餐</div>\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                            <div class="hover_head" style="padding-top: 20px; padding-left: 220px;">查看全部商品</div>\n' +
    '                        </div>\n' +
    '                    </li>\n' +
    '                    <li class="hoverOpacity" @click="window.location.href=\'search.html\'"><a style="background: transparent" href="javascript:;">润滑系统</a></li>\n' +
    '                    <li class="hoverOpacity" @click="window.location.href=\'search.html\'"><a style="background: transparent" href="javascript:;">冷却系统</a></li>\n' +
    '                    <li class="hoverOpacity" @click="window.location.href=\'search.html\'"><a style="background: transparent" href="javascript:;">DIY养护</a></li>\n' +
    '                    <li class="hoverOpacity" @click="window.location.href=\'search.html\'"><a style="background: transparent" href="javascript:;">刹车系统</a></li>\n' +
    '                    <li class="hoverOpacity" @click="window.location.href=\'search.html?type=1\'"><a style="background: transparent" href="javascript:;">商家门店</a></li>\n' +
    '                    <li class="hoverOpacity" @click="window.location.href=\'search.html\'"><a style="background: transparent" href="javascript:;">设备项目</a></li>\n' +
    '                    <li class="hoverOpacity" @click="window.location.href=\'question.html\'"><a style="background: transparent" href="javascript:;">关于我们</a></li>\n' +
    '                    <li class="hoverOpacity" @click="window.location.href=\'napaStore.html\'"><a style="background: transparent" href="javascript:;">招商加盟</a></li>\n' +
    '                </ul>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>'
});
//新闻滚动
Vue.component("jxky-news", {
    mounted: function () {
        $(".ulAdv").bootstrapNews({

            newsPerPage: 5,

            autoplay: true,

            navigation: false,

            pauseOnHover: true,

            direction: 'up',

            newsTickerInterval: 4000,

            onToDo: function () {

                //console.log(this);

            }

        });
    },
    template: '<div class="panel">\n' +
    '                                <div class="panel-body">\n' +
    '                                    <ul class="ulAdv">\n' +
    '                                        <li v-for="item in 10"><a href="messing.html">预定华为路由赢电脑</a></li>\n' +
    '                                    </ul>\n' +
    '                                </div>\n' +
    '                            </div>'
});
//分类头部
Vue.component("jxky-oil", {
    props: ['title'],
    data: function () {
        return {
            textEn: 'LUBRICATING OIL'
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
    template: ' <section style="margin-top: 35px;" class="dis_flex">\n' +
    '        <div><span style="border-left: 6px solid #000;padding: 0 10px;color: #000;font-size: 1.3em;font-weight: bold;">{{title}} <span style="vertical-align: middle">{{textEn}}</span></span><img src="bulid/img/icon.png" alt=""></div>\n' +
    '        <div class="dis_flex" style="font-size: 1em;font-weight: bold;padding-top: 7px;">\n' +
    '            <div class="hoverOpacity" style="padding: 0 8px;">静音</div>\n' +
    '            <div class="hoverOpacity" style="padding: 0 8px;">静音</div>\n' +
    '            <div class="hoverOpacity" style="padding: 0 8px;">静音</div>\n' +
    '            <div class="hoverOpacity" style="padding: 0 8px;">静音</div>\n' +
    '            <div class="hoverOpacity" style="padding: 0 8px;">静音</div>\n' +
    '        </div>\n' +
    '    </section>'
});
//分类商品
Vue.component("jxky-goods", {
    props: ['title'],
    data: function () {
        return {
            src: 'bulid/img/diy.png'
        }
    },
    mounted: function () {
        if (this.title == "变速箱油") {
            this.src = 'bulid/img/transmission.png';
        } else if (this.title == "DIY养护") {
            this.src = 'bulid/img/diy.png';
        }
    },
    methods: {
        detail: function () {
            window.open('detail.html');
        }
    },
    template: '<section class="dis_flex">\n' +
    '        <div class="hoverOpacity" style="width: 233px;height: 616px;margin-top: 16px;">\n' +
    '            <img :src="src" alt="">\n' +
    '        </div>\n' +
    '        <div style="width: 980px;" class="dis_flex flex-wrap">\n' +
    '            <div v-for="item in 8" style="background: #fff;width: 233px;height: 300px;margin-top: 16px;">\n' +
    '                <div class="hoverGoods" @click="detail">\n' +
    '                    <div style="width: 233px;height: 233px;padding: 24px;overflow: hidden;display: table-cell;vertical-align: middle;text-align: center;">\n' +
    '                        <img style="max-height: 185px;max-width: 185px;margin: 0 auto;" class="tamp-img" alt="loading" src="bulid/img/ajax-loader-big.gif" data-src="bulid/img/20171211104047314.png" alt="" />\n' +
    '                    </div>\n' +
    '                    <div>\n' +
    '                        <div style="padding: 0 8px;color: #000;height: 26px;overflow: hidden;font-size: 1.2em">嘉实多嘉实多嘉实多嘉实多嘉实多</div>\n' +
    '                    </div>\n' +
    '                    <div class="tc" style="padding-bottom: 10px;">\n' +
    '                        <span style="color: #e62129;font-size: 1.5em;">￥666.00</span>\n' +
    '                        <span style="text-decoration: line-through;color: #aaa">￥999.00</span>\n' +
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
    '                                    <img src="bulid/img/youhuima.jpg" alt="">\n' +
    '                                </div>\n' +
    '                            </transition>\n' +
    '                        </div>'
});
//加入购物车
Vue.component("jxky-cart", {
    template: '<div class="hoverOpacity" @click="vm.goCart($event,\'detail\')" style="color: #ff4502;border: 1px solid #ff4502;border-radius: 3px;display: inline-block;padding: 8px 40px;"><img style="width: 0;height: 0;" src="bulid/img/20171211104047314.png" alt="">加入购物车</div>\n'
});
//立即购买
Vue.component("jxky-buy", {
    methods: {
        payClick: function () {
            window.location.href = 'pay.html'
        }
    },
    template: '<div @click="payClick" class="hoverOpacity" style="color: #fff;background: #D5282C;border-radius: 3px;display: inline-block;padding: 8px 40px;">&nbsp;立即购买&nbsp;</div>\n'
});
//搜索词条
Vue.component("jxky-search", {
    props: ['title'],
    data: function () {
        return {
            text: '',
            arr: [],
            category: [],//分类
            brand: [],//品牌
        }
    },
    mounted: function () {
        let that = this;
        //    商品分类及品牌
        $.ajax({
            url:'/web_api/item/index.php?c=PCGoods&m=Category',
            type:"get",
            async:false,
            dataType:"json",
            success:function(data){
                if(data.status==1){
                    that.category = data.data.category;
                    that.brand = data.data.brand;
                }
            }
        });

        if (that.title == "fl") {
            that.text = '分类';
            that.arr = that.category;
        } else if (that.title == "pp") {
            that.text = '品牌';
            that.arr = that.brand;
        }
    },
    methods: {
        search: function (e) {
            let el = e.currentTarget;
            if (!$(el).hasClass("active")) {
                $(el).addClass("active").siblings().removeClass("active");
            } else {
                $(el).removeClass("active");
            }
        }
    },
    template: ' <div class="input-group" style="margin: 5px 0;">\n' +
    '            <span class="input-group-addon"><span style="border-left: 3px solid #D5282C;padding-left: 8px;display: inline-block;width: 75px;text-align: left;margin-left: 10px;">{{text}}</span></span>\n' +
    '            <ul class="form-control cr" style="height: auto;padding: 0;border: none">\n' +
    '                <li v-for="item in arr" @click="search($event)" class="searchLi sure fl hoverOpacity pr">{{item.title||item.category_name}}<i></i></li>\n' +
    '            </ul>\n' +
    '        </div>'
});
//搜索商品
Vue.component("jxky-goodsbase", {
    data:function(){
        return {
            page:0
        }
    },
    mounted: function () {
        let that = this;
        that.goods(that.page);
        $(window).bind("scroll", function () {
            let scrollTop = $(this).scrollTop();
            let scrollHeight = $(document).height();
            let windowHeight = $(this).height();
            if (scrollTop + windowHeight >= scrollHeight - 100) {
                that.goods(that.page++);
            }
        });
    },
    methods: {
        goods:function(page){
            $.ajax({
                url:'/web_api/item/index.php?c=PCGoods&m=ProductList&pagesize=20&page='+page,
                type:"get",
                async:false,
                dataType:"json",
                success:function(data){
                    if(data.status==1&&data.data.length!=0){
                        let d = data.data;
                        let $html ='';
                        $.each(d,function (i) {
                            $html+='            <div class="hoverGoods" style="background: #fff;width: 233px;height: 338px;border: 1px solid #ddd;float: left;margin: 6px;">\n' +
                                '                <div onclick="window.open(\'detail.html\')">\n' +
                                '                    <div style="width: 233px;height: 215px;padding: 24px;overflow: hidden;padding-bottom: 0;display: table-cell;vertical-align: middle;text-align: center;">\n' +
                                '                        <img style="max-height: 185px;max-width: 185px;margin: 0 auto;" src="'+d[i].img_url+'" alt="" />\n' +
                                '                    </div>\n' +
                                '                    <div style="padding: 0 6px;">\n' +
                                '                        <span style="color: #e62129;font-size: 1.5em;"><span style="font-size: .8em">￥</span>'+d[i].seal_price+'</span>\n' +
                                '                    </div>\n' +
                                '                    <div>\n' +
                                '                        <div style="padding: 0 8px;color: #000;height: 26px;overflow: hidden;font-size: 1.2em">'+d[i].product_title+'</div>\n' +
                                '                    </div>\n' +
                                '                    <div style="color: #949494;padding: 0 8px;">'+d[i].shop_name+'</div>' +
                                '                </div>\n' +
                                '                <div style="border-top: 1px solid #ddd;margin-top: 11px">' +
                                '<div style="display: inline-block;width: 165px;height: 33px;text-align: center;line-height: 33px">该款月销 <span style="color: #FF4502">'+d[i].sales+'</span> 件</div>' +
                                '<div title="加入收藏" onclick="goCollect(this)" style="display: inline-block;width: 33px;height: 33px;text-align: center;border-left: 1px solid #ddd;line-height: 33px"><i class="fa fa-star" aria-hidden="true"></i></div>' +
                                '<div title="加入购物车" onclick="vm.goCart(this)" style="display: inline-block;width: 33px;height: 33px;text-align: center;border-left: 1px solid #ddd;line-height: 33px"><i class="fa fa-shopping-cart" aria-hidden="true"></i></div>' +
                                '               </div>' +
                                '            </div>';
                        });
                        $("#goodsL").append($html);
                    }else{
                        $(window).unbind("scroll");
                        layer.msg('没有更多商品了', {time: 2000, icon: 5});
                    }
                }
            });
        },
    },
    template: '<section id="goodsL" class="cr">' +
    '    </section>'
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
    props: ['title'],
    methods: {
        del: function (e) {
            let el = e.currentTarget;
            layer.confirm('是否确认删除该商品？', {
                title: '提示！',
                btn: ['确认', '取消'] //按钮
            }, function () {
                $(el).parent().parent().remove();
                layer.closeAll();
            }, function () {

            });
        },
        detail: function () {
            window.open('detail.html');
        }
    },
    template: '<div class="cr">\n' +
    '                <div v-for="item in 8" class="hoverGoods pr" style="background: #fff;width: 233px;height: 338px;border: 1px solid #ddd;float: left;margin: 6px;">\n' +
    '                    <div @click="detail">\n' +
    '                        <div style="width: 233px;height: 215px;padding: 24px;overflow: hidden;padding-bottom: 0;display: table-cell;vertical-align: middle;text-align: center;">\n' +
    '                            <img style="max-height: 185px;max-width: 185px;margin: 0 auto;" src="bulid/img/20171211104047314.png" alt="" />\n' +
    '                        </div>\n' +
    '                        <div>\n' +
    '                            <div style="padding: 0 8px;color: #000;height: 40px;overflow: hidden;font-size: 1.1em">{{title}}</div>\n' +
    '                        </div>\n' +
    '                        <div style="padding: 3px 6px;">\n' +
    '                            <span style="color: #e62129;font-size: 1.5em;"><span style="font-size: .8em">￥</span>666.00</span>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div style="border-top: 1px solid #ddd;margin-top: 11px;">\n' +
    '                        <div class="hoverRed" style="display: inline-block;width: 93px;height: 33px;text-align: center;line-height: 33px">找相似</div>\n' +
    '                        <div @click="window.location.href=\'store.html\'" class="hoverRed" style="display: inline-block;width: 93px;height: 33px;text-align: center;border-left: 1px solid #ddd;line-height: 33px">进入店铺</div>\n' +
    '                        <div class="hoverRed" title="删除" @click="del($event)" style="display: inline-block;width: 33px;height: 33px;text-align: center;border-left: 1px solid #ddd;line-height: 33px"><i class="fa fa-trash-o" aria-hidden="true"></i></div>\n' +
    '                    </div>\n' +
    '                    <div class="triangle" style="position: absolute;top: 0;left: 0;">\n' +
    '                        自营\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>'
});

