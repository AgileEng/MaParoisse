Ext.define('MaParoisse.model.Address', {
	extend: 'MaParoisse.model.util.DomainRecord',
	
	fields: [{name : 'address', type : 'string'},
	 {name : 'secondaryAddress', type : 'string'},
	 {name : 'postCode', type : 'string'},
	 {name : 'town', type : 'string'},
	 {name : 'countryId', type : 'number'}]

});