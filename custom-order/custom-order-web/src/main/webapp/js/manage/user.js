$(function(){
    
	casino.store.init();

	casino.simpleCrud.settings.onEdit =function(result){
		if (result.success) {
			$.BaseController.cleanFormContent($("#content form[name='content_form']"));
			if(result.resultMap.entity.id!=""){
				casino.simpleCrud.setFormContent($("#content form[name='content_form']"), result.resultMap.entity);
				$("#content form[name='content_form']").find(":password").val("");
			}
            $("#tab_content_head").click();
        } else {
            casino.simpleCrud.settings.showPrompt(result.description,result.resultCode);
        }
	};
	
	casino.simpleCrud.init();
	
	$.BaseController.send({url:contextPath+"/user/roleList",success:function(data){
		var srole = "<td><label class='control-label '>角色</label></td><td col='3'>";
		var roles =data.resultMap.rows;
		for(var i=0;i<roles.length;i++){ 
			role = roles[i];
			srole +="<label><input type='checkbox'  name='roles' value='"+role['roleCode']+"'/>"+role['roleName']+"</label>";
		};
		srole +="</td>";
		$("#roleContainer").append(srole).find(":checkbox").uniform();
	}});
	
});

