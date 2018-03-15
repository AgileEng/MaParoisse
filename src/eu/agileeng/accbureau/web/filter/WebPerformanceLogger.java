package eu.agileeng.accbureau.web.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;

import org.jboss.logging.Logger;

import eu.agileeng.services.AERequest;

@WebFilter(filterName = "WebPerformanceLogger", urlPatterns = {"/*"})
public class WebPerformanceLogger implements Filter {
	 
	private static Logger logger = Logger.getLogger(WebPerformanceLogger.class);
 
	@Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    	Long startTime = null;
    	String msg = null;
    	if(logger.isDebugEnabled()) {
    		String json = request.getParameter("json");
    		if (null != json && json.length() > 0) {
    			try {
    				AERequest aeRequest = new AERequest(json);
					msg = new StringBuilder("Execution time ")
    					.append(aeRequest.getServiceName())
    					.append("#").append(aeRequest.getMethod())
    					.append(": {0} ms")
    					.toString();
			   		startTime = System.currentTimeMillis();
    			} catch (Exception e) {
    			}
    		}
    	}
    	
        // pass the request along the filter chain
        chain.doFilter(request, response);
        
    	if(logger.isDebugEnabled() && msg != null) {
        	Long endTime = System.currentTimeMillis();
    		logger.debugv(msg, endTime - startTime);
    	}
    }
 
    @Override
    public void destroy() {
        //we can close resources here
    }

	@Override
	public void init(FilterConfig arg0) throws ServletException {
	}
}
