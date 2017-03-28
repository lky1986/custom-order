$.extend({
	jmp:{
		perfTr:"",
		countTr:"",
		userTr:"",
		perfTable:null,
		countTable:null,
		userTable:null,
		interval:null,
		intervalTime:10000,
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
		openInstance:function(jvminfoId){
			$("#tab_content_head").click();
			$("#tab_instance_config_head").click();
			$("#tab_instance_report_head").click(function(){
				if($.jmp.interval){
					clearInterval($.jmp.interval);
				}
				$.jmp.refreshReport.prototype.jvminfoId = jvminfoId;
				$.jmp.refreshReport();
				$.jmp.interval = setInterval(function(){
					$.jmp.refreshReport();
				},$.jmp.intervalTime);
			});
			if($.jmp.interval){
				clearInterval($.jmp.interval);
			}
			$("#instance_config_table").empty();
			$.jmp.getInstanceConfig(jvminfoId);
		},
		getInstanceConfig:function(jvmInfoId){
			var param = {jvminfoId:jvmInfoId};
    	 	$.BaseController.send({url:contextPath+"/monitor/jvm/config",success:function(result){
				 var jvmConfigList = result.resultMap.jvmConfigList;
				 var trs = "";
				 for(var i=0;i<jvmConfigList.length;i++){
					 var jvmConfig = jvmConfigList[i];
					 trs+="<div class='profile-info-row'>"
					 	+"<div class='profile-info-name'>"+jvmConfig.keyChineseName+"</div>"
						+"<div class='profile-info-value'><span class='editable editable-click'>"+jvmConfig.keyValue+"</span></div>" +
						"</div>";
				 }
		
				 $("#instance_config_table").append(trs);
			},param:param});
		},
		searchTime:function(){
			var beginTime =$("input[name='beginTime']").val();
			var endTime = $("input[name='endTime']").val();
			if(beginTime==""||endTime==""){
				casino.store.infoAlert("warning","请选择查询时间范围");
			}else{
				var begin = beginTime.parseDate("yyyy-MM-dd HH:mm:ss");
				var end = endTime.parseDate("yyyy-MM-dd HH:mm:ss");
				if(end.getTime()-begin.getTime()>1000*60*60*2){
					casino.store.infoAlert("warning","查询时间范围不能超过5分钟");
				}else{
					if($.jmp.interval){
						clearInterval($.jmp.interval);
					}
					var param = {"beginTime":beginTime,"endTime":endTime,appCode:appCode,jvminfoId:$.jmp.refreshReport.prototype.jvminfoId};
					$.BaseController.send({url:contextPath+"/monitor/jvm/report_time",success:function(result){
						var dataList = result.resultMap.jvmMonitorDataList;
						$.jmp.createReportDate(dataList);
					},param:param});
				}
			}
		},
		refreshReport:function(){
			var jvminfoId = $.jmp.refreshReport.prototype.jvminfoId;
			var param = {jvminfoId:jvminfoId};
			$.BaseController.send({url:contextPath+"/monitor/jvm/report",success:function(result){
				var dataList = result.resultMap.jvmMonitorDataList;
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
		showInstanceList:function(minitorKey,id){
			$("#tab_instance_list_head").click();
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
			casino.store.getTableData("#instance_list_table",contextPath+"/monitor/jvm/instanceList",{},{appCode:appCode,minitorKey:minitorKey});
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
	            	minTickInterval:0.1,
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
			var CPU = {name:"CPU",data:[]};
			var TC = {name:"活动线程数",data:[]};
			var DTC = {name:"守护线程数",data:[]};
			var FGCC = {name:"全GC次数",data:[]};
			var FGCD = {name:"Full GC时长",data:[]};
			var HMU = {name:"堆使用量",data:[]};
			var CHMU = {name:"堆大小",data:[]};
			var date = [];
			var day = [];
			var currenttc =0;
			var currentdtc = 0;
			var currentptc=0;
			var cpu ="0%";
			var mhmu = "0 字节";
			var chmu = "0 字节";
			var hmu = "0 字节";
			for(var i=dataList.length-1;i>=0;i--){
				var data = dataList[i];
				if(i==0){
					currenttc = data.tc;
					currentdtc = data.dtc;
					currentptc = data.ptc;
					cpu = parseFloat(data.cpu)+"%";
					mhmu = data.mhmu+" 字节";
					chmu = data.chmu+" 字节";
					hmu = data.hmu+" 字节";
				}
				CPU.data.push(parseFloat(data.cpu));
				TC.data.push(data.tc);
				DTC.data.push(data.dtc);
				FGCC.data.push(data.fgcc);
				FGCD.data.push(data.fgcd);
				HMU.data.push(data.hmu);
				CHMU.data.push(data.chmu);
				var time = data.dataTime.toString().split(" ");
				if($.inArray(time[0],day)<0){
					day.push(time[0]);
				}
				var tt = time[1].split(":");
				date.push(tt[1]+":"+tt[2]);
			}
			var CPUReportList = [];
			CPUReportList.push(CPU);
			var TCReportList = [];
			TCReportList.push(TC);
			TCReportList.push(DTC);
			var FGCCReportList = [];
			FGCCReportList.push(FGCC);
			var FGCDReportList = [];
			FGCDReportList.push(FGCD);
			var HMUReportList = [];
			HMUReportList.push(HMU);
			HMUReportList.push(CHMU);
			$.jmp.renderReport(CPUReportList,"使用率",$("#cpu_report_table"),"cpu使用率",date,"%",day.join(","));
			$.jmp.renderReport(TCReportList,"线程数",$("#thread_report_table"),"存活线程数",date,"个",day.join(","));
			//$.jmp.renderReport(FGCCReportList,"次数",$("#fullgc_exec_num_report_table"),"Full GC次数",date,"次",day.join(","));
			//$.jmp.renderReport(FGCDReportList,"时常",$("#fullgc_exec_time_report_table"),"Full GC时长",date,"ms",day.join(","));
			$.jmp.renderReport(HMUReportList,"内存数",$("#used_memory_total_report_table"),"堆栈内存使用量（字节）",date,"字节",day.join(","));
			$(".profile-info-value span[name='cpu']").text(cpu);
			$(".profile-info-value span[name='currenttc']").text(currenttc);
			$(".profile-info-value span[name='currentdtc']").text(currentdtc);
			$(".profile-info-value span[name='currentptc']").text(currentptc);
			$(".profile-info-value span[name='mhmu']").text(mhmu);
			$(".profile-info-value span[name='chmu']").text(chmu);
			$(".profile-info-value span[name='hmu']").text(hmu);
		}
	}
});
$(function(){
	casino.store.init();
	
	$("#tab_perf_alarm_rule_content_head").click();
	
	$("#monitor_table").find('tbody').on("dblclick", "tr", function () {
		var self = $(this);
        var id = self.find(":checkbox:first").val();
        var minitorKey = self.find("td").eq($("#monitor_table").find("thead tr th[name='monitorKey']").index()).text();
        $("#update_info_btn").attr("monitorId",id);
        $("#update_info_btn").attr("minitoryKey",minitorKey);
        $.jmp.showInstanceList(minitorKey,id);
    });
	
	$("#instance_list_table").find('tbody').on("dblclick", "tr", function () {
		var self = $(this);
        var id = self.find(":checkbox:first").val();
        $.jmp.openInstance(id);
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
});