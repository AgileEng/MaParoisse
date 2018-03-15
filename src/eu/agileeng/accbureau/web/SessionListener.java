package eu.agileeng.accbureau.web;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import eu.agileeng.accbureau.AEApp;

public class SessionListener implements HttpSessionListener {

	private volatile long totalActiveSessions;
	
	private static final String LOG_MSG = "Total Active Sessions: {0}";
	
	@Override
	public void sessionCreated(HttpSessionEvent e) {
		totalActiveSessions++;
		log();
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent e) {
		totalActiveSessions--;
		log();
	}
	
	private void log() {
		AEApp.logger().infov(LOG_MSG, totalActiveSessions);
	}
}
