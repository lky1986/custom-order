package com.order.core.service.base.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nl.common.db.dao.BaseDAO;
import com.nl.common.service.AbstractService;
import com.order.core.service.base.UserRoleRelationService;
import com.order.datasource.dao.UserRoleRelationDAO;
import com.order.datasource.domain.Role;
import com.order.datasource.domain.User;
import com.order.datasource.domain.UserRoleRelation;

@Service("userRoleRelationService")
public class UserRoleRelationServiceImpl extends AbstractService<UserRoleRelation,Integer> implements UserRoleRelationService{
	
	@Autowired
	private UserRoleRelationDAO userRoleRelationDAO;
	
	@Override
	protected BaseDAO<UserRoleRelation, Integer> getDAO() {
		return userRoleRelationDAO;
	}
	

	public List<Role> findRolesByUserId(Integer userId) {
		return userRoleRelationDAO.findRolesByUserId(userId);
	}

	public List<User> findUsersByRoleId(Integer roleId) {
		return userRoleRelationDAO.findUsersByRoleId(roleId);
	}


}
