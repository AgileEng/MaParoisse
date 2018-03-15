Ext.define('MaParoisse.model.BudgetRealisationItem', {
	requires: 'MaParoisse.model.Account',
	extend: 'MaParoisse.model.Account',
	
	fields: [{
		name: 'budgetAmount',
		type: 'string'
	}, {
		name: 'realAmount',
		type: 'string'
	}, {
		name: 'diffAmount',
		type: 'string'
	}, {
		name: 'diffPercent',
		type: 'number'
	}, {
		name: 'accountGrouper',
		type: 'string',
		persist: false,
		calculate: function(data){
			if(data.code.length > 3){
				return data.code.substr(0, 3);
			}
		}
	}],
	
	validate: function(options){}
});