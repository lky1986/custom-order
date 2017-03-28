package com.order.datasource.domain;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang3.ObjectUtils;

import com.nl.common.db.domain.BaseDomain;
import com.nl.security.web.auth.IRole;
import com.nl.security.web.auth.IUser;


public class User extends BaseDomain implements IUser,Serializable,Cloneable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Integer id;

	private String username;

	private String password;

	private String nickName;

	private String email;

	private String phone;

	private Set<IRole> roles = new HashSet<IRole>();

	public Set<IRole> roleSet() {
		return roles;
	}

	public Integer getUserId() {
		return id;
	}

	public String getPassword() {
		return password;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Set<IRole> getRoles() {
		return roles;
	}

	public void setRoles(Set<IRole> roles) {
		this.roles = roles;
	}

	public String getNickName() {
		return nickName;
	}

	public void setNickName(String nickName) {
		this.nickName = nickName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Override
	public Object getUserInfo() {
		User user = ObjectUtils.clone(this);
		user.setPassword("Protected");
		return user;
	}

	@Override
	public Object clone() throws CloneNotSupportedException {
		return super.clone();
	}
}
