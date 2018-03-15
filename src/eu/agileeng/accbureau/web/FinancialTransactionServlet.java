package eu.agileeng.accbureau.web;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.json.JSONException;
import org.jboss.logging.Logger;

import eu.agileeng.domain.AEException;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.AERequest;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.ServiceLocator;
import eu.agileeng.services.ServiceLocator.Services;
import eu.agileeng.services.acc.FinancialTransactionService;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class FinancialTransactionServlet
 */
public class FinancialTransactionServlet extends HttpServlet {

	protected static Logger LOG = Logger.getLogger(FinancialTransactionServlet.class);
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 5857141810357194029L;

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		LOG.error("405 Get Method Not Allowed ");
		response.setStatus(405);
		response.flushBuffer();
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

		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();

		String json = request.getParameter("json");
		try {
			// validate secured connection
			HttpUtil.getInstance().isSecure(request);

			if (null != json && json.length() > 0) {
				/**
				 * validate execution.
				 * MUST be in the same order
				 */
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
				if("FinancialTransactionService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadFinancialTransactionTemplates".equalsIgnoreCase(aeRequest.getMethod())) {

					FinancialTransactionService ftService = 
						(FinancialTransactionService) ServiceLocator.getInstance().getService(Services.FINANCIAL_TRANSACTION);
					AEResponse aeResponse = ftService.loadFinancialTransactionTemplates(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FinancialTransactionService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveFinancialTransactionTemplates".equalsIgnoreCase(aeRequest.getMethod())) {

					FinancialTransactionService ftService = 
						(FinancialTransactionService) ServiceLocator.getInstance().getService(Services.FINANCIAL_TRANSACTION);
					AEResponse aeResponse = ftService.saveFinancialTransactionTemplates(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FinancialTransactionService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "createFinancialTransaction".equalsIgnoreCase(aeRequest.getMethod())) {

					FinancialTransactionService ftService = 
						(FinancialTransactionService) ServiceLocator.getInstance().getService(Services.FINANCIAL_TRANSACTION);
					AEResponse aeResponse = ftService.createFinancialTransaction(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FinancialTransactionService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveFinancialTransaction".equalsIgnoreCase(aeRequest.getMethod())) {

					FinancialTransactionService ftService = 
						(FinancialTransactionService) ServiceLocator.getInstance().getService(Services.FINANCIAL_TRANSACTION);
					AEResponse aeResponse = ftService.saveFinancialTransaction(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FinancialTransactionService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadContributors".equalsIgnoreCase(aeRequest.getMethod())) {

					FinancialTransactionService ftService = 
						(FinancialTransactionService) ServiceLocator.getInstance().getService(Services.FINANCIAL_TRANSACTION);
					AEResponse aeResponse = ftService.loadContributors(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
//					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FinancialTransactionService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadAccJournalItemsByFilter".equalsIgnoreCase(aeRequest.getMethod())) {

					FinancialTransactionService ftService = 
						(FinancialTransactionService) ServiceLocator.getInstance().getService(Services.FINANCIAL_TRANSACTION);
					AEResponse aeResponse = ftService.loadAccJournalItemsByFilter(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
//					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FinancialTransactionService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadAccJournals".equalsIgnoreCase(aeRequest.getMethod())) {

					FinancialTransactionService ftService = 
						(FinancialTransactionService) ServiceLocator.getInstance().getService(Services.FINANCIAL_TRANSACTION);
					AEResponse aeResponse = ftService.loadAccJournals(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
//					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FinancialTransactionService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadFinancialTransaction".equalsIgnoreCase(aeRequest.getMethod())) {

					FinancialTransactionService ftService = 
						(FinancialTransactionService) ServiceLocator.getInstance().getService(Services.FINANCIAL_TRANSACTION);
					AEResponse aeResponse = ftService.loadFinancialTransaction(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FinancialTransactionService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveAccJournalItems".equalsIgnoreCase(aeRequest.getMethod())) {

					FinancialTransactionService ftService = 
						(FinancialTransactionService) ServiceLocator.getInstance().getService(Services.FINANCIAL_TRANSACTION);
					AEResponse aeResponse = ftService.saveAccJournalItems(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
//					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FinancialTransactionService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveContributors".equalsIgnoreCase(aeRequest.getMethod())) {

					FinancialTransactionService ftService = 
						(FinancialTransactionService) ServiceLocator.getInstance().getService(Services.FINANCIAL_TRANSACTION);
					AEResponse aeResponse = ftService.saveContributors(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
//					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FinancialTransactionService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "deleteContributor".equalsIgnoreCase(aeRequest.getMethod())) {

					FinancialTransactionService ftService = 
						(FinancialTransactionService) ServiceLocator.getInstance().getService(Services.FINANCIAL_TRANSACTION);
					AEResponse aeResponse = ftService.deleteContributor(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
//					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FinancialTransactionService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "importContributors".equalsIgnoreCase(aeRequest.getMethod())) {

					FinancialTransactionService ftService = 
						(FinancialTransactionService) ServiceLocator.getInstance().getService(Services.FINANCIAL_TRANSACTION);
					AEResponse aeResponse = ftService.importContributors(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
					out.flush();
				} else if("FinancialTransactionService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "tallyAccJournalItem".equalsIgnoreCase(aeRequest.getMethod())) {

					FinancialTransactionService ftService = 
						(FinancialTransactionService) ServiceLocator.getInstance().getService(Services.FINANCIAL_TRANSACTION);
					AEResponse aeResponse = ftService.tallyAccJournalItem(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
					out.flush();
				}
			}
		} catch (Throwable t) {
			LOG.error("error in FinancialTransactionServlet ", t);
			AEResponse aeResponse = new AEResponse();
			aeResponse.setError(new AEException(t));
			try {
				out.write(aeResponse.toJSONObject().toString());
			} catch (JSONException ex) {
				LOG.error(ex);
			}
			out.flush();
		} finally {
			try {
				response.flushBuffer();
			} catch(Exception ex){
				LOG.error(ex);
			}
		}
	}

}
