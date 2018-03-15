<%@page import="eu.agileeng.domain.AEException"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%@page import="eu.agileeng.util.http.HttpUtil"%>
    
    <%
    	try {
    		try {
	    		//Verify HTTPS connection
	    		HttpUtil.getInstance().isSecure(request);
	    		//out.println("<!-- https://"+request.getHeader("host")+request.getServletPath()+request.getQueryString()+" -->");
    		} catch (AEException e) {
    			String redirectURL = "https://"+request.getHeader("host")+request.getServletPath(); //+request.getQueryString();
    			response.sendRedirect(redirectURL);
    		}
    	
    %>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/x-icon" href="/favicon.ico" />
		<title>Zachée</title>
		<link href="lib/metroui/css/metro-bootstrap.css" rel="stylesheet">
		<link href="lib/metroui/css/metro-bootstrap-responsive.css" rel="stylesheet">
		<link rel="stylesheet" href="lib/metroui/css/iconFont.css">
		<style type="text/css">
			body, html {
				background-color: #1BA1E2 !important;
			}
			
			body {
				background: #1BA1E2 url('resources/images/ColombexWhite_edited.png') no-repeat 80% center;
				background-size: 500px auto;
			}
			
			@media screen and (max-width: 1300px) {
				body {
					background: #1BA1E2 url('resources/images/ColombexWhite_edited.png') no-repeat 90% center;
					background-size: 400px auto;
				}
			}
			
			@media screen and (max-width: 995px) {
				body {
					background: #1BA1E2 url('resources/images/ColombexWhite_edited.png') no-repeat center top;
					background-size: 180px auto;
				}
			}
		
			.ae-margined-content {
				padding-top: 230px;
			}
			
			.ae-padded-link {
				padding-left: 15%;
			}
			
			.ae-margined-icon {
				margin-left: 50px;
			}
			
			.ae-icon-huge {
				font-size: 75px;
			}
			
			.ae-error-msg {
				opacity: 0;
				-webkit-transition: opacity 0.7s; /* For Safari 3.1 to 6.0 */
				transition: opacity 0.7s;
			}
			
			.ae-shown {
				opacity: 100;
				-webkit-transition: opacity 0.2s; /* For Safari 3.1 to 6.0 */
				transition: opacity 0.2s;
			}
			
			.ae-hidden {
				display: none !important;
			}
		</style>
		
		<script src="lib/metroui/js/jquery/jquery.min.js"></script>
		<script src="lib/metroui/js/jquery/jquery.widget.min.js"></script>
		<script src="lib/metroui/js/metro/metro.min.js"></script>
		
		<script type="text/javascript">
			if (top !== self) { 
				top.location.assign(self.location.href);
			}
			
			$(document).ready(function onReady() {
				var $loginForm = $('#login-form');

				var onLoginFormSubmit = function (e) {
					e.preventDefault();
					
					var data = $loginForm.serialize();

					$.ajax({
						url: '/AccBureau',
						method: 'post',
						data: data,
						success: function onAjaxSuccess(resp) {
							var json = JSON.parse(resp);
							if (json.success === false) {
								$('input[name="loginUsername"]').get(0).select();
								 /*$.Dialog({
									 shadow: true,
									 overlay: true,
									 icon: '<span class="icon-stop-3"></span>',
									 title: 'Erreur',
									 width: 500,
									 padding: 10,
									 content: json.errors.reason
								 });*/
								showErrorMessage(json.errors.reason);
							} else if (json.success === true) {
								location.assign(json.redirect);
								
							}
							
						},
						error: function onAjaxError(xhr) {
							console.log(xhr);
						}
					});
				}

				$loginForm.submit(onLoginFormSubmit);

				$('#login-submit-button').click(onLoginFormSubmit);

				var showErrorMessage = function (msg) {
					var $errorDisplay = $('#errorDisplay');

					if ($errorDisplay.hasClass("ae-shown")) $errorDisplay.removeClass("ae-shown");

					$errorDisplay.html(msg);
					$errorDisplay.addClass("ae-shown");
					
				}
				
			});
		</script>
	</head>
	<body class="metro bg-cyan">
		<div class="grid ae-margined-content">
			<div class="row">
				<div class="span3 offset3">
					<h2>authentification</h2>
				</div>
			</div>
			<div class="row">
				<div class="span2 offset1">
					<i class="icon-user fg-white ae-icon-huge ae-margined-icon"></i>
				</div>
				<div class="span5">
					
					<form role="form" id="login-form" action="" method="post">
						<div class="input-control text">
							<input type="text" name="loginUsername" autocomplete="off" placeholder="utilisateur" autofocus/>
							<button class="btn-clear"></button>
						</div>
						<div class="input-control password">
							<input type="password" name="loginPassword" autocomplete="off" placeholder="mot de passe"/>
							
						</div>
						<input type="submit" class="ae-hidden" />
						<h2 class="offset2"><a href="javascript:void(0);" id="login-submit-button" class="fg-darker ae-padded-link">Connexion <i class="icon-arrow-right-3 fg-darker"></i></a></h2>
					</form>
					</div>
					<div class="span4">
						<!-- <img src="resources/images/ColombexWhite_edited.png" alt="Zachee" style="max-width: auto;" />  -->
					</div>
				</div>

				<div class="row">
					<div class="span5 offset3 fg-red ae-error-msg" id="errorDisplay">
						
					</div>
				</div>
			</div>
	</body>
</html>

<% } catch(Throwable t) {
		
	} finally {
		session.invalidate();
	}
%>