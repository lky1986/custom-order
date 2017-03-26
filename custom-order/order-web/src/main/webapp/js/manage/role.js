$(function(){
    
	casino.store.init();
	
	casino.simpleCrud.settings.onEdit =function(result){
		if (result.success) {
			if(result.resultMap.entity.id!=""){
				casino.simpleCrud.setFormContent($("#content form[name='content_form']"), result.resultMap.entity);
				$(".disable").attr("disabled",true);
			}else{
				$.BaseController.cleanFormContent($("#content form[name='content_form']"));
			}
            $("#tab_content_head").click();
        } else {
            casino.simpleCrud.settings.showPrompt(result.description,result.resultCode);
        }
	};

	casino.simpleCrud.init();
	
});

