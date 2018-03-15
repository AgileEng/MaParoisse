Ext.define('MaParoisse.model.Person', {
    extend: 'Ext.data.Model',
    
    fields: [{name : 'identityNo', type : 'string'},
             {name : 'salutationID', type : 'int'}, // title: {10, Mr.} {20, Mrs.} {30, Miss}
        	 {name : 'firstName', type : 'string'},
        	 {name : 'middleName', type : 'string'},
        	 {name : 'lastName', type : 'string'},
        	 {name : 'girlName', type : 'string'},
        	 {name : 'position', type : 'position'},
        	 {name : 'dateOfBirth', type : 'date', dateFormat : 'd-m-Y'},
        	 {name : 'placeOfBirth', type : 'string'},
        	 {name : 'nationalityTypeID', type : 'int'}, // {} {}
        	 {name : 'nationalityStr', type : 'int'},
        	 {name : 'docTypeID', type : 'int'},
        	 {name : 'docNumber', type : 'string'},
        	 {name : 'docDateOfExpiry', type : 'date', dateFormat : 'd-m-Y'},
        	 {name : 'docIssuedByStr',	type : 'string'},
        	 {name : 'address'}, // type : object, see AccBureau.DomainRecord Address
        	 {name  : 'contact'}, // type : object, see AccBureau.DomainRecord Contact
        	 {name : 'leTexteBool', type : 'boolean', defaultValue : false}]
});
