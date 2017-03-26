package com.order.mvc.controller.base;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.nl.common.db.domain.BaseDomain;
import com.nl.common.service.BaseService;
import com.nl.common.web.vo.ResponseResult;
import com.nl.security.util.LoginUtil;

public abstract class BaseCRUDController<T extends BaseDomain,D> extends BaseController{
	
	private String idKey = "id";
	
	@SuppressWarnings("unchecked")
    @RequestMapping(value="/detailJson",method={RequestMethod.GET,RequestMethod.POST})
	public ResponseResult getDetail(@RequestParam(value ="id",required=false) D d) throws InstantiationException, IllegalAccessException{
	    ResponseResult ResponseResult = new ResponseResult();
	    if(d==null){
	        ResponseResult.addProperty("entity",(T) (getGenericType(0).newInstance()));
	    }else{
	        ResponseResult.addProperty("entity",getBaseService().find(d));
	    }
	    return ResponseResult;
	}
	
	@RequestMapping(value="/saveOrUpdate",method={RequestMethod.GET,RequestMethod.POST})
	public ResponseResult create(T t){
	    Integer id = this.getIntegerParameter(idKey);
	    ResponseResult ResponseResult = new ResponseResult();
	    t.setUpdateUser(LoginUtil.getCurrentName());
	    if(id==null){
	    	t.setCreateUser(LoginUtil.getCurrentName());
	        getBaseService().create(t); 
	    }else{
	        getBaseService().update(t);
	    }
	    ResponseResult.addProperty("entity",t);
		return ResponseResult;
	}
	
	@RequestMapping(value="/delete",method={RequestMethod.GET,RequestMethod.POST})
	public ResponseResult delete(@RequestParam("ids")D[] ids){
	    ResponseResult ResponseResult = new ResponseResult();
	    List<D> idList = Arrays.asList(ids);
	    getBaseService().deletes(idList);
	    return ResponseResult;
	}
	

	
	public abstract BaseService<T,D> getBaseService();
	
	protected Class<?> getGenericType(int index) {
        Type genType = getClass().getGenericSuperclass();
        if (!(genType instanceof ParameterizedType)) {
            return null;
        }
        Type[] params = ((ParameterizedType) genType).getActualTypeArguments();
        if (index >= params.length || index < 0) {
            return null;
        }
        if (!(params[index] instanceof Class)) {
            return null;
        }
        return (Class<?>) params[index];
    }

	public String getIdKey() {
		return idKey;
	}

	public void setIdKey(String idKey) {
		this.idKey = idKey;
	}

}
