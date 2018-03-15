<%@page import="java.util.LinkedHashMap"%>
<%@page import="java.util.HashMap"%>
<%@page import="eu.agileeng.util.AEMath"%>
<%@page import="eu.agileeng.util.AEDateUtil"%>
<%@page import="eu.agileeng.domain.acc.AccJournalResultsList"%>
<%@page import="java.util.Iterator" %>
<%@page import="eu.agileeng.domain.cefra.n11580_03.BudgetRealizationDataSource"%>
<%@page import="eu.agileeng.domain.acc.AccJournalResult"%>
<%@page import="org.joda.time.DateMidnight"%>
<%@page import="java.util.Map" %>
<%@page import="eu.agileeng.domain.cefra.n11580_03.ReportDataSource" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<%
	BudgetRealizationDataSource ds =(BudgetRealizationDataSource) request.getAttribute("budgetRealizationDataSource");
	LinkedHashMap<String, String> incomeTwoDigitAccounts = new LinkedHashMap<String, String>();
	incomeTwoDigitAccounts.put("70", "Recettes ordinaires");
	incomeTwoDigitAccounts.put("71", "Production stockée (ou déstockage)");
	incomeTwoDigitAccounts.put("72", "Production immobilisée");
	incomeTwoDigitAccounts.put("74", "Subventions de fonctionnement");
	incomeTwoDigitAccounts.put("75", "Produits accessoires");
	incomeTwoDigitAccounts.put("76", "Produits financiers");
	incomeTwoDigitAccounts.put("77", "Recettes  exceptionnelles");
	incomeTwoDigitAccounts.put("78", "Reprise sur provisions");
	incomeTwoDigitAccounts.put("79", "Transfert de charges");
	
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
<p style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px;">COMPTE DE GESTION</p>
<table border="0" cellspacing="0" cellpadding="0" width="700px" style="margin-bottom: 10px;margin-top: 10px;">
	<tr>
		<td style="width: 80%">
			<p style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px;">PRODUITS</p>
		</td>
		<td style="width: 20%">
			<p style="text-align: right;font-size: 9pt'">année : <b><%=ds.getYear() %></b></p>
		</td>
	</tr>
</table>
<table border="0" cellspacing="0" cellpadding="2" width="700px" style="font: 9.5pt 'Arial;border-bottom-width: 0.5pt;border-bottom-style:solid;border-bottom-color:#000000;">
	<thead>
		<tr>
			<th style="width: 7%;height:0;">
				&nbsp;
			</th>
			<th style="width: 40%;height:0;">
				&nbsp;
			</th>
			<th style="width: 13%;height:0;">
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
			<th colspan="2" style="width: 7%;font: 11pt 'Arial'" class="tableHeaderCellSecondRow borderLeft">
				CRÉDIT: PRODUITS
			</th>
			<th style="width: 13%;" class="tableHeaderCellSecondRow">
				&nbsp;
			</th>
			<th style="width: 14%;" class="tableHeaderCellSecondRow borderLeft">
				Produits au budget
			</th>
			<th style="width: 13%;" class="tableHeaderCellSecondRow borderLeft">
				Produits de l'année
			</th>
			<th style="width: 13%;" class="tableHeaderCellSecondRow borderLeft borderRight">
				Prévisions année <%=Integer.toString(ds.getYear()+1) %>
			</th>
		</tr>
	</thead>
	<tbody style="border: 0;">
	<%
	if(ds.hasData("701")){
		%>
		<tr>
			<td valign="top" class="simpleEntryCell centered borderLeft">
				701
			</td>
			<td valign="top" class="simpleEntryCell">
				<%=ds.getName("701") %>
			</td>
			<td valign="top" class="simpleEntryCell amount whiteBack">
				&nbsp;
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft whiteBack">
				<%=ds.toString(ds.getBudgetAmount("701")) %>
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft whiteBack">
				<%=ds.toString(ds.getRealAmount("701")) %>
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft borderRight whiteBack">
				<%=ds.toString(ds.getEstimatedAmount("701")) %>
			</td>
		</tr>
		<%
	}
	for(int accCodeInt = 7010; accCodeInt < 7020; accCodeInt++){
		String accCode = Integer.toString(accCodeInt);
		if(ds.hasData(accCode)) {
	%>
		<tr>
			<td valign="top" class="simpleEntryCell centered borderLeft">
				<%-- <%=accCode %> --%>
			</td>
			<td valign="top" class="simpleEntryCell italic">
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<%=accCode %>&nbsp;&nbsp;<%=ds.getName(accCode) %>
			</td>
			<td valign="top" class="simpleEntryCell">
				
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft borderBottom">
				<%=ds.toString(ds.getBudgetAmount(accCode)) %>
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft borderBottom">
				<%=ds.toString(ds.getRealAmount(accCode)) %>
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft borderBottom borderRight">
				<%=ds.toString(ds.getEstimatedAmount(accCode)) %>
			</td>
		</tr>
	<%	}
	}
	%>
<!-- 	<tr> -->
<!-- 			<td valign="top" class="simpleEntryCell centered borderLeft"> -->
<!-- 				&nbsp; -->
<!-- 			</td> -->
<!-- 			<td valign="top" class="simpleEntryCell"> -->
<!-- 				&nbsp; -->
<!-- 			</td> -->
<!-- 			<td valign="top" class="simpleEntryCell"> -->
<!-- 				&nbsp; -->
<!-- 			</td> -->
<!-- 			<td valign="top" class="simpleEntryCell amount borderLeft"> -->
<!-- 				&nbsp; -->
<!-- 			</td> -->
<!-- 			<td valign="top" class="simpleEntryCell amount borderLeft"> -->
<!-- 				&nbsp; -->
<!-- 			</td> -->
<!-- 			<td valign="top" class="simpleEntryCell amount borderLeft borderRight"> -->
<!-- 				&nbsp; -->
<!-- 			</td> -->
<!-- 		</tr> -->
	<%
	for(int accCodeInt = 702; accCodeInt < 709; accCodeInt++){
		String accCode = Integer.toString(accCodeInt);
		if(ds.hasData(accCode)){
		%>
			<tr>
			<td valign="top" class="simpleEntryCell centered borderLeft">
				<%=accCode %>
			</td>
			<td valign="top" class="simpleEntryCell">
				<%=ds.getName(accCode) %>
			</td>
			<td valign="top" class="simpleEntryCell">
				
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft borderBottom">
				<%=ds.toString(ds.getBudgetAmount(accCode)) %>
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft borderBottom">
				<%=ds.toString(ds.getRealAmount(accCode)) %>
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft borderBottom borderRight">
				<%=ds.toString(ds.getEstimatedAmount(accCode)) %>
			</td>
		</tr>
		<%
		}
	}
	Iterator<Map.Entry<String, String>> it = incomeTwoDigitAccounts.entrySet().iterator();
	while(it.hasNext()){
		Map.Entry<String, String> entry = it.next();
		if(ds.hasData(entry.getKey())){
			%>
			<tr>
			<td valign="top" class="totalEntryCell borderLeft">
				<%=entry.getKey() %>
			</td>
			<td valign="top" class="totalEntryCell">
				<%=entry.getValue() %>
			</td>
			<td valign="top" class="totalEntryCell amount">
				s / Total
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getBudgetAmount(entry.getKey())) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getRealAmount(entry.getKey())) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft borderRight">
				<%=ds.toString(ds.getEstimatedAmount(entry.getKey())) %>
			</td>
		</tr>
		<tr>
			<td valign="top" class="simpleEntryCell centered borderLeft">
				&nbsp;
			</td>
			<td valign="top" class="simpleEntryCell">
				&nbsp;
			</td>
			<td valign="top" class="simpleEntryCell">
				&nbsp;
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft">
				&nbsp;
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft">
				&nbsp;
			</td>
			<td valign="top" class="simpleEntryCell amount borderLeft borderRight">
				&nbsp;
			</td>
		</tr>
		<%
		}
	}
	
	%>
	<tr>
		<td valign="center" colspan="3" class="totalEntryCell borderLeft" style="font: 11pt 'Arial'; text-align: 'center';height: 30px;">
			TOTAL DES PRODUITS
		</td>
		<td valign="center" class="totalEntryCell amount borderLeft" style="font: 11pt 'Arial';">
			<%=ds.toString(ds.getBudgetAmount("7")) %>
		</td>
		<td valign="center" class="totalEntryCell amount borderLeft" style="font: 11pt 'Arial';">
			<%=ds.toString(ds.getRealAmount("7")) %>
		</td>
		<td valign="center" class="totalEntryCell amount borderLeft borderRight" style="font: 11pt 'Arial';">
			<%=ds.toString(ds.getEstimatedAmount("7")) %>
		</td>
	</tr>
	<tr>
		<td valign="top" class="simpleEntryCell centered borderLeft">
			129
		</td>
		<td valign="top" class="simpleEntryCell">
			Déficit de l'exercice
		</td>
		<td valign="top" class="simpleEntryCell">
			
		</td>
		<td valign="top" class="simpleEntryCell amount borderLeft borderBottom">
			<%=ds.toString(ds.getBudgetAmount("129")) %>
		</td>
		<td valign="top" class="simpleEntryCell amount borderLeft borderBottom">
			<%=ds.toString(ds.getRealAmount("129")) %>
		</td>
		<td valign="top" class="simpleEntryCell amount borderLeft borderBottom borderRight">
			<%=ds.toString(ds.getEstimatedAmount("129")) %>
		</td>
	</tr>
	<tr>
		<td valign="middle" colspan="3" class="totalEntryCell borderLeft" style="font: 11pt 'Arial'; text-align: center;height: 30px;">
			TOTAL GÉNÉRAL
		</td>
		<td valign="middle" class="totalEntryCell amount borderLeft" style="font: 11pt 'Arial';">
			<%=ds.toString(ds.getBudgetAmount()) %>
		</td>
		<td valign="middle" class="totalEntryCell amount borderLeft" style="font: 11pt 'Arial';">
			<%=ds.toString(ds.getRealAmount()) %>
		</td>
		<td valign="middle" class="totalEntryCell amount borderLeft borderRight" style="font: 11pt 'Arial';">
			<%=ds.toString(ds.getEstimatedAmount()) %>
		</td>
	</tr>
	</tbody>
</table>
</body>
</html>