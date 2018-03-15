Ext.define('MaParoisse.model.FinancialTransactionTemplate', {
	extend: 'MaParoisse.model.util.DomainRecord',
	
	fields:[{
		name: 'paymentMethodId',
		type: 'int'
	}, {
		name: 'accJournalEntryTemplates'
	}]
});