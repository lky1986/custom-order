package com.order.mvc.controller.base;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class BaseController {
	
	protected String getStringParameter(String name) {
		return getStringParameter(name, null);
	}

	protected String getStringParameter(String name, String defaultValue) {
		String value = getHttpServletRequest().getParameter(name);

		return StringUtils.isEmpty(value) ? defaultValue : value.trim();
	}

	protected Boolean getBooleanParameter(String name) {
		return getBooleanParameter(name, null);
	}

	protected Boolean getBooleanParameter(String name, Boolean defaultValue) {
		String value = getHttpServletRequest().getParameter(name);

		return StringUtils.isEmpty(value) ? defaultValue : Boolean.valueOf(value);
	}

	protected Integer getIntegerParameter(String name) {
		return getIntegerParameter(name, null);
	}
	
	protected Integer getIntegerParameter(String name, Integer defaultValue) {
		String value = getHttpServletRequest().getParameter(name);
		
		return StringUtils.isEmpty(value) ? defaultValue : Integer.valueOf(value);
	}

	protected Long getLongParameter(String name) {
		return getLongParameter(name, null);
	}

	protected Long getLongParameter(String name, Long defaultValue) {
		String value = getHttpServletRequest().getParameter(name);

		return StringUtils.isEmpty(value) ? defaultValue : Long.valueOf(value);
	}

	protected Float getFloatParameter(String name) {
		return getFloatParameter(name, null);
	}

	protected Float getFloatParameter(String name, Float defaultValue) {
		String value = getHttpServletRequest().getParameter(name);

		return StringUtils.isEmpty(value) ? defaultValue : Float.valueOf(value);
	}

	protected Double getDoubleParameter(String name) {
		return getDoubleParameter(name, null);
	}

	protected Double getDoubleParameter(String name, Double defaultValue) {
		String value = getHttpServletRequest().getParameter(name);

		return StringUtils.isEmpty(value) ? defaultValue : Double.valueOf(value);
	}

	protected Date getDateParameter(String name, String format) {
		return getDateParameter(name, format, null);
	}

	protected Date getDateParameter(String name, String format, String defaultValue) {
		String value = getHttpServletRequest().getParameter(name);
		
		DateFormat dateFormat = new SimpleDateFormat(format);

		try {
			if (StringUtils.isEmpty(value)) {
				return null == defaultValue ? null : dateFormat.parse(defaultValue);
			} else {
				return dateFormat.parse(value);
			}
		} catch (ParseException e) {
			e.printStackTrace();
			return null;
		}
	}
	
	protected String[] getParameterValues(String name){
		return getHttpServletRequest().getParameterValues(name);
	}
	
	protected HttpServletRequest getHttpServletRequest() {
		
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		
		return request;
	}
}
