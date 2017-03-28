package com.order.core.service.base.impl;

import java.util.HashSet;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nl.common.db.dao.BaseDAO;
import com.nl.common.db.util.FilterRule;
import com.nl.common.db.util.FilterRuleBuilder;
import com.nl.common.service.AbstractService;
import com.nl.security.web.auth.IRole;
import com.order.core.service.base.UserRoleRelationService;
import com.order.core.service.base.UserService;
import com.order.datasource.dao.UserDAO;
import com.order.datasource.domain.User;

@Service("userService")
public class UserServiceImpl extends AbstractService<User,Integer> implements UserService{

	private final String cacheName = "getCommonAds"; 
	
	@Autowired
	private UserDAO userDAO;
	
	@Autowired
	private UserRoleRelationService userRoleRelationService;
	
	@Autowired
	private Md5PasswordEncoder md5;
	
	@Override
	protected BaseDAO<User, Integer> getDAO() {
		return userDAO;
	}
	
	@Cacheable(key="#username",value = { ""+cacheName+"" })
	public User findByUsername(String username) {
		List<FilterRule>  filterRules= FilterRuleBuilder.newBuilder().key("username").eq().value(username).build(); 
		List<User> uses = userDAO.findLimitByCondition(filterRules,0,1);
		User user = uses.size()>0?uses.get(0):null;
		if(user!=null){
			List<? extends IRole> roles = userRoleRelationService.findRolesByUserId(user.getId());
			user.setRoles(new HashSet<IRole>(roles));
		}
		return user;
	}

	@Override
	public int create(User user) {
		user.setPassword(md5.encodePassword(user.getUsername(),user.getUsername()));
		return super.create(user);
	}

	@Override
	public int update(User user) {
		User oldUser = userDAO.find(user.getId());
		if(StringUtils.isBlank(user.getPassword()))user.setPassword(oldUser.getPassword());
		return super.update(user);
	}

	
}
