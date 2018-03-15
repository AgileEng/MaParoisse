<%@page import="eu.agileeng.util.AEMath"%>
<%@page import="eu.agileeng.util.AEDateUtil"%>
<%@page import="eu.agileeng.domain.acc.AccJournalResultsList"%>
<%@page import="java.util.Iterator" %>
<%@page import="eu.agileeng.domain.cefra.n11580_03.BudgetRealizationDataSource"%>
<%@page import="eu.agileeng.domain.acc.AccJournalResult"%>
<%@page import="org.joda.time.DateMidnight"%>
<%@page import="java.util.Map" %>
<%@page import="java.util.TreeMap" %>
<%@page import="java.util.ArrayList" %>
<%@page import="eu.agileeng.domain.cefra.n11580_03.ReportDataSource" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<%
	BudgetRealizationDataSource ds =(BudgetRealizationDataSource) request.getAttribute("budgetRealizationDataSource");
	BudgetRealizationDataSource dsProduits = (BudgetRealizationDataSource) request.getAttribute("budgetRealizationDataSourceProducts");
	ds.buildAccountMap();
	dsProduits.buildAccountMap();
	TreeMap<String, ArrayList<String>> accountMap = ds.getAccountMap();
	TreeMap<String, ArrayList<String>> accountMapProduits = dsProduits.getAccountMap();
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
<p style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px;">Le réalisé - le budget</p>
<table border="0" cellspacing="0" cellpadding="0" width="100%" style="margin-bottom: 10px;margin-top: 10px;">
	<tr>
		<td style="width: 80%">
			<p style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px;">&nbsp;</p>
		</td>
		<td style="width: 20%">
			<p style="text-align: right;font-size: 9pt'">année : <b><%=ds.getYear() %></b></p>
		</td>
	</tr>
</table>
<table border="0" cellspacing="0" cellpadding="0" width="100%">
<tr>
<td style="width:49%;" valign="top">
<table border="0" cellspacing="0" cellpadding="2" width="100%" style="font: 9.5pt 'Arial;border-bottom-width: 0.5pt;border-bottom-style:solid;border-bottom-color:#000000;">
	<thead>
		<tr>
			<th style="width: 4%;height:0;">
				&nbsp;
			</th>
			<th style="width: 30%;height:0;">
				&nbsp;
			</th>
			<th style="width: 10%;height:0;">
				&nbsp;
			</th>
			<th style="width: 15%;height:0;">
				&nbsp;
			</th>
			<th style="width: 15%;height:0;">
				&nbsp;
			</th>
			<th style="width: 15%;height:0;">
				&nbsp;
			</th>
			<th style="width: 11%;height:0;">
				&nbsp;
			</th>
		</tr>
		<tr class="tableHeaderSecondRow">
			<th colspan="3" style="width: 7%;font: 13pt 'Arial'" class="tableHeaderCellSecondRow borderLeft">
				CHARGES
			</th>
			<th style="width: 15%;" class="tableHeaderCellSecondRow">
				
			</th>
			<th style="width: 15%;" class="tableHeaderCellSecondRow ">
				
			</th>
			<th style="width: 15%;" class="tableHeaderCellSecondRow ">
				
			</th>
			<th style="width: 11%;" class="tableHeaderCellSecondRow borderRight">
				
			</th>
		</tr>
		<tr class="tableHeaderSecondRow">
			<th colspan="3" style="width: 7%;font: 11pt 'Arial'" class="tableHeaderCellSecondRow borderLeft">
				Compte
			</th>
			<th style="width: 15%;" class="tableHeaderCellSecondRow">
				Prévisionnel
			</th>
			<th style="width: 15%;" class="tableHeaderCellSecondRow borderLeft">
				Réalisé
			</th>
			<th style="width: 15%;" class="tableHeaderCellSecondRow borderLeft">
				Différence
			</th>
			<th style="width: 11%;" class="tableHeaderCellSecondRow borderLeft borderRight">
				%
			</th>
		</tr>
	</thead>
	<tbody style="border: 0;">
	<%for (Map.Entry<String, ArrayList<String>> entry : accountMap.entrySet()) {
			String key = entry.getKey();
			ArrayList<String> _accounts = entry.getValue();
			if (key.startsWith("6")){
	%>
		<tr>
			<td colspan="2" valign="top" class="totalEntryCell borderLeft">
				<%=key.toString() %>
			</td>
			<td valign="top" class="totalEntryCell">
				&nbsp;
			</td>
			<td valign="top" class="totalEntryCell amount">
				&nbsp;
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				&nbsp;
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				&nbsp;
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft borderRight">
				&nbsp;
			</td>
		</tr>
	<%
	Iterator<String> iter = _accounts.iterator();
	while (iter.hasNext()) {
		String accCode = iter.next();
		if(ds.accExists(accCode)) {
	%>
		<tr>
			<td valign="top" class="simpleEntryCell centered borderLeft borderBottom">
				&nbsp;
			</td>
			<td colspan="2" valign="top" class="simpleEntryCell borderBottom italic">
				<%=accCode %>&nbsp;&nbsp;<%=ds.getName(accCode) %>
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft borderBottom">
				<%=ds.toString(ds.getBudgetAmount(accCode)) %>
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft borderBottom">
				<%=ds.toString(ds.getRealAmount(accCode)) %>
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft borderBottom">
				<%=ds.toString(ds.getDifference(accCode)) %>
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft borderBottom borderRight">
				<%=ds.toString(ds.getPercentage(accCode)) %>
			</td>
		</tr>
	<%}} %>
		<tr>
			<td colspan="2" valign="top" class="totalEntryCell whiteBack borderLeft">
				&nbsp;
			</td>
			<td valign="top" class="totalEntryCell whiteBack">
				Total
			</td>
			<td valign="top" class="totalEntryCell whiteBack amount borderLeft">
				<%=ds.toString(ds.getBudgetAmount(key)) %>
			</td>
			<td valign="top" class="totalEntryCell whiteBack amount borderLeft">
				<%=ds.toString(ds.getRealAmount(key)) %>
			</td>
			<td valign="top" class="totalEntryCell whiteBack amount borderLeft">
				<%=ds.toString(ds.getDifference(key)) %>
			</td>
			<td valign="top" class="totalEntryCell whiteBack amount borderLeft borderRight">
				<%=ds.toString(ds.getPercentage(key)) %>
			</td>
		</tr>
	<%}
	}%>
	</tbody>
</table>
</td>
<td style="width:2%;">&nbsp;</td>
<td style="width:49%;" valign="top">
<table border="0" cellspacing="0" cellpadding="2" width="100%" style="font: 9.5pt 'Arial;border-bottom-width: 0.5pt;border-bottom-style:solid;border-bottom-color:#000000;">
	<thead>
		<tr>
			<th style="width: 4%;height:0;">
				&nbsp;
			</th>
			<th style="width: 30%;height:0;">
				&nbsp;
			</th>
			<th style="width: 10%;height:0;">
				&nbsp;
			</th>
			<th style="width: 15%;height:0;">
				&nbsp;
			</th>
			<th style="width: 15%;height:0;">
				&nbsp;
			</th>
			<th style="width: 15%;height:0;">
				&nbsp;
			</th>
			<th style="width: 11%;height:0;">
				&nbsp;
			</th>
		</tr>
		<tr class="tableHeaderSecondRow">
			<th colspan="3" style="width: 7%;font: 13pt 'Arial'" class="tableHeaderCellSecondRow borderLeft">
				PRODUIT
			</th>
			<th style="width: 15%;" class="tableHeaderCellSecondRow">
				
			</th>
			<th style="width: 15%;" class="tableHeaderCellSecondRow">
				
			</th>
			<th style="width: 15%;" class="tableHeaderCellSecondRow ">
				
			</th>
			<th style="width: 11%;" class="tableHeaderCellSecondRow  borderRight">
				
			</th>
		</tr>
		<tr class="tableHeaderSecondRow">
			<th colspan="3" style="width: 7%;font: 11pt 'Arial'" class="tableHeaderCellSecondRow borderLeft">
				Compte
			</th>
			<th style="width: 15%;" class="tableHeaderCellSecondRow">
				Prévisionnel
			</th>
			<th style="width: 15%;" class="tableHeaderCellSecondRow borderLeft">
				Réalisé
			</th>
			<th style="width: 15%;" class="tableHeaderCellSecondRow borderLeft">
				Différence
			</th>
			<th style="width: 11%;" class="tableHeaderCellSecondRow borderLeft borderRight">
				%
			</th>
		</tr>
	</thead>
	<tbody style="border: 0;">
	<%for (Map.Entry<String, ArrayList<String>> entry : accountMapProduits.entrySet()) {
			String key = entry.getKey();
			ArrayList<String> _accounts = entry.getValue();
			if (key.startsWith("7")){
	%>
		<tr>
			<td colspan="2" valign="top" class="totalEntryCell borderLeft">
				<%=key.toString() %>
			</td>
			<td valign="top" class="totalEntryCell">
				&nbsp;
			</td>
			<td valign="top" class="totalEntryCell amount">
				&nbsp;
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				&nbsp;
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				&nbsp;
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft borderRight">
				&nbsp;
			</td>
		</tr>
	<%
	Iterator<String> iter = _accounts.iterator();
	while (iter.hasNext()) {
		String accCode = iter.next();
		if(dsProduits.accExists(accCode)) {
	%>
		<tr>
			<td valign="top" class="simpleEntryCell centered borderLeft borderBottom">
				&nbsp;
			</td>
			<td colspan="2" valign="top" class="simpleEntryCell borderBottom italic">
				<%=accCode %>&nbsp;&nbsp;<%=dsProduits.getName(accCode) %>
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft borderBottom">
				<%=dsProduits.toString(dsProduits.getBudgetAmount(accCode)) %>
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft borderBottom">
				<%=dsProduits.toString(dsProduits.getRealAmount(accCode)) %>
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft borderBottom">
				<%=dsProduits.toString(dsProduits.getDifference(accCode)) %>
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft borderBottom borderRight">
				<%=dsProduits.toString(dsProduits.getPercentage(accCode)) %>
			</td>
		</tr>
	<%}} %>
		<tr>
			<td colspan="2" valign="top" class="totalEntryCell whiteBack borderLeft">
				&nbsp;
			</td>
			<td valign="top" class="totalEntryCell whiteBack">
				Total
			</td>
			<td valign="top" class="totalEntryCell whiteBack amount borderLeft">
				<%=dsProduits.toString(dsProduits.getBudgetAmount(key)) %>
			</td>
			<td valign="top" class="totalEntryCell whiteBack amount borderLeft">
				<%=dsProduits.toString(dsProduits.getRealAmount(key)) %>
			</td>
			<td valign="top" class="totalEntryCell whiteBack amount borderLeft">
				<%=dsProduits.toString(dsProduits.getDifference(key)) %>
			</td>
			<td valign="top" class="totalEntryCell whiteBack amount borderLeft borderRight">
				<%=dsProduits.toString(dsProduits.getPercentage(key)) %>
			</td>
		</tr>
	<%}
	}%>
	</tbody>
</table>
</td>
</tr>
</table>
<table border="0" cellspacing="0" cellpadding="0" width="100%">
<tr>
<td style="width:49%;" valign="top">
<table border="0" cellspacing="0" cellpadding="2" width="100%" style="font: 9.5pt 'Arial;border-bottom-width: 0.5pt;border-bottom-style:solid;border-bottom-color:#000000;">
	<thead>
		<tr>
			<th style="width: 4%;height:0;">
				&nbsp;
			</th>
			<th style="width: 30%;height:0;">
				&nbsp;
			</th>
			<th style="width: 10%;height:0;">
				&nbsp;
			</th>
			<th style="width: 15%;height:0;">
				&nbsp;
			</th>
			<th style="width: 15%;height:0;">
				&nbsp;
			</th>
			<th style="width: 15%;height:0;">
				&nbsp;
			</th>
			<th style="width: 11%;height:0;">
				&nbsp;
			</th>
		</tr>
	</thead>
	<tbody style="border: 0;">
		<tr>
			<td valign="top" class="tableHeaderCellSecondRow centered borderLeft borderBottomBl">
				&nbsp;
			</td>
			<td colspan="2" valign="top" class="tableHeaderCellSecondRow borderBottomBl italic" style="font-size: 10pt; font-weight: bold; text-align: left;">
				Total charges
			</td>
			<td valign="top" class="tableHeaderCellSecondRow amount borderLeft borderBottomBl" style="font-size: 9pt; font-weight: bold;">
				<%=ds.toString(ds.getBudgetAmount("6")) %>
			</td>
			<td valign="top" class="tableHeaderCellSecondRow amount borderLeft borderBottomBl" style="font-size: 9pt; font-weight: bold;">
				<%=ds.toString(ds.getRealAmount("6")) %>
			</td>
			<td valign="top" class="tableHeaderCellSecondRow amount borderLeft borderBottomBl" style="font-size: 9pt; font-weight: bold;">
				<%=ds.toString(ds.getDifference("6")) %>
			</td>
			<td valign="top" class="tableHeaderCellSecondRow amount borderLeft borderBottomBl borderRight" style="font-size: 9pt; font-weight: bold;">
				<%=ds.toString(ds.getPercentage("6")) %>
			</td>
		</tr>
	</tbody>
</table>
</td>
<td style="width:2%;">&nbsp;</td>
<td style="width:49%;" valign="top">
<table border="0" cellspacing="0" cellpadding="2" width="100%" style="font: 9.5pt 'Arial;border-bottom-width: 0.5pt;border-bottom-style:solid;border-bottom-color:#000000;">
	<thead>
		<tr>
			<th style="width: 4%;height:0;">
				&nbsp;
			</th>
			<th style="width: 30%;height:0;">
				&nbsp;
			</th>
			<th style="width: 10%;height:0;">
				&nbsp;
			</th>
			<th style="width: 15%;height:0;">
				&nbsp;
			</th>
			<th style="width: 15%;height:0;">
				&nbsp;
			</th>
			<th style="width: 15%;height:0;">
				&nbsp;
			</th>
			<th style="width: 11%;height:0;">
				&nbsp;
			</th>
		</tr>
	</thead>
	<tbody style="border: 0;">
	<tr>
		<td valign="top" class="tableHeaderCellSecondRow centered borderLeft borderBottom">
			&nbsp;
		</td>
		<td colspan="2" valign="top" class="tableHeaderCellSecondRow borderBottom italic" style="font-size: 10pt; font-weight: bold; text-align: left;">
			Total produits
		</td>
		<td valign="top" class="tableHeaderCellSecondRow whiteBack amount borderLeft borderBottom" style="font-size: 9pt; font-weight: bold;">
			<%=dsProduits.toString(dsProduits.getBudgetAmount("7")) %>
		</td>
		<td valign="top" class="tableHeaderCellSecondRow whiteBack amount borderLeft borderBottom"  style="font-size: 9pt; font-weight: bold;">
			<%=dsProduits.toString(dsProduits.getRealAmount("7")) %>
		</td>
		<td valign="top" class="tableHeaderCellSecondRow whiteBack amount borderLeft borderBottom" style="font-size: 9pt; font-weight: bold;">
			<%=dsProduits.toString(dsProduits.getDifference("7")) %>
		</td>
		<td valign="top" class="tableHeaderCellSecondRow whiteBack amount borderLeft borderBottom borderRight" style="font-size: 9pt; font-weight: bold;">
			<%=dsProduits.toString(dsProduits.getPercentage("7")) %>
		</td>
	</tr>
	<tr>
		<td valign="top" class="tableHeaderCellSecondRow centered borderLeft borderBottomBl">
			&nbsp;
		</td>
		<td colspan="2" valign="top" class="tableHeaderCellSecondRow borderBottomBl italic" style="font-size: 10pt; font-weight: bold;text-align: left;">
			Résultat
		</td>
		<td valign="top" class="tableHeaderCellSecondRow whiteBack amount borderLeft borderBottomBl" style="font-size: 9pt; font-weight: bold;">
			<%=dsProduits.toString(dsProduits.getBudgetAmount("7") - ds.getBudgetAmount("6")) %>
		</td>
		<td valign="top" class="tableHeaderCellSecondRow whiteBack amount borderLeft borderBottomBl"  style="font-size: 9pt; font-weight: bold;">
			<%=dsProduits.toString(dsProduits.getRealAmount("7") - ds.getRealAmount("6")) %>
		</td>
		<td valign="top" class="tableHeaderCellSecondRow whiteBack amount borderLeft borderBottomBl" style="font-size: 9pt; font-weight: bold;">
			<%=dsProduits.toString(dsProduits.getDifference("7") - ds.getDifference("6")) %>
		</td>
		<td valign="top" class="tableHeaderCellSecondRow whiteBack amount borderLeft borderBottomBl borderRight" style="font-size: 9pt; font-weight: bold;">
			&nbsp;
		</td>
	</tr>
	</tbody>
</table>
</td>
</tr>
</table>
</body>
</html>