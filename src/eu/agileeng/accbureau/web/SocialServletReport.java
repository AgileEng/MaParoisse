package eu.agileeng.accbureau.web;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.FileUtils;
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
import eu.agileeng.domain.AEError;
import eu.agileeng.domain.AEException;
import eu.agileeng.domain.document.AEDocumentFactory;
import eu.agileeng.domain.document.AEDocumentType;
import eu.agileeng.domain.document.AEPrintTemplate;
import eu.agileeng.domain.document.social.AESocialDocumentView;
import eu.agileeng.domain.document.social.SocialTimeSheet;
import eu.agileeng.domain.document.social.SocialTimeSheetEntry;
import eu.agileeng.domain.social.SocialInfoView;
import eu.agileeng.persistent.dao.DAOFactory;
import eu.agileeng.persistent.dao.social.SocialDAO;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.AERequest;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.ServiceLocator;
import eu.agileeng.services.ServiceLocator.Services;
import eu.agileeng.services.document.AEDocumentService;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.services.social.AESocialService;
import eu.agileeng.util.AEFileUtil;
import eu.agileeng.util.AEStringUtil;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class SocialServletReport
 */
public class SocialServletReport extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	
	private static final String LOGO_PATH = "/client/resources/logos/";

	private static Logger logger = Logger.getLogger(SocialServletReport.class);
	
	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SocialServletReport() {
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
		// Get the current HttpSession associated with this request or, 
		// if there is no current session get a new one.
		HttpSession session = request.getSession(true);

		// register resources for deleting at the end
		File contentFile = null;
		File pdfFile = null;
		
		try {
			// validate secured connection
			HttpUtil.getInstance().isSecure(request);

			// validate execution
			AEInvocationContext invContext = new AEInvocationContextImp((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
			AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
			invContextValidator.validate(invContext);
			
			// process request
			String action = request.getParameter("action");
			if("reportPeriodActual".equalsIgnoreCase(action)) {
				JSONObject arguments = new JSONObject();

				String ownerId = SocialTimeSheetEntry.JsonKey.ownerId.name();
				arguments.put(ownerId, request.getParameter(ownerId));

				String sOwnerId = "sOwnerId";
				arguments.put(sOwnerId, request.getParameter(sOwnerId));

				String periodTypeId = SocialTimeSheetEntry.JsonKey.periodType.name();
				arguments.put(periodTypeId, request.getParameter(periodTypeId));

				// fromDate
				String fromDate = SocialTimeSheet.JsonKey.fromDate.name();
				arguments.put(fromDate, request.getParameter(fromDate));

				// toDate
				String toDate = SocialTimeSheet.JsonKey.toDate.name();
				arguments.put(toDate, request.getParameter(toDate));
				
				// emplId
				String employeeId = SocialTimeSheet.JsonKey.employeeId.name();
				arguments.put(employeeId, request.getParameter(employeeId));

				// SocialTimeSheet
				AERequest aeRequest = new AERequest(arguments);
				aeRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
				AESocialService socialService = 
						(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
				SocialTimeSheet socialTimeSheet = socialService.reportPeriodActual(aeRequest, invContext);
				request.setAttribute("socialTimeSheet", socialTimeSheet);	

				// SocialInfo
				AEResponse socialInfoResponse = socialService.loadSocialInfo(aeRequest, invContext);
				request.setAttribute("socialInfoView", new SocialInfoView(socialInfoResponse.getPayload()));

				// forward to the jsp and capture response
				int groupBy = Integer.parseInt(request.getParameter("groupBy"));
				String printViewURL = AEStringUtil.EMPTY_STRING;
				if(groupBy == 10) {
					printViewURL = "/server/jsp/FicheHoraireHebdomadaire.jsp";
				} else if(groupBy == 20) {
					printViewURL = "/server/jsp/FichierHorairesMensuelle.jsp";
				} else {
					throw AEError.System.INVALID_PARAMETER.toException();
				}
				FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
				RequestDispatcher view = request.getRequestDispatcher(printViewURL);
				view.forward(request, capturedResponse);

				// get captured jsp response
				contentFile = capturedResponse.getContentFile();

				//
				// Create pdf from contentFile.
				// contentFile is captured .html from jsp execution
				// 
				// For now neded additional resources will be hard coded. 
				//
				pdfFile = contentFile;
				String pdfFileName = "unknown.pdf";
				if(groupBy == 10) {
					// Use custom resources (images, css, etc.) for this report
					Document document = new Document(PageSize.A4,36,36,84,36); //l-r-t-b
					//document.setMargins(70, 70, 100, 70);

					File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
					pdfFile = new File(
							tmpRepository, 
							AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));
					pdfFileName = "FicheHoraireHebdomadaire.pdf";
					
				    PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
				    HeaderFooter event = new HeaderFooter();
			        //writer.setBoxSize("art", new Rectangle(36, 54, 788, 559)); //landscape
				    writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
			        writer.setPageEvent(event);

				    document.open();
				    
				    //CSS
				    CSSResolver cssResolver = new StyleAttrCSSResolver();
				    CssFile cssFile = XMLWorkerHelper.getCSS(
				    	new FileInputStream(
				    		new File(
				    				new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
				    				"FicheHoraireHebdomadaire.css")));
				        
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
				} else if(groupBy == 20) {
					// Use custom resources (images, css, etc.) for this report
					Document document = new Document(PageSize.A4, 70, 70, 100, 70);
					//document.setMargins(70, 70, 100, 70);
					
					File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
					pdfFile = new File(
							tmpRepository, 
							AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));
					pdfFileName = "FicheHoraireMensuelle.pdf";
					
				    PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
				    HeaderFooter event = new HeaderFooter();
			        writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/));
			        writer.setPageEvent(event);

				    document.open();
				    
				    //CSS
				    CSSResolver cssResolver = new StyleAttrCSSResolver();
				    CssFile cssFile = XMLWorkerHelper.getCSS(
				    	new FileInputStream(
				    		new File(
				    				new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
				    				"FicheHoraireMensuelle.css")));
				        
				    cssResolver.addCss(cssFile);
				    
				    //HTML
				    HtmlPipelineContext htmlContext = new HtmlPipelineContext(null);

				    htmlContext.setTagFactory(Tags.getHtmlTagProcessorFactory());
				    
				    //Pipelinse

				    Pipeline<?> pipeline =

				        new CssResolverPipeline(cssResolver,

				            new HtmlPipeline(htmlContext,

				                new PdfWriterPipeline(document, writer)));

				    XMLWorker worker = new XMLWorker(pipeline, true);

				    XMLParser p = new XMLParser(worker, Charset.forName("UTF-8"));

				    p.parse(new FileInputStream(contentFile), Charset.forName("UTF-8"));

				    document.close();
				} 
				
				//
				//  Sending pdf file to the client.
				// 
				//  Note that:
				//  Content-disposition: attachment; filename=myfile.doc
				//	will force download, but:
				// 
				//	Content-disposition: filename=myfile.doc
				//	will allow the user to choose between “open” or “save”.
				// 
				response.setContentType("application/pdf");
				response.setContentLength((int) pdfFile.length());
				// response.setHeader("Content-Disposition", "attachment; filename=\"" + pdfFileName + "\"" );
				response.setHeader("Content-Disposition", "filename=\"" + pdfFileName + "\"" );

				//
				//  Stream to the requester.
				//
				int length   = 0;
				byte[] bbuf = new byte[1024];
		        ServletOutputStream op = response.getOutputStream();
				DataInputStream in = new DataInputStream(new FileInputStream(pdfFile));
				while ((in != null) && ((length = in.read(bbuf)) != -1)) {
					op.write(bbuf,0,length);
				}
				in.close();
				op.flush();
				op.close();
			}  else if("generate".equalsIgnoreCase(action)) {
				// load document
				JSONObject arguments = new JSONObject();
				JSONObject document = new JSONObject();
				document.put("id", request.getParameter("id"));
				document.put("docType", request.getParameter("docType"));
				arguments.put("document", document);
				arguments.put("loadCustomer", true);
				arguments.put("loadSocialInfo", true);
				arguments.put("loadSalaryGrid", true);
				
				AERequest aeRequest = new AERequest(arguments);
				aeRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
				AESocialService socialService = 
					(AESocialService) ServiceLocator.getInstance().getService(Services.SOCIAl);
				AEResponse aeResponse = socialService.load(aeRequest, invContext);
				
				// load time sheet
				AESocialDocumentView socialDocView = new AESocialDocumentView(aeResponse.getPayload().getJSONObject("document"));
				SocialTimeSheet timeSheet = socialService.loadTemplateTimeSheet(
						socialDocView.getEmployeeId(), 
						invContext);

				// detect the view
				String printViewURL = null;
				String printTemplateName = null;
				if(request.getParameter("templateId") != null) {
					long templateId = Long.parseLong(request.getParameter("templateId"));
					DAOFactory daoFactory = DAOFactory.getInstance();
					SocialDAO socialDAO = daoFactory.getSocialDAO(null);
					AEPrintTemplate template = socialDAO.loadPrintTemplate(templateId);
					printViewURL = template.getTemplateURL();
					printTemplateName = AEStringUtil.trim(template.getName());
				} else {
					AEDocumentType aeDocType = AEDocumentType.valueOf(Integer.parseInt(request.getParameter("docType")));
					if(aeDocType == null || AEDocumentType.valueOf(AEDocumentType.System.NA).equals(aeDocType)) {
						throw new AEException("System Error: Unknnown document type!");
					}
					printViewURL = AEDocumentFactory.getInstance(aeDocType).getPrintViewURL(aeDocType);
				}
				
				// redirect to view
				request.setAttribute("document", aeResponse.getPayload().getJSONObject("document"));	
				request.setAttribute("customer", aeResponse.getPayload().getJSONObject("customer"));
				if(aeResponse.getPayload().has("socialInfo")) {
					JSONObject socialInfoJson = aeResponse.getPayload().optJSONObject("socialInfo");
					if(socialInfoJson != null) {
						if(!AEStringUtil.isEmpty(socialInfoJson.optString("logoUrl"))) {
							request.setAttribute("logoURL", LOGO_PATH + socialInfoJson.optString("logoUrl"));
						}
						request.setAttribute("socialInfo", aeResponse.getPayload().optJSONObject("socialInfo"));	
					}
				}
				if(aeResponse.getPayload().has("salaryGrid")) {
					JSONObject salaryGridJson = aeResponse.getPayload().optJSONObject("salaryGrid");
					if(salaryGridJson != null) {
						request.setAttribute("salaryGrid", salaryGridJson);	
					}
				}
				request.setAttribute("timeSheet", timeSheet);	
				
				// forward to jsp and capture response
				FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
				RequestDispatcher view = request.getRequestDispatcher(printViewURL);
				view.forward(request, capturedResponse);
				
				// get captured jsp response
				contentFile = capturedResponse.getContentFile();
				
				// Create filename
				StringBuilder sb = new StringBuilder();
				sb.append(socialDocView.getEmployeeLastName()).append(" ").append(socialDocView.getEmployeeFirstName())
					.append("-")
					.append(AEStringUtil.trim(printTemplateName))
					.append("-")
					.append(socialDocView.getDateOfEntry())
					.append(".doc");
				String fileName = sb.toString();
				
				//
				//  Sending doc file to the client.
				// 
				//  Note that:
				//  Content-disposition: attachment; filename=myfile.doc
				//	will force download, but:
				// 
				//	Content-disposition: filename=myfile.doc
				//	will allow the user to choose between “open” or “save”.
				// 
				response.setContentType("application/msword");
				response.setContentLength((int) contentFile.length());
				response.setHeader("Content-Disposition", "filename=\"" + fileName + "\"" );

				//
				//  Stream to the requester.
				//
				int length   = 0;
				byte[] bbuf = new byte[1024];
		        ServletOutputStream op = response.getOutputStream();
				DataInputStream in = new DataInputStream(new FileInputStream(contentFile));
				while ((in != null) && ((length = in.read(bbuf)) != -1)) {
					op.write(bbuf,0,length);
				}
				in.close();
				op.flush();
				op.close();
				
				// lock the document
				JSONObject updateToLockedArguments = new JSONObject();
				updateToLockedArguments.put("document", aeResponse.getPayload().getJSONObject("document"));
				AERequest updateToLockedRequest = new AERequest(updateToLockedArguments);
				updateToLockedRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
				invContext.setProperty(AEInvocationContext.AEConnection, null);
				AEDocumentService docService = 
					(AEDocumentService) ServiceLocator.getInstance().getService(Services.DOCUMENT);
				docService.updateToLocked(updateToLockedRequest, invContext);
				
				// send mail
				JSONObject sendEMailArguments = new JSONObject();
				sendEMailArguments.put("document", aeResponse.getPayload().getJSONObject("document"));
				sendEMailArguments.put("customer", aeResponse.getPayload().getJSONObject("customer"));
				sendEMailArguments.put("action", "Générer");
				AERequest sendEMailRequest = new AERequest(sendEMailArguments);
				sendEMailRequest.setAuthPrincipal((AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL));
				invContext.setProperty(AEInvocationContext.AEConnection, null);
				socialService.sendEMail(sendEMailRequest, invContext);
			}
		} catch (Exception e) {
			logger.error(e);
			response.setContentType("text/html");
			response.setCharacterEncoding("UTF-8");
			PrintWriter out = response.getWriter();
			out.write(e.getMessage());
			out.flush();
		} finally {
			try {
				response.flushBuffer();
			} catch(Exception ex) {
				logger.error("Social servlet: Error flushing the Response: " + ex.toString());
			}
			
			// delete registered for deleting resources
			if(contentFile != null && contentFile.isFile() && contentFile.exists()) {
				FileUtils.deleteQuietly(contentFile);
			}
			if(pdfFile != null && pdfFile.isFile() && pdfFile.exists()) {
				FileUtils.deleteQuietly(pdfFile);
			}
		}
	}

	/**
	 * Delete all files and sub directories
	 * @param path
	 * @return boolean. True for success
	 */
	protected boolean deleteDirectory(File path) {
		if( path.exists() ) {
			File[] files = path.listFiles();
			for(int i=0; i<files.length; i++) {
				if(files[i].isDirectory()) {
					deleteDirectory(files[i]);
				}
				else {
					files[i].delete();
				}
			}
		}
		return( path.delete() );
	}
	
	/** Inner class to add a header and a footer. */
    class HeaderFooter extends PdfPageEventHelper {
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
//        public void onOpenDocument(PdfWriter writer, Document document) {
////            header[0] = new Phrase("I am Headeeeeeeerrrrr!!!");
//			try {
//				Image img;
//				img = Image.getInstance("C://AccBureau//resourceRepository//mon_entreprise_logo_tiny.png");
//				img.setAlignment(Image.LEFT| Image.TEXTWRAP);
//				img.setAbsolutePosition(0, 0);
//				
//				PdfContentByte byte1 = writer.getDirectContent();
//                PdfTemplate tp1 = byte1.createTemplate(65, 55);
//                tp1.addImage(img);
//                byte1.addTemplate(tp1, 60, document.getPageSize().getTop()-document.getPageSize().getBottom()-68);//750);
//                
//                Phrase phrase = new Phrase(byte1.toString() + "");
//    			header[0] = phrase;
//                
//			} catch (Exception e) {
//				e.printStackTrace();
//			}
//			pagenumber++;
//        }

        /**
         * Increase the page number.
         * @see com.itextpdf.text.pdf.PdfPageEventHelper#onStartPage(
         *      com.itextpdf.text.pdf.PdfWriter, com.itextpdf.text.Document)
         */
        public void onStartPage(PdfWriter writer, Document document) {
        	try {
				Image img;
				img = Image.getInstance(new File(
						new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
						"mon_entreprise_logo_tiny.png").getAbsolutePath());
				img.setAlignment(Image.LEFT| Image.TEXTWRAP);
				img.setAbsolutePosition(0, 0);
				
				PdfContentByte byte1 = writer.getDirectContent();
                PdfTemplate tp1 = byte1.createTemplate(65, 55);
                tp1.addImage(img);
                byte1.addTemplate(tp1, 60, document.getPageSize().getTop()-document.getPageSize().getBottom()-68);
                
                Phrase phrase = new Phrase(byte1.toString());
    			header[0] = phrase;
                
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
            ColumnText.showTextAligned(writer.getDirectContent(),
                    Element.ALIGN_RIGHT, new Phrase("Monentreprise", FontFactory.getFont(FontFactory.HELVETICA, 12, Font.BOLD, new BaseColor(60, 61, 61))),
                    (rect.getLeft()+170), rect.getTop() - 32, 0);
            ColumnText.showTextAligned(writer.getDirectContent(),
                    Element.ALIGN_RIGHT, new Phrase("Imprimé le: " + new SimpleDateFormat("dd/MM/yyyy").format(new Date()),
                    		FontFactory.getFont(FontFactory.HELVETICA, 8, Font.BOLD, new BaseColor(60, 61, 61))),
                    (rect.getRight()), rect.getBottom() - 28, 0);
        }
    }
}
