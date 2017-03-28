/*
 * HTML5表单验证，低端浏览器下依赖H5F.js并按需加载
 * $.fn.h5validity
 * 基本表单验证函数，高级浏览器下，去除浏览器默认提示框，低级浏览器下加载H5F并模拟invalid事件

 * $.fn.jmucvalidate
 * 用户中心的表单验证函数，基于$.fn.h5validity，实现了错误提示样式
 */
(function($){
    var input = $("<input>")[0],
        support = "validity" in input && "checkValidity" in input,
        doc = document,
        initInvalid;

    //如果浏览器不支持HTML5,则加载h5f.js
    if(!support){
        doc.writeln("<script src=\""+ $(doc.scripts ? doc.scripts[doc.scripts.length - 1] : "script:last").attr("data-h5f")+"\"></script>");
    }

    //回调的触发
    function validityCall(opt, e){
        if(opt.validity){
            opt.validity.call(e.target, e);
        }
    }

    //支持HTML5验证的浏览器，使用用户自己的class
    function toggleClass(node, opt){
        var v = node.validity;
        if(v) {
            node = $(node);

            opt.validClass && node.toggleClass(opt.validClass, v.valid);
            opt.invalidClass && node.toggleClass(opt.invalidClass, (!v.valueMissing && !v.valid));
            opt.requiredClass && node.toggleClass(opt.requiredClass, v.valueMissing);
            opt.placeholderClass && node.toggleClass(opt.placeholderClass, (!node.val() && node.placeholder));
        }
    }

    function initInvalid(form, opt){

        //invalid事件处理函数
        function invalidFn(e){
            //阻止事件冒泡
            e.stopPropagation();
            //为了去掉默认样式，阻止全部浏览器默认行为；
            e.preventDefault();
            validityCall(opt, e);
        }

        //绑定事件处理函数
        function prevent(node){
            return $(node).bind("invalid", invalidFn);
        }

        //不支持HTML5验证的浏览器，使用H5F
        if(!support){
            H5F.setup(form, opt);
        }

        //将现有表单元素去除默认行为
        prevent(form.elements);
        form = prevent(form).delegate(":text,textarea", "change", function(e){
            //文本框自动trim
            var input = e.target;

            if(/^\s+$/.test(input.value)){
                input.value = $.trim(input.value);
            }
        });

        if(support || doc.createEvent) {

            form.bind("DOMNodeInserted", function(e){
                var target = e.target;
                if("validity" in target && "checkValidity" in target){
                    //将动态添加的元素去除默认行为
                    prevent(target);
                }
            });

            if(support){
                //由于阻止了默认事件，需要重新模拟焦点行为
                form.delegate(":submit", "click", function(e){
                    var invalid = this.form.querySelector(":invalid");
                    invalid && invalid.focus();
                }).bind("change", function(e){
                        toggleClass(e.target, opt);
                    });
            }
        }
    };

    /*表单验证公共组件*/
    $.fn.h5validity = function(opt){
        opt = $.extend({
            validClass : "",
            invalidClass : "",
            requiredClass : ""
        }, opt);

        if(opt.events){
            for(var i in opt.events){
                this.delegate(i, opt.events[i], function(e){
                    var	input = e.target,
                        callFn = function(){
                            if(input.checkValidity && input.checkValidity()){
                                validityCall(opt, e);
                            }
                        };
                    //IE10、11在change事件发生时select标签的validity还未更新，所以延迟
                    if(support && doc.documentMode && /select/i.test(input.tagName)){
                        setTimeout(callFn, 1);
                    } else {
                        callFn();
                    }
                });
            }
        }

        return this.each(function(){
            initInvalid(this, opt);
        });
    };
    $.fn.cankuValidity1 = function(){
        return this.h5validity({
            events: {
                "*": "change"
            },
            validity: function(e){
                var me = e.target,
                    nodeName = me.nodeName.toLowerCase(),
                    v = me.validity,
                    $me = $(me),
                    c = $me.closest(".textbox_ui");
                var msg = c.find(".custom").html();
//                var regexp = $me.attr("pattern"),value = $me.val();
//                if(nodeName==="textarea"){
//                    if(regexp&&value!=""){
//                        var bool = new RegExp(regexp).test(value);
//                        if(!bool){
//                            var msg = c.find(".format").html();
//                            e.target.setCustomValidity(msg);
//                        }
//                    }
//                }
//                var maxlen = $me.attr("data-maxlen");
//                if(maxlen){
//                   var len_reg = parseInt(maxlen);
//                    if(value.length>len_reg){
//                        me.setCustomValidity(msg);
//                    }
//                }
                var parent_ui = $me.closest(".textbox_ui"), invalid = parent_ui.find(".invalid");
                var $prev = parent_ui.find(":input").not(":button");
                if(invalid.hasClass("right")){
                    invalid.css("left",$prev.width()+15);
                }

                if(invalid.hasClass("bottom")){
                    invalid.css("top",$prev.height()+10);
                }

                c.find(".valid").toggle(v.valid);
                c.find(".required").toggle(v.valueMissing);
                c.find(".custom").toggle(v.customError).html(v.customError ? me.validationMessage : "");
//                c.find(".custom").toggle(v.customError);
                c.find(".format").toggle(!v.valid && !v.valueMissing && !v.customError);
                c.find(".invalid").toggle(!v.valid);
                c.toggleClass("error_ui", !v.valid);
                setTimeout(function(){
                    c.find(".invalid").hide(1000);
                },2000);
            }
        });
    };
    //表单长度验证
//    $(document).on("keyup", ":input[data-maxlen]", function() {
//        var $this = $(this), maxlen = $this.attr("data-maxlen"),parent_ui = $this.closest(".textbox_ui");
//        if (maxlen) {
//            if ($this.val().length > parseInt(maxlen)) {
//                var msg = parent_ui.find(".custom").html();
//                this.setCustomValidity(msg);
//            }else{
//                this.setCustomValidity("");
//            }
//
//        }
//    });

//小数位处理
//    $(document).on("change","input[decimal]",function(){
//        alert("change decimal  ")     ;
//        var $this =$(this),decimal = $this.attr("decimal"),value = $this.val();
//        if(value!==""){
//            if(decimal != null && decimal != undefined){
//                var strArray = value.split(".");
//                if (strArray.length >1){
//                    //判断是否只有一个小数点
//                    if (strArray.length == 2){
//                        var size = parseInt(decimal);
//                        var sValue = strArray[1];
//                        if (sValue.length > size){
//                            this.setCustomValidity("只能为"+size+"位小数");
//                        }
//                    }else{
//                        this.setCustomValidity("输入数据有错");
//                    }
//
//                }else if($this.text().indexOf(".") > 0){
//                    this.setCustomValidity("输入数据有错");
//                }else{
//                    this.setCustomValidity("");
//                }
//
//            }
//        }
//    });
})(jQuery);
