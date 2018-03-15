/******************************************************************************
 * Copyright 2012 - Sagemcom Documents SAS
 ******************************************************************************/

package eu.agileeng.ws.client;

import java.net.SocketException;

import javax.xml.ws.WebServiceException;

import org.jboss.logging.Logger;

public class UploadNotificationThreadTask implements Runnable {
	
	Logger logger = Logger.getLogger(UploadNotificationThreadTask.class);
	
	// Private member variables : 
	// the upload notification request parameters
	private int 	operatorId;
	private String 	boxId;
	private long 	docId;
	private String 	message;
	
	// Constructor of the UploadNotification task
	public UploadNotificationThreadTask(int 		operatorId,
										String 		boxId,
										long 		docId,
										String 		message) {
		this.operatorId = operatorId;
		this.boxId = boxId;
		this.docId = docId;
		this.message = message;
	}
	
	public void run() {
		
		// Initialize a boolean indicating the success or failure of the request		
		logger.info("Begin Sending notification (docId="+docId+")");
		boolean requestRetry = false;
		int 	requestRetryCount = 0;
		int 	requestRetryMax = 10; //Retry notification send max several times
		do {
			requestRetry = false;
			requestRetryCount++;
			try {
				//call web service client
				WSFrontalImplService frontal = new WSFrontalImplService();
				//frontal.addPort(new QName("http://preprod.dematbox.sagemcom.com/Frontal/WS/FrontalService", "PPWSFrontalImplPort"), "2", "http://preprod.dematbox.sagemcom.com/Frontal/WS/FrontalService");
				IWSFrontal port = frontal.getWSFrontalImplPort();
				//change endpoint URL
//				BindingProvider bindingProvider = (BindingProvider) port;
//				bindingProvider.getRequestContext().put(
//				BindingProvider.ENDPOINT_ADDRESS_PROPERTY, "http://preprod.dematbox.sagemcom.com/Frontal/WS/FrontalService");
				
				String ret = port.uploadNotification(operatorId, boxId, docId, message, 10);
				logger.info("Response send notification (docId="+docId+") : "+ret);				
			} 
			catch (Exception e) {
				logger.error("WebServiceClient (docId="+docId+") Exception : "+e);				
				String eMsg = e.getMessage();
				if (eMsg!=null) {					
					if ((eMsg.startsWith("703")) ||
						(e instanceof WebServiceException) ||
						(e instanceof SocketException)) {
						requestRetry = true;
					}
				}
			}
			if (requestRetry) {
				try {
					Thread.sleep(1000);
				} catch (InterruptedException e) {
					logger.error("Exception : "+e.getMessage());
				}
			}
		} while (requestRetry && requestRetryCount <= requestRetryMax);
    }

}
