package eu.agileeng.ws.operator.impl;


import java.io.File;
import java.io.FileInputStream;
import java.util.Date;
import java.util.List;

import javax.jcr.Item;
import javax.jcr.Node;
import javax.jcr.ValueFactory;
import javax.jws.WebService;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;

import eu.agileeng.accbureau.AEApp;
import eu.agileeng.domain.AEError;
import eu.agileeng.domain.AEException;
import eu.agileeng.domain.jcr.JcrNode;
import eu.agileeng.domain.jcr.NodeSameNameValidator;
import eu.agileeng.persistent.jcr.JCRFactory;
import eu.agileeng.persistent.jcr.JcrSession;
import eu.agileeng.security.AuthLoginToken;
import eu.agileeng.security.AuthPrincipal;
import eu.agileeng.security.AuthService;
import eu.agileeng.services.AEInvocationContext;
import eu.agileeng.services.ServiceLocator;
import eu.agileeng.services.ServiceLocator.Services;
import eu.agileeng.services.dmtbox.DmtboxService;
import eu.agileeng.services.imp.AEInvocationContextImp;
import eu.agileeng.util.AEDateUtil;
import eu.agileeng.util.AEFileUtil;
import eu.agileeng.util.AEMath;
import eu.agileeng.util.AEStringUtil;
import eu.agileeng.ws.client.IWSFrontal;
import eu.agileeng.ws.client.ServiceDTO;
import eu.agileeng.ws.client.UploadNotificationThreadPool;
import eu.agileeng.ws.client.UploadNotificationThreadTask;
import eu.agileeng.ws.client.WSFrontalImplService;
import eu.agileeng.ws.operator.OperatorWebServiceInterface;

//@WebService(serviceName = "OperatorWebService", endpointInterface = "eu.agileeng.ws.operator.OperatorWebServiceInterface", targetNamespace = "http://service.operator.dematbox.sagemcom.com/")
public class OperatorWebServiceInterfaceImpl implements OperatorWebServiceInterface {
	
	public String sendFile(String boxId, int serviceId, String virtualBoxId,
			long docId, byte[] rawScan, String rawFileExtension,
			byte[] improvedScan, String improvedFileExtension, String text) {
		
		JcrSession jcrSession = null;
		File improvedFile = null;
		try {
			// save files
			Date currentDate = new Date();
			String abstractFileName = 
					new StringBuilder("scanned_").append(AEDateUtil.convertToString(currentDate, "yyyyMMdd_HHmmss")).append("_").append(docId).toString();
			String filepathname = new File(AEApp.getInstance().getProperties().getProperty(AEApp.fileRepository), abstractFileName).getAbsolutePath();
			
			DmtboxService dmtboxService = 
					(DmtboxService) ServiceLocator.getInstance().getService(Services.DMTBOX);
			AuthService authService = 
					(AuthService) ServiceLocator.getInstance().getService(Services.AUTH);
			
			int operatorId = dmtboxService.getOperatorId(); 
			
			// save rawScan
			if (rawScan != null) {	
				FileUtils.writeByteArrayToFile(new File(filepathname + "." + rawFileExtension), rawScan);
			}
			
			// save improvedScan
			improvedFile = new File(filepathname + "_improved." + improvedFileExtension);
			if (improvedScan != null) {
				FileUtils.writeByteArrayToFile(improvedFile, improvedScan);
			}
			
			// lookup for service name
			String serviceName = null;
			WSFrontalImplService frontal = new WSFrontalImplService();
			IWSFrontal port = frontal.getWSFrontalImplPort();
			List<ServiceDTO> services = port.getServiceList(dmtboxService.getOperatorId()).getService();
			for(ServiceDTO srv : services) {
				if (srv.getServiceId() == serviceId) {
					serviceName = srv.getServiceName();
					break;
				}
			}
			if (serviceName == null) {
				serviceName = "Unknown";
			} 
			
			// Add the node to the repository
			if(!improvedFile.exists()) {
				throw new AEException(
						AEError.System.JCR_CONTENT_FILE_MISSING.getSystemID(),
						"The uploaded file '" + improvedFile.getAbsolutePath() + "' is missing");
			}
			String newNodeName = improvedFile.getName();
			
			/**
			 * Login
			 */
			AuthLoginToken alt = AEApp.getInstance().getSystemToken();
			AuthPrincipal ap = authService.login(alt);
			AEInvocationContext invContext = new AEInvocationContextImp(ap);
			
			/**
			 * Factory, Session and start transaction
			 */
			JCRFactory jcrFactory = JCRFactory.getDefaultInstance();
			jcrSession = jcrFactory.getSession();

			/**
			 * Business logic
			 */
			// grant the parent path
			Long ownerId = dmtboxService.getOwnerId(virtualBoxId, invContext);
			String parentPath = null;
			if(ownerId != null) {
				parentPath = jcrSession.grantDematboxPath(ownerId, dmtboxService.getModuleName(), serviceName, invContext); 
			} else {
				throw new AEException("virtualBoxId unknown ");
			}
			
			// search the parent by path
			Item item = jcrSession.getSession().getItem(parentPath);
			if (null == item && !(item instanceof Node)) {
				throw new AEException(
						AEError.System.JCR_PATH_IS_NOT_NODE.getSystemID(),
						"The path '" + parentPath + "' is not instance of Node");
			}
			Node pathNode = (Node) item;
			
			// check for duplication
			NodeSameNameValidator sameNameValidator = new NodeSameNameValidator(pathNode);
			sameNameValidator.validate(newNodeName);
			
			// create the node
			Node newNode = pathNode.addNode(newNodeName, "nt:file");
			newNode.addMixin(JcrNode.JcrNodeType.mixUnstructured);
			newNode.addMixin(JcrNode.JcrNodeType.mixTitle);
			
			// JcrNode.JcrNodeType.mixTitle
			newNode.setProperty(JcrNode.JcrProperty.title, newNodeName);
			newNode.setProperty(JcrNode.JcrProperty.description, "Dematox fourni");

			// dmtbox namespace properties
			newNode.setProperty("dmtbox:boxId", boxId);
			newNode.setProperty("dmtbox:virtualBoxId", virtualBoxId);
			newNode.setProperty("dmtbox:dateCreated", currentDate.toString());

			// ae namespace properties
			newNode.setProperty(JcrNode.JcrProperty.ae_createdBy, invContext.getAuthPrincipal().getFullName());
			newNode.setProperty(JcrNode.JcrProperty.ae_created, AEDateUtil.formatDateTimeToSystem(currentDate));
			newNode.setProperty(
					JcrNode.JcrProperty.ae_createdByRole, 
					invContext.getAuthPrincipal().getMaxRole());
			newNode.setProperty(JcrNode.JcrProperty.ae_lastModifiedBy, invContext.getAuthPrincipal().getFullName());
			newNode.setProperty(JcrNode.JcrProperty.ae_lastModified, AEDateUtil.formatDateTimeToSystem(currentDate));
			
			newNode.setProperty(JcrNode.JcrProperty.ae_size, AEMath.getSizeInKB(improvedFile.length()));
			newNode.setProperty(
					JcrNode.JcrProperty.ae_fileExtension, 
					FilenameUtils.getExtension(improvedFile.getName()));
			newNode.setProperty(
					JcrNode.JcrProperty.ae_iconClass, 
					AEFileUtil.getIconClass(improvedFile.getName()));

			// if the node is nt:file primary type create the mandatory child node - jcr:content
			Node resNode = newNode.addNode(JcrNode.JcrProperty.content, JcrNode.JcrNodeType.resource);
			ValueFactory valueFactory = jcrSession.getSession().getValueFactory();

			// jcr properties
			resNode.setProperty(JcrNode.JcrProperty.mimeType, "application/pdf");
			resNode.setProperty(JcrNode.JcrProperty.encoding, AEStringUtil.EMPTY_STRING);
			resNode.setProperty(
					JcrNode.JcrProperty.data, 
					valueFactory.createBinary(new FileInputStream(improvedFile)));
			

			// save the work
			jcrSession.getSession().save();

			// Send the upload notification
			UploadNotificationThreadPool.getInstance().submit(new UploadNotificationThreadTask(operatorId, boxId, docId, "Succès"));
			
			// return success
			return "200:OK";
		} catch (Exception e) {
			AEApp.logger().error("OperatorWebService failed", e);
			return ("501:" + e.getMessage());
		}  finally {
			// close ALL sessions
			// this may throw exception like below:
			// 21:48:49,014 INFO  [TxConnectionManager] throwable from unregister connection
			// java.lang.IllegalStateException: Trying to return an unknown connection2! org.apache.jackrabbit.jca.JCASessionHandle@ddaf7c
			// but this is INFO message.
			//
			// This is better than end with session leak!!!
			JcrSession.close(jcrSession);
			
			// Delete improved file
			AEFileUtil.deleteFileQuietly(improvedFile);
		}	
	}

	public String pingOperator() {
		AEApp.logger().info("OperatorWebService pinged! Returned '200:OK'");
		return "200:OK";
	}
}