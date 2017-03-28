package com.order.mvc.handler;

import java.io.PrintWriter;
import java.io.StringWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.omg.CORBA.SystemException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSON;
import com.nl.common.exception.BusinessException;
import com.nl.common.util.web.HttpUtils;
import com.nl.common.web.vo.ResponseResult;


public class CustomHandlerExceptionResolver implements HandlerExceptionResolver {
	
	protected final Logger log = LoggerFactory.getLogger(getClass());

	private static final String ERROR_VIEW = "error";

	@Override
	public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
		ResponseResult result = null;
		if (BusinessException.class.isAssignableFrom(ex.getClass())) {
			BusinessException bex = (BusinessException) ex;
			// 业务异常返回给页面提	
			result = new ResponseResult(false,bex.getMessage());
			log.error(ex.getMessage());
		} else if (SystemException.class.isAssignableFrom(ex.getClass())) {
			SystemException sex = (SystemException) ex;
			// 系统异常
			StringWriter sw = new StringWriter();
			sex.printStackTrace(new PrintWriter(sw));
			result = new ResponseResult(false,sw.toString());
			log.error("JWMSHandlerExceptionResolver catche the System Exception, ", ex);
		} else {
			// 系统错误
			StringWriter sw = new StringWriter();
			ex.printStackTrace(new PrintWriter(sw));
			result = new ResponseResult(false,sw.toString());
			log.error("JWMSHandlerExceptionResolver catche the System Error, ", ex);
		}
		response.setCharacterEncoding("UTF-8");
		if (HttpUtils.isAcceptJson(request)) {
			// 返回json格式的数
			try {
				response.setContentType("application/json;charset=UTF-8");
				StringBuffer responseSb = new StringBuffer();
				if (HttpUtils.isJsonp(request)) {
					String callback = request.getParameter("callback");
					responseSb.append("(").append(callback).append(JSON.toJSONString(result)).append(")");
				} else {
					responseSb.append(JSON.toJSONString(result));
				}
				response.getWriter().println(responseSb.toString());
			} catch (Exception e) {
				log.error("Response write exception", e);
			}
			return new ModelAndView();
		} else {
			response.setContentType("text/html;charset=UTF-8");
			request.setAttribute("status", result.isStatus());
			request.setAttribute("message", result.getMessage());
			return new ModelAndView(ERROR_VIEW);
		}
	}
}
