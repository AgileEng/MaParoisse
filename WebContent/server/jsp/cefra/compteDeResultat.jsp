<%@page import="eu.agileeng.util.AEDateUtil"%>
<%@page import="eu.agileeng.domain.cefra.n11580_03.CompteDeResultatDataSource"%>
<%@page import="eu.agileeng.util.AEMath"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<%
	CompteDeResultatDataSource ds =(CompteDeResultatDataSource) request.getAttribute("compteDeResultatDataSource");
	%>
<html>
<head><meta charset="UTF-8"></meta></head>
<body>
<p style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px;">Compte de résultat</p>
<table border="0" cellspacing="0" cellpadding="0" width="700px" style="margin-bottom: 10px;">
	<tr>
		<td style="text-align: center; font-size: 14px;">
			Paroisse: <%=ds.getCustomerName() %> Code paroisse: <%=ds.getCustomerCode() %>
		</td>
	</tr>
</table>
<table border="0" cellspacing="0" cellpadding="2" width="700px">
	<thead>
		<tr>
			<th class="tableHeaderCell" colspan="4">
				Charges/Produits
			</th>
			<th class="tableHeaderCell" colspan="2">
				Periode 
				<p><%= ds.getPeriodDatesAsString() %></p>
			</th>
			<th class="tableHeaderCell borderRight" colspan="2">
				Difference
			</th>
		</tr>
		<tr class="tableHeaderSecondRow">
			<th class="tableHeaderCellSecondRow" colspan="4">
			</th>
			<th class="tableHeaderCellSecondRow">
			<%=ds.getCurrentDateYear() %>
			</th>
			<th class="tableHeaderCellSecondRow">
			<%=ds.getPrevousDateYear() %>
			</th>
			<th class="tableHeaderCellSecondRow">
			En valeur
			</th>
			<th class="tableHeaderCellSecondRow borderRight">
			En pourcentage
			</th>
		</tr>
	</thead>
	<tbody style="border: 0;">
		<!-- 
			A table row which contains cells for all possible columns.
			This row will not be visible since it height is 0 but
			it sets the required widths for the cells and makes possible
			the visual indentation of nested data.
		 -->
		<tr>
			<td style="width: 2%; height: 0;"></td>
			<td style="width: 2%; height: 0;"></td>
			<td style="width: 2%; height: 0;"></td>
			<td style="width: 30%; height: 0;"></td>
			<td style="width: 16%; height: 0;"></td>
			<td style="width: 16%; height: 0;"></td>
			<td style="width: 16%; height: 0;"></td>
			<td style="width: 16%; height: 0;"></td>
		</tr>
		
		<!-- Here start to iterate through the data -->
		<% for(int i = 1; i <= 9; i++){
			String currentICode = Integer.toString(i);
			if(ds.hasData(currentICode)){
				/*
					put a title row for the current account
					since this is the body of the first loop
					no indentation is required
				*/
				%>
			<%-- <tr>
				<td class="groupTitleCell" colspan="4">
					<%="Compte code " + currentICode %>
				</td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr> --%>
			<%if (currentICode.equals("7")){ %>
				<tr style="page-break-before: always">
					<th class="tableHeaderCell" colspan="4">
						Charges/Produits
					</th>
					<th class="tableHeaderCell" colspan="2">
						Periode 
						<p><%= ds.getPeriodDatesAsString() %></p>
					</th>
					<th class="tableHeaderCell borderRight" colspan="2">
						Difference
					</th>
				</tr>
				<tr class="tableHeaderSecondRow">
					<th class="tableHeaderCellSecondRow" colspan="4">
					</th>
					<th class="tableHeaderCellSecondRow">
					<%=ds.getCurrentDateYear() %>
					</th>
					<th class="tableHeaderCellSecondRow">
					<%=ds.getPrevousDateYear() %>
					</th>
					<th class="tableHeaderCellSecondRow">
					En valeur
					</th>
					<th class="tableHeaderCellSecondRow borderRight">
					En pourcentage
					</th>
				</tr>
				<tr>
					<td style="width: 2%; height: 0;"></td>
					<td style="width: 2%; height: 0;"></td>
					<td style="width: 2%; height: 0;"></td>
					<td style="width: 30%; height: 0;"></td>
					<td style="width: 16%; height: 0;"></td>
					<td style="width: 16%; height: 0;"></td>
					<td style="width: 16%; height: 0;"></td>
					<td style="width: 16%; height: 0;"></td>
				</tr>
			<%} %>
			<tr>
					<td class="subtotalEntryNameCell borderLeft borderTop borderBottom" colspan="4">
						<%=ds.getName(currentICode) %>
					</td>
					<td class="subtotalEntryCell borderLeft borderTop borderBottom">
						
					</td>
					<td class="subtotalEntryCell borderLeft borderTop borderBottom">
						
					</td>
					<td class="subtotalEntryCell borderLeft borderTop borderBottom">
					
					</td>
					<td class="subtotalEntryCell borderLeft borderRight borderTop borderBottom">
						
					</td>
				</tr>
			<% 
				for(int j = 0; j <= 9; j++){
					String currentJCode = Integer.toString(i*10 + j);
					if(ds.hasData(currentJCode)){
						//put a title
						%>
						<%-- <tr>
							<td></td>
							<td class="groupTitleCell" colspan="3">
								<%="Compte code " + currentJCode %>
							</td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr> --%>
						<%
						for(int k = 0; k <= 9; k++){
							String currentKcode = Integer.toString(i*100 + j*10 + k);
							if(ds.hasData(currentKcode)){
								//put a title
								%>
								<%-- <tr>
									<td colspan="2"></td>
									<td class="groupTitleCell" colspan="2">
										<%="Compte code " + currentKcode %>
									</td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
								</tr> --%>
								<%
								for(int l = 0; l <= 9; l++){
									String currentLCode = Integer.toString(i*1000 + j*100 + k*10 + l);
									if(ds.hasData(currentLCode)){
										%>
										<tr>
											<td class="borderLeft"></td>
											<td class="borderLeft" colspan="2"></td>
											<td class="simpleEntryNameCell">
												<%=ds.getName(currentLCode) %>
											</td>
											<td class="simpleEntryCell borderLeft">
												<%= ds.getCurrentValue(currentLCode) %>
											</td>
											<td class="simpleEntryCell borderLeft">
												<%= ds.getPreviousValue(currentLCode) %>
											</td>
											<td class="simpleEntryCell borderLeft">
												<%= ds.getDiffAmount(currentLCode) %>
											</td>
											<td class="simpleEntryCell borderRight borderLeft">
												<%= ds.getDiffPercent(currentLCode) %>
											</td>
										</tr>
		<%							}
								}
							%> 
								<!-- Level 3 total/subtotal row -->
								<tr>
									<td class="borderLeft"></td>
									<td class="borderLeft">&nbsp;</td>
									<td class="subtotalEntryNameCellLevel3" colspan="2">
										<%=ds.getName(currentKcode) %>
									</td>
									<td class="subtotalEntryCellLevel3 borderLeft" >
										<%=ds.getCurrentValue(currentKcode) %>
									</td>
									<td class="subtotalEntryCellLevel3 borderLeft">
										<%=ds.getPreviousValue(currentKcode) %>
									</td>
									<td class="subtotalEntryCellLevel3 borderLeft">
										<%=ds.getDiffAmount(currentKcode) %>
									</td>
									<td class="subtotalEntryCellLevel3 borderLeft borderRight">
										<%=ds.getDiffPercent(currentKcode) %>
									</td>
								</tr>
							<% 
							}
						}
					%>
						<!-- Level 2 total/subtotal row -->
								<tr>
									<td class="borderLeft">&nbsp;</td>
									<td class="borderLeft">&nbsp;</td>
									<td colspan="2">
										&nbsp;
									</td>
									<td class="borderLeft">
										&nbsp;
									</td>
									<td class="borderLeft">
										&nbsp;
									</td>
									<td class="borderLeft">
										&nbsp;
									</td>
									<td class="borderLeft borderRight">
										&nbsp;
									</td>
								</tr>
								<tr>
									<td class="borderLeft"></td>
									<td class="subtotalEntryNameCellLevel2 borderLeft borderTop" colspan="3">
										<%=ds.getName(currentJCode) %>
									</td>
									<td class="subtotalEntryCellLevel2 borderLeft borderTop">
										<%=ds.getCurrentValue(currentJCode) %>
									</td>
									<td class="subtotalEntryCellLevel2 borderLeft borderTop">
										<%=ds.getPreviousValue(currentJCode) %>
									</td>
									<td class="subtotalEntryCellLevel2 borderLeft borderTop">
										<%=ds.getDiffAmount(currentJCode) %>
									</td>
									<td class="subtotalEntryCellLevel2 borderLeft borderRight borderTop">
										<%=ds.getDiffPercent(currentJCode) %>
									</td>
								</tr>
								<tr>
									<td class="borderLeft">&nbsp;</td>
									<td class="borderBottom" colspan="3">
										&nbsp;
									</td>
									<td class="borderLeft borderBottom">
										&nbsp;
									</td>
									<td class="borderLeft borderBottom">
										&nbsp;
									</td>
									<td class="borderLeft borderBottom">
										&nbsp;
									</td>
									<td class="borderLeft borderRight borderBottom">
										&nbsp;
									</td>
								</tr>
					<%}		
				}
			%>
				<tr>
					<td class="subtotalEntryNameCell borderLeft borderBottom borderTop" colspan="4">
						<%=ds.getName(currentICode) %>
					</td>
					<td class="subtotalEntryCell borderLeft borderBottom borderTop">
						<%=ds.getCurrentValue(currentICode) %>
					</td>
					<td class="subtotalEntryCell borderLeft borderBottom borderTop">
						<%=ds.getPreviousValue(currentICode) %>
					</td>
					<td class="subtotalEntryCell borderLeft borderBottom borderTop">
						<%=ds.getDiffAmount(currentICode) %>
					</td>
					<td class="subtotalEntryCell borderLeft borderRight borderBottom borderTop">
						<%=ds.getDiffPercent(currentICode) %>
					</td>
				</tr>
				<tr>
					<td class="subtotalEntryNameCell borderLeft borderBottom borderTop"></td>
					<td class="subtotalEntryNameCell borderBottom borderTop" colspan="3">
						<% 
							if (currentICode.equals("7")){
								out.print(ds.getLossAccount());
							} else if (currentICode.equals("6")) {
								out.print(ds.getProfitAccount());
							}
						%>
					</td>
					<td class="subtotalEntryCell borderLeft borderBottom borderTop">
						<% 
							if (currentICode.equals("7")){
								out.print(ds.getLossCurrent());
							} else if (currentICode.equals("6")) {
								out.print(ds.getProfitCurrent());
							}
						%>
					</td>
					<td class="subtotalEntryCell borderLeft borderBottom borderTop">
						<% 
							if (currentICode.equals("7")){
								out.print(ds.getLossPrevious());
							} else if (currentICode.equals("6")) {
								out.print(ds.getProfitPrevious());
							}
						%>
					</td>
					<td class="subtotalEntryCell borderLeft borderBottom borderTop">
						&nbsp;
					</td>
					<td class="subtotalEntryCell borderLeft borderRight borderBottom borderTop">
						&nbsp;
					</td>
				</tr>
				<tr>
					<td class="subtotalEntryNameCell borderLeft borderBottom borderTop" colspan="4">
						TOTAL GÉNÉRAL
					</td>
					<td class="subtotalEntryCell borderLeft borderBottom borderTop">
						<%=ds.getTotalCurrent() %>
					</td>
					<td class="subtotalEntryCell borderLeft borderBottom borderTop">
						<%=ds.getTotalPrevious() %>
					</td>
					<td class="subtotalEntryCell borderLeft borderBottom borderTop">
						&nbsp;
					</td>
					<td class="subtotalEntryCell borderLeft borderRight borderBottom borderTop">
						&nbsp;
					</td>
				</tr>
				<tr>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
				</tr>
			<%} 
		}%>
	</tbody>
</table>
</body>
</html>