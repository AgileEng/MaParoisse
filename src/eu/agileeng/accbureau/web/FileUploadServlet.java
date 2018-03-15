package eu.agileeng.accbureau.web;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
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
import org.apache.tomcat.util.json.JSONException;
import org.apache.tomcat.util.json.JSONObject;

import eu.agileeng.accbureau.AEApp;
import eu.agileeng.security.AuthAccessController;
import eu.agileeng.security.AuthPermission;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.AERequest;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.ServiceLocator;
import eu.agileeng.services.ServiceLocator.Services;
import eu.agileeng.services.file.FileAttachmentService;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.util.AEFileUtil;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class FileUploadServlet
 */
public class FileUploadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public FileUploadServlet() {
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
		Path fileRepository = AEApp.getInstance().getTmpRepository();

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
				JSONObject jsonFile = new JSONObject();
				FileItemFactory factory = new DiskFileItemFactory();
				ServletFileUpload upload = new ServletFileUpload(factory);
				List<FileItem> items = upload.parseRequest(request);
				if(items != null) {
					Iterator<FileItem> iter = items.iterator();  
					while (iter.hasNext()) {  
						FileItem item = iter.next();				 
						if(!item.isFormField() && item.getSize() > 0) {  
							String fileName = processFileName(item.getName());
							File remoteFile = new File(
									fileRepository.toFile(), 
									AEFileUtil.createTempFileName("att_", processFileExt(item.getName()), fileRepository.toFile()));
							String remoteName = remoteFile.getName();
							item.write(remoteFile);
							
							// prepare return
							// Importanr: return minimum information to the client
							jsonFile.put("name", fileName);
							jsonFile.put("remoteName", remoteName);
						}			     
					} 
					
					// format response
					JSONObject jsonResponse = new JSONObject();
					jsonResponse.put("success", true);
					jsonResponse.put("fileAttachment", jsonFile);
					out.print(jsonResponse.toString());
					out.flush();
				}
			} else {
				String json = request.getParameter("json");
				if (null != json && json.length() > 0) {
					invContext.setProperty(AEInvocationContext.HttpSessionId, session.getId());

					AERequest aeRequest = new AERequest(json);
					aeRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
					if("FileUploadService".equalsIgnoreCase(aeRequest.getServiceName()) 
							&& "manage".equalsIgnoreCase(aeRequest.getMethod())) {

						FileAttachmentService attService = 
							(FileAttachmentService) ServiceLocator
								.getInstance().getService(Services.FILE_ATTACHMENT);
						AEResponse aeResponse = attService.manage(aeRequest, invContext);
						out.write(aeResponse.toJSONObject().toString());
						out.flush();
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			try {
				JSONObject jsonResponse = new JSONObject();
				jsonResponse.put("success", false);
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

	private String processFileName(String fileNameInput) {
		String fileNameOutput=null;
		fileNameOutput = fileNameInput.substring(
				fileNameInput.lastIndexOf("\\") + 1, fileNameInput.length());
		return fileNameOutput;
	}
	
	private String processFileExt(String fileNameInput) {
		String fileNameOutput=null;
		fileNameOutput = fileNameInput.substring(
				fileNameInput.lastIndexOf(".") + 1, fileNameInput.length());
		return fileNameOutput;
	}
}
