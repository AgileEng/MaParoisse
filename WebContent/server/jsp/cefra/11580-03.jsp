<%@page import="eu.agileeng.domain.cefra.n11580_03.Cefra11580_03DataSource"%>
<%@page import="eu.agileeng.util.AEMath"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<%
		Cefra11580_03DataSource ds =(Cefra11580_03DataSource) request.getAttribute("cefraDataSource");
	
		String[] amountInWords = ds.amountInWords(); 
		boolean hasFraction = !AEMath.isRightOfTheDecimalPointZeroAmounnt(ds.getAmount());
		String amountSpelled = amountInWords[0] + " euro(s)" + (hasFraction ? (" et " + amountInWords[1] + " centime(s)") : "");
	%>
<!DOCTYPE body PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
</head>
<body>
	<table  border="0" cellspacing="0" cellpadding="0" width="700px">
		<tbody>
			<tr>
				<td style="width: 50%; height: 0;"></td>
				<td style="width: 20%; height: 0;"></td>
				<td style="width: 30%; height: 0;"></td>
			</tr>
			<tr>
				<td colspan="3" style="height: 5px;">&nbsp;</td>
			</tr>
			<tr>
				<td colspan="3" style="height: 5px;">&nbsp;</td>
			</tr>
			<tr>
				<td colspan="3" style="height: 5px;">&nbsp;</td>
			</tr>
			<tr>
				<td colspan="3" style="height: 5px;">&nbsp;</td>
			</tr>
			<tr>
				<td colspan="3" style="height: 5px;">&nbsp;</td>
			</tr>
			<tr>
				<td colspan="3" style="height: 5px;">&nbsp;</td>
			</tr>
<!-- 
			<tr>
				<td colspan="3" style="height: 5px;">&nbsp;</td>
			</tr>
			<tr>
				<td colspan="3" style="height: 5px;">&nbsp;</td>
			</tr>
-->
			<tr>
	 			<td>&nbsp;</td>
				<td colspan="2" style="text-align: left;" class="normTxtExt timesExt" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<%=ds.getContributorNameEx() %></td>
			</tr>
			<tr>
	 			<td>&nbsp;</td> 
				<td colspan="2" style="text-align: left;" class="normTxtExt timesExt" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<%=ds.getContributorAddress() %></td>
			</tr>
			<tr>
				<td>&nbsp;</td>
				<td colspan="2" style="text-align: left;" class="normTxtExt timesExt" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<%=ds.getContributorPostCode() %> <%=ds.getContributorCity() %></td>
			</tr>
			<tr>
				<td colspan="3" style="height: 30px;">&nbsp;</td>
			</tr>
			<tr>
				<td colspan="3" class="itTxt calibri"><%=ds.inWordSalutation()%></td>
			</tr>
			<tr>
				<td colspan="3" style="height: 30px;">&nbsp;</td>
			</tr>
			<tr>
				<td colspan="3" class="itTxt calibri">
					Monsieur le Curé et le Conseil de Fabrique vous remercient très chaleureusement pour votre soutien à votre Paroisse et vous prient de trouver ci-dessous le reçu qui vous permettra de bénéficier d’une réduction d’impôt égale à 66 % du montant de votre don ; ce reçu doit être conservé pour pouvoir être présenté en cas de demande de l’Administration fiscale.
				</td>
			</tr>
			<tr>
				<td colspan="2">&nbsp;</td>
				<!-- <td class="normTxt times" style="text-align: left; margin-top: 15px;">Curé, Président, Trésorier</td>  -->
				<td class="normTxt times" style="text-align: left; margin-top: 15px;">&nbsp;</td>
			</tr>
			<tr>
				<td colspan="3" class="scissors">
				---<SPAN style="font: 14pt 'Segoe UI Symbol';">&#x2702;</SPAN>----------------------------------------------------------------------------------------------------------------------------
				</td>
			</tr>
			<tr>
				<td colspan="3" style="height: 30px;">&nbsp;</td>
			</tr>
			<tr>
				<td colspan="2" class="receiptCell">
					<span class="header" style="font-weight:bold;">RECU DONS AUX ŒUVRES</span>
					<p class="receiptCell" style="font-size:10pt;">(Articles 200 et 238 bis du Code Général des Impôts)</p>
				</td>
				<td class=" receiptCell borderLeft borderTop borderRight" style="height: 70px; background-color: #dddddd; text-align: center; vertical-align: middle;">
					<span class="header" style="font-weight:bold;"><%=ds.getDocNumber() %></span>
				</td>
			</tr>
			<tr>
				<td colspan="3" class="receiptCell borderTop borderRight borderLeft italic bold" style="height: 60px; vertical-align: top;">
					<p  style="margin-left: 4px; margin-right: 4px;">BENEFICIAIRE : <%=
						ds.isCustomerParoisse() ? "Fabrique de la paroisse" : "Mense"%> <%=
						ds.getCustomerName() %>, <%=
						ds.getCustomerAddress() %>, <%=
						ds.getCustomerPostCode() %>, <%=
						ds.getCustomerCity() %>
					</p>
				</td>
			</tr>
			<tr>
				<td colspan="3" class="receiptCell borderTop borderRight borderLeft" style="height: 60px; vertical-align: top; text-align:justify; font-size: 12pt;">
					<p style="margin-left: 4px; margin-right: 4px;"><b>OBJET: </b> Don au profit d’un établissement public du culte d’Alsace-Moselle  (Art. 200.3 du Code Général des Impôts)</p>
				</td>
			</tr>
			<tr>
				<td colspan="3" class="receiptCell borderTop borderRight borderLeft italic bold" style="height: 60px; vertical-align: top; text-align:justify; font-size: 11pt;">
					<p  style="margin-left: 4px; margin-right: 4px;">DONATEUR : <%=ds.getContributorName() %>, <%=ds.getContributorAddress() %>, <%=ds.getContributorPostCode() %>, <%=ds.getContributorCity() %></p>
				</td>
			</tr>
			<tr>
				<td class="receiptCell borderTop borderLeft" style="height: 70px; vertical-align: top; text-align: justify; font-size: 11pt;">
					<p style="margin-left: 4px; margin-right: 4px;">La Fabrique d'Eglise (la Mense curiale) reconnaît avoir reçu à titre de don ouvrant droit à réduction d’impôt la somme de :</p>
				</td>
				<td colspan="2" class="receiptCell borderTop borderRight borderLeft italic bold" style="height: 70px; vertical-align: top; text-align:center; font-size: 12pt;">
					<p><%=ds.amountAsString()%> &euro;<br /><%=amountSpelled%></p>
				</td>
			</tr>
			<tr>
				<td class="receiptCell borderTop borderLeft" style="height: 70px; vertical-align: top; text-align:justify; font-size: 10pt;">
					<p style="margin-left: 4px; margin-right: 4px;">Date(s) de paiement : <%=ds.getDonationDate() %></p>
				</td>
				<td colspan="2" class="receiptCell borderTop borderLeft borderRight italic bold" style="height: 70px; vertical-align: top; text-align:left; font-size: 10pt;">
					<p><br />&nbsp;&nbsp;Date du reçu : <%=ds.dateToAsString()%></p>
				</td>
			</tr>
			<tr>
				<td class="receiptCell borderTop borderLeft borderBottom" style="height: 60px; vertical-align: top; text-align:justify; font-size: 10pt;">
					<p  style="margin-left: 4px; margin-right: 4px;">Mode de paiement </p><br /><br />
					<p  style="margin-left: 4px; margin-right: 4px;">Espèces <SPAN style="font: 14pt 'Segoe UI Symbol';"><%if(ds.isPayCashMethod()) { %>&#x2611;<% } else { %>&#x2610;<% }%></SPAN> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<SPAN style="font: 14pt 'Segoe UI Symbol';"><% if(ds.isPayOtherMethod()) { %>&#x2611;<% } else { %>&#x2610;<% }%></SPAN> Autres (chèques, virements, abandon de frais)</p>
				</td>
				<td colspan="2" class="receiptCell borderLeft borderRight borderBottom italic bold" style="height: 60px; vertical-align: top; text-align:center; font-size: 10pt;">
					<p><br /><br /><br />Signature</p>
				</td>
			</tr>
			<tr>
				<td colspan="3" style="height: 30px;">&nbsp;</td>
			</tr>
			<tr>
				<td colspan="3" style="font-size: 10pt; text-align: justify; font-family: 'Times New Roman'; font-style: italic;">
					Ce reçu est établi à partir d’un fichier informatique à l’usage exclusif de la Paroisse ou de la Mense curiale. En application des articles 39 et suivants de la loi du 6 janvier 1978 modifiée, vous bénéficiez d’un droit d’accès et de rectification aux informations qui vous concernent. Pour exercer ce droit vous devrez vous adresser au Président du Conseil de Fabrique de la Paroisse ou à Monsieur le Curé pour les reçus émis par la Mense curiale.
				</td>
			</tr>
			</tbody>
	</table>
</body>
</html>
