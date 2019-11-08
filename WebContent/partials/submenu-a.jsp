<%@page import="eu.agileeng.security.AuthPermission"%>
<%@page import="eu.agileeng.services.ServiceLocator.Services"%>
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
		
		
		
		String nextLevel = "submenu-a-3";
		String level = "a2"; // next level code suffix
		String modules = "submenu-b";
		
		JSONObject submenu = new JSONObject();
		submenu.put("jsp", "submenu-b");
		
		String compCode = request.getParameter("compCode");
		%>
		
		
	<div class="metro ae-overflow-hidden">
		<div class="ae-padded ae-animated">
		<%
			if(compCode.equals("10a1")) { //XXX  Comp 10 ####################################################################
				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);
				aav.setMask(AuthPermission.READ);
				
		%>
			<% 
			if (aav.checkPermission(10+level, invContext)) { 
			%>
			<div class="tile double bg-magenta" data-ae-submenu='<%= submenu.put("jsp", nextLevel).put("compCode", 10+level).toString() %>'><% submenu.put("jsp", modules); %>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-compass-3"></i>
				</div>
				<div class="tile-status">
					<span class="name">SAISIE GUIDÉE CRÉATION</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"></span>
					</div>
				</div>
			</div>
			<% }
			
			if (aav.checkPermission(20+level, invContext)) { 
				%>
				<div class="tile double bg-magenta" data-ae-submenu='<%= submenu.put("jsp", nextLevel).put("compCode", 20+level).toString() %>'><% submenu.put("jsp", modules); %>
					<div class="ae-subtile">
					 <div class="tile-content icon">
						<i class="icon-compass-3"></i>
					</div>
					<div class="tile-status">
						<span class="name">SAISIE GUIDÉE</span>
					</div>
					</div>
					<div class="ae-subtile">
						<div class="tile-content">
							<span class="ae-description"></span>
						</div>
					</div>
				</div>
				<% }
			
			if (aav.checkPermission(25+level, invContext)) {
			%>
			<div class="tile double bg-cobalt" data-ae-module="25b2">
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-diary"></i>
				</div>
				<div class="tile-status">
					<span class="name">SAISIE</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description">MODE STANDARD</span>
					</div>
				</div>
			</div>
			<% }
			if (aav.checkPermission(40+level, invContext)) {
			%>
			<div class="tile double bg-yellow" data-ae-submenu='<%= submenu.put("compCode", 40+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-printer"></i>
				</div>
				<div class="tile-status">
					<span class="name">EDITER</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description">Consulter - Imprimer</span>
					</div>
				</div>
			</div>
			<% } if(aav.checkPermission("35b2", invContext, true)){
				%>
				<div class="tile double bg-steel" data-ae-module="35b2">
					<div class="ae-subtile">
					 <div class="tile-content icon">
						<i class="icon-tab"></i>
					</div>
					<div class="tile-status">
						<span class="name">POINTAGES</span>
					</div>
					</div>
					<div class="ae-subtile">
						<div class="tile-content">
							<span class="ae-description"></span>
						</div>
					</div>
				</div>
			<%} %>

	<% } else if (compCode.equals("20a1")) { //XXX 20 #################################################################### 
		AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);
		aav.setMask(AuthPermission.READ);
	%>
		
		<%
		if (aav.checkPermission(50+level, invContext)) {
		%>
		<div class="tile double bg-cobalt" data-ae-submenu='<%= submenu.put("compCode", 50+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-drawer-2"></i>
				</div>
				<div class="tile-status">
					<span class="name">Documentation utile</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"></span>
					</div>
				</div>
			</div>
			<% }
				
			if (aav.checkPermission(60+level, invContext)) {
			%>
			<div class="tile double bg-orange" data-ae-submenu='<%= submenu.put("compCode", 60+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-stats-2"></i>
				</div>
				<div class="tile-status">
					<span class="name">Maquettes utilisables</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"></span>
					</div>
				</div>
			</div>
			<% }
				
			if (aav.checkPermission(70+level, invContext)) {
			%>
			<div class="tile double bg-mauve" data-ae-submenu='<%= submenu.put("compCode", 70+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-cabinet"></i>
				</div>
				<div class="tile-status">
					<span class="name">Bibliothèque</span>
				</div>
				</div>
				<%
				//statements added Update 11.2019
				if(ap.getAppType().equals(AuthPrincipal.AppType.mense)){
					%>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description">Bibliothèque de la Communauté</span><!-- Remaned from "Bibliothèque de la Fabrique" to "Bibliothèque de la Communauté" Update 11.2019 -->
					</div>
				</div>
				<%}else if(ap.getAppType().equals(AuthPrincipal.AppType.fabrique)){
				%>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description">Bibliothèque de la Fabrique</span><!-- Remaned from "Bibliothèque de la Fabrique" to "Bibliothèque de la Communauté" Update 11.2019 -->
					</div>
				</div>
				<%} %>
			</div>
			<% }
				
			if (aav.checkPermission(80+level, invContext)) {
			%>
			<div class="tile double bg-yellow" data-ae-submenu='<%= submenu.put("compCode", 80+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-tab"></i>
				</div>
				<div class="tile-status">
					<span class="name">EDITER</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description">Consulter - Imprimer</span>
					</div>
				</div>
			</div>
			<% } %>
	<% } else if (compCode.equals("30a1")) { //XXX 30 ####################################################################
		AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);
		aav.setMask(AuthPermission.READ);
		%>
	
			<%	
			if (aav.checkPermission(90+level, invContext)) {
			%>
		<div class="tile double bg-violet" data-ae-submenu='<%= submenu.put("compCode", 90+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-stats-up"></i>
				</div>
				<div class="tile-status">
					<span class="name">Prévisionnel</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"> </span>
					</div>
				</div>
			</div>
			<% }
				
			if (aav.checkPermission(100+level, invContext)) {
			%>
			<div class="tile double bg-cobalt" data-ae-submenu='<%= submenu.put("compCode", 100+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-eye"></i>
				</div>
				<div class="tile-status">
					<span class="name">Suivi &amp; Comparaison</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"> </span>
					</div>
				</div>
			</div>
			<% }
				
			if (aav.checkPermission(110+level, invContext)) {
			%>
			<div class="tile double bg-lightOlive" data-ae-submenu='<%= submenu.put("compCode", 110+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-coins"></i>
				</div>
				<div class="tile-status">
					<span class="name">Les Reversements</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"> </span>
					</div>
				</div>
			</div>
			<% }
				
			//if (aav.checkPermission(120+level, invContext)) {
			%>
			<!-- <div class="tile double bg-yellow">
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-printer"></i>
				</div>
				<div class="tile-status">
					<span class="name">EDITER</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description">Consulter - Imprimer</span>
					</div>
				</div>
			</div> -->
			<%// } %>
	<% } else if (compCode.equals("40a1")) { //XXX 40 #################################################################### 
				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);
				aav.setMask(AuthPermission.READ);
			%>
	
			<%-- <%
				
			if (aav.checkPermission(130+level, invContext)) {
			%> --%>
		<%-- <div class="tile double bg-red" data-ae-submenu='<%= submenu.put("compCode", 130+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-heart"></i>
				</div>
				<div class="tile-status">
					<span class="name">Les Donateurs</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"> </span>
					</div>
				</div>
			</div> --%>
			<%
			if (aav.checkPermission("230b3", invContext, true)) {
			%>
		<div class="tile double bg-olive" data-ae-module="230b3">
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-user-3"></i>
				</div>
				<div class="tile-status">
					<span class="name"></span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description">Table des personnes  &#47; des donateurs</span>
					</div>
				</div>
			</div>
			<% } 
			
			if (aav.checkPermission("240b3", invContext, true)) {
			%>
			<div class="tile double bg-cobalt" data-ae-module="240b3">
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-stats-up"></i>
				</div>
				<div class="tile-status">
					<span class="name"></span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description">Table des dons annuels</span>
					</div>
				</div>
			</div>
			<% }
			if (aav.checkPermission(140+level, invContext)) {
			%>
			<div class="tile double bg-darkIndigo" data-ae-module="140a2">
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-printer"></i>
				</div>
				<div class="tile-status">
					<span class="name">Edition - Impression</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"> </span>
					</div>
				</div>
			</div>
			<% } %>
	<% } else if (compCode.equals("50a1")) { //XXX 50 ################################################### 
				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);
				aav.setMask(AuthPermission.READ);
			%>
	
			<%	
			if (aav.checkPermission(150+level, invContext)) {
			%>
		<div class="tile double bg-cobalt" data-ae-module="150a2">
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-user-3"></i>
				</div>
				<div class="tile-status">
					<span class="name">Embauche - Contrats</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"> </span>
					</div>
				</div>
			</div>
			<% }
				
			if (aav.checkPermission(160+level, invContext)) {
			%>
			<div class="tile double bg-red" data-ae-submenu='<%= submenu.put("compCode", 160+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-award-fill"></i>
				</div>
				<div class="tile-status">
					<span class="name">Certificats</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"> </span>
					</div>
				</div>
			</div>
			<% }
				
			if (aav.checkPermission(170+level, invContext)) {
			%>
			<div class="tile double bg-yellow" data-ae-module="170a2">
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-printer"></i>
				</div>
				<div class="tile-status">
					<span class="name">EDITER</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description">Consulter - Imprimer</span>
					</div>
				</div>
			</div>
			<% } %>
	<% } else if (compCode.equals("60a1")) { //XXX 60 ################################################### 
				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);
				aav.setMask(AuthPermission.READ);
			%>
	
			<%
				
			if (aav.checkPermission(180+level, invContext)) {
			%>
		<div class="tile double bg-darkViolet" data-ae-submenu='<%= submenu.put("compCode", 180+level).toString() %>'>
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-user-2"></i>
				</div>
				<div class="tile-status">
					<span class="name">Identité</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"> </span>
					</div>
				</div>
			</div>
			<% } %>
				
			<%
			if (aav.checkPermission("310b3", invContext, true)) {
			%>
		<div class="tile double bg-cyan" data-ae-module="310b3">
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-laptop"></i>
				</div>
				<div class="tile-status">
					<span class="name"></span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description">Plan de compte</span>
					</div>
				</div>
			</div>
			<% } 
			
			if (aav.checkPermission("315b3", invContext, true)) {
			%>
			<div class="tile double bg-cyan" data-ae-module="315b3">
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-laptop"></i>
				</div>
				<div class="tile-status">
					<span class="name"></span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description">Modèle plan comptable</span>
					</div>
				</div>
			</div>
			<% } 
			
			if (aav.checkPermission("320b3", invContext, true)) {
			%>
			<div class="tile double bg-amber" data-ae-module="320b3">
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-bars"></i>
				</div>
				<div class="tile-status">
					<span class="name">A nouveaux</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description">Report soldes comptables</span>
					</div>
				</div>
			</div>
			<% }if (aav.checkPermission("325b3", invContext, true)) {
				%>
				<div class="tile double bg-cobalt" data-ae-module="325b3">
					<div class="ae-subtile">
					 <div class="tile-content icon">
						<i class="icon-user"></i>
					</div>
					<div class="tile-status">
						<span class="name">Gestion des utilisateurs</span>
					</div>
					</div>
					<div class="ae-subtile">
						<div class="tile-content">
							<span class="ae-description"></span>
						</div>
					</div>
				</div>
			<% }if (aav.checkPermission("205a2", invContext, true)) {
				%>
				<div class="tile double bg-lightOrange" data-ae-module="205a2">
					<div class="ae-subtile">
					 <div class="tile-content icon">
						<i class="icon-calendar"></i>
					</div>
					<div class="tile-status">
						<span class="name">&nbsp;</span>
					</div>
					</div>
					<div class="ae-subtile">
						<div class="tile-content">
							<span class="ae-description">Clôture de l’exercice</span>
						</div>
					</div>
				</div>
			<% } %>
	<% } else if (compCode.equals("70a1")) { //XXX 70 ################################################### 
				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);
				aav.setMask(AuthPermission.READ);
			%>
		
			<%
			if (aav.checkPermission(210+level, invContext)) {
			%>
		<div class="tile double bg-green">
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-direction"></i>
				</div>
				<div class="tile-status">
					<span class="name">Saisie guidée</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"> </span>
					</div>
				</div>
			</div>
			<% }
				
			if (aav.checkPermission(220+level, invContext)) {
			%>
			<div class="tile double bg-taupe">
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-pencil"></i>
				</div>
				<div class="tile-status">
					<span class="name">Les éditions</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"> </span>
					</div>
				</div>
			</div>
			<% }
				
			if (aav.checkPermission(230+level, invContext)) {
			%>
			<div class="tile double bg-darkGreen">
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-dollar-2"></i>
				</div>
				<div class="tile-status">
					<span class="name">Les reversements</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"> </span>
					</div>
				</div>
			</div>
			<% }
				
			if (aav.checkPermission(240+level, invContext)) {
			%>
			<div class="tile double bg-darkIndigo">
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-stats-2"></i>
				</div>
				<div class="tile-status">
					<span class="name">Le prévisionnel</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"> </span>
					</div>
				</div>
			</div>
			<% }
				
			if (aav.checkPermission(250+level, invContext)) {
			%>
			<div class="tile double bg-red">
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-files"></i>
				</div>
				<div class="tile-status">
					<span class="name">Les reçus fiscaux</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"> </span>
					</div>
				</div>
			</div>
			<% }
				
			if (aav.checkPermission(260+level, invContext)) {
			%>
			<div class="tile double bg-steel">
				<div class="ae-subtile">
				 <div class="tile-content icon">
					<i class="icon-eye-2"></i>
				</div>
				<div class="tile-status">
					<span class="name">Les différents suivis</span>
				</div>
				</div>
				<div class="ae-subtile">
					<div class="tile-content">
						<span class="ae-description"> </span>
					</div>
				</div>
			</div>
			<% } %>
	<% } %>
		</div>
	</div>
		<%
    } catch (Throwable t) {
    	session.invalidate();
    }
 	
    %>
