Ext.define('MaParoisse.model.Quete', {
	requires: 'MaParoisse.model.util.DomainRecord',
	extend: 'MaParoisse.model.util.DomainRecord',
	fields: [{
		name: 'amount',
		type: 'string'
	}]
});