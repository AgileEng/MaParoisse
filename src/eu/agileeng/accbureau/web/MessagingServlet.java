package eu.agileeng.accbureau.web;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.json.JSONArray;
import org.apache.tomcat.util.json.JSONException;
import org.apache.tomcat.util.json.JSONObject;

import eu.agileeng.domain.AEException;
import eu.agileeng.domain.messaging.DiscussionBoardPost;
import eu.agileeng.domain.messaging.DiscussionBoardSubject;
import eu.agileeng.domain.messaging.DiscussionBoardSubjectList;
import eu.agileeng.domain.messaging.DiscussionBoardTask;
import eu.agileeng.domain.messaging.DiscussionBoardTaskDecision;
import eu.agileeng.domain.messaging.DiscussionBoardTaskDecisionsList;
import eu.agileeng.domain.messaging.DiscussionBoardTasksList;
import eu.agileeng.domain.messaging.TaskFilter;
import eu.agileeng.domain.messaging.ejb.MessagingService;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.AERequest;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.ServiceLocator;
import eu.agileeng.services.ServiceLocator.Services;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.util.AEStringUtil;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class MessagingServlet
 */
public class MessagingServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public MessagingServlet() {
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
		//session.setMaxInactiveInterval(5);
		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();

		String method = AEStringUtil.EMPTY_STRING;
		String json = request.getParameter("json");
//		String action = request.getParameter("action");
		
		try {
			// validate secured connection
			HttpUtil.getInstance().isSecure(request);
			AERequest aeRequest = null;
			AEInvocationContext invContext = null;
			
			if (null != json && json.length() > 0) {
				// authetication
				AuthPrincipal ap = (AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL);
				invContext = new AEInvocationContextImp(ap);
				AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
				invContextValidator.validate(invContext);

				// expected token
				HttpUtil.getInstance().validateToken(
						session.getId(), 
						ap, 
						request.getParameter(HttpUtil.MONENTREPRISE_TOKEN_NAME));
				
				aeRequest = new AERequest(json);
				aeRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
				method = aeRequest.getMethod();
			} else if (request.getParameter("node") != null) {
				method = "loadDiscussionBoardSubjects";
			}
			
			if ("loadDiscussionBoardSubjects".equalsIgnoreCase(method)) {
				MessagingService messagingService = 
					(MessagingService) ServiceLocator.getInstance().getService(Services.MESSAGING);
				DiscussionBoardSubjectList subjList = messagingService.loadSubjectsByParentId(Long.parseLong(request.getParameter("node")), Long.parseLong(request.getParameter("companyId")));
				/*
				DiscussionBoardSubjectList subjList = new DiscussionBoardSubjectList();
				DiscussionBoardSubject subj1 = new DiscussionBoardSubject();
				subj1.setParentId(0);
				subj1.setName("Topic 1");
				subjList.add(subj1);
				*/
				out.write(subjList.toJSONArray().toString());
			} else if ("createNewSubject".equalsIgnoreCase(method) && "MessagingService".equalsIgnoreCase(aeRequest.getServiceName())) {
				MessagingService messagingService = 
					(MessagingService) ServiceLocator.getInstance().getService(Services.MESSAGING);
				DiscussionBoardSubject subject = new DiscussionBoardSubject();
				JSONObject arguments = aeRequest.getArguments();
				subject.create(arguments.getJSONObject("topic"));
				
				if (subject.getType() == DiscussionBoardSubject.Type.CATEGORY.getID()) {
					subject = messagingService.saveSubject(subject, invContext);
				} else {
					subject = messagingService.saveTopicWithPost(subject, invContext);
				}
				
				AEResponse aeResp = new AEResponse(subject.toJSONObject());
				out.write(aeResp.toJSONObject().toString());
				out.flush();
			} else if ("loadPosts".equalsIgnoreCase(method) && "MessagingService".equalsIgnoreCase(aeRequest.getServiceName())) {
				MessagingService messagingService = 
					(MessagingService) ServiceLocator.getInstance().getService(Services.MESSAGING);
				DiscussionBoardSubject subject = new DiscussionBoardSubject();
				JSONObject arguments = aeRequest.getArguments();
				subject.create(arguments.getJSONObject("topic"));
				
				messagingService.loadPosts(subject);
				
				AEResponse aeResp = new AEResponse(subject.toJSONObject());
				out.write(aeResp.toJSONObject().toString());
				out.flush();
			} else if ("addPost".equalsIgnoreCase(method) && "MessagingService".equalsIgnoreCase(aeRequest.getServiceName())) {
				MessagingService messagingService = 
					(MessagingService) ServiceLocator.getInstance().getService(Services.MESSAGING);
				DiscussionBoardPost post = new DiscussionBoardPost();
				JSONObject arguments = aeRequest.getArguments();
				
				post.create(arguments.getJSONObject("post"));
				
				messagingService.savePost(post, invContext);
				
				AEResponse aeResp = new AEResponse(post.toJSONObject());
				out.write(aeResp.toJSONObject().toString());
				out.flush();
			} else if ("loadPost".equalsIgnoreCase(method) && "MessagingService".equalsIgnoreCase(aeRequest.getServiceName())) {
				
			} else if ("addTask".equalsIgnoreCase(method) && "MessagingService".equalsIgnoreCase(aeRequest.getServiceName())) {
				MessagingService messagingService = 
					(MessagingService) ServiceLocator.getInstance().getService(Services.MESSAGING);
				DiscussionBoardTask task = new DiscussionBoardTask();
				JSONObject arguments = aeRequest.getArguments();
				
				task.create(arguments.getJSONObject("task"));
				
				messagingService.saveTask(task/*, invContext*/);
				
				AEResponse aeResp = new AEResponse(task.toJSONObject());
				out.write(aeResp.toJSONObject().toString());
				out.flush();
			} else if ("loadTasks".equalsIgnoreCase(method) && "MessagingService".equalsIgnoreCase(aeRequest.getServiceName())) {
				MessagingService messagingService = 
					(MessagingService) ServiceLocator.getInstance().getService(Services.MESSAGING);
				
				JSONObject arguments = aeRequest.getArguments();
				DiscussionBoardTasksList tl =  messagingService.loadTasksByTopicId(arguments.getLong("topicId"), invContext);
				
				AEResponse aeResp = new AEResponse(new JSONObject().put("tasks", tl.toMetaData()));
				out.write(aeResp.toJSONObject().toString());
				out.flush();
			} else if ("filterTasks".equalsIgnoreCase(method) && "MessagingService".equalsIgnoreCase(aeRequest.getServiceName())) {
				MessagingService messagingService = 
						(MessagingService) ServiceLocator.getInstance().getService(Services.MESSAGING);
					
					JSONObject arguments = aeRequest.getArguments();
					TaskFilter filter = new TaskFilter();
					filter.create(arguments.optJSONObject("filter"));
					
					DiscussionBoardTasksList tl =  messagingService.filterTasks(arguments.getLong("ownerId"), filter, invContext);
					
					AEResponse aeResp = new AEResponse(new JSONObject().put("tasks", tl.toMetaData()));
					out.write(aeResp.toJSONObject().toString());
					out.flush();
			} else if ("updateTasks".equalsIgnoreCase(method) && "MessagingService".equalsIgnoreCase(aeRequest.getServiceName())) {
				MessagingService messagingService = 
					(MessagingService) ServiceLocator.getInstance().getService(Services.MESSAGING);
				
				JSONObject arguments = aeRequest.getArguments();
				DiscussionBoardTasksList tl = new DiscussionBoardTasksList();
				tl.create(arguments.getJSONArray("tasks"));
				//NIKI
				AuthPrincipal principal = invContext.getAuthPrincipal();
				
				JSONArray jsonArr = arguments.getJSONArray("tasks");
				
				for(int i = 0; i < jsonArr.length(); i++) {
					JSONObject jObj = jsonArr.getJSONObject(i);
					try {
						int decision = jObj.getInt("auth_"+principal.getID());
						
						for(DiscussionBoardTask task : tl) {
							if (task.getID() == jObj.getLong("id")) {
								DiscussionBoardTaskDecision d = new DiscussionBoardTaskDecision();
								d.setTaskId(task.getID());
								d.setAuthPrincipalId(principal.getID());
								d.setDecision(decision);
								
								DiscussionBoardTaskDecisionsList dl = new DiscussionBoardTaskDecisionsList();
								
								dl.add(d);
								
								task.setDecisions(dl);
							}
						}
					} catch (JSONException e) {
						
					}
					
					
				}
				
				
				
				tl = messagingService.saveTopicTasks(tl, invContext);
				
				AEResponse aeResp = new AEResponse(new JSONObject().put("tasks", tl.toJSONArray()));
				out.write(aeResp.toJSONObject().toString());
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
