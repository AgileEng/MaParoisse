<%@page import="eu.agileeng.domain.cefra.n11580_03.BordereauParoisseDataSource"%>
<%@page import="eu.agileeng.domain.cefra.n11580_03.Cefra11580_03DataSource"%>
<%@page import="eu.agileeng.util.AEMath"%>
<%@page import="eu.agileeng.domain.AccAccountBalancesList"%>
<%@page 
	import = "eu.agileeng.domain.acc.AccAccountBalance"
	import = "java.lang.StringBuilder"
	import = "java.lang.Math"
	import = "eu.agileeng.util.AEMath"
%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<%
	BordereauParoisseDataSource ds =(BordereauParoisseDataSource) request.getAttribute("bordereauParoisseDataSource");
	%>
<html>
<head></head>
<body>
<div style="border-top: 3.0pt; border-left: 1.0pt; border-bottom: 3.0pt; border-right: 1.0pt; border-color: windowtext; border-style: solid; padding: 1.0pt 4.0pt 1.0pt 4.0pt; margin-left: 0cm; margin-right: 14.15pt;">
<p class="MsoTitle" style="border: none; padding: 0cm;"><strong><span lang="FR" style="font-size: 14.0pt; font-family: 'Calibri','sans-serif';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BORDEREAU DES SOMMES REVERSEES A L&rsquo;ARCHEVECHE AU TITRE DE L&rsquo;ANNEE <%= ds.getYear() %></span></strong></p>
</div>
<p class="MsoNormal" style="margin-top: 2pt;"><span lang="FR" style="font-size: 8.0pt; font-family: 'Calibri','sans-serif';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><span style="text-decoration: underline;"><span lang="FR" style="font-size: 9.0pt; font-family: 'Calibri','sans-serif';">R&eacute;serv&eacute; &agrave; la Comptabilit&eacute;</span></span></p>
<p class="MsoNormal" style="margin: 10pt 0cm 6.0pt 0cm;"><span style="text-decoration: underline;"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">PAROISSE</span></span><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><strong><span lang="FR" style="font-size: 14.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getCustomerName() %></span></strong><span lang="FR" style="font-size: 9.0pt; font-family: 'Calibri','sans-serif';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<em>N&deg; de Versement&nbsp;:&nbsp;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;.</em></span></p>
<p class="MsoNormal" style="margin-bottom: 3.0pt;"><span style="text-decoration: underline;"><span lang="FR" style="font-size: 14.0pt; font-family: 'Calibri','sans-serif';">Code paroisse</span></span> <span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><strong><span lang="FR" style="font-size: 14.0pt; font-family: 'Calibri','sans-serif';"><%=ds.getCustomerCode()%></span></strong><em><span lang="FR" style="font-size: 9.0pt; font-family: 'Calibri','sans-serif';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></em></p>
<p class="MsoNormal" style="text-indent: 4.0cm;"><span lang="FR" style="font-size: 9.0pt; font-family: 'Calibri','sans-serif';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></p>
<table class="MsoNormalTable" style="border-collapse: collapse; border: none;" border="1" cellspacing="0" cellpadding="0" width="700px">
<tbody>
<tr style="height: 15.45pt;">
<td style="vertical-align:middle;width: 300px; border: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: center;">
<h3 style="page-break-after: auto;"><strong><span lang="FR" style="font-weight: bold; font-size: 11.0pt; font-family: 'Calibri','sans-serif'; text-transform: uppercase;text-align: center;">Type de qu&ecirc;te</span></strong></h3>
</td>
<td style="vertical-align:middle;width: 250px; border: solid windowtext 1.0pt; border-left: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: center;">
<h3 style="margin-right: -10.55pt; page-break-after: auto;"><strong><span lang="FR" style="font-weight: bold; font-size: 11.0pt; font-family: 'Calibri','sans-serif'; text-transform: uppercase;text-align: center;">Date ou p&eacute;riode de collecte</span></strong></h3>
</td>
<td style="vertical-align:middle;width: 50px; border: solid windowtext 1.0pt; border-left: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt; width: 50px;text-align: center;">
<p class="MsoNormal" style="text-align: center;" align="center"><strong><span lang="FR" style="font-weight: bold; font-size: 11.0pt; font-family: 'Calibri','sans-serif'; text-transform: uppercase;text-align: center;">Code qu&ecirc;te</span></strong></p>
</td>
<td style="vertical-align:middle;width: 100px; border: solid windowtext 1.0pt; border-left: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: center;">
<h3 style="page-break-after: auto;"><strong><span lang="FR" style="font-weight: bold; font-size: 11.0pt; font-family: 'Calibri','sans-serif'; text-transform: uppercase;text-align: center;">Montant</span></strong></h3>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<h1 style="page-break-after: auto;"><span lang="FR" style="font-size: 12.0pt;font-family: 'Calibri','sans-serif';">Missions d&rsquo;Afrique</span></h1>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><strong><em><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Dimanche de l&rsquo;&eacute;piphanie</span></em></strong><span lang="FR" style="font-family: 'Calibri','sans-serif';"> &nbsp;&nbsp;&nbsp;&nbsp; <br /></span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: center;vertical-align: middle; ">
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">07</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;">
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("07")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Sainte Enfance</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><strong><em><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Cr&egrave;che</span></em></strong><span lang="FR" style="font-size: 9.0pt; font-family: 'Calibri','sans-serif';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: center;vertical-align: middle; ">
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">11</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;">
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("11")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style=" border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Grande Qu&ecirc;te Dioc&eacute;saine</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><span lang="FR" style="font-size: 12.0pt;font-family: 'Calibri','sans-serif';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <br /></span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: center;vertical-align: middle; ">
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">01</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;">
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("01")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<h1><span lang="FR" style="font-size: 12.0pt;font-family: 'Calibri','sans-serif';">Terre Sainte</span></h1>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><strong><em><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Vendredi Saint</span></em></strong><span lang="FR" style="font-size: 9.0pt; font-family: 'Calibri','sans-serif';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: center;vertical-align: middle; ">
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">09</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;">
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("09")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Denier de St Pierre</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: 3.6pt;"><strong><em><span lang="FR" style="font-size: 12.0pt;font-family: 'Calibri','sans-serif';">P&acirc;ques</span></em></strong><em><span lang="FR" style="font-family: 'Calibri','sans-serif';">&nbsp; </span></em><span lang="FR" style="font-family: 'Calibri','sans-serif';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <br /></span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt; text-align: center;vertical-align: middle;" >
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">08</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("08")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Communication dioc&eacute;saine &ndash; Alsace Media</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><strong><em><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">7<sup>&egrave;me</sup> dimanche de P&acirc;ques</span></em></strong><span lang="FR" style="font-size: 9.0pt; font-family: 'Calibri','sans-serif';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: center;vertical-align: middle; ">
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">13</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;">
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("13")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Apostolat des La&iuml;cs et Cat&eacute;ch&egrave;se</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><strong><em><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Pentec&ocirc;te</span></em></strong><span lang="FR" style="font-size: 9.0pt; font-family: 'Calibri','sans-serif';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt; text-align: center;vertical-align: middle;" >
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">03</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("03")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Dimanche des Missions</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoHeader" style="margin-right: -10.55pt;"><span lang="FR" style="font-size: 12.0pt;font-family: 'Calibri','sans-serif';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <br /></span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt; text-align: center;vertical-align: middle;">
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">06</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;">
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("06")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;" >
<h1><span lang="FR" style="font-size: 12.0pt;font-family: 'Calibri','sans-serif';">Propagation de la Foi</span></h1>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">&nbsp;</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: center;vertical-align: middle; " >
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">10</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("10")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Saint Pierre Ap&ocirc;tre</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">&nbsp;</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: center;vertical-align: middle; " >
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">12</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("12")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Liturgie, Musique et Art Sacr&eacute;s</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><span lang="FR" style="font-size: 12.0pt;font-family: 'Calibri','sans-serif';">&nbsp;<br /></span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: center;vertical-align: middle; ">
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">24</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;">
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("24")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Taxes mariages et enterrements (20,-&euro;), confirmations, dispenses&hellip;</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">&nbsp;</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: center;vertical-align: middle; ">
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">14</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("14")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;" >
<p class="MsoNormal" style="text-align: justify;"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">2% sur les revenus de la Fabrique d&rsquo;&eacute;glise de l&rsquo;ann&eacute;e dernière</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">&nbsp;</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt; text-align: center;vertical-align: middle;">
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">15</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("15")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;" >
<p class="MsoNormal" style="text-align: justify;"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">20% sur qu&ecirc;tes de mariages et enterrements r&eacute;alis&eacute;s au cours de l&rsquo;ann&eacute;e courante</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">&nbsp;</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt; text-align: center;vertical-align: middle;">
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">16</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("16")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">D&eacute;corations (dioc&eacute;saines ou romaines)</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">&nbsp;</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt; text-align: center;vertical-align: middle;" >
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">18</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("18")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Binages vers&eacute;s par la paroisse</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">&nbsp;</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: center;vertical-align: middle; " >
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">19</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("19")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Pr&eacute;l&egrave;vements sur messes vers&eacute;s par la paroisse (2,- &euro;)</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">&nbsp;</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: center;vertical-align: middle; " >
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">20</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("20")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Honoraires de messes &agrave; faire c&eacute;l&eacute;brer</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">&nbsp;</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: center;vertical-align: middle; " >
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">22</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("22")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">PAX CHRISTI</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">&nbsp;</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: center;vertical-align: middle; " >
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">04</span></p>
</td>
<td style="border: none; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("04")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Pastorale des Jeunes, &hellip;</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">&nbsp;</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: center;vertical-align: middle; " >
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">17</span></p>
</td>
<td style="border: none; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumAsString("17")%></span></p>
</td>
</tr>
<tr style="height: 18.45pt;">
<td style="border: solid windowtext 1.0pt; border-top: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Divers (&agrave; pr&eacute;ciser)</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;vertical-align: middle;">
<p class="MsoNormal" style="margin-right: -10.55pt;"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">&nbsp;</span></p>
</td>
<td style="border-top: none; border-left: none; border-bottom: solid windowtext 1.0pt; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: center;vertical-align: middle;" >
<p class="MsoNormal" style=" text-align: right;" align="right"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">&nbsp;</span></p>
</td>
<td style="border-top: solid windowtext 1.0pt; border-left: none; border-bottom: none; border-right: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 18.45pt;text-align: right;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">&nbsp;</span></p>
</td>
</tr>
<tr style="page-break-inside: avoid; height: 19.55pt;">
<td style="border: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 19.55pt;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">&nbsp;</span></p>
</td>
<td style=" border: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 19.55pt;vertical-align: middle;" colspan="2">
<h2 style="text-align: center; page-break-after: auto; margin: 0cm -10.55pt .0001pt 3.5pt;" align="center"><span lang="FR" style="font-size: 14.0pt; font-family: 'Calibri','sans-serif';">TOTAL&nbsp;:</span></h2>
</td>
<td style="border: solid windowtext 3.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 19.55pt;vertical-align: middle;text-align:right" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= ds.getSumTotalAsString() %></span></p>
</td>
</tr>
<%
	if(ds.getAccAccountBalances() != null && !ds.getAccAccountBalances().isEmpty()) {
		AccAccountBalancesList bl = ds.getAccAccountBalances();
		for (AccAccountBalance b : bl) {
			StringBuilder sb = new StringBuilder("Dont ")
				.append(b.getAccAccount().getDescriptor().getName())
				.append(" (compte ")
				.append(b.getAccAccount().getDescriptor().getCode())
				.append(")");
%>
<tr style="page-break-inside: avoid; height: 19.55pt;">
<td style="border: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 19.55pt;vertical-align: middle;" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">&nbsp;</span></p>
</td>
<td style=" border: none; padding: 0cm 3.5pt 0cm 3.5pt; height: 19.55pt;vertical-align: middle;" colspan="2">
<h2 style="text-align: center; page-break-after: auto; margin: 0cm -10.55pt .0001pt 3.5pt;" align="center"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= sb.toString() %>&nbsp;</span></h2>
</td>
<td style="border: solid windowtext 1.0pt; padding: 0cm 3.5pt 0cm 3.5pt; height: 19.55pt;vertical-align: middle;text-align:right" >
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';"><%= AEMath.toAmountFrenchString(Math.abs(b.getFinalBalance())) %></span></p>
</td>
</tr>
<%			
		}
	}
%>
</tbody>
</table>
<p class="MsoNormal"><span style="text-decoration: underline;"><span lang="FR" style="margin-top: 10pt; font-size: 14.0pt; font-family: 'Calibri','sans-serif';">Mode et date de versement</span></span><span lang="FR" style="font-size: 14.0pt; font-family: 'Calibri','sans-serif';">&nbsp;:</span></p>
<p class="MsoBodyTextIndent" style="margin-left: 28.05pt; text-indent: -28.05pt;"><span lang="FR" style="font-family: Wingdings;">q<span style="font: 7.0pt 'Times New Roman';">&nbsp;&nbsp; </span></span><span lang="FR" style="font-family: 'Calibri','sans-serif';">Je joins &agrave; ce bordereau <span style="text-decoration: underline;">un</span> ch&egrave;que bancaire ou postal de.................. &hellip;&hellip;&hellip;&hellip;&hellip; <strong>Euros</strong></span></p>
<p class="MsoNormal"><span lang="FR" style="font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Fait &agrave; &hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip; le &hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;.</span></p>
<table width="700px" style="border-collapse: collapse; border: 0px solid white;" border="0" cellspacing="0" cellpadding="0"><tr><td class="noborder" style="width:48 0px; height:20px">&nbsp;</td><td class="noborder"><p class="MsoNormal"><strong><span lang="FR" style="text-align: right; font-size: 12.0pt; font-family: 'Calibri','sans-serif';">Destinataire</span></strong></p></td></tr><tr style="border: 1px solid #ffffff"><td class="noborder" border="1px solid #ffffff" width="480px">&nbsp;</td><td style="border: 1px solid black;">
<p class="MsoNormal" style="text-align: center; border: none; padding: 0cm;" align="center"><span lang="FR" style="font-family: 'Calibri','sans-serif';">&nbsp;ARCHEVECHE DE STRASBOURG</span></p>
<p class="MsoNormal" style="text-align: center; border: none; padding: 0cm;" align="center"><span lang="FR" style="font-family: 'Calibri','sans-serif';">&nbsp;Service comptabilité</span></p>
<p class="MsoNormal" style="text-align: center; border: none; padding: 0cm;" align="center"><span lang="FR" style="font-family: 'Calibri','sans-serif';">&nbsp;16, Rue Brûlée</span></p>
<p class="MsoNormal" style="text-align: center; border: none; padding: 0cm;" align="center"><span lang="FR" style="font-family: 'Calibri','sans-serif';">&nbsp;67081 STRASBOURG CEDEX</span></p>
<p class="MsoNormal" style="text-align: center; border: none; padding: 0cm;" align="center"><span lang="FR" style="font-family: 'Calibri','sans-serif';">&nbsp;Tél: 03 88 21 24 54</span></p>
<p class="MsoNormal" style="text-align: center; border: none; padding: 0cm;" align="center"><span lang="IT" style="font-family: 'Calibri','sans-serif';">&nbsp;Courriel: compta@archeveche-strasbourg.fr</span></p>
</td></tr>
</table>
</body>
</html>