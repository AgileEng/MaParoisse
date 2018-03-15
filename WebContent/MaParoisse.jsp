<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%><%@page import="eu.agileeng.security.AuthPrincipal, eu.agileeng.util.http.HttpUtil, eu.agileeng.services.AEInvocationContext, eu.agileeng.services.imp.AEInvocationContextImp, eu.agileeng.services.AEInvocationContextValidator"%>
    <%
    try {
	    AuthPrincipal ap = (AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL);
		AEInvocationContext invContext = new AEInvocationContextImp(ap);
		AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
		invContextValidator.validate(invContext);
    } catch (Throwable t) {
    	response.sendRedirect("/");
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
		<h2 class="heading">Un homme nommé Zachée</h2>
		Jésus traversait la ville de Jéricho. Or, il y avait un homme du nom de Zachée ; il était le chef des collecteurs d’impôts, et c’était quelqu’un de riche. 
		Il cherchait à voir qui était Jésus, mais il n’y arrivait pas à cause de la foule, car il était de petite taille. 
		Il courut donc en avant et grimpa sur un sycomore pour voir Jésus qui devait passer par là. Arrivé à cet endroit, Jésus leva les yeux et l’interpella : 
		&laquo; Zachée, descends vite : aujourd’hui il faut que j’aille demeurer dans ta maison. &raquo; Vite, il descendit, et reçut Jésus avec joie. 
		Voyant cela, tous récriminaient : &laquo; Il est allé loger chez un pécheur. &raquo; Mais Zachée, s’avançant, dit au Seigneur : 
		&laquo; Voilà, Seigneur : je fais don aux pauvres de la moitié de mes biens, et si j’ai fait du tort à quelqu’un, je vais lui rendre quatre fois plus. 
		&raquo; Alors Jésus dit à son sujet : &laquo; Aujourd’hui, le salut est arrivé pour cette maison, car lui aussi est un fils d’Abraham. &raquo;
		<span class="span">Saint Luc 19, 1-10</span>
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
