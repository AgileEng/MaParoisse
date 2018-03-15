<%@page import="org.apache.tomcat.util.json.JSONArray"%>
<%@page import="org.apache.tomcat.util.json.JSONObject"%>
<%@page import="eu.agileeng.util.AEStringUtil"%>
<%@page import="eu.agileeng.util.AEMath"%>
<%@page import="eu.agileeng.util.AEDateUtil"%>
<%@page import="java.util.Iterator" %>
<%@page import="org.joda.time.DateMidnight"%>
<%@page import="eu.agileeng.domain.cefra.n11580_03.DonorsDataSource" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<%	
    DonorsDataSource ds = (DonorsDataSource) request.getAttribute("donorsDataSource");
	
	%>
<html>
<head><meta charset="UTF-8"></meta></head>
<body>
<table border="0" cellspacing="0" cellpadding="0" width="700px" style="margin-bottom: 10px;">
	<tr>
		<td style="width: 30%">
			<p style="text-align: left; font-size: 11pt; margin-bottom: 10px;">&nbsp;</p>
		</td>
		<td style="width: 30%">
			<p style="text-align: left; font-size: 11pt;">Code Etablissement :</p>
		</td>
		<td style="width: 10%">
			<p style="text-align: left; font-size: 11pt;"><%=ds.getCustomerCode() %></p>
		</td>
		<td  style="width: 30%">
			&nbsp;
		</td>
	</tr>
	<tr>
		<td>&nbsp;</td>
		<td>
			<p style="text-align: left; font-size: 11pt; margin-bottom: 10px;">Nom de la paroisse : </p>
		</td>
		<td colspan="2">
			<p style="text-align: left; font-size: 11pt;"><%=ds.getCustomerName() %></p>
		</td>
	</tr>
</table>
<p style="text-align: center; font-size: 17pt; font-weight: bold; margin-bottom: 5px;">LISTE DES DONATEURS</p>
<table border="0" cellspacing="0" cellpadding="0" width="700px" style="margin-bottom: 10px;margin-top: 10px;">
	<tr>
		<td style="width: 80%">
			<p style="text-align: left; font-size: 11pt; margin-bottom: 5px;">&nbsp;<b></b></p>
		</td>
		<td style="width: 20%">
			<p style="text-align: right;font-size: 9pt'">année : <b><%=ds.getYear() %></b></p>
		</td>
	</tr>
</table>



<table border="0" cellspacing="0" cellpadding="2" width="700px" style="font: 9.5pt 'Arial;border-bottom-width: 0.5pt;border-bottom-style:solid;border-bottom-color:#000000;">
	<thead>
		<tr>
			<th class="donorsTableHeaderCell" width="6%">N° RECU</th>
			<th class="donorsTableHeaderCell" width="13%"">NOM</th>
			<th class="donorsTableHeaderCell" width="13%">PRENOM</th>
			<th class="donorsTableHeaderCell" width="18%">ADRESSE</th>
			<th class="donorsTableHeaderCell" width="6%">CP</th>
			<th class="donorsTableHeaderCell" width="12%">VILLE</th>
			<th class="donorsTableHeaderCell" width="10%">SOMME (chiffres)</th>
			<th class="donorsTableHeaderCell" width="12%">DATE Versement</th>
			<th class="donorsTableHeaderCell borderRight" width="10%;">NATURE</th>
		</tr>
	</thead>
	<tbody>
		<%
		JSONArray donations = ds.getDonations();
		for(int i=0; i < donations.length(); i++) {
			JSONObject donation = donations.optJSONObject(i);
		%>
		<tr>
			<td class="councilTableCellOrdinary" style="font-size: 8pt;text-align: center;"><%=donation.optString("docNo")%></td>
			<td class="councilTableCellOrdinary" style="font-size: 8pt;text-align: center;"><%=donation.getJSONObject("employee").optString("lastName")%></td>
			<td class="councilTableCellOrdinary" style="font-size: 8pt;text-align: center;"><%=donation.getJSONObject("employee").optString("firstName") %></td>
			<td class="councilTableCellOrdinary" style="font-size: 8pt;text-align: center;"><%=donation.getJSONObject("employee").getJSONObject("address").optString("address")%></td>
			<td class="councilTableCellOrdinary" style="font-size: 8pt;text-align: center;"><%=donation.getJSONObject("employee").getJSONObject("address").optString("postCode")%></td>
			<td class="councilTableCellOrdinary" style="font-size: 8pt;text-align: center;"><%=donation.getJSONObject("employee").getJSONObject("address").optString("town")%></td>
			<td class="councilTableCellOrdinary" style="font-size: 8pt;text-align: center;"><%=AEMath.toAmountFrenchString(donation.optDouble("amount", 0.0)) %></td>
			<td class="councilTableCellOrdinary" style="font-size: 8pt;text-align: center;"><%=donation.optString("docDate")%></td>
			<td class="councilTableCellOrdinary" style="font-size: 8pt;text-align: center;"><%=donation.optString("docNature")%></td>
		</tr>
		<%
		}
		%>
	</tbody>
</table>
</body>
</html>