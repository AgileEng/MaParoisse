<%@page import="org.apache.tomcat.util.json.JSONObject"%>
<%@page import="org.apache.tomcat.util.json.JSONArray"%>
<%@page import="eu.agileeng.util.AEMath"%>
<%@page import="eu.agileeng.util.AEDateUtil"%>
<%@page import="eu.agileeng.domain.cefra.n11580_03.FinancesDataSource"%>
<%@page import="java.util.Date" %>
<%@page import="eu.agileeng.domain.cefra.n11580_03.ReportDataSource" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<%
	FinancesDataSource ds =(FinancesDataSource) request.getAttribute("financesDataSource");
	JSONArray banks = ds.getBanks();
	JSONArray titres = ds.getTitres();
	JSONArray engagements = ds.getEngagements();
	JSONObject cashDesk = ds.getCashDesk();
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
			<p style="text-align: left; font-size: 11pt; margin-bottom:7px;">Nom de la paroisse : </p>
		</td>
		<td colspan="2">
			<p style="text-align: left; font-size: 11pt;"><%=ds.getCustomerName() %></p>
		</td>
	</tr>
	<tr>
		<td>&nbsp;</td>
		<td>
			<p style="text-align: left; font-size: 11pt;">Annexe </p>
		</td>
		<td colspan="2">
			&nbsp;
		</td>
	</tr>
</table>
<p style="text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 10px;">DÉTAIL DES COMPTES FINANCIERS</p>
<table border="0" cellspacing="0" cellpadding="0" width="700px" style="margin-bottom: 10px;">
	<tr style="width:80%">
		<td style="text-align: center; font-size: 14px;">&nbsp;</td>
	</tr>
	<tr>
		<td style="width:20%;text-align: right; font-size: 14px;">
			année: <b><%=ds.getYear()%></b> 
		</td>
	</tr>
</table>

<p class="startingParagraph">Les sommes inscrites à la page 4 aux comptes 512 Banques doivent correspondre aux soldes des derniers extraits bancaires ou postaux de l'exercice.</p>
<p class="startingParagraph">La somme inscrite au compte 53 Caisse doit correspondre au solde du compte Caisse tenu par la Fabrique et à l'avoir en argent liquide détenu par la Fabrique en fin d'exercice.</p>
<p class="startingParagraph">Les extraits de comptes (et les livrets bancaires s'il y a lieu), ainsi que le compte Caisse, doivent être présentés, à l'appui, par le trésorier aux membres du Conseil de Fabrique.</p>
<p class="startingParagraph">Les références et les soldes de ces divers comptes sont à indiquer ci-dessous.</p>

<p class="tableTitleParagraph">COMPTES DE TRÉSORERIE</p>
<table border="0" cellspacing="0" cellpadding="2" width="700px" style="font: 9.5pt 'Arial;border-bottom-width: 0.5pt;border-bottom-style:solid;border-bottom-color:#000000;">
	<thead>
		<tr>
			<th style="width: 25%;height:0;">
				&nbsp;
			</th>
			<th style="width: 35%;height:0;">
				&nbsp;
			</th>
			<th style="width: 14%;height:0;">
				&nbsp;
			</th>
			<th style="width: 13%;height:0;">
				&nbsp;
			</th>
			<th style="width: 13%;height:0;">
				&nbsp;
			</th>
		</tr>
		<tr class="tableHeaderSecondRow">
			<th class="tableHeaderCell borderLeft">
				N° des comptes
			</th>
			<th class="tableHeaderCell borderLeft">
				Nom de la Banque ou C.C.P.
			</th>
			<th class="tableHeaderCell borderLeft">
				Date de l'extrait
			</th>
			<th class="tableHeaderCell borderLeft">
				Solde
			</th>
			<th class="tableHeaderCell borderLeft borderRight">
				Solde de l'extrait
			</th>
		</tr>
	</thead>
	<tbody style="border: 0;">
		<%for(int i = 0; i < banks.length(); i++) { 
			JSONObject bank = banks.getJSONObject(i);
		%>
		<tr>
			<td class="tableEntryCell borderLeft center">
				<%=bank.optString("accCode", "")%>
			</td>
			<td class="tableEntryCell borderLeft">
				&nbsp;<%=bank.optString("name", "")%>
			</td>
			<td class="tableEntryCell borderLeft center">
				&nbsp;<%=bank.optString("lastStatementDate", "")%>
			</td>
			<td class="tableEntryCell borderLeft amount">
				<%=AEMath.toAmountFrenchString(bank.optDouble("accBalance", 0.0))%>&nbsp;
			</td>
			<td class="tableEntryCell borderLeft borderRight amount">
				<%=AEMath.toAmountFrenchString(bank.optDouble("lastStatementBalance", 0.0))%>&nbsp;
			</td>
		</tr>
		<%} %>
		<tr>
			<td colspan="4" class="tableEntryCell borderLeft">
				&nbsp;Solde du compte Caisse au 31/12/<%=ds.getYear() %> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(argent liquide en caisse)
			</td>
			<td class="tableEntryCell borderLeft borderRight amount">
				<%=AEMath.toAmountFrenchString(cashDesk.optDouble("accBalance", 0.0))%>&nbsp;
			</td>
		</tr>
		<tr>
			<td colspan="4" class="tableTotalCell borderLeft amount">
				CUMUL DES COMPTES DE TRÉSORERIE&nbsp;
			</td>
			<td class="tableTotalCell borderLeft borderRight amount">
				<%=AEMath.toAmountFrenchString(ds.getLastCashBalance())%>&nbsp;
			</td>
		</tr>
	</tbody>
</table>

<p class="tableTitleParagraph">TITRES DE PLACEMENT</p>
<table border="0" cellspacing="0" cellpadding="2" width="700px" style="font: 9.5pt 'Arial;border-bottom-width: 0.5pt;border-bottom-style:solid;border-bottom-color:#000000;">
	<thead>
		<tr>
			<th style="width: 45%;height:0;">
				&nbsp;
			</th>
			<th style="width: 20%;height:0;">
				&nbsp;
			</th>
			<th style="width: 35%;height:0;">
				&nbsp;
			</th>
		</tr>
		<tr class="tableHeaderSecondRow">
			<th class="tableHeaderCell borderLeft">
				Dénomination des titres
			</th>
			<th class="tableHeaderCell borderLeft">
				Quantité
			</th>
			<th class="tableHeaderCell borderLeft borderRight">
				Prix de revient<p style="font: 8pt 'Arial';">( ne pas indiquer la valeur de rachat)</p>
			</th>
		</tr>
	</thead>
	<tbody style="border: 0;">
		<%for(int i = 0; i < titres.length(); i++) { 
			JSONObject titre = titres.getJSONObject(i);
		%>
		<tr>
			<td class="tableEntryCell borderLeft">
				&nbsp;<%=titre.optString("description", "") %>
			</td>
			<td class="tableEntryCell borderLeft center">
				<%=titre.optString("qty", "") %>
			</td>
			<td class="tableEntryCell borderLeft borderRight amount">
				<%=AEMath.toAmountFrenchString(titre.optDouble("price", 0.0)) %>&nbsp;
			</td>
		</tr>
		<%} %>
		<tr>
			<td colspan="2" class="tableTotalCell borderLeft amount">
				CUMUL DES TITRES DE PLACEMENT&nbsp;
			</td>
			<td class="tableTotalCell borderLeft borderRight amount">
				<%=AEMath.toAmountFrenchString(ds.getTitresSum()) %>&nbsp;
			</td>
		</tr>
	</tbody>
</table>

<p class="tableTitleParagraph">EMPRUNTS ET ENGAGEMENTS</p>
<table border="0" cellspacing="0" cellpadding="2" width="700px" style="font: 9.5pt 'Arial;border-bottom-width: 0.5pt;border-bottom-style:solid;border-bottom-color:#000000;">
	<thead>
		<tr>
			<th style="width: 25%;height:0;">
				&nbsp;
			</th>
			<th style="width: 15%;height:0;">
				&nbsp;
			</th>
			<th style="width: 25%;height:0;">
				&nbsp;
			</th>
			<th style="width: 11%;height:0;">
				&nbsp;
			</th>
			<th style="width: 12%;height:0;">
				&nbsp;
			</th>
			<th style="width: 12%;height:0;">
				&nbsp;
			</th>
		</tr>
		<tr class="tableHeaderSecondRow">
			<th class="tableHeaderCell borderLeft borderBottom">
				Nom de l'organisme financier
			</th>
			<th class="tableHeaderCell borderLeft borderBottom">
				Montant initial emprunté
			</th>
			<th class="tableHeaderCell borderLeft borderBottom">
				Date du prêt
			</th>
			<th class="tableHeaderCell borderLeft borderBottom">
				Durée du prêt
			</th>
			<th class="tableHeaderCell borderLeft borderBottom">
				Montant échéance annuelle
			</th>
			<th class="tableHeaderCell borderLeft borderRight borderBottom">
				Montant échéance mensuelle
			</th>
		</tr>
	</thead>
	<tbody style="border: 0;">
		<%for(int i = 0; i < engagements.length(); i++) { 
			JSONObject engagement = engagements.getJSONObject(i);
		%>
		<tr>
			<td class="tableEntryCell borderLeft borderBottom">
				&nbsp;<%=engagement.optString("name", "") %>
			</td>
			<td class="tableEntryCell borderLeft amount borderBottom">
				<%=AEMath.toAmountFrenchString(engagement.optDouble("amountInitial", 0.0)) %>&nbsp;
			</td>
			<td class="tableEntryCell borderLeft center borderBottom">
				<%=AEDateUtil.formatToFrench(AEDateUtil.parseDate(engagement.optString("date", ""))) %>
			</td>
			<td class="tableEntryCell borderLeft center borderBottom">
				<%=engagement.optString("duration", "") %>
			</td>
			<td class="tableEntryCell borderLeft amount borderBottom">
				<%=AEMath.toAmountFrenchString(engagement.optDouble("amountDueYearly", 0.0)) %>&nbsp;
			</td>
			<td class="tableEntryCell borderLeft borderRight amount borderBottom">
				<%=AEMath.toAmountFrenchString(engagement.optDouble("amountDueMonthly", 0.0)) %>&nbsp;
			</td>
		</tr>
		<%} %>
	</tbody>
</table>
</body>
</html>