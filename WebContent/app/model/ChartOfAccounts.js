Ext.define('MaParoisse.model.ChartOfAccounts', {
	extend: 'MaParoisse.model.util.DomainRecord',
	
	fields: [{name : 'lengthG', type : 'int'}, 
	    	 {name : 'lengthA', type : 'int'},
	    	 {name : 'modelId', type : 'int', defaultValue : -1},
	    	 {name : 'accounts'}] // [AccBureau.Account]
});