<%@page import="eu.agileeng.security.AuthPermission"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%><%@page import="eu.agileeng.security.AuthPrincipal, eu.agileeng.util.http.HttpUtil, eu.agileeng.services.AEInvocationContext, eu.agileeng.services.imp.AEInvocationContextImp, eu.agileeng.services.AEInvocationContextValidator, eu.agileeng.services.auth.AuthAccessService, eu.agileeng.services.auth.AuthAccessValidator, eu.agileeng.services.ServiceLocator"%>
    <%@page import="org.apache.tomcat.util.json.JSONObject,org.apache.tomcat.util.json.JSONArray"%>
    <%
    try {
	    AuthPrincipal ap = (AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL);
		AEInvocationContext invContext = new AEInvocationContextImp(ap);
		AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
		invContextValidator.validate(invContext);

		AuthAccessService authAccessService = 
				(AuthAccessService) ServiceLocator.getInstance().getService(ServiceLocator.Services.AUTH_ACCESS);
		
		//String nextLevel = "submenu-a-4";
		String level = "a3";
		String modules = "submenu-b";
		
		JSONObject submenu = new JSONObject();
		submenu.put("jsp", "submenu-b");
		
		String compCode = request.getParameter("compCode");
		%>
		
		
	<div class="metro ae-overflow-hidden">
		<div class="ae-padded ae-animated">
		<%
			if(compCode.equals("10a2")) { //XXX  Comp 10 ####################################################################
				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);
				aav.setMask(AuthPermission.READ);
		%>
			<% 
			if (aav.checkPermission("10"+level, invContext)) {
			%>
			<div class="tile double bg-darkBlue" data-ae-submenu='<%= submenu.put("compCode", "10"+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-enter"></i>
				</div>
				<div class="tile-status">
					<span class="name">Recettes</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"></span>
					</div>
				</div>
			</div>
			<% }
			
			if (aav.checkPermission("20"+level, invContext)) {
			%>
			<div class="tile double bg-lightRed" data-ae-submenu='<%= submenu.put("compCode", "20"+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-exit"></i>
				</div>
				<div class="tile-status">
					<span class="name">Dépenses</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"></span>
					</div>
				</div>
			</div>
			<% }
			
			if (aav.checkPermission("30"+level, invContext)) {
			%>
			<div class="tile double bg-lightOlive" data-ae-submenu='<%= submenu.put("compCode", "30"+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-coins"></i>
				</div>
				<div class="tile-status">
					<span class="name">Trésorerie-Paiements</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"></span>
					</div>
				</div>
			</div>
			<% }
			
			if (aav.checkPermission("40"+level, invContext)) {
			%>
			<div class="tile double bg-orange" data-ae-submenu='<%= submenu.put("compCode", "40"+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-radio-checked"></i>
				</div>
				<div class="tile-status">
					<span class="name">ENCAISSEMENTS A REVERSER</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"></span>
					</div>
				</div>
			</div>
			<% } %>

	<% } else if (compCode.equals("20a2")) { //XXX 20 #################################################################### %>
		<% 
			AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);
			aav.setMask(AuthPermission.READ);
			if (aav.checkPermission("50"+level, invContext)) {
			%>
			<div class="tile double bg-darkBlue" data-ae-submenu='<%= submenu.put("compCode", "50"+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-enter"></i>
				</div>
				<div class="tile-status">
					<span class="name">Recettes</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"></span>
					</div>
				</div>
			</div>
			<% }
			
			if (aav.checkPermission("60"+level, invContext)) {
			%>
			<div class="tile double bg-lightRed" data-ae-submenu='<%= submenu.put("compCode", "60"+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-exit"></i>
				</div>
				<div class="tile-status">
					<span class="name">Dépenses</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"></span>
					</div>
				</div>
			</div>
			<% }
			
			if (aav.checkPermission("70"+level, invContext)) {
			%>
			<div class="tile double bg-lightOlive" data-ae-submenu='<%= submenu.put("compCode", "70"+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-coins"></i>
				</div>
				<div class="tile-status">
					<span class="name">Trésorerie-Paiements</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"></span>
					</div>
				</div>
			</div>
			<% }
			
			if (aav.checkPermission("80"+level, invContext)) {
			%>
			<div class="tile double bg-orange" data-ae-submenu='<%= submenu.put("compCode", "80"+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-radio-checked"></i>
				</div>
				<div class="tile-status">
					<span class="name">ENCAISSEMENTS A REVERSER</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"></span>
					</div>
				</div>
			</div>
			<% } %>		
	<% } else if (compCode.equals("25a2")) { //XXX 30 #################################################################### %>
			
	<% } else if (compCode.equals("30a2")) { //XXX 30 #################################################################### %>
		
	<% } else if (compCode.equals("40a2")) { //XXX 40 #################################################################### %>
		
	<% } else if (compCode.equals("50a2")) { //XXX 50 ################################################### %>
		
	<% } else if (compCode.equals("60a2")) { //XXX 60 ################################################### %>
		
	<% } else if (compCode.equals("70a2")) { //XXX 70 ################################################### %>
		
	<% } %>
		</div>
	</div>
		<%
    } catch (Throwable t) {
    	session.invalidate();
    }
 	
    %>
