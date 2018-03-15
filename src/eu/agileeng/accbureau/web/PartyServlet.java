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
import eu.agileeng.services.party.PartyService;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class PartyServlet
 */
public class PartyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public PartyServlet() {
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

	private void doProcess(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// get HTTP Session
		HttpSession session = request.getSession(true);

		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		
		// prepare response
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
				
				// execute
				AERequest aeRequest = new AERequest(json);
				aeRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
				if("PartyService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveCustomer".equalsIgnoreCase(aeRequest.getMethod())) {

					PartyService partyService = (PartyService) ServiceLocator.getInstance().getService(Services.PARTY);
					AEResponse aeResponse = partyService.saveCustomer(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} if("PartyService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadCustomer".equalsIgnoreCase(aeRequest.getMethod())) {

					PartyService partyService = (PartyService) ServiceLocator.getInstance().getService(Services.PARTY);
					AEResponse aeResponse = partyService.loadCustomer(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("PartyService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadCustomers".equalsIgnoreCase(aeRequest.getMethod())) {

					PartyService partyService = (PartyService) ServiceLocator.getInstance().getService(Services.PARTY);
					AEResponse aeResponse = partyService.loadCustomers(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("PartyService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveCompany".equalsIgnoreCase(aeRequest.getMethod())) {

					PartyService partyService = (PartyService) ServiceLocator.getInstance().getService(Services.PARTY);
					AEResponse aeResponse = partyService.saveCompany(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("PartyService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadCompanies".equalsIgnoreCase(aeRequest.getMethod())) {

					PartyService partyService = (PartyService) ServiceLocator.getInstance().getService(Services.PARTY);
					AEResponse aeResponse = partyService.loadCompanies(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("PartyService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadSupplyData".equalsIgnoreCase(aeRequest.getMethod())) {

					PartyService partyService = (PartyService) ServiceLocator.getInstance().getService(Services.PARTY);
					AEResponse aeResponse = partyService.loadSupplyData(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("PartyService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "deleteCompany".equalsIgnoreCase(aeRequest.getMethod())) {

					PartyService partyService = (PartyService) ServiceLocator.getInstance().getService(Services.PARTY);
					AEResponse aeResponse = partyService.deleteCompany(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("PartyService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "deactivateCompany".equalsIgnoreCase(aeRequest.getMethod())) {

					PartyService partyService = (PartyService) ServiceLocator.getInstance().getService(Services.PARTY);
					AEResponse aeResponse = partyService.deactivateCompany(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("PartyService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "activateCompany".equalsIgnoreCase(aeRequest.getMethod())) {

					PartyService partyService = (PartyService) ServiceLocator.getInstance().getService(Services.PARTY);
					AEResponse aeResponse = partyService.activateCompany(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("PartyService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "newCustomerByTemplate".equalsIgnoreCase(aeRequest.getMethod())) {

					PartyService partyService = (PartyService) ServiceLocator.getInstance().getService(Services.PARTY);
					AEResponse aeResponse = partyService.newCustomerByTemplate(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("PartyService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveCompanies".equalsIgnoreCase(aeRequest.getMethod())) {

					PartyService partyService = (PartyService) ServiceLocator.getInstance().getService(Services.PARTY);
					AEResponse aeResponse = partyService.saveCompanies(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("PartyService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadTemplates".equalsIgnoreCase(aeRequest.getMethod())) {

					PartyService partyService = (PartyService) ServiceLocator.getInstance().getService(Services.PARTY);
					AEResponse aeResponse = partyService.loadOrganizationTemplates(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} 
			}
		} catch (Exception e) {
			AEApp.logger().error("Exception in PartyServlet. ", e);
			
			// return catched Exception 
			AEResponse aeResponse = new AEResponse(new AEException(e));
			try {
				out.write(aeResponse.toJSONObject().toString());
			} catch (JSONException e1) {
			}
			out.flush();
		} finally {
			try {
				response.flushBuffer();
			} catch(Exception ex) {
				AEApp.logger().error("Error flushing the PartyServlet response. ", ex);
			}
		}
	}

}
