/******************************************************************************
 * Copyright 2012 - Sagemcom Documents SAS
 ******************************************************************************/

package eu.agileeng.ws.client;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class UploadNotificationThreadPool {

	/**
	 * initialization of thread pool
	 */
	private static ExecutorService uploadNotificationExecutor = null;
	
	/**
	 * get one instance of thread pool
	 * @return  thread pool
	 */
	public synchronized static ExecutorService getInstance() {
		
		if (uploadNotificationExecutor == null || uploadNotificationExecutor.isShutdown()){
			uploadNotificationExecutor = Executors.newFixedThreadPool(4);
		}
		return uploadNotificationExecutor;
	}

	public static boolean estTerminer() {
		// thread pool terminated
		return uploadNotificationExecutor == null || uploadNotificationExecutor.isTerminated();
	}

}
