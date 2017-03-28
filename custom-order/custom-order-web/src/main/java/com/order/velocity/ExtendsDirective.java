package com.order.velocity;

import org.apache.velocity.runtime.directive.Parse;

/**
 * @author badqiu
 */
public class ExtendsDirective extends Parse{
	@Override
	public String getName() {
		return "extends";
	}
	
}