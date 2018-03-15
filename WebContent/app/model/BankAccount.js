Ext.define('MaParoisse.model.BankAccount', {
	extend: 'MaParoisse.model.util.DomainRecord',
	fields: [{name : 'iban', type : 'string'},
	    	 {name : 'rib', type : 'string'},
	    	 {name : 'bankName', type : 'string'},
	    	 {name : 'accId', type : 'int'},
	    	 {name : 'accCode', type : 'string'},
	    	 {name : 'journalId', type : 'int'},
	    	 {name : 'journalCode', type : 'string'},
	    	 {name : 'address', type : 'string'},
	    	 {name : 'contactName', type : 'string'},
	    	 {name : 'contactPhone', type : 'string'},
	    	 {name : 'contactEMail', type : 'string'},
	    	 {name : 'webSite', type : 'string'},
	    	 {name : 'entryType', type : 'number', defaultValue : 10},
	    	 {name : 'etebac', type : 'number'}]
});