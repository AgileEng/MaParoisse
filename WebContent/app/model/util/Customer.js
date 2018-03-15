/*
 * UPDATE
 * do not use this workaround for now!!!
 * 
 */
// *Workaround!
// *When apllying convert function to a field in a model class,
// *change in these fields does not result in marking the whole
// *record as dirty. Applying dbState 2(Update) to the record in the 
// *convert function solves the problem with the overhead of always
// *updating a record no matter if the record has changed.
// *This Workaround doesn't affect other models or cases and doesn't 
// *change a framework functionality.
//*/
//function toUpper(v, record){
//	if(Ext.isDefined(v)){
//		record.set('dbState', 2);
//		return v.toUpperCase();
//	} else {
//		return '';
//	}
//}

Ext.define('MaParoisse.model.util.Customer', {
	extend: 'MaParoisse.model.util.DomainRecord',
	fields: [{name: 'paroisseStatut', type: 'string'},
	{name: 'paroisseDoyenne', type: 'string'},
	{name: 'paroisseContactPerson', type: 'string'},
	{name : 'customer', type : 'int'}, 
	{name : 'groupId', type : 'int', defaultValue : 0},
	{name : 'group', type : 'string'},
	{name : 'addressId', type : 'int'},
	{name : 'address', type : 'string'},
	{name : 'secondaryAddress', type : 'string'},
	{name : 'postCode', type : 'string'},
	{name : 'town', type : 'string'},
	{name : 'countryId', type : 'int'},
	{name : 'contactId', type : 'int'},
	{name : 'phone', type : 'string'},
	{name : 'fax', type : 'string'},
	{name : 'email', type : 'string'},
	{name : 'siren', type : 'string'},
	{name : 'nic', type : 'string'}, 
	{name : 'tva_intracon', type : 'string'},
	{name : 'agircc'}, // {id : ..., xType : ...}
	{name : 'arcco'}, // {id : ..., xType : ...}
	{name : 'conv_coll'}, // {id : ..., xType : ...}
	{name : 'urssaf'}, // {id : ..., xType : ...}
	{name : 'chartOfAccounts'}, // AccBureau.ChartOfAccounts
	{name : 'socialInfo'}, // AccBureau.SocialInfo
	{name : 'defaultClientAccCode', type : 'string'},
	{name : 'defaultSuppplierAccCode', type : 'string'},
	{name : 'defaultSuppplierFNPAccCode', type : 'string'},
	{name : 'defaultSuppplierFNPVatCode', type : 'string'},
	{name : 'defaultDiversAccCode', type : 'string'},
	{name : 'defaultCashAccCode', type : 'string'}, 
	{name : 'defaultBanqueAccCode', type : 'string'},
	{name : 'defaultBanque1AccCode', type : 'string'}, 
	{name : 'defaultBanque2AccCode', type : 'string'}, 
	{name : 'defaultTVAInAccCode', type : 'string'},
	{name : 'defaultTVAOutAccCode', type : 'string'}, 
	{name : 'defaultCashAdjAccCode', type : 'string'},
	{name : 'defaultCashAdjNegAccCode', type : 'string'},
	{name : 'startDate', type : 'date'},
	{name : 'compteGeneralId', type : 'number'},
	{name : 'compteAuxiliare', type : 'string'},
	{name : 'payTypeId', type : 'int'},
	{name : 'payDelayDuration', type : 'int'},
	{name : 'payDelayUOMId', type : 'int'},
	{name : 'tvaInVatId', type : 'number'},
	{name : 'tvaIn1VatId', type : 'number'},
	{name : 'tvaIn1AccCode', type : 'string'},
	 
	{name : 'tvaIn2VatId', type : 'number'},
	{name : 'tvaIn2AccCode', type : 'string'},
	 
	{name : 'tvaIn3VatId', type : 'number'},
	{name : 'tvaIn3AccCode', type : 'string'},
	 
	{name : 'tvaOutVatId', type : 'number'},
	{name : 'tvaOut1VatId', type : 'number'},
	{name : 'tvaOut1AccCode', type : 'string'},
	 
	{name : 'tvaOut2VatId', type : 'number'},
	{name : 'tvaOut2AccCode', type : 'string'},
	 
	{name : 'tvaOut3VatId', type : 'number'},
	{name : 'tvaOut3AccCode', type : 'string'},
	 
	{name : 'template', type : 'boolean', defaultValue : false},
	{name : 'cashAccMode', type : 'int', defaultValue : 10},
	{name : 'finYearStartDate', type : 'date', dateFormat : 'd-m-Y'},
	{name : 'finYearDuration', type : 'int', defaultValue : 12},
	{name : 'bankAccMode', type : 'int', defaultValue : 10},
	{name : 'importConnectionURL', type : 'string'},
	{name : 'externalId', type : 'number'},
	{name : 'externalSystem', type : 'string'},
	{name : 'statut', type : 'string', persist : false},
	{name : 'nature', type : 'string', persist : false}]
});