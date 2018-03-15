<%@page import="eu.agileeng.domain.cefra.n11580_03.Cefra11580_03DataSource"%>
<%@page import="eu.agileeng.util.AEMath"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<%
		Cefra11580_03DataSource ds =(Cefra11580_03DataSource) request.getAttribute("cefraDataSource");
	
		String[] amountInWords = ds.amountInWords(); 
		boolean hasFraction = !AEMath.isRightOfTheDecimalPointZeroAmounnt(ds.getAmount());
	%>
<!DOCTYPE body PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<style>
td{
	border-top-width: 0pt;
	border-right-width: 0pt;
	border-bottom-width: 0pt;
	border-left-width: 0pt;
	
	border-top-color: white;
	border-right-color: white;
	border-bottom-color: white;
	border-left-color: white;
}
tr{
	border-top-width: 0pt;
	border-right-width: 0pt;
	border-bottom-width: 0pt;
	border-left-width: 0pt;
}
</style>
</head>
<body>
	<table class="MsoNormalTable" style="border-collapse: collapse;" border="0" width="707" cellspacing="0" cellpadding="0">
<tbody>
<tr style="border-top-width:0;border-bottom-width:0;border-right-width:0;border-left-width:0;">
<td style="width: 300pt; padding: 0cm 3.55pt 0cm 3.55pt;" valign="top">
<strong><span lang="FR" style="font-weight:bold;font-size: 16.0pt; font-family: 'Monotype Corsiva'; color: blue;">Cerfa</span></strong>
</td>
<td style="text-align:right">
<strong><span lang="FR" style="font-weight:bold;font-family: 'Calibri','sans-serif'; color: blue;">N&deg;</span></strong><strong><span lang="FR" style="font-weight:bold;font-size: 16.0pt; font-family: 'Monotype Corsiva'; color: blue;"> <%=ds.getDocNumber()%></span></strong>
</td>
</tr>
<tr>
<td>
<strong><span lang="FR" style="font-weight:bold;font-size: 10.0pt; font-family: 'Calibri','sans-serif'; color: blue;">N&deg; 11580*03</span></strong>
</td></tr>
<tr><td colspan="2" style="text-align: center;border-top-width:0;border-bottom-width:0;border-right-width:0;border-left-width:0;">
<p class="MsoNormal" style="text-align: center; page-break-after: avoid;" align="center"><strong><span lang="FR" style="font-weight:bold;font-size: 16.0pt; color: blue;">Re&ccedil;u au titre des dons</span></strong></p>
<p class="MsoNormal" style="text-align: center; page-break-after: avoid;" align="center"><span lang="FR" style="font-size: 10.0pt; color: blue;">(Articles 200, 238 bis du Code g&eacute;n&eacute;ral des imp&ocirc;ts)</span></p>
<p class="MsoNormal" style="text-align: center; page-break-after: avoid;" align="center"><span lang="FR" style="font-size: 10.0pt; color: blue;">&nbsp;</span></p>
</td>
</tr>
</tbody>
</table>
<table style="border: solid black 1.0pt;border-collapse: collapse;margin-bottom: 8pt;" width="707">
<tbody>
<tr>
<td style="padding: 1.0pt 1.0pt 1.0pt 1.0pt; background: #BFBFBF;border-bottom-color:#BFBFBF; border-top-color: #BFBFBF; text-align: center;">
<p class="MsoNormal" style="text-align: center; background: #BFBFBF; border: none; padding: 0cm;" align="center"><strong><span lang="FR" style="font-weight:bold;font-size: 14.0pt; color: blue;">B&eacute;n&eacute;ficiaire des versements</span></strong></p>
</td>
</tr>
<tr>
<td style="padding: 1.0pt 1.0pt 1.0pt 1.0pt;">
<p class="MsoNormal" style="text-align: justify; border: none; padding: 0cm;"><strong><span lang="FR" style="font-weight:bold;font-size: 11.0pt; color: blue;">Nom ou d&eacute;nomination :</span></strong></p>
</td>
</tr>
<tr>
<td style="text-align: center; font-size: 12.0pt">
<p class="MsoNormal" style="text-align: center; border: none; padding: 0cm;" align="center"><strong><span lang="FR" style="font-weight:bold;color: blue; letter-spacing: 1.0pt;">Fabrique Catholique Paroisse de <%=ds.getCustomerName()%></span></strong></p>
</td>
</tr>
<tr>
<td>
<p class="MsoNormal" style="text-align: justify; border: none; padding: 0cm;"><strong><span lang="FR" style="font-weight:bold;font-size: 11.0pt; color: blue;">Adresse :</span></strong></p>
</td>
</tr>
<tr>
<td style="font-weight:bold;text-align: center; font-size:12.0pt">
<p class="MsoNormal" style="text-align: center; border: none; padding: 0cm;" align="center"><strong><span lang="FR" style="color: blue; letter-spacing: 1.0pt;"><%=ds.getCustomerAddress()%></span></strong></p>
<p class="MsoNormal" style="margin-top: 1.0pt; text-align: center; border: none; padding: 0cm;" align="center"><strong><span lang="FR" style="color: blue; letter-spacing: 1.0pt;"><%=ds.getCustomerPostCode() + ' ' + ds.getCustomerCity() %></span></strong></p>
</td>
</tr>
<tr>
<td>
<p class="MsoNormal" style="text-align: justify; border: none; padding: 0cm;"><strong><span lang="FR" style="font-weight:bold;font-size: 11.0pt; color: blue;">Objet :</span></strong></p>
<p class="MsoNormal" style="margin-bottom: 1pt; text-align: justify; border: none; padding: 0cm;"><span lang="FR" style="font-size: 10.0pt; color: blue;">&nbsp;&nbsp;&nbsp; </span><span lang="FR" style="font-size: 11.0pt; font-family: Wingdings; color: blue;">&yacute;</span><span lang="FR" style="font-size: 10.0pt; color: blue;"> &nbsp;&nbsp;</span><span lang="FR" style="font-size: 11.0pt; font-family: 'Calibri','sans-serif'; color: blue;">Association cultuelle ou de bienfaisance et &eacute;tablissement public des cultes reconnu d'Alsace-Moselle</span></p>
</td>
</tr>
</tbody>
</table>
<table style="border-collapse: collapse; border: 1px solid black;" width="707">
<tbody>
<tr>
<td style="padding: 1.0pt 1.0pt 1.0pt 1.0pt; background: #BFBFBF;border-bottom-color:#BFBFBF; border-top-color: #BFBFBF; text-align: center;">
<p class="MsoNormal" style="text-align: center; background: #BFBFBF; border: none; padding: 0cm;" align="center"><strong><span lang="EN-US" style="font-weight:bold;font-size: 14.0pt; color: blue;">Donateur</span></strong></p>
</td>
</tr>
<tr>
<td style="padding: 0cm 0cm 1pt 1.0pt;">
<p class="MsoNormal" style="text-align: justify; border: none; padding: 0cm;"><strong><span lang="EN-US" style="font-weight:bold;font-size: 11.0pt; color: blue;">Nom :</span></strong></p>
</td>
</tr>
<tr>
<td style="text-align: center">
<p class="MsoNormal" style="text-align: center; border: none; padding: 0cm;" align="center"><strong><span lang="EN-US" style="font-weight:bold;font-size: 11.0pt; color: blue; letter-spacing: 1.0pt;"><%=ds.getContributorName()%></span></strong></p>
</td>
</tr>
<tr>
<td>
<p class="MsoNormal" style="text-align: justify; border: none; padding: 0cm;"><strong><span lang="FR" style="font-weight:bold;font-size: 11.0pt; color: blue;">Adresse :</span></strong></p>
</td>
</tr>
<tr style="text-align: center">
<td>
<p class="MsoNormal" style="text-align: center; border: none; padding: 0cm;" align="center"><span lang="FR" style="font-size: 11.0pt; color: blue; letter-spacing: 1.0pt;"><%=ds.getContributorAddress()%></span></p>
<p class="MsoNormal" style="margin-top: 1pt; text-align: center; border: none; padding: 0cm;" align="center"><strong><span lang="FR" style="font-weight:bold;font-size: 11.0pt; color: blue; letter-spacing: 1.0pt;"><%=ds.getContributorPostCode() + ' ' + ds.getContributorCity()%></span></strong></p>
</td>
</tr>
</tbody>
</table>
<table style="border-collapse: collapse; border: 1px solid black;" width="707">
<tbody>
<tr>
<td><span lang="FR" style="font-size: 11.0pt; font-family: 'Calibri','sans-serif'; color: blue;">Le b&eacute;n&eacute;ficiaire reconna&icirc;t avoir re&ccedil;u au titre des versements ouvrant droit &agrave; r&eacute;duction d'imp&ocirc;t, la somme de : </span></td>
</tr>
<tr>
<td style="text-align: center; font-size: 12.0pt; font-weight: bold"><strong><span lang="FR" style="font-weight:bold;font-size: 11.0pt; font-family: 'Calibri','sans-serif'; color: blue;"><%=ds.amountAsString()%>-</span></strong><strong><span lang="FR" style="font-weight:bold;font-size: 11.0pt; font-family: 'Calibri','sans-serif'; color: blue;">&euro;</span></strong></td>
</tr>
<tr>
<td><span lang="FR" style="font-size: 11.0pt; font-family: 'Calibri','sans-serif'; color: blue;">Somme en toutes lettres :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><span lang="FR" style="font-size: 10.0pt; color: blue;"><%=amountInWords[0] + " euro(s)" + (hasFraction ? (" et " + amountInWords[1] + " centime(s)") : "")%></span><span lang="FR" style="font-size: 11.0pt; font-family: 'Calibri','sans-serif'; color: blue;"></span></td>
</tr>
<tr>
<td><strong><span lang="FR" style="font-weight:bold;font-size: 11.0pt; font-family: 'Calibri','sans-serif'; color: blue;">Date du versement&nbsp;:</span></strong><span lang="FR" style="font-size: 11.0pt; font-family: 'Calibri','sans-serif'; color: blue;">&nbsp;&nbsp;&nbsp;&nbsp; <%=ds.getDonationDate()%> </span></td>
</tr>
</tbody>
</table>
<table style="border-collapse: collapse; border: 1px solid black;" width="707">
<tbody>
<tr>
<td>
<div style="padding: 0cm 1.0pt 0cm 1.0pt;">
<p class="MsoNormal" style="text-align: justify; border: none; padding: 0cm;"><strong><span lang="FR" style="font-weight:bold;font-size: 11.0pt; font-family: 'Calibri','sans-serif'; color: blue;">Forme du don:</span></strong></p>
<p class="MsoNormal" style="text-align: justify; border: none; padding-left: 2.5cm;"><span lang="FR" style="font-size: 11.0pt; color: blue;"></span><span lang="FR" style="font-size: 11.0pt; font-family: Wingdings; color: blue;">&yacute;</span><span lang="FR" style="font-size: 11.0pt; color: blue;"> D&eacute;claration de don manuel&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></p>
</div>
</td>
</tr>
</tbody>
</table>
<table style="border-collapse: collapse; border: 1px solid black;" width="707">
<tbody>
<tr>
<td>
<div style="padding: 1.0pt 1.0pt 1.0pt 1.0pt;">
<p class="MsoNormal" style="margin-bottom: 5.65pt; text-align: justify; border: none; padding: 0cm;"><strong><span lang="FR" style="font-weight:bold;font-size: 11.0pt; font-family: 'Calibri','sans-serif'; color: blue;">Nature du don:</span></strong></p>
<p class="MsoNormal" style="text-align: justify; border: none; padding-left: 2.5cm;"><span lang="FR" style="font-size: 11.0pt; font-family: Wingdings; color: blue;"><%/*if(eu.agileeng.domain.cefra.n11580_03.Cefra11580_03Request.Nature.Cashe.equals(ds.getNature())){out.print("&yacute;");}else */{out.print("o");} %></span><span lang="FR" style="font-size: 11.0pt; color: blue;"> Num&eacute;raire&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
<span lang="FR" style="font-size: 11.0pt; font-family: Wingdings; color: blue;"><%/*if(eu.agileeng.domain.cefra.n11580_03.Cefra11580_03Request.Nature.Other.equals(ds.getNature())){out.print("&yacute;");}else */{out.print("o");} %></span><span lang="FR" style="font-size: 11.0pt; color: blue;"> Autre (1)&nbsp;: </span></p>
<p class="MsoNormal" style="text-align: justify; border: none; padding: 0cm;"><span lang="FR" style="font-size: 10.0pt; color: blue;">(1) notamment, abandon de frais engag&eacute;s par les b&eacute;n&eacute;voles</span></p>
</div>
</td>
</tr>
</tbody>
</table>
<table style="border: 1px solid black; border-collapse: collapse;" width="707">
<tbody>
<tr>
<td>
<div style="border-top: none; padding: 0cm 1.0pt 1.0pt 1.0pt;">
<p class="MsoNormal" style="margin-bottom: 2pt; text-align: justify; border: none; padding: 0cm;"><strong><span lang="FR" style="font-weight:bold;font-size: 11.0pt; font-family: 'Calibri','sans-serif'; color: blue;">En cas de don en num&eacute;raire, mode de versement du don:</span></strong></p>
<p class="MsoNormal" style="text-align: justify; border: none;padding-left: 2.5cm;"><span lang="FR" style="font-size: 11.0pt; font-family: Wingdings; color: blue;"><%/*if(eu.agileeng.domain.cefra.n11580_03.Cefra11580_03Request.Nature.Cashe.equals(ds.getNature()) && eu.agileeng.domain.cefra.n11580_03.Cefra11580_03Request.PaymentMethod.Cashe.equals(ds.getPaymentMethod())){out.print("&yacute;");}else */{out.print("o");} %></span><span lang="FR" style="font-size: 11.0pt; color: blue;"> Remise d'esp&egrave;ces&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span><span lang="FR" style="font-size: 11.0pt; font-family: Wingdings; color: blue;"><%/*if(eu.agileeng.domain.cefra.n11580_03.Cefra11580_03Request.Nature.Cashe.equals(ds.getNature()) && eu.agileeng.domain.cefra.n11580_03.Cefra11580_03Request.PaymentMethod.Check.equals(ds.getPaymentMethod())){out.print("&yacute;");}else */{out.print("o");} %></span><span lang="FR" style="font-size: 11.0pt; color: blue;"> Ch&egrave;que &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></p>
<p class="MsoNormal" style="text-align: justify; border: none; padding: 0cm;"><span lang="FR" style="font-size: 10.0pt; color: blue;">&nbsp;</span></p>
</div>
</td>
</tr>
</tbody>
</table>
<p class="MsoNormal" style="text-align: center; margin: 0cm -.05pt .0001pt 279.7pt;" align="center">&nbsp;</p>
<p class="MsoNormal" style="text-align: center; margin: 0cm -.05pt .0001pt 279.7pt;" align="center"><span lang="FR" style="font-size: 11.0pt; font-family: 'Calibri','sans-serif'; color: blue;">Date et signature:</span></p>
<p class="MsoNormal" style="text-align: center; margin: 0cm -.05pt .0001pt 279.7pt;" align="center"><span lang="FR" style="font-size: 10.0pt; color: blue;">&nbsp;</span></p>
<table width="707">
<tbody>
<tr>
<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
<td style="border: solid black 1.0pt; padding: 1.0pt 1.0pt 1.0pt 1.0pt; margin-left: 279.7pt; margin-right: -.05pt;">
<p class="MsoNormal" style="text-align: center; border: none; padding: 0cm;" align="center"><span lang="FR" style="font-size: 10.0pt; color: blue;">&nbsp;</span></p>
<p class="MsoNormal" style="border: none; padding: 0cm;"><span lang="FR" style="font-size: 11.0pt; color: blue;">Le <%=ds.dateToAsString()%></span></p>
<p class="MsoNormal" style="text-align: center; border: none; padding: 0cm;" align="center"><span lang="FR" style="font-size: 10.0pt; color: blue;">&nbsp;</span></p>
<p class="MsoNormal" style="text-align: center; border: none; padding: 0cm;" align="center"><span lang="FR" style="font-size: 10.0pt; color: blue;">&nbsp;</span></p>
<p class="MsoNormal" style="text-align: center; border: none; padding: 0cm;" align="center"><span lang="FR" style="font-size: 10.0pt; color: blue;">&nbsp;</span></p>
<p class="MsoNormal" style="text-align: center; border: none; padding: 0cm;" align="center"><span lang="FR" style="font-size: 10.0pt; color: blue;">&nbsp;</span></p>
</td>
</tr>
</tbody>
</table>
</body>
</html>
