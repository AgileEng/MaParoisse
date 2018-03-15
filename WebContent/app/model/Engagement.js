Ext.define('MaParoisse.model.Engagement', {
	extend: 'MaParoisse.model.util.DomainRecord',
	fields: [{
		name: 'date',
		type: 'date',
		dateFormat: 'd-m-Y'
	}, {
		name: 'amountInitial',
		type: 'string'
	}, {
		name : 'duration',
		type: 'string'
	}, {
		name : 'amountDueYearly',
		type: 'string'
	}, {
		name: 'amountDueMonthly',
		type: 'string'
	}]
});