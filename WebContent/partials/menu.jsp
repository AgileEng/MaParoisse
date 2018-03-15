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
		
		JSONObject submenu = new JSONObject();
		submenu.put("jsp", "submenu-a");
		
		String level = "a1";
		
		AuthAccessValidator aav = new AuthAccessValidator("MaParoisse/");
		aav.setModules(authAccessService.getAvailableModules(invContext));
		aav.setMask(AuthPermission.READ);
		%>
		
		<% if (aav.checkPermission(10+level, invContext)) { %>
	<div class="metro ae-overflow-hidden">
		<div class="ae-padded ae-animated">
			<div class="tile double bg-cobalt" data-ae-submenu='<%= submenu.put("compCode", 10+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-diary"></i>
				</div>
				<div class="tile-status">
					<span class="name">SAISIR</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description">Ecritures en comptabilité</span>
					</div>
				</div>
			</div>
			<% }
				
			if (aav.checkPermission(20+level, invContext)) {
			%>
			<div class="tile double bg-darkViolet" data-ae-submenu='<%= submenu.put("compCode", 20+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-cabinet"></i>
				</div>
				<div class="tile-status">
					<span class="name">BIBLIOTHEQUE</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description">Consulter - Maquettes</span>
					</div>
				</div>
			</div>
			<% }
				
			if (aav.checkPermission(30+level, invContext)) {
			%>
			<div class="tile double bg-lightGreen" data-ae-submenu='<%= submenu.put("compCode", 30+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-bars"></i>
				</div>
				<div class="tile-status">
					<span class="name">GERER</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description">Prévisionnel  - Le suivi</span>
					</div>
				</div>
			</div>
			<% }
				
			if (aav.checkPermission(40+level, invContext)) {
			%>
			<div class="tile double bg-orange" data-ae-submenu='<%= submenu.put("compCode", 40+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-files"></i>
				</div>
				<div class="tile-status">
					<span class="name">LES RECUS</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description">Reçus fiscaux de fin d'année</span>
					</div>
				</div>
			</div>
			<% }
				
			if (aav.checkPermission(50+level, invContext)) {
			%>
			<div class="tile double bg-amber" data-ae-submenu='<%= submenu.put("compCode", 50+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-user-3"></i>
				</div>
				<div class="tile-status">
					<span class="name">LE PERSONNEL</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description">Embauche & Contrats</span>
					</div>
				</div>
			</div>
			<% }
				
			if (aav.checkPermission(60+level, invContext)) {
			%>
			<div class="tile double bg-mauve" data-ae-submenu='<%= submenu.put("compCode", 60+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-cog"></i>
				</div>
				<div class="tile-status">
					<span class="name">PARAMETRAGES</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description">Identité, Démarrage & clôture</span>
					</div>
				</div>
			</div>
			<% }
				
// 			if (aav.checkPermission(70+level, invContext)) {
			%> 
<%-- 			<div class="tile double bg-magenta" data-ae-submenu='<%= submenu.put("compCode", 70+level).toString() %>'> --%>
<!-- 				<div class="ae-subtile"> -->
<!-- 				 <div class="tile-content icon"> -->
<!-- 					<i class="icon-compass-2"></i> -->
<!-- 				</div> -->
<!-- 				<div class="tile-status"> -->
<!-- 					<span class="name">DEMONSTRATIONS</span> -->
<!-- 				</div> -->
<!-- 				</div> -->
<!-- 				<div class="ae-subtile"> -->
<!-- 					<div class="tile-content"> -->
<!-- 						<span class="ae-description">Vidéos & Guidage</span> -->
<!-- 					</div> -->
<!-- 				</div> -->
<!-- 			</div> -->
<%-- 			<% } --%>
			<%
			if (aav.checkPermission(80+level, invContext)) {
			%>
			<div class="tile double bg-magenta" data-ae-module="80a1">
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-compass-2"></i>
				</div>
				<div class="tile-status">
					<span class="name">AIDE</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"></span>
					</div>
				</div>
			</div>
			<% } %>
		</div>
	</div>
		
		<%
    } catch (Throwable t) {
    	//t.printStackTrace();
    	session.invalidate();
    }
 	
    %>
