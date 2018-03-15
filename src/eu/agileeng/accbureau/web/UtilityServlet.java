package eu.agileeng.accbureau.web;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.json.JSONException;

import eu.agileeng.accbureau.AEApp;
import eu.agileeng.domain.AEException;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.AERequest;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.ServiceLocator;
import eu.agileeng.services.ServiceLocator.Services;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.services.utility.AEUtilityService;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class UtilityServlet
 */
public class UtilityServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 6791534831260807395L;

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

	private void doProcess(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// Set a cookie for the user, so that the counter does not increate
		// everytime the user press refresh
		HttpSession session = request.getSession(true);

		// Set the session valid for 5 secs
		//session.setMaxInactiveInterval(5);
		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();

		String json = request.getParameter("json");
		try {
			// validate secured connection
			HttpUtil.getInstance().isSecure(request);
			
			if (null != json && json.length() > 0) {
				// authetication
				AuthPrincipal ap = (AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL);
				AEInvocationContext invContext = new AEInvocationContextImp(ap);
				AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
				invContextValidator.validate(invContext);

				// expected token
				HttpUtil.getInstance().validateToken(
						session.getId(), 
						ap, 
						request.getParameter(HttpUtil.MONENTREPRISE_TOKEN_NAME));
				
				AERequest aeRequest = new AERequest(json);
				aeRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
				if("AEUtilityService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadBookmarks".equalsIgnoreCase(aeRequest.getMethod())) {

					AEUtilityService utilityService = 
						(AEUtilityService) ServiceLocator.getInstance().getService(Services.UTILITY);
					AEResponse aeResponse = utilityService.loadBookmarks(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AEUtilityService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveBookmarks".equalsIgnoreCase(aeRequest.getMethod())) {

					AEUtilityService utilityService = 
						(AEUtilityService) ServiceLocator.getInstance().getService(Services.UTILITY);
					AEResponse aeResponse = utilityService.saveBookmarks(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				}  else if("AEUtilityService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "importAopca".equalsIgnoreCase(aeRequest.getMethod())) {

					AEUtilityService utilityService = 
						(AEUtilityService) ServiceLocator.getInstance().getService(Services.UTILITY);
					AEResponse aeResponse = utilityService.importAopca(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				}
			}
		} catch (Exception e) {
			AEApp.logger().error("UtilityServlet, Exception", e);
			
			AEResponse aeResponse = new AEResponse();
			aeResponse.setError(new AEException(e));
			try {
				out.write(aeResponse.toJSONObject().toString());
			} catch (JSONException e1) {
				AEApp.logger().error("UtilityServlet, JSONException", e1);
				
				// nothing to do
			}
			out.flush();
		} finally {
			try {
				response.flushBuffer();
			} catch(Exception ex){
				AEApp.logger().error("UtilityServlet, Error flushing the Response", ex);
				
				// nothing to do
			}
		}
	}
}
