package com.order.datasource.domain;

import com.nl.common.db.domain.BaseDomain;
import com.nl.security.web.auth.IRole;

public class Role extends BaseDomain implements IRole {

	private Integer id;

	private String roleName;

	private String roleCode;

	private String partter;

	private String description;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String roleCode() {
		return getRoleCode();
	}

	public String getRoleCode() {
		return roleCode;
	}

	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
	}

	public String getPartter() {
		return partter;
	}

	public void setPartter(String partter) {
		this.partter = partter;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Override
	public String partter() {
		return partter;
	}

}
