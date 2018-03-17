<%@page import="eu.agileeng.util.AEMath"%>
<%@page import="eu.agileeng.domain.cefra.n11580_03.BilanDataSource"%>
<%@page import="java.util.List"%>
<%@page import="java.util.ArrayList"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<%
	BilanDataSource ds =(BilanDataSource) request.getAttribute("bilanDataSource");
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
			<p style="text-align: left; font-size: 11pt;">Code Etablissement : <%=ds.getCustomerCode() %></p>
		</td>
		<td style="width: 10%">
			<p style="text-align: left; font-size: 11pt;"></p>
		</td>
		<td  style="width: 30%">
			<%=ds.getPeriodAsString() %>
		</td>
	</tr>
	<tr>
		<td>&nbsp;</td>
		<td colspan="3">
			<p style="text-align: left; font-size: 11pt; margin-bottom: 10px;">Nom de la paroisse : <%=ds.getCustomerName() %></p>
		</td>
	</tr>
</table>
<p style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px;">Bilan</p>
<%
/* Here calculate all totals and subtotals in order to
	make validation and highlight possible errors
*/
	List<String> actifList = new ArrayList<String>();
	double actifTotal = 0.0;
	double total21 = 0.0;
	double comptesDeStocks = 0.0;
	boolean is512Debit = true;
	boolean is514Debit = true;
	boolean is517Debit = true;
	boolean add51XGroupToLiabilities = false;
	List<String> group51XCreditBalance = new ArrayList<String>();
	
	if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("512"), false))){
		is512Debit = false;
		group51XCreditBalance.add("512");
	}
	
	if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("514"), false))){
		is514Debit = false;
		group51XCreditBalance.add("514");
	}
	
	if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("517"), false))){
		is517Debit = false;
		group51XCreditBalance.add("517");
	}
	
	if(is512Debit == false || is514Debit == false || is517Debit == false){
		add51XGroupToLiabilities = true;
	}
	
	List<String> comptesImmoList = new ArrayList<String>();
	comptesImmoList.add("211");
	comptesImmoList.add("213");
	comptesImmoList.add("218");
	// comptesImmoList.add("2183");
	actifList.add("2");
	total21 = AEMath.parseDouble(ds.getDebitBalance(comptesImmoList), false);
	
	List<String> comptesDeStocksList = new ArrayList<String>();
	comptesDeStocksList.add("32");
	comptesDeStocksList.add("33");
	comptesDeStocks = AEMath.parseDouble(ds.getDebitBalance(comptesDeStocksList), false);
	actifList.addAll(comptesDeStocksList);
	
	List<String> comptesDeTiersList = new ArrayList<String>();
	comptesDeTiersList.add("411");
	comptesDeTiersList.add("426");
	comptesDeTiersList.add("4675");
	comptesDeTiersList.add("4687");
	actifList.addAll(comptesDeTiersList);
	
	List<String> comptesRegularisationList = new ArrayList<String>();
	comptesRegularisationList.add("4818");
	comptesRegularisationList.add("486");
	actifList.addAll(comptesRegularisationList);
	
	List<String> comptesTresorieList = new ArrayList<String>();
	comptesTresorieList.add("501");
	comptesTresorieList.add("511");
	if(is512Debit){
		comptesTresorieList.add("512");
	}
	if(is514Debit){
		comptesTresorieList.add("514");
	}
	if(is517Debit){
		comptesTresorieList.add("517");
	}
	comptesTresorieList.add("530");
	comptesTresorieList.add("580");
	comptesTresorieList.add("590");
	actifList.addAll(comptesTresorieList);
	actifTotal = AEMath.parseDouble(ds.getDebitBalance(actifList), false);
	
	//Passifs
	List<String> passifList = new ArrayList<String>();
	double passifTotal = 0.0;
	List<String> comptesPassifCapitauxList = new ArrayList<String>();
	comptesPassifCapitauxList.add("101");
	comptesPassifCapitauxList.add("120");
	comptesPassifCapitauxList.add("129");
	passifList.addAll(comptesPassifCapitauxList);
	
	List<String> comptes467List = new ArrayList<String>();
	comptes467List.add("4670");
	comptes467List.add("4671");
	comptes467List.add("4672");
	comptes467List.add("4673");
	comptes467List.add("4674");
	comptes467List.add("4676");
	comptes467List.add("4677");
	comptes467List.add("4678");
	comptes467List.add("4679");
	passifList.add("13");
	passifList.add("15");
	passifList.add("16");
	passifList.add("19");
	passifList.addAll(comptes467List);
	
	List<String> comptesDeDettesList = new ArrayList<String>();
	comptesDeDettesList.add("401");
	comptesDeDettesList.add("402");
	comptesDeDettesList.add("403");
	comptesDeDettesList.add("421");
	comptesDeDettesList.add("431");
	comptesDeDettesList.add("441");
	comptesDeDettesList.add("4686");

	passifList.addAll(comptesDeDettesList);
	
	comptesDeDettesList.add("4670");
	comptesDeDettesList.add("4671");
	comptesDeDettesList.add("4672");
	comptesDeDettesList.add("4673");
	comptesDeDettesList.add("4674");
	comptesDeDettesList.add("4676");
	comptesDeDettesList.add("4677");
	comptesDeDettesList.add("4678");
	comptesDeDettesList.add("4679");
	
	passifList.add("487");
	passifList.addAll(group51XCreditBalance);
	passifTotal = AEMath.parseDouble(ds.getCreditBalance(passifList), false);
	
	
	//Validations
	boolean hasErrors = false;
	boolean positiveTotal21 = true;
	
	boolean totalsAreEqual = true;
	
	if(AEMath.isNegativeAmount(total21)){
		positiveTotal21 = false;
		hasErrors = true;
	}
	
	if(actifTotal != passifTotal){
		totalsAreEqual = false;
		hasErrors = true;
	}
	
	int actifExtraHeight = 580 - actifList.size()*15;
	int passifExtraHeight = 580 - passifList.size()*15;
%>
<div style="height: 580px;">
<table border="0" cellspacing="0" cellpadding="0" width="100%">
<tr>
<td style="width:48%; height: 100%;" valign="top">
<table border="0" cellspacing="0" cellpadding="2" width="100%">
	<thead>
		<tr>
			<th style="text-align: left; font-size: 16px; font-weight: bold; margin-bottom: 10px;" colspan="6">
				Actif
			</th>
		</tr>
		<tr class="tableHeaderSecondRow">
			<th class="tableHeaderCellSecondRow" colspan="4">
			</th>
			<th  colspan="2" class="tableHeaderCellSecondRow">
<%-- 				<%=ds.getPeriodAsStringShort() + ", " + ds.getCurrentDateYear() %> --%>
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
			<td style="width: 4%; height: 0;"></td>
			<td style="width: 3%; height: 0;"></td>
			<td style="width: 3%; height: 0;"></td>
			<td style="width: 50%; height: 0;"></td>
			<td style="width: 20%; height: 0;"></td>
			<td style="width: 20%; height: 0;"></td>
		</tr>

		<tr>
			<td class="groupTitleCell borderLeft" colspan="4">COMPTES D'IMMOBILISATIONS</td>
			<td class="borderLeft"></td>
			<td class="borderLeft borderRight"></td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">21 Immobilisations corporelles</td>
			<td class="simpleEntryCell borderLeft"></td>
			<%if (positiveTotal21){ %>
				<td class="subtotalEntryCell borderLeft borderRight"><%=ds.getDebitBalance(comptesImmoList)%></td>
			<%} else { %>
				<td class="subtotalEntryCellError borderLeft borderRight"><%=ds.getDebitBalance(comptesImmoList)%></td>
			<%} %>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td></td>
			<td class="simpleEntryNameCell" colspan="2">211 Terrains</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("211"), false))){ %>
				<td class="simpleEntryCellError borderLeft"><%=ds.getDebitBalance("211") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getDebitBalance("211") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"></td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td></td>
			<td class="simpleEntryNameCell" colspan="2">213 Constructions</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("213"), false))){ %>
				<td class="simpleEntryCellError borderLeft"><%=ds.getDebitBalance("213") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getDebitBalance("213") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"></td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td></td>
			<td class="simpleEntryNameCell" colspan="2">218 Installations et agencements</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("218"), false))){ %>
				<td class="simpleEntryCellError borderLeft"><%=ds.getDebitBalance("218") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getDebitBalance("218") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"></td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">23 Immobilisations corporelles en cours</td>
			<td class="simpleEntryCell borderLeft"></td>
			<% if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("23"), false))) {%>
				<td class="subtotalEntryCellError borderLeft borderRight"><%=ds.getDebitBalance("23") %></td>
			<%} else { %>
				<td class="subtotalEntryCell borderLeft borderRight"><%=ds.getDebitBalance("23") %></td>
			<%} %>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">27 Immobilisations financières</td>
			<td class="simpleEntryCell borderLeft"></td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("27"), false))) {%>
				<td class="subtotalEntryCellError borderLeft"><%=ds.getDebitBalance("27") %></td>
			<%} else { %>
				<td class="subtotalEntryCell borderLeft borderRight"><%=ds.getDebitBalance("27") %></td>
			<%} %>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td></td>
			<td class="simpleEntryNameCell" colspan="2">274 Prêts</td>
			<% if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("274"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getDebitBalance("274") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getDebitBalance("274") %></td>
			<%} %>
			<td class="simpleEntryCell borderRight borderLeft"></td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td></td>
			<td class="simpleEntryNameCell" colspan="2">275 Dépôts et cautionnements versés</td>
			<%if (AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("275"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getDebitBalance("275") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getDebitBalance("275") %></td>
			<%} %>
			<td class="simpleEntryCell borderRight borderLeft"></td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">28 Amortissements des immobilisations</td>
			<td class="simpleEntryCell borderLeft"></td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("28"), false))){ %>
				<td class="subtotalEntryCellError borderLeft borderRight"><%=ds.getDebitBalance("28") %></td>
			<%} else { %>
				<td class="subtotalEntryCell borderLeft borderRight"><%=ds.getDebitBalance("28") %></td>
			<%} %>
		</tr>
		
		<tr>
			<td class="subtotalEntryNameCell borderLeft" colspan="4">Valeur nette des immobilisations</td>
			<td class="subtotalEntryCellWithLine borderLeft"></td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("2"), false))) {%>
				<td class="subtotalEntryCellWithLineError borderLeft borderRight"><%=ds.getDebitBalance("2") %></td>
			<%} else { %>
				<td class="subtotalEntryCellWithLine borderLeft borderRight"><%=ds.getDebitBalance("2") %></td>
			<%} %>	
		</tr>
		
		<tr>
			<td class="groupTitleCell borderLeft" colspan="4">COMPTES DE STOCKS</td>
			<td class="borderLeft"> </td>
			<td class="borderLeft borderRight"> </td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">32 Stock de fournitures</td>
			<td class="simpleEntryCell borderLeft"></td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("32"), false))) {%>
				<td class="simpleEntryCellError borderLeft borderRight"><%=ds.getDebitBalance("32") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft borderRight"><%=ds.getDebitBalance("32") %></td>
			<%} %>
			
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">33 Stocks / autres</td>
			<td class="simpleEntryCell borderLeft"></td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("33"), false))) {%>
				<td class="simpleEntryCellError borderLeft borderRight"><%=ds.getDebitBalance("33") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft borderRight"><%=ds.getDebitBalance("33") %></td>
			<%} %>
			
		</tr>
		
		<tr>
			<td class="subtotalEntryNameCell borderLeft" colspan="4">Cumul des comptes de stocks </td>
			<td class="subtotalEntryCellWithLine borderLeft"></td>
			<% if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance(comptesDeStocksList), false))) {%>
				<td class="subtotalEntryCellWithLineError borderLeft borderRight"><%=ds.getDebitBalance(comptesDeStocksList) %></td>
			<%} else { %>
				<td class="subtotalEntryCellWithLine borderLeft borderRight"><%=ds.getDebitBalance(comptesDeStocksList) %></td>
			<%} %>
		</tr>
		
		<tr>
			<td class="groupTitleCell borderLeft" colspan="4">COMPTES DE TIERS</td>
			<td class="borderLeft"> </td>
			<td class="borderLeft borderRight"> </td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">411 Tiers donateurs, paroissiens …</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("411"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getDebitBalance("411") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getDebitBalance("411") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"></td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">4260 Créances sur cessions d'immobilisations</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("426"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getDebitBalance("426") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getDebitBalance("426") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"></td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">4675 Débiteurs divers</td>
			<% if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("4675"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getDebitBalance("4675") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getDebitBalance("4675") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"></td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">4687 Produits à recevoir</td>
			<% if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("4687"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getDebitBalance("4687") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getDebitBalance("4687") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"></td>
		</tr>

		<tr>
			<td class="subtotalEntryNameCell borderLeft" colspan="4">Cumul des comptes de tiers </td>
			<td class="subtotalEntryCellWithLine borderLeft"></td>
			<% if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance(comptesDeTiersList), false))) {%>
				<td class="subtotalEntryCellWithLineError borderLeft borderRight"><%=ds.getDebitBalance(comptesDeTiersList) %></td>
			<%} else { %>
				<td class="subtotalEntryCellWithLine borderLeft borderRight"><%=ds.getDebitBalance(comptesDeTiersList) %></td>
			<%} %>
		</tr>
		
		<tr>
			<td class="groupTitleCell borderLeft" colspan="4">COMPTES DE RÉGULARISATION</td>
			<td class="borderLeft"> </td>
			<td class="borderLeft borderRight"> </td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">4818 Charges à étaler</td>
			<td class="simpleEntryCell borderLeft"></td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("4818"), false))) {%>
				<td class="subtotalEntryCellError borderLeft borderRight"><%=ds.getDebitBalance("4818") %></td>
			<%} else { %>
				<td class="subtotalEntryCell borderLeft borderRight"><%=ds.getDebitBalance("4818") %></td>
			<%} %>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">486 Charges comptabilisées d'avance</td>
			<td class="simpleEntryCell borderLeft"></td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("486") , false))) {%>
				<td class="subtotalEntryCellError borderLeft borderRight"><%=ds.getDebitBalance("486") %></td>
			<%} else { %>
				<td class="subtotalEntryCell borderLeft borderRight"><%=ds.getDebitBalance("486") %></td>
			<%} %>
			
		</tr>

		<tr>
			<td class="subtotalEntryNameCell borderLeft" colspan="4">Cumul des comptes de régularisation </td>
			<td class="subtotalEntryCellWithLine borderLeft"></td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance(comptesRegularisationList), false))) {%>
				<td class="subtotalEntryCellWithLineError borderLeft borderRight"><%=ds.getDebitBalance(comptesRegularisationList) %></td>
			<%} else { %>
				<td class="subtotalEntryCellWithLine borderLeft borderRight"><%=ds.getDebitBalance(comptesRegularisationList) %></td>
			<%} %>
		</tr>
		
		<tr>
			<td class="groupTitleCell borderLeft" colspan="4">COMPTES FINANCIERS</td>
			<td class="borderLeft"> </td>
			<td class="borderLeft borderRight"> </td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">501 Valeurs Mobilières de Placement</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("501"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getDebitBalance("501") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getDebitBalance("501") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"></td>
			
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">511 Valeurs à l'encaissement</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("511"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getDebitBalance("511") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getDebitBalance("511") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"></td>
			
		</tr>
		<%if(is512Debit) {%>
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">512 Banques</td>
			<td class="simpleEntryCell borderLeft"><%=ds.getDebitBalance("512") %></td>
			<td class="simpleEntryCell borderLeft borderRight"></td>
			
		</tr>
		<%} %>
<!--	
		<%if(is514Debit){ %>
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">514 Chèques postaux</td>
			<td class="simpleEntryCell borderLeft"><%=ds.getDebitBalance("514") %></td>
			<td class="simpleEntryCell borderLeft borderRight"></td>
		</tr>
		<%} %>
		<%if(is517Debit){ %>
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">517 Banques et autres établissements financiers</td>
			<td class="simpleEntryCell borderLeft"><%=ds.getDebitBalance("517") %></td>
			<td class="simpleEntryCell borderLeft borderRight"></td>
		</tr>
		<%} %>
-->
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">530 Caisse</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("530"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getDebitBalance("530") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getDebitBalance("530") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"></td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">580 Virements Internes</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("580"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getDebitBalance("580") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getDebitBalance("580") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"></td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">590 Provisions dépréciations VMP</td>
			<% if (AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance("590"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getDebitBalance("590") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getDebitBalance("590") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"></td>
		</tr>

		<tr>
			<td class="subtotalEntryNameCell borderLeft" colspan="4">Cumul des comptes de trésorerie</td>
			<td class="subtotalEntryCellWithLine borderLeft"></td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getDebitBalance(comptesTresorieList), false))) {%>
				<td class="subtotalEntryCellWithLineError borderLeft borderRight"><%=ds.getDebitBalance(comptesTresorieList) %></td>
			<%} else { %>
				<td class="subtotalEntryCellWithLine borderLeft borderRight"><%=ds.getDebitBalance(comptesTresorieList) %></td>
			<%} %>
		</tr>
		
		<tr>
			<td class="simpleEntryNameCell borderLeft" colspan="4" style="height: <%=actifExtraHeight%>px">&nbsp;</td>
			<td class="simpleEntryCell borderLeft" style="height:  <%=actifExtraHeight%>px">&nbsp;</td>
			<td class="simpleEntryCell borderLeft borderRight" style="height:  <%=actifExtraHeight%>px">&nbsp;</td>
		</tr>
		
		<%-- <tr>
			<td class="totalEntryNameCell borderLeft" colspan="4">TOTAL</td>
			<td class="totalEntryCell borderLeft"></td>
			<%
				if(totalsAreEqual){
					%>
					<td class="totalEntryCell borderLeft borderRight"><%=ds.getDebitBalance(actifList) %></td>
					<%
				} else {
					%>
					<td class="totalEntryCellError borderLeft borderRight"><%=ds.getDebitBalance(actifList) %></td>
					<%
				} 
			%>
		</tr> --%>
	</tbody>
</table>
</td>
<td style="width:2%;">&nbsp;</td>
<td style="width:2%;border-left-width: 2pt;border-left-style: solid; border-left-color: #292929;">&nbsp;</td>
<td style="width:48%; height: 100%;" valign="top">
<table class="passifTable" border="0" cellspacing="0" cellpadding="2" width="100%" style="height: 100%;">
	<thead>
	<tr>
		<th style="text-align: left; font-size: 16px; font-weight: bold; margin-bottom: 10px;" colspan="6">
			Passif
		</th>
		</tr>
		<tr class="tableHeaderSecondRow">
			<th class="tableHeaderCellSecondRow" colspan="4">
			</th>
			<th class="tableHeaderCellSecondRow">
<%-- 				<%=ds.getPeriodAsStringShort() + ", " + ds.getCurrentDateYear() %> --%>
			</th>
			<th class="tableHeaderCellSecondRow">
<%-- 				<%=ds.getPeriodAsStringShort() + ", " + ds.getPrevousDateYear() %> --%>
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
			<td style="width: 4%; height: 0;"></td>
			<td style="width: 3%; height: 0;"></td>
			<td style="width: 3%; height: 0;"></td>
			<td style="width: 50%; height: 0;"></td>
			<td style="width: 20%; height: 0;"></td>
			<td style="width: 20%; height: 0;"></td>
		</tr>
		
		<tr>
			<td class="groupTitleCell borderLeft" colspan="4">COMPTES DE CAPITAUX</td>
			<td class="borderLeft"> </td>
			<td class="borderLeft borderRight"> </td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">101 Patrimoine paroissial</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getCreditBalance("101"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getCreditBalance("101") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getCreditBalance("101") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"></td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">120 Excédent de 1’exercice</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getCreditBalance("120"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getCreditBalance("120") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getCreditBalance("120") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"></td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">129 Déficit de l'exercice</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getCreditBalance("129"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getCreditBalance("129") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getCreditBalance("129") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"></td>
		</tr>
		
		<tr>
			<td class="subtotalEntryNameCell borderLeft" colspan="4">Situation nette</td>
			<td class="subtotalEntryCellWithLine borderLeft"> </td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getCreditBalance(comptesPassifCapitauxList), false))) {%>
				<td class="subtotalEntryCellWithLineError borderLeft borderRight"><%=ds.getCreditBalance(comptesPassifCapitauxList)%></td>
			<%} else { %>
				<td class="subtotalEntryCellWithLine borderLeft borderRight"><%=ds.getCreditBalance(comptesPassifCapitauxList)%></td>
			<%} %>			
		</tr>
		
		<tr>
			<td class="groupTitleCell borderLeft" colspan="4">SUBVENTIONS</td>
			<td class="borderLeft"> </td>
			<td class="borderLeft borderRight"> </td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">13 Subventions d'équipement</td>
			<td class="simpleEntryCell borderLeft"> </td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getCreditBalance("13"), false))) {%>
				<td class="subtotalEntryCellError borderLeft borderRight"><%=ds.getCreditBalance("13") %></td>
			<%} else { %>
				<td class="subtotalEntryCell borderLeft borderRight"><%=ds.getCreditBalance("13") %></td>
			<%} %>
		</tr>
		
		<tr>
			<td class="groupTitleCell borderLeft" colspan="4">PROVISIONS</td>
			<td class="borderLeft"> </td>
			<td class="borderLeft borderRight"> </td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">15 Provisions pour risques et charges</td>
			<td class="simpleEntryCell borderLeft"> </td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getCreditBalance("15"), false))) {%>
				<td class="subtotalEntryCellError borderLeft borderRight"><%=ds.getCreditBalance("15") %></td>
			<%} else { %>
				<td class="subtotalEntryCell borderLeft borderRight"><%=ds.getCreditBalance("15") %></td>
			<%} %>
		</tr>
		
		<tr>
			<td class="groupTitleCell borderLeft" colspan="4">EMPRUNTS</td>
			<td class="borderLeft"> </td>
			<td class="borderLeft borderRight"> </td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">16 Emprunts</td>
			<td class="simpleEntryCell borderLeft"> </td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getCreditBalance("16"), false))) {%>
				<td class="subtotalEntryCellError borderLeft borderRight"><%=ds.getCreditBalance("16") %></td>
			<%} else { %>
				<td class="subtotalEntryCell borderLeft borderRight"><%=ds.getCreditBalance("16") %></td>
			<%} %>
		</tr>
		
		<tr>
			<td class="groupTitleCell borderLeft" colspan="4">FONDS DEDIES</td>
			<td class="borderLeft"> </td>
			<td class="borderLeft borderRight"> </td>
		</tr>
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">1900 Fonds dedies</td>
			<td class="simpleEntryCell borderLeft"> </td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getCreditBalance("19"), false))) {%>
				<td class="subtotalEntryCellError borderLeft borderRight"><%=ds.getCreditBalance("19") %></td>
			<%} else { %>
				<td class="subtotalEntryCell borderLeft borderRight"><%=ds.getCreditBalance("19") %></td>
			<%} %>
		</tr>
		
		<%if(add51XGroupToLiabilities){ %>
				<tr>
			<td class="groupTitleCell borderLeft" colspan="4">Découverts et concours bancaires courants</td>
			<td class="borderLeft"> </td>
			<td class="borderLeft borderRight"> </td>
		</tr>
		
		<%if(!is512Debit) {%>
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">512 Banques</td>
			<td class="simpleEntryCell borderLeft"><%=ds.getCreditBalance("512") %></td>
			<td class="simpleEntryCell borderLeft borderRight"></td>
			
		</tr>
		<%} %>
<!-- 
		<%if(!is514Debit){ %>
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">514 Chèques postaux</td>
			<td class="simpleEntryCell borderLeft"><%=ds.getCreditBalance("514") %></td>
			<td class="simpleEntryCell borderLeft borderRight"></td>
		</tr>
		<%} %>
		<%if(!is517Debit){ %>
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">517 Banques et autres établissements financiers</td>
			<td class="simpleEntryCell borderLeft"><%=ds.getCreditBalance("517") %></td>
			<td class="simpleEntryCell borderLeft borderRight"></td>
		</tr>
		<%} %>
 -->
		<tr>
			<td class="subtotalEntryNameCell borderLeft" colspan="4">Découverts et concours bancaires courants </td>
			<td class="subtotalEntryCellWithLine borderLeft"></td>
			<td class="subtotalEntryCellWithLine borderLeft borderRight"><%=ds.getCreditBalance(group51XCreditBalance) %></td>
		</tr>
		<%} %>
		<tr>
			<td class="groupTitleCell borderLeft" colspan="4">COMPTES DE TIERS</td>
			<td class="borderLeft"> </td>
			<td class="borderLeft borderRight"> </td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">401 Fournisseurs</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getCreditBalance("401"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getCreditBalance("401") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getCreditBalance("401") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"> </td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">402 Quêtes à reverser</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getCreditBalance("402"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getCreditBalance("402") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getCreditBalance("402") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"> </td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">403 Casuel à reverser</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getCreditBalance("403"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getCreditBalance("403") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getCreditBalance("403") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"> </td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">421 Personnel</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getCreditBalance("421"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getCreditBalance("421") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getCreditBalance("421") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"> </td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">431 Organismes Sociaux</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getCreditBalance("431"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getCreditBalance("431") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getCreditBalance("431") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"> </td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">441 Etat - Collectivités Publiques</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getCreditBalance("441"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getCreditBalance("441") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getCreditBalance("441") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"> </td>
		</tr>
		<!-- When calculating 467 make sure to skip 4675 -->

		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">467 Créditeurs divers (dont Archevêché)</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getCreditBalance(comptes467List), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getCreditBalance(comptes467List) %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getCreditBalance(comptes467List) %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"> </td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">4686 Charges à payer</td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getCreditBalance("4686"), false))) {%>
				<td class="simpleEntryCellError borderLeft"><%=ds.getCreditBalance("4686") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft"><%=ds.getCreditBalance("4686") %></td>
			<%} %>
			<td class="simpleEntryCell borderLeft borderRight"> </td>
		</tr>
		<tr>
			<td class="subtotalEntryNameCell borderLeft" colspan="4">Cumul des dettes</td>
			<td class="subtotalEntryCellWithLine borderLeft"> </td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getCreditBalance(comptesDeDettesList), false))) {%>
				<td class="subtotalEntryCellWithLineError borderLeft borderRight"><%=ds.getCreditBalance(comptesDeDettesList) %></td>
			<%} else { %>
				<td class="subtotalEntryCellWithLine borderLeft borderRight"><%=ds.getCreditBalance(comptesDeDettesList) %></td>
			<%} %>
		</tr>
		
		<tr>
			<td class="groupTitleCell borderLeft" colspan="4">COMPTES DE RÉGULARISATION</td>
			<td class="borderLeft"> </td>
			<td class="borderLeft borderRight"> </td>
		</tr>
		
		<tr>
			<td class="borderLeft"></td>
			<td class="simpleEntryNameCell" colspan="3">487 Produits constatés d'avance</td>
			<td class="simpleEntryCell borderLeft"> </td>
			<%if(AEMath.isNegativeAmount(AEMath.parseDouble(ds.getCreditBalance("487"), false))) {%>
				<td class="simpleEntryCellError borderLeft borderRight"><%=ds.getCreditBalance("487") %></td>
			<%} else { %>
				<td class="simpleEntryCell borderLeft borderRight"><%=ds.getCreditBalance("487") %></td>
			<%} %>
		</tr>
		
		<tr>
			<td class="simpleEntryNameCell borderLeft" colspan="4" style="height: <%=passifExtraHeight%>px">&nbsp;</td>
			<td class="simpleEntryCell borderLeft" style="height:  <%=passifExtraHeight%>px">&nbsp;</td>
			<td class="simpleEntryCell borderLeft borderRight" style="height:  <%=passifExtraHeight%>px">&nbsp;</td>
		</tr>
		
		<%-- <tr>
			<td class="totalEntryNameCell borderLeft" colspan="4">TOTAL</td>
			<td class="totalEntryCell borderLeft"> </td>
			<%
				if(totalsAreEqual){
					%>
					<td class="totalEntryCell borderRight borderLeft"><%=ds.getCreditBalance(passifList) %></td>
					<%
				} else {
					%>
					<td class="totalEntryCellError borderRight borderLeft"><%=ds.getCreditBalance(passifList) %></td>
					<%
				} 
			%>
		</tr> --%>
	</tbody>
</table>
</td>
</tr>
</table>
</div>
<table cellpadding="0" cellspacing="0" style="width: 100%;">
	<tr>
	<td style="width:48%" valign="top">
		<table border="0" cellspacing="0" cellpadding="2" width="100%">
		<tbody>
			<tr>
				<td style="width: 4%; height: 0;"></td>
				<td style="width: 3%; height: 0;"></td>
				<td style="width: 3%; height: 0;"></td>
				<td style="width: 50%; height: 0;"></td>
				<td style="width: 20%; height: 0;"></td>
				<td style="width: 20%; height: 0;"></td>
			</tr>
			<tr>
				<td class="totalEntryNameCell borderLeft" colspan="4">TOTAL</td>
				<td class="totalEntryCell borderLeft"></td>
				<%
					if(totalsAreEqual){
						%>
						<td class="totalEntryCell borderLeft borderRight"><%=ds.getDebitBalance(actifList) %></td>
						<%
					} else {
						%>
						<td class="totalEntryCellError borderLeft borderRight"><%=ds.getDebitBalance(actifList) %></td>
						<%
					} 
				%>
			</tr>
		</tbody>
		</table>
	</td>
	<td style="width:2%;">&nbsp;</td>
	<td style="width:2%;border-left-width: 2pt;border-left-style: solid; border-left-color: #292929;">&nbsp;</td>
	<td style="width:48%" valign="top">
		<table border="0" cellspacing="0" cellpadding="2" width="100%">
		<tbody>
			<tr>
				<td style="width: 4%; height: 0;"></td>
				<td style="width: 3%; height: 0;"></td>
				<td style="width: 3%; height: 0;"></td>
				<td style="width: 50%; height: 0;"></td>
				<td style="width: 20%; height: 0;"></td>
				<td style="width: 20%; height: 0;"></td>
			</tr>
			<tr>
				<td class="totalEntryNameCell borderLeft" colspan="4">TOTAL</td>
				<td class="totalEntryCell borderLeft"> </td>
				<%
					if(totalsAreEqual){
						%>
						<td class="totalEntryCell borderRight borderLeft"><%=ds.getCreditBalance(passifList) %></td>
						<%
					} else {
						%>
						<td class="totalEntryCellError borderRight borderLeft"><%=ds.getCreditBalance(passifList) %></td>
						<%
					} 
				%>
			</tr>
		</tbody>
		</table>
	</td>
</tr>
</table>
</body>
</html>