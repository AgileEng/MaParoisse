package eu.agileeng.accbureau.web;

import java.io.IOException;
import java.io.PrintWriter;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.json.JSONException;
import org.apache.tomcat.util.json.JSONObject;

import eu.agileeng.domain.AEException;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.AERequest;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.ServiceLocator;
import eu.agileeng.services.ServiceLocator.Services;
import eu.agileeng.services.acc.AccService;
import eu.agileeng.services.acc.ejb.AccLocal;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class Accounting
 */
public class Accounting extends HttpServlet {
	private static final long serialVersionUID = 1L;

	@EJB
	AccLocal accService;
	
	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public Accounting() {
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
				// validate execution
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
				if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadVATItems".equalsIgnoreCase(aeRequest.getMethod())) {

					AccService accService = (AccService) ServiceLocator.getInstance().getService(Services.ACC_SERVICE);
					AEResponse aeResponse = accService.loadVATItems(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveVATItems".equalsIgnoreCase(aeRequest.getMethod())) {

					AccService accService = (AccService) ServiceLocator.getInstance().getService(Services.ACC_SERVICE);
					AEResponse aeResponse = accService.saveVATItems(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadCOAModels".equalsIgnoreCase(aeRequest.getMethod())) {

					AccService accService = (AccService) ServiceLocator.getInstance().getService(Services.ACC_SERVICE);
					AEResponse aeResponse = accService.loadCOAModels(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveCOAModels".equalsIgnoreCase(aeRequest.getMethod())) {

					AccService accService = (AccService) ServiceLocator.getInstance().getService(Services.ACC_SERVICE);
					AEResponse aeResponse = accService.saveCOAModels(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "importAccounts".equalsIgnoreCase(aeRequest.getMethod())) {

					AccService accService = (AccService) ServiceLocator.getInstance().getService(Services.ACC_SERVICE);
					AEResponse aeResponse = accService.importAccounts(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadCOA".equalsIgnoreCase(aeRequest.getMethod())) {

					AccService accService = (AccService) ServiceLocator.getInstance().getService(Services.ACC_SERVICE);
					AEResponse aeResponse = accService.loadCOA(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveCOA".equalsIgnoreCase(aeRequest.getMethod())) {

					AccService accService = (AccService) ServiceLocator.getInstance().getService(Services.ACC_SERVICE);
					AEResponse aeResponse = accService.saveCOA(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "deleteCOA".equalsIgnoreCase(aeRequest.getMethod())) {

					AccService accService = (AccService) ServiceLocator.getInstance().getService(Services.ACC_SERVICE);
					AEResponse aeResponse = accService.deleteCOA(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveGOA".equalsIgnoreCase(aeRequest.getMethod())) {

					AccService accService = (AccService) ServiceLocator.getInstance().getService(Services.ACC_SERVICE);
					AEResponse aeResponse = accService.saveGOA(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadGOA".equalsIgnoreCase(aeRequest.getMethod())) {

					AccService accService = (AccService) ServiceLocator.getInstance().getService(Services.ACC_SERVICE);
					AEResponse aeResponse = accService.loadGOA(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadGeneralJournal".equalsIgnoreCase(aeRequest.getMethod())) {

					AccService accService = (AccService) ServiceLocator.getInstance().getService(Services.ACC_SERVICE);
					AEResponse aeResponse = accService.loadGeneralJournal(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "export".equalsIgnoreCase(aeRequest.getMethod())) {

					AccService accService = (AccService) ServiceLocator.getInstance().getService(Services.ACC_SERVICE);
					AEResponse aeResponse = accService.export(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadAccPeriodByFilter".equalsIgnoreCase(aeRequest.getMethod())) {

					AccService accService = (AccService) ServiceLocator.getInstance().getService(Services.ACC_SERVICE);
					AEResponse aeResponse = accService.loadAccPeriodByFilter(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadInitialBalance".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = accService.loadInitialBalance(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveInitialBalance".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = accService.saveInitialBalance(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadDonations".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = accService.loadDonations(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveDonations".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = accService.saveDonations(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadBudget".equalsIgnoreCase(aeRequest.getMethod())) {
					
					AEResponse aeResponse = accService.loadBudget(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveBudget".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = accService.saveBudget(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadBudgetReal".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = accService.loadBudgetReal(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadBordereauParoisse".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = accService.loadBordereauParoisse(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveBordereauParoisse".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = accService.saveBordereauParoisse(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadAccPeriods".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = accService.loadAccPeriods(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "closeAccPeriod".equalsIgnoreCase(aeRequest.getMethod())) {
					// close period
					AEResponse aeResponse = accService.closeAccPeriod(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "openAccPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = accService.openAccPeriod(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveTip".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = accService.saveTip(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
					out.flush();
				} else if("AccService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadTip".equalsIgnoreCase(aeRequest.getMethod())) {

					JSONObject payload = new JSONObject().put("tip", accService.loadTip());
					AEResponse aeResponse = new AEResponse(payload);
					aeResponse.toJSONObject().write(out);
					out.flush();
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			AEResponse aeResponse = new AEResponse();
			aeResponse.setError(new AEException(e));
			try {
				out.write(aeResponse.toJSONObject().toString());
			} catch (JSONException e1) {
				e1.printStackTrace();
			}
			out.flush();
		} finally {
			try {
				response.flushBuffer();
			} catch(Exception ex){
				System.out.println("Error flushing the Response: "+ex.toString());
			}
		}
	}
}
