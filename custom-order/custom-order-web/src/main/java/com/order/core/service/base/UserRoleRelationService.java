package com.order.core.service.base;

import java.util.List;

import com.nl.common.service.BaseService;
import com.order.datasource.domain.Role;
import com.order.datasource.domain.User;
import com.order.datasource.domain.UserRoleRelation;

public interface UserRoleRelationService extends BaseService<UserRoleRelation,Integer>{
	
	public List<Role> findRolesByUserId(Integer userId);
	
	public List<User> findUsersByRoleId(Integer roleId);
}
