
$(function(){
	casino.store.init();
	$("#tab_list_head").click();
	// 刷新列表
	$("#refreshBtn").click(function() {
		var appCode = $("#appCode").val();
		casino.store.listSearch("#monitor_table",contextPath+ "/monitor/appLog/refreshAppInstanceList?appCode="+appCode,null,null,{hideColumns:[0]});
	});
	
	//列表表格下面的tr双机事件
    $("#search_list").on("dblclick","tr",function(){
    	var logKey = $(this).find("input[type=hidden]").val();
    	$("#logKey").val(logKey);
    	$("[href=#content]").click();
    });

	//列表表格下面的tr双机事件
    $("#log_list").on("dblclick","tr",function(){
    	var checked_item = $(this).find(":checkbox").val();
    	var sUrl = contextPath + "/monitor/appLog/getLogInfo?id=" + checked_item;
    	//FormUtils.loadDataExt("logDetailInfo",sUrl);
    	var fromId = "logDetailInfo";
    	$.blockUI();
    	$.getJSON(sUrl, function(json){ 
    		$.unblockUI();
    		if (json.success){ 
    			var data = json.resultMap.details;
    			casino.store.eachDataToForm($("#" + fromId),data,"name");
    		}else{
    			casino.store.infoMsg("数据加载失败");
    		}
    	});
    	
		$("#log_detail_modal").modal({
            backdrop : true,
            show : true
        });
    });
    
    $("#submit_search").click(function (){
    	var logKey = $("#logKey").val();
    	var beginTime = $("#beginTime").val();
    	var endTime = $("#endTime").val();
    	var level = $("#level").val();
    	var threadName = $("#threadName").val();
    	var className = $("#className").val();
    	var logMsg = $("#logMsg").val();
    	var obj = {logKey:logKey,beginTime:beginTime,endTime:endTime,level:level,threadName:threadName,className:className,logMsg:logMsg};
    	casino.store.getTableData("#log_list_table",contextPath + "/monitor/appLog/listLogDetail","",obj);
    });
});