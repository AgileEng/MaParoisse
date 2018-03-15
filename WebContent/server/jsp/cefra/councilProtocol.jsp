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
	
	CouncilMembersList ordinaryMembersCopy = new CouncilMembersList();
	ordinaryMembersCopy.addAll(ordinaryMembers);
	
	String renewalDate = "";
	if(ds.getDate() != null){
		renewalDate = AEDateUtil.formatToFrench(ds.getDate());
	}
	%>
<html>
<head><meta charset="UTF-8"></meta></head>
<body>
<table border="0" cellspacing="0" cellpadding="0" width="700px" style="margin-bottom: 5px;">
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
		<td colspan="3">
			<p style="text-align: left; font-size: 11pt;"><%=ds.getCustomerName() %></p>
		</td>
	</tr>
</table>
<p style="text-align: center; font-size: 15pt; font-weight: bold; margin-bottom: 5px;">PROCÈS VERBAL</p>
<table border="0" cellspacing="0" cellpadding="0" width="700px" style="margin-bottom: 2px;">
	<tr style="width:80%">
		<td style="text-align: center; font-size: 14px;">&nbsp;</td>
	</tr>
	<tr>
		<td style="width:20%;text-align: right; font-size: 14px;">
			année: <b><%=ds.getYear()%></b> 
		</td>
	</tr>
</table>
<p style="text-align: center; font-size: 13pt; font-weight: bold; margin-bottom: 10px;">DE LA SÉANCE DU CONSEIL DE FABRIQUE<br/> STATUANT SUR LES COMPTES DE L'EXERCICE <%=ds.getYear()%></p>

<p style="line-height:25px;text-align: justify; font-size: 10.5pt; margin-bottom: 10px;">Nous, membres du Conseil de Fabrique soussignés, certifions exacts les présents Comptes de Gestion, le bilan et les prévisions pour la nouvelle année et attestons avoir vérifié que les valeurs disponibles qui figurent au bilan sont conformes aux extraits des Banques et des Chèques Postaux et au solde du compte Caisse.</p>
<p style="line-height:25px;text-align: justify; font-size: 10.5pt; padding-left: 370px;">Fait et signé en séance, le …………………….20…..</p>
<table border="0" cellspacing="0" cellpadding="2" width="700px" style="font: 9.5pt 'Arial;border-bottom-width: 0.5pt;border-bottom-style:solid;border-bottom-color:#000000;">
	<thead>
		<tr>
			<th style="width: 33%;height:0;">
				&nbsp;
			</th>
			<th style="width: 22%;height:0;">
				&nbsp;
			</th>
			<th style="width: 23%;height:0;">
				&nbsp;
			</th>
			<th style="width: 22%;height:0;">
				&nbsp;
			</th>
		</tr>
		<tr>
			<th colspan="2" class="councilTableHeaderCell" style="font-size: 12pt; font-weight: bold;">
				MEMBRES DE DROIT ET BUREAU
			</th>
			<th colspan="2" class="councilTableHeaderCell borderRight" style="font-size: 12pt; font-weight: bold;">
				AUTRES MEMBRES DU CONSEIL
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td class="councilTableCell" style="font-size: 12pt;text-align: center;"><p>FONCTION</p></td>
			<td class="councilTableCell" style="font-size: 12pt;text-align: center;"><p>SIGNATURE</p></td>
			<td class="councilTableCell" style="font-size: 12pt;text-align: center;"><p>NOMS</p></td>
			<td class="councilTableCell borderRight" style="font-size: 12pt;text-align: center;"><p>SIGNATURES</p></td>
		</tr>
		<tr>
			<td class="councilTableCell" style="font-size: 12pt;text-align: left;"><p>&nbsp;M. <%=ds.getMemberFullName(cure) %> le curé</p></td>
			<td class="councilTableCell" style="font-size: 12pt;text-align: center;"><p>&nbsp;</p></td>
			<td class="councilTableCell" style="font-size: 10pt;text-align: left;"><p>&nbsp;
			<%
				if(ordinaryMembers.size() > 0){
					ordinaryMembersCopy.remove(0);
					out.print(ds.getMemberFullName(ordinaryMembers.get(0)));
				}
			%>
			</p></td>
			<td class="councilTableCell borderRight" style="font-size: 10pt;text-align: center;"><p>&nbsp;</p></td>
		</tr>
		<tr>
			<td class="councilTableCell" style="font-size: 12pt;text-align: left;"><p>&nbsp;M. <%=ds.getMemberFullName(maire) %> le Maire <span style="font-size: 11pt; font-style: italic;">(ou son délégué)</span></p></td>
			<td class="councilTableCell" style="font-size: 12pt;text-align: center;"><p>&nbsp;</p></td>
			<td class="councilTableCell" style="font-size: 10pt;text-align: left;"><p>&nbsp;
			<%
				if(ordinaryMembers.size() > 1){
					ordinaryMembersCopy.remove(0);
					out.print(ds.getMemberFullName(ordinaryMembers.get(1)));
				}
			%>
			</p></td>
			<td class="councilTableCell borderRight" style="font-size: 10pt;text-align: center;"><p>&nbsp;</p></td>
		</tr>
		<tr>
			<td class="councilTableCell" style="font-size: 12pt;text-align: left;"><p>&nbsp;M. <%=ds.getMemberFullName(maireAnnexe) %> le Maire <span style="font-size: 11pt; font-style: italic;">(de l’annexe)</span></p></td>
			<td class="councilTableCell" style="font-size: 12pt;text-align: center;"><p>&nbsp;</p></td>
			<td class="councilTableCell" style="font-size: 10pt;text-align: left;"><p>&nbsp;
			<%
				if(ordinaryMembers.size() > 2){
					ordinaryMembersCopy.remove(0);
					out.print(ds.getMemberFullName(ordinaryMembers.get(2)));
				}
			%>
			</p></td>
			<td class="councilTableCell borderRight" style="font-size: 10pt;text-align: center;"><p>&nbsp;</p></td>
		</tr>
		<tr>
			<td class="councilTableCell" style="font-size: 12pt;text-align: left;"><p>&nbsp;<%=ds.getMemberFullName(president) %> Président</p></td>
			<td class="councilTableCell" style="font-size: 12pt;text-align: center;"><p>&nbsp;</p></td>
			<td class="councilTableCell" style="font-size: 10pt;text-align: left;"><p>&nbsp;
			<%
				if(ordinaryMembers.size() > 3){
					ordinaryMembersCopy.remove(0);
					out.print(ds.getMemberFullName(ordinaryMembers.get(3)));
				}
			%>
			</p></td>
			<td class="councilTableCell borderRight" style="font-size: 10pt;text-align: center;"><p>&nbsp;</p></td>
		</tr>
		<tr>
			<td class="councilTableCell" style="font-size: 12pt;text-align: left;"><p>&nbsp;<%=ds.getMemberFullName(secretaire) %> Secrétaire</p></td>
			<td class="councilTableCell" style="font-size: 12pt;text-align: center;"><p>&nbsp;</p></td>
			<td class="councilTableCell" style="font-size: 10pt;text-align: left;"><p>&nbsp;
			<%
				if(ordinaryMembers.size() > 4){
					ordinaryMembersCopy.remove(0);
					out.print(ds.getMemberFullName(ordinaryMembers.get(4)));
				}
			%>
			</p></td>
			<td class="councilTableCell borderRight" style="font-size: 10pt;text-align: center;"><p>&nbsp;</p></td>
		</tr>
		<tr>
			<td class="councilTableCell" style="font-size: 12pt;text-align: left;"><p>&nbsp;<%=ds.getMemberFullName(tresorier) %> Trésorier</p></td>
			<td class="councilTableCell" style="font-size: 12pt;text-align: center;"><p>&nbsp;</p></td>
			<td class="councilTableCell" style="font-size: 10pt;text-align: left;"><p>&nbsp;
			<%
				if(ordinaryMembers.size() > 5){
					ordinaryMembersCopy.remove(0);
					out.print(ds.getMemberFullName(ordinaryMembers.get(5)));
				}
			%>
			</p></td>
			<td class="councilTableCell borderRight" style="font-size: 10pt;text-align: center;"><p>&nbsp;</p></td>
		</tr>
		<%if(ordinaryMembers.size() > 6) {
			
			for(CouncilMember member : ordinaryMembersCopy){
				%>
				<tr>
			<td class="councilTableCell" style="font-size: 12pt;text-align: left;"><p>&nbsp;</p></td>
			<td class="councilTableCell" style="font-size: 12pt;text-align: center;"><p>&nbsp;</p></td>
			<td class="councilTableCell" style="font-size: 10pt;text-align: left;"><p>&nbsp;<%=ds.getMemberFullName(member)%></p></td>
			<td class="councilTableCell borderRight" style="font-size: 10pt;text-align: center;"><p>&nbsp;</p></td>
		</tr>
				<%
			}
		}%>
	</tbody>
</table>

<p style="text-align: center; font-size: 14pt; margin-bottom: 10px;">OBSERVATIONS DE L’ÉVÊCHÉ</p>

<p style="line-height:21px;text-align: justify; font-size: 8.5pt; margin-bottom: 10px;">Rappel: Une autorisation doit être demandée avant l'engagement de travaux dont le montant à charge est égal ou supérieur à 30 500 €; pour certains travaux (orgues, aménagements intérieur…) l'avis de la commission d'art sacré est également à demander quel que soit le montant des travaux. Les formulaires sont disponibles dans Zachée, sous l'onglet BIBLIOTHEQUE / MAQUETTES UTILISABLES / Démarches de la fabrique, et sur le site du diocèse.</p>
<table border="0" cellspacing="0" cellpadding="0" width="700px" style="margin-top: 10px;">
	<%for(int j=0; j < 5; j++) { %>
	<tr>
		<td style="width:100%; height: 40px; border-bottom-width: 0.5pt; border-bottom-style: dotted; border-bottom-color: #707070;">
			&nbsp;
		</td>
	</tr>
	<%} %>
</table>

<table border="0" cellspacing="0" cellpadding="0" width="700px" style="margin-top: 30px;">
	<tr>
		<td style="width:55%">
			&nbsp;
		</td>
		<td style="width:45%">Vu, Strasbourg, le ....................20.....<p>Le réviseur aux comptes :</p></td>
	</tr>
</table>
<!-- <p style="page-break-after: always"></p> -->

<!-- <TABLE cellpadding=0 cellspacing=0 style="width:700px;"> -->
<!-- <TR> -->
<!-- 	<TD style="width:45%; margin-top: 15px;"><P style="font-weight:bold;">Commission d’Art Sacré</P></TD> -->
<!-- 	<TD style="width:55%; "><P class="p60 ft0">&nbsp;</P></TD> -->
<!-- </TR> -->
<!-- <TR> -->
<!-- 	<TD style=""><P style="padding-left: 95px;">16, rue Brûlée</P></TD> -->
<!-- 	<TD class="tr1 td100"><P class="p0 ft37">&nbsp;</P></TD> -->
<!-- </TR> -->
<!-- <TR> -->
<!-- 	<TD class="tr1 td99"><P style="padding-left: 30px;">67081 STRASBOURG CEDEX</P></TD> -->
<!-- 	<TD class="borderL borderR borderT"><P class="p0 ft37">&nbsp;</P></TD> -->
<!-- </TR> -->
<!-- <TR> -->
<!-- 	<TD><P class="p0 ft37">&nbsp;</P></TD> -->
<!-- 	<TD class="borderL borderR borderB"><P class="p134 ft72"><SPAN class="ft31">Date de rédaction </SPAN>: ....................................</P></TD> -->
<!-- </TR> -->
<!-- </TABLE> -->
<!-- <P style="font-size: 9.5pt;"><span style="font-weight:bold;line-height: 20px;">Si vous envisagez de faire des travaux, merci de compléter cette feuille de renseignements et de la renvoyer avec l’État annuel des comptes </SPAN>(un formulaire par lieu de culte) :</P> -->
<%-- <P class="p137 ft72">Paroisse ou Communauté de paroisse : <%=ds.getCustomerName() %></P> --%>
<%-- <P class="p138 ft72">Adresse : <%=ds.getCustomerAddress() %></P> --%>
<%-- <P class="p137 ft72">Curé : <%if(AEStringUtil.EMPTY_STRING.equals(ds.getMemberFullName(cure))){// 	out.print("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");// } else {	out.print(ds.getMemberFullName(cure)); --%>
<%-- } %> <SPAN style="font: 14pt 'Segoe UI Symbol';">&#x260e;</SPAN>: <%=ds.getMemberPhone(cure)%></P> --%>
<!-- <P class="p138 ft72"><SPAN style="font-weight: bold;">Eglise </SPAN>(saint patron) : ....................................................................................................................</P> -->
<!-- <P class="p138 ft72">Adresse : .......................................................................................................................................</P> -->
<%-- <P class="p137 ft72">Président du Conseil de Fabrique concerné : <b><%if(AEStringUtil.EMPTY_STRING.equals(ds.getMemberFullName(president))){out.print("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");} else {	out.print(ds.getMemberFullName(president));-->
<%-- }%></b>&nbsp;<SPAN style="font: 14pt 'Segoe UI Symbol';">&#x260e;</SPAN>:<b><%=ds.getMemberPhone(president) %></b></P> --%>
<!-- <P class="p138 ft72">Nature des travaux prévus (bref descriptif ou joindre dossier plus complet selon l’avancée du projet) :</P> -->
<!-- <P class="p139 ft72">.......................................................................................................................................................</P> -->
<!-- <P class="p140 ft72">.......................................................................................................................................................</P> -->
<!-- <P class="p140 ft72">.......................................................................................................................................................</P> -->
<!-- <P class="p137 ft72">Montant estimé :.............................................................................................................................</P> -->
<!-- <P class="p138 ft72">Plan de financement (précisant la participation propre de la fabrique)..........................................</P> -->
<!-- <P class="p139 ft72">.......................................................................................................................................................</P> -->
<!-- <P class="p140 ft72">.......................................................................................................................................................</P> -->
<!-- <P class="p138 ft72">Maîtrise d’ouvrage : ......................................................................................................................</P> -->
<!-- <P class="p137 ft72"><SPAN style="font-weight:bold;">Intervention prévue sur les orgues </SPAN>: .........................................................................................</P> -->
<!-- <P class="p140 ft72">.......................................................................................................................................................</P> -->
<!-- <P class="p139 ft72">.......................................................................................................................................................</P> -->
<!-- <P class="p140 ft72">.......................................................................................................................................................</P> -->
<!-- <P class="p137 ft72">Montant estimé :.............................................................................................................................</P> -->
<!-- <P class="p138 ft72">Expert consulté :.............................................................................................................................</P> -->
<!-- <P class="p138 ft72">Facteur d’orgue : ...........................................................................................................................</P> -->
<!-- <P class="p137 ft72">Adresse : …………………………………………………….…….. <SPAN style="font: 14pt 'Segoe UI Symbol';">&#x260e;</SPAN>: ...................................</P> -->
<!-- <TABLE cellpadding=0 cellspacing=0 style="width:700px;background-color: #CCCCCC;margin-top:10px;"> -->
<!-- <TR> -->
<!-- 	<TD class="borderT borderL" style="height:25px;vertical-align:middle;font-weight: bold;width:75%"><P style="padding-left: 30px;">Avis (après visite) de la Commission d’Art Sacré</P></TD> -->
<!-- 	<TD class="borderT borderR" style="vertical-align:middle;font-size: 8pt;"><P class="p0 ft13">ne rien inscrire dans ce cadre</P></TD> -->
<!-- </TR> -->
<!-- <TR> -->
<!-- 	<TD colspan="2" class="borderL borderR"><P class="p142 ft72">.......................................................................................................................................................</P></TD> -->
<!-- </TR> -->
<!-- <TR> -->
<!-- 	<TD colspan="2" class="borderL borderR"><P class="p142 ft72">.......................................................................................................................................................</P></TD> -->
<!-- </TR> -->
<!-- <TR> -->
<!-- 	<TD class="borderB borderL"><P class="p0 ft54">&nbsp;</P></TD> -->
<!-- 	<TD class="borderB borderR"><P class="p0 ft52">&nbsp;</P></TD> -->
<!-- </TR> -->
<!-- </TABLE> -->
<!-- <table style="width:700px;margin-top:20px;"> -->
<!-- <TR> -->
<!-- 	<TD class="tr24 td107"><P class="p143 ft13">........................................................................................................................................</P></TD> -->
<!-- </TR> -->
<!-- </table> -->
</body>
</html>