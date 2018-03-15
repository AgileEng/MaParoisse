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

import eu.agileeng.accbureau.AEApp;
import eu.agileeng.domain.AEException;
import eu.agileeng.domain.document.AEDocumentFactory;
import eu.agileeng.domain.document.AEDocumentType;
import eu.agileeng.domain.document.AEPrintTemplate;
import eu.agileeng.domain.document.social.AESocialDocumentView;
import eu.agileeng.domain.document.social.SocialTimeSheet;
import eu.agileeng.domain.document.social.SocialTimeSheetEntry;
import eu.agileeng.persistent.dao.DAOFactory;
import eu.agileeng.persistent.dao.social.SocialDAO;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.AERequest;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.ServiceLocator;
import eu.agileeng.services.ServiceLocator.Services;
import eu.agileeng.services.document.AEDocumentService;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.services.social.AESocialService;
import eu.agileeng.util.AEStringUtil;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class SocialServlet
 */
public class SocialServlet extends HttpServlet {
       
	/**
	 * 
	 */
	private static final long serialVersionUID = -5068016420216647458L;
	
	private static final String LOGO_PATH = "/client/resources/logos/";

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
		// Get the current HttpSession associated with this request or, 
		// if there is no current session get a new one.
		HttpSession session = request.getSession(true);

		// init response before to get its writer
		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		
		// get the response writer
		PrintWriter out = response.getWriter();

		// process request
		String json = request.getParameter("json");
		String action = request.getParameter("action");
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
				if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveDocument".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.save(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "deleteDocument".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.delete(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadByFilter".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.loadByFilter(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "load".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.load(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadEmployees".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.loadEmployees(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveSalaryGrid".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.saveSalaryGrid(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadSalaryGridsAllLazy".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.loadSalaryGridsAllLazy(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadSalaryGrid".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.loadSalaryGrid(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "calculateSalary".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.calculateSalary(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadSocialInfo".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.loadSocialInfo(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadActualAttestation".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.loadActualAttestation(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveTimeSheet".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.saveTimeSheet(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadTimeSheet".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.loadTimeSheet(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "pushWeek".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.pushWeek(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "popWeek".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.popWeek(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "generateSchedule".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.generateSchedule(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "importSchedule".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.importSchedule(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "importScheduleExt".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.importScheduleExt(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "closePeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.closePeriod(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "openPeriod".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.openPeriod(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadTimeSheetInfo".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.loadTimeSheetInfo(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadTimeSheetActualInfo".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.loadTimeSheetActualInfo(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "updateSocialTimeSheetActual".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.updateTimeSheetEntryActual(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "updateDailyTimeSheetActual".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.updateDailyTimeSheetActual(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadPrintTemplates".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.loadPrintTemplates(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "transferFromMonBureau".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.transferFromMonBureau(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadUniqEmployees".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.loadUniqEmployees(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "saveEmployeeFtpId".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.saveEmployeeFtpId(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "generateEmplFtpId".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.generateEmplFtpId(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("SocialService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadDailyPlanning".equalsIgnoreCase(aeRequest.getMethod())) {

					AESocialService socialService = (AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.loadDailyPlanning(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} 
			} else if (null != action && action.length() > 0) {
				// validate execution
				AEInvocationContext invContext = new AEInvocationContextImp((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
				AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
				invContextValidator.validate(invContext);
				if("print".equalsIgnoreCase(action)) {
					// load document
					JSONObject arguments = new JSONObject();
					JSONObject document = new JSONObject();
					document.put("id", request.getParameter("id"));
					document.put("docType", request.getParameter("docType"));
					arguments.put("document", document);
					arguments.put("loadCustomer", true);
					arguments.put("loadSocialInfo", true);
					
					AERequest aeRequest = new AERequest(arguments);
					aeRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.load(aeRequest, invContext);

					// detect the view
					AEDocumentType aeDocType = AEDocumentType.valueOf(Integer.parseInt(request.getParameter("docType")));
					if(aeDocType == null || AEDocumentType.valueOf(AEDocumentType.System.NA).equals(aeDocType)) {
						throw new AEException("System Error: Unknnown document type!");
					}
					String printViewURL = AEDocumentFactory.getInstance(aeDocType).getPrintViewURL(aeDocType);
					
					// redirect to view
					request.setAttribute("document", aeResponse.getPayload().getJSONObject("document"));	
					request.setAttribute("customer", aeResponse.getPayload().getJSONObject("customer"));
					if(aeResponse.getPayload().has("socialInfo")) {
						JSONObject socialInfoJson = aeResponse.getPayload().optJSONObject("socialInfo");
						if(socialInfoJson != null) {
							if(!AEStringUtil.isEmpty(socialInfoJson.optString("logoUrl"))) {
								request.setAttribute("logoURL", LOGO_PATH + socialInfoJson.optString("logoUrl"));
							}
							request.setAttribute("socialInfo", aeResponse.getPayload().optJSONObject("socialInfo"));	
						}
					}
					
					RequestDispatcher view = request.getRequestDispatcher(printViewURL);
					view.forward(request, response);
					// view.forward(request, new FileCaptureServletResponse(response));
				} else if("generate".equalsIgnoreCase(action)) {
					// load document
					JSONObject arguments = new JSONObject();
					JSONObject document = new JSONObject();
					document.put("id", request.getParameter("id"));
					document.put("docType", request.getParameter("docType"));
					arguments.put("document", document);
					arguments.put("loadCustomer", true);
					arguments.put("loadSocialInfo", true);
					arguments.put("loadSalaryGrid", true);
					
					AERequest aeRequest = new AERequest(arguments);
					aeRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.load(aeRequest, invContext);
					
					// load time sheet
					AESocialDocumentView socialDocView = new AESocialDocumentView(aeResponse.getPayload().getJSONObject("document"));
					SocialTimeSheet timeSheet = socialService.loadTemplateTimeSheet(
							socialDocView.getEmployeeId(), 
							invContext);

					// detect the view
					String printViewURL = null;
					if(request.getParameter("templateId") != null) {
						long templateId = Long.parseLong(request.getParameter("templateId"));
						DAOFactory daoFactory = DAOFactory.getInstance();
						SocialDAO socialDAO = daoFactory.getSocialDAO(null);
						AEPrintTemplate template = socialDAO.loadPrintTemplate(templateId);
						printViewURL = template.getTemplateURL();
					} else {
						AEDocumentType aeDocType = AEDocumentType.valueOf(Integer.parseInt(request.getParameter("docType")));
						if(aeDocType == null || AEDocumentType.valueOf(AEDocumentType.System.NA).equals(aeDocType)) {
							throw new AEException("System Error: Unknnown document type!");
						}
						printViewURL = AEDocumentFactory.getInstance(aeDocType).getPrintViewURL(aeDocType);
					}
					
					// redirect to view
					request.setAttribute("document", aeResponse.getPayload().getJSONObject("document"));	
					request.setAttribute("customer", aeResponse.getPayload().getJSONObject("customer"));
					if(aeResponse.getPayload().has("socialInfo")) {
						JSONObject socialInfoJson = aeResponse.getPayload().optJSONObject("socialInfo");
						if(socialInfoJson != null) {
							if(!AEStringUtil.isEmpty(socialInfoJson.optString("logoUrl"))) {
								request.setAttribute("logoURL", LOGO_PATH + socialInfoJson.optString("logoUrl"));
							}
							request.setAttribute("socialInfo", aeResponse.getPayload().optJSONObject("socialInfo"));	
						}
					}
					if(aeResponse.getPayload().has("salaryGrid")) {
						JSONObject salaryGridJson = aeResponse.getPayload().optJSONObject("salaryGrid");
						if(salaryGridJson != null) {
							request.setAttribute("salaryGrid", salaryGridJson);	
						}
					}
					request.setAttribute("timeSheet", timeSheet);	
					
					RequestDispatcher view = request.getRequestDispatcher(printViewURL);
					view.forward(request, response);
					// view.forward(request, new FileCaptureServletResponse(response));
					
					// lock the document
					JSONObject updateToLockedArguments = new JSONObject();
					updateToLockedArguments.put("document", aeResponse.getPayload().getJSONObject("document"));
					AERequest updateToLockedRequest = new AERequest(updateToLockedArguments);
					updateToLockedRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
					invContext.setProperty(AEInvocationContext.AEConnection, null);
					AEDocumentService docService = 
						(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
					docService.updateToLocked(updateToLockedRequest, invContext);
					
					// send mail
					JSONObject sendEMailArguments = new JSONObject();
					sendEMailArguments.put("document", aeResponse.getPayload().getJSONObject("document"));
					sendEMailArguments.put("customer", aeResponse.getPayload().getJSONObject("customer"));
					sendEMailArguments.put("action", "Générer");
					AERequest sendEMailRequest = new AERequest(sendEMailArguments);
					sendEMailRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
					invContext.setProperty(AEInvocationContext.AEConnection, null);
					socialService.sendEMail(sendEMailRequest, invContext);
				} else if("reportPeriodPlanning".equalsIgnoreCase(action)) {
					// load document
					JSONObject arguments = new JSONObject();
					
					String ownerId = SocialTimeSheetEntry.JsonKey.ownerId.name();
					arguments.put(ownerId, request.getParameter(ownerId));
					
					String sOwnerId = "sOwnerId";
					arguments.put(sOwnerId, request.getParameter(sOwnerId));
					
					String periodTypeId = SocialTimeSheetEntry.JsonKey.periodType.name();
					arguments.put(periodTypeId, request.getParameter(periodTypeId));
					
					// fromDate
					String fromDate = SocialTimeSheet.JsonKey.fromDate.name();
					arguments.put(fromDate, request.getParameter(fromDate));
					
					// toDate
					String toDate = SocialTimeSheet.JsonKey.toDate.name();
					arguments.put(toDate, request.getParameter(toDate));
					
					//groupBy {10, 20}
					String groupBy = "groupBy";
					arguments.put(groupBy, request.getParameter(groupBy));
					
					// execute request
					AERequest aeRequest = new AERequest(arguments);
					aeRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
					AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
					AEResponse aeResponse = socialService.reportPeriodPlanning(aeRequest, invContext);

					// detect the jsp
					// FIXME
					String printViewURL = "/myFirst.jsp";

					// set attributes
					request.setAttribute("json", aeResponse.getPayload());	
					
					// forward to the jsp
					RequestDispatcher view = request.getRequestDispatcher(printViewURL);
					view.forward(request, response);
				}
			}
		} catch (Exception e) {
			AEApp.logger().error("Social servlet: Error in doProcess: ", e);
			AEResponse aeResponse = new AEResponse();
			aeResponse.setError(new AEException(e));
			try {
				out.write(aeResponse.toJSONObject().toString());
			} catch (JSONException e1) {
				AEApp.logger().error("Social servlet: Error writing to out stream: " + e1.toString());
			}
			out.flush();
		} finally {
			try {
				response.flushBuffer();
			} catch(Exception ex) {
				AEApp.logger().error("Social servlet: Error flushing the Response: " + ex.toString());
			}
		}
	}
	
//	/**
//	 * Delete all files and sub directories
//	 * @param path
//	 * @return boolean. True for success
//	 */
//	protected boolean deleteDirectory(File path) {
//		if( path.exists() ) {
//			File[] files = path.listFiles();
//			for(int i=0; i<files.length; i++) {
//				if(files[i].isDirectory()) {
//					deleteDirectory(files[i]);
//				}
//				else {
//					files[i].delete();
//				}
//			}
//		}
//		return( path.delete() );
//	}
}
