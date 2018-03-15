Ext.define('MaParoisse.model.FinancialTransaction', {
	extend: 'MaParoisse.model.util.DomainRecord',
	
	fields: [{
		name: 'ftTemplateId',
		type: 'int'
	}, {
		name: 'dateTransaction',
		type: 'date',
		dateFormat: 'd-m-Y'
	}, {
		name: 'dateAccounting',
		type: 'date',
		dateFormat: 'd-m-Y'
	}, {
		name: 'amount',
		type: 'string'
	}, {
		name: 'bankJournal',
		type: 'int'
	}, {
		name: 'paymentMethodId',
		type: 'int'
	}, {
		name: 'natureId',
		type: 'int'
	}, {
		name: 'accJournalEntry'
	}, {
		name: 'accAccountExpIncId',
		type: 'int'
	}, {
		name: 'accExpIncAccounts',
		persist: false
	}, {
		name: 'bankAccounts',
		persist: false
	}, {
		name: 'bankAccountId',
		type: 'int'
	}, {
		name: 'contributor',
		/* important persistent should be false
		 * contributor data will be sent only 
		 * manually when needed!
		 */
		persist: false
	}, {
		name: 'quetes',
		/* important persistent should be false
		 * quetes data will be sent only 
		 * manually when needed!
		 */
		persist: false
	}, {
		name: 'supplier',
		persist: false
	}, {
		name: 'supplierName',
		type: 'string',
		mapping: 'supplier.name',
		persist: false
	}, {
		name: 'fileAttachement',
		persist: false
	}]
});