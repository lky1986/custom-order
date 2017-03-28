package com.order.core.service.base.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nl.common.db.dao.BaseDAO;
import com.nl.common.service.AbstractService;
import com.order.core.service.base.RoleService;
import com.order.datasource.dao.RoleDAO;
import com.order.datasource.domain.Role;

@Service("roleService")
public class RoleServiceImpl extends AbstractService<Role,Integer> implements RoleService{

	@Autowired
	private RoleDAO roleDAO;
	
	@Override
	protected BaseDAO<Role, Integer> getDAO() {
		return roleDAO;
	}


}
