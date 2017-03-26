$(function(){
    
	casino.store.init();

	casino.simpleCrud.settings.onEdit =function(result){
		if (result.success) {
			if(result.resultMap.entity.id!=""){
				casino.simpleCrud.setFormContent($("#content form[name='content_form']"), result.resultMap.entity);
				$("#tab_content_head").click();
				if(result.resultMap.entity.createUser==currentUserCode){
					$.jmp.app.refreshCurrentUser();
					$("#current_control_container").show();
				}else{
					$("#current_control_container").hide();
				}
			}else{
				$("#tab_content_head").click();
				$.BaseController.cleanFormContent($("#content form[name='content_form']"));
				$.jmp.app.refreshCurrentUser();
				$("#current_control_container").show();
			}
        } else {
            casino.simpleCrud.settings.showPrompt(result.description,result.resultCode);
        }
	};
	
	
	
	var afterSave = casino.simpleCrud.settings.afterSave;
	casino.simpleCrud.settings.afterSave= function (result) {
		afterSave(result);
		$.jmp.app.refreshCurrentUser();
		//调用父框架的刷新App列表
		window.parent.$.jmp.refreshAppMonitor();
	}; 
	
	casino.simpleCrud.init();
	
	$("#open_user_list_btn").click(function(){
		$.jmp.app.openUserList();
	});
	
	$(".close").click(function(){
		$(".detail_modal").hide();
	});
	
	$("#selected_user_btn").click(function(){
		$.jmp.app.selectedUser();
	});
	$("#delete_user_btn").click(function(){
		$.jmp.app.deleteUser();
	});
	
	
});

$.extend({
	jmp:{
		app:{
			openUserList:function(){
				var id = $("#content form[name='content_form']").find("input[name='id']").val();
				if(id==null||id==""){
					casino.store.infoAlert("info","先保存应用");
				}else{		
					$("#select_user_container").show();
					$("#modal_container").show();
					casino.store.getTableData($("#select_user_container .listTable"),contextPath+"/monitor/app/userList?id="+id);
				}
			},
			refreshCurrentUser:function(){
				var currentId = $("#content form[name='content_form']").find("input[name='id']").val();
				casino.store.getTableData($("#current_user_table"),contextPath+"/monitor/app/currentUserList?id="+currentId);
			},
			selectedUser:function(){
				var selectUser = [];
				var tmp =$("#select_user_table").find("tbody").find(":checked");
				tmp.each(function(){
					selectUser[selectUser.length]=$(this).val();
				});
				var appCode = $("#appCode").val();
				$(".detail_modal").hide();
				$.BaseController.send({url:contextPath+"/monitor/app/selectedUser",success:function(data){
					$.jmp.app.refreshCurrentUser();
				},param:{appCode:appCode,userCode:selectUser.join(",")}});
			},
			deleteUser:function(){
				
				var tmp =$("#current_user_table").find("tbody").find(":checked");
				if(tmp.length){
					alert("选择要删除的分配用户");
					return;
				}
				var selectUser = [];
				tmp.each(function(){
					selectUser[selectUser.length]=$(this).val();
				});
				var appCode = $("#appCode").val();
				$.BaseController.send({url:contextPath+"/monitor/app/deleteUser",success:function(data){
					$.jmp.app.refreshCurrentUser();
				},param:{appCode:appCode,userCode:selectUser.join(",")}});
			}
		}
	}
});

