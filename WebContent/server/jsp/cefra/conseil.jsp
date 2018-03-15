<%@page import="eu.agileeng.util.AEStringUtil"%>
<%@page import="eu.agileeng.domain.cefra.n11580_03.CouncilDataSource"%>
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
<%@page import="eu.agileeng.domain.council.CouncilMember" %>
<%@page import="eu.agileeng.domain.council.CouncilMembersList" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<%
	CouncilDataSource ds =(CouncilDataSource) request.getAttribute("councilDataSource");
	CouncilMember cure = ds.getCure();
	CouncilMember maire = ds.getMaire();
	CouncilMember maireAnnexe = ds.getMaireAnnexe();
	CouncilMember president = ds.getPresident();
	CouncilMember tresorier = ds.getTresorie();
	CouncilMember secretaire = ds.getSecretaire();
	CouncilMembersList ordinaryMembers = ds.getOrdinaryMembers();
	
	String renewalDate = "";
	if(!AEStringUtil.EMPTY_STRING.equals(ds.getNextRenewalDate())){
		renewalDate = ds.getNextRenewalDate();
	}
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
	<tr>
		<td>&nbsp;</td>
		<td>
			<p style="text-align: left; font-size: 11pt; margin-bottom: 10px;">Statut</p>
		</td>
		<td colspan="2">
			<p style="text-align: left; font-size: 11pt;"><%=ds.getCustomerStatut()%></p>
		</td>
	</tr>
</table>
<p style="text-align: center; font-size: 17pt; font-weight: bold; margin-bottom: 5px;">ÉTAT ANNUEL DES COMPTES</p>
<p style="text-align: center; font-size: 9pt; margin-bottom: 10px;">( A adresser à l’archevêché en 2 ex dès adoption des comptes et avant le 31 mars)</p>
<table border="0" cellspacing="0" cellpadding="0" width="700px" style="margin-bottom: 10px;margin-top: 10px;">
	<tr>
		<td style="width: 80%">
			<p style="text-align: left; font-size: 11pt; margin-bottom: 5px;">&nbsp;<b></b></p>
		</td>
		<td style="width: 20%">
			<p style="text-align: right;font-size: 9pt'">année : <b><%=ds.getYear() %></b></p>
		</td>
	</tr>
</table>



<table border="0" cellspacing="0" cellpadding="2" width="700px" style="font: 9.5pt 'Arial;border-bottom-width: 0.5pt;border-bottom-style:solid;border-bottom-color:#000000;">
	<thead>
		<tr>
			<th class="councilTableHeaderCell" colspan="4" style="width:70%; font-size: 15pt;">
				C O N S E I L
			</th>
			<th class="councilTableHeaderCell borderRight" style="width:30%; font-size: 15pt;">
				B U R E A U
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td class="councilTableCell" style="width:30%;font-size: 12pt;text-align: center;"><p>NOM ET PRENOM</p></td>
			<td class="councilTableCell" style="width:14%;font-size: 8pt;text-align: center;"><p>Année d’entrée au Conseil si mandat en cours</p></td>
			<td class="councilTableCell" style="width:13%;font-size: 8pt;text-align: center;"><p>Année de la première élection au conseil ou fin de mandat en cours</p></td>
			<td class="councilTableCell" style="width:13%;font-size: 8pt;text-align: center;"><p>Prochaine élection au Conseil (colonne 2 + 6 ou 12 ans) :</p></td>
			<td class="councilTableCell borderRight" style="width:30%;font-size: 8pt;text-align: center;"><p>Date du dernier renouvellement :</p> <p><%=renewalDate %></p><p><i style="font-size:6.5pt;">(les mandats sont à renouveler tous les ans)</i></p></td>
		</tr>
		<tr>
			<td class="councilTableCell" style="width:30%;font-size: 10pt;font-weight:bold;"><p><%=ds.getMemberFullName(cure) %></p><div style="text-align:center;font-weight:normal;"><p>Le Curé</p></div></td>
			<td class="councilTableCell" style="width:14%;font-size: 8pt;text-align: center;background-color: #cccccc;"></td>
			<td class="councilTableCell" style="width:13%;font-size: 8pt;text-align: center;background-color: #cccccc;"></td>
			<td class="councilTableCell" style="width:13%;font-size: 8pt;text-align: center;background-color: #cccccc;"></td>
			<td class="councilTableCell borderRight" style="width:30%;font-size: 8pt;text-align: center;"></td>
		</tr>
		<tr>
			<td class="councilTableCell" style="width:30%;font-size: 10pt;font-weight:bold;"><p><%=ds.getMemberFullName(maire)%></p><div style="text-align:center;font-weight:normal;"><p>(Le maire, ou son délégué)</p></div></td>
			<td class="councilTableCell" style="width:14%;font-size: 8pt;text-align: center;background-color: #cccccc;"></td>
			<td class="councilTableCell" style="width:13%;font-size: 8pt;text-align: center;background-color: #cccccc;"></td>
			<td class="councilTableCell" style="width:13%;font-size: 8pt;text-align: center;background-color: #cccccc;"></td>
			<td class="councilTableCell borderRight" style="width:30%;font-size: 8pt;text-align: center;"></td>
		</tr>
		<tr>
			<td class="councilTableCell" style="width:30%;font-size: 10pt;font-weight:bold;"><p><%=ds.getMemberFullName(maireAnnexe)%></p><div style="text-align:center;font-weight:normal;"><p>(Le maire de l’annexe)</p></div></td>
			<td class="councilTableCell" style="width:14%;font-size: 8pt;text-align: center;background-color: #cccccc;"></td>
			<td class="councilTableCell" style="width:13%;font-size: 8pt;text-align: center;background-color: #cccccc;"></td>
			<td class="councilTableCell" style="width:13%;font-size: 8pt;text-align: center;background-color: #cccccc;"></td>
			<td class="councilTableCell borderRight" style="width:30%;font-size: 8pt;text-align: center;"></td>
		</tr>
		<tr>
			<td class="councilTableCell" style="width:30%;font-size: 10pt;font-weight:bold;"><p>1. <%=ds.getMemberFullName(president) %> </p><div style="text-align:center;font-weight:bold;"><p>(Président)</p></div></td>
			<td class="councilTableCell" style="width:14%;font-size: 8pt;text-align: center;"><%=ds.getEntryDate(president) %></td>
			<td class="councilTableCell" style="width:13%;font-size: 8pt;text-align: center;"><%=ds.getFirstElectionDate(president) %></td>
			<td class="councilTableCell" style="width:13%;font-size: 8pt;text-align: center;"><%=ds.getNextRenewalDate(president) %></td>
			<td class="councilTableCell borderRight" style="width:30%;font-size: 8pt;text-align: center;"></td>
		</tr>
		<tr>
			<td class="councilTableCell" style="width:30%;font-size: 10pt;font-weight:bold;"><p>2. <%=ds.getMemberFullName(secretaire) %> </p><div style="text-align:center;font-weight:normal;"><p>(Secrétaire)</p></div></td>
			<td class="councilTableCell" style="width:14%;font-size: 8pt;text-align: center;"><%=ds.getEntryDate(secretaire) %></td>
			<td class="councilTableCell" style="width:13%;font-size: 8pt;text-align: center;"><%=ds.getFirstElectionDate(secretaire) %></td>
			<td class="councilTableCell" style="width:13%;font-size: 8pt;text-align: center;"><%=ds.getNextRenewalDate(secretaire) %></td>
			<td class="councilTableCell borderRight" style="width:30%;font-size: 8pt;text-align: center;"></td>
		</tr>
		<tr>
			<td class="councilTableCell" style="width:30%;font-size: 10pt;font-weight:bold;"><p>3. <%=ds.getMemberFullName(tresorier) %> </p><div style="text-align:center;font-weight:normal;"><p>(Trésorier)</p></div></td>
			<td class="councilTableCell" style="width:14%;font-size: 8pt;text-align: center;"><%=ds.getEntryDate(tresorier) %></td>
			<td class="councilTableCell" style="width:13%;font-size: 8pt;text-align: center;"><%=ds.getFirstElectionDate(tresorier) %></td>
			<td class="councilTableCell" style="width:13%;font-size: 8pt;text-align: center;"><%=ds.getNextRenewalDate(tresorier) %></td>
			<td class="councilTableCell borderRight" style="width:30%;font-size: 8pt;text-align: center;"></td>
		</tr>
		<%
		int counter = 4;
		for(CouncilMember member : ordinaryMembers){
		%>
		<tr>
			<td class="councilTableCellOrdinary" style="width:30%;font-size: 10pt;font-weight:bold;"><p><%=Integer.toString(counter++) %>. <%=ds.getMemberFullName(member) %> </p></td>
			<td class="councilTableCellOrdinary" style="width:14%;font-size: 8pt;text-align: center;"><%=ds.getEntryDate(member) %></td>
			<td class="councilTableCellOrdinary" style="width:13%;font-size: 8pt;text-align: center;"><%=ds.getFirstElectionDate(member) %></td>
			<td class="councilTableCellOrdinary" style="width:13%;font-size: 8pt;text-align: center;"><%=ds.getNextRenewalDate(member) %></td>
			<td class="councilTableCellOrdinary borderRight" style="width:30%;font-size: 8pt;text-align: center;"></td>
		</tr>
		<%
		}
		%>
	</tbody>
</table>
<table border="0" cellspacing="0" cellpadding="0" width="700px" style="margin-bottom: 10px;margin-top: 35px;">
	<tr>
		<td style="width: 70%">
			<p style="text-align: left; font-size: 11pt; margin-bottom: 5px;">Adresse du Président : <b><%=ds.getMemberAddress(president) %></b></p>
		</td>
		<td style="width: 30%">
			<p style="text-align: right;font-size: 11pt'"><SPAN style="font: 14pt 'Segoe UI Symbol';">&#x260e;</SPAN> : <b><%=ds.getMemberPhone(president) %></b></p>
		</td>
	</tr>
	<tr>
		<td style="width: 70%">
			<p style="text-align: left; font-size: 11pt; margin-bottom: 5px;">Adresse Mail : <b><%=ds.getMemberEmail(president) %></b></p>
		</td>
		<td style="width: 30%">
			&nbsp;
		</td>
	</tr>
	<tr>
		<td style="width: 70%">
			&nbsp;
		</td>
		<td style="width: 30%">
			&nbsp;
		</td>
	</tr>
	<tr>
		<td style="width: 70%">
			<p style="text-align: left; font-size: 11pt; margin-bottom: 5px;">Adresse du Trésorier : <b><%=ds.getMemberAddress(tresorier) %></b></p>
		</td>
		<td style="width: 30%">
			<p style="text-align: right;font-size: 11pt'"><SPAN style="font: 14pt 'Segoe UI Symbol';">&#x260e;</SPAN> : <b><%=ds.getMemberPhone(tresorier) %></b></p>
		</td>
	</tr>
	<tr>
		<td style="width: 70%">
			<p style="text-align: left; font-size: 11pt; margin-bottom: 5px;">Adresse Mail : <b><%=ds.getMemberEmail(tresorier) %></b></p>
		</td>
		<td style="width: 30%">
			&nbsp;
		</td>
	</tr>
</table>
</body>
</html>