<%@page import="eu.agileeng.util.AEStringUtil"%>
<%@page import="eu.agileeng.domain.cefra.n11580_03.BalanceDataSource"%>
<%@page import="java.util.List"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<%
	BalanceDataSource ds =(BalanceDataSource) request.getAttribute("balanceDataSource");
	%>
<html>
<head><meta charset="UTF-8"></meta></head>
<body>
<p style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px;">Balance générale</p>
<table border="0" cellspacing="0" cellpadding="0" width="700px" style="margin-bottom: 10px;">
	<tr>
		<td style="text-align: center; font-size: 14px;">
			Paroisse: <b><%=ds.getCustomerName() %></b> Code paroisse: <b><%=ds.getCustomerCode() %></b>
		</td>
	</tr>
</table>
<table border="0" cellspacing="0" cellpadding="2" width="700px">
	<thead>
		<tr>
			<th class="tableHeaderCellRowSpan" rowspan="2" style="width: 10%;">
				Compte
			</th>
			<th class="tableHeaderCellRowSpan" rowspan="2" style="width: 40%;">
				Libellé
			</th>
			<th class="tableHeaderCell" colspan="2" style="width: 25%;">
				Total du <%= ds.getPeriodAsStringShort() %>
			</th>
			<th class="tableHeaderCell" colspan="2" style="width: 25%; border-right-width: 0.5pt; border-right-style: solid; border-right-color: #000000;">
				Solde du <%= ds.getPeriodAsStringShort() %>
			</th>
		</tr>
		<tr class="tableHeaderSecondRow">
			<th class="tableHeaderCellSecondRowDt borderTop">
				Débit
			</th>
			<th class="tableHeaderCellSecondRowCt2 borderLeft borderTop">
				Crédit
			</th>
			<th class="tableHeaderCellSecondRowDt borderTop">
				Débit
			</th>
			<th class="tableHeaderCellSecondRowCt borderLeft borderTop">
				Crédit
			</th>
		</tr>
	</thead>
	<tbody style="border: 0;">
		<!-- Here start to iterate through the data -->
			<%int counter = 0;
			List<String> accCodes = ds.getAccCodes();
			String accountCls = null;
			boolean clsHasData = false;
			for(String code : accCodes){
				if(accountCls == null){
					//initialize accountCls
					accountCls = code.substring(0, 1);
				} else if(!accountCls.equals(code.substring(0, 1))){
					if(clsHasData){
					//print account class totals and then set the new account class
					%>
					<tr style="font-weight: bold;">
						<td class="simpleEntryNameCell">
						</td>
						<td class="simpleEntryNameCell">
							&nbsp;
						</td>
						<td class="simpleEntryCellDt">
							&nbsp;
						</td>
						<td class="simpleEntryCellDt">
							&nbsp;
						</td>
						<td class="simpleEntryCellDt">
							&nbsp;
						</td>
						<td class="simpleEntryCellDt borderRight">
							&nbsp;
						</td>
					</tr>
					<tr style="font-weight: bold;">
						<td class="totalClassNameCell borderTop">
						</td>
						<td class="totalClassNameCell borderTop">
							Total des comptes <%=accountCls%>
						</td>
						<td class="totalClassCellDt borderTop">
							<%=ds.getDebitTurnover(accountCls)%>
						</td>
						<td class="totalClassCellDt borderTop">
							<%=ds.getCreditTurnover(accountCls)%>
						</td>
						<td class="totalClassCellDt borderTop">
							<%=ds.getDebitBalance(accountCls)%>
						</td>
						<td class="totalClassCellDt borderTop borderRight">
							<%=ds.getCreditBalance(accountCls)%>
						</td>
					</tr>
					<tr style="font-weight: bold;">
						<td class="borderBottom">
						</td>
						<td class="borderBottom">
							&nbsp;
						</td>
						<td class="borderBottom">
							&nbsp;
						</td>
						<td class="borderBottom">
							&nbsp;
						</td>
						<td class="borderBottom">
							&nbsp;
						</td>
						<td class="borderBottom">
							&nbsp;
						</td>
					</tr>
					<%
					}
					accountCls = code.substring(0, 1);
					clsHasData = false;
					counter = 0;
				}
				
				if(!(AEStringUtil.EMPTY_STRING.equals(ds.getDebitTurnover(code)) &&
						AEStringUtil.EMPTY_STRING.equals(ds.getCreditTurnover(code)) &&
						AEStringUtil.EMPTY_STRING.equals(ds.getDebitBalance(code)) &&
						AEStringUtil.EMPTY_STRING.equals(ds.getCreditBalance(code)))){
					clsHasData = true;
				if((counter++ & 1) == 0){%>
					<tr>
						<td class="simpleEntryNameCell">
							<%=code%>
						</td>
						<td class="simpleEntryNameCell">
							<%=ds.getAccName(code)%>
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getDebitTurnover(code)%>
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getCreditTurnover(code)%>
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getDebitBalance(code)%>
						</td>
						<td class="simpleEntryCellDt borderRight">
							<%=ds.getCreditBalance(code)%>
						</td>
					</tr>
				<%} else { %>
					<tr style="background-color: #dddddd;">
						<td class="simpleEntryNameCell">
							<%=code%>
						</td>
						<td class="simpleEntryNameCell">
							<%=ds.getAccName(code)%>
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getDebitTurnover(code)%>
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getCreditTurnover(code)%>
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getDebitBalance(code)%>
						</td>
						<td class="simpleEntryCellDt borderRight">
							<%=ds.getCreditBalance(code)%>
						</td>
					</tr>
		<%		}
				}
			}
		%>
		<!-- Put last account class total -->
		<%if (clsHasData){ %>
					<tr style="font-weight: bold;">
						<td class="simpleEntryNameCell">
						</td>
						<td class="simpleEntryNameCell">
							&nbsp;
						</td>
						<td class="simpleEntryCellDt">
							&nbsp;
						</td>
						<td class="simpleEntryCellDt">
							&nbsp;
						</td>
						<td class="simpleEntryCellDt">
							&nbsp;
						</td>
						<td class="simpleEntryCellDt borderRight">
							&nbsp;
						</td>
					</tr>
					<tr style="font-weight: bold;">
						<td class="totalClassNameCell borderTop">
						</td>
						<td class="totalClassNameCell borderTop">
							Total des comptes <%=accountCls%>
						</td>
						<td class="totalClassCellDt borderTop">
							<%=ds.getDebitTurnover(accountCls)%>
						</td>
						<td class="totalClassCellDt borderTop">
							<%=ds.getCreditTurnover(accountCls)%>
						</td>
						<td class="totalClassCellDt borderTop">
							<%=ds.getDebitBalance(accountCls)%>
						</td>
						<td class="totalClassCellDt borderTop borderRight">
							<%=ds.getCreditBalance(accountCls)%>
						</td>
					</tr>
					<!-- <tr style="font-weight: bold;">
						<td class="simpleEntryNameCell">
						</td>
						<td class="simpleEntryNameCell">
							&nbsp;
						</td>
						<td class="simpleEntryNameCell">
							&nbsp;
						</td>
						<td class="simpleEntryNameCell">
							&nbsp;
						</td>
						<td class="simpleEntryNameCell">
							&nbsp;
						</td>
						<td class="simpleEntryNameCell">
							&nbsp;
						</td>
					</tr> -->
		<%} %>
		<!-- Total table rows -->
					<tr style="font-weight: bold;">
						<td class="simpleEntryNameCell">
						&nbsp;
						</td>
						<td class="simpleEntryNameCell">
							&nbsp;
						</td>
						<td class="simpleEntryCellDt">
							&nbsp;
						</td>
						<td class="simpleEntryCellDt">
							&nbsp;
						</td>
						<td class="simpleEntryCellDt">
							&nbsp;
						</td>
						<td class="simpleEntryCellDt borderRight">
							&nbsp;
						</td>
					</tr>
					<tr style="font-weight: bold;font-size: 13px;">
						<td class="simpleEntryNameCell">
						</td>
						<td class="simpleEntryNameCell">
							Total bilan
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getDebitTurnover(1)%>
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getCreditTurnover(1)%>
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getDebitBalance(1)%>
						</td>
						<td class="simpleEntryCellDt borderRight">
							<%=ds.getCreditBalance(1)%>
						</td>
					</tr>
					<%-- <tr style="font-weight:bold;">
						<td class="simpleEntryNameCell">
						</td>
						<td class="simpleEntryNameCell">
							Total extra-comptable
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getDebitTurnover(2)%>
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getCreditTurnover(2)%>
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getDebitBalance(2)%>
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getCreditBalance(2)%>
						</td>
					</tr> --%>
					<tr style="font-weight: bold;font-size: 13px;">
						<td class="simpleEntryNameCell">
						</td>
						<td class="simpleEntryNameCell">
							Total charge
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getDebitTurnover(3)%>
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getCreditTurnover(3)%>
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getDebitBalance(3)%>
						</td>
						<td class="simpleEntryCellDt borderRight">
							<%=ds.getCreditBalance(3)%>
						</td>
					</tr>
					<tr style="font-weight: bold;font-size: 13px;">
						<td class="simpleEntryNameCell">
						</td>
						<td class="simpleEntryNameCell">
							Total produit
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getDebitTurnover(4)%>
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getCreditTurnover(4)%>
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getDebitBalance(4)%>
						</td>
						<td class="simpleEntryCellDt borderRight">
							<%=ds.getCreditBalance(4)%>
						</td>
					</tr>
					<tr style="font-weight: bold;font-size: 13px;">
						<td class="simpleEntryNameCell">
						</td>
						<td class="simpleEntryNameCell">
							Total gestion (charge et produit)
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getDebitTurnover(5)%>
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getCreditTurnover(5)%>
						</td>
						<td class="simpleEntryCellDt">
							<%=ds.getDebitBalance(5)%>
						</td>
						<td class="simpleEntryCellDt borderRight">
							<%=ds.getCreditBalance(5)%>
						</td>
					</tr>
					<tr style="font-weight: bold;font-size: 13px;">
						<td class="totalEntryNameCell borderLeft borderBottom">
						</td>
						<td class="totalEntryNameCell borderLeft borderBottom">
							Total général
						</td>
						<td class="totalEntryCellDt borderBottom">
							<%=ds.getDebitTurnover(6)%>
						</td>
						<td class="totalEntryCellDt borderBottom">
							<%=ds.getCreditTurnover(6)%>
						</td>
						<td class="totalEntryCellDt borderBottom">
							<%=ds.getDebitBalance(6)%>
						</td>
						<td class="totalEntryCellDt borderBottom borderRight">
							<%=ds.getCreditBalance(6)%>
						</td>
					</tr>
	</tbody>
</table>
</body>
</html>