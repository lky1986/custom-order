package com.order.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.nl.security.web.auth.IUser;
import com.nl.security.web.auth.IUserProvider;
import com.order.core.service.base.UserService;

@Component
public class UserProvider implements IUserProvider {
	
	@Autowired
	private UserService userService;

	@Override
	public IUser findByUserName(String username) {
		return userService.findByUsername(username);
	}

}
