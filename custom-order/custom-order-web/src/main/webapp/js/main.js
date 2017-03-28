$(function(){

	function setLeftNavSize(){
		$(".panel-default .panel-body").css("max-height", $(".bs-sidebar").height() - (36 * $(".panel-group .panel").length)).perfectScrollbar();
		$(".tabWrap .tab-content,.tabWrap .iframe_wrap").css("height", $(window).height()-50);
	}
	setLeftNavSize();
	$(window).resize(setLeftNavSize);
	//左侧菜单打开关闭图标设置
	var panel_title  = $(".panel-title"),panel_span =panel_title.find("span");
    panel_title.click(function(){
        var $this_span = $(this).find("span");
        $this_span.toggleClass("open");
        panel_span.not($this_span).removeClass("open");
    });


  //框架外层tab操作
    var nav_list = $(".nav-list,#system"),nav_list_a = nav_list.find("a").not('a.exit');
    var Tab = $("#myTab"),TabContent = $("#myTabContent");
    var name_cache = {},panel_cache = {};
    var tabul_length=0,tabnav_length,slide_width;
    var tabli_width=130,lastWindowWidth;
    var TimeFn = null;

    lastWindowWidth=$('#tabnav').width();

    var nav_a_click = function(e){
        e.preventDefault();
//    	casino.store.stopDefaultEvent(e);
        var $this = $(this);
        var $a_name = $this.attr('name');
        if($a_name!=undefined&&$a_name!=""&&$a_name!="/"){
            var panel_id ='tab_panel' + $a_name.replace(/(:|\.|\#|\@|\$|\%|\^|\&|\*|\!|\?|\/|\=)/g,'');
            var tab_name = name_cache[panel_id];
            var tab_content = panel_cache[panel_id];
            var finalslidewidth;
            var ulleft,newlileft,newli;

            $(".nav-list,#system").find("a").not('a.exit').removeClass("nav_checked");
            $this.addClass("nav_checked");


            clearTimeout(TimeFn);
            //执行延时
            TimeFn = setTimeout(function(){
            	casino.store.isloginA(function(){

            		Tab.find("li").removeClass("active");
                    TabContent.find(".tab-pane").removeClass("active");

                    if(!tab_content&&!tab_name){
                        name_cache[panel_id] = tab_name = Tab.append('<li class="active"><a data-name="'+$a_name+'" href="#'+panel_id+'">'+$this.text()+'</a><i class="close_tab"></i></li>');
//                        var click_li=$("[href=#"+panel_id+"]").parent("li").addClass("active");
                        var click_li=$("[href=#"+panel_id+"]").parent("li");
                        newli= $('#myTab li:last-child');
                        slide_width=newli.width() + 2;
                        tabul_length+= slide_width;
                        Tab.width(tabul_length);
                        tabnav_length=$('#tabnav').width();
                        ulleft=$('#myTab').position().left;
                        newlileft=newli.position().left;

                        if(tabul_length>=tabnav_length){           //ul长度超出可视范围
                            $('.icon-left,.icon-right').css('display','inline-block');  //显示滚动按钮
                            var tmpw=ulleft*(-1)+tabnav_length;
                            if(newlileft>tmpw){                           //新增tab不在当前可视范围内，需要将ul移到最右
                                var tmpw2=newlileft-tmpw+slide_width;
                                Tab.animate({
                                    left:'-='+tmpw2
                                });

                            } else{
                                finalslidewidth= slide_width-firstslide;      //新增tab在可视范围内
                                Tab.animate({
                                    left:'-='+finalslidewidth
                                });
                            }
                            firstslide=0;

                        }else{
                            firstslide=tabnav_length-tabul_length;           //tab总长度未超过可视范围,firstslide为wrap中ul未填满的长度
                        }
                        console.log("iframe 地址： "+contextPath + $a_name);
                        panel_cache[panel_id] = tab_content = TabContent.append('<div class="tab-pane main_wrap box active" id="'+panel_id+'"> <iframe class="iframe_wrap" scrolling="auto" src="'+ contextPath + $a_name+'"></iframe> </div>');
//                        $("#"+panel_id).addClass("active");
                        setLeftNavSize();
                    }else{                                                    //tab已存在
	                    var click_li=$("[href=#"+panel_id+"]").parent("li").addClass("active");
	                		$("#"+panel_id).addClass("active");
//	                    click_li.addClass("active");                          //tab加选中效果
	                    //click_li.find('a').trigger('click');
	                    var liwidth=click_li.width();
	                    var lileft=click_li.position().left;
	                    var wrapwidth=$('#tabnav').width();
	                    var tabwidth=Tab.width();
	                    var ulleft= Tab.position().left;
	                    var liright=lileft+liwidth;
	                    if(liright<=ulleft*(-1)){                                        //tab在可视窗口左边，当前不可见，需移到至可见范围
	                        var tmp=lileft*(-1);
	                        Tab.animate({
	                            left:tmp
	                        });
	                    }else if(lileft<ulleft*(-1) && liright>ulleft*(-1)){            //tab左边部分遮住，向右移出完整tab
	                        var tmp=ulleft*(-1)-lileft;
	                        Tab.animate({
	                            left:'+='+tmp
	                        });
	                    }else if(lileft<ulleft*(-1)+wrapwidth && liright>ulleft*(-1)+wrapwidth){            //tab右边遮住，向左移出完整tab
	                        var tmp=liright-(ulleft*(-1)+wrapwidth);
	                        Tab.animate({
	                            left:'-='+tmp
	                        });
	                    }else if(lileft>=ulleft*(-1)+wrapwidth){                        //tab在可视窗口右边，当前不可见，需移到至可见范围
	                        var tmp=liright-(ulleft*(-1)+wrapwidth);
	                        Tab.animate({
	                            left:'-='+tmp
	                        });
	                    }
                }
            	});

            },300);
        }else{
            //二级菜单收缩与扩展
	        var $li = $this.closest("li"), $ul = $li.children("ul"),$nav_icon = $li.children(".nav_open");
	        if($ul.length!=0){
	                $nav_icon.toggleClass("nav_close");
	                $ul.toggleClass("childnav");
	        }
	
        
        }
    };
    
    nav_list_a.click(nav_a_click);
    nav_list_a.dblclick(function(e){
        clearTimeout(TimeFn);
        $(this).click();
    });
    
    $(".nav-list").on("click","a",nav_a_click);

    //点击当前tab，添加active效果
    Tab.on("click","a",function(e){
        e.preventDefault();                        //顶部tab点击事件触发左侧菜单中对应菜单项的点击事件完成效果
        var find_name = $(this).data('name');
        var t=$('#bs-sidebar').find(".nav-list a");
        t.removeClass("nav_checked");
        t.each(function(){
            var $this_a = $(this);
            if($this_a.attr('name')==find_name){
                $this_a.addClass('nav_checked');
                var panel = $this_a.closest(".panel-default"),  open_panel = panel.find(".panel-collapse");
                if(!open_panel.hasClass("in")){
                    panel.find("a[data-toggle]").click();
                }
            }
        });

        Tab.find("li").removeClass("active");
        TabContent.find(".tab-pane").removeClass("active");
        var click_li=$(this).parent("li");
        var liwidth=click_li.width();
        var lileft=click_li.position().left;
        var wrapwidth=$('#tabnav').width();
        var tabwidth=Tab.width();
        var ulleft= Tab.position().left;
        var liright=lileft+liwidth;

        click_li.addClass("active");

        if(lileft<ulleft*(-1) && liright>ulleft*(-1)){                                      //tab左边部分遮住，向右移出完整tab
            var tmp=ulleft*(-1)-lileft;
            Tab.animate({
                left:'+='+tmp
            });
        }else if(lileft<ulleft*(-1)+wrapwidth && liright>ulleft*(-1)+wrapwidth){            //tab右边遮住，向左移出完整tab
            var tmp=liright-(ulleft*(-1)+wrapwidth);
            Tab.animate({
                left:'-='+tmp
            });
        }


        var panel_id = $(this).attr('href').slice(1);
        $("#"+panel_id).addClass("active");

    });
    //删除当前tab
    Tab.delegate('.close_tab','click',function(){
        var tab_li = $(this).parent("li");
        var lileft=tab_li.position().left;
        var tableft=Tab.position().left;
        slide_width=tab_li.width();


        tab_count= $("#myTab li").length;
        tabnav_length=$('#tabnav').width();
        tabul_length-= slide_width;
        Tab.width(tabul_length);
        if(tabul_length<=tabnav_length){                                  //ul长度小于wrap长度，隐藏滚动按钮，并重新计算firstslide(ul未填满wrap部分的长度)
            $('.icon-left,.icon-right').css('display','none');
            Tab.animate({
                left:'0'
            });
            firstslide=tabnav_length-tabul_length;
        }else{                                                           //ul长度仍大于wrap长度
            if(tableft<0 &&tableft>(-1)*slide_width){                    //可移动长度小于删除标签的长度，则直接移到最左
                Tab.animate({
                    left:'0'
                });
            }else if(tableft<(-1)*slide_width){                          //直接左移删除标签的长度
                Tab.animate({
                    left:'+='+slide_width
                });
            }

        }
        tab_li.remove();
        var href_str = $(this).prev("a").attr('href');
        var panel_id = href_str.slice(1);
        name_cache[panel_id]=null;
        $(href_str).remove();
        panel_cache[panel_id] = null;
        var act_tab_item = Tab.find(".active");
        if(!act_tab_item.length){
            Tab.find("li:last a").click();
        }
      //删除当前的tab，让最后一个tab显示

    });
    //删除所有菜单
    $(".close_all_tabs").click(function(){
        Tab.find('.close_tab').click();
    });
    //隐藏左边菜单
    $("#main-menu-toggle").click(function(){
        $(".tabWrap").toggleClass("hide_sidebar");
    });
    //tab栏向左滑动
    $('.icon-left').click(function(){
        var ulleft=Tab.position().left;
        if(ulleft<0){                                                //当ul的left值为负时可以移动
            if(ulleft<(-2)*tabli_width){
                Tab.animate({
                    left:'+='+tabli_width*2
                });
            }else{
                Tab.animate({
                    left:'0'
                });
            }
        }
    });
    //tab栏向右滑动
    $('.icon-right').click(function(){
        var ulwidth=Tab.width();
        var wrapwidth=$('#tabnav').width();
        var ulleft=Tab.position().left;
        if(ulleft>(ulwidth-wrapwidth)*(-1) && ulleft<=0){
            if(ulwidth+ulleft-wrapwidth>2*tabli_width){
                Tab.animate({
                    left:'-='+tabli_width*2
                });
            }else{
                var tmplen= (ulwidth-wrapwidth)*(-1);
                Tab.animate({
                    left:tmplen
                });
            }
        }
    });

    window.onresize=function(){
        var ulwidth=Tab.width();
        var wrapwidth=$('#tabnav').width();
        var ulleft= Tab.position().left;
        var suslen=wrapwidth-ulwidth;
        if(suslen>=0){
            Tab.animate({
                left:'0'
            });
            firstslide=suslen;
            $('.icon-left,.icon-right').css('display','none');  //隐藏滚动按钮
        }else if(lastWindowWidth<wrapwidth && ulleft<0){
            var tmp=wrapwidth-lastWindowWidth;
            Tab.animate({
                left:'+='+tmp
            });
            ulleft+=tmp+'px';
            Tab.css('left','ulleft');
            lastWindowWidth=wrapwidth;
        }else{
            $('.icon-left,.icon-right').css('display','inline-block');
        }
    }
    
    if(openPage)nav_list.find("a[name='"+openPage+"']").click();
});
