package eu.agileeng.accbureau.web;

import java.io.IOException;
import java.io.PrintWriter;

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
import eu.agileeng.services.document.AEDocumentService;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class DocumentServlet
 */
public class DocumentServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
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
				invContext.setProperty(AEInvocationContext.HttpSessionId, session.getId());
				
				AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
				invContextValidator.validate(invContext);

				// expected token
				HttpUtil.getInstance().validateToken(
						session.getId(), 
						ap, 
						request.getParameter(HttpUtil.MONENTREPRISE_TOKEN_NAME));
				
				AERequest aeRequest = new AERequest(json);
				aeRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
				if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveDocument".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.save(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveDocuments".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.saveDocuments(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadSupplyTemplate".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.loadSupplyTemplate(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadByfilter".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.loadByFilter(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "closePurchasePeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.closePurchasePeriod(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "openPurchasePeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.openPurchasePeriod(aeRequest);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "delete".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.delete(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadStatementOfTransactions".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.loadSOT(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "closeSOTPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.closeSOTPeriod(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "openSOTPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.openSOTPeriod(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				}  else if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadSOTExc".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.loadSOTExc(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "closeSOTExcPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.closeSOTExcPeriod(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "openSOTExcPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.openSOTExcPeriod(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "recreateSOTExc".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.recreateSOTExc(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "recreateSOT".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.recreateSOT(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "onValidated".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.onValidated(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "onValidatedArray".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.onValidatedArray(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "updateToLocked".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.updateToLocked(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("DocumentService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "updateToNotLocked".equalsIgnoreCase(aeRequest.getMethod())) {

					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					AEResponse aeResponse = docService.updateToNotLocked(aeRequest, invContext);
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
