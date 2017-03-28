package com.order.mvc.controller.back;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.nl.common.exception.BusinessException;
import com.nl.common.web.vo.ResponseResult;
import com.nl.security.util.LoginUtil;
import com.order.core.service.base.UserService;
import com.order.datasource.domain.User;

@Controller
@RequestMapping("/back")
public class BackMainController {
	
	@Autowired
	private UserService userService;
 
	@Autowired
	private Md5PasswordEncoder md5;

	@RequestMapping(value="/login",method={RequestMethod.GET})
	public String login(HttpServletRequest request) {
		return "login/login";
	}
	
	@RequestMapping(value="/index",method={RequestMethod.GET})
	public ModelAndView main(@RequestParam(value="page",required=false) String page) {
		ModelAndView view = new ModelAndView("main/main");
		if(StringUtils.isNotBlank(page))view.addObject("page", page);
		return view;
	}

	@RequestMapping(value="/user/changeUserInfo",method={RequestMethod.GET})
	public ModelAndView changeUserInfo() {
		ModelAndView view = new ModelAndView("main/user_info");
		view.addObject("user", LoginUtil.getCurrentUserInfo());
		return view;
	}

	@RequestMapping(value="/user/saveOrUpdate",method={RequestMethod.POST})
	public ResponseResult saveOrUpdateUser(User newUser, HttpServletRequest request) {
		ResponseResult result = new ResponseResult(true);
		User user = userService.find(newUser.getId());
		user.setPhone(user.getPhone());
		user.setNickName(user.getNickName());
		user.setEmail(user.getEmail());
		userService.update(user);
		return result;
	}

	@RequestMapping(value="/password/changePassword",method={RequestMethod.GET})
	public ModelAndView changePassword() {
		ModelAndView view = new ModelAndView("main/change_password");
		return view;
	}

	@RequestMapping(value="/password/saveOrUpdate",method={RequestMethod.POST})
	public ResponseResult updatePassword(
			@RequestParam("oldPassword") String oldPassword,
			@RequestParam("password") String password,
			@RequestParam("retypePassword") String retypePassword) {
		ResponseResult result = new ResponseResult(true);
		if(!password.equals(retypePassword)){
			throw new BusinessException("The two passwords are not identical");
		}
		User user = userService.find(LoginUtil.getCurrentUserId());
		oldPassword = md5.encodePassword(oldPassword,user.getUsername());
		if(oldPassword.equals(user.getPassword())){
			user.setPassword(md5.encodePassword(password,
					user.getUsername()));
			userService.update(user);
		}else{
			throw new BusinessException("The original password is not consistent with what account");
		}
		return result;
	}
   
}
