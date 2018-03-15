package eu.agileeng.accbureau.web;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.ws.BindingProvider;

import org.apache.tomcat.util.json.JSONArray;
import org.apache.tomcat.util.json.JSONException;
import org.apache.tomcat.util.json.JSONObject;

import eu.agileeng.domain.AEException;
import eu.agileeng.domain.messaging.DiscussionBoardSubjectList;
import eu.agileeng.domain.messaging.ejb.MessagingService;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AERequest;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.ServiceLocator;
import eu.agileeng.services.ServiceLocator.Services;
import eu.agileeng.util.AEStringUtil;
import eu.agileeng.ws.client.IWSFrontal;
import eu.agileeng.ws.client.ServiceListBean;
import eu.agileeng.ws.client.SoapFaultException;
import eu.agileeng.ws.client.WSFrontalImplService;

/**
 * Servlet implementation class DematBoxServlet
 */
public class DematBoxServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DematBoxServlet() {
        super();
        // TODO Auto-generated constructor stub
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

		String method = AEStringUtil.EMPTY_STRING;
		String json = request.getParameter("json");
		long docId = Long.parseLong(json);
		String action = request.getParameter("action");
		
		try {
			// validate secured connection
			//FIXME:HttpUtil.getInstance().isSecure(request);
			AERequest aeRequest = null;
			AEInvocationContext invContext = null;
			
//			if (null != json && json.length() > 0) {
//				// authetication
//				AuthPrincipal ap = (AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL);
//				invContext = new AEInvocationContextImp(ap);
//				AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
//				invContextValidator.validate(invContext);
//
//				// expected token
//				HttpUtil.getInstance().validateToken(
//						session.getId(), 
//						ap, 
//						request.getParameter(HttpUtil.MONENTREPRISE_TOKEN_NAME));
//				
//				aeRequest = new AERequest(json);
//				aeRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
//				method = aeRequest.getMethod();
//			} else if (request.getParameter("node") != null) {
//				method = "loadDiscussionBoardSubjects";
//			}
			
			method = "uploadNotification";
			
			if ("aqui".equalsIgnoreCase(method)) {
				MessagingService messagingService = 
					(MessagingService) ServiceLocator.getInstance().getService(Services.MESSAGING);
				DiscussionBoardSubjectList subjList = messagingService.loadSubjectsByParentId(Long.parseLong(request.getParameter("node")), Long.parseLong(request.getParameter("companyId")));
				/*
				DiscussionBoardSubjectList subjList = new DiscussionBoardSubjectList();
				DiscussionBoardSubject subj1 = new DiscussionBoardSubject();
				subj1.setParentId(0);
				subj1.setName("Topic 1");
				subjList.add(subj1);
				*/
				out.write(subjList.toJSONArray().toString());
			} else if ("getServiceList".equalsIgnoreCase(method)) {
				WSFrontalImplService frontal = new WSFrontalImplService();
				//frontal.addPort(new QName("http://preprod.dematbox.sagemcom.com/Frontal/WS/FrontalService", "PPWSFrontalImplPort"), "2", "http://preprod.dematbox.sagemcom.com/Frontal/WS/FrontalService");
				IWSFrontal port = frontal.getWSFrontalImplPort();
				
				BindingProvider bindingProvider = (BindingProvider) port;
				bindingProvider.getRequestContext().put(
				BindingProvider.ENDPOINT_ADDRESS_PROPERTY, "http://preprod.dematbox.sagemcom.com/Frontal/WS/FrontalService");
				
				ServiceListBean sBean = port.getServiceList(213);
				
				JSONArray jArray = new JSONArray(sBean.getService());
				
				JSONObject resp = new JSONObject();
				System.out.println("Aha!");
				resp.put("services", jArray);
				
				AEResponse aeResp = new AEResponse(resp);
				out.write(aeResp.toJSONObject().toString());
				out.flush();
			} else if ("uploadNotification".equalsIgnoreCase(method)) {
				WSFrontalImplService frontal = new WSFrontalImplService();
				//frontal.addPort(new QName("http://preprod.dematbox.sagemcom.com/Frontal/WS/FrontalService", "PPWSFrontalImplPort"), "2", "http://preprod.dematbox.sagemcom.com/Frontal/WS/FrontalService");
				IWSFrontal port = frontal.getWSFrontalImplPort();
				
//				BindingProvider bindingProvider = (BindingProvider) port;
//				bindingProvider.getRequestContext().put(
//				BindingProvider.ENDPOINT_ADDRESS_PROPERTY, "http://preprod.dematbox.sagemcom.com/Frontal/WS/FrontalService");
				
				JSONObject resp = new JSONObject();
				try {
					resp.put("services", port.uploadNotification(213, "LT12326A15C0089", docId, "Operation successful!", 10));
				} catch (SoapFaultException sfe) {
					throw new Exception("SOAP: "+sfe.getMessage());
				}
				
				AEResponse aeResp = new AEResponse(resp);
				out.write(aeResp.toJSONObject().toString());
				out.flush();
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
