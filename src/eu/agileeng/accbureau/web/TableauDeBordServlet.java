package eu.agileeng.accbureau.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.ejb.EJB;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.bind.DatatypeConverter;

import org.apache.commons.io.FileUtils;
import org.apache.tomcat.util.json.JSONException;
import org.apache.tomcat.util.json.JSONObject;
import org.jboss.logging.Logger;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfPageEventHelper;
import com.itextpdf.text.pdf.PdfTemplate;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.tool.xml.Pipeline;
import com.itextpdf.tool.xml.XMLWorker;
import com.itextpdf.tool.xml.XMLWorkerHelper;
import com.itextpdf.tool.xml.css.CssFile;
import com.itextpdf.tool.xml.css.StyleAttrCSSResolver;
import com.itextpdf.tool.xml.html.Tags;
import com.itextpdf.tool.xml.parser.XMLParser;
import com.itextpdf.tool.xml.pipeline.css.CSSResolver;
import com.itextpdf.tool.xml.pipeline.css.CssResolverPipeline;
import com.itextpdf.tool.xml.pipeline.end.PdfWriterPipeline;
import com.itextpdf.tool.xml.pipeline.html.HtmlPipeline;
import com.itextpdf.tool.xml.pipeline.html.HtmlPipelineContext;

import eu.agileeng.accbureau.AEApp;
import eu.agileeng.accbureau.web.filter.FileCaptureServletResponse;
import eu.agileeng.domain.AEDomainObject;
import eu.agileeng.domain.AEException;
import eu.agileeng.domain.cefra.n11580_03.BordereauParoisseDataSource;
import eu.agileeng.domain.cefra.n11580_03.Cefra11580_03DataSource;
import eu.agileeng.domain.cefra.n11580_03.ReportDataSource;
import eu.agileeng.domain.contact.Organization;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.AERequest;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.services.party.ejb.PartyLocal;
import eu.agileeng.services.tableauDeBord.ejb.TableauDeBordLocal;
import eu.agileeng.util.AEFileUtil;
import eu.agileeng.util.AEStringUtil;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class TableauDeBordServlet
 */
public class TableauDeBordServlet extends HttpServlet {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 6354931522927344218L;

	// logger
	private static Logger LOG = Logger.getLogger(TableauDeBordServlet.class);
	
	// Tmp repository
	private static final Path TMP_FILE_REPOSITORY = AEApp.getInstance().getTmpRepository();
	
	@EJB
	private TableauDeBordLocal tableauDeBordService; 
	
	@EJB
	private PartyLocal partyService;
	
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		LOG.error("405: Get Method Not Allowed ");
		response.setStatus(405);
		response.flushBuffer();
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

		// register resources for releasing at the end
		File contentFile = null;
		Path chartImage = null;
		
		String json = request.getParameter("json");
		try {
			// validate secured connection
			HttpUtil.getInstance().isSecure(request);
			
			if (null != json && json.length() > 0) {
				// authetication
				AuthPrincipal ap = (AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL);
				AEInvocationContext invContext = new AEInvocationContextImp(ap);
				AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
				invContextValidator.validate(invContext);

				// expected token
				HttpUtil.getInstance().validateToken(
						session.getId(), 
						ap, 
						request.getParameter(HttpUtil.MONENTREPRISE_TOKEN_NAME));
				
				AERequest aeRequest = new AERequest(json);
				aeRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
				if("TableauDeBordService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "loadChauffage".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = tableauDeBordService.loadChauffage(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
					out.flush();
				} else if("TableauDeBordService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "quetesOrdinaires".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = tableauDeBordService.loadQuetesOrdinaires(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
					out.flush();
				} else if("TableauDeBordService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "quetesParticuleres".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = tableauDeBordService.loadQuetesParticuleres(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
					out.flush();
				} else if("TableauDeBordService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "syntheseCharges".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = tableauDeBordService.loadSyntheseCharges(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
					out.flush();
				} else if("TableauDeBordService".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "syntheseRecettes".equalsIgnoreCase(aeRequest.getMethod())) {

					AEResponse aeResponse = tableauDeBordService.loadSyntheseRecettes(aeRequest, invContext);
					aeResponse.toJSONObject().write(out);
					out.flush();
				} else if("TableauDeBordPrint".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "chauffage".equalsIgnoreCase(aeRequest.getMethod())) {

					// load data
					AEResponse chauffageResponse = tableauDeBordService.loadChauffage(aeRequest, invContext);
					
					// decode chart image
					String base64ChartImage = aeRequest.getArguments().getString("base64ChartImage");
					chartImage = Paths.get(
							TMP_FILE_REPOSITORY.toString(), 
							AEFileUtil.createTempFileName("tmp_png_chart_", "png", TMP_FILE_REPOSITORY.toFile()));
					Files.write(chartImage, DatatypeConverter.parseBase64Binary(base64ChartImage.split(",")[1]));
					
					// customer
					AERequest customerRequest = new AERequest(
							new JSONObject()
								.put(Organization.JSONKey.customerId, aeRequest.getArguments().getLong(AEDomainObject.JSONKey.ownerId.name()))
								.put(Organization.JSONKey.doNotLoadCAO, true)
								.put(Organization.JSONKey.doNotLoadSocialInfo, true));
					AEResponse customerResponse = partyService.loadCustomer(customerRequest, invContext);

					/**
					 * Generate pdf
					 */

					/**
					 * Collect data in coresponding DataSource
					 */
					request.removeAttribute("json");
					request.setAttribute("data", chauffageResponse.getPayload());
					request.setAttribute("chartImageAbsolutePath", chartImage.toAbsolutePath().toString());
					request.setAttribute("customer", customerResponse.getPayload().getJSONObject(Organization.JSONKey.customer));

					/**
					 * Forward to the jsp and capture response
					 */
					FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
					String printViewURL = "/server/jsp/chart/chauffage.jsp";
					RequestDispatcher view = request.getRequestDispatcher(printViewURL);
					view.forward(request, capturedResponse);

					// get captured jsp response
					contentFile = capturedResponse.getContentFile();

					//
					// Create pdf from contentFile.
					// contentFile is captured .html from jsp execution
					// 

					// Use custom resources (images, css, etc.) for this report
					Document document = new Document(PageSize.A4.rotate(),36,36,40,37); //l-r-t-b
					//document.setMargins(70, 70, 100, 70);

					File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
					File pdfFile = new File(
							tmpRepository, 
							AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));

					PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
					writer.setBoxSize("art", new Rectangle(36, 54, 788, 559)); //landscape
					//writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
					//uncomment to use the header & footer functionality
					HeaderFooter event = new HeaderFooter();
					// event.setRds(compteDeResultatDataSource);
					writer.setPageEvent(event);

					document.open();

					//CSS
					CSSResolver cssResolver = new StyleAttrCSSResolver();
					CssFile cssFile = XMLWorkerHelper.getCSS(
							new FileInputStream(
									new File(
											new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
											"chart.css")));

					cssResolver.addCss(cssFile);

					//HTML
					HtmlPipelineContext htmlContext = new HtmlPipelineContext(null);

					htmlContext.setTagFactory(Tags.getHtmlTagProcessorFactory());

					//Pipelines

					Pipeline<?> pipeline =

							new CssResolverPipeline(cssResolver,

									new HtmlPipeline(htmlContext,

											new PdfWriterPipeline(document, writer)));

					XMLWorker worker = new XMLWorker(pipeline, true);

					XMLParser p = new XMLParser(worker, Charset.forName("UTF-8"));

					p.parse(new FileInputStream(contentFile), Charset.forName("UTF-8"));

					document.close();

					// build response
					StringBuilder downloadUrl = new StringBuilder()
						.append("../FileDownloadServlet?")
						.append("file=").append(pdfFile.getName())
						.append("&fileName=").append("chauffage.pdf")
						.append("&deleteOnExit=").append(true)
						.append("&embedded=").append(true);

					JSONObject payload = new JSONObject()
						.put("file", pdfFile.getName())
						.put("fileName", "chauffage.pdf")
						.put("downloadUrl", downloadUrl);
					
					// return response
					new AEResponse(payload).toJSONObject().write(out);
					out.flush();
				}  else if("TableauDeBordPrint".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "quetesOrdinaires".equalsIgnoreCase(aeRequest.getMethod())) {

					// load data
					AEResponse chauffageResponse = tableauDeBordService.loadQuetesOrdinaires(aeRequest, invContext);
					
					// decode chart image
					String base64ChartImage = aeRequest.getArguments().getString("base64ChartImage");
					chartImage = Paths.get(
							TMP_FILE_REPOSITORY.toString(), 
							AEFileUtil.createTempFileName("tmp_png_chart_", "png", TMP_FILE_REPOSITORY.toFile()));
					Files.write(chartImage, DatatypeConverter.parseBase64Binary(base64ChartImage.split(",")[1]));
					
					// customer
					AERequest customerRequest = new AERequest(
							new JSONObject()
								.put(Organization.JSONKey.customerId, aeRequest.getArguments().getLong(AEDomainObject.JSONKey.ownerId.name()))
								.put(Organization.JSONKey.doNotLoadCAO, true)
								.put(Organization.JSONKey.doNotLoadSocialInfo, true));
					AEResponse customerResponse = partyService.loadCustomer(customerRequest, invContext);

					/**
					 * Generate pdf
					 */

					/**
					 * Collect data in coresponding DataSource
					 */
					request.removeAttribute("json");
					request.setAttribute("data", chauffageResponse.getPayload());
					request.setAttribute("chartImageAbsolutePath", chartImage.toAbsolutePath().toString());
					request.setAttribute("customer", customerResponse.getPayload().getJSONObject(Organization.JSONKey.customer));

					/**
					 * Forward to the jsp and capture response
					 */
					FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
					String printViewURL = "/server/jsp/chart/quetesOrdinaires.jsp";
					RequestDispatcher view = request.getRequestDispatcher(printViewURL);
					view.forward(request, capturedResponse);

					// get captured jsp response
					contentFile = capturedResponse.getContentFile();

					//
					// Create pdf from contentFile.
					// contentFile is captured .html from jsp execution
					// 

					// Use custom resources (images, css, etc.) for this report
					Document document = new Document(PageSize.A4.rotate(),36,36,40,37); //l-r-t-b
					//document.setMargins(70, 70, 100, 70);

					File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
					File pdfFile = new File(
							tmpRepository, 
							AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));

					PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
					writer.setBoxSize("art", new Rectangle(36, 54, 788, 559)); //landscape
					//writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
					//uncomment to use the header & footer functionality
					HeaderFooter event = new HeaderFooter();
					// event.setRds(compteDeResultatDataSource);
					writer.setPageEvent(event);

					document.open();

					//CSS
					CSSResolver cssResolver = new StyleAttrCSSResolver();
					CssFile cssFile = XMLWorkerHelper.getCSS(
							new FileInputStream(
									new File(
											new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
											"chart.css")));

					cssResolver.addCss(cssFile);

					//HTML
					HtmlPipelineContext htmlContext = new HtmlPipelineContext(null);

					htmlContext.setTagFactory(Tags.getHtmlTagProcessorFactory());

					//Pipelines

					Pipeline<?> pipeline =

							new CssResolverPipeline(cssResolver,

									new HtmlPipeline(htmlContext,

											new PdfWriterPipeline(document, writer)));

					XMLWorker worker = new XMLWorker(pipeline, true);

					XMLParser p = new XMLParser(worker, Charset.forName("UTF-8"));

					p.parse(new FileInputStream(contentFile), Charset.forName("UTF-8"));

					document.close();

					// build response
					StringBuilder downloadUrl = new StringBuilder()
						.append("../FileDownloadServlet?")
						.append("file=").append(pdfFile.getName())
						.append("&fileName=").append("quetesOrdinaires.pdf")
						.append("&deleteOnExit=").append(true)
						.append("&embedded=").append(true);

					JSONObject payload = new JSONObject()
						.put("file", pdfFile.getName())
						.put("fileName", "quetesOrdinaires.pdf")
						.put("downloadUrl", downloadUrl);
					
					// return response
					new AEResponse(payload).toJSONObject().write(out);
					out.flush();
				} else if("TableauDeBordPrint".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "quetesParticuleres".equalsIgnoreCase(aeRequest.getMethod())) {

					// load data
					AEResponse chauffageResponse = tableauDeBordService.loadQuetesParticuleres(aeRequest, invContext);
					
					// decode chart image
					String base64ChartImage = aeRequest.getArguments().getString("base64ChartImage");
					chartImage = Paths.get(
							TMP_FILE_REPOSITORY.toString(), 
							AEFileUtil.createTempFileName("tmp_png_chart_", "png", TMP_FILE_REPOSITORY.toFile()));
					Files.write(chartImage, DatatypeConverter.parseBase64Binary(base64ChartImage.split(",")[1]));
					
					// customer
					AERequest customerRequest = new AERequest(
							new JSONObject()
								.put(Organization.JSONKey.customerId, aeRequest.getArguments().getLong(AEDomainObject.JSONKey.ownerId.name()))
								.put(Organization.JSONKey.doNotLoadCAO, true)
								.put(Organization.JSONKey.doNotLoadSocialInfo, true));
					AEResponse customerResponse = partyService.loadCustomer(customerRequest, invContext);

					/**
					 * Generate pdf
					 */

					/**
					 * Collect data in coresponding DataSource
					 */
					request.removeAttribute("json");
					request.setAttribute("data", chauffageResponse.getPayload());
					request.setAttribute("chartImageAbsolutePath", chartImage.toAbsolutePath().toString());
					request.setAttribute("customer", customerResponse.getPayload().getJSONObject(Organization.JSONKey.customer));

					/**
					 * Forward to the jsp and capture response
					 */
					FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
					String printViewURL = "/server/jsp/chart/quetesParticuleres.jsp";
					RequestDispatcher view = request.getRequestDispatcher(printViewURL);
					view.forward(request, capturedResponse);

					// get captured jsp response
					contentFile = capturedResponse.getContentFile();

					//
					// Create pdf from contentFile.
					// contentFile is captured .html from jsp execution
					// 

					// Use custom resources (images, css, etc.) for this report
					Document document = new Document(PageSize.A4.rotate(),36,36,40,37); //l-r-t-b
					//document.setMargins(70, 70, 100, 70);

					File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
					File pdfFile = new File(
							tmpRepository, 
							AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));

					PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
					writer.setBoxSize("art", new Rectangle(36, 54, 788, 559)); //landscape
					//writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
					//uncomment to use the header & footer functionality
					HeaderFooter event = new HeaderFooter();
					// event.setRds(compteDeResultatDataSource);
					writer.setPageEvent(event);

					document.open();

					//CSS
					CSSResolver cssResolver = new StyleAttrCSSResolver();
					CssFile cssFile = XMLWorkerHelper.getCSS(
							new FileInputStream(
									new File(
											new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
											"chart.css")));

					cssResolver.addCss(cssFile);

					//HTML
					HtmlPipelineContext htmlContext = new HtmlPipelineContext(null);

					htmlContext.setTagFactory(Tags.getHtmlTagProcessorFactory());

					//Pipelines

					Pipeline<?> pipeline =

							new CssResolverPipeline(cssResolver,

									new HtmlPipeline(htmlContext,

											new PdfWriterPipeline(document, writer)));

					XMLWorker worker = new XMLWorker(pipeline, true);

					XMLParser p = new XMLParser(worker, Charset.forName("UTF-8"));

					p.parse(new FileInputStream(contentFile), Charset.forName("UTF-8"));

					document.close();

					// build response
					StringBuilder downloadUrl = new StringBuilder()
						.append("../FileDownloadServlet?")
						.append("file=").append(pdfFile.getName())
						.append("&fileName=").append("quetesParticuleres.pdf")
						.append("&deleteOnExit=").append(true)
						.append("&embedded=").append(true);

					JSONObject payload = new JSONObject()
						.put("file", pdfFile.getName())
						.put("fileName", "quetesParticuleres.pdf")
						.put("downloadUrl", downloadUrl);
					
					// return response
					new AEResponse(payload).toJSONObject().write(out);
					out.flush();
				}  else if("TableauDeBordPrint".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "syntheseRecettes".equalsIgnoreCase(aeRequest.getMethod())) {

					// load data
					AEResponse chauffageResponse = tableauDeBordService.loadSyntheseRecettes(aeRequest, invContext);
					
					// decode chart image
					String base64ChartImage = aeRequest.getArguments().getString("base64ChartImage");
					chartImage = Paths.get(
							TMP_FILE_REPOSITORY.toString(), 
							AEFileUtil.createTempFileName("tmp_png_chart_", "png", TMP_FILE_REPOSITORY.toFile()));
					Files.write(chartImage, DatatypeConverter.parseBase64Binary(base64ChartImage.split(",")[1]));
					
					// customer
					AERequest customerRequest = new AERequest(
							new JSONObject()
								.put(Organization.JSONKey.customerId, aeRequest.getArguments().getLong(AEDomainObject.JSONKey.ownerId.name()))
								.put(Organization.JSONKey.doNotLoadCAO, true)
								.put(Organization.JSONKey.doNotLoadSocialInfo, true));
					AEResponse customerResponse = partyService.loadCustomer(customerRequest, invContext);

					/**
					 * Generate pdf
					 */

					/**
					 * Collect data in coresponding DataSource
					 */
					request.removeAttribute("json");
					request.setAttribute("data", chauffageResponse.getPayload());
					request.setAttribute("chartImageAbsolutePath", chartImage.toAbsolutePath().toString());
					request.setAttribute("customer", customerResponse.getPayload().getJSONObject(Organization.JSONKey.customer));

					/**
					 * Forward to the jsp and capture response
					 */
					FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
					String printViewURL = "/server/jsp/chart/syntheseRecettes.jsp";
					RequestDispatcher view = request.getRequestDispatcher(printViewURL);
					view.forward(request, capturedResponse);

					// get captured jsp response
					contentFile = capturedResponse.getContentFile();

					//
					// Create pdf from contentFile.
					// contentFile is captured .html from jsp execution
					// 

					// Use custom resources (images, css, etc.) for this report
					Document document = new Document(PageSize.A4.rotate(),36,36,40,37); //l-r-t-b
					//document.setMargins(70, 70, 100, 70);

					File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
					File pdfFile = new File(
							tmpRepository, 
							AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));

					PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
					writer.setBoxSize("art", new Rectangle(36, 54, 788, 559)); //landscape
					//writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
					//uncomment to use the header & footer functionality
					HeaderFooter event = new HeaderFooter();
					// event.setRds(compteDeResultatDataSource);
					writer.setPageEvent(event);

					document.open();

					//CSS
					CSSResolver cssResolver = new StyleAttrCSSResolver();
					CssFile cssFile = XMLWorkerHelper.getCSS(
							new FileInputStream(
									new File(
											new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
											"chart.css")));

					cssResolver.addCss(cssFile);

					//HTML
					HtmlPipelineContext htmlContext = new HtmlPipelineContext(null);

					htmlContext.setTagFactory(Tags.getHtmlTagProcessorFactory());

					//Pipelines

					Pipeline<?> pipeline =

							new CssResolverPipeline(cssResolver,

									new HtmlPipeline(htmlContext,

											new PdfWriterPipeline(document, writer)));

					XMLWorker worker = new XMLWorker(pipeline, true);

					XMLParser p = new XMLParser(worker, Charset.forName("UTF-8"));

					p.parse(new FileInputStream(contentFile), Charset.forName("UTF-8"));

					document.close();

					// build response
					StringBuilder downloadUrl = new StringBuilder()
						.append("../FileDownloadServlet?")
						.append("file=").append(pdfFile.getName())
						.append("&fileName=").append("syntheseRecettes.pdf")
						.append("&deleteOnExit=").append(true)
						.append("&embedded=").append(true);

					JSONObject payload = new JSONObject()
						.put("file", pdfFile.getName())
						.put("fileName", "syntheseRecettes.pdf")
						.put("downloadUrl", downloadUrl);
					
					// return response
					new AEResponse(payload).toJSONObject().write(out);
					out.flush();
				} else if("TableauDeBordPrint".equalsIgnoreCase(aeRequest.getServiceName()) 
						&& "syntheseCharges".equalsIgnoreCase(aeRequest.getMethod())) {

					// load data
					AEResponse chauffageResponse = tableauDeBordService.loadSyntheseCharges(aeRequest, invContext);
					
					// decode chart image
					String base64ChartImage = aeRequest.getArguments().getString("base64ChartImage");
					chartImage = Paths.get(
							TMP_FILE_REPOSITORY.toString(), 
							AEFileUtil.createTempFileName("tmp_png_chart_", "png", TMP_FILE_REPOSITORY.toFile()));
					Files.write(chartImage, DatatypeConverter.parseBase64Binary(base64ChartImage.split(",")[1]));
					
					// customer
					AERequest customerRequest = new AERequest(
							new JSONObject()
								.put(Organization.JSONKey.customerId, aeRequest.getArguments().getLong(AEDomainObject.JSONKey.ownerId.name()))
								.put(Organization.JSONKey.doNotLoadCAO, true)
								.put(Organization.JSONKey.doNotLoadSocialInfo, true));
					AEResponse customerResponse = partyService.loadCustomer(customerRequest, invContext);

					/**
					 * Generate pdf
					 */

					/**
					 * Collect data in coresponding DataSource
					 */
					request.removeAttribute("json");
					request.setAttribute("data", chauffageResponse.getPayload());
					request.setAttribute("chartImageAbsolutePath", chartImage.toAbsolutePath().toString());
					request.setAttribute("customer", customerResponse.getPayload().getJSONObject(Organization.JSONKey.customer));

					/**
					 * Forward to the jsp and capture response
					 */
					FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
					String printViewURL = "/server/jsp/chart/syntheseCharges.jsp";
					RequestDispatcher view = request.getRequestDispatcher(printViewURL);
					view.forward(request, capturedResponse);

					// get captured jsp response
					contentFile = capturedResponse.getContentFile();

					//
					// Create pdf from contentFile.
					// contentFile is captured .html from jsp execution
					// 

					// Use custom resources (images, css, etc.) for this report
					Document document = new Document(PageSize.A4.rotate(),36,36,40,37); //l-r-t-b
					//document.setMargins(70, 70, 100, 70);

					File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
					File pdfFile = new File(
							tmpRepository, 
							AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));

					PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
					writer.setBoxSize("art", new Rectangle(36, 54, 788, 559)); //landscape
					//writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
					//uncomment to use the header & footer functionality
					HeaderFooter event = new HeaderFooter();
					// event.setRds(compteDeResultatDataSource);
					writer.setPageEvent(event);

					document.open();

					//CSS
					CSSResolver cssResolver = new StyleAttrCSSResolver();
					CssFile cssFile = XMLWorkerHelper.getCSS(
							new FileInputStream(
									new File(
											new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
											"chart.css")));

					cssResolver.addCss(cssFile);

					//HTML
					HtmlPipelineContext htmlContext = new HtmlPipelineContext(null);

					htmlContext.setTagFactory(Tags.getHtmlTagProcessorFactory());

					//Pipelines

					Pipeline<?> pipeline =

							new CssResolverPipeline(cssResolver,

									new HtmlPipeline(htmlContext,

											new PdfWriterPipeline(document, writer)));

					XMLWorker worker = new XMLWorker(pipeline, true);

					XMLParser p = new XMLParser(worker, Charset.forName("UTF-8"));

					p.parse(new FileInputStream(contentFile), Charset.forName("UTF-8"));

					document.close();

					// build response
					StringBuilder downloadUrl = new StringBuilder()
						.append("../FileDownloadServlet?")
						.append("file=").append(pdfFile.getName())
						.append("&fileName=").append("syntheseCharges.pdf")
						.append("&deleteOnExit=").append(true)
						.append("&embedded=").append(true);

					JSONObject payload = new JSONObject()
						.put("file", pdfFile.getName())
						.put("fileName", "syntheseCharges.pdf")
						.put("downloadUrl", downloadUrl);
					
					// return response
					new AEResponse(payload).toJSONObject().write(out);
					out.flush();
				} 
			}
		} catch (Throwable t) {
			LOG.error("Error in TableauDeBordServlet ", t);
			AEResponse aeResponse = new AEResponse();
			aeResponse.setError(new AEException(t));
			try {
				aeResponse.toJSONObject().write(out);
			} catch (JSONException ex) {
				LOG.error(ex);
			}
			out.flush();
		} finally {
			try {
				response.flushBuffer();
			} catch(Exception ex){
				LOG.error(ex);
			}
			
			// delete registered for deleting resources
			if(contentFile != null && contentFile.isFile() && contentFile.exists()) {
				FileUtils.deleteQuietly(contentFile);
			}
			if(chartImage != null && Files.exists(chartImage) && chartImage.toFile().isFile()) {
				FileUtils.deleteQuietly(chartImage.toFile());
			}
		}
	}
	
	/** Inner class to add a header and a footer. */
	class HeaderFooter extends PdfPageEventHelper {
		/**Add the DataSource to this class to use the data in the header and footer events*/
		ReportDataSource rds;
		boolean doNotAddTitle = false;
		boolean doNotAddPageCount = false;
		
		public void setDoNotAddPageCount(boolean doNotAddPageCount) {
			this.doNotAddPageCount = doNotAddPageCount;
		}

		public ReportDataSource getRds() {
			return rds;
		}

		public void setRds(ReportDataSource rds) {
			this.rds = rds;
		}

		public boolean isDoNotAddTitle() {
			return doNotAddTitle;
		}

		public void setDoNotAddTitle(boolean doNotAddTitle) {
			this.doNotAddTitle = doNotAddTitle;
		}

		/** The template with the total number of pages. */
		PdfTemplate total;

		/** Alternating phrase for the header. */
		Phrase[] header = new Phrase[2];
		/** Current page number (will be reset for every chapter). */
		int pagenumber;

		
		/**
		 * Initialize one of the headers.
		 * @see com.itextpdf.text.pdf.PdfPageEventHelper#onOpenDocument(
		 *      com.itextpdf.text.pdf.PdfWriter, com.itextpdf.text.Document)
		 */

		/**
		 * Increase the page number.
		 * @see com.itextpdf.text.pdf.PdfPageEventHelper#onStartPage(
		 *      com.itextpdf.text.pdf.PdfWriter, com.itextpdf.text.Document)
		 */
		public void onStartPage(PdfWriter writer, Document document) {
			try {
				if(pagenumber == 0){
					if(rds instanceof BordereauParoisseDataSource){
						Image img;
						img = Image.getInstance(new File(
								new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
								"zachee-logo-small.png").getAbsolutePath());
						img.setAlignment(Image.LEFT| Image.TEXTWRAP);
						img.setAbsolutePosition(0, 0);
		
						PdfContentByte byte1 = writer.getDirectContent();
						PdfTemplate tp1 = byte1.createTemplate(50, 70);
						tp1.addImage(img);
						byte1.addTemplate(tp1, 45, document.getPageSize().getTop()-document.getPageSize().getBottom()-80);
						//byte1.addTemplate(tp1, document.getPageSize().getRight()-60, document.getPageSize().getTop()-document.getPageSize().getBottom()-80);
		
						Phrase phrase = new Phrase(byte1.toString());
						header[0] = phrase;
					} else if(rds instanceof Cefra11580_03DataSource) {
						Image img;
						img = Image.getInstance(new File(
								new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
								"zachee-logo-small.png").getAbsolutePath());
						img.setAlignment(Image.LEFT| Image.TEXTWRAP);
						img.setAbsolutePosition(0, 0);
		
						PdfContentByte byte1 = writer.getDirectContent();
						PdfTemplate tp1 = byte1.createTemplate(50, 70);
						tp1.addImage(img);
						byte1.addTemplate(tp1, 45, document.getPageSize().getTop()-document.getPageSize().getBottom() - 140/*-80*/);
		
						Phrase phrase = new Phrase(byte1.toString());
						header[0] = phrase;
					} else {
						Image img;
						img = Image.getInstance(new File(
								new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
								"zachee-logo-small.png").getAbsolutePath());
						img.setAlignment(Image.LEFT| Image.TEXTWRAP);
						img.setAbsolutePosition(0, 0);
		
						PdfContentByte byte1 = writer.getDirectContent();
						PdfTemplate tp1 = byte1.createTemplate(50, 70);
						tp1.addImage(img);
						byte1.addTemplate(tp1, 45, document.getPageSize().getTop()-document.getPageSize().getBottom()-80);
		
						Phrase phrase = new Phrase(byte1.toString());
						header[0] = phrase;
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			} 
			pagenumber++;
		}

		/**
		 * Adds the header and the footer.
		 * @see com.itextpdf.text.pdf.PdfPageEventHelper#onEndPage(
		 *      com.itextpdf.text.pdf.PdfWriter, com.itextpdf.text.Document)
		 */
		public void onEndPage(PdfWriter writer, Document document) {
			Rectangle rect = writer.getBoxSize("art");
			if(!doNotAddTitle){
				if(pagenumber == 1){
					if(!(rds instanceof Cefra11580_03DataSource)) {
					ColumnText.showTextAligned(writer.getDirectContent(),
							Element.ALIGN_LEFT, new Phrase("Zachée", FontFactory.getFont(FontFactory.HELVETICA, 12, Font.BOLD, new BaseColor(60, 61, 61))),
							(rect.getLeft()+70), rect.getTop(), 0);
					}
					/*ColumnText.showTextAligned(writer.getDirectContent(),
							Element.ALIGN_LEFT, new Phrase("Ma Paroisse : Gestion - Comptabilité", FontFactory.getFont(FontFactory.HELVETICA, 10, Font.NORMAL, new BaseColor(60, 61, 61))),
							(rect.getLeft()+120), rect.getTop(), 0);*/
				}
			}
			if(rds instanceof Cefra11580_03DataSource) {
				StringBuilder sb = new StringBuilder();
				if(rds.isCustomerParoisse()) {
					sb.append(ReportDataSource.PAROISSE).append(" ");
				} else {
					sb.append(ReportDataSource.MENSE).append(" ");
				}
				sb.append(AEStringUtil.trim(rds.getCustomerName())).append(" ");
//				sb.append(AEStringUtil.trim(rds.getCustomerCity()));
//					.append("   ")
//					.append(new SimpleDateFormat("dd/MM/yyyy").format(new Date()));
				
				ColumnText.showTextAligned(writer.getDirectContent(),
						Element.ALIGN_RIGHT, new Phrase(sb.toString(), FontFactory.getFont(FontFactory.HELVETICA, 12, Font.BOLD, new BaseColor(60, 61, 61))),
						(rect.getLeft() + 375), rect.getTop() - 40, 0);
			}
			ColumnText.showTextAligned(writer.getDirectContent(),
					Element.ALIGN_LEFT, new Phrase("Imprimé le: " + new SimpleDateFormat("dd/MM/yyyy").format(new Date()),
							FontFactory.getFont(FontFactory.HELVETICA, 8, Font.BOLD, new BaseColor(60, 61, 61))),
							(rect.getLeft()), rect.getBottom() - 27, 0);
			/*ColumnText.showTextAligned(writer.getDirectContent(),
					Element.ALIGN_LEFT, new Phrase("Par: " + this.getRds().getCreator(),
							FontFactory.getFont(FontFactory.HELVETICA, 8, Font.BOLD, new BaseColor(60, 61, 61))),
							(rect.getLeft()), rect.getBottom() - 35, 0);*/
			if(!doNotAddPageCount){
				ColumnText.showTextAligned(writer.getDirectContent(),
						Element.ALIGN_RIGHT, new Phrase("page " + this.pagenumber,
								FontFactory.getFont(FontFactory.HELVETICA, 8, Font.BOLD, new BaseColor(60, 61, 61))),
								(rect.getRight()), rect.getBottom() - 27, 0);
			}
		}
		
		public void setPagenumber(int pageNumber) {
			this.pagenumber = pageNumber;
		}
		
		public int getPagenumber() {
			return this.pagenumber;
		}
	}
}
