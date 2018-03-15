package eu.agileeng.accbureau.web.filter;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

import org.jboss.logging.Logger;

import eu.agileeng.accbureau.AEApp;
import eu.agileeng.util.AEFileUtil;

public class FileCaptureServletResponse extends HttpServletResponseWrapper {
	
	private static Logger logger = Logger.getLogger(FileCaptureServletResponse.class);
	
	private File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
	private File contentFile = null;
	private PrintWriter writer;
	
	public FileCaptureServletResponse(HttpServletResponse originalResponse) {
		super(originalResponse); 
		
		try {
			contentFile = new File(
					tmpRepository, 
					AEFileUtil.createTempFileName("file_captured_response_tmp_", "html", tmpRepository));
		} catch (IOException e) {
			logger.error(e);
		}
	}

	@Override
	public PrintWriter getWriter() throws IOException {
		if(writer == null) {
			FileOutputStream fos = new FileOutputStream(contentFile);
			OutputStreamWriter osw = new OutputStreamWriter(fos, "UTF-8");
			writer = new PrintWriter(osw);
		}
		return writer;
	}

	/**
	 * @return the capturedResponse
	 */
	public final File getContentFile() {
		return contentFile;
	}
}








