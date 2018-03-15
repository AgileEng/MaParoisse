Ext.define('MaParoisse.model.Titre', {
	extend: 'MaParoisse.model.util.DomainRecord',
	fields: [{
		name: 'qty',
		type: 'string'
	}, {
		name: 'price',
		type: 'string'
	}]
});