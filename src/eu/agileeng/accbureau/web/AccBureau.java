package eu.agileeng.accbureau.web;

import java.io.IOException;
import java.io.PrintWriter;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.json.JSONException;
import org.apache.tomcat.util.json.JSONObject;
import org.jboss.logging.Logger;

import eu.agileeng.domain.AEError;
import eu.agileeng.domain.AEException;
import eu.agileeng.security.AuthException;
import eu.agileeng.security.AuthLoginToken;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.security.AuthService;
import eu.agileeng.security.ejb.AuthLocal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.AERequest;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.ServiceLocator;
import eu.agileeng.services.ServiceLocator.Services;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.util.http.HttpUtil;
import eu.agileeng.util.json.JSONSerializable;

/**
 * Servlet implementation class AccBureau
 */
public class AccBureau extends HttpServlet {

	private static final long serialVersionUID = 1L;
	
	private static Logger logger = Logger.getLogger(AccBureau.class);

	@EJB
	private AuthLocal authService;
	
	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public AccBureau() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doProcess(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doProcess(request, response);
	}

	private class Error implements JSONSerializable {

		private String error = "Nom d'utilisateur ou mot de passe invalide.";

		@Override
		public JSONObject toJSONObject() throws JSONException {
			JSONObject jsonError = new JSONObject();
			jsonError.put("reason", error);
			return jsonError;
		}

		@Override
		public void create(JSONObject jsonObject) throws JSONException {
		}

		public void setError(String error) {
			this.error = error;
		}
	}

	private void doProcess(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// get HTTP Session
		HttpSession session = request.getSession(true);

		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");

		// prepare response
		PrintWriter out = response.getWriter();
		JSONObject jsonResponse = new JSONObject();

		// get arguments
		String loginUsername = request.getParameter("loginUsername");
		String loginPassword = request.getParameter("loginPassword");
		String json = request.getParameter("json");

		try {
			HttpUtil.getInstance().isSecure(request);

			if (null != json && json.length() > 0) {
				try {
					/**
					 * 
					 * JSON-RPC request
					 * 
					 */
					
					// validate execution
					AuthPrincipal ap = (AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL);
					AEInvocationContext invContext = new AEInvocationContextImp(ap);
					AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
					invContextValidator.validate(invContext);

					AERequest aeRequest = new AERequest(json);
					aeRequest.setAuthPrincipal(ap);

					if("AccBureauService".equalsIgnoreCase(aeRequest.getServiceName()) 
							&& "loadAuthPrincipal".equalsIgnoreCase(aeRequest.getMethod())) {

						// get request token cookie
						Cookie reqTokenCookie = HttpUtil.getInstance().getTheCookie(request, HttpUtil.MONENTREPRISE_TOKEN_NAME);
						
						// validate cookie
						if(reqTokenCookie == null) {
							throw new AuthException(AEError.System.SECURITY_VIOLATION);
						}
						HttpUtil.getInstance().validateToken(
								session.getId(), 
								ap, 
								reqTokenCookie.getValue());
			            
						// kill metoken cookie
						HttpUtil.getInstance().killMetokenCookie(response);
						
						// recreate sessionId to finish login process
						request.changeSessionId();
						
			            // create and return response
						jsonResponse.put("principal", ap.toJSONObject());
						jsonResponse.put(
								HttpUtil.MONENTREPRISE_TOKEN_NAME, 
								HttpUtil.getInstance().createToken(session.getId(), ap));

			            AEResponse aeResponse = new AEResponse(jsonResponse);
						out.print(aeResponse.toJSONObject().toString());
						out.flush();
					} else {
						// expected token
						HttpUtil.getInstance().validateToken(
								session.getId(), 
								ap, 
								request.getParameter(HttpUtil.MONENTREPRISE_TOKEN_NAME));
						
						if("AccBureauService".equalsIgnoreCase(aeRequest.getServiceName()) 
								&& "LoadAuthPrincipalsManageableBy".equalsIgnoreCase(aeRequest.getMethod())) {

							AuthService authService = (AuthService) ServiceLocator.getInstance().getService(Services.AUTH);
							AEResponse aeResponse = authService.loadAuthPrincipalsManageableBy(aeRequest, invContext);
							out.write(aeResponse.toJSONObject().toString());
							out.flush();
						} else if("AccBureauService".equalsIgnoreCase(aeRequest.getServiceName()) 
								&& "logoff".equalsIgnoreCase(aeRequest.getMethod())) {

							AuthService authService = (AuthService) ServiceLocator.getInstance().getService(Services.AUTH);
							AEResponse aeResponse = authService.logoff(aeRequest, invContext);

							logoff(request, response, session);

							out.write(aeResponse.toJSONObject().toString());
							out.flush();
						} else if("AccBureauService".equalsIgnoreCase(aeRequest.getServiceName()) 
								&& "savePrincipal".equalsIgnoreCase(aeRequest.getMethod())) {

							AuthService authService = (AuthService) ServiceLocator.getInstance().getService(Services.AUTH);
							AEResponse aeResponse = authService.savePrincipal(aeRequest, invContext);
							out.write(aeResponse.toJSONObject().toString());
							out.flush();
						} else if("AccBureauService".equalsIgnoreCase(aeRequest.getServiceName()) 
								&& "loadAuthRolesAll".equalsIgnoreCase(aeRequest.getMethod())) {

							AuthService authService = (AuthService) ServiceLocator.getInstance().getService(Services.AUTH);
							AEResponse aeResponse = authService.loadAuthRolesAll(aeRequest, invContext);
							out.write(aeResponse.toJSONObject().toString());
							out.flush();
						} else if("AccBureauService".equalsIgnoreCase(aeRequest.getServiceName()) 
								&& "loadAppConfig".equalsIgnoreCase(aeRequest.getMethod())) {

							AuthService authService = (AuthService) ServiceLocator.getInstance().getService(Services.AUTH);
							AEResponse aeResponse = authService.loadAppConfig(aeRequest, invContext);
							out.write(aeResponse.toJSONObject().toString());
							out.flush();
						} else if("AccBureauService".equalsIgnoreCase(aeRequest.getServiceName()) 
								&& "saveAppConfig".equalsIgnoreCase(aeRequest.getMethod())) {

							AuthService authService = (AuthService) ServiceLocator.getInstance().getService(Services.AUTH);
							AEResponse aeResponse = authService.saveAppConfig(aeRequest, invContext);
							out.write(aeResponse.toJSONObject().toString());
							out.flush();
						} else if("AccBureauService".equalsIgnoreCase(aeRequest.getServiceName()) 
								&& "unlock".equalsIgnoreCase(aeRequest.getMethod())) {

							AuthService authService = (AuthService) ServiceLocator.getInstance().getService(Services.AUTH);
							AEResponse aeResponse = authService.unlock(aeRequest, invContext);
							out.write(aeResponse.toJSONObject().toString());
							out.flush();
						} else if("AccBureauService".equalsIgnoreCase(aeRequest.getServiceName()) 
								&& "loadPrincipalsInitialData".equalsIgnoreCase(aeRequest.getMethod())) {

							AEResponse aeResponse = authService.loadPrincipalsInitialData(aeRequest, invContext);
							out.write(aeResponse.toJSONObject().toString());
							out.flush();
						}  else if("AccBureauService".equalsIgnoreCase(aeRequest.getServiceName()) 
								&& "loadPrincipal".equalsIgnoreCase(aeRequest.getMethod())) {

							AEResponse aeResponse = authService.loadPrincipal(aeRequest, invContext);
							out.write(aeResponse.toJSONObject().toString());
							out.flush();
						}  else if("AccBureauService".equalsIgnoreCase(aeRequest.getServiceName()) 
								&& "deactivate".equalsIgnoreCase(aeRequest.getMethod())) {

							AEResponse aeResponse = authService.deactivate(aeRequest, invContext);
							out.write(aeResponse.toJSONObject().toString());
							out.flush();
						} else if("AccBureauService".equalsIgnoreCase(aeRequest.getServiceName()) 
								&& "resetPassword".equalsIgnoreCase(aeRequest.getMethod())) {

							AEResponse aeResponse = authService.resetPassword(aeRequest, invContext);
							out.write(aeResponse.toJSONObject().toString());
							out.flush();
						} 
					}
				} catch (AuthException e) {
					logger.error("AuthException in AccBureau servlet. ", e);
					
					// !!! logoff !!! 
					logoff(request, response, session);
					
					// return Json response
					AEResponse aeResponse = new AEResponse(new AEException(e));
					try {
						out.write(aeResponse.toJSONObject().toString());
					} catch (JSONException e1) {
						logger.error(e1);
					}
					out.flush();
				} catch (Exception e) {
					logger.error("Exception in AccBureau servlet. ", e);
					
					// Don't logoff
					
					// return Json response
					AEResponse aeResponse = new AEResponse(new AEException(e));
					try {
						out.write(aeResponse.toJSONObject().toString());
					} catch (JSONException e1) {
						logger.error(e1);
					}
					out.flush();
				}
			} else if (null != loginUsername) {
				/**
				 * 
				 * Login request
				 * 
				 */
				
				// login
				AuthService authService = (AuthService) ServiceLocator.getInstance().getService(Services.AUTH);
				AuthLoginToken authToken = new AuthLoginToken(loginUsername, loginPassword, request.getRemoteAddr());
				AuthPrincipal authPrincipal = authService.login(authToken);

				// recreate sessionId after login succedeed
				request.changeSessionId();
				
				// bind session to authSubject
				session.setAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL, authPrincipal);
				
				// set timeout
				session.setMaxInactiveInterval(30 * 60); // 30 min in seconds (N * 60)
				
				// kill the old metoken cookie and create a new one
				HttpUtil.getInstance().killMetokenCookie(response);
				
				String metoken = HttpUtil.getInstance().createToken(session.getId(), authPrincipal);
				
				Cookie reqTokenCookie = new Cookie(HttpUtil.MONENTREPRISE_TOKEN_NAME, metoken);
				reqTokenCookie.setPath("/AccBureau");
				HttpUtil.getInstance().addCookie(response, reqTokenCookie);

				// create response
				jsonResponse.put("success", true);
				jsonResponse.put("loggedName", authPrincipal.getName()); // in case of re-login
				jsonResponse.put(HttpUtil.MONENTREPRISE_TOKEN_NAME, metoken); // in case of re-login 
				jsonResponse.put("redirect", "/MaParoisse.jsp"); // in case of login 
				
				// set reposnse
				out.print(jsonResponse.toString());
				out.flush();
			} else {
				/**
				 * 
				 * Unknown request
				 * 
				 */
				throw new AEException(AEError.System.INVALID_REQUEST);
			}
		} catch (Exception e) {
			try {
				logger.error("Exception in AccBureau servlet. ", e);
				
				logoff(request, response, session);

				Error err = new Error();
				err.setError(e.getMessage());
				jsonResponse.put("success", false);
				jsonResponse.put("errors", err.toJSONObject());

				out.print(jsonResponse.toString());
			} catch (JSONException e1) {
				logger.error(e1);
			}
		} finally {
			response.flushBuffer();
		}
	}

	/**
	 * Logoff
	 * 
	 * @param request
	 * @param response
	 * @param session
	 */
	private void logoff(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		// remove principal
		Object apObj = (AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL);
		if(apObj instanceof AuthPrincipal) {
			AuthPrincipal ap = (AuthPrincipal) apObj;
			ap.setAuthenticated(false);
		}
		session.removeAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL);
		
		// kill all cookies
		try {
			HttpUtil.getInstance().killAllCookies(request, response);
		} catch(Throwable t) {
			logger.error(t);
		}
		
		// kill metoken cookie
		try {
			HttpUtil.getInstance().killMetokenCookie(response);
		} catch(Throwable t) {
			logger.error(t);
		}
		
		// invalidate session
		session.invalidate();
	}
}
