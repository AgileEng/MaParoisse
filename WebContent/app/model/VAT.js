Ext.define('MaParoisse.model.VAT', {
	extend: 'MaParoisse.model.util.DomainRecord',
	fields: [{name : 'rate', type : 'number'}, 
	    	 {name : 'taxableAmount', type : 'number'}, 
	    	 {name : 'vatAmount', type : 'number'}, 
	    	 {name : 'amount', type : 'number'}, 
	    	 {name : 'category', type : 'string'}]
});