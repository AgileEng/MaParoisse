package eu.agileeng.accbureau.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.json.JSONException;

import eu.agileeng.accbureau.AEApp;
import eu.agileeng.domain.AEError;
import eu.agileeng.domain.AEException;
import eu.agileeng.security.AuthAccessController;
import eu.agileeng.security.AuthPermission;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.util.AEFileUtil;
import eu.agileeng.util.AEStringUtil;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class FileDownloadServlet
 */
public class FileDownloadServlet extends HttpServlet {
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

	/**
     *  Sends a file to the ServletResponse output stream.  Typically
     *  you want the browser to receive a different name than the
     *  name the file has been saved in your local database, since
     *  your local names need to be unique.
     *
     *  @param req The request
     *  @param resp The response
     *  @param filename The name of the file you want to download.
     *  @param original_filename The name the browser should receive.
     */
    private void doProcess(HttpServletRequest req, HttpServletResponse resp) throws IOException
    {
		HttpSession session = req.getSession(true);
		try {
			// validate secured connection
			HttpUtil.getInstance().isSecure(req);
			
			// validate execution
			AEInvocationContext invContext = new AEInvocationContextImp((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
			AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
			invContextValidator.validate(invContext);
			
			// check permission
			AuthAccessController.checkPermission(new AuthPermission("System/TmpRepository", AuthPermission.READ), invContext);
			
			if(req.getCharacterEncoding() == null) {
				req.setCharacterEncoding("UTF-8");
			}
	    	String file = req.getParameter("file");
	    	String fileName = req.getParameter("fileName");
	    	String deleteOnExit = req.getParameter("deleteOnExit");
	    	String embeded = req.getParameter("embedded");
	        Path tmpRepository = AEApp.getInstance().getTmpRepository();
	    	
	        // create path
	        Path f = Paths.get(tmpRepository.toString(), file);
	        
	        // download only existing files and only from tmp folder
	        if(!Files.exists(f)) {
	        	throw AEError.System.INVALID_REQUEST.toException();
	        }

	        ServletOutputStream out       = resp.getOutputStream();
	        ServletContext      context  = getServletConfig().getServletContext();
	        String              mimetype = context.getMimeType(fileName);

	        //
	        //  Set the response and go!
	        //
	        resp.setContentType( (mimetype != null) ? mimetype : "application/octet-stream" );
	        resp.setContentLength((int) Files.size(f));
	        if (AEStringUtil.isEmpty(embeded) || !Boolean.parseBoolean(embeded)) { 
	        	resp.setHeader( "Content-Disposition", "attachment; filename=\"" + fileName + "\"" );
	        } else {
	        	resp.setHeader( "Content-Disposition", "filename=\"" + fileName + "\"" );
	        }

	        //
	        //  Stream to the requester.
	        //
	        Files.copy(f, out);
	        out.flush();
	        out.close();
	        
			if(!AEStringUtil.isEmpty(deleteOnExit)) {
				boolean bDel = Boolean.parseBoolean(deleteOnExit);
				if(bDel) {
					AEFileUtil.deleteFileQuietly(f.toFile());
				}
			}
		} catch (Exception e) {
			resp.setContentType("text/html");
			resp.setCharacterEncoding("UTF-8");
			PrintWriter out = resp.getWriter();
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
				resp.flushBuffer();				
			} catch(Exception ex){
				ex.printStackTrace();
			}
		}
    }
}
