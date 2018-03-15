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

import eu.agileeng.domain.AEException;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.AERequest;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.ServiceLocator;
import eu.agileeng.services.ServiceLocator.Services;
import eu.agileeng.services.cash.CashService;
import eu.agileeng.services.cash.ejb.CashLocal;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class CashServlet
 */
public class CashServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	@EJB
	private CashLocal cashLocal;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public CashServlet() {
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
				if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadCashDeskTurnOver".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.loadCashDeskTurnOver(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveCashJournalEntry".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.saveCashJournalEntry(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "closingPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.closingPeriod(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "openPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.openPeriod(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveCFC".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.saveCFC(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadCFC".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.loadCFC(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveCFC".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.saveCFC(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveCFCCell".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.saveCFCCell(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "closingCFCPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.closingCFCPeriod(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "openCFCPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.openCFCPeriod(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveIDE".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.saveIDE(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadIDE".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.loadIDE(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveIDE".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.saveIDE(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveIDECell".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.saveIDECell(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "closingIDEPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.closingIDEPeriod(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "openIDEPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.openIDEPeriod(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveBankAccount".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.saveBankAccount(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadBankAccounts".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.loadBankAccounts(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveBankTransactions".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.saveBankTransactions(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadBankTransactions".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.loadBankTransactions(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveBankBalances".equalsIgnoreCase(aeRequest.getMethod())) {
					
					AEResponse aeResponse = cashLocal.saveBankBalances(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadBankBalances".equalsIgnoreCase(aeRequest.getMethod())) {
					
					AEResponse aeResponse = cashLocal.loadBankBalances(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "closingBankPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.closingBankPeriod(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "openBankPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.openBankPeriod(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveMandat".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.saveMandat(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadMandat".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.loadMandat(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveMandatCell".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.saveMandatCell(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "closingMandatPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.closingMandatPeriod(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "openMandatPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.openMandatPeriod(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadBankDocumentData".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.loadBankDocumentData(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "closingBankDocumentPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.closingBankDocumentPeriod(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "openBankDocumentPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.openBankDocumentPeriod(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadBankDocument".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.loadBankDocument(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "payBankDocuments".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.payBankDocuments(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "recognizeBankTransactions".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.recognizeBankTransactions(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "reconcileBankDocuments".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.reconcileBankDocuments(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "accountCashSubPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.accountCashSubPeriod(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "savePAM".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.savePAM(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadPAM".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.loadPAM(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "savePAMCell".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.savePAMCell(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "closingPAMPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.closingPAMPeriod(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "openPAMPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.openPAMPeriod(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadInventoryStatus".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.loadInventoryStatus(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveInventoryStatusCell".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.saveInventoryStatusCell(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "closeInventoryStatus".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.closeInventoryStatus(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "openInventoryStatus".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.openInventoryStatus(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveInventoryStatusCellAnnually".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.saveInventoryStatusCellAnnually(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				}  else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveMandatExt".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.saveMandatExt(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadMandatExt".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.loadMandatExt(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveMandatCellExt".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.saveMandatCellExt(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "closingMandatPeriodExt".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.closingMandatPeriodExt(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("CashService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "openMandatPeriodExt".equalsIgnoreCase(aeRequest.getMethod())) {

					CashService cashService = 
						(CashService) ServiceLocator.getInstance().getService(Services.CASH);
					AEResponse aeResponse = cashService.openMandatPeriodExt(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
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
				System.out.println("Error flushing the Response: " + ex.toString());
			}
		}
	}
}
