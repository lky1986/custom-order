$(function(){
    
	casino.store.init();
	
	casino.simpleCrud.settings.afterSave = function(){
		 if (result.success) {
			 $.BaseController.cleanFormContent($("#content form[name='content_form']"));
             casino.simpleCrud.settings.showPrompt("保存成功","success");
         } else {
             casino.simpleCrud.settings.showPrompt(result.description,result.resultCode);
         }
	};
	
	casino.simpleCrud.init();
	
});

