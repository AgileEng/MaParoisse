package eu.agileeng.accbureau.web;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
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
import org.apache.commons.io.FileUtils;
import org.apache.tomcat.util.json.JSONException;
import org.apache.tomcat.util.json.JSONObject;

import eu.agileeng.accbureau.AEApp;
import eu.agileeng.security.AuthAccessController;
import eu.agileeng.security.AuthPermission;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class JcrUploadServlet
 */
public class JcrUploadServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = -3536164405193240069L;
	
	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public JcrUploadServlet() {
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

		try {
			// validate secured connection
			HttpUtil.getInstance().isSecure(request);
			
			// validate execution
			AEInvocationContext invContext = new AEInvocationContextImp((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
			AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
			invContextValidator.validate(invContext);
			
			// check permission
			AuthAccessController.checkPermission(new AuthPermission("System/TmpRepository", AuthPermission.SAVE), invContext);
			
			if (ServletFileUpload.isMultipartContent(request)) { 
				FileItemFactory factory = new DiskFileItemFactory();
				ServletFileUpload upload = new ServletFileUpload(factory);
				upload.setHeaderEncoding("UTF-8");
				List<FileItem> items = upload.parseRequest(request);
				if(items != null) {
					// ensure temp directory for this session
					Path tmpFileRepository = AEApp.getInstance().getTmpRepository();
					if(!Files.exists(tmpFileRepository)) {
						Files.createDirectories(tmpFileRepository);
					}
					
					// save the file in this tmp directory
					Iterator<FileItem> iter = items.iterator();  
					while (iter.hasNext()) {  
						FileItem item = iter.next();
						if(!item.isFormField() && item.getSize() > 0) { 
							JSONObject payload = new JSONObject();
							if(item.getSize() > (20 * FileUtils.ONE_MB)) {
								payload.put("success", false);
								payload.put(
										"errormsg", 
										"La taille maximale autorisée pour le fichier importer est 20 MB.");
							} else {
								File tmpFile = new File(tmpFileRepository.toFile(), item.getName());
								item.write(tmpFile);

								payload.put("success", true);
								payload.put("fileName", tmpFile.getAbsolutePath());
							}

							out.write(payload.toString());
							out.flush();
							break;
						}			     
					} 
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			try {
				JSONObject jsonResponse = new JSONObject();
				jsonResponse.put("success", false);
				jsonResponse.put("msg", e.getLocalizedMessage());
				out.print(jsonResponse.toString());		
				out.flush();
			} catch (JSONException e1) {
				e1.printStackTrace();
			}
		} finally {
			try {
				response.flushBuffer();
			} catch(Exception ex){
				ex.printStackTrace();
			}
		}
	}
}
