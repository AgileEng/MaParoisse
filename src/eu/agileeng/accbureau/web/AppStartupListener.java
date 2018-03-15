package eu.agileeng.accbureau.web;

import static eu.agileeng.accbureau.AEApp.logger;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

/**
 * ServletContextListener
 * 
 * A better way to implement an application startup class is by using the servlet context listener. 
 * It listens to application startup and shutdown events by implementing 
 * the methods contextInitialized() and contextDestroyed(). 
 * You can configure the listener in your web.xml (<listener-class>)
 *  
 *  public class StartupListener implements javax.servlet.ServletContextListener {
 *   ....
 *  }  
 *
 *  public void contextInitialized(ServletContextEvent sce) {
 *    ....
 *  }
 *  
 *  public void contextDestroyed(ServletContextEvent sce) {
 *    ....
 *    }
 *    
 * @author vvatov
 *
 */
public class AppStartupListener implements ServletContextListener {

	public AppStartupListener() {
	}

	/**
	 * Notification that the servlet context is about to be shut down. 
	 * All servlets and filters have been destroy()ed before any 
	 * ServletContextListeners are notified of context destruction.
	 */
	@Override
	public void contextDestroyed(ServletContextEvent servletContextEvent) {
		
	}

	/**
	 * Notification that the web application initialization process is starting. 
	 * All ServletContextListeners are notified of context initialization before 
	 * any filter or servlet in the web application is initialized.
	 */
	@Override
	public void contextInitialized(ServletContextEvent servletContextEvent) {
		try {
			/**
			 * Init keystore and truststore
			 */
//			System.setProperty("javax.net.ssl.trustStore", AEApp.getInstance().getProperties().getProperty(AEApp.truststoreFile));  
//			System.setProperty("javax.net.ssl.trustStorePassword", AEApp.getInstance().getProperties().getProperty(AEApp.truststorePass));  
//			System.setProperty("javax.net.ssl.keyStore", AEApp.getInstance().getProperties().getProperty(AEApp.keystoreFile));  
//			System.setProperty("javax.net.ssl.keyStorePassword", AEApp.getInstance().getProperties().getProperty(AEApp.keystorePass));  
//			System.setProperty("org.jboss.security.ignoreHttpsHost","true");  
		} catch (Exception e) {
			logger().error("AppStartupListener failed ", e);
		}
	}
}
