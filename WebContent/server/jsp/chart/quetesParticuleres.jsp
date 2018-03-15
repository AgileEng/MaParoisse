<%@page import="org.apache.tomcat.util.json.JSONArray"%>
<%@page import="org.apache.tomcat.util.json.JSONObject"%>
<%@page import="eu.agileeng.util.AEMath"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<%
	JSONObject data =(JSONObject) request.getAttribute("data");
	JSONArray chartData = data.getJSONArray("chartData");
	String chartImageAbsolutePath =(String) request.getAttribute("chartImageAbsolutePath");
	JSONObject customer =(JSONObject) request.getAttribute("customer");
	%>
<html>
<head><meta charset="UTF-8"></meta></head>
<body>
<table border="0" cellspacing="0" cellpadding="0" width="100%" style="margin-bottom: 10px;">
	<tr>
		<td style="width: 30%">
			<p style="text-align: left; font-size: 11pt; margin-bottom: 10px;">&nbsp;</p>
		</td>
		<td style="width: 30%">
			<p style="text-align: left; font-size: 11pt;">Code Etablissement :</p>
		</td>
		<td style="width: 10%">
			<p style="text-align: left; font-size: 11pt;"><%=customer.optString("code") %></p>
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
			<p style="text-align: left; font-size: 11pt;"><%=customer.optString("name") %></p>
		</td>
	</tr>
</table>
<p style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px;">Quêtes particulières</p>
<!-- <p style="text-align: center;font-size: 9pt'">année : <b><%=data.optJSONArray("chartData").getJSONObject(0).optString("year")%></b></p> -->
<table border="0" cellspacing="0" cellpadding="0" width="100%">
<tr>
<td style="width:100%;" valign="middle">
<img src="<%=chartImageAbsolutePath%>" />
</td>
</tr>
<tr>
<td style="width:13%;" valign="middle">
<table border="0" cellspacing="0" cellpadding="2" width="40%" style="padding: 30px; font: 9.5pt 'Arial;border-bottom-width: 0.5pt;border-bottom-style:solid;border-bottom-color:#000000;">
	<thead>
		<tr>
			<th style="width: 18%;">
				&nbsp;
			</th>
			<th class="chTable" style="width: 40%; text-align: center;">
				Année
			</th>
			<th class="chTable rightBorder" style="width: 40%; text-align: center;">
				Montant
			</th>
		</tr>
	</thead>
	<tbody style="border: 0;">
	<%for (int i=0; i < chartData.length(); i++) {
		double amount = chartData.getJSONObject(i).optDouble("amount");
		int year = chartData.getJSONObject(i).optInt("year");
	%>
		<tr>
			<td style="width: 18%;">
				&nbsp;
			</td>
			<td class="chTable" style="width: 40%; text-align: center;">
				<%=year %>
			</td>
			<td class="chTable rightBorder"  style="width: 40%; text-align: right;">
				<%=AEMath.toAmountFrenchString(amount) %> €
			</td>
		</tr>
	<%} %>		
	</tbody>
</table>
</td>
</tr>
</table>
</body>
</html>