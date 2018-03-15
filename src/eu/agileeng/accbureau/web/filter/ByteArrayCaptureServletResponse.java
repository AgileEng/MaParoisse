package eu.agileeng.accbureau.web.filter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

public class ByteArrayCaptureServletResponse extends HttpServletResponseWrapper {
	
//	private static Logger logger = Logger.getLogger(ByteArrayCaptureServletResponse.class);
	
	ByteArrayOutputStream out = new ByteArrayOutputStream(10*1024); // 10K
	private PrintWriter writer;
	
	public ByteArrayCaptureServletResponse(HttpServletResponse originalResponse) {
		super(originalResponse); 
	}

	@Override
	public PrintWriter getWriter() throws IOException {
		if(writer == null) {
			OutputStreamWriter osw = new OutputStreamWriter(out, "UTF-8");
			writer = new PrintWriter(osw);
		}
		return writer;
	}
	
	public ByteArrayOutputStream getByteArrayOutputStream() {
		return out;
	}
}
