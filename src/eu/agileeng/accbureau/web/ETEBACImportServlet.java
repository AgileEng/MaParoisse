package eu.agileeng.accbureau.web;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.tomcat.util.json.JSONException;
import org.apache.tomcat.util.json.JSONObject;
import org.jboss.logging.Logger;

import eu.agileeng.accbureau.AEApp;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.ServiceLocator;
import eu.agileeng.services.ServiceLocator.Services;
import eu.agileeng.services.cash.CashService;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.util.AEFileUtil;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class ETEBACImportServlet
 */
public class ETEBACImportServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
    
	private static Logger logger = Logger.getLogger(ETEBACImportServlet.class);
	
	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ETEBACImportServlet() {
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
		// session.setMaxInactiveInterval(5);
		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty("tmpRepository"));
		File fileETEBAC = null;

		try {
			// validate secured connection
			HttpUtil.getInstance().isSecure(request);
			
			// validate execution
			AuthPrincipal ap = (AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL);
			AEInvocationContext invContext = new AEInvocationContextImp(ap);
			AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
			invContextValidator.validate(invContext);
			AEResponse aeResponse = null;
			
			if (ServletFileUpload.isMultipartContent(request)) { 
				FileItemFactory factory = new DiskFileItemFactory();
				ServletFileUpload upload = new ServletFileUpload(factory);
				List<FileItem> items = upload.parseRequest(request);
				if(items != null) {
					Iterator<FileItem> iter = items.iterator();  
					while (iter.hasNext()) {  
						FileItem item = iter.next();				 
						if(!item.isFormField() && item.getSize() > 0) { 
							fileETEBAC = new File(
									tmpRepository, 
									AEFileUtil.createTempFileName("ebics_tmp_", null, tmpRepository));
							item.write(fileETEBAC);
							
							// import
							CashService cashService = 
								(CashService) ServiceLocator.getInstance().getService(Services.CASH);
							aeResponse = cashService.importETEBAC(
									fileETEBAC, 
									invContext);
							
							// return response
							JSONObject jsonResponse = aeResponse.getPayload();
							jsonResponse.put("success", true);
							out.write(jsonResponse.toString());
							out.flush();
							break;
						}			     
					} 
				}
			}
			
			if(aeResponse == null) {
				JSONObject jsonResponse = new JSONObject();
				jsonResponse.put("success", true);
				out.write(jsonResponse.toString());
				out.flush();
			}
		} catch (Exception e) {
			logger.error("ETEBACImportServlet failed ", e);
			try {
				JSONObject jsonResponse = new JSONObject();
				jsonResponse.put("success", false);
				jsonResponse.put("msg", e.getLocalizedMessage());
				out.print(jsonResponse.toString());		
				out.flush();
			} catch (JSONException e1) {
				logger.error(e1);
			}
		} finally {
			try {
				response.flushBuffer();
			} catch(Exception ex){
			}
			
			// delete tmp file
			if(fileETEBAC != null) {
				try {
					fileETEBAC.delete();
				} catch(Throwable t) {
				}
			}
		}
	}
}
