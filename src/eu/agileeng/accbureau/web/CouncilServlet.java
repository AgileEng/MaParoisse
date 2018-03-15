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
import org.jboss.logging.Logger;

import eu.agileeng.domain.AEException;
import eu.agileeng.domain.council.Council;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.AERequest;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.ServiceLocator;
import eu.agileeng.services.ServiceLocator.Services;
import eu.agileeng.services.council.CouncilService;
import eu.agileeng.services.council.ejb.CouncilLocal;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.util.AEStringUtil;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class CouncilServlet
 */
public class CouncilServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	protected static Logger LOG = Logger.getLogger(CouncilServlet.class);
	
	@EJB
	CouncilLocal councilService;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CouncilServlet() {
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
				
				JSONObject arguments = aeRequest.getArguments();
				
				CouncilService councilService = (CouncilService) ServiceLocator.getInstance().getService(Services.COUNCIL);
				
				Council c = councilService.loadInitialData(arguments, invContext);
				
				JSONObject payload = new JSONObject();
				payload.put("council", c.toJSONObject());
				
				AEResponse aeResponse = new AEResponse(payload);
				
				out.write(aeResponse.toJSONObject().toString());
			} else if ("saveCouncil".equalsIgnoreCase(method)) {
				
				JSONObject arguments = aeRequest.getArguments();
				
				CouncilService councilService = (CouncilService) ServiceLocator.getInstance().getService(Services.COUNCIL);
				
				Council c = councilService.save(arguments, invContext);
				
				JSONObject payload = new JSONObject();
				payload.put("council", c.toJSONObject());
				
				AEResponse aeResponse = new AEResponse(payload);
				
				out.write(aeResponse.toJSONObject().toString());
			} else if ("closeCouncil".equalsIgnoreCase(method)) {
				
				JSONObject arguments = aeRequest.getArguments();
				
				CouncilService councilService = (CouncilService) ServiceLocator.getInstance().getService(Services.COUNCIL);
				
				Council c = councilService.closeCouncil(arguments, invContext);
				
				JSONObject payload = new JSONObject();
				payload.put("council", c.toJSONObject());
				
				AEResponse aeResponse = new AEResponse(payload);
				
				out.write(aeResponse.toJSONObject().toString());
			} else if("EngTitresService".equalsIgnoreCase(aeRequest.getServiceName()) 
					&& "loadEngTitres".equalsIgnoreCase(aeRequest.getMethod())) {

				AEResponse aeResponse = councilService.loadEngTitres(aeRequest, invContext);
				out.write(aeResponse.toJSONObject().toString());
				out.flush();
			} else if("EngTitresService".equalsIgnoreCase(aeRequest.getServiceName()) 
					&& "saveEngTitres".equalsIgnoreCase(aeRequest.getMethod())) {

				AEResponse aeResponse = councilService.saveEngTitres(aeRequest, invContext);
				out.write(aeResponse.toJSONObject().toString());
				out.flush();
			}
		
		} catch (Exception e) {
			LOG.error("Exception in CouncilServlet ", e);
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
