<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%><%@page import="eu.agileeng.services.ServiceLocator, eu.agileeng.services.acc.AccService, eu.agileeng.security.AuthPrincipal, eu.agileeng.util.http.HttpUtil, eu.agileeng.services.AEInvocationContext, eu.agileeng.services.imp.AEInvocationContextImp, eu.agileeng.services.AEInvocationContextValidator"%>
<%
 	String tip = "";
    try {
	    AuthPrincipal ap = (AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL);
		AEInvocationContext invContext = new AEInvocationContextImp(ap);
		AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
		invContextValidator.validate(invContext);
		AccService accService = (AccService) ServiceLocator.getInstance().getService(ServiceLocator.Services.ACC_SERVICE);
		tip = accService.loadTip();
    } catch (Throwable t) {
    	response.sendRedirect("/");
    	tip = "";
    }
%>
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
	<link rel="icon" type="image/x-icon" href="favicon.ico" />
    <title>Zachée</title>
	<link type="text/css" rel="stylesheet" href="resources/css/MaParoisse.css">
    <!-- The line below must be kept intact for Sencha Cmd to build your application -->
    <script id="microloader" type="text/javascript" src="bootstrap.js"></script>
    
    <script type="text/javascript" src="lib/metroui/js/jquery/jquery.min.js"></script>
	<script type="text/javascript" src="lib/metroui/js/jquery/jquery.widget.min.js"></script>
	<script type="text/javascript" src="lib/metroui/js/metro/metro.min.js"></script>
	<script type="text/javascript" src="resources/plugins/notification.js"></script>
	
	<link type="text/css" rel="stylesheet" href="lib/metroui/css/metro-bootstrap.css">
	<link type="text/css" rel="stylesheet" href="lib/metroui/css/metro-bootstrap-responsive.css">
	<link type="text/css" href="lib/metroui/css/iconFont.min.css" rel="stylesheet">
<!-- 	<link type="text/css" href="style.css" rel="stylesheet"> -->
	

</head>
<body>
	<div id="ae-loader">
		<%=tip%>
		<div id="ae-win-loader">
			<div class="circle first"></div>
			<div class="circle second"></div>
			<div class="circle third"></div>
			<div class="circle fourth"></div>
			<div class="circle fifth"></div>
		</div>
	</div>
</body>
</html>
