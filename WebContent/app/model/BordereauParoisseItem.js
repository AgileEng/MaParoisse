Ext.define('MaParoisse.model.BordereauParoisseItem', {
	extend: 'MaParoisse.model.util.DomainRecord',
	
	fields: [{
		name: 'accAmount',
		type: 'number'
	}, {
		name: 'toPayAmount',
		type: 'number'
	}, {
		name: 'paidAmount',
		type: 'number'
	}, {
		name: 'currAmount',
		type: 'number'
	}]
});