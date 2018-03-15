package eu.agileeng.accbureau.web;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.json.JSONException;
import org.apache.tomcat.util.json.JSONObject;

import eu.agileeng.domain.AEException;
import eu.agileeng.domain.document.AEDocumentFactory;
import eu.agileeng.domain.document.AEDocumentType;
import eu.agileeng.domain.facturation.AEClient;
import eu.agileeng.domain.facturation.AEFacture;
import eu.agileeng.domain.facturation.AEFactureFactory;
import eu.agileeng.domain.facturation.AEFacturePrintTemplate;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.AERequest;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.ServiceLocator;
import eu.agileeng.services.ServiceLocator.Services;
import eu.agileeng.services.facturation.AEFacturationService;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.util.AEStringUtil;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class FacturationServlet
 */
public class FacturationServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = -1879888075368365379L;

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

		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();

		String json = request.getParameter("json");
		String action = request.getParameter("action");
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
				if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveArticle".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.saveArticle(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadArticles".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.loadArticles(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "deleteArticle".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.deleteArticle(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveClient".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.saveClient(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadClients".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.loadClients(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "deleteClient".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.deleteClient(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveFacture".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.saveFacture(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "calculateFacture".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.calculateFacture(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadFactures".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.loadFactures(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "deleteFacture".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.deleteFacture(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadFacturesInfo".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.loadFacturesInfo(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadFacture".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.loadFacture(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadByFilter".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.loadByFilter(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadPaymentsByFilter".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.loadPaymentsByFilter(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "devisTransitionToAccepted".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.devisTransitionToAccepted(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "devisTransitionToInvoiced".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.devisTransitionToInvoiced(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "factureTransitionToValidated".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.factureTransitionToValidated(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "payPayment".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.payPayment(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "unpaidPayment".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.unpaidPayment(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "duplicateFacture".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.duplicateFacture(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "createCreditNote".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.createCreditNote(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "savePrintTemplate".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.savePrintTemplate(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadPrintTemplates".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.loadPrintTemplates(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "deletePrintTemplate".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.deletePrintTemplate(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadRelevantPrintTemplates".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.loadRelevantPrintTemplates(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if ("FacturationService".equalsIgnoreCase(aeRequest.getServiceName())
						&& "savePaymentTerm".equalsIgnoreCase(aeRequest.getMethod())) {
					
					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.savePaymentTerm(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if ("FacturationService".equalsIgnoreCase(aeRequest.getServiceName())
						&& "loadPaymentTermTemplates".equalsIgnoreCase(aeRequest.getMethod())) {
					
					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.loadPymentTermTemplates(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if ("FacturationService".equalsIgnoreCase(aeRequest.getServiceName())
						&& "loadPaymentTermTemplate".equalsIgnoreCase(aeRequest.getMethod())) {
					
					//AEFacturationService facturationService = 
					//	(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					//AEResponse aeResponse = facturationService.loadPaymentTermTemplate(aeRequest, invContext);
					//out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if ("FacturationService".equalsIgnoreCase(aeRequest.getServiceName())
						&& "deletePaymentTerm".equalsIgnoreCase(aeRequest.getMethod())) {
					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.deletePaymentTermTemplate(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("FacturationService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "invoicePayment".equalsIgnoreCase(aeRequest.getMethod())) {

					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse aeResponse = facturationService.invoicePayment(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} 
			} else if (null != action && action.length() > 0) {
				// validate execution
				AEInvocationContext invContext = new AEInvocationContextImp((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
				AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
				invContextValidator.validate(invContext);
				if("print".equalsIgnoreCase(action)) {
					// load print info
					JSONObject arguments = new JSONObject();
					arguments.put("id", request.getParameter("id"));
					arguments.put(
							AEFacture.JSONKey.printTemplateId, 
							request.getParameter(AEFacture.JSONKey.printTemplateId));
					arguments.put("sOwnerId", request.getParameter("sOwnerId"));
					AERequest aeRequest = new AERequest(arguments);
					aeRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
					
					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse printInfo = facturationService.loadPrintInfo(aeRequest, invContext);

					// detect the view
					String printViewURL = null;
					
					Object prnTemplateObj = printInfo.getPayload().opt(AEFacture.JSONKey.printTemplate);
					if(prnTemplateObj instanceof AEFacturePrintTemplate) {
						// first try the code from print template
						AEFacturePrintTemplate prnTemplate = (AEFacturePrintTemplate) prnTemplateObj;
						String prnTemplateCode = prnTemplate.getCode();
						if(!AEStringUtil.isEmpty(prnTemplateCode) && prnTemplateCode.endsWith(".jsp")) {
							printViewURL = AEStringUtil.trim(prnTemplateCode);
						}
					} 
					
					if(printViewURL == null) {
						//  try the code from print template
						AEDocumentType aeDocType = AEDocumentType.valueOf(Integer.parseInt(request.getParameter("docType")));
						if(aeDocType == null || AEDocumentType.valueOf(AEDocumentType.System.NA).equals(aeDocType)) {
							throw new AEException("System Error: Unknnown document type!");
						}
						printViewURL = AEDocumentFactory.getInstance(aeDocType).getPrintViewURL(aeDocType);
					}
					
					// redirect to view
					request.setAttribute(
							AEFacture.JSONKey.facture, 
							printInfo.getPayload().getJSONObject(AEFacture.JSONKey.facture));
					request.setAttribute(
							AEFacture.JSONKey.vatItemsView, 
							printInfo.getPayload().opt(AEFacture.JSONKey.vatItemsView));
					request.setAttribute(
							AEClient.JSONKey.client, 
							printInfo.getPayload().optJSONObject(AEClient.JSONKey.client));
					request.setAttribute(
							"issuer", 
							printInfo.getPayload().optJSONObject("issuer"));
					request.setAttribute(
							AEFacture.JSONKey.printTemplate, 
							printInfo.getPayload().opt(AEFacture.JSONKey.printTemplate));
					
					RequestDispatcher view = request.getRequestDispatcher(printViewURL);
					view.forward(request, response);
				} else if("tableauDeBord".equalsIgnoreCase(action)) {
					/**
					 * load tableau de bord
					 */
					JSONObject arguments = new JSONObject();
					arguments.put("sOwnerId", request.getParameter("sOwnerId"));
					AERequest aeRequest = new AERequest(arguments);
					aeRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
					
					AEFacturationService facturationService = 
						(AEFacturationService) ServiceLocator.getInstance().getService(Services.FACTURATION);
					AEResponse tableauDeBord = facturationService.loadTableauDeBord(aeRequest, invContext);

					/**
					 * detect the view
					 */
					String tableauDeBordURL = AEFactureFactory.getInstance().getTableauDeBordURL();
					
					/**
					 * prepare request
					 */
					request.setAttribute(
							"date", 
							tableauDeBord.getPayload().get("date")); // Java object Date
					request.setAttribute(
							"overdueDebts", 
							tableauDeBord.getPayload().get("overdueDebts")); // AEPaymentsList
					request.setAttribute(
							"maturityDebts", 
							tableauDeBord.getPayload().get("maturityDebts")); // AEPaymentsList
					request.setAttribute(
							"mostBilledCustomers", 
							tableauDeBord.getPayload().getJSONArray("mostBilledCustomers")); // JSONArray
					request.setAttribute(
							"trend", 
							tableauDeBord.getPayload().getJSONArray("trend")); // JSONArray
					request.setAttribute(
							"acceptedDevises", 
							tableauDeBord.getPayload().getJSONObject("acceptedDevises")); // JSONObject
					request.setAttribute(
							"acceptedDevisesCurrentMonth", 
							tableauDeBord.getPayload().getJSONObject("acceptedDevisesCurrentMonth")); // JSONObject
					request.setAttribute(
							"finYearTurnover", 
							tableauDeBord.getPayload().getJSONObject("finYearTurnover")); // JSONObject
					
					/**
					 * redirect the request
					 */
					RequestDispatcher view = request.getRequestDispatcher(tableauDeBordURL);
					view.forward(request, response);
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
