Ext.define('MaParoisse.model.Council', {
	extend: 'MaParoisse.model.util.DomainRecord',
	
	fields: [{
		name: 'closed',
		type: 'boolean'
	}, {
		name: 'startDate',
		type: 'date'
	}, {
		name: 'endDate',
		type: 'date'
	}, {
		name: 'members'
	}]
});