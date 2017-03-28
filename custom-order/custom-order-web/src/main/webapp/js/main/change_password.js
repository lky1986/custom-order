$(function(){
    
	casino.store.init();
	
	casino.simpleCrud.settings.afterSave = function(result){
		 if (result.status) {
			 $.BaseController.cleanFormContent($("#content form[name='content_form']"));
             casino.simpleCrud.settings.showPrompt("保存成功",result.code);
         } else {
             casino.simpleCrud.settings.showPrompt(result.message,result.code);
         }
	};
	
	casino.simpleCrud.init();
	
});

