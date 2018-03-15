package eu.agileeng.accbureau.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.json.JSONArray;
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
import eu.agileeng.services.dmtbox.DmtboxService;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.util.AEStringUtil;
import eu.agileeng.util.http.HttpUtil;
import eu.agileeng.ws.client.IWSFrontal;
import eu.agileeng.ws.client.ListServiceGroupsBean;
import eu.agileeng.ws.client.ServiceDTO;
import eu.agileeng.ws.client.SoapFaultException;
import eu.agileeng.ws.client.SubscribedListBean;
import eu.agileeng.ws.client.WSFrontalImplService;

/**
 * Servlet implementation class DmtboxServlet
 */
public class DmtboxServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public DmtboxServlet() {
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

		String method = AEStringUtil.EMPTY_STRING;
		String json = request.getParameter("json");

		try {
			// validate secured connection
			HttpUtil.getInstance().isSecure(request);
			AERequest aeRequest = null;
			AEInvocationContext invContext = null;

			if (null != json && json.length() > 0) {
				// authetication
				AuthPrincipal ap = (AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL);
				invContext = new AEInvocationContextImp(ap);
				AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
				invContextValidator.validate(invContext);

				// expected token
				HttpUtil.getInstance().validateToken(
						session.getId(), 
						ap, 
						request.getParameter(HttpUtil.MONENTREPRISE_TOKEN_NAME));

				aeRequest = new AERequest(json);
				aeRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
				method = aeRequest.getMethod();
			}

			if ("loadInitialData".equalsIgnoreCase(method)) {
				DmtboxService dmtboxService = 
						(DmtboxService) ServiceLocator.getInstance().getService(Services.DMTBOX);
				
				WSFrontalImplService frontal = new WSFrontalImplService();
				
				IWSFrontal port = frontal.getWSFrontalImplPort();
				
				List<ServiceDTO> services = port.getServiceList(dmtboxService.getOperatorId()).getService();
				
				//port.getServiceSubscribed(operatorId, virtualBoxId)
				
				JSONArray srvs = new JSONArray();
				
				for(ServiceDTO srv : services) {
					JSONObject service = new JSONObject();
					service.put("id", srv.getServiceId());
					service.put("name", srv.getServiceName());
					service.put("type", srv.getType());
					
					srvs.put(service);
				}
				
				JSONObject arguments = aeRequest.getArguments();
				
				long ownerId = arguments.optLong("sOwnerId");
				
				//String virtualBoxId = dmtboxService.generateVirtualBoxId(ownerId, invContext);
				String customerName = dmtboxService.getCustomerName(ownerId, invContext);
				
				JSONObject payload = new JSONObject();
				
				payload.put("services", srvs);
				//payload.put("virtualBoxId", "");
				payload.put("customerName", customerName);
				
				AEResponse aeResponse = new AEResponse(payload);
				
				out.write(aeResponse.toJSONObject().toString());
			} else if ("pairDmtboxScanner".equalsIgnoreCase(method)) {
				DmtboxService dmtboxService = 
						(DmtboxService) ServiceLocator.getInstance().getService(Services.DMTBOX);
				
				WSFrontalImplService frontal = new WSFrontalImplService();
				
				IWSFrontal port = frontal.getWSFrontalImplPort();
				
				JSONObject arguments = aeRequest.getArguments();
				
				long ownerId = arguments.optLong("sOwnerId");
				
				String virtualBoxId = dmtboxService.generateVirtualBoxId(ownerId, arguments.optString("virtualBoxName"), invContext);
				String customerName = arguments.optString("customerName");
				String pairingCode = arguments.optString("pairingCode");
				// extract services tree
				ListServiceGroupsBean services = new ListServiceGroupsBean();
				if (arguments.optJSONArray("services") != null) services.createServiceList(arguments.optJSONArray("services"));
				//send pairing information to frontal
				String frontalResp = port.putServiceSubscribe(dmtboxService.getOperatorId(), virtualBoxId, customerName, null, pairingCode, services, false, null, 0);
				
				JSONObject payload = new JSONObject();
				
				//payload.put("services", srvs);
				payload.put("virtualBoxId", virtualBoxId);
				payload.put("customerName", customerName);
				payload.put("response", frontalResp);
				
				
				
				AEResponse aeResponse = new AEResponse(payload);
				
				out.write(aeResponse.toJSONObject().toString());
			} else if ("loadVirtualBoxByOwnerId".equalsIgnoreCase(method)) {
				DmtboxService dmtboxService = 
						(DmtboxService) ServiceLocator.getInstance().getService(Services.DMTBOX);
				
				JSONObject arguments = aeRequest.getArguments();
				
				long ownerId = arguments.optLong("sOwnerId");
				
				JSONArray virtualBox = dmtboxService.loadVirtualBoxByOwnerId(ownerId, invContext);
				
				
				JSONObject payload = new JSONObject();
				
				payload.put("virtualBoxes", virtualBox);
				
				AEResponse aeResponse = new AEResponse(payload);
				
				out.write(aeResponse.toJSONObject().toString());
			} else if ("loadServicesForVirtualBoxId".equalsIgnoreCase(method)) {
				DmtboxService dmtboxService = 
						(DmtboxService) ServiceLocator.getInstance().getService(Services.DMTBOX);
				//gather arguments
				JSONObject arguments = aeRequest.getArguments();
				// long ownerId = arguments.optLong("sOwnerId");
				String virtualBoxId = arguments.optString("virtualBoxId");
				
				//load endpoint interface
				WSFrontalImplService frontal = new WSFrontalImplService();
				IWSFrontal port = frontal.getWSFrontalImplPort();
				
				
				SubscribedListBean subscribedServices = port.getServiceSubscribed(dmtboxService.getOperatorId(), virtualBoxId);
				List<ServiceDTO> services = port.getServiceList(dmtboxService.getOperatorId()).getService();
				
				JSONArray srvs = new JSONArray();
				
				for(ServiceDTO srv : services) {
					JSONObject service = new JSONObject();
					service.put("id", srv.getServiceId());
					service.put("name", srv.getServiceName());
					service.put("type", srv.getType());
					
					srvs.put(service);
				}
				
				JSONObject payload = new JSONObject();
				
				if (subscribedServices.getServices() == null) {
					
					//throw new AEException("There are no services subscribed with this virtualBoxId!");
					subscribedServices.setServices(new ListServiceGroupsBean());
				}
				
				payload.put("services", srvs);
				payload.put("servicesSubscribed", subscribedServices.getServices().toJSONArray());
				payload.put("virtualBoxId", virtualBoxId);
				payload.put("customerName", subscribedServices.getCustomerName());
				
				AEResponse aeResponse = new AEResponse(payload);
				
				out.write(aeResponse.toJSONObject().toString());
			} else if ("updateServicesForVirtualBoxId".equalsIgnoreCase(method)) {
				DmtboxService dmtboxService = 
						(DmtboxService) ServiceLocator.getInstance().getService(Services.DMTBOX);
				//gather arguments
				JSONObject arguments = aeRequest.getArguments();
				long ownerId = arguments.optLong("sOwnerId");
				String virtualBoxId = arguments.optString("virtualBoxId");
				String customerName = arguments.optString("customerName");
				
				//load endpoint interface
				WSFrontalImplService frontal = new WSFrontalImplService();
				IWSFrontal port = frontal.getWSFrontalImplPort();
				
				ListServiceGroupsBean services = new ListServiceGroupsBean();
				if (arguments.optJSONArray("servicesSubscribed") != null) services.createServiceList(arguments.optJSONArray("servicesSubscribed"));
				//send service subscription information to frontal
				
				//validate operation rights
				dmtboxService.validateOwnershipOfVirtualBoxId(ownerId, virtualBoxId, invContext);
				
				String frontalResp = port.putServiceSubscribe(dmtboxService.getOperatorId(), virtualBoxId, customerName, null, null, services, false, null, 0);
				
				JSONObject payload = new JSONObject();
				
				
				payload.put("servicesSubscribed", services.toJSONArray());
				payload.put("virtualBoxId", virtualBoxId);
				payload.put("customerName", customerName);
				payload.put("virtualBoxName", arguments.optString("virtualBoxName"));
				payload.put("frontalResp", frontalResp);
				
				AEResponse aeResponse = new AEResponse(payload);
				
				out.write(aeResponse.toJSONObject().toString());
			}
		
		} catch (SoapFaultException se) {
			AEResponse aeResponse = new AEResponse();
			AEException ex = new AEException(se.getMessage()+". Please revise the pairing code!");
			aeResponse.setError(new AEException(ex));
			try {
				out.write(aeResponse.toJSONObject().toString());
			} catch (JSONException e1) {
			}
			out.flush();
		} catch (Exception e) {
			AEResponse aeResponse = new AEResponse();
			aeResponse.setError(new AEException(e));
			try {
				out.write(aeResponse.toJSONObject().toString());
			} catch (JSONException e1) {
			}
			out.flush();
		} finally {
			try {
				response.flushBuffer();
			} catch(Exception ex){
			}
		}
	}
}
