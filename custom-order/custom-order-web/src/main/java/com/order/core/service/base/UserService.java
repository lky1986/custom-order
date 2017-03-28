package com.order.core.service.base;

import com.nl.common.service.BaseService;
import com.order.datasource.domain.User;

public interface UserService extends BaseService<User,Integer>{
	
	public User findByUsername(String username);
	
}
