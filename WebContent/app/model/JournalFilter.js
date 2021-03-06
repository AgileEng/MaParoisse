Ext.define('MaParoisse.model.JournalFilter', {
	extend: 'MaParoisse.model.util.DomainRecord',
	
	fields: [{
		name: 'timeControl',
		type: 'string'
	}, {
		name: 'month',
		type: 'int'
	}, {
		name: 'year',
		type: 'int'
	}, {
		name: 'dateFrom',
		type: 'date',
		dateFormat: 'd-m-Y'
	}, {
		name: 'dateTo',
		type: 'date',
		dateFormat: 'd-m-Y'
	}, {
		name: 'amountFrom',
		type: 'string'
	}, {
		name: 'amountTo',
		type: 'string'
	}, {
		name: 'description',
		type: 'string'
	}, {
		name: 'paymentMethodId',
		type: 'int'
	}, {
		name: 'accCodeFrom',
		type: 'string'
	}, {
		name: 'accCodeTo',
		type: 'string'
	}, {
		name: 'journalCode',
		type: 'string'
	}]
});