package eu.agileeng.accbureau.web;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import eu.agileeng.services.ServiceLocator;
import eu.agileeng.services.ServiceLocator.Services;
import eu.agileeng.services.utility.AEUtilityService;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class HealthCheckServlet
 */
public class HealthCheckServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public HealthCheckServlet() {
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
		// HttpSession session = request.getSession(true);

		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();

		try {
			// validate secured connection
			HttpUtil.getInstance().isSecure(request);
		
			// TODO check whether db connection is a good one
			AEUtilityService utilityService = 
					(AEUtilityService) ServiceLocator.getInstance().getService(Services.UTILITY);
			
			//check db status
			utilityService.checkDBStatus();
			
			out.write("200:OK");
		} catch (Exception e) {
			out.write("500:" + e.getMessage());
		} finally {
			try {
				out.flush();
				response.flushBuffer();
			} catch(Exception ex){
			}
		}
	}
}
