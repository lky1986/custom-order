package com.order.datasource.domain;

import com.nl.common.db.domain.BaseDomain;

public class UserRoleRelation extends BaseDomain {

	private Integer id;

	private String username;

	private String roleCode;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getRoleCode() {
		return roleCode;
	}

	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
	}

}
