package com.order.mvc.controller.back;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/back")
public class BackCustomMenuController {
	
	
	@RequestMapping(value="/custom_menu/home_page",method={RequestMethod.GET})
	public ModelAndView openHomePage(){
		ModelAndView view = new ModelAndView("back/custom_menu/home_page");
		return view;
	}
	
	@RequestMapping(value="/custom_menu/home_page",method={RequestMethod.POST})
	public void saveOrUpdateHomePage(HttpServletRequest request,HttpServletResponse response){
		String redirectUrl = request.getContextPath()+"/back/custom_menu/left_menu";
		try {
			response.sendRedirect(redirectUrl);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	@RequestMapping(value="/custom_menu/left_menu",method={RequestMethod.GET})
	public ModelAndView openLeftMenu(){
		ModelAndView view = new ModelAndView("back/custom_menu/left_menu");
		return view;
	}
	
	@RequestMapping(value="/custom_menu/left_menu",method={RequestMethod.POST})
	public void saveOrUpdateLeftMenu(HttpServletRequest request,HttpServletResponse response){
		String redirectUrl = request.getContextPath()+"/back/custom_menu/main_menu";
		try {
			response.sendRedirect(redirectUrl);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	@RequestMapping(value="/custom_menu/main_menu",method={RequestMethod.GET})
	public ModelAndView openMainMenu(){
		ModelAndView view = new ModelAndView("back/custom_menu/main_menu");
		return view;
	}
	
	@RequestMapping(value="/custom_menu/main_menu",method={RequestMethod.POST})
	public void saveOrUpdateMainMenu(HttpServletRequest request,HttpServletResponse response){
		String redirectUrl = request.getContextPath()+"/back/custom_menu/item";
		try {
			response.sendRedirect(redirectUrl);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	@RequestMapping(value="/custom_menu/item",method={RequestMethod.GET})
	public ModelAndView openItem(){
		ModelAndView view = new ModelAndView("back/custom_menu/item");
		return view;
	}
	
	@RequestMapping(value="/custom_menu/item",method={RequestMethod.POST})
	public void saveOrUpdateItem(HttpServletRequest request,HttpServletResponse response){
		String redirectUrl = request.getContextPath()+"/back/custom_menu/home_page";
		try {
			response.sendRedirect(redirectUrl);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
