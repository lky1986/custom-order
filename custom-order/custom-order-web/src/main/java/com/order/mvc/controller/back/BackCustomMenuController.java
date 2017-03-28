package com.order.mvc.controller.back;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import io.swagger.annotations.ApiOperation;

@Controller
@RequestMapping("/back")
public class BackCustomMenuController {
	
	@ApiOperation(value = "back/index", notes = "index")
	@RequestMapping(value="/index",method={RequestMethod.GET})
	public ModelAndView openMenu(){
		ModelAndView view = new ModelAndView("main/main");
		return view;
	}
	
	@RequestMapping(value="/login",method={RequestMethod.GET})
	public String login() {
		return "login/login";
	}
	
}
