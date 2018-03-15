Ext.define('MaParoisse.model.BankStatement', {
	extend: 'MaParoisse.model.util.DomainRecord',
	fields: [{
		name: 'bankAccId',
		type: 'int'
	}, {
		name: 'bankFinalBalance',
		type: 'number'
	}, {
		name: 'bankFinalBalanceDate',
		type: 'date',
		dateFormat: 'd-m-Y'
	}]
});