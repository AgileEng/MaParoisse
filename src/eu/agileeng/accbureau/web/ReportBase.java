package eu.agileeng.accbureau.web;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;

import javax.ejb.EJB;
import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
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
import com.itextpdf.text.pdf.PdfImportedPage;
import com.itextpdf.text.pdf.PdfPageEventHelper;
import com.itextpdf.text.pdf.PdfReader;
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
import eu.agileeng.accbureau.web.filter.ByteArrayCaptureServletResponse;
import eu.agileeng.domain.AEDescriptor;
import eu.agileeng.domain.AEDomainObject;
import eu.agileeng.domain.AEException;
import eu.agileeng.domain.cefra.n11580_03.BalanceDataSource;
import eu.agileeng.domain.cefra.n11580_03.BalanceRequest;
import eu.agileeng.domain.cefra.n11580_03.BilanDataSource;
import eu.agileeng.domain.cefra.n11580_03.BilanRequest;
import eu.agileeng.domain.cefra.n11580_03.BordereauParoisseDataSource;
import eu.agileeng.domain.cefra.n11580_03.BudgetRealizationDataSource;
import eu.agileeng.domain.cefra.n11580_03.BudgetRealizationRequest;
import eu.agileeng.domain.cefra.n11580_03.Cefra11580_03DataSource;
import eu.agileeng.domain.cefra.n11580_03.CompteDeResultatDataSource;
import eu.agileeng.domain.cefra.n11580_03.CompteDeResultatRequest;
import eu.agileeng.domain.cefra.n11580_03.CouncilDataSource;
import eu.agileeng.domain.cefra.n11580_03.CouncilRequest;
import eu.agileeng.domain.cefra.n11580_03.FinancesDataSource;
import eu.agileeng.domain.cefra.n11580_03.FinancesRequest;
import eu.agileeng.domain.cefra.n11580_03.GrandLivreDataSource;
import eu.agileeng.domain.cefra.n11580_03.GrandLivreRequest;
import eu.agileeng.domain.cefra.n11580_03.JournauxDataSource;
import eu.agileeng.domain.cefra.n11580_03.JournauxRequest;
import eu.agileeng.domain.cefra.n11580_03.ReportDataSource;
import eu.agileeng.domain.contact.Organization;
import eu.agileeng.domain.document.AEDocument;
import eu.agileeng.domain.document.AEDocumentFactory;
import eu.agileeng.domain.document.AEDocumentType;
import eu.agileeng.domain.file.FileAttachment;
import eu.agileeng.domain.imp.AEDescriptorImp;
import eu.agileeng.persistent.AEConnection;
import eu.agileeng.persistent.dao.DAOFactory;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.acc.ejb.AccLocal;
import eu.agileeng.services.cefra.ejb.CefraLocal;
import eu.agileeng.services.document.ejb.AEDocumentLocal;
import eu.agileeng.services.file.ejb.FileAttachmentLocal;
import eu.agileeng.services.jcr.ejb.JcrLocal;
import eu.agileeng.services.party.ejb.PartyLocal;
import eu.agileeng.util.AEDateUtil;
import eu.agileeng.util.AEFileUtil;
import eu.agileeng.util.AEStringUtil;
import eu.agileeng.util.AETimePeriod;

public abstract class ReportBase extends HttpServlet {

	protected static Logger LOG = Logger.getLogger(CefraForm.class);

	@EJB
	protected CefraLocal cefraLocal;

	@EJB
	protected AEDocumentLocal documentLocal;

	@EJB
	protected FileAttachmentLocal fileAttachmentLocal;

	@EJB
	protected JcrLocal jcrLocal;

	@EJB
	protected AccLocal accService;

	@EJB
	protected PartyLocal partyLocal;

	//FIXME
	protected int reportPageNumber = 0;

	/**
	 * 
	 */
	private static final long serialVersionUID = -5353176194204329932L;

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

	protected Path generateBatchReport(			
			AEInvocationContext invContext,
			boolean release,
			HttpServletRequest request,
			HttpServletResponse response,
			AEConnection outheAEConnection) throws AEException {

		// register resources for releasing at the end
		File contentFile = null;
		File pdfFile = null;
		AEConnection aeConnection = null;

		try {
			/**
			 * Here prepare the merge document
			 */
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
			
			/**
			 * Add the council report to the merged documnet
			 */
			ArrayList<ByteArrayOutputStream> reportsOutputStreams = new ArrayList<ByteArrayOutputStream>();
			
			// merge individual reports page by page
			//Bilan Report
			ByteArrayOutputStream bilanInMemory = generateBilanReport(
					invContext, 
					request,
					response);
			reportsOutputStreams.add(bilanInMemory);
			//Compte de resultat report
			ByteArrayOutputStream compteDeResultatInMemory = generateCompteDeResultatReport(
					invContext, 
					request,
					response);
			reportsOutputStreams.add(compteDeResultatInMemory);
			//Balance report
			ByteArrayOutputStream balanceInMemory = generateBalanceReport(
					invContext, 
					request,
					response);
			reportsOutputStreams.add(balanceInMemory);
			//Grand livre report
			ByteArrayOutputStream grandLivreInMemory = generateGrandLivreReport(
					invContext, 
					request,
					response);
			reportsOutputStreams.add(grandLivreInMemory);
			//Journaux report
			ByteArrayOutputStream journauxInMemory = generateJournauxReport(
					invContext, 
					request,
					response);
			reportsOutputStreams.add(journauxInMemory);
			
			Iterator<ByteArrayOutputStream> it = reportsOutputStreams.iterator();
			
			while(it.hasNext()){
				ByteArrayOutputStream baos = it.next();
				ByteArrayInputStream fis = new ByteArrayInputStream(baos.toByteArray());
				PdfReader mergeReader = new PdfReader(fis);
				for (int j = 1; j <= mergeReader.getNumberOfPages(); j++) {
					mergedDocument.newPage();

					//import the page from source pdf
					PdfImportedPage page = mergeWriter.getImportedPage(mergeReader, j);

					//add the page to the destination pdf
					cb.addTemplate(page, 0, 0);
				}
				baos.close();
				fis.close();
			}
			
			// Important: Close merged
			mergeOutputStream.flush();
	        mergedDocument.close();
	        mergeOutputStream.close();
			
			// arguments
	        int year = Integer.parseInt(request.getParameter("year"));
			AEDescriptor tenantDescr = Organization.lazyDescriptor(Long.parseLong(request.getParameter(AEDomainObject.JSONKey.ownerId.name())));
			
			// Document
			AEDocumentType docType = release ? 
					AEDocumentType.valueOf(AEDocumentType.System.ETAT_ANNUEL_DES_COMPTES) : 
					AEDocumentType.valueOf(AEDocumentType.System.ETAT_ANNUEL_DES_COMPTES_DRAFT);
	        
	        // Time creation
	        String docTypeString = "Autres états Journaux";
	        Date timeCreation = new Date();
	        StringBuilder sb = new StringBuilder();
	        
	        // DB transaction
			aeConnection = DAOFactory.getInstance().getConnection(outheAEConnection);
			aeConnection.beginTransaction();
	        
			//
			// Create a document in the DB and attach merged file to it
			// This document can be searching by the key (owner_id, number, docType),
			// where the number is the year where the document has been created
			//
	        String numberString = Integer.toString(year);
			AEDocumentFactory docFactory = AEDocumentFactory.getInstance(docType);
			AEDocument doc = docFactory.createDocument(docType);
			doc.setNumber(year);
			doc.setNumberString(numberString);
			doc.setDate(new Date());
			doc.setCompany(tenantDescr);
			doc.setDescription(
					AEStringUtil.getStringBuilder(sb)
						.append(docTypeString)
						.append(" ").append(year)
						.append(", Créé le: ").append(AEDateUtil.format(timeCreation, "dd/MM/yyyy HH:mm"))
					.toString());
			documentLocal.insert(doc, invContext, aeConnection);		

			/**
			 * Create attachment and attach it to the document
			 */
			
			// target as unique file in file repository
			String fileRepository = AEApp.getInstance().getProperties().getProperty(AEApp.fileRepository);
			Path target = Paths.get(
					fileRepository, 
					AEStringUtil.getStringBuilder(sb)
						.append(docTypeString)
						.append("_").append(numberString)
						.append("_").append(AEDateUtil.format(timeCreation, "yyyyMMdd_HHmmss"))
						.append("_").append(doc.getClazz().getID()).append("_").append(doc.getID())
						.append(".pdf")
					.toString());

			// move the file from tmp repository to file repository
			Files.move(mergedFile.toPath(), target);

			// create and save attachment
			FileAttachment fileAttachment = new FileAttachment();
			fileAttachment.setCompany(tenantDescr);
			fileAttachment.setAttachedTo(doc.getDescriptor());
			fileAttachment.setName(
				AEStringUtil.getStringBuilder(sb)
					.append(docTypeString)
					.append(" ").append(numberString)
					.append(".pdf")
				.toString());
			fileAttachment.setFileLength(Files.size(target));
			fileAttachment.setRemoteRoot(target.getParent().toString());
			fileAttachment.setRemotePath(target.getFileName().toString());
			fileAttachment.setDirty(false);
			fileAttachmentLocal.manage(fileAttachment, invContext, aeConnection);

	        // commit and close connection immediate
			aeConnection.commit();

			return target;
		} catch (Exception e) {
			AEConnection.rollback(aeConnection);
			throw new AEException(e);
		} finally {
			AEConnection.close(aeConnection);

			// delete registered for deleting resources
			if(contentFile != null && contentFile.isFile() && contentFile.exists()) {
				FileUtils.deleteQuietly(contentFile);
			}
			if(pdfFile != null && pdfFile.isFile() && pdfFile.exists()) {
				FileUtils.deleteQuietly(pdfFile);
			}
		}
	}
	
	protected Path generateArchevecheReport(			
			AEInvocationContext invContext,
			boolean release,
			HttpServletRequest request,
			HttpServletResponse response,
			AEConnection outheAEConnection) throws AEException {

		// register resources for releasing at the end
		File contentFile = null;
		File pdfFile = null;
		AEConnection aeConnection = null;

		try {
			/**
			 * Here prepare the merge document
			 */
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

			/**
			 * Add the council report to the merged documnet
			 */
			ArrayList<ByteArrayOutputStream> reportsOutputStreams = new ArrayList<ByteArrayOutputStream>();

			// merge individual reports page by page

			//Council report
			ByteArrayOutputStream councilPdfInMemory = generateCouncilReport(
					invContext, 
					request,
					response);
			reportsOutputStreams.add(councilPdfInMemory);

			//Budget Realisation Expenses Report
			ByteArrayOutputStream budgetRealisationExpenseInMemory = generateBudgetRealisationExpenseReport(
					invContext, 
					request,
					response);
			reportsOutputStreams.add(budgetRealisationExpenseInMemory);
			//Budget Realisation Income Report
			ByteArrayOutputStream budgetRealisationIncomeInMemory = generateBudgetRealisationIncomeReport(
					invContext, 
					request,
					response);
			reportsOutputStreams.add(budgetRealisationIncomeInMemory);
			//Bilan Report
			ByteArrayOutputStream bilanInMemory = generateBilanReport(
					invContext, 
					request,
					response);
			reportsOutputStreams.add(bilanInMemory);
			//Finances Report
			ByteArrayOutputStream financesInMemory = generateFinancesReport(
					invContext, 
					request,
					response);
			reportsOutputStreams.add(financesInMemory);
			//Council Protocol Report
			ByteArrayOutputStream councilProtocolInMemory = generateCouncilProtocolReport(
					invContext, 
					request,
					response);
			reportsOutputStreams.add(councilProtocolInMemory);

			Iterator<ByteArrayOutputStream> it = reportsOutputStreams.iterator();
			while(it.hasNext()){
				ByteArrayOutputStream baos = it.next();
				ByteArrayInputStream fis = new ByteArrayInputStream(baos.toByteArray());
				PdfReader mergeReader = new PdfReader(fis);
				for (int j = 1; j <= mergeReader.getNumberOfPages(); j++) {
					mergedDocument.newPage();

					//import the page from source pdf
					PdfImportedPage page = mergeWriter.getImportedPage(mergeReader, j);

					//add the page to the destination pdf
					cb.addTemplate(page, 0, 0);
				}
				baos.close();
				fis.close();
			}

			// Important: Close merged
			mergeOutputStream.flush();
			mergedDocument.close();
			mergeOutputStream.close();

			// arguments
			int year = Integer.parseInt(request.getParameter("year"));
			AEDescriptor tenantDescr = Organization.lazyDescriptor(Long.parseLong(request.getParameter(AEDomainObject.JSONKey.ownerId.name())));

			// Document
			AEDocumentType docType = release ? 
					AEDocumentType.valueOf(AEDocumentType.System.ETAT_ANNUEL_DES_COMPTES) : 
					AEDocumentType.valueOf(AEDocumentType.System.ETAT_ANNUEL_DES_COMPTES_DRAFT);

			// Time creation
			String docTypeString = "Etats Archevêché";
			Date timeCreation = new Date();
			StringBuilder sb = new StringBuilder();

	        // DB transaction
			aeConnection = DAOFactory.getInstance().getConnection(outheAEConnection);
			aeConnection.beginTransaction();

			//
			// Create a document in the DB and attach merged file to it
			// This document can be searching by the key (owner_id, number, docType),
			// where the number is the year where the document has been created
			//
			String numberString = Integer.toString(year);
			AEDocumentFactory docFactory = AEDocumentFactory.getInstance(docType);
			AEDocument doc = docFactory.createDocument(docType);
			doc.setNumber(year);
			doc.setNumberString(numberString);
			doc.setDate(new Date());
			doc.setCompany(tenantDescr);
			doc.setDescription(
					AEStringUtil.getStringBuilder(sb)
					.append(docTypeString)
					.append(" ").append(year)
					.append(", Créé le: ").append(AEDateUtil.format(timeCreation, "dd/MM/yyyy HH:mm"))
					.toString());
			documentLocal.insert(doc, invContext, aeConnection);		

			/**
			 * Create attachment and attach it to the document
			 */

			// target as unique file in file repository
			String fileRepository = AEApp.getInstance().getProperties().getProperty(AEApp.fileRepository);
			Path target = Paths.get(
					fileRepository, 
					AEStringUtil.getStringBuilder(sb)
					.append(docTypeString)
					.append("_").append(numberString)
					.append("_").append(AEDateUtil.format(timeCreation, "yyyyMMdd_HHmmss"))
					.append("_").append(doc.getClazz().getID()).append("_").append(doc.getID())
					.append(".pdf")
					.toString());

			// move the file from tmp repository to file repository
			Files.move(mergedFile.toPath(), target);

			// create and save attachment
			FileAttachment fileAttachment = new FileAttachment();
			fileAttachment.setCompany(tenantDescr);
			fileAttachment.setAttachedTo(doc.getDescriptor());
			fileAttachment.setName(
					AEStringUtil.getStringBuilder(sb)
					.append(docTypeString)
					.append(" ").append(numberString)
					.append(".pdf")
					.toString());
			fileAttachment.setFileLength(Files.size(target));
			fileAttachment.setRemoteRoot(target.getParent().toString());
			fileAttachment.setRemotePath(target.getFileName().toString());
			fileAttachment.setDirty(false);
			fileAttachmentLocal.manage(fileAttachment, invContext, aeConnection);

			// commit and close connection immediate
			aeConnection.commit();

			return target;
		} catch (Exception e) {
			AEConnection.rollback(aeConnection);
			throw new AEException(e);
		} finally {
			AEConnection.close(aeConnection);

			// delete registered for deleting resources
			if(contentFile != null && contentFile.isFile() && contentFile.exists()) {
				FileUtils.deleteQuietly(contentFile);
			}
			if(pdfFile != null && pdfFile.isFile() && pdfFile.exists()) {
				FileUtils.deleteQuietly(pdfFile);
			}
		}
	}

	protected ByteArrayOutputStream generateCouncilReport(
			AEInvocationContext invContext,
			HttpServletRequest request,
			HttpServletResponse response) throws AEException{
		/**
		 * Collect source data need to generate this form
		 */
		try{
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

			invContext.removeAEConnection();
			/**
			 * Forward to the jsp and capture response
			 */
			ByteArrayCaptureServletResponse capturedResponse = new ByteArrayCaptureServletResponse(response);
			//FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
			String printViewURL = "/server/jsp/cefra/conseil.jsp";
			RequestDispatcher view = request.getRequestDispatcher(printViewURL);
			//view.forward(request, capturedResponse);
			view.include(request, capturedResponse);
			capturedResponse.getWriter().close();				

			Document document = new Document(PageSize.A4,36,36,20,36); //l-r-t-b

			// get captured jsp response
			ByteArrayOutputStream pdfInMemory = new ByteArrayOutputStream(50*1024);
			PdfWriter writer = PdfWriter.getInstance(document, pdfInMemory);
			writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
			document.open();

			//uncomment to use the header & footer functionality
			HeaderFooter event = new HeaderFooter();
			event.setRds(councilDataSource);
			event.setDoNotAddTitle(true);
			event.setDoNotAddPageCount(true);
			event.setPagenumber(reportPageNumber);
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
			InputStream httpIs = new ByteArrayInputStream(capturedResponse.getByteArrayOutputStream().toByteArray());
			p.parse(httpIs, Charset.forName("UTF-8"));

			// Close
			document.close();
			reportPageNumber = event.getPagenumber();
			return pdfInMemory;
		} catch(Throwable t){
			throw new AEException(t);
		}
	}

	protected ByteArrayOutputStream generateBudgetRealisationExpenseReport(
			AEInvocationContext invContext,
			HttpServletRequest request,
			HttpServletResponse response) throws AEException{
		/**
		 * Collect source data need to generate this form
		 */
		try{
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
			BudgetRealizationDataSource budgetRealizationDataSource = cefraLocal.generateDataSource(budgetRealizationRequest, invContext);
			request.setAttribute("budgetRealizationDataSource", budgetRealizationDataSource);

			invContext.removeAEConnection();

			/**
			 * Forward to the jsp and capture response
			 */
			ByteArrayCaptureServletResponse capturedResponse = new ByteArrayCaptureServletResponse(response);
			//FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
			String printViewURL = "/server/jsp/cefra/budgetRealisationExpense.jsp";
			RequestDispatcher view = request.getRequestDispatcher(printViewURL);
			//view.forward(request, capturedResponse);
			view.include(request, capturedResponse);
			capturedResponse.getWriter().close();				

			Document document = new Document(PageSize.A4,36,36,20,36); //l-r-t-b

			// get captured jsp response
			ByteArrayOutputStream pdfInMemory = new ByteArrayOutputStream(50*1024);
			PdfWriter writer = PdfWriter.getInstance(document, pdfInMemory);
			writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
			document.open();

			//uncomment to use the header & footer functionality
			HeaderFooter event = new HeaderFooter();
			event.setRds(budgetRealizationDataSource);
			event.setDoNotAddTitle(true);
			event.setDoNotAddPageCount(true);
			event.setPagenumber(reportPageNumber);
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
			InputStream httpIs = new ByteArrayInputStream(capturedResponse.getByteArrayOutputStream().toByteArray());
			p.parse(httpIs, Charset.forName("UTF-8"));

			reportPageNumber = event.getPagenumber();

			// Close
			document.close();

			return pdfInMemory;
		} catch(Throwable t){
			throw new AEException(t);
		}
	}

	protected ByteArrayOutputStream generateBilanReport(
			AEInvocationContext invContext,
			HttpServletRequest request,
			HttpServletResponse response) throws AEException{

		try{
			/**
			 * Collect source data need to generate this form
			 */
			BilanRequest bilanRequest = new BilanRequest();

			String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();
			bilanRequest.setCompany(Organization.lazyDescriptor(Long.parseLong(request.getParameter(ownerIdKey))));

			Date fromDate = AEDateUtil.parseDateStrict(request.getParameter("fromDate"));
			Date toDate = AEDateUtil.parseDateStrict(request.getParameter("toDate"));

			int year = Integer.parseInt(request.getParameter("year"));
			/**
			 * if this report is generated as part of the Archeveche report
			 * no fromDate and toDate are to be expected
			 * In this case these should be the 01/01/year and 31/12/year
			 */
			if(fromDate == null || toDate == null){
				SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
				fromDate = sdf.parse("01/01/" + year);
				toDate = sdf.parse("31/12/" + year);
			}

			AETimePeriod period = new AETimePeriod(AEDateUtil.getClearDateTime(fromDate), AEDateUtil.getClearDateTime(toDate));
			bilanRequest.setPeriod(period);


			/**
			 * Collect data in coresponding DataSource
			 */
			BilanDataSource bilanDataSource = cefraLocal.generateDataSource(bilanRequest, invContext);
			request.setAttribute("bilanDataSource", bilanDataSource);

			invContext.removeAEConnection();

			/**
			 * Forward to the jsp and capture response
			 */
			ByteArrayCaptureServletResponse capturedResponse = new ByteArrayCaptureServletResponse(response);
			//FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
			String printViewURL = "/server/jsp/cefra/bilan.jsp";
			RequestDispatcher view = request.getRequestDispatcher(printViewURL);
			//view.forward(request, capturedResponse);
			view.include(request, capturedResponse);
			capturedResponse.getWriter().close();				

			Document document = new Document(PageSize.A4.rotate(),36,36,20,36); //l-r-t-b

			// get captured jsp response
			ByteArrayOutputStream pdfInMemory = new ByteArrayOutputStream(50*1024);
			PdfWriter writer = PdfWriter.getInstance(document, pdfInMemory);
			writer.setBoxSize("art", new Rectangle(36, 54, 900, 559));
			document.open();

			//uncomment to use the header & footer functionality
			HeaderFooter event = new HeaderFooter();
			event.setRds(bilanDataSource);
			event.setDoNotAddTitle(true);
			event.setDoNotAddPageCount(true);
			event.setPagenumber(reportPageNumber);
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
			InputStream httpIs = new ByteArrayInputStream(capturedResponse.getByteArrayOutputStream().toByteArray());
			p.parse(httpIs, Charset.forName("UTF-8"));

			reportPageNumber = event.getPagenumber();
			// Close
			document.close();

			return pdfInMemory;
		} catch(Throwable t){
			throw new AEException(t);
		}
	}

	protected ByteArrayOutputStream generateBudgetRealisationIncomeReport(
			AEInvocationContext invContext,
			HttpServletRequest request,
			HttpServletResponse response) throws AEException{
		/**
		 * Collect source data need to generate this form
		 */
		try{
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

			invContext.removeAEConnection();

			/**
			 * Forward to the jsp and capture response
			 */
			ByteArrayCaptureServletResponse capturedResponse = new ByteArrayCaptureServletResponse(response);
			//FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
			String printViewURL = "/server/jsp/cefra/budgetRealisationIncome.jsp";
			RequestDispatcher view = request.getRequestDispatcher(printViewURL);
			//view.forward(request, capturedResponse);
			view.include(request, capturedResponse);
			capturedResponse.getWriter().close();				

			Document document = new Document(PageSize.A4,36,36,20,36); //l-r-t-b

			// get captured jsp response
			ByteArrayOutputStream pdfInMemory = new ByteArrayOutputStream(50*1024);
			PdfWriter writer = PdfWriter.getInstance(document, pdfInMemory);
			writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
			document.open();

			//uncomment to use the header & footer functionality
			HeaderFooter event = new HeaderFooter();
			event.setRds(budgetRealizationDataSource);
			event.setDoNotAddTitle(true);
			event.setDoNotAddPageCount(true);
			event.setPagenumber(reportPageNumber);
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
			InputStream httpIs = new ByteArrayInputStream(capturedResponse.getByteArrayOutputStream().toByteArray());
			p.parse(httpIs, Charset.forName("UTF-8"));

			reportPageNumber = event.getPagenumber();
			// Close
			document.close();

			return pdfInMemory;
		} catch(Throwable t){
			throw new AEException(t);
		}
	}

	protected ByteArrayOutputStream generateFinancesReport(
			AEInvocationContext invContext,
			HttpServletRequest request,
			HttpServletResponse response) throws AEException{
		/**
		 * Collect source data need to generate this form
		 */
		try{
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

			invContext.removeAEConnection();

			/**
			 * Forward to the jsp and capture response
			 */
			ByteArrayCaptureServletResponse capturedResponse = new ByteArrayCaptureServletResponse(response);
			//FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
			String printViewURL = "/server/jsp/cefra/finances.jsp";
			RequestDispatcher view = request.getRequestDispatcher(printViewURL);
			//view.forward(request, capturedResponse);
			view.include(request, capturedResponse);
			capturedResponse.getWriter().close();				

			Document document = new Document(PageSize.A4,36,36,20,36); //l-r-t-b

			// get captured jsp response
			ByteArrayOutputStream pdfInMemory = new ByteArrayOutputStream(50*1024);
			PdfWriter writer = PdfWriter.getInstance(document, pdfInMemory);
			writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
			document.open();

			//uncomment to use the header & footer functionality
			HeaderFooter event = new HeaderFooter();
			event.setRds(dataSource);
			event.setDoNotAddTitle(true);
			event.setDoNotAddPageCount(true);
			event.setPagenumber(reportPageNumber);
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
			InputStream httpIs = new ByteArrayInputStream(capturedResponse.getByteArrayOutputStream().toByteArray());
			p.parse(httpIs, Charset.forName("UTF-8"));

			reportPageNumber = event.getPagenumber();
			// Close
			document.close();

			return pdfInMemory;
		} catch(Throwable t){
			throw new AEException(t);
		}
	}

	protected ByteArrayOutputStream generateCouncilProtocolReport(
			AEInvocationContext invContext,
			HttpServletRequest request,
			HttpServletResponse response) throws AEException{
		/**
		 * Collect source data need to generate this form
		 */
		try{
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

			invContext.removeAEConnection();

			/**
			 * Forward to the jsp and capture response
			 */
			ByteArrayCaptureServletResponse capturedResponse = new ByteArrayCaptureServletResponse(response);
			//FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
			String printViewURL = "/server/jsp/cefra/councilProtocol.jsp";
			RequestDispatcher view = request.getRequestDispatcher(printViewURL);
			//view.forward(request, capturedResponse);
			view.include(request, capturedResponse);
			capturedResponse.getWriter().close();				

			Document document = new Document(PageSize.A4,36,36,20,36); //l-r-t-b

			// get captured jsp response
			ByteArrayOutputStream pdfInMemory = new ByteArrayOutputStream(50*1024);
			PdfWriter writer = PdfWriter.getInstance(document, pdfInMemory);
			writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
			document.open();

			//uncomment to use the header & footer functionality
			HeaderFooter event = new HeaderFooter();
			event.setRds(councilDataSource);
			event.setDoNotAddTitle(true);
			event.setDoNotAddPageCount(true);
			event.setPagenumber(reportPageNumber);
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
			InputStream httpIs = new ByteArrayInputStream(capturedResponse.getByteArrayOutputStream().toByteArray());
			p.parse(httpIs, Charset.forName("UTF-8"));
			reportPageNumber = 0;
			// Close
			document.close();

			return pdfInMemory;
		} catch(Throwable t){
			throw new AEException(t);
		}
	}
	
	protected ByteArrayOutputStream generateCompteDeResultatReport(
			AEInvocationContext invContext,
			HttpServletRequest request,
			HttpServletResponse response) throws AEException{
		/**
		 * Collect source data need to generate this form
		 */
		try{
			CompteDeResultatRequest compteDeResultatRequest = new CompteDeResultatRequest();

			String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();
			compteDeResultatRequest.setCompany(Organization.lazyDescriptor(Long.parseLong(request.getParameter(ownerIdKey))));

			Date fromDate = AEDateUtil.parseDateStrict(request.getParameter("fromDate"));
			Date toDate = AEDateUtil.parseDateStrict(request.getParameter("toDate"));
			int year = Integer.parseInt(request.getParameter("year"));
			/**
			 * if this report is generated as part of the batch report
			 * no fromDate and toDate are to be expected
			 * In this case these should be the 01/01/year and 31/12/year
			 */
			if(fromDate == null || toDate == null){
				SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
				fromDate = sdf.parse("01/01/" + year);
				toDate = sdf.parse("31/12/" + year);
			}
			
			AETimePeriod period = new AETimePeriod(AEDateUtil.getClearDateTime(fromDate), AEDateUtil.getClearDateTime(toDate));
			compteDeResultatRequest.setPeriod(period);


			/**
			 * Collect data in coresponding DataSource
			 */
			CompteDeResultatDataSource compteDeResultatDataSource = cefraLocal.generateDataSource(compteDeResultatRequest, invContext);
			request.setAttribute("compteDeResultatDataSource", compteDeResultatDataSource);
			
			invContext.removeAEConnection();
			
			/**
			 * Forward to the jsp and capture response
			 */
			ByteArrayCaptureServletResponse capturedResponse = new ByteArrayCaptureServletResponse(response);
			//FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
			String printViewURL = "/server/jsp/cefra/compteDeResultat.jsp";
			RequestDispatcher view = request.getRequestDispatcher(printViewURL);
			//view.forward(request, capturedResponse);
			view.include(request, capturedResponse);
			capturedResponse.getWriter().close();				
			
			Document document = new Document(PageSize.A4,36,36,38,36); //l-r-t-b
			
			// get captured jsp response
			ByteArrayOutputStream pdfInMemory = new ByteArrayOutputStream(50*1024);
			PdfWriter writer = PdfWriter.getInstance(document, pdfInMemory);
			writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
			document.open();
	
			//uncomment to use the header & footer functionality
			HeaderFooter event = new HeaderFooter();
			event.setRds(compteDeResultatDataSource);
			event.setDoNotAddTitle(true);
			event.setDoNotAddPageCount(true);
			event.setPagenumber(reportPageNumber);
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
			InputStream httpIs = new ByteArrayInputStream(capturedResponse.getByteArrayOutputStream().toByteArray());
			p.parse(httpIs, Charset.forName("UTF-8"));
			reportPageNumber = 0;
			// Close
			document.close();
			
			return pdfInMemory;
		} catch(Throwable t){
			throw new AEException(t);
		}
	}
	
	protected ByteArrayOutputStream generateBalanceReport(
			AEInvocationContext invContext,
			HttpServletRequest request,
			HttpServletResponse response) throws AEException{
		/**
		 * Collect source data need to generate this form
		 */
		try{
			BalanceRequest balanceRequest = new BalanceRequest();

			String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();
			balanceRequest.setCompany(Organization.lazyDescriptor(Long.parseLong(request.getParameter(ownerIdKey))));

			Date fromDate = AEDateUtil.parseDateStrict(request.getParameter("fromDate"));
			Date toDate = AEDateUtil.parseDateStrict(request.getParameter("toDate"));
			int year = Integer.parseInt(request.getParameter("year"));
			/**
			 * if this report is generated as part of the batch report
			 * no fromDate and toDate are to be expected
			 * In this case these should be the 01/01/year and 31/12/year
			 */
			if(fromDate == null || toDate == null){
				SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
				fromDate = sdf.parse("01/01/" + year);
				toDate = sdf.parse("31/12/" + year);
			}
			AETimePeriod period = new AETimePeriod(AEDateUtil.getClearDateTime(fromDate), AEDateUtil.getClearDateTime(toDate));
			balanceRequest.setPeriod(period);

			balanceRequest.setFromAccountCode("");
			balanceRequest.setToAccountCode("");

			/**
			 * Collect data in coresponding DataSource
			 */
			BalanceDataSource balanceDataSource = cefraLocal.generateDataSource(balanceRequest, invContext);
			request.setAttribute("balanceDataSource", balanceDataSource);
			
			invContext.removeAEConnection();
			
			/**
			 * Forward to the jsp and capture response
			 */
			ByteArrayCaptureServletResponse capturedResponse = new ByteArrayCaptureServletResponse(response);
			//FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
			String printViewURL = "/server/jsp/cefra/balance.jsp";
			RequestDispatcher view = request.getRequestDispatcher(printViewURL);
			//view.forward(request, capturedResponse);
			view.include(request, capturedResponse);
			capturedResponse.getWriter().close();				
			
			Document document = new Document(PageSize.A4,36,36,38,36); //l-r-t-b
			
			// get captured jsp response
			ByteArrayOutputStream pdfInMemory = new ByteArrayOutputStream(50*1024);
			PdfWriter writer = PdfWriter.getInstance(document, pdfInMemory);
			writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
			document.open();
	
			//uncomment to use the header & footer functionality
			HeaderFooter event = new HeaderFooter();
			event.setRds(balanceDataSource);
			event.setDoNotAddTitle(true);
			event.setDoNotAddPageCount(true);
			event.setPagenumber(reportPageNumber);
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
			InputStream httpIs = new ByteArrayInputStream(capturedResponse.getByteArrayOutputStream().toByteArray());
			p.parse(httpIs, Charset.forName("UTF-8"));
			reportPageNumber = 0;
			// Close
			document.close();
			
			return pdfInMemory;
		} catch(Throwable t){
			throw new AEException(t);
		}
	}
	
	protected ByteArrayOutputStream generateGrandLivreReport(
			AEInvocationContext invContext,
			HttpServletRequest request,
			HttpServletResponse response) throws AEException{
		/**
		 * Collect source data need to generate this form
		 */
		try{
			/**
			 * Collect source data need to generate this form
			 */
			GrandLivreRequest grandLivreRequest = new GrandLivreRequest();

			String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();
			grandLivreRequest.setCompany(Organization.lazyDescriptor(Long.parseLong(request.getParameter(ownerIdKey))));

			Date fromDate = AEDateUtil.parseDateStrict(request.getParameter("fromDate"));
			Date toDate = AEDateUtil.parseDateStrict(request.getParameter("toDate"));
			int year = Integer.parseInt(request.getParameter("year"));
			/**
			 * if this report is generated as part of the batch report
			 * no fromDate and toDate are to be expected
			 * In this case these should be the 01/01/year and 31/12/year
			 */
			if(fromDate == null || toDate == null){
				SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
				fromDate = sdf.parse("01/01/" + year);
				toDate = sdf.parse("31/12/" + year);
			}
			
			AETimePeriod period = new AETimePeriod(AEDateUtil.getClearDateTime(fromDate), AEDateUtil.getClearDateTime(toDate));
			grandLivreRequest.setPeriod(period);

			grandLivreRequest.setFromAccountCode(request.getParameter("fromAccCode"));
			grandLivreRequest.setToAccountCode(request.getParameter("toAccCode"));

			/**
			 * Collect data in coresponding DataSource
			 */
			GrandLivreDataSource grandLivreDataSource = cefraLocal.generateDataSource(grandLivreRequest, invContext);
			request.setAttribute("grandLivreDataSource", grandLivreDataSource);

			invContext.removeAEConnection();
			
			/**
			 * Forward to the jsp and capture response
			 */
			ByteArrayCaptureServletResponse capturedResponse = new ByteArrayCaptureServletResponse(response);
			//FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
			String printViewURL = "/server/jsp/cefra/grand_livre.jsp";
			RequestDispatcher view = request.getRequestDispatcher(printViewURL);
			//view.forward(request, capturedResponse);
			view.include(request, capturedResponse);
			capturedResponse.getWriter().close();				
			
			Document document = new Document(PageSize.A4,36,36,38,36); //l-r-t-b
			
			// get captured jsp response
			ByteArrayOutputStream pdfInMemory = new ByteArrayOutputStream(50*1024);
			PdfWriter writer = PdfWriter.getInstance(document, pdfInMemory);
			writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
			document.open();
	
			//uncomment to use the header & footer functionality
			HeaderFooter event = new HeaderFooter();
			event.setRds(grandLivreDataSource);
			event.setDoNotAddTitle(true);
			event.setDoNotAddPageCount(true);
			event.setPagenumber(reportPageNumber);
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
			InputStream httpIs = new ByteArrayInputStream(capturedResponse.getByteArrayOutputStream().toByteArray());
			p.parse(httpIs, Charset.forName("UTF-8"));
			reportPageNumber = 0;
			// Close
			document.close();
			
			return pdfInMemory;
		} catch(Throwable t){
			throw new AEException(t);
		}
	}
	
	protected ByteArrayOutputStream generateJournauxReport(
			AEInvocationContext invContext,
			HttpServletRequest request,
			HttpServletResponse response) throws AEException{
		/**
		 * Collect source data need to generate this form
		 */
		try{
			/**
			 * Collect source data need to generate this form
			 */
			JournauxRequest journauxRequest = new JournauxRequest();

			String ownerIdKey = AEDomainObject.JSONKey.ownerId.name();
			journauxRequest.setCompany(Organization.lazyDescriptor(Long.parseLong(request.getParameter(ownerIdKey))));

			Date fromDate = AEDateUtil.parseDateStrict(request.getParameter("fromDate"));
			Date toDate = AEDateUtil.parseDateStrict(request.getParameter("toDate"));
			int year = Integer.parseInt(request.getParameter("year"));
			/**
			 * if this report is generated as part of the batch report
			 * no fromDate and toDate are to be expected
			 * In this case these should be the 01/01/year and 31/12/year
			 */
			if(fromDate == null || toDate == null){
				SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
				fromDate = sdf.parse("01/01/" + year);
				toDate = sdf.parse("31/12/" + year);
			}

			AETimePeriod period = new AETimePeriod(AEDateUtil.getClearDateTime(fromDate), AEDateUtil.getClearDateTime(toDate));
			journauxRequest.setPeriod(period);

			journauxRequest.setAccJournal(new AEDescriptorImp().withCode(request.getParameter("journal")));

			/**
			 * Collect data in coresponding DataSource
			 */
			JournauxDataSource journauxDataSource = cefraLocal.generateDataSource(journauxRequest, invContext);
			request.setAttribute("journauxDataSource", journauxDataSource);
			
			invContext.removeAEConnection();
			
			/**
			 * Forward to the jsp and capture response
			 */
			ByteArrayCaptureServletResponse capturedResponse = new ByteArrayCaptureServletResponse(response);
			//FileCaptureServletResponse capturedResponse = new FileCaptureServletResponse(response);
			String printViewURL = "/server/jsp/cefra/journaux.jsp";
			RequestDispatcher view = request.getRequestDispatcher(printViewURL);
			//view.forward(request, capturedResponse);
			view.include(request, capturedResponse);
			capturedResponse.getWriter().close();				
			
			Document document = new Document(PageSize.A4,36,36,38,36); //l-r-t-b
			
			// get captured jsp response
			ByteArrayOutputStream pdfInMemory = new ByteArrayOutputStream(50*1024);
			PdfWriter writer = PdfWriter.getInstance(document, pdfInMemory);
			writer.setBoxSize("art", new Rectangle(36, 54, 559, 805/*788*/)); //portrait
			document.open();
	
			//uncomment to use the header & footer functionality
			HeaderFooter event = new HeaderFooter();
			event.setRds(journauxDataSource);
			event.setDoNotAddTitle(true);
			event.setDoNotAddPageCount(true);
			event.setPagenumber(reportPageNumber);
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
			InputStream httpIs = new ByteArrayInputStream(capturedResponse.getByteArrayOutputStream().toByteArray());
			p.parse(httpIs, Charset.forName("UTF-8"));
			reportPageNumber = 0;
			// Close
			document.close();
			
			return pdfInMemory;
		} catch(Throwable t){
			throw new AEException(t);
		}
	}
}
