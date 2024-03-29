function mag(show, bigshow, smallshow, mask, bigitem ,prevy,nexty,middley,middleBoxy, length) {
    this.show = show;
    this.bigshow = bigshow;
    this.smallshow = smallshow;
    this.mask = mask;
    this.bigitem = bigitem;
    this.obj = {prev: prevy, next: nexty, middle: middley, middleBox: middleBoxy,len:length}
}

mag.prototype = {
    init: function () {
        var that = this;
        that.start();
        this.showHover();
        this.smallImgHover();
        this.showMove();
        this.prevClick();
        this.nextClick();
    },
    start: function () {
        var that = this;
        var buil = $(that.show).width() / $(that.mask).width() * $(that.bigshow).width();
        $(that.bigitem).css("width", buil);
        $(that.smallshow + ' img').eq(0).css("border", "2px solid #f40").parent().siblings().find('img').css('border',"1px solid #e8e8e8");
        var midhei = $(that.obj.middle + ' li').innerWidth() * that.obj.len;
        $(that.obj.middle).width(midhei);
    },
    showHover: function () {
        var that = this;
        $(that.show).hover(function () {
            $(that.bigshow).show();
            $(that.mask).show();
        }, function () {
            $(that.bigshow).hide();
            $(that.mask).hide();
        });
    }, smallImgHover: function () {
        var that = this;
        $(document).on('click',that.smallshow + ' img',function () {
            var src = $(this).attr("src");
            $(that.smallshow + ' img').css("border", "1px solid #e8e8e8");
            $(this).css("border", "2px solid #f40");
            $(that.show + '>img').attr("src", src);
            $(that.bigitem + '>img').attr("src", src);
        });
    }, showMove: function () {
        var that = this;
        $(that.show).mousemove(function (e) {
            var bigx = $(this).offset().left;
            var bigy = $(this).offset().top;
            var x = e.clientX;
            var y = e.clientY;
            var scrollx = $(window).scrollLeft();
            var scrolly = $(window).scrollTop();
            var ox = x + scrollx - bigx - $(that.mask).width() / 2;
            var oy = y + scrolly - bigy - $(that.mask).height() / 2;
            if (ox <= 0) {
                ox = 0
            }
            if (ox > $(that.show).width() - $(that.mask).width()) {
                ox = $(that.show).width() - $(that.mask).width();
            }
            if (oy <= 0) {
                oy = 0
            }
            if (oy > $(that.show).height() - $(that.mask).height()) {
                oy = $(that.show).height() - $(that.mask).height();
            }
            $(that.mask).css({left: ox});
            $(that.mask).css({top: oy});
            var bei = $(that.show).width() / $(that.mask).width();
            $(that.bigitem + '>img').css({marginLeft: -bei * ox, marginTop: -bei * oy})
        });
    }, prevClick: function () {
        var that = this;
        $(that.obj.prev).click(function () {
            if ($(that.obj.middle).width() - $(that.obj.middleBox).width() > 0) {
                if (Math.abs(parseInt($(that.obj.middle).css("marginLeft"))) > $(that.obj.middleBox).width()) {
                    $(that.obj.middle).css("marginLeft", parseInt($(that.obj.middle).css("marginLeft")) + $(that.obj.middleBox).width())
                }
                if (Math.abs(parseInt($(that.obj.middle).css("marginLeft"))) < $(that.obj.middleBox).width()) {
                    $(that.obj.middle).css("marginLeft", "0px");
                    $(that.obj.next).removeClass("nextnone");
                    $(that.obj.prev).addClass("prevnone");
                }
            } else {
                return;
            }
        });
    }, nextClick: function () {
        var that = this;
        $(that.obj.next).click(function () {
            if ($(that.obj.middle).width() - $(that.obj.middleBox).width() > 0) {
                var shuzi = $(that.obj.middle).width() - Math.abs(parseInt($(that.obj.middle).css("marginLeft"))) - $(that.obj.middleBox).width();
                if (shuzi > $(that.obj.middleBox).width()) {
                    $(that.obj.middle).css("marginLeft", -$(that.obj.middleBox).width() + parseInt($(that.obj.middle).css("marginLeft")))
                }
                if (shuzi < $(that.obj.middleBox).width()) {
                    $(that.obj.middle).css("marginLeft", -($(that.obj.middle).width() - $(that.obj.middleBox).width()))
                    $(that.obj.next).addClass("nextnone");
                    $(that.obj.prev).removeClass("prevnone");
                }
            } else {
                return;
            }
        });
    }
}