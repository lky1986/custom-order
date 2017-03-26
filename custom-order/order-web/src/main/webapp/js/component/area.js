if (!window.casino) {
    window.casino = new Object();
};
casino.area = {
		
		init:function(form,area_url){
			casino.area.add(form,area_url);
			$("select[name=provinceName]").change(function(){
		    	var parentNo = $(this).find("option:selected").val();
                var city_select=$("select[name=cityName]");
                var country_select=$("select[name=countyName]");
                var appendstr='';
		    	if(parentNo.search('请选择')==-1){
			    	$.ajax({
						type:"POST",
						url:"findAreaInfo",
						dataType:"json",
						data:{"parentNo":parentNo},
						success:function(out){
                            city_select.empty();
							//$("select[name=countyName]").empty();
                            appendstr+="<option>- -请选择- -</option>";
							//$("select[name=cityName]").append("<option>- - - - - - - -请选择- - - - - - - -</option>");
                            country_select.append("<option>- -请选择- -</option>");
							var citys = out.resultMap.rows;
							if(citys.length){
								for(var i=0;i<citys.length;i++){
									//$("select[name=cityName]").append("<option value="+citys[i]['areaNo']+">"+citys[i]['areaName']+"</option>");
                                    appendstr+="<option value="+citys[i]['areaNo']+">"+citys[i]['areaName']+"</option>";
								}
							}
                            city_select.append(appendstr);
						}
			    	});
		    	}else{
		    		//$("select[name=cityName]").empty();
					//$("select[name=countyName]").empty();
                    city_select.empty().append("<option>- -请选择- -</option>");
                    country_select.empty().append("<option>- -请选择- -</option>");
		    	}
		    });
		    $("select[name=cityName]").change(function(){
		    	var parentNo = $(this).find("option:selected").val();
                var appendstr='';
                var country_select=$("select[name=countyName]");
		    	if(parentNo.search('请选择')==-1){
			    	$.ajax({
						type:"POST",
						url:"findAreaInfo",
						dataType:"json",
						data:{"parentNo":parentNo},
						success:function(out){
							//$("select[name=countyName]").empty();
                            appendstr+="<option>- -请选择- -</option>";
							var countys = out.resultMap.rows;
							if(countys.length){
								for(var i=0;i<countys.length;i++){
									//$("select[name=countyName]").append("<option value="+countys[i]['areaNo']+">"+countys[i]['areaName']+"</option>");
                                    appendstr+= "<option value="+countys[i]['areaNo']+">"+countys[i]['areaName']+"</option>";
								}
							}
                            country_select.empty().append(appendstr);
						}
			    	});
		    	}else{
		    		//$("select[name=countyName]").empty();
		    		//$("select[name=countyName]").append("<option>- - - - - - - -请选择- - - - - - - -</option>");
                    country_select.empty().append(appendstr);
		    	}
		    });
		},
		showArea:function(option,name,out,detail_data){
        	    var appendstr="<option>- -请选择- -</option>";
                if(name=="provinceName"){
                    var provinces = out.resultMap.provinces;
                    if(provinces.length){
                            for(var i=0;i<provinces.length;i++){
                                if(provinces[i]['areaNo']==detail_data['provinceNo']){
                                    //$(option).append("<option value="+provinces[i]['areaNo']+" selected='selected'>"+provinces[i]['areaName']+"</option>");
                                    appendstr+="<option value="+provinces[i]['areaNo']+" selected='selected'>"+provinces[i]['areaName']+"</option>";
                                }else{
                                    //$(option).append("<option value="+provinces[i]['areaNo']+">"+provinces[i]['areaName']+"</option>");
                                    appendstr+="<option value="+provinces[i]['areaNo']+">"+provinces[i]['areaName']+"</option>";
                                }
                            }
                    }
                    $(option).empty().append(appendstr);
            	}else if(name=="cityName"){
					var citys = out.resultMap.citys;
					if(citys.length){
						for(var i=0;i<citys.length;i++){
							if(citys[i]['areaNo']==detail_data['cityNo']){
								//$(option).append("<option value="+citys[i]['areaNo']+" selected='selected'>"+citys[i]['areaName']+"</option>");
							    appendstr+="<option value="+citys[i]['areaNo']+" selected='selected'>"+citys[i]['areaName']+"</option>";
                            }else{
								//$(option).append("<option value="+citys[i]['areaNo']+">"+citys[i]['areaName']+"</option>");
							    appendstr+= "<option value="+citys[i]['areaNo']+">"+citys[i]['areaName']+"</option>";
                            }
						}
					}
                    $(option).empty().append(appendstr);
            	}else if(name=="countyName"){
					var countys = out.resultMap.countys;
					if(countys.length){
						for(var i=0;i<countys.length;i++){
							if(countys[i]['areaNo']==detail_data['countyNo']){
								//$(option).append("<option value="+countys[i]['areaNo']+" selected='selected'>"+countys[i]['areaName']+"</option>");
							    appendstr+="<option value="+countys[i]['areaNo']+" selected='selected'>"+countys[i]['areaName']+"</option>";
                            }else{
								//$(option).append("<option value="+countys[i]['areaNo']+">"+countys[i]['areaName']+"</option>");
                                appendstr+="<option value="+countys[i]['areaNo']+">"+countys[i]['areaName']+"</option>";
							}
						}
					}
                    $(option).empty().append(appendstr);
            	}
		},
		add:function(form,area_url){
			
	    	$(form).find(".area").each(function(){ 
	     	     $(this).empty();   
	  	   	}); 
	    	var parentNo = $(form).find("input[name=countryNo]").val();
            var city_select=$("select[name=cityName]");
            var county_select=$("select[name=countyName]");
            var province_select=$("select[name=provinceName]");
            var appendstr="<option>- -请选择- -</option>" ;
	    	$.ajax({
				type:"POST",
				url:area_url,
				dataType:"json",
				data:{parentNo:parentNo},
				success:function(out){
					//$("select[name=provinceName]").append("<option>- - - - - - - -请选择- - - - - - - -</option>");
					var provinces = out.resultMap.rows;
					if(provinces.length){
						for(var i=0;i<provinces.length;i++){
							//$("select[name=provinceName]").append("<option value="+provinces[i]['areaNo']+">"+provinces[i]['areaName']+"</option>");
						    appendstr+="<option value="+provinces[i]['areaNo']+">"+provinces[i]['areaName']+"</option>";
                        }
					}
                    province_select.append(appendstr);
                    city_select.append("<option>- -请选择- -</option>");
                    county_select.append("<option>- -请选择- -</option>");
				}
			});

		},
		getAreaOption:function(option,name){
			var obj={};
			var no = name.replace("Name","No");
			if($(option).val().search("请选择")==-1){

				obj[no]=$(option).val();
				obj[name]=$(option).find("option:selected").text();
			}else{
				obj[no]="";
				obj[name]="";
			}
			return obj;
		}
}