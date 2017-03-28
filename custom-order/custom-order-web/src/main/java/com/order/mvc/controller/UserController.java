package com.order.mvc.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.github.miemiedev.mybatis.paginator.domain.Order;
import com.github.miemiedev.mybatis.paginator.domain.PageBounds;
import com.github.miemiedev.mybatis.paginator.domain.PageList;
import com.nl.common.db.util.FilterRule;
import com.nl.common.db.util.FilterRuleBuilder;
import com.nl.common.service.BaseService;
import com.nl.common.web.vo.ResponseResult;
import com.order.core.service.base.UserService;
import com.order.datasource.dao.UserDAO;
import com.order.datasource.domain.User;
import com.order.mvc.controller.base.BaseCRUDController;

@Controller
@RequestMapping("/back/user")
public class UserController extends BaseCRUDController<User, Integer> {

	@Autowired
	private UserService userService;
	
	@Autowired
	private UserDAO userDAO;
	
	@Override
	public BaseService<User, Integer> getBaseService() {
		return userService;
	}

	@RequestMapping("/index")
	public String openIndex() {
		return "manage/user";
	}

	@RequestMapping("/listJson")
	public ResponseResult openIndex(
			@RequestParam(value = "page") Integer page,
			@RequestParam(value = "pagesize") Integer pagesize,
			@RequestParam(value = "username") String username, @RequestParam(value = "nickName") String nickName,
			@RequestParam(value = "order_by") String orderBy,@RequestParam(value = "order_type")String orderTsype) {
		ResponseResult result = new ResponseResult(true);
		List<FilterRule> filterRules = FilterRuleBuilder.newBuilder().key("username").eq().value(username).build();
		PageList<User> users = userDAO.findPage(filterRules, new PageBounds(page,pagesize,Order.formString("username"+"."+orderTsype),true));
		result.addProperty("pageList", users);
		return result;
	}
	
	@RequestMapping("/{username}")
	public ResponseResult getUser(@PathVariable String username){
		ResponseResult result = new ResponseResult(true);
		result.addProperty("user", userService.findByUsername(username));
		return result;
	}

}
