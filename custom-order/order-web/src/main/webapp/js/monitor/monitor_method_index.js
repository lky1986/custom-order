$.extend({
	jmp:{
		perfTr:"",
		countTr:"",
		userTr:"",
		perfTable:null,
		countTable:null,
		userTable:null,
		interval:null,
		intervalTime:300000,
		refreshMonitorList:function(){
			casino.store.refreshTable("#monitor_table","listJson",{},{appCode:appCode,monitorType:monitorType});
		},
		createMonitor:function(){
			$("#create_monitor_container").show();
			$("#modal_container").show();
			$.jmp.editMonitor();
		},
		editMonitor:function(id){
			var param = id?{id:id}:{};
			$.BaseController.send({url:contextPath+"/monitor/detailJson",success:function(result){
				$("#create_monitor_container").show();
				$("#modal_container").show();
				$.jmp.perfTable.find("tr.item").remove();
				$.jmp.countTable.find("tr.item").remove();
				$.jmp.userTable.find("tr.item").remove();
				if(result.resultMap.entity.monitorId!=""){
					casino.simpleCrud.setFormContent($("#create_monitor_container form"), result.resultMap.entity);
					if(result.resultMap.entity.perfAlarmRuleList.length>0){
						var trs = $.jmp.perfTable.find("tr.item");
						var perfAlarmRuleList = result.resultMap.entity.perfAlarmRuleList;
						for(var i=0;i<perfAlarmRuleList.length-trs.length;i++){
							$.jmp.addPerf();
						}
						trs = $.jmp.perfTable.find("tr.item");
						for(var i=0;i<perfAlarmRuleList.length;i++){
							casino.simpleCrud.setFormContent(trs.eq(i),  perfAlarmRuleList[i]);	
						}
					}
					if(result.resultMap.entity.execCountAlarmRuleList.length>0){
						var trs = $.jmp.countTable.find("tr.item");
						var execCountAlarmRuleList = result.resultMap.entity.execCountAlarmRuleList;
						for(var i=0;i<execCountAlarmRuleList.length-trs.length;i++){
							$.jmp.addCount();
						}
						trs = $.jmp.countTable.find("tr.item");
						for(var i=0;i<execCountAlarmRuleList.length;i++){
							casino.simpleCrud.setFormContent(trs.eq(i),  execCountAlarmRuleList[i]);	
						}
					}
					if(result.resultMap.entity.alarmUsersList.length>0){
						var trs = $.jmp.userTable.find("tr.item");
						var alarmUsersList = result.resultMap.entity.alarmUsersList;
						for(var i=0;i<alarmUsersList.length-trs.length;i++){
							$.jmp.addUser();
						}
						trs = $.jmp.userTable.find("tr.item");
						for(var i=0;i<alarmUsersList.length;i++){
							casino.simpleCrud.setFormContent(trs.eq(i),  alarmUsersList[i]);	
						}
					}
				}else{
					$.BaseController.cleanFormContent($("#create_monitor_container form"));
					$.jmp.perfTable.find("tbody").empty();
					$.jmp.countTable.find("tbody").empty();
				}
				$("#create_monitor_container input[name='appCode']").val(appCode);
				$("#create_monitor_container input[name='monitorType']").val(monitorType);
				$("#tab_perf_alarm_rule_content_head").click();
			},param:param});
		},
		getResource:function(){
			$.BaseController.send({url:contextPath+"/monitor/perfAlarmRule/resource",success:function(result){
				var nature = result.resultMap.nature;
				var natureOption="";
				for(key in nature){
					natureOption +="<option value='"+key+"'>"+nature[key]+"</option>";
				}
				var operator = result.resultMap.operator;
				var operatorOption="";
				for(key in operator){
					operatorOption +="<option value='"+key+"'>"+operator[key]+"</option>";
				}
				$.jmp.perfTable.find("select[name='quota']").append(natureOption);
				$.jmp.perfTable.find("select[name='expression']").append(operatorOption);
				//备份perfTr的html
				$.jmp.perfTr = $.jmp.perfTable.find("tbody").html();
				$.jmp.perfTable.find("tbody").empty();
				//备份countTr的html
				$.jmp.countTr = $.jmp.countTable.find("tbody").html();
				$.jmp.countTable.find("tbody").empty();
				//备份userTr的html
				$.jmp.userTr = $.jmp.userTable.find("tbody").html();
				$.jmp.userTable.find("tbody").empty();
			},param:{monitorType:monitorType}});
		},
		addPerf:function(){
			$.jmp.perfTable.find("tbody").append($.jmp.perfTr);
		},
		deletePerf:function(){
			var item = $(this).closest("tr");
			item.remove();
		},
		addCount:function(){
			$.jmp.countTable.find("tbody").append($.jmp.countTr);
		},
		deleteCount:function(){
			var item = $(this).closest("tr");
			item.remove();
		},
		addUser:function(){
			$("#select_user_container").show();
			casino.store.getTableData($("#select_user_table"),contextPath+"/monitor/user");
		},
		selectUser:function(){
			var selectUser = [];
			var tmp = $("#select_user_table").find("tbody").find(":checked");
			tmp.each(function(){
				selectUser[selectUser.length]=$(this).val();
			});
			
			
			$.jmp.userTable.find("tr.item").each(function(){
				var userCode = $(this).find("[name='userCode']").text();
				for(index in selectUser){
					if(userCode==selectUser[index]){
						delete selectUser[index];
						return;
					}
				}
			});
			for(index in selectUser){
				var user = $($.jmp.userTr);
				user.find("[name='userCode']").text(selectUser[index]);
				$.jmp.userTable.find("tbody").append(user);
			}
			$("#select_user_container").hide();
		},
		deleteUser:function(){
			var item = $(this).closest("tr");
			item.remove();
		},
		searchTime:function(){
			var monitorId = $("#update_info_btn").attr("monitorId");
			var beginTime =$("input[name='beginTime']").val();
			var endTime = $("input[name='endTime']").val();
			if(beginTime==""||endTime==""){
				casino.store.infoAlert("warning","请选择查询时间范围");
			}else{
				var begin = beginTime.parseDate("yyyy-MM-dd HH:mm:ss");
				var end = endTime.parseDate("yyyy-MM-dd HH:mm:ss");
				if(end.getTime()-begin.getTime()>1000*60*60*2){
					casino.store.infoAlert("warning","查询时间范围不能超过两个小时");
				}else{
					if($.jmp.interval){
						clearInterval($.jmp.interval);
					}
					var param = {"beginTime":beginTime,"endTime":endTime,appCode:appCode,monitorId:monitorId};
					$.BaseController.send({url:contextPath+"/monitor/method/report_time",success:function(result){
						var dataList = result.resultMap.dataList;
						$.jmp.createReportDate(dataList);
					},param:param});
				}
			}
		},
		saveOrUpdate:function(){
			var param = $.BaseController.getFormData("#create_monitor_container form");
			//createPerf值
			var perfItems = $.jmp.perfTable.find("tr.item");
			param.perfNum = perfItems.length;
			perfItems.each(function(index){
				var currentItem = $.BaseController.getFormData(this);
				var itemValue = {};
				for(var key in currentItem){
					itemValue["perf_"+key+"_"+index] =currentItem[key]; 
				}
				$.extend(param,itemValue);
			});
			//createCount值
			var countItems = $.jmp.countTable.find("tr.item");
			param.countNum = countItems.length;
			countItems.each(function(index){
				var currentItem = $.BaseController.getFormData(this);
				var itemValue = {};
				for(var key in currentItem){
					itemValue["count_"+key+"_"+index] =currentItem[key]; 
				}
				$.extend(param,itemValue);
			});
			//createUser值
			var userItems = $.jmp.userTable.find("tr.item");
			param.userNum = userItems.length;
			userItems.each(function(index){
				var currentItem = $.BaseController.getFormData(this);
				var itemValue = {};
				for(var key in currentItem){
					itemValue["user_"+key+"_"+index] =currentItem[key]; 
				}
				$.extend(param,itemValue);
			});
			//存储
			$.BaseController.send({url:contextPath+"/monitor/saveOrUpdate",success:function(result){
				$.jmp.refreshMonitorList();
				$(".close").click();
			},param:param});
		},
		openMonitor:function(id){
			$("#tab_content_head").click();
			var param = {id:id};
			$.BaseController.send({url:contextPath+"/monitor/detailJson",success:function(result){
				var entity = result.resultMap.entity;
				$("#show_monitor_info_table").find("span[name]").each(function(){
					var self = $(this);
					var proName = self.attr("name");
					var text = entity[proName];
					if(text.toString()=='true'){
						text= '是';
					}else if(text.toString()=='false'){
						text= '否';
					}
					self.text(text);
				});
			},param:param});
			if($.jmp.interval){
				clearInterval($.jmp.interval);
			}
			$.jmp.refreshReport(id);
			$.jmp.interval = setInterval(function(){
				$.jmp.refreshReport(id);
			},$.jmp.intervalTime);
			
		},
		refreshReport:function(id){
			var param = {appCode:appCode,monitorId:id};
			$.BaseController.send({url:contextPath+"/monitor/method/report",success:function(result){
				var dataList = result.resultMap.dataList;
				$.jmp.createReportDate(dataList);
			},param:param,beforeSend:function(){}});
		},
		deleteMonitor:function(){
			var tmp =$("#monitor_table").find("tbody").find(":checked");
			var afterDelete = function(){
				$.jmp.refreshMonitorList();
			};
			$.BaseController.deleteData(tmp,contextPath+"/monitor/delete",{afterDelete:afterDelete});
		},
		renderReport:function(data,yTitle,report,title,horizontal,unit,xTitle){
			var reportContainer = report!=null?$(report):$('#container');
			var categories = [];
			if(!horizontal){
				for(index in data.data){
					categories[index] = index;
				}
			}else{
				categories = horizontal;
			}
			reportContainer.highcharts({
	            title: {
	                text: "",
	               	x: -20 //center
	            },
	            credits: {
	                enabled: false
	            },
	            /* subtitle: {
	                text: 'Source: WorldClimate.com',
	                x: -20
	            }, */
	            xAxis: {
	                categories: categories,
	                    title: {
	                        text: xTitle
	                    },
	            },
	            yAxis: {
	            	min:0,
	            	minTickInterval:1,
	                title: {
	                    text: yTitle
	                },
	                plotLines: [{
	                    value: 0,
	                    width: 1,
	                    color: '#808080'
	                }],
	              /*  categories: ['0', '100', '200','300','400','500','600','700']  */
	            },
	            tooltip: {
	                valueSuffix: unit?unit:'个'
	            },
	            legend: {
	                layout: 'vertical',
	                align: 'right',
	                verticalAlign: 'middle',
	                borderWidth: 0
	            },
	            series:data
	        });
			//点击线事件
			var chart = reportContainer.highcharts();
			$(chart.series).each(function(index){
	        	$(this).click(function(){
	        		this.hide();
	            }); 
	        });
			
			reportContainer.closest(".widget-box").find(".smaller").text(title);
		},
		createReportDate:function(dataList){
			var execCount = {name:"执行次数",data:[]};
			var execSuccess = {name:"执行成功次数",data:[]};
			var execFail = {name:"执行失败次数",data:[]};
			var execAvailability = {name:"执行成功率",data:[]};
			var maxValue = {name:"最大值",data:[]};
			var minValue = {name:"最小值",data:[]};
			var avgValue = {name:"平均值",data:[]};
			var date = [];
			var day = [];
			for(var i=dataList.length-1;i>=0;i--){
				var data = dataList[i];
				execCount.data.push(data.execCount);
				maxValue.data.push(data.maxValue);
				minValue.data.push(data.minValue);
				avgValue.data.push(data.avgValue);
				execFail.data.push(data.failCount);
				execSuccess.data.push(data.successCount);
				execAvailability.data.push(data.availability);
				var time = data.dateTime.toString().split(" ");
				if($.inArray(time[0],day)<0){
					day.push(time[0]);
				}
				date.push(time[1]);
			}
			var execTimeReportList = [];
			execTimeReportList.push(maxValue);
			execTimeReportList.push(minValue);
			execTimeReportList.push(avgValue);
			var execCountReportList = [];
			execCountReportList.push(execCount);
			execCountReportList.push(execSuccess);
			execCountReportList.push(execFail);
			var availabilityList = [];
			availabilityList.push(execAvailability);
			$.jmp.renderReport(execTimeReportList,"执行时间",$("#exec_time_total_report_report_table"),"方法执行时间",date,"ms",day.join(","));
			$.jmp.renderReport(execCountReportList,"执行次数",$("#exec_count_total_report_report_table"),"方法执行次数",date,"次",day.join(","));
			$.jmp.renderReport(availabilityList,"成功率",$("#exec_availability_total_report_report_table"),"方法执行成功率",date,"%",day.join(","));
		},
		defaultReport:function(){
			var monitorId = $("#update_info_btn").attr("monitorId");
			if($.jmp.interval){
				clearInterval($.jmp.interval);
			}
			$.jmp.refreshReport(monitorId);
			$.jmp.interval = setInterval(function(){
				$.jmp.refreshReport(monitorId);
			},$.jmp.intervalTime);
		}
	}
});
$(function(){
	casino.store.init();
	
	$("#tab_perf_alarm_rule_content_head").click();
	
	$("#monitor_table").find('tbody').on("dblclick", "tr", function () {
		var self = $(this);
        var id = self.find(":checkbox:first").val();
        if(!id){
            id = self.find(":radio:first").val();
        }
        $("#update_info_btn").attr("monitorId",id);
        $.jmp.openMonitor(id);
    });
	
	$("#refreshBtn").click($.jmp.refreshMonitorList).click();
	
	$("#createBtn").click($.jmp.createMonitor);
	
	$("#deleteBtn").click($.jmp.deleteMonitor);
	
	
	$("#tab_list_head").click();

	$("#create_monitor_container .close").click(function(){
		$("#create_monitor_container").hide();
		$("#modal_container").hide();
	});
	
	$.jmp.getResource();
	
	$.jmp.perfTable = $("#perf_alarm_rule_table");
	$.jmp.countTable = $("#exec_count_alarm_rule_table");
	$.jmp.userTable = $("#alarm_users_table");
	
	$.jmp.perfTable.on("click",".addPerf",$.jmp.addPerf);
	$.jmp.perfTable.on("click",".deletePerf",$.jmp.deletePerf);
	$.jmp.countTable.on("click",".addCount",$.jmp.addCount);
	$.jmp.countTable.on("click",".deleteCount",$.jmp.deleteCount);
	$.jmp.userTable.on("click",".addUser",$.jmp.addUser);
	$.jmp.userTable.on("click",".deleteUser",$.jmp.deleteUser);
	
	$("#save_info_btn").click($.jmp.saveOrUpdate);
	
	$("#update_info_btn").click(function(){
		if($(this).attr("monitorId")){
			$.jmp.editMonitor($(this).attr("monitorId"));
		}
	});
	
	$("#select_user_container .close").click(function(){
		$("#select_user_container").hide();
	});
	
	$("#select_user").click($.jmp.selectUser);
	
	$("#submit_search").click($.jmp.searchTime);
	
	$("#default_report").click($.jmp.defaultReport);
});