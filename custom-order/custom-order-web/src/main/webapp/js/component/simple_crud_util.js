/**
 * Created by chenggui.huang
 *
 * 基本的增删改查js封装
 */
if (!window.casino) {
    window.casino = new Object();
}
;
casino.simpleCrud = {
    settings: {
        baseUrl: function () {
            return window.location.pathname.replace(/\/\w+(\.do)?(\?\S*)?$/, '');
        }, getUrl: function (path) {
            return this.baseUrl() + "/" + path ;
        }, onEdit: function (result) {
            if (result.success) {
                casino.simpleCrud.setFormContent($("#content form[name='content_form']"), result.resultMap.entity);
                $("#tab_content_head").click();
            } else {
                casino.simpleCrud.settings.showPrompt(result.description,result.resultCode);
            }
        }, beforeSave: function () {
            return true;
        }, afterSave: function (result) {
            if (result.success) {
                casino.simpleCrud.setFormContent($("#content form[name='content_form']"), result.resultMap.entity);
                $(casino.simpleCrud.settings.contentForm).find('[uneditable]').each(function () {
                    $(this).attr('disabled', true);
                });
                casino.simpleCrud.settings.showPrompt("保存成功","success");
            } else {
                casino.simpleCrud.settings.showPrompt(result.description,result.resultCode);
            }
        }, getSaveData: function () {
            var data = {};
            $('#content_form').find('textarea,input,select').each(function () {
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
                } else {
                    data[name] = $(this).val();
                }
            });
            return data;
        }, beforeDelete: function () {
            return true;
        }, afterDelete: function (result) {
            if (result.success) {
                $(casino.simpleCrud.settings.dataListTable).dataTable().fnStandingRedraw(true) ;
                casino.simpleCrud.settings.showPrompt("删除成功","success");
            } else {
                casino.simpleCrud.settings.showPrompt(result.description,result.resultCode);
            }
        }, ajaxError: function () {
            casino.simpleCrud.settings.showPrompt("连接超时","warning");
        }, showPrompt: function (message,type) {
            if(!type){
                type = "success";
            }
            casino.store.infoAlert(type,message);
//            alert(message);
        }, contentForm: '#content_form', searchBtn: "#submit_search", refreshBtn: "#refreshBtn", deleteBtn: "#deleteBtn", createBtn: "#createBtn", exportExcelBtn: "#exportExcelBtn", dataListTable: "#table1"
        //下拉框的options的map，key为该下拉框的 options 属性
        , systemCodeMap: ""
        , saveUrl:null,listUrl:null,editUrl:null,deleteUrl:null
    }
    //初始化一些按钮的事件
    , init: function () {
        var settings = this.settings;
        //禁用表单回车提交
        $(settings.contentForm).bind("keypress", function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                return false;
            }
        });
        //查询页回车查询
        $("form[name=search_form]").bind("keypress", function (e) {
            if (e.keyCode == 13) {
                $(settings.searchBtn).click();
            }
        });
        $(settings.searchBtn).click(function () {
            casino.simpleCrud.search();
        });
        $(settings.refreshBtn).click(function () {
            casino.store.removeAlert();
            casino.store.refreshTable(casino.simpleCrud.settings.dataListTable,casino.simpleCrud.settings.getUrl(casino.simpleCrud.settings.listUrl?casino.simpleCrud.settings.listUrl:"listJson"),{});
        });
        $(settings.deleteBtn).click(function () {
            casino.simpleCrud.onDelete();
        });
        $(settings.createBtn).click(function () {
            casino.simpleCrud.create();
        });
        $(settings.exportExcelBtn).click(function () {
            casino.simpleCrud.exportExcel();
        });
        $(settings.dataListTable).find('tbody').on("dblclick", "tr", function () {
            var id = $(this).find(":checkbox:first").val();
            if(!id){
                id = $(this).find(":radio:first").val();
            }
            casino.simpleCrud.edit(id);
        });
        $(settings.contentForm).cankuValidity1().submit(function (e) {
        	casino.store.stopDefaultEvent(e);
            casino.simpleCrud.save();
            return false;
        }).delegate(":submit", "click", function () { //在有多个tab页的form中，自动跳转到有错误提示的tab页
                setTimeout(function(){
                    var id = $('div.invalid')
                        .not(function () {
                            return  $(this).css('display') != 'block';
                        }).first().closest("div.tab-pane").attr('id');
                    $('#content_nav').find('a[href="#' + id + '"]').click();
                },500);

            });

        casino.simpleCrud.addSpecialStyle();

        //填充下拉框的options
        casino.simpleCrud.initSelect('select[options]', settings.systemCodeMap);
    }
    //添加一些特定的样式，如必填、不可编辑等样式
    , addSpecialStyle: function () {
        $(this.settings.contentForm).find('input[required],select[required],textarea[required]').each(function () {
            $(this).after('<label class="star">*</label>');
        });
        $(this.settings.contentForm).find('input[uppercase]').each(function () {
            $(this).keyup(function(){
                $(this).val($(this).val().toUpperCase());
            });
        });
    }, initSelect: function (selector, optionsMap) {
        if(optionsMap){
            //填充下拉框的options
            $(document).find(selector).each(function () {
                var options = optionsMap[$(this).attr('options')];
                casino.simpleCrud.createSelectOption($(this), options)
            });
        }
    }
    /**
     * 将给定对象中的数据填充到下拉框中
     * @param $select 需要填充的下拉框
     * @param jsonObject 可以是一个对象，也可以是对象数组（如果是对象，则将对象的key:value作为一个option
     *  ,如果是一个对象数组，则将数组中的每个对象作为一个option）
     * @param keyProp 当jsonObject为对象数组时，取对象的keyProp属性为option的value ,可以为空，默认值为 'codeValue'
     * @param nameProp 当jsonObject为对象数组时，取对象的nameProp属性为option的text ,可以为空，默认值为 'codeValueName'
     * @returns {*}
     */
    , createSelectOption: function ($select, jsonObject,keyProp,nameProp) {
        //下拉框的value在jsonObject中的属性名
        keyProp = keyProp || 'codeValue';
        //下拉框的text在jsonObject中的属性名
        nameProp = nameProp || 'codeValueName';
        if (jsonObject === undefined) {
            return;
        } else if(!jsonObject) {
            jsonObject = [];
        }
        if (typeof jsonObject == "string") {
            jsonObject = $.parseJSON(jsonObject);
        }

        $select.empty();
        if (!$select.attr('noneEmpty')) {
            var op = document.createElement("OPTION");
            op.value = '';
            op.innerHTML = '---请选择---';
            $select.append(op);
        }

        $.each(jsonObject, function (index, obj) {
            var op = document.createElement("OPTION");
            var value = obj[keyProp] || index;
            var text = obj[nameProp] || obj;
            op.value = value;
            op.innerHTML = text;
            $select.append(op);
        });
        return $select;
    }, create: function () {
        this.edit();
    },beforeEdit : function(id){
        var settings = casino.simpleCrud.settings;
        //设置不可编辑项为disable
        if (id) {
            $(settings.contentForm).find('[uneditable]').each(function () {
                $(this).attr('disabled', true);
            });
        } else {
            $(settings.contentForm).find('[uneditable]').each(function () {
                $(this).attr('disabled', false);
            });
        }
        //清空表单验证的错误提示
        var c = $(".textbox_ui");
        c.find(".valid").toggle(false);
        c.find(".required").toggle(false);
        c.find(".custom").toggle(false);
        c.find(".format").toggle(false);
        c.find(".invalid").toggle(false);
        c.toggleClass("error_ui", false);
    }, edit: function (id, editUrl) {
        casino.store.removeAlert();
        var settings = casino.simpleCrud.settings;
        casino.simpleCrud.beforeEdit(id);
        id = id ? "?id=" + id : "";
        editUrl = editUrl ? editUrl : (settings.editUrl?settings.editUrl:settings.getUrl("detailJson"));
        $.ajax({
            type: "POST",
            url: editUrl + id,
            dataType: "json",
            error: settings.ajaxError,
            success: settings.onEdit
        });
    }, save: function (saveUrl) {
        var settings = casino.simpleCrud.settings;
        if (!settings.beforeSave()) {
            return;
        }
        saveUrl = saveUrl ? saveUrl :(settings.saveUrl?settings.saveUrl:settings.getUrl("saveOrUpdate"));
        $.ajax({
            type: "POST",
            url: saveUrl,
            data: settings.getSaveData(),
            dataType: "json",
            error: settings.ajaxError,
            success: settings.afterSave
        });
    }, search: function () {
        casino.store.removeAlert();
        casino.store.getTableData(this.settings.dataListTable,this.settings.getUrl(this.settings.listUrl?this.settings.listUrl:"listJson"));
        if(!$('#list').hasClass('active')){
//            $("#myTab [href=#list]").click();
        }
        return false;
    }, exportExcel: function (url,pageno,pagesize) {
        var settings = casino.simpleCrud.settings;
        url = url ? url : settings.getUrl("listJson");
        pageno = 1;//pageno ? pageno : $("ul.pagination li.active").find("a").html();
        //最多导出5000条数据
        pagesize = 5000;//pagesize ? pagesize : $("#list .dataTable_pagesize").val();
        var exportData = {
            page : pageno ,
            pagesize : pagesize,
            exportType : 'excel'
        }
        var input_obj = $('form[name=search_form]').serializeArray();
        $.each(input_obj, function (index, key) {
            exportData[key.name] = key.value;
        });
        var excelHeader = [];
        //设置需要导出的列
        $("#list thead th:gt(0)").each(function () {
            var cell = {};
            cell[$(this).attr("name")] = $(this).html();
            excelHeader[excelHeader.length] = cell;
        });
        exportData.exportColumnDescr = casino.store.toJsonString(excelHeader);
        $.ajax({
        	
        	success : function() {
        		 var $form = $("<form style='display: none' method='post'></form>")
                 .attr("target", "_blank")
                 .attr("action", url);

             $.each(exportData, function (key, value) {
                 $('<input>')
                     .attr('type', 'hidden')
                     .attr('name', key)
                     .attr('value', value)
                     .appendTo($form)
             })
             $('body').append($form);

             $form.submit();
             $form.remove();
        	}
        });
       
    }, onDelete: function (deleteUrl,selector,afterDelete) {
        var settings = this.settings;
        if (!settings.beforeDelete()) {
            return;
        }
        selector = selector ? selector : settings.dataListTable;
        afterDelete = afterDelete ? afterDelete : settings.afterDelete;

        var ids = [];
        $(selector).find('tbody').find(":checked").each(function () {
            ids[ids.length] = $(this).val();
        });
        if (ids.length == 0) {
            settings.showPrompt("请选择要删除的数据","warning");
            return;
        }
        casino.store.infoComfirm("确定删除?",function(){
            deleteUrl = deleteUrl ? deleteUrl :(settings.deleteUrl?settings.deleteUrl:settings.getUrl("delete"));
            $.ajax({
                type: "POST",
                url: deleteUrl,
                data: {
                    ids: ids.join(",")
                },
                dataType: "json",
                error: settings.ajaxError,
                success : afterDelete
            });
        });
    }
    //将js对象中的属性填充到form表单中
    , setFormContent: function ($form, entity) {
        $form.find(":text").val("");
        $form.find(":checkbox").closest("span").removeClass("checked");

        $($form).find("textarea,input,select,label.param").each(function () {
            var $target = $(this);
            var name = $target.attr("name");
            if (!name) {
                return;
            }
            //支持级联命名 如:item.types.sku
            var currentValue = entity;
            var nameArray = name.split('.');
            for (var i = 0; i < nameArray.length; i++) {
                currentValue = currentValue[nameArray[i]];
                if (!currentValue && currentValue != 0) {
                    break;
                }
            }

            if (currentValue || currentValue == 0) {
            	if ($target.is(":checkbox")) {
            		currentValue = String(currentValue);
            		var values = currentValue.split(",");
            		var value;
            		for(var j=0;j<values.length;j++){
            			value = values[j];
            			if($target.val()&&$target.val()==value||value=="true"){
            				this.checked=true;
                            $target.closest("span").addClass("checked");
                            break;
            			}else{
            				this.checked=false;
                            $target.closest("span").removeClass("checked");
            			}
            		}                		                	
                }  else if ($target.is("select[multiple]")) {
                    var values = currentValue.split(',');
                    //多选下拉框
                    $target.find('option').each(function(){
                        var option = this;
                        var selected = false;
                        $.each(values,function(index,value){
                            if(option.value == value){
                                selected = true;
                                return false;
                            }
                        });
                        option.selected = selected;
                    });
                }else if($target.is("label")){
                	$target.text(currentValue);
                } else {
                    $target.val(currentValue);
                }
            } else if(currentValue != undefined){
                if ($target.is(":checkbox")) {
                	this.checked=false;
                    $target.closest("span").removeClass("checked");
                }else {
                    $target.val("");
                }
            }
        });
        $('#createUser').html(entity['createUser']);
        $('#createTime').html(entity['createTime']);
        $('#updateUser').html(entity['updateUser']);
        $('#updateTime').html(entity['updateTime']);
    }
    ,getSelectedRowData : function($row) {
        var $tds = $row.children(':gt(0)');
        var data = {};
        data.id = $row.find(':checkbox:first').val();
        $("#table1 thead th:gt(0)").each(function (index, th) {
            data[$(this).attr("name")] = $tds.eq(index).html();
        });
        return data;
    }
    , getUrlParam : function(paramName) {
        var searchString = window.location.search.replace('?', '');
        var params = searchString.split('&');
        for (var i = 0; i < params.length; i++) {
            var kv = params[i].split('=');
            if (kv[0] == paramName) {
                return kv[1];
            }
        }
    }
    //初始化弹出层选择数据界面，如选择sku
    , initPopSearch: function () {
        $("#submit_search").click(function () {
            casino.simpleCrud.search();
        });
        $("#confirmBtn").click(function () {
            var ids = [];
            var $row = "";
            $("#search_list").find(":checked").each(function () {
                ids[ids.length] = $(this).val();
                $row = $(this).closest("tr");
            });
            if (ids.length == 0) {
                casino.simpleCrud.settings.showPrompt("请选择一条数据","success");
                return false;
            } else if (ids.length > 1) {
                casino.simpleCrud.settings.showPrompt("只能选择一条数据","success");
                return false;
            }
            parent[casino.simpleCrud.getUrlParam('selectedCallback')].call(parent, casino.simpleCrud.getSelectedRowData($row));
        });
        $("#search_list").on("dblclick", "tr", function () {
            parent[casino.simpleCrud.getUrlParam('selectedCallback')].call(parent, casino.simpleCrud.getSelectedRowData($(this)));
        });
    }
};

