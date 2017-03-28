/**
 * 常用快捷键绑定事件函数
 * 
 * @author zhangxiao
 * @time 2014-05-08
 */
window.casino = window.casino ? window.casino : {};

casino.Keyevent = {
	settings : {
		"type" : "keydown",
		"propagate" : true,
		"target" : document
	},
//	init : function() {
//		// F2事件的例子
//		casino.Keyevent.actF2(casino.Keyevent.settings, function() {
//			$("form").submit();
//
//		});
//		// 回车事件的例子
//		casino.Keyevent.actENTER(casino.Keyevent.settings, function() {
//			// $("form").submit();
//			casino.Keyevent.enterEvent($("form"));
//		});
//	},
	/**
	 * ESC键事件
	 * 
	 * @param options
	 * @param callback
	 */
	actESC : function(options, callback) {
		shortcut.add("ESC", function() {
			callback.apply(this);
		}, options);
	},
	actENTER : function(options, callback) {
		shortcut.add("Enter", function() {
			callback.apply(this);
		}, options);
	},
	actF2 : function(options, callback) {
		shortcut.add("F2", function() {
			callback.apply(this);
		}, options);
	},
	actF3 : function(options, callback) {
		shortcut.add("F3", function() {
			callback.apply(this);
		}, options);
	},
	actF4 : function(options, callback) {
		shortcut.add("F4", function() {
			callback.apply(this);
		}, options);
	},
	/**
	 * 回车键焦点跳转
	 * 
	 * @param formObj
	 *            表单对象
	 */
	enterEvent : function(formObj) {
		var $form = $(formObj);
		$form.find("input[type=text]").eq(0).focus();
		$(document).on("keydown", "input", function(e) {
			if (event.keyCode == 13) {
				var $this = $(this);
				if ($this.is($form.find("input").last())) {
					$form.sbmit();
				} else {
					event.keyCode = 9;
				}
			}

		});
		// $form.find("input[type=text]").eq(0).focus();
		// $form.on("keydown","input",function(e){
		// var $this = $(this);
		// if(e.keycode==13){
		// $this.next("input")
		// }
		// });
	}
};
