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

import eu.agileeng.accbureau.AEApp;
import eu.agileeng.domain.AEException;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.AERequest;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.ServiceLocator;
import eu.agileeng.services.ServiceLocator.Services;
import eu.agileeng.services.export.DocumentExportService;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.util.AEStringUtil;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class DocumentExportServlet
 */
public class DocumentExportServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public DocumentExportServlet() {
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

	protected void doProcess(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// get the session
		HttpSession session = request.getSession(true);

		// initialize response
		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();

		String method = AEStringUtil.EMPTY_STRING;
		String json = request.getParameter("json");
		try {
			// validate secured connection
			HttpUtil.getInstance().isSecure(request);
			AEInvocationContext invContext = null;
			AERequest aeRequest = null;

			if (null != json && json.length() > 0) {
				// validate authentication
				AuthPrincipal ap = (AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL);
				invContext = new AEInvocationContextImp(ap);
				AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
				invContextValidator.validate(invContext);
				
				// validate expected token
				HttpUtil.getInstance().validateToken(
						session.getId(), 
						ap, 
						request.getParameter(HttpUtil.MONENTREPRISE_TOKEN_NAME));

				// go
				aeRequest = new AERequest(json);
				aeRequest.setAuthPrincipal(ap);
				method = aeRequest.getMethod();
				
				invContext.setProperty(AEInvocationContext.HttpSessionId, session.getId());
			}

			if ("exportGridAsCsv".equalsIgnoreCase(method)) {
				DocumentExportService exportService = 
						(DocumentExportService) ServiceLocator.getInstance().getService(Services.DOCUMENT_EXPORT);
				JSONObject arguments = aeRequest.getArguments();

				JSONObject payload = exportService.exportGridAsCsv(
						arguments.getJSONObject("grid").getJSONArray("columns"), 
						arguments.getJSONObject("grid").getJSONArray("data"),
						invContext);

				AEResponse aeResp = new AEResponse(payload);
				out.write(aeResp.toJSONObject().toString());
				out.flush();
			} else if ("handleXls".equalsIgnoreCase(method)) {
				DocumentExportService exportService = 
						(DocumentExportService) ServiceLocator.getInstance().getService(Services.DOCUMENT_EXPORT);
				JSONObject arguments = aeRequest.getArguments();

				JSONObject payload = exportService.handleXls(arguments.getString("data"), invContext);

				AEResponse aeResp = new AEResponse(payload);
				out.write(aeResp.toJSONObject().toString());
				out.flush();
			}
		} catch (Exception e) {
			AEApp.logger().error("DocumentExportServlet failed", e);
			AEResponse aeResponse = new AEResponse();
			aeResponse.setError(new AEException(e));
			try {
				out.write(aeResponse.toJSONObject().toString());
			} catch (JSONException e1) {
				AEApp.logger().error(e1);
			}
			out.flush();
		} finally {
			try {
				response.flushBuffer();
			} catch(Exception ex) {
				AEApp.logger().error(ex);
			}
		}
	}

}
