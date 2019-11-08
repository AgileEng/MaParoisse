Ext.define('MaParoisse.model.AuthPrincipal', {
	extend: 'MaParoisse.model.util.DomainRecord',
	fields: [{name : 'password', type : 'string'},
	    	 {name : 'firstName', type : 'string'},
	    	 {name : 'middleName', type : 'string'},
	    	 {name : 'lastName', type : 'string'},
	    	 {name : 'fullName', type : 'string'},
	    	 {name : 'eMail', type : 'string'},
	    	 {name : 'phone', type : 'string'},
	    	 {name : 'person'}, 
	    	 {name : 'roles'},
	    	 {name : 'companies'},
	    	 {name: 'locked', type: 'boolean'},
	    	 {name: 'appType', type: 'string'}]
});