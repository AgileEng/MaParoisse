<%@page import="eu.agileeng.util.AEStringUtil"%>
<%@page import="org.apache.tomcat.util.json.JSONArray"%>
<%@page import="org.apache.tomcat.util.json.JSONObject"%>
<%@page import="eu.agileeng.util.AEDateUtil"%>
<%@page import="eu.agileeng.domain.cefra.n11580_03.CompteDeResultatDataSource"%>
<%@page import="eu.agileeng.util.AEMath"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<%
	JSONObject customer = (JSONObject) request.getAttribute("customer");
	JSONObject coa =(JSONObject) request.getAttribute("chart_of_accounts");
	
	String paroisseName = "";
	String paroisseCode = "";
	JSONArray accounts = null;
	
	if(customer != null) {
		paroisseName = AEStringUtil.trim(customer.optString("name"));
		paroisseCode = AEStringUtil.trim(customer.optString("code"));
	}
	
	JSONObject chartOfAccounts = coa.optJSONObject("chartOfAccounts");
	if(chartOfAccounts != null) {
		accounts = chartOfAccounts.optJSONArray("accounts");
	}
	%>
<html>
<head><meta charset="UTF-8"></meta></head>
<body>
<p style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px;">Plan comptable</p>
<table border="0" cellspacing="0" cellpadding="0" width="700px" style="margin-bottom: 10px;">
	<tr>
		<td class="header">
			Paroisse: <%=paroisseName%> Code paroisse: <%=paroisseCode%>
		</td>
	</tr>
</table>
<% if(accounts != null) { %>
<table border="0" cellspacing="0" cellpadding="2" width="700px">
	<thead>
		<tr>
			<th style="width: 10%">Compte</th>
			<th style="width: 35%">Nom</th>
			<th style="width: 45%">Description</th>
			<th class="right alignCenter" style="width: 10%">Active</th>
		</tr>
	</thead>
	<tbody>
	<%for(int i = 0; i < accounts.length(); i++) {
		JSONObject account = accounts.getJSONObject(i);
		String accountCode = AEStringUtil.trim(account.optString("code"));
		String accountName = AEStringUtil.trim(account.optString("name"));
		String accountDescr = AEStringUtil.trim(account.optString("description"));
		String accountActive = account.optBoolean("active") ? "Oui" : "Non";
		if((i & 1) == 0){
		%>
			<tr>
				<td><%=accountCode %></td>
				<td><%=accountName %></td>
				<td><%=accountDescr %></td>
				<td class="right alignCenter"><%=accountActive %></td>
			</tr>
		<%
		} else {
		%>
			<tr class="gray">
				<td><%=accountCode %></td>
				<td><%=accountName %></td>
				<td><%=accountDescr %></td>
				<td class="right alignCenter"><%=accountActive %></td>
			</tr>
		<%
		}
	}
	%>
	</tbody>
</table>
<%} %>
</body>
</html>