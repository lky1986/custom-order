package com.order.datasource.dao;

import java.util.List;

import com.nl.common.db.dao.BaseDAO;
import com.order.datasource.domain.Role;
import com.order.datasource.domain.User;
import com.order.datasource.domain.UserRoleRelation;

public interface UserRoleRelationDAO extends BaseDAO<UserRoleRelation,Integer> {
	
	public List<Role> findRolesByUserId(Integer userId);
	
	public List<User> findUsersByRoleId(Integer roleId);
	
}
