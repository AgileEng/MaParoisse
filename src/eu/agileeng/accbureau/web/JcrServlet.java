package eu.agileeng.accbureau.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import javax.ejb.EJB;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.FilenameUtils;
import org.apache.tomcat.util.json.JSONArray;
import org.apache.tomcat.util.json.JSONException;
import org.apache.tomcat.util.json.JSONObject;

import eu.agileeng.accbureau.AEAppModule;
import eu.agileeng.domain.AEDomainObject;
import eu.agileeng.domain.AEException;
import eu.agileeng.persistent.AEPersistentUtil;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.AERequest;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.ServiceLocator;
import eu.agileeng.services.ServiceLocator.Services;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.services.jcr.JcrService;
import eu.agileeng.services.jcr.ejb.JcrLocal;
import eu.agileeng.util.AEFileUtil;
import eu.agileeng.util.AEMimeTypes;
import eu.agileeng.util.AEStringUtil;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class JCRServlet
 */
public class JcrServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1874580584746725682L;
	
	/**
     * A repository proxy that automatically initializes 
     * and shuts down the underlying repository instance 
     * when the first session is opened or the last one closed. 
     * As long as all sessions are properly closed when no longer used, 
     * this class can be used to avoid having to explicitly shut down the repository.
     * 
     * So keep one session to keep repository alive!!!
     * Because Jackrabbit's TransientRepository implementation shuts down 
     * after the last session is closed, 
     * the application maintains a session to ensure that the repository 
     * remains open throughout the application's lifetime. 
	 */
	// private JcrSession keepAliveSession = null;
	
//	private static String aePrefix = "ae";
//	
//	private static String dmtboxPrefix = "dmtbox";
	
	@EJB
	private JcrLocal jcrService;

//	@SuppressWarnings("unchecked")
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		
//		JCRFactory jcrFactory = JCRFactory.getDefaultInstance();
//		try {
//			this.keepAliveSession = jcrFactory.getSession();
//			
//			// register name spaces
//			try {
//				this.keepAliveSession.getSession().getWorkspace().getNamespaceRegistry().registerNamespace(aePrefix, "http://www.agileeng.eu/jcr/1.0");
//			} catch (NamespaceException e) {
//			}
//
//			try {
//				this.keepAliveSession.getSession().getWorkspace().getNamespaceRegistry().registerNamespace(dmtboxPrefix, "http://www.sagemcom.com/jcr/1.0");
//			} catch (NamespaceException e) {
//			}
//            
//            /* Retrieve node type manager from the session */
//            NodeTypeManager nodeTypeManager = this.keepAliveSession.getSession().getWorkspace().getNodeTypeManager();
//
//            /* Create node type */
//            NodeTypeTemplate nodeTypeMixUstructured = nodeTypeManager.createNodeTypeTemplate();
//            nodeTypeMixUstructured.setName("mix:unstructured");
//            nodeTypeMixUstructured.setMixin(true);
//            nodeTypeMixUstructured.setQueryable(true);
//
//            /* Create a new property */
//            PropertyDefinitionTemplate propertyAll = nodeTypeManager.createPropertyDefinitionTemplate();
//            propertyAll.setName("*");
//            propertyAll.setRequiredType(PropertyType.UNDEFINED);
//            nodeTypeMixUstructured.getPropertyDefinitionTemplates().add(propertyAll);
//            nodeTypeManager.registerNodeType(nodeTypeMixUstructured, true);
//			
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
	}

	public void destroy() {
		// JcrSession.close(this.keepAliveSession);
        // this.keepAliveSession = null;
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
		String node = request.getParameter("node");
		try {
			// validate secured connection
			HttpUtil.getInstance().isSecure(request);
			
			AuthPrincipal ap = (AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL);
			AEInvocationContext invContext = new AEInvocationContextImp((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
			invContext.setProperty(AEInvocationContext.HttpSessionId, session.getId());
			AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
			invContextValidator.validate(invContext);
			
			if (null != json && json.length() > 0) {
				// expected token
				HttpUtil.getInstance().validateToken(
						session.getId(), 
						ap, 
						request.getParameter(HttpUtil.MONENTREPRISE_TOKEN_NAME));
				
				AERequest aeRequest = new AERequest(json);
				aeRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
				if("JcrService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "upload".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = jcrService.upload(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("JcrService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "getNode".equalsIgnoreCase(aeRequest.getMethod())) {

					JcrService jsrService = 
						(JcrService) ServiceLocator.getInstance().getService(Services.JCR);
					AEResponse aeResponse = jsrService.getNode(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("JcrService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "download".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = jcrService.getDownloadPath(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("JcrService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "getAttachmentPath".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = jcrService.getAttachmentPath(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				}else if("JcrService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "delete".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = jcrService.delete(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("JcrService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "search".equalsIgnoreCase(aeRequest.getMethod())) {

					JcrService jsrService = 
						(JcrService) ServiceLocator.getInstance().getService(Services.JCR);
					AEResponse aeResponse = jsrService.search(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("JcrService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "copy".equalsIgnoreCase(aeRequest.getMethod())) {

					JcrService jsrService = 
						(JcrService) ServiceLocator.getInstance().getService(Services.JCR);
					AEResponse aeResponse = jsrService.copyNode(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("JcrService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "rename".equalsIgnoreCase(aeRequest.getMethod())) {

					JcrService jsrService = 
						(JcrService) ServiceLocator.getInstance().getService(Services.JCR);
					AEResponse aeResponse = jsrService.renameNode(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("JcrService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "move".equalsIgnoreCase(aeRequest.getMethod())) {

					JcrService jsrService = 
						(JcrService) ServiceLocator.getInstance().getService(Services.JCR);
					AEResponse aeResponse = jsrService.moveNode(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("JcrService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "checkout".equalsIgnoreCase(aeRequest.getMethod())) {

					JcrService jsrService = 
						(JcrService) ServiceLocator.getInstance().getService(Services.JCR);
					AEResponse aeResponse = jsrService.checkout(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("JcrService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "cancelCheckout".equalsIgnoreCase(aeRequest.getMethod())) {

					JcrService jsrService = 
						(JcrService) ServiceLocator.getInstance().getService(Services.JCR);
					AEResponse aeResponse = jsrService.cancelCheckout(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("JcrService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "checkin".equalsIgnoreCase(aeRequest.getMethod())) {

					JcrService jsrService = 
						(JcrService) ServiceLocator.getInstance().getService(Services.JCR);
					AEResponse aeResponse = jsrService.checkin(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("JcrService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "versionHistory".equalsIgnoreCase(aeRequest.getMethod())) {

					JcrService jsrService = 
						(JcrService) ServiceLocator.getInstance().getService(Services.JCR);
					AEResponse aeResponse = jsrService.versionHistory(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("JcrService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "restoreVersion".equalsIgnoreCase(aeRequest.getMethod())) {

					JcrService jsrService = 
						(JcrService) ServiceLocator.getInstance().getService(Services.JCR);
					AEResponse aeResponse = jsrService.restoreVersion(aeRequest, invContext);
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} else if("JcrService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadInitialData".equalsIgnoreCase(aeRequest.getMethod())) {

					JSONArray files = new JSONArray();
					String moduleCode = aeRequest.getArguments().getString(AEAppModule.JSONKey.appModuleCode.name());
					if("170b3".equalsIgnoreCase(moduleCode) // attached to FinancialTransaction
							|| "195b3".equalsIgnoreCase(moduleCode) // attached to BorderauParoise
							|| "175b3".equalsIgnoreCase(moduleCode)) { // Attached to receipt or closable documents
						// special case of attached file
						files = jcrService.listAttachedFiles(aeRequest, invContext);
					} else {
						List<Path> filesList = new ArrayList<Path>();
						
						// shared files
						Path sharedPath = jcrService.getModuleRepositoryPath(aeRequest, invContext);
						if(Files.exists(sharedPath)) {
							filesList.addAll(AEFileUtil.fileList(sharedPath));
						}
						
						// private files
						Path privatePath = Paths.get(sharedPath.toString(), Long.toString(aeRequest.getArguments().optLong(AEDomainObject.JSONKey.sOwnerId.name(), -1L)));
						if(Files.exists(privatePath)) {
							filesList.addAll(AEFileUtil.fileList(privatePath));
						}

						JSONObject f = null;
						files = new JSONArray();
						for (Path path2 : filesList) {
							f = new JSONObject()
								.put(AEDomainObject.JSONKey.id.name(), AEPersistentUtil.getTmpID())
								.put(AEDomainObject.JSONKey.code.name(), AEMimeTypes.getMimeType(FilenameUtils.getExtension(path2.getFileName().toString())))
								.put(AEDomainObject.JSONKey.name.name(), path2.getFileName().toString())
								.put(AEDomainObject.JSONKey.description.name(), AEStringUtil.EMPTY_STRING)
								.put(AEDomainObject.JSONKey.system.name(), Files.exists(privatePath) && path2.startsWith(privatePath) ? false : true);
							files.put(f);
						}
					}
					
					AEResponse aeResponse = new AEResponse(new JSONObject().put("files", files));
					aeResponse.toJSONObject().write(out);
//					out.write(aeResponse.toJSONObject().toString());
					out.flush();
				} 
			} else if (null != node && node.length() > 0) {
				JSONObject arguments = new JSONObject();
				arguments.put("path", node);
				AERequest aeRequest = new AERequest(arguments);
				JcrService jsrService = 
					(JcrService) ServiceLocator.getInstance().getService(Services.JCR);
				AEResponse aeResponse = jsrService.getNode(aeRequest, invContext);
				out.write(aeResponse.getPayload().get("folders").toString());
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
