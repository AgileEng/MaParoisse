Ext.define('MaParoisse.model.AccountBalance', {
	extend: 'MaParoisse.model.Account',
	
	fields: [{
		name: 'dtAmount',
		type: 'string'
	}, {
		name: 'ctAmount',
		type: 'string'
	}],
	
	validate: function(options){
		
	}
});