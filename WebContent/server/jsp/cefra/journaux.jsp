<%@page import="eu.agileeng.util.AEDateUtil"%>
<%@page import="eu.agileeng.domain.acc.AccJournalResultsList"%>
<%@page import="java.util.Iterator" %>
<%@page import="eu.agileeng.domain.cefra.n11580_03.JournauxDataSource"%>
<%@page import="eu.agileeng.domain.acc.AccJournalResult"%>
<%@page import="org.joda.time.DateMidnight"%>
<%@page import="java.util.Map" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<%
	JournauxDataSource ds =(JournauxDataSource) request.getAttribute("journauxDataSource");
	%>
<html>
<head><meta charset="UTF-8"></meta></head>
<body>
<p style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px;">Journaux</p>
<table border="0" cellspacing="0" cellpadding="0" width="700px" style="margin-bottom: 10px;">
	<tr>
		<td style="text-align: center; font-size: 14px;">
			Paroisse: <b><%=ds.getCustomerName() %></b> Code paroisse: <b><%=ds.getCustomerCode() %></b>
		</td>
	</tr>
	<tr>
		<td style="text-align: center; font-size: 14px;">
			Periode: <b><%=ds.getPeriodAsString() %></b> Journal: <b><%=ds.getAccJournalCode() %></b>
		</td>
	</tr>
</table>


<table border="0" cellspacing="0" cellpadding="2" width="700px">
	<thead>
		<tr class="tableHeaderSecondRow">
			<th style="width: 11%;" class="tableHeaderCellSecondRow borderLeft">
				Date
			</th>
			<th style="width: 5%;" class="tableHeaderCellSecondRow borderLeft">
				Journal
			</th>
			<th style="width: 23%;" class="tableHeaderCellSecondRow borderLeft">
				Compte
			</th>
			<th style="width: 12%;" class="tableHeaderCellSecondRow borderLeft">
				Débit
			</th>
			<th style="width: 12%;" class="tableHeaderCellSecondRow borderLeft">
				Crédit
			</th>
			<th style="width: 32%;" class="tableHeaderCellSecondRow borderLeft">
				Commentaire
			</th>
			<!-- <th style="width: 15%;" class="tableHeaderCellSecondRow">
				<b style="font-size: 10pt">D</b>onateur/
				<p><b style="font-size: 10pt">F</b>ournisseur</p>
			</th> -->
			<th style="width: 5%;" class="tableHeaderCellSecondRow borderLeft borderRight">
				Code
				<p>Quete</p>
			</th>
		</tr>
	</thead>
	<tbody style="border: 0;">
	<%
		Map<String, Map<DateMidnight, AccJournalResultsList>> ajrm = ds.getAccJournalResultsMap();
		if(ajrm != null){
		Iterator<Map.Entry<String,Map<DateMidnight,AccJournalResultsList>>> i = ajrm.entrySet().iterator();
		while(i.hasNext()){
			//start of a journal
			Map.Entry<String,Map<DateMidnight,AccJournalResultsList>> journal = i.next();
			String journalTotalTitle = "Total " + journal.getKey();
			Iterator<Map.Entry<DateMidnight,AccJournalResultsList>> j = journal.getValue().entrySet().iterator();
			while(j.hasNext()){
				Map.Entry<DateMidnight,AccJournalResultsList> month = j.next();
				Iterator<AccJournalResult> k = month.getValue().iterator();
				int counter = 0;
				String monthTotalTitle = AEDateUtil.format(month.getKey().toDate(), AEDateUtil.MONTH_YEAR_FORMAT); 
				String journalCode = null;
				while(k.hasNext()){
					AccJournalResult entry = k.next();
					if(journalCode == null){
						journalCode = JournauxDataSource.getJournal(entry);
					} else if (!journalCode.equals(JournauxDataSource.getJournal(entry))){
						journalCode = JournauxDataSource.getJournal(entry);
					}
					String rowStyle = "";
					if((counter++ & 1) != 0){
						rowStyle = " style=\"background-color: #dddddd;\"";
					}
					%>
						<tr<%=rowStyle%>>
							<td valign="top" class="simpleEntryCell">
								<%=JournauxDataSource.getDate(entry) %>
							</td>
							<td valign="top" class="simpleEntryCellCenter">
								<%=JournauxDataSource.getJournal(entry) %>
							</td>
							<td valign="top" class="simpleEntryCell">
								<%=JournauxDataSource.getAccount(entry) %>
							</td>
							<td valign="top" class="simpleEntryCellAmount">
								<%=JournauxDataSource.getDebitAmount(entry) %>
							</td>
							<td valign="top" class="simpleEntryCellAmount">
								<%=JournauxDataSource.getCreditAmount(entry) %>
							</td>
							<td valign="top" class="simpleEntryCell">
								<%=JournauxDataSource.getDescription(entry) %>
							</td>
							<%-- <td valign="top" class="simpleEntryCell">
								<%
									if("".equals(JournauxDataSource.getSupplier(entry)) && !"".equals(JournauxDataSource.getDonateur(entry))){
										out.print("<b>D: </b>" + JournauxDataSource.getDonateur(entry));
									} else if ("".equals(JournauxDataSource.getDonateur(entry)) && !"".equals(JournauxDataSource.getSupplier(entry))){
										out.print("<b>F: </b>" + JournauxDataSource.getSupplier(entry));
									}
								%>
							</td> --%>
							<td valign="top" class="simpleEntryCellCenter borderRight">
								<%=JournauxDataSource.getCodeQuete(entry) %>
							</td>
						</tr>
					<%
				}
				%>
					<tr class="sumRow">
						<td class="sumCell" style="text-align:left;"><%=monthTotalTitle%></td>
						<td class="sumCell" style="text-align:center;"><%=journalCode %></td>
						<td class="sumCellTitle"></td>
						<td class="sumCell"><%=JournauxDataSource.getTotalDebitAmountForMonth(month.getValue()) %></td>
						<td class="sumCell"><%=JournauxDataSource.getTotalCreditAmountForMonth(month.getValue()) %></td>
						<td class="sumCell"></td>
						<!-- <td class="sumCell"></td> -->
						<td class="sumCell borderRight"></td>
					</tr>
				<%
			}
			%>
			<%-- <tr class="sumRow">
				<td class="sumCell"></td>
				<td class="sumCell"></td>
				<td class="sumCellTitle"><%=journalTotalTitle %></td>
				<td class="sumCell"><%=JournauxDataSource.getTotalCreditAmountForJournal(journal.getValue())%></td>
				<td class="sumCell"><%=JournauxDataSource.getTotalCreditAmountForJournal(journal.getValue()) %></td>
				<td class="sumCell"></td>
				<td class="sumCell"></td>
				<td class="sumCell"></td>
			</tr> --%>
		<%
		}		
	%>
		<tr class="sumRow">
				<td class="sumCell"></td>
				<td class="sumCell"></td>
				<td class="sumCellTitle" style="text-align:left;"><%="Total"%></td>
				<td class="sumCell"><%=JournauxDataSource.getTotalCreditAmountForReport(ds.getAccJournalResultsList()) %></td>
				<td class="sumCell"><%=JournauxDataSource.getTotalCreditAmountForReport(ds.getAccJournalResultsList()) %></td>
				<td class="sumCell"></td>
				<!-- <td class="sumCell"></td> -->
				<td class="sumCell borderRight"></td>
			</tr>
		<tr class="tableHeaderSecondRow">
			<td class="tableHeaderCellSecondRow"></td>
			<td class="tableHeaderCellSecondRow"></td>
			<td class="tableHeaderCellSecondRow"></td>
			<td class="tableHeaderCellSecondRow"></td>
			<td class="tableHeaderCellSecondRow"></td>
			<td class="tableHeaderCellSecondRow"></td>
			<!-- <td class="tableHeaderCellSecondRow"></td> -->
			<td class="tableHeaderCellSecondRow"></td>
		</tr>
		<%} %>
	</tbody>
</table>
</body>
</html>