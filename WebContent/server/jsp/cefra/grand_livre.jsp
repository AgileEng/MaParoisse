<%@page import="eu.agileeng.util.AEStringUtil"%>
<%@page import="eu.agileeng.domain.cefra.n11580_03.GrandLivreDataSource"%>
<%@page import="eu.agileeng.domain.acc.AccJournalResultsList"%>
<%@page import="java.util.Iterator" %>
<%@page import="java.util.List" %>
<%@page import="eu.agileeng.domain.acc.AccJournalResult"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<%
	GrandLivreDataSource ds =(GrandLivreDataSource) request.getAttribute("grandLivreDataSource");
	String accountSpan = "";
	if((AEStringUtil.EMPTY_STRING.equals(ds.getFromAccountCode()) 
			&& AEStringUtil.EMPTY_STRING.equals(ds.getToAccountCode())) || 
			(ds.getFromAccountCode() == null && ds.getToAccountCode() == null)){
		accountSpan = "Tous";
	} else {
		accountSpan = ds.getFromAccountCode() + " - " + ds.getToAccountCode();
	}
	%>
<html>
<head><meta charset="UTF-8"></meta></head>
<body>
<p style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px;">Grand-Livre</p>
<table border="0" cellspacing="0" cellpadding="0" width="700px" style="margin-bottom: 10px;">
	<tr>
		<td style="text-align: center; font-size: 14px;">
			Paroisse: <b><%=ds.getCustomerName() %></b> Code paroisse: <b><%=ds.getCustomerCode() %></b>
		</td>
	</tr>
	<tr>
		<td style="text-align: center; font-size: 14px;">
			Periode: <b><%=ds.getPeriodAsStringShort() %></b> Compte: <b><%=accountSpan %></b>
		</td>
	</tr>
</table>


<table border="0" cellspacing="0" cellpadding="0" width="700px">
	<thead>
		<tr class="tableHeaderSecondRow">
			<th style="width: 11%;" class="tableHeaderCellSecondRow borderLeft">
				<b class="headerP">Date</b>
			</th>
			<th style="width: 7%;" class="tableHeaderCellSecondRow borderLeft">
				<b class="headerP">Journal</b>
			</th>
			<th style="width: 26%;" class="tableHeaderCellSecondRow borderLeft">
				<b class="headerP">Compte</b>
			</th>
			<th style="width: 26%;" class="tableHeaderCellSecondRow borderLeft">
				<b class="headerP">Commentaire</b>
			</th>
			<th style="width: 10%;" class="tableHeaderCellSecondRow borderLeft">
				<b class="headerP">Débit</b>
			</th>
			<th style="width: 10%;" class="tableHeaderCellSecondRow borderLeft">
				<b class="headerP">Crédit</b>
			</th>
			<th style="width: 10%;" class="tableHeaderCellSecondRow borderLeft borderRight">
				<b class="headerP">Solde</b>
			</th>
		</tr>
	</thead>
	<tbody style="border: 0;">
		<tr>
			<td colspan="7">
			
			<%
				List<String> accList = ds.getAccountsList();
				Iterator<String> it = accList.iterator();
				while(it.hasNext()){
					String accCode = it.next();
					int iterationCount = 0;
					if(!ds.hasToBeShown(accCode)) {
						continue;
					}
			%>		

					<!-- 
						Put the whole group  
					-->
					<table class="innerTable" border="0" cellspacing="0" cellpadding="2" width="700px">
					<tbody style="border: 0;">
					<tr>
						<td style="width: 11%;"></td>
						<td style="width: 7%;"></td>
						<td style="width: 26%;"></td>
						<td style="width: 26%;"></td>
						<td style="width: 10%;"></td>
						<td style="width: 10%;"></td>
						<td style="width: 10%;"></td>
					</tr>
					
					<!--
						A group title table row
				 	-->
					<tr>
						<td class="groupTitleCell topBorder bottomBorder leftBorder"></td>
						<td class="groupTitleCell topBorder bottomBorder"></td>
						<td class="groupTitleCell topBorder bottomBorder" colspan="4"><%=accCode %></td>
						<!-- <td class="groupTitleCell"></td>
						<td class="groupTitleCell"></td>
						<td class="groupTitleCell"></td> -->
						<td class="groupTitleCell topBorder bottomBorder rightBorder"></td>
					</tr>
					
					<!--
						An initial balance table row
				 	-->
				 	<%if(!("6".equals(accCode.substring(0, 1)) || "7".equals(accCode.substring(0, 1)))) { %>
					<tr>
						<td class="initialBalanceCell" style="border-left-width: 0.5pt;border-left-style: solid;border-left-color: #000000;border-right-width: 0.5pt;border-right-style: solid;border-right-color: #000000;"></td>
						<td class="initialBalanceCell" style="border-right-width: 0.5pt;border-right-style: solid;border-right-color: #000000;"></td>
						<td class="initialBalanceCell">Total des A-Nouveaux</td>
						<td class="startDateBalanceCell leftBorder" style="border-right-width: 0.5pt;border-right-style: solid;border-right-color: #000000;">Cumul au <%=ds.getStartDate()%></td>
						<td class="initialBalanceCellAmount" style="border-right-width: 0.5pt;border-right-style: solid;border-right-color: #000000;"><%=ds.getDebitAmount(accCode, 1) %></td>
						<td class="initialBalanceCellAmount" style="border-right-width: 0.5pt;border-right-style: solid;border-right-color: #000000;"><%=ds.getCreditAmount(accCode, 1)%></td>
						<td class="initialBalanceCellAmount" style="border-right-width: 0.5pt;border-right-style: solid;border-right-color: #000000;"><%=ds.getBalance(accCode, 1)%></td>
					</tr>
					<%} %>
					
					<!--
						Iterate through the list of financial operations for the current account
						Be carefull: check for null, i.e. there are not operations
				 	-->
					<%
					AccJournalResultsList ajrl = ds.getAccJournalResultsList(accCode);
					if(ajrl != null) {
						Iterator<AccJournalResult> resultsIterator = ajrl.iterator();
						while(resultsIterator.hasNext()){
							AccJournalResult ajr = resultsIterator.next();
							if(!AEStringUtil.EMPTY_STRING.equals(GrandLivreDataSource.getDebitAmount(ajr)) || !AEStringUtil.EMPTY_STRING.equals(GrandLivreDataSource.getCreditAmount(ajr))) {
					%>
								<!-- 
									A table row for displaying a single financial movement(operation?)
								 -->
								<tr>
									<td valign="top" class="simpleEntryCell" style="border-left-width: 0.5pt;border-left-style: solid;border-left-color: #000000;border-right-width: 0.5pt;border-right-style: solid;border-right-color: #000000;"><%=GrandLivreDataSource.getDate(ajr)%></td>
									<td valign="top" class="simpleEntryCell" style="border-right-width: 0.5pt;border-right-style: solid;border-right-color: #000000;"><%=GrandLivreDataSource.getJournal(ajr)%></td>
									<td valign="top" class="simpleEntryCell"><%=GrandLivreDataSource.getAccount(ajr)%></td>
									<td valign="top" class="simpleEntryCell leftBorder" style="border-right-width: 0.5pt;border-right-style: solid;border-right-color: #000000;"><%=GrandLivreDataSource.getDescription(ajr)%></td>
									<td valign="top" class="simpleEntryCellAmount"><%=GrandLivreDataSource.getDebitAmount(ajr)%></td>
									<td valign="top" class="simpleEntryCellAmount"><%=GrandLivreDataSource.getCreditAmount(ajr)%></td>
									<td valign="top" class="simpleEntryCellAmount"><%=GrandLivreDataSource.getBalance(ajr)%></td>
								</tr>
					<%
							}
						}
					}
					%>
					
					<!-- 
						A total balance table row 
					-->		
					<tr>
						<td valign="top" class="totalBalanceCell topBorder" style="border-left-width: 0.5pt;border-left-style: solid;border-left-color: #000000;border-right-width: 0.5pt;border-right-style: solid;border-right-color: #000000;"></td>
						<td valign="top" class="totalBalanceCell topBorder" style="border-right-width: 0.5pt;border-right-style: solid;border-right-color: #000000;"></td>
						<td valign="top" class="totalBalanceCell topBorder" colspan="2" style="border-right-width: 0.5pt;border-right-style: solid;border-right-color: #000000;">Total du compte <%=accCode %></td>
						<!-- <td valign="top" class="totalBalanceCell"></td> -->
						<td valign="top" class="totalBalanceCellAmount topBorder"><%=ds.getDebitAmount(accCode, 3) %></td>
						<td valign="top" class="totalBalanceCellAmount topBorder"><%=ds.getCreditAmount(accCode, 3) %></td>
						<td valign="top" class="totalBalanceCellAmount topBorder"><%=ds.getBalance(accCode, 3) %></td>
					</tr>
					
					</tbody>
					</table>
					
					<!-- 
						A new paragraph to visually separate the displayed information for each individual account 
					-->
					<p>&nbsp;</p>
			<%	
				}
			%>
			</td>
		</tr>
	</tbody>
</table>
</body>
</html>