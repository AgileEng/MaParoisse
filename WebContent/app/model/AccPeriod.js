Ext.define('MaParoisse.model.AccPeriod', {
	extend: 'MaParoisse.model.util.DomainRecord',
	fields: [{
		name: 'closed',
		type: 'boolean'
	}, {
		name: 'startDate',
		type: 'date',
		dateFormat: 'd-m-Y'
	}, {
		name: 'endDate',
		type: 'date',
		dateFormat: 'd-m-Y'
	}, {
		name: 'exported',
		type: 'boolean'
	}, {
		name: 'compId',
		type: 'int'
	}]
});