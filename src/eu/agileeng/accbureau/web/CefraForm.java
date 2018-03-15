package eu.agileeng.accbureau.web;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.FileUtils;
import org.apache.tomcat.util.json.JSONArray;
import org.apache.tomcat.util.json.JSONException;
import org.apache.tomcat.util.json.JSONObject;

import com.itextpdf.text.Document;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfImportedPage;
import com.itextpdf.text.pdf.PdfReader;
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
import eu.agileeng.accbureau.web.filter.ByteArrayCaptureServletResponse;
import eu.agileeng.accbureau.web.filter.FileCaptureServletResponse;
import eu.agileeng.domain.AEDescriptor;
import eu.agileeng.domain.AEDomainObject;
import eu.agileeng.domain.AEException;
import eu.agileeng.domain.cefra.n11580_03.BalanceDataSource;
import eu.agileeng.domain.cefra.n11580_03.BalanceRequest;
import eu.agileeng.domain.cefra.n11580_03.BilanDataSource;
import eu.agileeng.domain.cefra.n11580_03.BilanRequest;
import eu.agileeng.domain.cefra.n11580_03.BordereauParoisseDataSource;
import eu.agileeng.domain.cefra.n11580_03.BordereauParoisseRequest;
import eu.agileeng.domain.cefra.n11580_03.BudgetRealizationDataSource;
import eu.agileeng.domain.cefra.n11580_03.BudgetRealizationRequest;
import eu.agileeng.domain.cefra.n11580_03.Cefra11580_03DataSource;
import eu.agileeng.domain.cefra.n11580_03.Cefra11580_03Request;
import eu.agileeng.domain.cefra.n11580_03.CompteDeResultatDataSource;
import eu.agileeng.domain.cefra.n11580_03.CompteDeResultatRequest;
import eu.agileeng.domain.cefra.n11580_03.CouncilDataSource;
import eu.agileeng.domain.cefra.n11580_03.CouncilRequest;
import eu.agileeng.domain.cefra.n11580_03.DonorsDataSource;
import eu.agileeng.domain.cefra.n11580_03.DonorsRequest;
import eu.agileeng.domain.cefra.n11580_03.FinancesDataSource;
import eu.agileeng.domain.cefra.n11580_03.FinancesRequest;
import eu.agileeng.domain.cefra.n11580_03.FiscalReceipt;
import eu.agileeng.domain.cefra.n11580_03.GrandLivreDataSource;
import eu.agileeng.domain.cefra.n11580_03.GrandLivreRequest;
import eu.agileeng.domain.cefra.n11580_03.JournauxDataSource;
import eu.agileeng.domain.cefra.n11580_03.JournauxRequest;
import eu.agileeng.domain.contact.Contributor;
import eu.agileeng.domain.contact.Organization;
import eu.agileeng.domain.document.AEDocument;
import eu.agileeng.domain.document.AEDocumentFactory;
import eu.agileeng.domain.document.AEDocumentType;
import eu.agileeng.domain.file.FileAttachment;
import eu.agileeng.domain.imp.AEDescriptorImp;
import eu.agileeng.persistent.AEConnection;
import eu.agileeng.persistent.dao.DAOFactory;
import eu.agileeng.persistent.dao.acc.BordereauParoisseDAO;
import eu.agileeng.persistent.dao.document.DocNumSequenceDAO;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.AEInvocationContextValidator;
import eu.agileeng.services.AERequest;
import eu.agileeng.services.AEResponse;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.util.AEDateUtil;
import eu.agileeng.util.AEFileUtil;
import eu.agileeng.util.AEMath;
import eu.agileeng.util.AEStringUtil;
import eu.agileeng.util.AETimePeriod;
import eu.agileeng.util.http.HttpUtil;

/**
 * Servlet implementation class CefraForm
 */
public class CefraForm extends ReportBase {

	private static final long serialVersionUID = -8800189472790518643L;

	//	private static final String LOGO_PATH = "/client/resources/logos/";

	private static String CERFA_11580_03_JSP_PATH = "/server/jsp/cefra/11580-03.jsp";

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public CefraForm() {
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

		response.setCharacterEncoding("UTF-8");

		// register resources for releasing at the end
		boolean isJsonRpc = false;
		File contentFile = null;
		File pdfFile = null;
		AEConnection aeConnection = null;

		try {
			// validate secured connection
			HttpUtil.getInstance().isSecure(request);

			// validate execution
			AuthPrincipal ap = (AuthPrincipal) session.getAttribute(HttpUtil.SESSION_ATTRIBUTE_AUTH_PRINCIPAL);
			AEInvocationContext invContext = new AEInvocationContextImp(ap);
			AEInvocationContextValidator invContextValidator = AEInvocationContextValidator.getInstance();
			invContextValidator.validate(invContext);

			// process request
			String action = request.getParameter("number");
			String json = request.getParameter("json");
			if (!AEStringUtil.isEmpty(json)) {
				isJsonRpc = true;
				
				// expected token
				HttpUtil.getInstance().validateToken(
						session.getId(), 
						ap, 
						request.getParameter(HttpUtil.MONENTREPRISE_TOKEN_NAME));

				// execute 
				AERequest aeRequest = new AERequest(json);
				aeRequest.setAuthPrincipal(ap);
				aeRequest.setSessionID(session.getId());

				String service = aeRequest.getServiceName();
				String method = aeRequest.getMethod();
				if ("cefraService".equalsIgnoreCase(service) && "11580-03".equalsIgnoreCase(method)) {
					// Cerfa No. 11580 * 03
					// Reçu au titre des dons (Certificate to the donor)

					// Received commonly called tax receipt
					// Enables organizations and associations of general interest beneficiary of a gift or a premium 
					// to issue a certificate to the donor, so that he enjoys a tax reduction.
					// Also to justify the amounts corresponding to a waiver by voluntary reimbursement of expenses.
					// For donations in kind, indicate its assessment in cash (its equivalent in money)
					
					// arguments
					JSONObject arguments = aeRequest.getArguments();
					Date toDate = AEDateUtil.parseDateStrict(arguments.getString("toDate"));
					int year = arguments.getInt("year");
					AEDescriptor tenantDescr = Organization.lazyDescriptor(arguments.getLong(AEDomainObject.JSONKey.ownerId.name()));
					
					// Document
					AEDocumentType docType = AEDocumentType.valueOf(AEDocumentType.System.Cerfa_11580_03);
			        
			        // DB transaction
					DAOFactory daoFactory = DAOFactory.getInstance();
					aeConnection = daoFactory.getConnection();
					aeConnection.beginTransaction();
			        
					// sync donations
					accService.syncDonationsJava(tenantDescr, year, aeConnection);
					
					// The list with contributors with created receipt
					List<FiscalReceipt> frList = new ArrayList<FiscalReceipt>(); 
					
					// merged pdf in tmp repository
					Document mergedDocument = new Document();
					File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
					File mergedFile = new File(
							tmpRepository, 
							AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));
					pdfFile = mergedFile; // register for delete in the end
					FileOutputStream mergeOutputStream = new FileOutputStream(mergedFile);
					PdfWriter mergeWriter = PdfWriter.getInstance(mergedDocument, mergeOutputStream);
			        mergedDocument.open();
			        PdfContentByte cb = mergeWriter.getDirectContent();
					
			        // create individual report for every customer and merge it to the one
					RequestDispatcher requestDispatcher = request.getRequestDispatcher(CERFA_11580_03_JSP_PATH);
					JSONArray contributosJsonArray = arguments.getJSONArray("contributors");
					for (int i = 0; i < contributosJsonArray.length(); i++) {
						AEDescriptor contributorDescr = Contributor.lazyDescriptor(
								contributosJsonArray
								.getJSONObject(i)
								.getLong(AEDomainObject.JSONKey.id.name()));

						// create individual pdf report in memory 
						// will be null if the report is not generated
						ByteArrayOutputStream pdfInMemory = null;
						FiscalReceipt fr = new FiscalReceipt();
						try {
							// individualPdfFile 
							pdfInMemory = generateCerfa11580_03Individual(
									tenantDescr,
									contributorDescr,
									year,
									toDate,
									aeConnection,
									invContext,
									request,
									response,
									requestDispatcher,
									fr);
						} catch (Exception e) {
							// close merged
							mergeOutputStream.flush();
					        mergedDocument.close();
					        mergeOutputStream.close();
					        
					        // rethrow e
					        throw e;
						}
						if(pdfInMemory == null) {
							continue;
						} else {
							frList.add(fr);
						}
						
						// merge individual report page by page
						ByteArrayInputStream fis = new ByteArrayInputStream(pdfInMemory.toByteArray());
						PdfReader mergeReader = new PdfReader(fis);
						for (int j = 1; j <= mergeReader.getNumberOfPages(); j++) {
							mergedDocument.newPage();

							//import the page from source pdf
							PdfImportedPage page = mergeWriter.getImportedPage(mergeReader, j);

							//add the page to the destination pdf
							cb.addTemplate(page, 0, 0);
						}
					}

					// Important: Close merged
					mergeOutputStream.flush();
			        mergedDocument.close();
			        mergeOutputStream.close();
			        
					// move in file repository
			        String docTypeString = "Recu au titre des dons";
			        StringBuilder sb = new StringBuilder();
			        
					String fileRepository = AEApp.getInstance().getProperties().getProperty(AEApp.fileRepository);
					Path target = Paths.get(
							fileRepository, 
							AEStringUtil.getStringBuilder(sb)
								.append(docTypeString)
								.append("_").append(UUID.randomUUID().toString())
								.append(".pdf")
							.toString());

					Files.move(mergedFile.toPath(), target);

					//
					// Create multiple documents in the DB (one per FiscalReceipt) and attach merged file to it
					//
					AEDocumentFactory docFactory = AEDocumentFactory.getInstance(docType);
					FileAttachment fileAttachment = null;
					for (FiscalReceipt fr : frList) {
						AEDescriptor personDescr = fr.getPersonDescr();
						if(personDescr != null) {	
							AEDocument doc = docFactory.createDocument(docType);
							doc.setNumber(year);
							doc.setNumberString(fr.getNumber());
							doc.setDate(toDate);
							doc.setCompany(tenantDescr);
							doc.setDescription(
								AEStringUtil.getStringBuilder(sb)
									.append(docTypeString)
									.append(" ").append(fr.getNumber())
									.append(" ").append(AEStringUtil.trim(personDescr.getName()))
									.append(" ").append(AEMath.toAmountFrenchString(fr.getAmount()))
								.toString());
							doc.setContributorDonationDescr(
									fr.getContributorDonationOne() != null ?
										fr.getContributorDonationOne().getDescriptor() :
										null);
							doc.setNote(AEStringUtil.trim(fr.getNature()));
							documentLocal.insert(doc, invContext, aeConnection);		

							// create and save an attachment to the person
							fileAttachment = new FileAttachment();
							fileAttachment.setCompany(tenantDescr);
							fileAttachment.setAttachedTo(doc.getDescriptor());
							fileAttachment.setName(
								AEStringUtil.getStringBuilder(sb)
									.append(docTypeString)
									.append(" ").append(fr.getNumber())
									.append(".pdf")
								.toString());
							fileAttachment.setFileLength(Files.size(target));
							fileAttachment.setRemoteRoot(target.getParent().toString());
							fileAttachment.setRemotePath(target.getFileName().toString());
							fileAttachment.setDirty(false);
							fileAttachmentLocal.manage(fileAttachment, invContext, aeConnection);
						}
					}
					
			        // commit connection immediate
					aeConnection.commit();
					
					// get download path
					AERequest getDownloadPathRequest = new AERequest(new JSONObject()
						.put("xType", "fileAttachment")
						.put("appModuleCode", "170b3")
						.put("fileName", fileAttachment.getName())
						.put("sOwnerId", tenantDescr.getID())
						.put(AEDomainObject.JSONKey.id.name(), fileAttachment.getID())
						.put(AEDomainObject.JSONKey.ownerId.name(), tenantDescr.getID())
						.put("embedded", true));
					invContext.setAEConnection(aeConnection);
					AEResponse aeResponse = jcrLocal.getDownloadPath(getDownloadPathRequest, invContext);
					invContext.removeAEConnection();
					
					// close connection immediate
					AEConnection.close(aeConnection);
					
					// init and return response
					response.setContentType("application/pdf");
					response.setCharacterEncoding("UTF-8");

					PrintWriter out = response.getWriter();
					out.write(aeResponse.toJSONObject().toString());
					out.flush();
					out.close();
				}
			} else if("bordereau_paroisses".equalsIgnoreCase(action)) {
				/**
				 * CefraForm?
				 * 	number=bordereau_paroisses
				 *  ownerId=<long>
				 *  year=<int>
				 *
				 */

				/**
				 * Collect source data need to generate this form
				 */
				BordereauParoisseRequest bordereauParoisseRequest = new BordereauParoisseRequest();

				String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();
				AEDescriptor ownerDescr = Organization.lazyDescriptor(Long.parseLong(request.getParameter(ownerIdKey)));
				bordereauParoisseRequest.setCompany(ownerDescr);

				int year = Integer.parseInt(request.getParameter("year"));
				bordereauParoisseRequest.setYear(year);

				// next doc number
				DAOFactory daoFactory = DAOFactory.getInstance();
				aeConnection = daoFactory.getConnection();

				aeConnection.beginTransaction();

				// document
				AEDocumentType docType = AEDocumentType.valueOf(AEDocumentType.System.BordereauParoisse);

				// next doc number
				DocNumSequenceDAO docNumSequenceDAO = daoFactory.getDocNumSequenceDAO(aeConnection);
				long nextNumber = docNumSequenceDAO.nextValue(ownerDescr, year, docType);
				String nextNumberString = Integer.toString(year) + "-"  + Long.toString(nextNumber);
				bordereauParoisseRequest.setDocNumber(nextNumberString);

				/**
				 * Collect data in coresponding DataSource
				 */
				BordereauParoisseDataSource bordereauParoisseDataSource = cefraLocal.generateDataSource(bordereauParoisseRequest, invContext);
				request.setAttribute("bordereauParoisseDataSource", bordereauParoisseDataSource);

				/**
				 * Forward to the jsp and capture response
				 */
				FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
				String printViewURL = "/server/jsp/cefra/bordereauParoisse.jsp";
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
				String pdfFileName = "Bordereau-Paroisse.pdf";

				// Use custom resources (images, css, etc.) for this report
				Document document = new Document(PageSize.A4,36,36,30,36); //l-r-t-b
				//document.setMargins(70, 70, 100, 70);

				File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
				pdfFile = new File(
						tmpRepository, 
						AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));

				PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
				HeaderFooter event = new HeaderFooter();
				event.setDoNotAddTitle(true);
				event.setRds(bordereauParoisseDataSource);
				//writer.setBoxSize("art", new Rectangle(36, 54, 788, 559)); //landscape
				writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
				//uncomment to use the header & footer functionality
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

				//
				// Create a document in the DB and attach the generated file to it
				//
				AEDocumentFactory docFactory = AEDocumentFactory.getInstance(docType);
				AEDocument doc = docFactory.createDocument(docType);
				doc.setNumber(nextNumber);
				doc.setNumberString(Integer.toString(year) + "-"  + Long.toString(nextNumber));
				doc.setCompany(ownerDescr);
				doc.setDescription("BORDEREAU DES SOMMES REVERSEES A L’ARCHEVECHE AU TITRE DE L’ANNEE " + nextNumber);
				documentLocal.insert(doc, invContext, aeConnection);		

				// file
				String attFileName = "BorderauParoisse_" + nextNumberString + "_" +  AEDateUtil.format(new Date(), "yyyyMMdd_HHmmss");

				// target
				String fileRepository = AEApp.getInstance().getProperties().getProperty(AEApp.fileRepository);
				Path target = Paths.get(
						fileRepository, 
						new StringBuilder(attFileName)
						.append("_").append(doc.getClazz().getID()).append("_").append(doc.getID())
						.append(".").append("pdf").toString());

				// copy the file
				Files.copy(pdfFile.toPath(), target);

				// attachment
				FileAttachment fileAttachment = new FileAttachment();
				fileAttachment.setCompany(ownerDescr);
				fileAttachment.setAttachedTo(doc.getDescriptor());
				fileAttachment.setName(attFileName + ".pdf");
				fileAttachment.setFileLength(Files.size(target));
				fileAttachment.setRemoteRoot(target.getParent().toString());
				fileAttachment.setRemotePath(target.getFileName().toString());
				fileAttachment.setDirty(false);
				fileAttachmentLocal.manage(fileAttachment, invContext, aeConnection);

				// process bordereau paroisse table
				BordereauParoisseDAO bordereauParoisseDAO = daoFactory.getBordereauParoisseDAO(aeConnection);
				bordereauParoisseDAO.processCurrentAmount(ownerDescr, year);

				// commit and close just in time
				aeConnection.commit();
				AEConnection.close(aeConnection);

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
				ServletOutputStream out = response.getOutputStream();
				Path source = pdfFile.toPath();
				try {
					Files.copy(source, out);
				} finally {
					out.flush();
					out.close();
				}
			} else if("compte_de_resultat".equalsIgnoreCase(action)) {

				/**
				 * CefraForm?
				 * 	number=compte_de_resultat
				 *  ownerId=<long>
				 *  fromDate=<date>
				 *  toDate=<date>
				 *
				 */

				/**
				 * Collect source data need to generate this form
				 */
				CompteDeResultatRequest compteDeResultatRequest = new CompteDeResultatRequest();

				String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();
				compteDeResultatRequest.setCompany(Organization.lazyDescriptor(Long.parseLong(request.getParameter(ownerIdKey))));

				Date fromDate = AEDateUtil.parseDateStrict(request.getParameter("fromDate"));
				Date toDate = AEDateUtil.parseDateStrict(request.getParameter("toDate"));
				AETimePeriod period = new AETimePeriod(AEDateUtil.getClearDateTime(fromDate), AEDateUtil.getClearDateTime(toDate));
				compteDeResultatRequest.setPeriod(period);


				/**
				 * Collect data in coresponding DataSource
				 */
				CompteDeResultatDataSource compteDeResultatDataSource = cefraLocal.generateDataSource(compteDeResultatRequest, invContext);
				request.setAttribute("compteDeResultatDataSource", compteDeResultatDataSource);

				/**
				 * Forward to the jsp and capture response
				 */
				FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
				String printViewURL = "/server/jsp/cefra/compteDeResultat.jsp";
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
				String pdfFileName = "Compte_de_resultat.pdf";

				// Use custom resources (images, css, etc.) for this report
				Document document = new Document(PageSize.A4,36,36,40,37); //l-r-t-b
				//document.setMargins(70, 70, 100, 70);

				File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
				pdfFile = new File(
						tmpRepository, 
						AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));

				PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
				//writer.setBoxSize("art", new Rectangle(36, 54, 788, 559)); //landscape
				writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
				//uncomment to use the header & footer functionality
				HeaderFooter event = new HeaderFooter();
				event.setRds(compteDeResultatDataSource);
				writer.setPageEvent(event);

				document.open();

				//CSS
				CSSResolver cssResolver = new StyleAttrCSSResolver();
				CssFile cssFile = XMLWorkerHelper.getCSS(
						new FileInputStream(
								new File(
										new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
										"CompteDeResultat.css")));

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
				response.setContentLengthLong(pdfFile.length());
				// response.setHeader("Content-Disposition", "attachment; filename=\"" + pdfFileName + "\"" );
				response.setHeader("Content-Disposition", "filename=\"" + pdfFileName + "\"" );

				//
				//  Stream to the requester.
				//
				ServletOutputStream out = response.getOutputStream();
				Path source = pdfFile.toPath();
				try {
					Files.copy(source, out);
				} finally {
					out.flush();
					out.close();
				}
			} else if("balance".equalsIgnoreCase(action)) {

				/**
				 * CefraForm?
				 * 	number=balance
				 *  ownerId=<long>
				 *  fromDate=<date>
				 *  toDate=<date>
				 *  fromAccCode=<string>
				 *  toAccCode=<string>
				 */

				/**
				 * Collect source data need to generate this form
				 */
				BalanceRequest balanceRequest = new BalanceRequest();

				String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();
				balanceRequest.setCompany(Organization.lazyDescriptor(Long.parseLong(request.getParameter(ownerIdKey))));

				Date fromDate = AEDateUtil.parseDateStrict(request.getParameter("fromDate"));
				Date toDate = AEDateUtil.parseDateStrict(request.getParameter("toDate"));
				AETimePeriod period = new AETimePeriod(AEDateUtil.getClearDateTime(fromDate), AEDateUtil.getClearDateTime(toDate));
				balanceRequest.setPeriod(period);

				balanceRequest.setFromAccountCode(request.getParameter("fromAccCode"));
				balanceRequest.setToAccountCode(request.getParameter("toAccCode"));

				/**
				 * Collect data in coresponding DataSource
				 */
				BalanceDataSource balanceDataSource = cefraLocal.generateDataSource(balanceRequest, invContext);
				request.setAttribute("balanceDataSource", balanceDataSource);

				/**
				 * Forward to the jsp and capture response
				 */
				FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
				String printViewURL = "/server/jsp/cefra/balance.jsp";
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
				String pdfFileName = "Balance.pdf";

				// Use custom resources (images, css, etc.) for this report
				Document document = new Document(PageSize.A4,36,36,40,37); //l-r-t-b
				//document.setMargins(70, 70, 100, 70);

				File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
				pdfFile = new File(
						tmpRepository, 
						AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));

				PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
				//writer.setBoxSize("art", new Rectangle(36, 54, 788, 559)); //landscape
				writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
				//uncomment to use the header & footer functionality
				HeaderFooter event = new HeaderFooter();
				event.setRds(balanceDataSource);
				writer.setPageEvent(event);

				document.open();

				//CSS
				CSSResolver cssResolver = new StyleAttrCSSResolver();
				CssFile cssFile = XMLWorkerHelper.getCSS(
						new FileInputStream(
								new File(
										new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
										"Balance.css")));

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
				ServletOutputStream out = response.getOutputStream();
				Path source = pdfFile.toPath();
				try {
					Files.copy(source, out);
				} finally {
					out.flush();
					out.close();
				}
			} else if("bilan".equalsIgnoreCase(action)){

				/**
				 * CefraForm?
				 * 	number=bilan
				 *  ownerId=<long>
				 *  fromDate=<date>
				 *  toDate=<date>
				 *
				 */

				/**
				 * Collect source data need to generate this form
				 */
				BilanRequest bilanRequest = new BilanRequest();

				String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();
				bilanRequest.setCompany(Organization.lazyDescriptor(Long.parseLong(request.getParameter(ownerIdKey))));

				Date fromDate = AEDateUtil.parseDateStrict(request.getParameter("fromDate"));
				Date toDate = AEDateUtil.parseDateStrict(request.getParameter("toDate"));
				AETimePeriod period = new AETimePeriod(AEDateUtil.getClearDateTime(fromDate), AEDateUtil.getClearDateTime(toDate));
				bilanRequest.setPeriod(period);


				/**
				 * Collect data in coresponding DataSource
				 */
				BilanDataSource bilanDataSource = cefraLocal.generateDataSource(bilanRequest, invContext);
				request.setAttribute("bilanDataSource", bilanDataSource);

				/**
				 * Forward to the jsp and capture response
				 */
				FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
				String printViewURL = "/server/jsp/cefra/bilan.jsp";
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
				String pdfFileName = "Bilan.pdf";

				// Use custom resources (images, css, etc.) for this report
				Document document = new Document(PageSize.A4.rotate(),36,36,20,36); //l-r-t-b
				//document.setMargins(70, 70, 100, 70);

				File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
				pdfFile = new File(
						tmpRepository, 
						AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));

				PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
				writer.setBoxSize("art", new Rectangle(36, 54, 900, 559)); //landscape
				//writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
				//uncomment to use the header & footer functionality
				HeaderFooter event = new HeaderFooter();
				event.setRds(bilanDataSource);
				event.setDoNotAddTitle(true);
				writer.setPageEvent(event);

				document.open();

				//CSS
				CSSResolver cssResolver = new StyleAttrCSSResolver();
				CssFile cssFile = XMLWorkerHelper.getCSS(
						new FileInputStream(
								new File(
										new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
										"Bilan.css")));

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
				ServletOutputStream out = response.getOutputStream();
				Path source = pdfFile.toPath();
				try {
					Files.copy(source, out);
				} finally {
					out.flush();
					out.close();
				}
			} else if("journaux".equalsIgnoreCase(action)){

				/**
				 * CefraForm?
				 * 	number=journaux
				 *  ownerId=<long>
				 *  fromDate=<date>
				 *  toDate=<date>
				 *	journal=<string>
				 */

				/**
				 * Collect source data need to generate this form
				 */
				JournauxRequest journauxRequest = new JournauxRequest();

				String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();
				journauxRequest.setCompany(Organization.lazyDescriptor(Long.parseLong(request.getParameter(ownerIdKey))));

				Date fromDate = AEDateUtil.parseDateStrict(request.getParameter("fromDate"));
				Date toDate = AEDateUtil.parseDateStrict(request.getParameter("toDate"));
				AETimePeriod period = new AETimePeriod(AEDateUtil.getClearDateTime(fromDate), AEDateUtil.getClearDateTime(toDate));
				journauxRequest.setPeriod(period);

				journauxRequest.setAccJournal(new AEDescriptorImp().withCode(request.getParameter("journal")));

				/**
				 * Collect data in coresponding DataSource
				 */
				JournauxDataSource journauxDataSource = cefraLocal.generateDataSource(journauxRequest, invContext);
				request.setAttribute("journauxDataSource", journauxDataSource);

				/**
				 * Forward to the jsp and capture response
				 */
				FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
				String printViewURL = "/server/jsp/cefra/journaux.jsp";
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
				String pdfFileName = "Journaux.pdf";

				// Use custom resources (images, css, etc.) for this report
				Document document = new Document(PageSize.A4,36,36,38,37); //l-r-t-b
				//document.setMargins(70, 70, 100, 70);

				File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
				pdfFile = new File(
						tmpRepository, 
						AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));

				PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
				//writer.setBoxSize("art", new Rectangle(36, 54, 788, 559)); //landscape
				writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
				//uncomment to use the header & footer functionality
				HeaderFooter event = new HeaderFooter();
				event.setRds(journauxDataSource);
				writer.setPageEvent(event);

				document.open();

				//CSS
				CSSResolver cssResolver = new StyleAttrCSSResolver();
				CssFile cssFile = XMLWorkerHelper.getCSS(
						new FileInputStream(
								new File(
										new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
										"Journaux.css")));

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
				ServletOutputStream out = response.getOutputStream();
				Path source = pdfFile.toPath();
				try {
					Files.copy(source, out);
				} finally {
					out.flush();
					out.close();
				}
			} else if("grand_livre".equalsIgnoreCase(action)){

				/**
				 * CefraForm?
				 * 	number=grand_livre
				 *  ownerId=<long>
				 *  fromDate=<date>
				 *  toDate=<date>
				 *	fromAccCode=<string>
				 *  toAccCode=<string>
				 */

				/**
				 * Collect source data need to generate this form
				 */
				GrandLivreRequest grandLivreRequest = new GrandLivreRequest();

				String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();
				grandLivreRequest.setCompany(Organization.lazyDescriptor(Long.parseLong(request.getParameter(ownerIdKey))));

				Date fromDate = AEDateUtil.parseDateStrict(request.getParameter("fromDate"));
				Date toDate = AEDateUtil.parseDateStrict(request.getParameter("toDate"));
				AETimePeriod period = new AETimePeriod(AEDateUtil.getClearDateTime(fromDate), AEDateUtil.getClearDateTime(toDate));
				grandLivreRequest.setPeriod(period);

				grandLivreRequest.setFromAccountCode(request.getParameter("fromAccCode"));
				grandLivreRequest.setToAccountCode(request.getParameter("toAccCode"));

				/**
				 * Collect data in coresponding DataSource
				 */
				GrandLivreDataSource grandLivreDataSource = cefraLocal.generateDataSource(grandLivreRequest, invContext);
				request.setAttribute("grandLivreDataSource", grandLivreDataSource);

				/**
				 * Forward to the jsp and capture response
				 */
				FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
				String printViewURL = "/server/jsp/cefra/grand_livre.jsp";
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
				String pdfFileName = "Grand_Livre.pdf";

				// Use custom resources (images, css, etc.) for this report
				Document document = new Document(PageSize.A4,36,36,38,38); //l-r-t-b
				//document.setMargins(70, 70, 100, 70);

				File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
				pdfFile = new File(
						tmpRepository, 
						AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));

				PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
				//writer.setBoxSize("art", new Rectangle(36, 54, 788, 559)); //landscape
				writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
				//uncomment to use the header & footer functionality
				HeaderFooter event = new HeaderFooter();
				event.setRds(grandLivreDataSource);
				writer.setPageEvent(event);

				document.open();

				//CSS
				CSSResolver cssResolver = new StyleAttrCSSResolver();
				CssFile cssFile = XMLWorkerHelper.getCSS(
						new FileInputStream(
								new File(
										new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
										"Grand-Livre.css")));

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
				ServletOutputStream out = response.getOutputStream();
				Path source = pdfFile.toPath();
				try {
					Files.copy(source, out);
				} finally {
					out.flush();
					out.close();
				}
			} else if("budgetRealisationExpense".equalsIgnoreCase(action)){
				/**
				 * CefraForm?
				 * 	number=budgetRealisationExpense
				 *  ownerId=<long>
				 *  year=<int>
				 */

				/**
				 * Collect source data need to generate this form
				 */
				BudgetRealizationRequest budgetRealizationRequest = new BudgetRealizationRequest();

				// tenant
				String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();
				budgetRealizationRequest.setCompany(Organization.lazyDescriptor(Long.parseLong(request.getParameter(ownerIdKey))));

				// year
				budgetRealizationRequest.setYear(Integer.parseInt(request.getParameter("year")));
				
				// expenses
				budgetRealizationRequest.setAccountClass("6");

				/**
				 * Collect data in coresponding DataSource
				 */
				invContext.removeAEConnection();
				BudgetRealizationDataSource budgetRealizationDataSource = cefraLocal.generateDataSource(budgetRealizationRequest, invContext);
				request.setAttribute("budgetRealizationDataSource", budgetRealizationDataSource);
				
				BudgetRealizationRequest budgetRealizationRequest1 = new BudgetRealizationRequest();

				// tenant
				//String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();
				budgetRealizationRequest1.setCompany(Organization.lazyDescriptor(Long.parseLong(request.getParameter(ownerIdKey))));

				// year
				budgetRealizationRequest1.setYear(Integer.parseInt(request.getParameter("year")));
				
				// expenses
				budgetRealizationRequest1.setAccountClass("7");

				/**
				 * Collect data in coresponding DataSource
				 */
				invContext.removeAEConnection();
				BudgetRealizationDataSource budgetRealizationDataSource1 = cefraLocal.generateDataSource(budgetRealizationRequest1, invContext);
				request.setAttribute("budgetRealizationDataSourceProducts", budgetRealizationDataSource1);
				
				/**
				 * Forward to the jsp and capture response
				 */
				FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
				String printViewURL = "/server/jsp/cefra/budget.jsp";
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
				String pdfFileName = "Etat Cptes Gestion 6.pdf";

				// Use custom resources (images, css, etc.) for this report
				Document document = new Document(PageSize.A4.rotate(),36,36,20,36); //l-r-t-b
				//document.setMargins(70, 70, 100, 70);

				File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
				pdfFile = new File(
						tmpRepository, 
						AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));

				PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
				writer.setBoxSize("art", new Rectangle(36, 54, 788, 559)); //landscape
				//writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
				//uncomment to use the header & footer functionality
				HeaderFooter event = new HeaderFooter();
				event.setRds(budgetRealizationDataSource);
				event.setDoNotAddTitle(true);
				writer.setPageEvent(event);

				document.open();

				//CSS
				CSSResolver cssResolver = new StyleAttrCSSResolver();
				CssFile cssFile = XMLWorkerHelper.getCSS(
						new FileInputStream(
								new File(
										new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
										"BudgetRealisation.css")));

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
				ServletOutputStream out = response.getOutputStream();
				Path source = pdfFile.toPath();
				try {
					Files.copy(source, out);
				} finally {
					out.flush();
					out.close();
				}
			} else if("budgetRealisationIncome".equalsIgnoreCase(action)) {
				/**
				 * CefraForm?
				 * 	number=budgetRealisationIncome
				 *  ownerId=<long>
				 *  year=<int>
				 */

				/**
				 * Collect source data need to generate this form
				 */
				BudgetRealizationRequest budgetRealizationRequest = new BudgetRealizationRequest();

				// tenant
				String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();
				budgetRealizationRequest.setCompany(Organization.lazyDescriptor(Long.parseLong(request.getParameter(ownerIdKey))));

				// year
				budgetRealizationRequest.setYear(Integer.parseInt(request.getParameter("year")));
				
				// expenses
				budgetRealizationRequest.setAccountClass("7");

				/**
				 * Collect data in coresponding DataSource
				 */
				BudgetRealizationDataSource budgetRealizationDataSource = cefraLocal.generateDataSource(budgetRealizationRequest, invContext);
				request.setAttribute("budgetRealizationDataSource", budgetRealizationDataSource);

				/**
				 * Forward to the jsp and capture response
				 */
				FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
				String printViewURL = "/server/jsp/cefra/budgetRealisationIncome.jsp";
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
				String pdfFileName = "Etat Cptes Gestion 7.pdf";

				// Use custom resources (images, css, etc.) for this report
				Document document = new Document(PageSize.A4,36,36,20,36); //l-r-t-b
				//document.setMargins(70, 70, 100, 70);

				File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
				pdfFile = new File(
						tmpRepository, 
						AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));

				PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
				//writer.setBoxSize("art", new Rectangle(36, 54, 788, 559)); //landscape
				writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
				//uncomment to use the header & footer functionality
				HeaderFooter event = new HeaderFooter();
				event.setRds(budgetRealizationDataSource);
				event.setDoNotAddTitle(true);
				writer.setPageEvent(event);

				document.open();

				//CSS
				CSSResolver cssResolver = new StyleAttrCSSResolver();
				CssFile cssFile = XMLWorkerHelper.getCSS(
						new FileInputStream(
								new File(
										new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
										"BudgetRealisation.css")));

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
				ServletOutputStream out = response.getOutputStream();
				Path source = pdfFile.toPath();
				try {
					Files.copy(source, out);
				} finally {
					out.flush();
					out.close();
				}
			} else if("council".equalsIgnoreCase(action)){
				/**
				 * CefraForm?
				 * 	number=council
				 *  ownerId=<long>
				 *  year=<int>
				 */

				/**
				 * Collect source data need to generate this form
				 */
				CouncilRequest councilRequest = new CouncilRequest();

				// tenant
				String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();
				councilRequest.setCompany(Organization.lazyDescriptor(Long.parseLong(request.getParameter(ownerIdKey))));

				// year
				councilRequest.setYear(Integer.parseInt(request.getParameter("year")));
				
				// Calculate effective date
				councilRequest.setDate(new Date());

				/**
				 * Collect data in coresponding DataSource
				 */
				CouncilDataSource councilDataSource = cefraLocal.generateDataSource(councilRequest, invContext);
				request.setAttribute("councilDataSource", councilDataSource);

				/**
				 * Forward to the jsp and capture response
				 */
				FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
				String printViewURL = "/server/jsp/cefra/conseil.jsp";
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
				String pdfFileName = "Conseil.pdf";

				// Use custom resources (images, css, etc.) for this report
				Document document = new Document(PageSize.A4,36,36,20,36); //l-r-t-b
				//document.setMargins(70, 70, 100, 70);

				File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
				pdfFile = new File(
						tmpRepository, 
						AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));

				PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
				//writer.setBoxSize("art", new Rectangle(36, 54, 788, 559)); //landscape
				writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
				//uncomment to use the header & footer functionality
				HeaderFooter event = new HeaderFooter();
				event.setRds(councilDataSource);
				event.setDoNotAddTitle(true);
				writer.setPageEvent(event);

				document.open();

				//CSS
				CSSResolver cssResolver = new StyleAttrCSSResolver();
				CssFile cssFile = XMLWorkerHelper.getCSS(
						new FileInputStream(
								new File(
										new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
										"Council.css")));

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
				ServletOutputStream out = response.getOutputStream();
				Path source = pdfFile.toPath();
				try {
					Files.copy(source, out);
				} finally {
					out.flush();
					out.close();
				}
			} else if("councilProtocol".equalsIgnoreCase(action)){
				/**
				 * CefraForm?
				 * 	number=councilProtocol
				 *  ownerId=<long>
				 *  year=<int>
				 */

				/**
				 * Collect source data need to generate this form
				 */
				CouncilRequest councilRequest = new CouncilRequest();

				// tenant
				String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();
				councilRequest.setCompany(Organization.lazyDescriptor(Long.parseLong(request.getParameter(ownerIdKey))));

				// year
				councilRequest.setYear(Integer.parseInt(request.getParameter("year")));
				
				// Calculate effective date
				councilRequest.setDate(new Date());

				/**
				 * Collect data in coresponding DataSource
				 */
				CouncilDataSource councilDataSource = cefraLocal.generateDataSource(councilRequest, invContext);
				request.setAttribute("councilDataSource", councilDataSource);

				/**
				 * Forward to the jsp and capture response
				 */
				FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
				String printViewURL = "/server/jsp/cefra/councilProtocol.jsp";
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
				String pdfFileName = "PROCES_VERBAL.pdf";

				// Use custom resources (images, css, etc.) for this report
				Document document = new Document(PageSize.A4,36,36,20,36); //l-r-t-b
				//document.setMargins(70, 70, 100, 70);

				File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
				pdfFile = new File(
						tmpRepository, 
						AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));

				PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
				//writer.setBoxSize("art", new Rectangle(36, 54, 788, 559)); //landscape
				writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
				//uncomment to use the header & footer functionality
				HeaderFooter event = new HeaderFooter();
				event.setRds(councilDataSource);
				event.setDoNotAddTitle(true);
				writer.setPageEvent(event);

				document.open();

				//CSS
				CSSResolver cssResolver = new StyleAttrCSSResolver();
				CssFile cssFile = XMLWorkerHelper.getCSS(
						new FileInputStream(
								new File(
										new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
										"CouncilProtocol.css")));

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
				ServletOutputStream out = response.getOutputStream();
				Path source = pdfFile.toPath();
				try {
					Files.copy(source, out);
				} finally {
					out.flush();
					out.close();
				}
			}  else if("finances".equalsIgnoreCase(action)){
				/**
				 * CefraForm?
				 * 	number=finances
				 *  ownerId=<long>
				 *  year=<int>
				 */

				/**
				 * Collect source data need to generate this form
				 */
				FinancesRequest financesRequest = new FinancesRequest();

				// tenant
				String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();
				financesRequest.setCompany(Organization.lazyDescriptor(Long.parseLong(request.getParameter(ownerIdKey))));

				// year
				financesRequest.setYear(Integer.parseInt(request.getParameter("year")));
				
				// Calculate effective date
				Date endDate = AEDateUtil.endOfTheYear(AEDateUtil.getFirstDate(0, financesRequest.getYear()));
				financesRequest.setDate(AEDateUtil.getClearDate(endDate));

				/**
				 * Collect data in coresponding DataSource
				 */
				FinancesDataSource dataSource = cefraLocal.generateDataSource(financesRequest, invContext);
				request.setAttribute("financesDataSource", dataSource);

				/**
				 * Forward to the jsp and capture response
				 */
				FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
				String printViewURL = "/server/jsp/cefra/finances.jsp";
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
				String pdfFileName = "Finances.pdf";

				// Use custom resources (images, css, etc.) for this report
				Document document = new Document(PageSize.A4,36,36,20,36); //l-r-t-b
				//document.setMargins(70, 70, 100, 70);

				File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
				pdfFile = new File(
						tmpRepository, 
						AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));

				PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
				//writer.setBoxSize("art", new Rectangle(36, 54, 788, 559)); //landscape
				writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
				//uncomment to use the header & footer functionality
				HeaderFooter event = new HeaderFooter();
				event.setRds(dataSource);
				event.setDoNotAddTitle(true);
				writer.setPageEvent(event);

				document.open();

				//CSS
				CSSResolver cssResolver = new StyleAttrCSSResolver();
				CssFile cssFile = XMLWorkerHelper.getCSS(
						new FileInputStream(
								new File(
										new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
										"Finances.css")));

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
				ServletOutputStream out = response.getOutputStream();
				Path source = pdfFile.toPath();
				try {
					Files.copy(source, out);
				} finally {
					out.flush();
					out.close();
				}
			} else if("archevecheReport".equalsIgnoreCase(action)) {
				// DB transaction
				aeConnection = DAOFactory.getInstance().getConnection();
				aeConnection.beginTransaction();
				
				// create report
				Path target = generateArchevecheReport(invContext, false, request, response, aeConnection);
		        
				// Stream target to the requester.
				response.setContentType("application/pdf");
				response.setContentLengthLong(Files.size(target));
				response.setHeader("Content-Disposition", "filename=\"Etats Archeveche.pdf\"" );
				
				ServletOutputStream out = response.getOutputStream();
				try {
					Files.copy(target, out);
					out.flush();
					out.close();
					aeConnection.commit();
				} catch(Throwable t) {
					if(target != null && target.toFile().isFile() && target.toFile().exists()) {
						FileUtils.deleteQuietly(target.toFile());
					}
					throw new AEException(t);
				};
			} else if("batchReport".equalsIgnoreCase(action)) {
				// DB transaction
				aeConnection = DAOFactory.getInstance().getConnection();
				aeConnection.beginTransaction();
				
				// create report
				Path target = generateBatchReport(invContext, false, request, response, aeConnection);
		        
				// Stream target to the requester.
				response.setContentType("application/pdf");
				response.setContentLengthLong(Files.size(target));
				response.setHeader("Content-Disposition", "filename=\"Autres etats Journaux\"" );

				ServletOutputStream out = response.getOutputStream();
				try {
					Files.copy(target, out);
					out.flush();
					out.close();
					aeConnection.commit();
				} catch(Throwable t) {
					if(target != null && target.toFile().isFile() && target.toFile().exists()) {
						FileUtils.deleteQuietly(target.toFile());
					}
					throw new AEException(t);
				};
			} else if("closeReports".equalsIgnoreCase(action)) {
				// DB transaction
				aeConnection = DAOFactory.getInstance().getConnection();
				aeConnection.beginTransaction();

				// create reports
				Path target = generateBatchReport(invContext, true, request, response, aeConnection);
				Path target1 = generateArchevecheReport(invContext, true, request, response, aeConnection);

				// Stream target to the requester.
				ServletOutputStream out = response.getOutputStream();
				try {
					out.print("<script type=\"text/javascript\">window.close();</script>");
					out.flush();
					out.close();
					aeConnection.commit();
				} catch(Throwable t) {
					if(target != null && target.toFile().isFile() && target.toFile().exists()) {
						FileUtils.deleteQuietly(target.toFile());
					}
					if(target1 != null && target1.toFile().isFile() && target1.toFile().exists()) {
						FileUtils.deleteQuietly(target1.toFile());
					}
					throw new AEException(t);
				};
			} else if("chart_of_accounts".equalsIgnoreCase(action)) {
				/**
				 * CefraForm?
				 * 	number=chart_of_accounts
				 *  ownerId=<long>
				 *
				 */

				/**
				 * Collect source data need to generate this form
				 */
				String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();

				AERequest coaRequest = new AERequest(
						new JSONObject().put(Organization.JSONKey.customerId, Long.parseLong(request.getParameter(ownerIdKey))));
				AEResponse coaResponse = accService.loadCOA(coaRequest, invContext);
				JSONObject coa = coaResponse.getPayload();
				
				AERequest customerRequest = new AERequest(
						new JSONObject()
							.put(Organization.JSONKey.customerId, Long.parseLong(request.getParameter(ownerIdKey)))
							.put(Organization.JSONKey.doNotLoadCAO, true)
							.put(Organization.JSONKey.doNotLoadSocialInfo, true));
				AEResponse customerResponse = partyLocal.loadCustomer(customerRequest, invContext);
				JSONObject customer = customerResponse.getPayload().getJSONObject(Organization.JSONKey.customer);
				
				/**
				 * Inject the data into the reuest
				 */
				request.setAttribute("chart_of_accounts", coa);
				request.setAttribute("customer", customer);

				/**
				 * Forward to the jsp and capture response
				 */
				FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
				String printViewURL = "/server/jsp/cefra/chartOfAccounts.jsp";
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
				String pdfFileName = ".pdf";

				// Use custom resources (images, css, etc.) for this report
				Document document = new Document(PageSize.A4,36,36,40,37); //l-r-t-b
				//document.setMargins(70, 70, 100, 70);

				File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
				pdfFile = new File(
						tmpRepository, 
						AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));

				PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
				//writer.setBoxSize("art", new Rectangle(36, 54, 788, 559)); //landscape
				writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
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
										"ChartOfAccounts.css")));

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
				response.setContentLengthLong(pdfFile.length());
				// response.setHeader("Content-Disposition", "attachment; filename=\"" + pdfFileName + "\"" );
				response.setHeader("Content-Disposition", "filename=\"" + pdfFileName + "\"" );

				//
				//  Stream to the requester.
				//
				ServletOutputStream out = response.getOutputStream();
				Path source = pdfFile.toPath();
				try {
					Files.copy(source, out);
				} finally {
					out.flush();
					out.close();
				}
			}  else if("donors_report".equalsIgnoreCase(action)) {

				/**
				 * CefraForm?
				 * 	number=donors_report
				 *  ownerId=<long>
				 */

				/**
				 * Collect source data need to generate this form
				 */
				DonorsRequest donorsRequest = new DonorsRequest();

				String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();
				AEDescriptor ownerDescr = Organization.lazyDescriptor(Long.parseLong(request.getParameter(ownerIdKey)));
				donorsRequest.setCompany(ownerDescr);

				int year = Integer.parseInt(request.getParameter("year"));
				donorsRequest.setYear(year);

				/**
				 * Collect data in coresponding DataSource
				 */
				DonorsDataSource donorsDataSource = cefraLocal.generateDataSource(donorsRequest, invContext);
				request.setAttribute("donorsDataSource", donorsDataSource);

				/**
				 * Forward to the jsp and capture response
				 */
				FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
				String printViewURL = "/server/jsp/cefra/donorsReport.jsp";
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
				String pdfFileName = ".pdf";

				// Use custom resources (images, css, etc.) for this report
				Document document = new Document(PageSize.A4,36,36,40,37); //l-r-t-b
				//document.setMargins(70, 70, 100, 70);

				File tmpRepository = new File(AEApp.getInstance().getProperties().getProperty(AEApp.tmpRepository));
				pdfFile = new File(
						tmpRepository, 
						AEFileUtil.createTempFileName("pdf_tmp_", "pdf", tmpRepository));

				PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
				//writer.setBoxSize("art", new Rectangle(36, 54, 788, 559)); //landscape
				writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
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
										"donorsDataSource.css")));

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
				response.setContentLengthLong(pdfFile.length());
				// response.setHeader("Content-Disposition", "attachment; filename=\"" + pdfFileName + "\"" );
				response.setHeader("Content-Disposition", "filename=\"" + pdfFileName + "\"" );

				//
				//  Stream to the requester.
				//
				ServletOutputStream out = response.getOutputStream();
				Path source = pdfFile.toPath();
				try {
					Files.copy(source, out);
				} finally {
					out.flush();
					out.close();
				}
			}
		} catch (Exception e) {
			AEConnection.rollback(aeConnection);
			LOG.error(e);
			response.setContentType("text/html");
			response.setCharacterEncoding("UTF-8");
			PrintWriter out = response.getWriter();
			if(isJsonRpc) {
				AEResponse aeResponse = new AEResponse();
				if ("The document has no pages.".equals(e.getMessage())) {
					aeResponse.setError(new AEException("Il n’y a aucun élément à imprimer qui corresponde à votre demande"));
				} else {
					aeResponse.setError(new AEException(e));
				}
				try {
					out.write(aeResponse.toJSONObject().toString());
				} catch (JSONException e1) {
				}
			} else {
				out.write(e.getMessage());
			}
			out.flush();
		} finally {
			AEConnection.close(aeConnection);
			try {
				response.flushBuffer();
			} catch(Exception ex) {
				LOG.error("Social servlet: Error flushing the Response: " + ex.toString());
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
	 * 
	 * @param tenantDescr
	 * @param contributorDescr
	 * @param year
	 * @param dateTo
	 * @param aeConnection
	 * @param invContext
	 * @param request
	 * @param response
	 * @return <code>null</code> if individual file is not generated
	 * @throws AEException
	 */
	private ByteArrayOutputStream generateCerfa11580_03Individual(
			AEDescriptor tenantDescr, 
			AEDescriptor contributorDescr, 
			int year, 
			Date dateTo, 
			AEConnection aeConnection, 
			AEInvocationContext invContext,
			HttpServletRequest request,
			HttpServletResponse response,
			RequestDispatcher requestDispatcher,
			FiscalReceipt fr) throws AEException {
		
		try {
			/**
			 * Create request
			 */
			Cefra11580_03Request cefraRequest = new Cefra11580_03Request();

			// DAOFactory
			DAOFactory daoFactory = DAOFactory.getInstance();
			
			// tenant
			cefraRequest.setCompany(tenantDescr);

			// contributor
			cefraRequest.setContributor(contributorDescr);

			// year
			cefraRequest.setYear(year);

			// dateTo
			cefraRequest.setDateTo(dateTo);

			// doc number: get it from doc sequence 
			AEDocumentType docType = AEDocumentType.valueOf(AEDocumentType.System.Cerfa_11580_03);
			DocNumSequenceDAO docNumSequenceDAO = daoFactory.getDocNumSequenceDAO(aeConnection);
			long nextNumber = docNumSequenceDAO.nextValue(tenantDescr, year, docType);
			String nextNumberString = Integer.toString(year) + "-"  + Long.toString(nextNumber);
			cefraRequest.setDocNumber(nextNumberString);

			/**
			 * Generate report data source using specified <code>aeConnection</code>.
			 * Check for zero amount
			 */
			invContext.setAEConnection(daoFactory.getConnection(aeConnection));
			Cefra11580_03DataSource cefraDataSource = cefraLocal.generateDataSource(cefraRequest, invContext);
			if(AEMath.isZeroAmount(cefraDataSource.getAmount())) {
				docNumSequenceDAO.returnValue(tenantDescr, year, docType);
				return null;
			}
			
			invContext.removeAEConnection();

			/**
			 * Dispatch (use include, don't use forward) to the jsp and capture response (individual report as HTTP) in memory
			 */
			request.setAttribute("cefraDataSource", cefraDataSource);
			ByteArrayCaptureServletResponse capturedResponse = new ByteArrayCaptureServletResponse(response);
			requestDispatcher.include(request, capturedResponse);
			capturedResponse.getWriter().close();

			/**
			 * Create pdf from captured html
			 */
			// Use custom resources (images, css, etc.) for this report
			Document document = new Document(PageSize.A4,36,36,82,36); //l-r-t-b
			
			// individual pdf report in memory
			ByteArrayOutputStream pdfInMemory = new ByteArrayOutputStream(50*1024);
			PdfWriter writer = PdfWriter.getInstance(document, pdfInMemory);
			writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
			//document.open();
			
			HeaderFooter event = new HeaderFooter();
			event.setRds(cefraDataSource);
			writer.setPageEvent(event);
			
			document.open();
			
			//CSS
			CSSResolver cssResolver = new StyleAttrCSSResolver();
			CssFile cssFile = XMLWorkerHelper.getCSS(
					new FileInputStream(
							new File(
									new File(AEApp.getInstance().getProperties().getProperty(AEApp.resourceRepository)), 
									"11580-03.css")));
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
			InputStream httpIs = new ByteArrayInputStream(capturedResponse.getByteArrayOutputStream().toByteArray());
			p.parse(httpIs, Charset.forName("UTF-8"));
			
			// Close
			document.close();
			
			// setup fiscal receipt
			if(cefraDataSource.getContributor() != null 
					&& cefraDataSource.getContributor().getEmployee() != null 
					&& cefraDataSource.getContributor().getEmployee().getPerson() != null) {
				
				fr.setPersonDescr(
						cefraDataSource.getContributor().getEmployee().getPerson().getDescriptor().withName(
								cefraDataSource.getContributor().getEmployee().getName()));
			}
			fr.setAmount(cefraDataSource.getAmount());
			fr.setNumber(cefraDataSource.getDocNumber());
			fr.setDonations(cefraDataSource.getDonations());
			fr.setDateTo(dateTo);
			if(cefraDataSource.isPayCashMethod()) {
				fr.setNature("Espèces");
			} else if(cefraDataSource.isPayOtherMethod()) {
				fr.setNature("Autre");
			}
			
			// return created individual report
			return pdfInMemory;
		} catch (Throwable t) {
			throw new AEException(t);
		}
	}
}
