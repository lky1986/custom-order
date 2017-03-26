$(function(){
    
	casino.store.init();

	casino.simpleCrud.settings.onEdit =function(result){
		if (result.success) {
			$("#tab_content_head").click();
			if(result.resultMap.entity.id!=""){
				casino.simpleCrud.setFormContent($("#content form[name='content_form']"), result.resultMap.entity);
			}else{
				$.BaseController.cleanFormContent($("#content form[name='content_form']"));
			}
			$.jmp.app.refreshCurrentUser();
			$("#current_user_container").show();
        } else {
            casino.simpleCrud.settings.showPrompt(result.description,result.resultCode);
        }
	};
	
	casino.simpleCrud.settings.afterSave = function (result) {
        if (result.success) {
            casino.simpleCrud.setFormContent($("#content form[name='content_form']"), result.resultMap.entity);
            $(casino.simpleCrud.settings.contentForm).find('[uneditable]').each(function () {
                $(this).attr('disabled', true);
            });
            casino.simpleCrud.settings.showPrompt("保存成功","success");
            $.jmp.app.refreshCurrentUser();
        } else {
            casino.simpleCrud.settings.showPrompt(result.description,result.resultCode);
        }
	};
	
	casino.simpleCrud.init();
	
	$("#open_user_list_btn").click(function(){
		$.jmp.app.openUserList();
	});
	
	$("#select_user_container .close").click(function(){
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
					$(".detail_modal").show();
					casino.store.getTableData($("#select_user_container .listTable"),contextPath+"/app/userList?id="+id);
				}
			},
			refreshCurrentUser:function(){
				var currentId = $("#content form[name='content_form']").find("input[name='id']").val();
				casino.store.getTableData($("#current_user_table"),contextPath+"/app/currentUserList?id="+currentId);
			},
			selectedUser:function(){
				var selectUser = [];
				var tmp =$("#select_user_table").find("tbody").find(":checked");
				tmp.each(function(){
					selectUser[selectUser.length]=$(this).val();
				});
				var appCode = $("#appCode").val();
				$(".detail_modal").hide();
				$.BaseController.send({url:contextPath+"/app/selectedUser",success:function(data){
					$.jmp.app.refreshCurrentUser();
				},param:{appCode:appCode,userCode:selectUser.join(",")}});
			},
			deleteUser:function(){
				var tmp =$("#current_user_table").find("tbody").find(":checked");
				var option ={};
				option.afterDelete = $.jmp.app.refreshCurrentUser;
				option.idKey = "userCode";
				option.param = {appCode:$("#appCode").val()};
				$.BaseController.deleteData(tmp,contextPath+"/app/deleteUser",option);
			}
		}
	}
});

