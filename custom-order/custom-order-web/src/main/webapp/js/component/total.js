/**
 * Created by zhangxiao on 14-2-13.
 * @author 张晓
 * @description 提供仓库系统公共组件
 */
if (!window.casino) {
	window.casino = new Object();
};
$(function() {
	casino.store.globalSetUp();
	//casino.store.clearCheckbox();//清除checkbox默认打勾
	casino.store.dbclickCss();//双击表格行添加高亮效果
    var $modal = (".modal");
    if($modal.length>0){
        $(".modal").draggable({ cancel: ".modal-body div,.modal-footer :button,table.table,:input" }).find(".modal-header,.modal-footer").css("cursor","move");
    }
	//输入框长度验证
    $(document).on("keyup", ":input[data-maxlen]", function() {
        var $this = $(this), maxlen = $this.attr("data-maxlen");
        if (maxlen) {
            if ($this.val().length > parseInt(maxlen)) {
                this.setCustomValidity("不能超过"+maxlen+"个字符");
            }else{
                this.setCustomValidity("");
            }
        }
    });
    //针对textarea的验证处理
    $("textarea").change(function(){
        var $this = $(this), regexp = $this.attr("pattern"),value = $this.val(),parent_ui = $this.closest(".textbox_ui");
        if(regexp&&value!=""){
            var bool = new RegExp(regexp).test(value);
            if(!bool){
                var msg = parent_ui.find(".format").html();
                this.setCustomValidity(msg);
            }else{
                this.setCustomValidity("");
            }
        }
    });
    //统一input样式
	//$("input[type='checkbox'],input[type='radio'],input[type='file']").uniform();
});
casino.store = {
	tableSelector : null,
	tableThArr : {},
    tableThObj:[],
	/*
	 * *
	 * 初始化函数，统一调用的函数放在init方法里面
	 */
	init : function() {

		var date = new Date();
		date.setHours(0, 0, 0);
		var today = new Date(date).toISOString().substring(0, 10) + " 00:00:00";

		var date2 = new Date(Math.round(new Date().getTime())
				+ parseInt(86400 * 1000));
		date2.setHours(23, 59, 59);
		var tom = new Date(date2).toISOString().substring(0, 10) + " 23:59:59";
		//时间控件（开始）
		/*起始时间不能大于结束事件，则调用以下时间控件*/
		$(".start").datetimepicker({
			defaultValue : today,
			changeYear : true,
			onSelect : function(dateText, inst) {
				$(".end").datetimepicker("option", "minDate", dateText);
			}
		});
		$(".end").datetimepicker({
			changeYear : true,
			hour : 23,
			minute : 59,
			second : 59,
			defaultValue : tom,
			onSelect : function(dateText, inst) {
				$(".start").datetimepicker("option", "maxDate", dateText);
			}
		});

		casino.store.clickA();//在未登陆的情况下，点击也面中a标签事件
	},
	/**
	 * 选择表格某一行，向上移动
	 */
	Up : function() {
		$.each($("tbody input:checked"), function() {
			var onthis = $(this).closest("tr");
			var getUp = onthis.prev();

			if ($(getUp).has("input").size() == 0) {
				casino.store.infoAlert("info", "顶级元素不能上移");
				return;
			}
			$(onthis).after(getUp);
		});
	},
	/**
	 * 选择表格某一行，向下移动
	 */
	Down : function() {//向下移动表格某一行
		$.each($("tbody input:checked"), function() {
			var onthis = $(this).closest("tr");
			var getdown = onthis.next();
			if ($(getdown).has("input").size() == 0) {
				casino.store.infoAlert("info", "已经到行尾，不能下移");
				return;
			}
			$(getdown).after(onthis);
		});
	},
	/**
	 * 表格全选,方便用户一次选中全部表格行
	 * @param tbody 表格的tbody 
	 */
	checkAllbox : function(table) {//全选表格
		var tbody = $(table).find("tbody");
		var check_all_input = $(table).find("th").eq(0).find(":checkbox");
        var checkboxs = tbody.find("input[type='checkbox']");
		check_all_input.on("click", function() {
//			var checkboxs = tbody.find("input[type='checkbox']");
			if (this.checked) {
				checkboxs.each(function() {
					if (!$(this).attr("disabled")) {
						this.checked = true;
						$(this).closest("span").addClass("checked");//给选择checkbox添加样式
					}
				});
			} else {
				checkboxs.each(function() {
					this.checked = false;
					$(this).closest("span").removeClass("checked");
				});
			}

		});

		var checkebox1 = tbody.find("input[type='checkbox']"), check_len = checkboxs.length;

        checkboxs.each(function() {
					$(this).on("click",function() {
										if (!this.checked) {
											check_all_input.closest("span")
													.removeClass("checked");
											check_all_input[0].checked = false;
										}
										var checked_len = tbody
												.find("input[type='checkbox']:checked").length;
										if (check_len == checked_len) {
											check_all_input.closest("span")
													.addClass("checked");
											check_all_input[0].checked = true;
										}
									});
				});

		/*表格全选*/
	},
	/**
	 * 遍历json数组 展示成表格行
	 * @param selector 表格选择器
	 * @param rows json数组
	 */
	eachJson : function(selector, rows) {
		var $this = $(selector);
		var tr_str = "";
		var $th = $this.find("th");
		if (rows.length) {
			for (var i = 0; i < rows.length; i++) {
                tr_str += "<tr>";
				$.each($th, function(index, key) {
					var $this_th = $(this);
					var input = $this_th.find("input"),
                        input_type = input.attr("type"),
                        name = input.attr("name");
					var key = $this_th.attr("name");

					if ($this_th.attr("index")) {
						tr_str += "<td>" + i+1 + "</td>";
					} else if (input.length) {
						tr_str += "<td><input type='" + input_type + "' name='"
								+ name + "' value='" + rows[i][key] + "' id='"
								+ rows[i][key] + "'/></td>";
					}else if (key == "isActive" || $this_th.attr("bool_str")) {
						if (rows[i][key] == true) {
							tr_str += "<td>" + "是" + "</td>";

						} else if (rows[i][key] == false) {
							tr_str += "<td>" + "否" + "</td>";
						}
					} else if ($this_th.css("display")=="none") {
						tr_str += "<td style='display:none;'>" + rows[i][key]
								+ "</td>";
					} else {
						tr_str += "<td>" + rows[i][key] + "</td>";
					}
				});
                tr_str += "</tr>";
			}

		}else {
            tr_str = '<tr><td colspan="'+ $th.length+ '">没有找到符合条件的数据</td><tr>';
		}

        $this.find("tbody").append(tr_str);
        $this.find("input[type='checkbox'],input[type='radio']").uniform();
        casino.store.checkAllbox($this);
	},
	/**
	 * 遍历json数组 展示成表格行
	 * @param selector 表格选择器
	 * @param rows json数组
	 */
	dataTableInit : function(selector, rows) {
		var $this = $(selector);
		var tr_str = "";
		var $th = $this.find("th");
		if (rows.length) {
			for (var i = 0; i < rows.length; i++) {
                tr_str += "<tr>";
				$.each($th, function(index, key) {
					var $this_th = $(this);
					var input = $this_th.find("input"),
                        input_type = input.attr("type"),
                        name = input.attr("name");
					var key = $this_th.attr("name");
					if ($this_th.attr("index")) {
						tr_str += "<td>" + i + "</td>";
					} else if (input.length) {
						tr_str += "<td><input type='" + input_type + "' name='"
								+ name + "' value='" + rows[i][key] + "' id='"
								+ rows[i][key] + "'/></td>";
					} else if (key == "isActive") {
						if (rows[i][key] == true) {
							tr_str += "<td>" + "是" + "</td>";

						} else if (rows[i][key] == false) {
							tr_str += "<td>" + "否" + "</td>";
						}
					} else {
						tr_str += "<td>" + rows[i][key] + "</td>";
					}
				});
                tr_str += "</tr>";
			}

		}else{
            tr_str = '<tr><td colspan="'+ $th.length+ '">没有找到符合条件的数据</td><tr>';
        }

        $this.find("tbody").append(tr_str);
        $this.find("input[type='checkbox'],input[type='radio']").uniform();
        casino.store.checkAllbox($this);
	},
	/**
	 * 用于不分页的表格数据展示调用
	 * @param selector 表格选择器
	 * @param data_url 请求数据的地址
	 * @param data 传到后台的数据（作为可传参数）
	 * @param json 作为遍历对象数组，（作为可传参数）
     * @param obj 隐藏列,传入数组序列从0开始 保留dom结构 obj = {hideColumns:[1,2,5]}
	 */

    listSearch:function(selector, url, data, json,obj){
        casino.store.clearCheckbox(selector);
        casino.store.removeAlert();
        var $this = $(selector),$first_th = $this.find("th"),default_index=[];
        var input = $first_th.eq(0).find("input"),
            input_type = input.attr("type"), input_name = input.attr("name");
        for (var i = 0; i < $first_th.length; i++) {
            default_index.push(i);
        }
        var tableThObj = casino.store.getTableAttr(selector);
        $this.dataTable({
            "sDom" : "Rt",
            "bPaginate":false,
//            "bRetrieve": true,
            "minResizeWidth":10,
            "allowReorder":false,
            "bAutoWidth" : false,
            "bProcessing" : false,//
            "bFilter" : false,//是否显示搜索框
            "bDestroy": true,
            "bServerSide" : true,
            "bSort" : false,
            "oLanguage" : {//表格插件文字信息
                "sZeroRecords" : "没有找到符合条件的数据",
                "sInfoEmpty" : "没有记录"
            },
            "sAjaxSource" : url,//数据加载地址
            "sAjaxDataProp" : "rows",
            "aoColumnDefs":[
                {
                    "sClass" : "left",
                    "bSortable" : false,
                    "aTargets" : [ 0 ],
                    "fnCreatedCell" : function(nTd, sData, oData, iRow,iCol) {
                        var data_str = "";
                        if (input.length > 0) {
                            data_str = '<input type="' + input_type
                                + '" id="' + sData + '" name="'
                                + input_name + '" value="' + sData
                                + '"/> ';
                            return $(nTd).html(data_str);
                        }
                        if ($first_th.attr("index")) {
                            data_str += iRow + 1;
                            return $(nTd).html(data_str);
                        }else{
                            return sData;
                        }

                    }
                },
                {
                    "aTargets" : default_index,
                    "mRender" : function(data, type, full) {
                        if (data == null) {
                            return "";
                        }
                        if (data.toString() == "true") {
                            return "是";
                        } else if (data.toString() == "false") {
                            return "否";
                        } else {
                            return data;
                        }
                    }
                }
            ],
            "aoColumns" : tableThObj,
            "fnDrawCallback" : function(oSettings) {
                casino.store.clearCheckbox($this);
                return $(this).find(":checkbox,:radio").uniform();
            },
            "fnServerData" : function(sSource, aoData, fnCallback, oSettings) {
//                casino.store.clearTable($this);
                if (json == undefined) {
                    if (data == undefined || data == "") {
                        data = {};
                    }
                    $.ajax({
                        dataType : 'json',
                        type : "POST",
                        url : sSource,
                        data : data,
                        success : function(json) {

                            var tempData = json.resultMap;
                            if (json.success) {
                                fnCallback(tempData);

                                if(obj!=undefined&&obj.hideColumns!=undefined){
                                    var hide_arr = obj.hideColumns;
                                    if(tempData.rows.length>0){
                                        casino.store.hiddenTableColumn($this,hide_arr);
                                    }
                                }
                                casino.store.checkAllbox($this);//选中表格全部行
                                $this.data("tableData",tempData.iTotalDisplayRecords);
                            }else{
                                tempData.iTotalDisplayRecords = 0;
                                tempData.rows = [];
                                fnCallback(tempData);
                            }
                        }
                    });
                }else{
                    var jsonData = {"rows":json};

                    fnCallback(jsonData);

                    if(obj!=undefined&&obj.hideColumns!=undefined){
                        var hide_arr = obj.hideColumns;
                        if(json.length>0){
                            casino.store.hiddenTableColumn($this,hide_arr);
                        }
                    }
                    casino.store.checkAllbox($this);//选中表格全部行
                }

            }
        });
    },


	/**
	 * json字符串转化为json对象
	 * @param o 传入的json字符串
	 * @returns {object} 返回json对象
	 */
	convertArray : function(o) {
		var v = {};
		for ( var i in o) {
			if (typeof (v[o[i].name]) == 'undefined') {
				v[o[i].name] = o[i].value;
			} else {
				v[o[i].name] += "," + o[i].value;
			}
		}
		return v;
	},
	/**
	 * 删除表格选中项
	 * @param selector 表格对象
	 * @param del_url 删除数据的地址
	 * @param data 一个将要被删除的数据标志
	 * @bPagenate 是否显示页码
	 */
	delItem : function(selector, del_url, data,callback) {
		$.ajax({
					type : "POST",
					url : del_url,
					dataType : 'json',
					data : data,
					success : function(out) {
						if (out.success) {
							$(selector).dataTable().fnStandingRedraw(true);//out.resultMap.rows
							casino.store.infoAlert("success", "删除成功！");
                            if(callback!=undefined){
                                callback.apply(this);
                            }

						} else {
							casino.store.infoAlert("warning", "删除失败！"+ out.description);
						}
					},
					error : function() {
						casino.store.infoAlert("warning", "删除失败！");
					}
				});

	},
	/**
	 * 删除表格选中项（针对没有分页的表格）
	 * @param selector 表格对象
	 * @param del_url 删除数据的地址
	 * @param data_url 删除成功后加载表格数据的地址
	 * @param data 加载表格数据所传的参数
	 */
	delNoPageItem : function(selector, del_url, data_url, data,json,obj) {
		$.ajax({
			type : "POST",
			url : del_url,
			dataType : 'json',
			data : data,
			success : function() {
				casino.store.listSearch(selector, data_url, data,json,obj);//out.resultMap.rows
			},
			error : function() {
				casino.store.infoAlert("warning", "删除失败！");
			}
		});
	},
	/**
	 * 点击刷新按钮事件，当前页刷新，在没有点击查询的情况下默认访问第一页的数据
	 * @param selector 被刷新的表格对象
	 * @param url 在没有点击查询是 需指定加载地址
	 * @param hideColumns 隐藏列（作为可传参数）
	 * @bPagenate 是否显示页码getTableData
	 */
	refreshTable : function(selector, url, hideColumns, parameterObj) {
		var $this_table = $(selector);
        casino.store.clearCheckbox(selector);
		var table_data = $this_table.data("tableData");
		if(table_data==undefined){
			casino.store.getTableData(selector, url, hideColumns, parameterObj);
		}else{
			$this_table.dataTable().fnStandingRedraw();
            //casino.store.removeAlert();
		}
	},
	/**
	 * 点击刷新按钮事件，刷新表格数据（针对没有页码的刷新）
	 * @param selector 表格对象
	 * @param data_url 加载表格数据的地址
	 * @param data 加载表格数据要穿的参数
	 */
	refreshNoPageTable : function(selector, data_url, data,json,obj) {
        casino.store.clearCheckbox(selector);
        casino.store.removeAlert();
        casino.store.listSearch(selector, data_url, data,json,obj);
	},
	/**
	 * 将json对象转化为字符串
	 * @param oJson 带传入的json对象
	 * @returns {string} 返回json字符串
	 */
	toJsonString : function(oJson) {
		if (typeof (oJson) == typeof (false)) {
			return oJson;
		}
		if (oJson == null) {
			return "null";
		}
		if (typeof (oJson) == typeof (0))
			return oJson.toString();
		if (typeof (oJson) == typeof ('') || oJson instanceof String) {
			oJson = oJson.toString();
			oJson = oJson.replace(/\r\n/, '\\r\\n');
			oJson = oJson.replace(/\n/, '\\n');
			oJson = oJson.replace(/\"/, '\\"');
			return '"' + oJson + '"';
		}
		if (oJson instanceof Array) {
			var strRet = "[";
			for (var i = 0; i < oJson.length; i++) {
				if (strRet.length > 1)
					strRet += ",";
				strRet += casino.store.toJsonString(oJson[i]);
			}
			strRet += "]";
			return strRet;
		}
		if (typeof (oJson) == typeof ({})) {
			var strRet = "{";
			for ( var p in oJson) {
				if (strRet.length > 1)
					strRet += ",";
				strRet += '"' + p.toString() + '":'
						+ casino.store.toJsonString(oJson[p]);
			}
			strRet += "}";
			return strRet;
		}
	},
	/**
	 * 将给定的json数组填写道对应的表单中
	 * @param form form对象
	 * @param detail_data 被遍历的json对象
	 * @param flag 表单里作为与json键名匹配的标志，id/name
	 */
	eachDataToForm : function(form, detail_data, flag) {
		$(form).find("input,select,span,:checkbox,textarea")
				.each(function() {
							var $target = $(this);
							if (flag == "name") {
								var name = $target.attr("name");
								if (name&& detail_data&& (detail_data[name] != "" || detail_data[name] != null)) {
                                var name_data = detail_data[name];
									$target.closest(".textbox_ui").removeClass("error_ui");
									if ($target.is(":checkbox")) {
										if (name_data == 1) {
											$target[0].checked = true;
											$target.closest("span").addClass("checked");
										} else {
											$target[0].checked = false;
											$target.closest("span").removeClass("checked");
										}
									}else if($target.is(":radio")){
                                          if($target.val()==name_data){
                                              $target[0].checked = true;
                                              $target.closest("span").addClass("checked");
                                          }
                                    }else if ($target.is("select")) {
                                        $target.val(name_data);
									} else if ($target.is("span")&& $target.children("input").length == 0) {
										$target.text(name_data);
									} else {
										if ($target.hasClass('disable')) {
											$target.val(name_data);
											$target.prop("disabled", true);
										} else {
											$target.val(name_data);
										}

									}
								} else {
									if ($target.is(":checkbox")) {
										$target.attr("checked", false);
									} else if ($target.is("span")
											&& $target.children("input").length == 0) {
										$target.text("");
									} else {
										$target.val("");
									}
								}
							} else {
								var id = $target.attr("id");
								if (id&& detail_data&& (detail_data[id] != "" || detail_data[id] != null)) {
                                    var id_data = detail_data[id];
									$target.closest(".textbox_ui").removeClass("error_ui");
									if ($target.is(":checkbox")) {
										if (id_data == 1) {
											$target[0].checked = true;
											$target.closest("span").addClass("checked");
										} else {
											$target[0].checked = false;
											$target.closest("span").removeClass("checked");
										}
									}else if($target.is(":radio")){
                                        if($target.val()==id_data){
                                            $target[0].checked = true;
                                            $target.closest("span").addClass("checked");
                                        }
                                    } else if ($target.is("select")) {
										$target.val(id_data);
									} else if ($target.is("span")
											&& $target.children("input").length == 0) {
										$target.text(id_data);
									} else {
										if ($target.hasClass('disable')) {
											$(this).val(id_data);
											$target.prop("disabled", true);
										} else {
											$target.val(id_data);
										}

									}
								}
							}

						});
	},
	/**
	 * 在列表页双击某一行表格数据，跳转到内容页，并将该条信息的详细内容展示出来
	 * @param form 内容页将要展示数据的form表单
	 * @param detail_url 后台接收某行数据ID的url
	 * @param checked_item 某一条数据的ID
	 * @param selector 内容页的表格对象
	 * @param callback 回调函数
	 */
	showItemDetail : function(form, detail_url, checked_item, selector,callback,obj) {
        casino.store.removeAlert();
		$.ajax({
					type : "POST",
					url : detail_url,
					dataType : 'json',
					data : {
						id : checked_item
					},
					success : function(out) {

						var detail_data = out.resultMap.rows, tableData = out.resultMap.details;
						$("[href=#content]").click();
						casino.store.eachDataToForm(form, detail_data, "name");

						if (tableData != undefined && selector != undefined) {
                            if(obj!=undefined&&obj.hideColumns!=undefined){
                                casino.store.listSearch(selector, detail_url, {
                                    id : checked_item
                                }, tableData,obj);
                            }else{
                                casino.store.listSearch(selector, detail_url, {
                                    id : checked_item
                                }, tableData);
                            }

						}
						if (callback != undefined) {
                            callback.call(this,out);
						}
					}
				});

	},
	/**
	 * 同上个函数类似，该函数针对内容页下面的表格有分页的做处理
	 */
	showPagenateItemDetail : function(form, detail_url, checked_item) {
        casino.store.removeAlert();
		$.ajax({
			type : "POST",
			url : detail_url,
			dataType : 'json',
			data : {
				id : checked_item
			},
			success : function(out) {
				var detail_data = out.resultMap.details;
//					tableData = out.resultMap;
				$("#myTab [href=#content]").click();
				casino.store.eachDataToForm(form, detail_data, "name");
			}
		});
	},
	/**
	 * 清除checkbox被选中的缓存
	 */
	clearCheckbox : function(table) {
        var checkbox;
        if(table==undefined){
          checkbox = $("input[type=checkbox]");
        }else{
           checkbox = $(table).find("input[type=checkbox]");
        }
        checkbox.prop("checked", false);
        checkbox.closest("span").removeClass("checked");
	},
	/**
	 * 获取表但数据，包括text、radio、checkbox、hidden、select
	 * @param form 表单对象
	 * @returns {object} 返回对象数据，obj[name]=value name为表单input、select的name值，需与后台接收数据字段名一致
	 */
	getFormVal : function(form) {
		var $form = $(form), $input = $form.find("input,select,:checkbox");
		var obj = {};

		$input.each(function() {
			var $target = $(this);
			if (!$target.hasClass("checkAll")) {
				var name = $target.attr("name"), value = $target.val();

				if (!obj[name] || obj[name] == []) {
					obj[name] = [];
				}

				if ($target.is(":checkbox")) {
					if ($target[0].checked == true) {
						obj[name].push(value);
					}
				} else {
					obj[name].push(value);
				}
			}
		});
		return obj;
	},
	/**
	 * 键盘事件，针对弹出层按回车键和ESC键执行的操作
	 * @param obj
	 * @param callback
	 */
	keyDownEvent : function(obj,is_enter_hide) {
		if (obj.is(":visible")) {
            var obj_btn = obj.find("button.ok_btn"),
                btn_cancel = obj.find("button.close_modal_btn");
			$(document).off("keydown").on("keydown",function(event) {
                var event = event ? event :window.event;
                obj_btn.focus();
				switch (event.keyCode) {
				case 13:
                    event.preventDefault();
                    event.stopPropagation();
                    if(is_enter_hide){
                        casino.store.playSystemVoice("danger.mp3");
                    }else{
                        obj_btn.click();
                    }
					break;
				case 27:
                    event.preventDefault();
					btn_cancel.click();
					break;
				}
			});
		}

	},
	/**
	 * 统一confirm弹出层
	 * @param str 提示的内容信息
	 * @param callback 回调函数
	 */
	infoComfirm : function(str, callback,en_hide) {
		casino.store.playSystemVoice();
		var content = "<div class='modal Comfirm'>"
				+ "<div class='modal-header'>"
				+ "<button type='button' class='close close_modal_btn' data-dismiss='modal' aria-hidden='true'>×</button>"
				+ "</div>"
				+ "<div class='modal-body'>"
				+ str
				+ "</div>"
				+ "<div class='modal-footer'>"
                +"<div><button class='btn btn-primary ok_btn' id='modal_sure' data-dismiss='modal' aria-hidden='true'>确定</button>"
                +"<button class='btn btn-primary cancel_btn' data-dismiss='modal' aria-hidden='true'>取消</button></div>"
                +"</div>"
				+ "</div>";
        var $backdrop = $("body").find(".modal-backdrop");
        if($(".Comfirm").is(":visible")){
            $backdrop.eq(0).remove();
        }
        $("body").find(".Comfirm").remove();
		$("body").append(content);
		$(".Comfirm").modal({
			backdrop : true,
			show : true
		});
        $(".Comfirm").draggable({ cancel: ".modal-footer div" }).find(".modal-header,.modal-footer").css("cursor","move");
		$("body").undelegate("click").delegate("#modal_sure", "click", function() {
			if (callback != undefined && typeof callback == 'function') {
					callback.apply(this);
			}
			$(document).off("keydown");
		});
        $("body").delegate(".close_modal_btn","click",function(){
            $("body").undelegate("click");
            $(document).off("keydown");
        });
        $("body").delegate("button.cancel_btn","click",function(){
            $("body").undelegate("click");
            $(document).off("keydown");
        });
		if(en_hide){
            casino.store.keyDownEvent($(".Comfirm"),en_hide);
        }else{
            casino.store.keyDownEvent($(".Comfirm"));
        }
	},

    removeAlert:function(){
        var infoCon = $("body");
        infoCon.find(".alertMsg").not(".alertMsg-success").remove();
    },
	/**
	 * 统一弹出框提示
	 * @param str 提示的内容信息
	 */
	infoMsg : function(str, callback,en_hide) {
		casino.store.playSystemVoice("danger.mp3");
		var content = "<div class='modal infoMsg'>"
				+ "<div class='modal-header'>"
				+ "<button type='button' class='close close_modal_btn' data-dismiss='modal' aria-hidden='true'>×</button>"
				+ "</div>"
				+ "<div class='modal-body'>"
				+ str
				+ "</div>"
				+ "<div class='modal-footer'>"
                +"<div><button id='modal_infoMsg' class='btn btn-primary ok_btn' data-dismiss='modal' aria-hidden='true'>确定</button></div>"
                +"</div>"
				+ "</div>";
        var $backdrop = $("body").find(".modal-backdrop");
        if($(".infoMsg").is(":visible")){
            $backdrop.eq(0).remove();
        }
		$("body").find(".infoMsg").remove();
		$("body").append(content);
		$(".infoMsg").modal({
			backdrop : true,
			show : true
		});
        $(".infoMsg").draggable({ cancel: ".modal-footer div" }).find(".modal-header,.modal-footer").css("cursor","move");
		$("body").undelegate("click").delegate("#modal_infoMsg", "click", function(e) {
			if (callback != undefined && typeof callback == 'function') {
					timer = setTimeout(function() {
						callback.apply(this);
					}, 300);

			}
//            $("body").undelegate();
			$(document).off("keydown");
		});
        $("body").delegate(".close_modal_btn","click",function(){
            if (callback != undefined && typeof callback == 'function') {
                timer = setTimeout(function() {
                    callback.apply(this);
                }, 300);

            }
            $("body").undelegate("click");
            $(document).off("keydown");
        });
        if(en_hide){
            casino.store.keyDownEvent($(".infoMsg"),en_hide);
        }else{
            casino.store.keyDownEvent($(".infoMsg"));
        }
	},
	/**
	 * 双击表格行，添加高亮效果
	 */
	dbclickCss : function() {
		var tbody = $(".table tbody");
		tbody.on("dblclick", "tr", function() {
			tbody.find("tr").removeClass("dbclick");
			$(this).addClass("dbclick");
		});
	},
	/**
	 * 判断用户是否登录，否，则弹出登陆框
	 */
	isLogin : function() {
		var loginCon = "<div class='modal loginDialog' style='width:402px;display:block;'>"
				+ "<div class='modal-header' style='display: none;'>"
				+ "<button type='button' class='close parent_clocse' data-dismiss='modal' aria-hidden='true'>×</button>"
				+ "</div>"
				+ "<div class='modal-body'><iframe scrolling='no' src='"
				+ contextPath + "/login'></iframe></div>" + "</div>";
		$("body").find(".loginDialog").remove();
        $("body").find(".modal-backdrop").remove();
		$("body").append(loginCon);
		$(".loginDialog").modal({
			backdrop : true,
			show : true
		});
        $(".loginDialog").draggable({ cancel: ".modal-body div,table.table,:input" }).find(".modal-header,.modal-footer").css("cursor","move");
	},
	/**
	 * ajax全局设置
	 */
	globalSetUp : function(e) {
		$.ajaxSetup({
			global : true,
			traditional : true,
			cache : false,
			ifModified : true,
			dataType : "json",
			beforeSend : function() {
				$.blockUI({
					message : '<p>&nbsp;<img src="' + contextPath
							+ '/css/images/loading.gif">loading...</p>'
				});
			},
			complete : function() {
				$.unblockUI();
			},
			statusCode : {
				401 : function(e) {
					$.unblockUI();
					casino.store.isLogin();
				},
                403 : function(){
                    var tmpstr="<p>您访问的url:&nbsp;&nbsp;"+this.url+"</p><br><br><p>权限不足，请联系管理员！</p>";
                    casino.store.infoMsg(tmpstr);
                }
			}
		});
	},
	/**
	 * 针对a标签的请求未登陆状态处理
	 * @param callback 回调函数 
	 */
	isloginA : function(callback) {
		$.ajax({
			success : function() {
				if (callback != undefined) {
					if (typeof callback == 'function') {
						callback.apply(this);
					}
				}
			}
		});
	},
	/**
	 * 获取给定数组在已知数组中的位置
	 * @param arr1 已知数组
	 * @param arr2 给定数组（作为参数传入）
	 * @returns {Array} 返回位置数组
	 */
	getHideIndex : function(arr1, arr2) {
		var index_arr = [];
		$.each(arr2, function(i, k) {
			var index = $.inArray(k, arr1);
			index_arr.push(index);
		});
		return index_arr;
	},
	/**
	 * 获取表头要展示数据的字段
	 * @param selector 选择表格对象的一个选择符
	 * @returns {Array}  返回一个对象。用于要展示的字段
	 */
	getTableAttr : function(selector) {
		var $this = $(selector), arr = [];
		var th = $this.find("th");
		th.each(function() {
			var obj = {};
			obj["mData"] = $(this).attr("name");
			arr.push(obj);
		});
		return arr;
	},
	/**
	 * 获取表头th的name属性，并返回数组
	 * @param selector
	 * @returns {Array}
	 */
	arrTh : function(selector) {
		var array = [], $this = $(selector), $th = $this.find("th");
		$th.each(function(){
					array.push($(this).attr("name"));
				});
				return array;
		},
    commonTableOptions:{
		"sDom" : 'Rrt<"bottom"ilp>',
		"sPaginationType" : "bootstrap",//bootstrap分页风格
        "minResizeWidth":10,
        "allowReorder":false,
		"bAutoWidth" : false,
		"bProcessing" : false,
		"bFilter" : false,//是否显示搜索框
		"oLanguage" : {//表格插件文字信息
            "sProcessing" : "正在获取数据，loading...",
			"sLengthMenu" : "每页显示 _MENU_条",
			"sZeroRecords" : "没有找到符合条件的数据",
            "sInfoThousands": " ",
			"sInfo" : "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条(共<b class='total_page'>_TOTALPAGE_</b>页)",
			"sInfoEmpty" : "没有记录",
			"sInfoFiltered" : "", //(从 _MAX_ 条记录中过滤)
//            "sInfoFiltered" : "(共显示 _MAX_ 条数据)",
			"sSearch" : " ",
			"oPaginate" : {
				"sFirst" : "首页",
				"sPrevious" : "上一页",
				"sNext" : "下一页",
				"sLast" : "尾页"
			}
		},
		"bDestroy" : true,
		"bServerSide" : true,
		"sAjaxDataProp" : "rows",
		"bDeferRender" : true
	},
	/**
	 * 展示表格数据
	 * @param selector 选择表格对象的一个选择符
	 * @param url 加载数据的URL
	 * @param hideColumns 隐藏列序号，表格列关键字数组(作为可传参数) 该参数是用于直接删除Dom结构的,不保留隐藏列
	 * @param parameterObj 对象参数，例如:obj{searchForm:$("form"),pagenate:true,}
     * parameterObj = {hideColumn:[2,3,5,9]} 从0开始,如果隐藏某列只需display:none，则如左边传入第四个参数
     * parameterObj = {defaultSort: [[2,'asc'], [3,'desc']]} ,注：默认排序的值是个二维数组，第一个值是要排序的序列，从0开始，第二个值是升序还是降序。
	 */
	getTableData : function(selector, url, hideColumns, parameterObj) {
        casino.store.removeAlert();
		var $this = $(selector);
		var flag = true, index_arry = [], default_index = [],table_obj = {};
        table_obj = casino.store.getTableAttr(selector);
		if (hideColumns != undefined && hideColumns.length != 0) {
            var $table = casino.store.tableThArr[selector];
			if (!$table) {
				casino.store.tableSelector = casino.store.arrTh(selector);
                casino.store.tableThObj = casino.store.tableThArr[selector] = table_obj;
			}else{
                casino.store.tableThObj = casino.store.tableThArr[selector];
            }
			flag = false;
			index_arry = casino.store.getHideIndex(casino.store.tableSelector,hideColumns);
		}else {
            casino.store.tableThObj =  table_obj;
		}
		var $first_th = $this.find("th"), input = $first_th.eq(0).find("input"),
            input_type = input.attr("type"), input_name = input.attr("name");
		for (var i = 0; i < $first_th.length; i++) {
			default_index.push(i);
		}
        var default_sort = [ [ 1, "desc" ] ];
        if(parameterObj&&parameterObj.defaultSort){
            default_sort = parameterObj.defaultSort;
        }
		var tableOptions = this.commonTableOptions, thisTableOptions = {
            "aaSorting" : default_sort,//设置某个元素为默认排序
			"sAjaxSource" : url,//数据加载地址
			"aoColumnDefs" : [
					{
						"sClass" : "left",
						"bSortable" : false,
						"aTargets" : [ 0 ],
						"fnCreatedCell" : function(nTd, sData, oData, iRow,iCol) {
							var data_str = "";
							if (input.length > 0) {
								var disable = oData['checkBoxDisabled'] == true ? ' disabled="true"': '';
								 data_str = '<input type="' + input_type
										+ '" id="' + sData + '" name="'
										+ input_name + '" value="' + sData
										+ '"' + disable + ' /> ';
								 return $(nTd).html(data_str);
							}
							if ($first_th.attr("flag") == "index") {
								data_str += iRow + 1;
								return $(nTd).html(data_str);
							}else{
								return sData;
							}
							
						}
					},{
                    "sClass" : "left",
                    "bSortable" : true,
                    "aTargets" : [ 1 ]
                },{
						"bVisible" : flag,
						"aTargets" : index_arry
					}, {
						"aTargets" : default_index,
						"mRender" : function(data, type, full) {
							if (data == null) {
								return "";
							}
							if (data.toString() == "true") {
								return "是";
							} else if (data.toString() == "false") {
								return "否";
							} else {
								return data;
							}
						}
					} ],
			"aoColumns" :casino.store.tableThObj,
			"fnDrawCallback" : function(oSettings) {
                casino.store.clearCheckbox($this);
				return $this.find(":checkbox,:radio").uniform();
			},
			"fnServerData" : function(sSource, aoData, fnCallback, oSettings) {
				var oPaging = oSettings.oInstance.fnPagingInfo(), curr_page = oPaging.iPage + 1;
				var obj = {
					page : curr_page,
					pagesize : (aoData[4].value)
				};
				var $form = null;
				if (parameterObj != undefined && parameterObj.pagenate) {
					fnCallback(parameterObj.json);
					casino.store.checkAllbox($this);
				} else {
					if (parameterObj != undefined&& parameterObj.searchForm != undefined) {
						var searchForm = parameterObj.searchForm;
						$form = $(searchForm);
					} else {
						if ($this.closest(".tab-pane").is("#list")) {
							$form = $("form[name=search_form]");
						}
						$.extend(obj, parameterObj);
					}

					if ($form != null) {
						var input_obj = $form.find("input,select");
						$.each(input_obj, function(index, key) {
							var $this = $(this), name = $this.attr("name");
							if ($this.is(":checkbox")) {
								obj[name] = $this.closest("span").hasClass("checked");
							} else if ($this.is(":radio")) {
                                if($this[0].checked){
                                    obj[name] = $this.val();
                                }
                            } else {
								obj[name] = $this.val();
							}
						});
					}
					//*******处理排序
					if (oSettings && oSettings.aaSorting
							&& oSettings.aaSorting.length > 0
							&& oSettings.aaSorting[0]
							&& oSettings.aaSorting[0].length > 0) {
						var sortFieldIndex = oSettings.aaSorting[0][0];
						var orderType = oSettings.aaSorting[0][1];
//						var orderBy = casino.store.tableThObj[sortFieldIndex].mData;
						var orderBy = table_obj[sortFieldIndex].mData;
						if (orderType && orderBy) {
							obj["order_by"] = orderBy;
							obj["order_type"] = orderType;
						}
					}
					//*******
					$.ajax({
						dataType : 'json',
						type : "POST",
						url : sSource,
						data : obj,
						success : function(json) {

							if ($this.closest(".tab-pane").is("#list")) {
								$("[href=#list]").click();
							}
                            var tempData = json.resultMap;
                            if (json.success) {
								fnCallback(tempData);

                                    if (parameterObj != undefined&& parameterObj.hideColumn != undefined) {
                                        var index_arr =  parameterObj.hideColumn;
                                        if(tempData.rows.length>0){
                                            casino.store.hiddenTableColumn($this,index_arr);
                                        }

                                    }

								casino.store.checkAllbox($this);//选中表格全部行
								$this.attr("data_size", tempData.iTotalDisplayRecords);
								$this.data("tableData",tempData.iTotalDisplayRecords);
							}else{
                                tempData.iTotalDisplayRecords = 0;
                                tempData.rows = [];
                                fnCallback(tempData);
                            }
						}
					});

				}

			}
		};
		$.extend(tableOptions, thisTableOptions);
		$(selector).dataTable(tableOptions);
	},
	/**
	 * 点击内容页的某个查询按钮事件，弹出弹出层,弹出层中是iframe
	 * @param search_url
	 */
	btnSearch : function(search_url) {
		casino.store.isloginA(function() {
					var $dialog = '<div class="modal diframe_Modal">'
							+ '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button></div>'
							+ '<div class="modal-body"><iframe id="table_iframe" src="'+ search_url + '"></ iframe></div></div>';
					$("body").find(".diframe_Modal").remove();
					$("body").append($dialog);
					$(".diframe_Modal").modal({
						backdrop : true,
						show : true
					});
                    $(".diframe_Modal").draggable({ cancel: ".modal-body div,table.table,:input" }).find(".modal-header,.modal-footer").css("cursor","move");
                    $("#table_iframe").perfectScrollbar();
				});

	},
	/**
	 * 获取选取的表格行的内容，返回json对象
	 * @param $th 序列号大于0的th
	 * @param $row 双击选择的表格行
	 * @returns {obj} obj[name] = $tds.eq(index).html();name为th的name，与后台返回数据的字段名一一对应
	 */
	getSelectedRowData : function($th, $row) {
		var $input = $row.find("td").eq(0).find("input");
		var $tds,data = {};
		if($input.length>0){
			$tds = $row.children(':gt(0)');			
		}else{
			$tds = $row.children('td');
		}
		data.id = $row.find(':checkbox:first').val();
		$th.each(function(index, th) {
			data[$(this).attr("name")] = $tds.eq(index).html();
		});
		return data;
	},
	/**
	 * 双击表格行 将该行的数据一一放入对应的表单项中
	 * @param form 将要赋值的表单对象
	 * @param $th 表格的表头 $th = $(table).find("th:gt(0)");
	 * @param $tr 被选中的行
	 */
	iframeDblclick : function(form, $th, $tr) {
		var parentForm = $(form, window.parent.document);
		var tr_data = casino.store.getSelectedRowData($th, $tr);
		casino.store.eachDataToForm(parentForm, tr_data, "id");
		/**双击iframe里面表格行 在父页面的form变淡填充数据 调用方法如下
		 * casino.store.iframeDblclick(".text_form",$th,$tr);
		 * 第一个参数是父页面的form，第二个参数是iframe里面的表格表头，表格行
		 * */
	},
	/**
	 * 在未登陆的情况下，点击也面中a标签事件
	 * 如果超链接(类似<a></a>)必须在登陆情况下才能条状就必须按照这样写超链接，<a href="javascript:void(0);" url=""></a>
	 */
	clickA : function() {
		var $a = $("a"), url = $a.attr("url");
		$a.click(function(e) {
			if (url != undefined && url != null) {
				e.preventDefault();
				casino.store.isloginA(function() {
					window.location = url;
				});
				return false;
			}
		});
	},
	/**
	 * 清空表格列表
	 * @param table 表格对象，例如：$("#table")
	 */
	clearTable : function(table) {
		var $table = $(table);
		$table.find("tbody").empty();
	},
	/**
	 * 阻止事件(包括冒泡和默认行为)
	 * @param e 事件对象
	 */
	stopEvent : function(e) {
		e = e || window.event;
		if (e.preventDefault) {
			//			      e.preventDefault();//阻止默认事件
			e.stopPropagation();//阻止冒泡事件
		} else {
			//			      e.returnValue = false;//阻止默认事件,IE
			e.cancelBubble = true;//阻止冒泡事件,IE
		}
	},
	/**
	 * 阻止默认事件，兼容IE
	 * @param e 事件对象
	 */
	stopDefaultEvent : function(e) {
		e = e || window.event;
		if (e.preventDefault) {
			e.preventDefault();//阻止默认事件
		} else {
			e.returnValue = false;//阻止默认事件
		}
		return false;
	},
	/**
	 * 隐藏某一列，但是DOM存在
	 * @param table 表格对象
	 * @param hideColumn 隐藏列字段，与表头th的name一致
	 */
	hiddenTableColumn : function(table, hideColumn) {
		var $table = $(table), $th = $table.find("th"), $tr = $table.find("tbody").find("tr");
		for (var i = 0; i < hideColumn.length; i++) {
			$th.eq(hideColumn[i]).hide();
			$tr.each(function() {
				var $this = $(this);
				$this.find("td").eq(hideColumn[i]).hide();
			});
		}

	},
	/**
	 * 系统提示音
	 */
	playSystemVoice : function(voice_type) {
		var $body = $('body'),audio = "";
		$body.find('audio').remove();
        if(voice_type){
            audio = '<audio autoplay="autoplay"><source src="' + contextPath+ '/js/component/'+voice_type+'" type="audio/mpeg"/></audio>';
        }else{
            audio = '<audio autoplay="autoplay"><source src="' + contextPath+ '/js/component/intro.mp3" type="audio/mpeg"/></audio>';
        }
		//              $body.append('<embed src="'+contextPath+'/js/component/intro.mp3" autostart="true" loop="false" volume="50">');
		$body.append(audio);
	},
    /**
     * 统一顶部提示信息 bootatrap-alert
     * @param type 提示信息的类型 包括 success/info/warning/danger
     * success(绿色)  info(蓝色)  warning(黄色)  danger(红色)
     * @param info 提示的具体信息
     */
    /**
     * 顶部提示信息新样式
     */
    infoAlert : function(type, info,container){
        var infotitle,infoclass,picname,infodetail, alertStr;
        switch (type){
            case 'success' :
            case 'J000000' : infotitle = '成功：';
                infoclass = 'success';
                picname = 'icon-success';
                break;
            case 'warning' :
            case 'J000997' : infotitle = '提示：';
                infoclass = 'warning';
                picname = 'icon-warning';
                break;
            case 'info'    :
            case 'J000998' : infotitle = '提示：';
                infoclass = 'work';
                picname = 'icon-ooop';
                break;
            case 'danger'   :
            case 'J000999'  : infotitle = '错误：';
                infoclass = 'system';
                picname = 'icon-error';
                break;
            default : infotitle = '提示：';
                infoclass = 'success';
                picname = 'icon-success';
        }

        if(type=='J000998'||type=='J000999'){
            var tipmessage;
            if(type=='J000998'){
                tipmessage = '抱歉，系统异常，请与管理员联系';
            }else{
                tipmessage = '抱歉，系统故障，请与管理员联系';
            }
            alertStr = "<div class='alertMsg alertMsg-"
                +infoclass
                + "'><div class='alert alert-dismissable clearfix alert-"
                + infoclass
                + "'><div class='iconwrap'>"
                + "<img src="
                + contextPath
                + "/img/"+picname+".png width=35/>"
                + "</div>"
                + "<div class='textwrap'>"
                + "<p class='alert-title'>"
                +infotitle
                +"</p>"
                + "<div class='alert-text'>"+tipmessage+"<u class='seedetail'>查看详情</u></div>"
                + "</div>"
                + "<div class='errorinfo'>"+info+"</div>"
                + '<div type="button" class="close" data-dismiss="alert">&times;</div>'
                + "</div> "
                + "</div>";
        }else{
            alertStr = "<div class='alertMsg alertMsg-"
                +infoclass
                + "'><div class='alert alert-dismissable clearfix alert-"
                + infoclass
                + "'><div class='iconwrap'>"
                + "<img src="
                + contextPath
                + "/img/"+picname+".png width=35/>"
                + "</div>"
                + "<div class='textwrap'>"
                + "<p class='alert-title'>"
                +infotitle
                +"</p>"
                + "<div class='alert-text'>"+info+"</div>"
                + "</div>"
                + '<div type="button" class="close" data-dismiss="alert">&times;</div>'
                + "</div> "
                + "</div>";
        }


        var infoCon,tab = $("#myTab"), tab_len = tab.length;
        if(container!==undefined){
            infoCon = $(container);
        }else{
            if(tab_len > 0){
                var current_tab = tab.find("li.active"),panel_id = current_tab.find("a").attr("href");
                infoCon = $(panel_id);
            } else{
                infoCon = $("body");
            }
        }

        infoCon.children(".alertMsg").remove();
        infoCon.prepend(alertStr);
        if (type == "success"|| type == "J000000") {
            setTimeout(function() {
                $("body").find(".alertMsg").hide("slow");
            }, 3000);
        }

        $('.seedetail').each(function(){
            var self = $(this);
            if(!($._data(self[0],"events")&&$._data(self[0],"events")["click"])){
                self.click(function(){
                    var errorinfo =self.closest('.textwrap').next();
                    var seedetail =$(this);
                    if(errorinfo.is(':hidden')){
                        errorinfo.slideDown();
                        seedetail.html('收起详情');
                    }else{
                        errorinfo.slideUp();
                        seedetail.html('查看详情');
                    }
                })
            }
        });
    }
};//casino.store end

/*ajax请求框架*/
var ajaxRequire=["url","async","dataType","type","param"];//必须参数

$.extend({
	BaseController:{
		send:function(arg){
			var viable = $.BaseController.paramVilidate(arg);
			if(!viable){//未通过验证
				return;
			}
			var baseAJAX = {
					url:arg["url"],
					type:arg["type"],
					data:arg["param"],
					dataType:arg["dataType"],
					success:function(res){
						if(res.status==true){
							if(arg["success"]){
								arg["success"].call(null,res);
							}
							$("body").find(".alertMsg").hide();
						}else{
							if(arg["error"]){
								arg["error"].call(null,res);
							}else{
								//casino.store.infoAlert(res.code,res.description);
							}
						}
					}
				};
			if(arg["beforeSend"]){
				baseAJAX.beforeSend = arg["beforeSend"]; 
			}
			$.ajax(baseAJAX);
		},
		paramVilidate:function(arg){ //请求补全
			for(var index in ajaxRequire){
				var key = ajaxRequire[index];
				if(!arg[key]){
					switch(key){
						case "url":
							return false;
							break;
						case "async":
							arg[key] = true;
							break;
						case "dataType":
							arg[key] = "json";
							break;
						case "type":
							arg[key] = "post";
							break;
						case "param":
							arg[key] = {};
							break;
					}
					
				}
			}
			return true;
		},
		getFormData:function(formContainer){
			var data = {};
            $(formContainer).find('textarea,input,select,label.param').each(function () {
                var name = $(this).attr('name');
                if (!name) {
                    return;
                }
                if ($(this).is(':checkbox')) {
                	var value = $(this).val()!='on'?(this.checked?$(this).val():null):(this.checked?1:0);
                	if(value!=null){
                		if(data[name]){
                    		data[name] += ","+value;
                    	}else{
                    		data[name] = value;
                    	}
                	}
                } else if ($(this).is('select[multiple]')) {
                    var valueArr = [];
                    $(this).find('option').each(function(){
                        if(this.selected){
                            valueArr.push(this.value);
                        }
                    });
                    data[name] = valueArr.join(',');
                } else if($(this).is('label')){
                	data[name] = $(this).text();
                } else {
                    data[name] = $(this).val();
                }
            });
            return data;
		},
		cleanFormContent:function($formContainer){
			$($formContainer).find("textarea,input,select,label.param").each(function(){
				var self = $(this);
				if(self.is("input[type='text']")){
					self.val("");
				}else if(self.is(":checkbox")){
					this.checked=false;
					self.closest("span").removeClass("checked");
				}else if(self.is("select")){
					this.selectedIndex=0;
				}else if(self.is("span")){
					self.text("");
				}else if(self.is("input[type='hidden']")){
					self.val("");
				}else if(self.is("label")){
					self.text("");
				}
				if(self.attr("uneditable")){
					self.attr("disabled",false);
				}
			});
		},
		deleteData:function($dataContainerList,deleteUrl,option){
			var defaultOption = {idKey:"ids"};
			$.extend(defaultOption,option);
			if (option.beforeDelete) {
				option.beforeDelete();
	        }
	        
	        var ids = [];
	        $dataContainerList.each(function () {
	            ids[ids.length] = $(this).val();
	        });
	        if (ids.length == 0) {
	        	$.BaseController.infoAlert("请选择要删除的数据","warning");
	            return;
	        }
	        
	        var param = {};
	        param[defaultOption.idKey] = ids.join(",");
	        if(defaultOption.param){
	        	for(var key in defaultOption.param){
	        		param[key] = defaultOption.param[key];
	        	}
	        }
	        casino.store.infoComfirm("确定删除?",function(){
	        	$.BaseController.send({url:deleteUrl,success:function(result){
	        		if (result.success) {
	        			$.BaseController.infoAlert("删除成功");
	                    if(option.afterDelete)option.afterDelete();
	        		}else{
	        			$.BaseController.infoAlert(result.description,result.resultCode);
	        		}
				},param:param});
	        });
		},
		infoAlert:function(message,type){
			if(!type){
	                type = "success";
            }
            casino.store.infoAlert(type,message);
		}
	}	
});
$.extend({
	createPage:function(currentPage,total){
		var pageContent ="";
		if(currentPage-5>=1)pageContent+="<a href='javascript:void(0)' class='page_item noton' param=''>"+(currentPage-5)+"</a>";
		if(currentPage-4>=1)pageContent+="<a href='javascript:void(0)' class='page_item noton' param=''>"+(currentPage-4)+"</a>";
		if(currentPage-3>=1)pageContent+="<a href='javascript:void(0)' class='page_item noton' param=''>"+(currentPage-3)+"</a>";
		if(currentPage-2>=1)pageContent+="<a href='javascript:void(0)' class='page_item noton' param=''>"+(currentPage-2)+"</a>";
		if(currentPage-1>=1)pageContent+="<a href='javascript:void(0)' class='page_item noton' param=''>"+(currentPage-1)+"</a>";
		pageContent+="<a href='javascript:void(0)' class='page_item on' param=''>"+currentPage+"</a>";
		if(currentPage+1<=total)pageContent+="<a href='javascript:void(0)' class='page_item noton' param=''>"+(currentPage+1)+"</a>";
		if(currentPage+2<=total)pageContent+="<a href='javascript:void(0)' class='page_item noton' param=''>"+(currentPage+2)+"</a>";
		if(currentPage+3<=total)pageContent+="<a href='javascript:void(0)' class='page_item noton' param=''>"+(currentPage+3)+"</a>";
		if(currentPage+4<=total)pageContent+="<a href='javascript:void(0)' class='page_item noton' param=''>"+(currentPage+4)+"</a>";
		if(currentPage+5<=total)pageContent+="<a href='javascript:void(0)' class='page_item noton' param=''>"+(currentPage+5)+"</a>";
		return pageContent;
	}
});
