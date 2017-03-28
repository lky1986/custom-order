package com.order.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.util.matcher.RegexRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;

import com.nl.security.userdetails.CustomUserDetailsService;
import com.nl.security.web.auth.provider.DefaultPermissionProvider;
import com.order.core.service.base.RoleService;
import com.order.datasource.domain.Role;

@Component(value="permissionProvider")
public class CustomPermissionProvider extends DefaultPermissionProvider {
	
	@Autowired
	private RoleService roleService;
	
	public static final String ROLE_NORMAL_MATCHER ="^/.*$";
	
	@Override
	public Map<RequestMatcher, Collection<ConfigAttribute>> provider() {
		Map<RequestMatcher, Collection<ConfigAttribute>> resourceMap = new LinkedHashMap<RequestMatcher, Collection<ConfigAttribute>>();
		List<Role> roleList = roleService.findAll();
		
		for(Role role:roleList){
			List<ConfigAttribute> configAttributes = new ArrayList<ConfigAttribute>();
			ConfigAttribute configAttribute = new SecurityConfig("ROLE_" + role.getRoleCode());
			configAttributes.add(configAttribute);
			resourceMap.put(new RegexRequestMatcher(role.partter(),null),configAttributes);
		}
		
		//加入统一权限
		List<ConfigAttribute> allConfigAttributes = new ArrayList<ConfigAttribute>();
		allConfigAttributes.add(new SecurityConfig(CustomUserDetailsService.ROLE_NORMAL));
		resourceMap.put(new RegexRequestMatcher(ROLE_NORMAL_MATCHER,null),allConfigAttributes);
		
		return resourceMap;
	}
	
	
	
}
