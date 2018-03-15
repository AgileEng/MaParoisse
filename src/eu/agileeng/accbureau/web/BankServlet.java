package eu.agileeng.accbureau.web;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.json.JSONException;
import org.apache.tomcat.util.json.JSONObject;
import org.jboss.logging.Logger;

import eu.agileeng.domain.AEException;
import eu.agileeng.domain.business.bank.BankRecognitionRulesList;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.AERequest;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.ServiceLocator;
import eu.agileeng.services.ServiceLocator.Services;
import eu.agileeng.services.bank.BankService;
import eu.agileeng.services.cash.CashService;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.util.AEStringUtil;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class BankServlet
 */
public class BankServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = -1879888075368365379L;

	private static Logger logger = Logger.getLogger(BankServlet.class);
	
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

		// Get session
		HttpSession session = request.getSession(true);

		// init response
		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();

		String json = request.getParameter("json");
		try {
			// validate secured connection
			HttpUtil.getInstance().isSecure(request);

			if (!AEStringUtil.isEmpty(json)) {
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
				
				// process method
				if("BankService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveRecognitionTable".equalsIgnoreCase(aeRequest.getMethod())) {

//					BankService bankService = 
//						(BankService) ServiceLocator.getInstance().getService(Services.BANK);
//					JSONObject arguments = aeRequest.getArguments();
//					BankRecognitionRulesList brrList = bankService.saveRecognitionRules(arguments.getJSONArray("recognitionRules"));
//					JSONObject payload = new JSONObject();
//					payload.put("recognitionRules", brrList.toJSONArray());
					
					AEResponse aeResponse = new AEResponse(); // bankService...;
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if ("BankService".equalsIgnoreCase(aeRequest.getServiceName()) && "loadRecognitionTable".equalsIgnoreCase(aeRequest.getMethod())) {
					BankService bankService = 
							(BankService) ServiceLocator.getInstance().getService(Services.BANK);
//					JSONObject arguments = aeRequest.getArguments();

					JSONObject payload = bankService.loadRecognitionRules(aeRequest);


					AEResponse aeResponse = new AEResponse(payload); // bankService...;
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if ("BankService".equalsIgnoreCase(aeRequest.getServiceName()) && "saveRecognitionRule".equalsIgnoreCase(aeRequest.getMethod())) {
					BankService bankService = 
							(BankService) ServiceLocator.getInstance().getService(Services.BANK);
//					JSONObject arguments = aeRequest.getArguments();

					BankRecognitionRulesList brrList = bankService.saveRecognitionRules(aeRequest);
					JSONObject payload = new JSONObject();
					payload.put("recognitionRule", brrList.get(0).toJSONObject());

					AEResponse aeResponse = new AEResponse(payload); // bankService...;
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if ("CashService".equalsIgnoreCase(aeRequest.getServiceName()) && "recognizeAndSaveBankTransactions".equalsIgnoreCase(aeRequest.getMethod())) {
					CashService cashService = 
							(CashService) ServiceLocator.getInstance().getService(Services.CASH);
						AEResponse aeResponse = cashService.recognizeAndSaveBankTransactions(aeRequest);
						out.write(aeResponse.toJSONObject().toString());
						out.flush();
				}
			}
		} catch (Exception e) {
			logger.error(e);
			
			AEResponse aeResponse = new AEResponse();
			aeResponse.setError(new AEException(e));
			try {
				out.write(aeResponse.toJSONObject().toString());
			} catch (JSONException e1) {
				logger.error("Error writing to reponse ", e1);
			}
			
			out.flush();
		} finally {
			try {
				response.flushBuffer();
			} catch(Exception ex) {
				logger.error("Error flushing the Response ", ex);
			}
		}
	}

}
