<%@page import="eu.agileeng.security.AuthPermission"%>

<%@ page language="java" contentType="text/html; charset=UTF-8"

     pageEncoding="UTF-8"%><%@page import="eu.agileeng.security.AuthPrincipal, eu.agileeng.util.http.HttpUtil, eu.agileeng.services.AEInvocationContext, eu.agileeng.services.imp.AEInvocationContextImp, eu.agileeng.services.AEInvocationContextValidator, eu.agileeng.services.auth.AuthAccessService, eu.agileeng.services.auth.AuthAccessValidator, eu.agileeng.services.ServiceLocator, eu.agileeng.domain.contact.Organization"%>

    <%@page import="org.apache.tomcat.util.json.JSONObject,org.apache.tomcat.util.json.JSONArray"%>

    <%

    try {

	    AuthPrincipal ap = (AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL);

		AEInvocationContext invContext = new AEInvocationContextImp(ap);

		AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();

		invContextValidator.validate(invContext);

		

		AuthAccessService authAccessService = 

				(AuthAccessService) ServiceLocator.getInstance().getService(ServiceLocator.Services.AUTH_ACCESS);

		

		//JSONObject submenu = new JSONObject();

		//submenu.put("jsp", "submenu-b");

		

		String compCode = request.getParameter("compCode");

		%>

		

		

	<div class="metro ae-overflow-hidden">

		<div class="ae-padded ae-animated">

		<%

			if(compCode.equals("10a3")) { //XXX  Comp 10 ############################################################

				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

				aav.setMask(AuthPermission.READ);

		%>

		<% if (aav.checkPermission("340b4", invContext, true)) { %>

		<div class="tile double bg-cyan" data-ae-module="340b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-enter"></i>

				</div>

				<div class="tile-status">

					<span class="name">Quêtes ordinaires</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 


			//statement added Update 11.2019
			if (aav.checkPermission("350b4", invContext, true) && ap.getAppType().equals(Organization.AppType.fabrique)) {

			%>

			<div class="tile double bg-cyan" data-ae-module="350b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-enter"></i>

				</div>

				<div class="tile-status">

					<span class="name">Droits de la Fabrique</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			
			//statement added Update 11.2019
			if (aav.checkPermission("360b4", invContext, true) && ap.getAppType().equals(Organization.AppType.fabrique)) {

			%>

			<div class="tile double bg-cyan" data-ae-module="360b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-enter"></i>

				</div>

				<div class="tile-status">

					<span class="name">Quêtes particulières</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Selon plan du diocèse: quêtes chauffage, bancs…</span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("370b4", invContext, true)) {

			%>

			<div class="tile double bg-cyan" data-ae-module="370b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-enter"></i>

				</div>

				<div class="tile-status">

					<span class="name">Dons avec reçu</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("380b4", invContext, true)) {

			%>

			<div class="tile double bg-cyan" data-ae-module="380b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-enter"></i>

				</div>

				<div class="tile-status">

					<span class="name">Troncs et dons sans reçus</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("390b4", invContext, true)) {

			%>

			<div class="tile double bg-cyan" data-ae-module="390b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-enter"></i>

				</div>

				<div class="tile-status">

					<span class="name">Recettes exceptionnelles</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("394b4", invContext, true)) {

				%>

				<div class="tile double bg-cyan" data-ae-module="394b4">

					<div class="ae-subtile">

					 <div class="tile-content icon">

						<i class="icon-enter"></i>

					</div>

					<div class="tile-status">

						<span class="name">Produits financier</span>

					</div>

					</div>

					<div class="ae-subtile">

						<div class="tile-content">

							<span class="ae-description"></span>

						</div>

					</div>

				</div>

			<% }



			if (aav.checkPermission("397b4", invContext, true)) {

				%>

				<div class="tile double bg-cyan" data-ae-module="397b4">

					<div class="ae-subtile">

					 <div class="tile-content icon">

						<i class="icon-enter"></i>

					</div>

					<div class="tile-status">

						<span class="name">Produits accessories</span>

					</div>

					</div>

					<div class="ae-subtile">

						<div class="tile-content">

							<span class="ae-description"></span>

						</div>

					</div>

				</div>

			<% } %>

	<% } else if (compCode.equals("20a3")) { //XXX 20 ############################################################# 

				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

				aav.setMask(AuthPermission.READ);

		%>

		

			<%

			if (aav.checkPermission("400b4", invContext, true)) {

			%>

		<div class="tile double bg-darkPink" data-ae-module="400b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-exit"></i>

				</div>

				<div class="tile-status">

					<span class="name">Articles de culte</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("410b4", invContext, true)) {

			%>

			<div class="tile double bg-darkPink" data-ae-module="410b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-exit"></i>

				</div>

				<div class="tile-status">

					<span class="name">Fournitures</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("420b4", invContext, true)) {

			%>

			<div class="tile double bg-darkPink" data-ae-module="420b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-exit"></i>

				</div>

				<div class="tile-status">

					<span class="name">Combustible</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("430b4", invContext, true)) {

			%>

			<div class="tile double bg-darkPink" data-ae-module="430b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-exit"></i>

				</div>

				<div class="tile-status">

					<span class="name"> Electricite - Eau </span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("440b4", invContext, true)) {

			%>

			<div class="tile double bg-darkPink" data-ae-module="440b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-exit"></i>

				</div>

				<div class="tile-status">

					<span class="name">Autres fournitures </span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Petit matériel</span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("450b4", invContext, true)) {

			%>

			<div class="tile double bg-darkPink" data-ae-module="450b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-exit"></i>

				</div>

				<div class="tile-status">

					<span class="name">Fournitures de bureau</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("460b4", invContext, true)) {

			%>

			<div class="tile double bg-darkPink" data-ae-module="460b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-exit"></i>

				</div>

				<div class="tile-status">

					<span class="name">Articles de stand</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("470b4", invContext, true)) {

			%>

			<div class="tile double bg-darkPink" data-ae-module="470b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-exit"></i>

				</div>

				<div class="tile-status">

					<span class="name">Loyers</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">ChgLocatives</span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("480b4", invContext, true)) {

			%>

			<div class="tile double bg-darkPink" data-ae-module="480b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-exit"></i>

				</div>

				<div class="tile-status">

					<span class="name">Entretien réparation</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("490b4", invContext, true)) {

			%>

			<div class="tile double bg-darkPink" data-ae-module="490b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-exit"></i>

				</div>

				<div class="tile-status">

					<span class="name">Prime assurance</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("500b4", invContext, true)) {

			%>

			<div class="tile double bg-darkPink" data-ae-module="500b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-exit"></i>

				</div>

				<div class="tile-status">

					<span class="name">Documention- abonnement</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("510b4", invContext, true)) {

			%>

			<div class="tile double bg-darkPink" data-ae-module="510b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-exit"></i>

				</div>

				<div class="tile-status">

					<span class="name">Déplacement-Réception </span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("520b4", invContext, true)) {

			%>

			<div class="tile double bg-darkPink" data-ae-module="520b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-exit"></i>

				</div>

				<div class="tile-status">

					<span class="name">Frais postaux-téléphone</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("530b4", invContext, true)) {

			%>

			<div class="tile double bg-darkPink" data-ae-module="530b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-exit"></i>

				</div>

				<div class="tile-status">

					<span class="name">Frais Tenue compte</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("540b4", invContext, true)) {

			%>

			<div class="tile double bg-darkPink" data-ae-module="540b4">

				<div>

				 <div class="tile-content icon">

					<i class="icon-exit" style="left: 25% !important;"></i>

				</div>

				<div class="tile-status">

					<span class="name" style="text-transform: uppercase !important;">Cotisations, dons, subventions</span>

				</div>

				</div>

				<!-- <div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div> -->

			</div>

			<% } 

			

			if (aav.checkPermission("550b4", invContext, true)) {

			%>

			<div class="tile double bg-darkPink" data-ae-module="550b4">

				<div>

				 <div class="tile-content icon">

					<i class="icon-exit" style="left: 25% !important;"></i>

					<div class="tile-status">

						<span class="name" style="text-transform: uppercase !important;">Frais de Pastorale, Formation</span>

					</div>

				</div>

				</div>

				<!--<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div> -->

			</div>

			<% } 

			

			if (aav.checkPermission("560b4", invContext, true)) {

			%>

			<div class="tile double bg-darkPink" data-ae-module="560b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-exit"></i>

				</div>

				<div class="tile-status">

					<span class="name">Fonds Pastoral</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } %>

	<% } else if (compCode.equals("30a3")) { //XXX 30 ############################################################# 

				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

				aav.setMask(AuthPermission.READ);

		%>

			

			<%

			if (aav.checkPermission("570b4", invContext, true)) {

			%>

			<div class="tile double bg-lightOlive" data-ae-module="570b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-coins"></i>

				</div>

				<div class="tile-status">

					<span class="name">Dépôt en Banque</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">De la Caisse vers la Banque</span>

					</div>

				</div>

			</div>

			<% } 

			if (aav.checkPermission("580b4", invContext, true) && ap.getAppType().equals(Organization.AppType.fabrique)) {

			%>

			<div class="tile double bg-lightOlive" data-ae-module="580b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-coins"></i>

				</div>

				<div class="tile-status">

					<span class="name">REVERSEMENT DE QUETES</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Paiement à l'Archevêché</span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("590b4", invContext, true)) {

			%>

			<div class="tile double bg-lightOlive" data-ae-module="590b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-coins"></i>

				</div>

				<div class="tile-status">

					<span class="name">Paiement à l'Archevêché</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Autres sommes/ taxes versées</span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("600b4", invContext, true)) {

			%>

			<div class="tile double bg-lightOlive" data-ae-module="600b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-coins"></i>

				</div>

				<div class="tile-status">

					<span class="name">CASUELS</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Part célébrant / Intentions de messes / A verser</span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("610b4", invContext, true)) {

			%>

			<div class="tile double bg-emerald" data-ae-module="610b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-coins"></i>

				</div>

				<div class="tile-status">

					<span class="name">Droits reversés à la Fabrique</span>

				</div>

				</div>
				
				<%
				//statement added Update 11.2019
				if(ap.getAppType().equals(Organization.AppType.fabrique)){ %>
				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Pour les Menses</span>

					</div>

				</div>
				<%} %>

			</div>

			<% } %>

	<% } else if (compCode.equals("40a3")) { //XXX 40 ############################################################# 

				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

				aav.setMask(AuthPermission.READ);

		%>

		

			<%
			//statement added Update 11.2019
			if (aav.checkPermission("620b4", invContext, true) && ap.getAppType().equals(Organization.AppType.fabrique)) {

			%>

			<div class="tile double bg-orange" data-ae-module="620b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-radio-checked"></i>

				</div>

				<div class="tile-status">

					<span class="name">Intentions de Messe</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Paroisse - Fabrique; Mariages; enterrements… </span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("630b4", invContext, true)) {

			%>

			<div class="tile double bg-darkOrange" data-ae-module="630b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-radio-checked"></i>

				</div>

				<div class="tile-status">

					<span class="name">Intentions de Messe</span>

				</div>

				</div>
			<%
			//statement added Update 11.2019
			if (ap.getAppType().equals(Organization.AppType.fabrique)){
			%>
				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Menses- Communautés</span>

					</div>

				</div>
				<%} %>
			</div>

			<% } 

			
			//statement added Update 11.2019
			if (aav.checkPermission("640b4", invContext, true) && ap.getAppType().equals(Organization.AppType.fabrique)) {

			%>

			<div class="tile double bg-orange" data-ae-module="640b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-radio-checked"></i>

				</div>

				<div class="tile-status">

					<span class="name">QUETES A REVERSER</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("650b4", invContext, true)) {

			%>

			<div class="tile double bg-orange" data-ae-module="650b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-radio-checked"></i>

				</div>

				<div class="tile-status">

					<span class="name">Messes - Binage</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("660b4", invContext, true)) {

			%>

			<div class="tile double bg-orange" data-ae-module="660b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-radio-checked"></i>

				</div>

				<div class="tile-status">

					<span class="name">Messes - A célébrer</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } %>

	<% } else if(compCode.equals("50a3")) { //XXX  Comp 50a3 ############################################################

			AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

			aav.setMask(AuthPermission.READ);

	%>

	<% if (aav.checkPermission("670b4", invContext, true)) { %>

	<div class="tile double bg-cyan" data-ae-module="670b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-enter"></i>

			</div>

			<div class="tile-status">

				<span class="name">Quêtes ordinaires</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } 

		
		//statement added Update 11.2019
		if (aav.checkPermission("680b4", invContext, true) && ap.getAppType().equals(Organization.AppType.fabrique)) {

		%>

		<div class="tile double bg-cyan" data-ae-module="680b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-enter"></i>

			</div>

			<div class="tile-status">

				<span class="name">Droits de la Fabrique</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } 

		
		//statement added Update 11.2019
		if (aav.checkPermission("690b4", invContext, true) && ap.getAppType().equals(Organization.AppType.fabrique)) {

		%>

		<div class="tile double bg-cyan" data-ae-module="690b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-enter"></i>

			</div>

			<div class="tile-status">

				<span class="name">Quêtes particulières</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description">Selon plan du diocèse: quêtes chauffage, bancs…</span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("700b4", invContext, true)) {

		%>

		<div class="tile double bg-cyan" data-ae-module="700b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-enter"></i>

			</div>

			<div class="tile-status">

				<span class="name">Dons avec reçu</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("710b4", invContext, true)) {

		%>

		<div class="tile double bg-cyan" data-ae-module="710b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-enter"></i>

			</div>

			<div class="tile-status">

				<span class="name">Troncs et dons sans reçus</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("720b4", invContext, true)) {

		%>

		<div class="tile double bg-cyan" data-ae-module="720b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-enter"></i>

			</div>

			<div class="tile-status">

				<span class="name">Recettes exceptionnelles</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } 



		if (aav.checkPermission("723b4", invContext, true)) {

		%>

		<div class="tile double bg-cyan" data-ae-module="723b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-enter"></i>

			</div>

			<div class="tile-status">

				<span class="name">Produits financiers</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% }



		if (aav.checkPermission("727b4", invContext, true)) {

			%>

			<div class="tile double bg-cyan" data-ae-module="727b4">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-enter"></i>

				</div>

				<div class="tile-status">

					<span class="name">Produits accessoires</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

		<% } %>

	<% } else if (compCode.equals("60a3")) { //XXX 60a3 ############################################################# 

			AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

			aav.setMask(AuthPermission.READ);

	%>

	

		<%

		if (aav.checkPermission("730b4", invContext, true)) {

		%>

	<div class="tile double bg-darkPink" data-ae-module="730b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-exit"></i>

			</div>

			<div class="tile-status">

				<span class="name">Articles de culte</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("740b4", invContext, true)) {

		%>

		<div class="tile double bg-darkPink" data-ae-module="740b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-exit"></i>

			</div>

			<div class="tile-status">

				<span class="name">Fournitures</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("750b4", invContext, true)) {

		%>

		<div class="tile double bg-darkPink" data-ae-module="750b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-exit"></i>

			</div>

			<div class="tile-status">

				<span class="name">Combustible</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("760b4", invContext, true)) {

		%>

		<div class="tile double bg-darkPink" data-ae-module="760b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-exit"></i>

			</div>

			<div class="tile-status">

				<span class="name"> Electricite - Eau </span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("770b4", invContext, true)) {

		%>

		<div class="tile double bg-darkPink" data-ae-module="770b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-exit"></i>

			</div>

			<div class="tile-status">

				<span class="name">Autres fournitures </span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description">Petit matériel</span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("780b4", invContext, true)) {

		%>

		<div class="tile double bg-darkPink" data-ae-module="780b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-exit"></i>

			</div>

			<div class="tile-status">

				<span class="name">Fournitures de bureau</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("790b4", invContext, true)) {

		%>

		<div class="tile double bg-darkPink" data-ae-module="790b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-exit"></i>

			</div>

			<div class="tile-status">

				<span class="name">Articles de stand</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("800b4", invContext, true)) {

		%>

		<div class="tile double bg-darkPink" data-ae-module="800b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-exit"></i>

			</div>

			<div class="tile-status">

				<span class="name">Loyers</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description">ChgLocatives</span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("810b4", invContext, true)) {

		%>

		<div class="tile double bg-darkPink" data-ae-module="810b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-exit"></i>

			</div>

			<div class="tile-status">

				<span class="name">Entretien réparation</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("820b4", invContext, true)) {

		%>

		<div class="tile double bg-darkPink" data-ae-module="820b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-exit"></i>

			</div>

			<div class="tile-status">

				<span class="name">Prime assurance</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("830b4", invContext, true)) {

		%>

		<div class="tile double bg-darkPink" data-ae-module="830b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-exit"></i>

			</div>

			<div class="tile-status">

				<span class="name">Documention- abonnement</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("840b4", invContext, true)) {

		%>

		<div class="tile double bg-darkPink" data-ae-module="840b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-exit"></i>

			</div>

			<div class="tile-status">

				<span class="name">Déplacement-Réception</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"> </span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("850b4", invContext, true)) {

		%>

		<div class="tile double bg-darkPink" data-ae-module="850b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-exit"></i>

			</div>

			<div class="tile-status">

				<span class="name">Frais postaux-téléphone</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("860b4", invContext, true)) {

		%>

		<div class="tile double bg-darkPink" data-ae-module="860b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-exit"></i>

			</div>

			<div class="tile-status">

				<span class="name">Frais Tenue compte</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("870b4", invContext, true)) {

		%>

		<div class="tile double bg-darkPink" data-ae-module="870b4">

			<div>

			 <div class="tile-content icon">

				<i class="icon-exit" style="left: 25% !important;"></i>

			</div>

			<div class="tile-status">

				<span class="name" style="text-transform: uppercase !important;">Cotisations, dons, subventions</span>

			</div>

			</div>

			<!-- <div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div> -->

		</div>

		<% } 

		

		if (aav.checkPermission("880b4", invContext, true)) {

		%>

		<div class="tile double bg-darkPink" data-ae-module="880b4">

			<div>

			 <div class="tile-content icon">

				<i class="icon-exit" style="left: 25% !important;"></i>

			</div>

			<div class="tile-status">

				<span class="name" style="text-transform: uppercase !important;">Frais de Pastorale, Formation</span>

			</div>

			</div>

			<!-- <div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div> -->

		</div>

		<% } 

		

		if (aav.checkPermission("890b4", invContext, true)) {

		%>

		<div class="tile double bg-darkPink" data-ae-module="890b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-exit"></i>

			</div>

			<div class="tile-status">

				<span class="name">Fonds Pastoral</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } %>

	<% } else if (compCode.equals("70a3")) { //XXX 70a3 ############################################################# 

			AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

			aav.setMask(AuthPermission.READ);

	%>

		

		<%

		if (aav.checkPermission("900b4", invContext, true)) {

		%>

		<div class="tile double bg-lightOlive" data-ae-module="900b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-coins"></i>

			</div>

			<div class="tile-status">

				<span class="name">Dépôt en Banque</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description">De la Caisse vers la Banque</span>

				</div>

			</div>

		</div>

		<% } 

		
		//Statement added Update 11.2019
		if (aav.checkPermission("910b4", invContext, true) && ap.getAppType().equals(Organization.AppType.fabrique)) {

		%>

		<div class="tile double bg-lightOlive" data-ae-module="910b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-coins"></i>

			</div>

			<div class="tile-status">

				<span class="name">REVERSEMENT DE QUETES</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description">Paiement à l'Archevêché</span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("920b4", invContext, true)) {

		%>

		<div class="tile double bg-lightOlive" data-ae-module="920b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-coins"></i>

			</div>

			<div class="tile-status">

				<span class="name">Paiement à l'Archevêché</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description">Autres sommes/ taxes versées</span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("930b4", invContext, true)) {

		%>

		<div class="tile double bg-lightOlive" data-ae-module="930b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-coins"></i>

			</div>

			<div class="tile-status">

				<span class="name">CASUELS</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description">Part célébrant / Intentions de messes / A verser</span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("940b4", invContext, true)) {

		%>

		<div class="tile double bg-emerald" data-ae-module="940b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-coins"></i>

			</div>

			<div class="tile-status">

				<span class="name">Droits reversés à la Fabrique</span>

			</div>

			</div>
			<%
			//statement added Update 11.2019
			if (ap.getAppType().equals(Organization.AppType.fabrique)){
			%>
			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description">Pour les Menses</span>

				</div>

			</div> -->
			<%}%>
		</div>

		<% } %>

	<% } else if (compCode.equals("80a3")) { //XXX 80a3 ############################################################# 

			AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

			aav.setMask(AuthPermission.READ);

	%>

	

		<%
		//statement added Update 11.2019
		if (aav.checkPermission("950b4", invContext, true) && ap.getAppType().equals(Organization.AppType.fabrique)) {

		%>

		<div class="tile double bg-orange" data-ae-module="950b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-radio-checked"></i>

			</div>

			<div class="tile-status">

				<span class="name">Intentions de Messe</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description">Paroisse - Fabrique; Mariages; enterrements… </span>

				</div>

			</div>

		</div> 

		<% } 

		

		if (aav.checkPermission("960b4", invContext, true)) {

		%>

		<div class="tile double bg-darkOrange" data-ae-module="960b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-radio-checked"></i>

			</div>

			<div class="tile-status">

				<span class="name">Intentions de Messe</span>

			</div>

			</div>
			<%
			//statement added Update 11.2019
			if(ap.getAppType().equals(Organization.AppType.fabrique)){
			%>
			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description">Menses- Communautés</span>

				</div>

			</div>
			<%}%>
		</div>
		
		<%} 

		if (aav.checkPermission("970b4", invContext, true) && ap.getAppType().equals(Organization.AppType.fabrique)) {

		%>

		<div class="tile double bg-orange" data-ae-module="970b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-radio-checked"></i>

			</div>

			<div class="tile-status">

				<span class="name">QUETES A REVERSER</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("980b4", invContext, true)) {

		%>

		<div class="tile double bg-orange" data-ae-module="980b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-radio-checked"></i>

			</div>

			<div class="tile-status">

				<span class="name">Messes - Binage</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } 

		

		if (aav.checkPermission("990b4", invContext, true)) {

		%>

		<div class="tile double bg-orange" data-ae-module="990b4">

			<div class="ae-subtile">

			 <div class="tile-content icon">

				<i class="icon-radio-checked"></i>

			</div>

			<div class="tile-status">

				<span class="name">Messes - A célébrer</span>

			</div>

			</div>

			<div class="ae-subtile">

				<div class="tile-content">

					<span class="ae-description"></span>

				</div>

			</div>

		</div>

		<% } %>

	<% } else if (compCode.equals("40a2")) { //XXX 40a2 ############################################################# 

				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

				aav.setMask(AuthPermission.READ);

		%>

	

			<%

			if (aav.checkPermission("10b3", invContext, true)) {

			%>

		<div class="tile double bg-green" data-ae-module="10b3" data-ae-xtype="docgenwindow">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-coins"></i>

				</div>

				<div class="tile-status">

					<span class="name">Compte de résultat </span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("20b3", invContext, true)) {

			%>

			<div class="tile double bg-lightBlue" data-ae-module="20b3" data-ae-xtype="docgenwindow">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-tab"></i>

				</div>

				<div class="tile-status">

					<span class="name">Bilan</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("30b3", invContext, true)) {

			%>

			<div class="tile double bg-lightGreen" data-ae-module="30b3" data-ae-xtype="docgenwindow">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-dollar"></i>

				</div>

				<div class="tile-status">

					<span class="name">Balance</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("40b3", invContext, true)) {

			%>

			<div class="tile double bg-teal" data-ae-module="40b3" data-ae-xtype="docgenwindow">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-diary"></i>

				</div>

				<div class="tile-status">

					<span class="name">Grand-Livre &amp; Compte</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("50b3", invContext, true)) {

			%>

			<div class="tile double bg-magenta" data-ae-module="50b3" data-ae-xtype="docgenwindow">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-book"></i>

				</div>

				<div class="tile-status">

					<span class="name">Journaux</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if(aav.checkPermission("30b2", invContext, true)){

			%>

			<div class="tile double bg-orange" data-ae-module="30b2">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-tab"></i>

				</div>

				<div class="tile-status">

					<span class="name">Consulter</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<%} %>

	<% } else if (compCode.equals("50a2")) { //XXX 50a2 ############################################################# 

				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

				aav.setMask(AuthPermission.READ);

		%>

	

			<%

			if (aav.checkPermission("60b3", invContext, true)) {

			%>

		<div class="tile double bg-emerald" data-ae-link="http://www.diocese-alsace.fr/">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-direction"></i>

				</div>

				<div class="tile-status">

					<span class="name">Guide Administratif</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Enterrement, mariage, messes…</span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("70b3", invContext, true)) {

			%>

			<div class="tile double bg-orange" data-ae-module="70b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-stats"></i>

				</div>

				<div class="tile-status">

					<span class="name">Le plan des comptes</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("80b3", invContext, true)) {

			%>

			<div class="tile double bg-lightBlue" data-ae-module="80b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-book"></i>

				</div>

				<div class="tile-status">

					<span class="name">Formation à la comptabilité</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Le trésorier d'une Fabrique</span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("90b3", invContext, true)) {

			%>

			<div class="tile double bg-gray" data-ae-module="90b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-briefcase"></i>

				</div>

				<div class="tile-status">

					<span class="name">Fabriques &amp; Menses</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">leur spécificité</span>

					</div>

				</div>

			</div>

			<% } %>

	<% } else if (compCode.equals("60a2")) { //XXX 60a2 ############################################################# 

				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

				aav.setMask(AuthPermission.READ);

		%>

		

			<%

			if (aav.checkPermission("100b3", invContext, true)) {

			%>

		<div class="tile double bg-crimson" data-ae-module="100b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-clipboard-2"></i>

				</div>

				<div class="tile-status">

					<span class="name"> </span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Feuille de comptage pour une quête</span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("110b3", invContext, true)) {

			%>

			<div class="tile double bg-mauve" data-ae-module="110b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-bars"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Totaliser les messes du mois (intentions,mariage…)</span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("120b3", invContext, true)) {

			%>

			<div class="tile double bg-darkBlue" data-ae-module="120b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-cube"></i>

				</div>

				<div class="tile-status">

					<span class="name">Immobiliser</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Immobiliser - Amortir un bien</span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("130b3", invContext, true)) {

			%>

			<div class="tile double bg-lightOlive" data-ae-module="130b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-coins"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Etaler une subvention d'équipement </span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("140b3", invContext, true)) {

			%>

			<div class="tile double bg-darkMagenta" data-ae-module="140b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-stats-2"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Etaler une charge sur plusieurs années (plusieurs exercices)</span>

					</div>

				</div>

			</div>

			<% } if (aav.checkPermission("145b3", invContext, true)) {

			%>

			<div class="tile double bg-gray" data-ae-module="145b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-stats"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Démarches de la Fabrique</span>

					</div>

				</div>

			</div>

			<% } %>

	<% } else if (compCode.equals("70a2")) { //XXX 70a2 ############################################################# 

				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

				aav.setMask(AuthPermission.READ);

		%>

		

			<%

			if (aav.checkPermission("150b3", invContext, true)) {

			%>

		<div class="tile double bg-indigo" data-ae-module="150b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-file-4"></i>

				</div>

				<div class="tile-status">

					<span class="name">Contrats de bail</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("160b3", invContext, true)) {

			%>

			<div class="tile double bg-red" data-ae-module="160b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-list"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">...tableau d'emprunt…</span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("163b3", invContext, true)) {

			%>

			<div class="tile double bg-steel" data-ae-module="163b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-book"></i>

				</div>

				<div class="tile-status">

					<span class="name">DOCUMENTS ADMINISTRATIFS</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } if (aav.checkPermission("166b3", invContext, true)) {

			%>

			<div class="tile double bg-olive" data-ae-module="166b3">

				<div class="ae-subtile" style="width: 90%;">

				 <div class="tile-content icon" style="float:left; width: 56px; margin-left: 25px;">

					<i class="icon-calculate"></i>

				</div>

				<div class="tile-status">

					<span class="name" style="text-align: left; margin-left: 10px !important;">DOCUMENTS COMPTABLES ET FINANCIERS</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"></span>

					</div>

				</div>

			</div>

			<% } %>

	<% } else if (compCode.equals("80a2")) { //XXX 80a2 ############################################################# 

				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

				aav.setMask(AuthPermission.READ);

		%>

	

			<%

			if (aav.checkPermission("170b3", invContext, true)) {

			%>

		<div class="tile double bg-darkViolet" data-ae-module="170b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-attachment"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Les documents scannés, rattachés</span>

					</div>

				</div>

			</div>

			<% }

				if (aav.checkPermission("175b3", invContext, true)) {

			%>

				<div class="tile double bg-darkViolet" data-ae-module="175b3">

					<div class="ae-subtile">

					 <div class="tile-content icon">

						<i class="icon-folder-2"></i>

					</div>

					<div class="tile-status">

						<span class="name"></span>

					</div>

					</div>

					<div class="ae-subtile">

						<div class="tile-content">

							<span class="ae-description">Documents de cloture & Reçus fiscaux</span>

						</div>

					</div>

				</div>

			<% } %>

	<% } else if (compCode.equals("90a2")) { //XXX 90a2 ############################################################# 

				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

				aav.setMask(AuthPermission.READ);

		%>

	

			<%

			if (aav.checkPermission("180b3", invContext, true)) {

			%>

		<div class="tile double bg-lightBlue" data-ae-module="180b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-stats-2"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Saisir le budget prévisionnel</span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("190b3", invContext, true)) {

			%>

			<div class="tile double bg-lightOlive" data-ae-module="190b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-coins"></i>

				</div>

				<div class="tile-status">

					<span class="name">Suivi</span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">le réalisé - le budget </span>

					</div>

				</div>

			</div>

			<% 

			}

			%>

	

	<% } else if (compCode.equals("100a2")) { //XXX 100a2 ############################################################# 

				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

				aav.setMask(AuthPermission.READ);

		%>

		

			<%

			if (aav.checkPermission("200b3", invContext, true)) {

			%>

		<div class="tile double bg-lightBlue" data-ae-module="200b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-stats"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"><%--Les quêtes annuelles pour la paroisse--%>Chauffage</span>

					</div>

				</div>

			</div>

			<% } 

			if (aav.checkPermission("203b3", invContext, true)) {

			%>

			<div class="tile double bg-olive" data-ae-module="203b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-stats"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Quêtes ordinaires</span>

					</div>

				</div>

			</div>

			<% }

			if (aav.checkPermission("205b3", invContext, true) && ap.getAppType().equals(Organization.AppType.fabrique)) {

				%>

			<div class="tile double bg-amber" data-ae-module="205b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-stats"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Quêtes particulières</span>

					</div>

				</div>

			</div>

			<% }

			if (aav.checkPermission("207b3", invContext, true)) {

				%>

			<div class="tile double bg-lime" data-ae-module="207b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-stats"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Synthèse charges</span>

					</div>

				</div>

			</div>

			<% }

			if (aav.checkPermission("210b3", invContext, true)) {

			%>

			<div class="tile double bg-red" data-ae-module="210b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-stats"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description"><%--Les quêtes annuelles reversées--%>Synthèse recettes</span>

					</div>

				</div>

			</div>

			<% } %>

	<% } else if (compCode.equals("110a2")) { //XXX 110a2 ############################################################# 

				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

				aav.setMask(AuthPermission.READ);

		%>

		

			<%

			if (aav.checkPermission("220b3", invContext, true)) {

			%>

		<div class="tile double bg-violet" data-ae-module="220b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-briefcase-2"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">La gestion des reversements à l'Evêché</span>

					</div>

				</div>

			</div>

			<% } 

			if (aav.checkPermission("225b3", invContext, true)) {

			%>

		<div class="tile double bg-amber" data-ae-module="225b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-file-4"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">NOTE CONCERNANT LES VERSEMENTS DES PAROISSES</span>

					</div>

				</div>

			</div>

			<% } 

			if (aav.checkPermission("195b3", invContext, true)) {

				%>	

				<div class="tile double bg-yellow" data-ae-module="195b3">

					<div class="ae-subtile">

					 <div class="tile-content icon">

						<i class="icon-printer"></i>

					</div>

					<div class="tile-status">

						<span class="name">Editer les bordereaux</span>

					</div>

					</div>

					<div class="ae-subtile">

						<div class="tile-content">

							<span class="ae-description"></span>

						</div>

					</div>

				</div>

				<% } %>

	<% } else if (compCode.equals("120a2")) { //XXX 120a2 ############################################################# %>

		

	

	<% } else if (compCode.equals("130a2")) { //XXX 130a2 ############################################################# 

				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

				aav.setMask(AuthPermission.READ);

		%>

		

			<%-- <%

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

			<% } %> --%>

	<% } else if (compCode.equals("140a2")) { //XXX 140a2 ############################################################# %>

	

	<% } else if (compCode.equals("150a2")) { //XXX 150a2 ############################################################# %>

	

	<% } else if (compCode.equals("160a2")) { //XXX 160a2 ############################################################# 

				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

				aav.setMask(AuthPermission.READ);

		%>

	

				<%

			if (aav.checkPermission("250b3", invContext, true)) {

			%>

		<div class="tile double bg-amber" data-ae-module="250b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-stop-3"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Les arrêts de travail</span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("260b3", invContext, true)) {

			%>

			<div class="tile double bg-red" data-ae-module="260b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-plus-2"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Les accidents du travail</span>

					</div>

				</div>

			</div>

			<% } %>

	<% } else if (compCode.equals("170a2")) { //XXX 170a2 ############################################################# %>

	

	<% } else if (compCode.equals("180a2")) { //XXX 180a2 ############################################################# 

				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

				aav.setMask(AuthPermission.READ);

		%>

	

			<%

			if (aav.checkPermission("270b3", invContext, true)) {

			%>

		<div class="tile double bg-indigo" data-ae-module="270b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-files"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Fiche d'identité</span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("280b3", invContext, true) && ap.getAppType().equals(Organization.AppType.mense)) {

			%>

			<div class="tile double bg-darkCobalt" data-ae-module="280b3">

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

						<span class="ae-description">Membres</span>

					</div>

				</div>

			</div>

			<% } else if (aav.checkPermission("280b3", invContext, true) && ap.getAppType().equals(Organization.AppType.fabrique)) {
				%>

				<div class="tile double bg-darkCobalt" data-ae-module="280b3">

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

							<span class="ae-description">Membres</span>

						</div>

					</div>

				</div>

				<%
			}

			

			if (aav.checkPermission("290b3", invContext, true)) {

			%>

			<div class="tile double bg-lightOlive" data-ae-module="290b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-dollar-2"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">La trésorerie</span>

					</div>

				</div>

			</div>

			<% } 

			

			if (aav.checkPermission("295b3", invContext, true)) {

				%>

				<div class="tile double bg-emerald" data-ae-module="295b3">

					<div class="ae-subtile">

					 <div class="tile-content icon">

						<i class="icon-dollar-2"></i>

					</div>

					<div class="tile-status">

						<span class="name"></span>

					</div>

					</div>

					<div class="ae-subtile">

						<div class="tile-content">

							<span class="ae-description">Relevés bancaires</span>

						</div>

					</div>

				</div>

				<% } 

			

			if (aav.checkPermission("200b3", invContext, true)) {

			%>

			<div class="tile double bg-steel" data-ae-module="300b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-calendar"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Les engagements</span>

					</div>

				</div>

			</div>

			<% } %>

	<% } else if (compCode.equals("190a2")) { //XXX 190a2 ############################################################# 

				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

				aav.setMask(AuthPermission.READ);

		%>

		

			

	<% } else if (compCode.equals("200a2")) { //XXX 200a2 ############################################################# 

				AuthAccessValidator aav = authAccessService.getValidator(compCode, invContext);

				aav.setMask(AuthPermission.READ);

		%>

		

			<%

			if (aav.checkPermission("330b3", invContext, true)) {

			%>

		<div class="tile double bg-pink" data-ae-module="330b3">

				<div class="ae-subtile">

				 <div class="tile-content icon">

					<i class="icon-stats"></i>

				</div>

				<div class="tile-status">

					<span class="name"></span>

				</div>

				</div>

				<div class="ae-subtile">

					<div class="tile-content">

						<span class="ae-description">Reprise balance à nouveaux</span>

					</div>

				</div>

			</div>

			<% } %>

	<% } else if (compCode.equals("210a2")) { //XXX 210a2 ############################################################# %>

	

	<% } else if (compCode.equals("220a2")) { //XXX 220a2 ############################################################# %>

	

	<% } else if (compCode.equals("230a2")) { //XXX 230a2 ############################################################# %>

	

	<% } else if (compCode.equals("240a2")) { //XXX 240a2 ############################################################# %>

	

	<% } else if (compCode.equals("250a2")) { //XXX 250a2 ############################################################# %>

	

	<% } %>

		</div>

	</div>

		<%

    } catch (Throwable t) {

    	session.invalidate();

    }

 	

    %>