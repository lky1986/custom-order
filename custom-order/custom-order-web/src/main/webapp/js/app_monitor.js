$.extend({
	jmp:{
		refreshAppMonitor:function(){
			$.BaseController.send(
				{
					url:contextPath+"/monitor/app/all",
					success:function(data){
						var appList =data.resultMap.appList;
						var showList = "";
						var ul = $("#checkMonitor").find("ul:first");
						if(appList.length>0){
							ul.empty();
							var app;
							for(var i=0;i<appList.length;i++){
								app= appList[i];
								showList+="<li>";
								showList+="<a href=''>"+app.appName+"</a>";
								showList+="<ul>";
								showList+="<li><a href='javascript:void(0)' name='/monitor/index?appCode="+app.appCode+"&type=method'>方法监控</a></li>";
								showList+="<li><a href='javascript:void(0)' name='/monitor/index?appCode="+app.appCode+"&type=jvm'>jvm监控</a></li>";
								showList+="<li><a href='javascript:void(0)' name='/monitor/appLog/index?appCode="+app.appCode+"'>系统日志监控</a></li>";
								showList+="</ul>";
								showList+="</li>";
							}
							ul.append(showList);
						}else{
							if(!ul.find("li").hasClass("no_app")){
								ul.append("<li class='no_app'><a href=''javascript:void(0);'>没有应用</a> </li>");
							}
						}
					},
					param:{}
				}
			);
		}
	}
});
$(function(){
	$.jmp.refreshAppMonitor();
});