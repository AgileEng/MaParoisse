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
			<p style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px;">CHARGES</p>
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
				DÉBIT: CHARGES
			</th>
			<th style="width: 13%;" class="tableHeaderCellSecondRow">
				&nbsp;
			</th>
			<th style="width: 14%;" class="tableHeaderCellSecondRow borderLeft">
				Charges au budget
			</th>
			<th style="width: 13%;" class="tableHeaderCellSecondRow borderLeft">
				Charges de l'année
			</th>
			<th style="width: 13%;" class="tableHeaderCellSecondRow borderLeft borderRight">
				Prévisions année <%=Integer.toString(ds.getYear()+1) %>
			</th>
		</tr>
	</thead>
	<tbody style="border: 0;">
	<%
	for(int accCodeInt = 6010; accCodeInt < 6100; accCodeInt++){
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
	if(ds.hasData("60")){
		%>
		<tr>
			<td valign="top" class="totalEntryCell borderLeft">
				60
			</td>
			<td valign="top" class="totalEntryCell">
				Achats articles de culte et fournitures
			</td>
			<td valign="top" class="totalEntryCell amount">
				s / Total
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getBudgetAmount("60")) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getRealAmount("60")) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft borderRight">
				<%=ds.toString(ds.getEstimatedAmount("60")) %>
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
	for(int accCodeInt = 610; accCodeInt < 620; accCodeInt++){
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
	if(ds.hasData("61")){
		%>
			<tr>
			<td valign="top" class="totalEntryCell borderLeft">
				61
			</td>
			<td valign="top" class="totalEntryCell">
				 Services extérieurs
			</td>
			<td valign="top" class="totalEntryCell amount">
				s / Total
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getBudgetAmount("61")) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getRealAmount("61")) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft borderRight">
				<%=ds.toString(ds.getEstimatedAmount("61")) %>
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
	for(int accCodeInt = 620; accCodeInt < 630; accCodeInt++){
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
	if(ds.hasData("62")){
		%>
			<tr>
			<td valign="top" class="totalEntryCell borderLeft">
				62
			</td>
			<td valign="top" class="totalEntryCell">
				Autres services extérieurs
			</td>
			<td valign="top" class="totalEntryCell amount">
				s / Total
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getBudgetAmount("62")) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getRealAmount("62")) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft borderRight">
				<%=ds.toString(ds.getEstimatedAmount("62")) %>
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
	for(int accCodeInt = 630; accCodeInt < 640; accCodeInt++){
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
	if(ds.hasData("63")){
		%>
			<tr>
			<td valign="top" class="totalEntryCell borderLeft">
				63
			</td>
			<td valign="top" class="totalEntryCell">
				 Impôts et taxes
			</td>
			<td valign="top" class="totalEntryCell amount">
				s / Total
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getBudgetAmount("63")) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getRealAmount("63")) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft borderRight">
				<%=ds.toString(ds.getEstimatedAmount("63")) %>
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
	for(int accCodeInt = 640; accCodeInt < 650; accCodeInt++){
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
	if(ds.hasData("64")){
		%>
			<tr>
			<td valign="top" class="totalEntryCell borderLeft">
				64
			</td>
			<td valign="top" class="totalEntryCell">
				Charges de personnel
			</td>
			<td valign="top" class="totalEntryCell amount">
				s / Total
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getBudgetAmount("64")) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getRealAmount("64")) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft borderRight">
				<%=ds.toString(ds.getEstimatedAmount("64")) %>
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
	for(int accCodeInt = 650; accCodeInt < 660; accCodeInt++){
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
	if(ds.hasData("65")){
		%>
			<tr>
			<td valign="top" class="totalEntryCell borderLeft">
				65
			</td>
			<td valign="top" class="totalEntryCell">
				Contribution au Fonds pastoral
			</td>
			<td valign="top" class="totalEntryCell amount">
				s / Total
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getBudgetAmount("65")) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getRealAmount("65")) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft borderRight">
				<%=ds.toString(ds.getEstimatedAmount("65")) %>
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
	for(int accCodeInt = 660; accCodeInt < 670; accCodeInt++){
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
	if(ds.hasData("66")){
		%>
			<tr>
			<td valign="top" class="totalEntryCell borderLeft">
				66
			</td>
			<td valign="top" class="totalEntryCell">
				Charges financières
			</td>
			<td valign="top" class="totalEntryCell amount">
				s / Total
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getBudgetAmount("66")) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getRealAmount("66")) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft borderRight">
				<%=ds.toString(ds.getEstimatedAmount("66")) %>
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
	for(int accCodeInt = 670; accCodeInt < 680; accCodeInt++){
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
	if(ds.hasData("67")){
		%>
			<tr>
			<td valign="top" class="totalEntryCell borderLeft">
				67
			</td>
			<td valign="top" class="totalEntryCell">
				Charges exceptionnelles
			</td>
			<td valign="top" class="totalEntryCell amount">
				s / Total
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getBudgetAmount("67")) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getRealAmount("67")) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft borderRight">
				<%=ds.toString(ds.getEstimatedAmount("67")) %>
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
	for(int accCodeInt = 680; accCodeInt < 690; accCodeInt++){
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
	for(int accCodeInt = 6810; accCodeInt < 6820; accCodeInt++){
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
	if(ds.hasData("68")){
		%>
		<tr>
			<td valign="top" class="totalEntryCell borderLeft">
				68
			</td>
			<td valign="top" class="totalEntryCell">
				Dotations aux amortiss. et provisions
			</td>
			<td valign="top" class="totalEntryCell amount">
				s / Total
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getBudgetAmount("68")) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft">
				<%=ds.toString(ds.getRealAmount("68")) %>
			</td>
			<td valign="top" class="totalEntryCell amount borderLeft borderRight">
				<%=ds.toString(ds.getEstimatedAmount("68")) %>
			</td>
		</tr>
		<%
	}
	%>
	<tr>
		<td valign="center" colspan="3" class="totalEntryCell borderLeft" style="font: 11pt 'Arial'; text-align: 'center';height: 30px;">
			TOTAL DES CHARGES
		</td>
		<td valign="center" class="totalEntryCell amount borderLeft" style="font: 11pt 'Arial';">
			<%=ds.toString(ds.getBudgetAmount("6")) %>
		</td>
		<td valign="center" class="totalEntryCell amount borderLeft" style="font: 11pt 'Arial';">
			<%=ds.toString(ds.getRealAmount("6")) %>
		</td>
		<td valign="center" class="totalEntryCell amount borderLeft borderRight" style="font: 11pt 'Arial';">
			<%=ds.toString(ds.getEstimatedAmount("6")) %>
		</td>
	</tr>
	<tr>
		<td valign="top" class="simpleEntryCell centered borderLeft">
			120
		</td>
		<td valign="top" class="simpleEntryCell">
			Excédent de l'exercice
		</td>
		<td valign="top" class="simpleEntryCell">
			
		</td>
		<td valign="top" class="simpleEntryCell amount borderLeft borderBottom">
			<%=ds.toString(ds.getBudgetAmount("120")) %>
		</td>
		<td valign="top" class="simpleEntryCell amount borderLeft borderBottom">
			<%=ds.toString(ds.getRealAmount("120")) %>
		</td>
		<td valign="top" class="simpleEntryCell amount borderLeft borderBottom borderRight">
			<%=ds.toString(ds.getEstimatedAmount("120")) %>
		</td>
	</tr>
	<tr>
		<td valign="center" colspan="3" class="totalEntryCell borderLeft" style="font: 11pt 'Arial'; text-align: 'center';height: 30px;">
			TOTAL GÉNÉRAL
		</td>
		<td valign="center" class="totalEntryCell amount borderLeft" style="font: 11pt 'Arial';">
			<%=ds.toString(ds.getBudgetAmount()) %>
		</td>
		<td valign="center" class="totalEntryCell amount borderLeft" style="font: 11pt 'Arial';">
			<%=ds.toString(ds.getRealAmount()) %>
		</td>
		<td valign="center" class="totalEntryCell amount borderLeft borderRight" style="font: 11pt 'Arial';">
			<%=ds.toString(ds.getEstimatedAmount()) %>
		</td>
	</tr>
	</tbody>
</table>
</body>
</html>