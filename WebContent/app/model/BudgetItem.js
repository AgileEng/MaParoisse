Ext.define('MaParoisse.model.BudgetItem', {
	extend: 'MaParoisse.model.Account',
	fields: [{
		name: 'amount',
		type: 'number'
	}],
	
	validate: function(options){}
});