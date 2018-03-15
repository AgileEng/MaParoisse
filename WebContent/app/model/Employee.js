Ext.define('MaParoisse.model.Employee', {
    extend: 'MaParoisse.model.Person',
    
    fields: [{name : 'person'}, // type : object or proxy, 'person.id is always filled' 
        	 {name : 'hasIdentityNo', type : 'boolean', defaultValue : true},
        	 {name : 'identityNo', type : 'string'},
             {name : 'salutationID', type : 'long'}, // title: {10, Mr.} {20, Mrs.} {30, Miss}
        	 {name : 'firstName', type : 'string'},
        	 {name : 'middleName', type : 'string'},
        	 {name : 'lastName', type : 'string'},
        	 {name : 'girlName', type : 'string'},
        	 {name : 'dateOfBirth', type : 'date', dateFormat : 'd-m-Y'},
        	 {name : 'placeOfBirth', type : 'string'},
        	 {name : 'nationalityTypeID', type : 'long'}, // {} {}
        	 {name : 'nationalityStr', type : 'long'},
        	 {name : 'docTypeID', type : 'long'},
        	 {name : 'docNumber', type : 'string'},
        	 {name : 'docDateOfExpiry', type : 'date', dateFormat : 'd-m-Y'},
        	 {name : 'docIssuedByStr',	type : 'string'},
        	 {name : 'address'}, // type : object, see AccBureau.DomainRecord Address
        	 {name : 'contact'}, // type : object, see AccBureau.DomainRecord Contact
        	 {name : 'leTexteBool', type : 'boolean', defaultValue : false},
        	 {name : 'dateEntry', type : 'date', dateFormat : 'd-m-Y'},
        	 {name : 'dateRelease', type : 'date', dateFormat : 'd-m-Y'},
        	 {name : 'modificationDate', type: 'date', dateFormat: 'd-m-Y'},
        	 {name : 'numberOfWeeks', type : 'long'},
        	 {name : 'contractType', type : 'long'},
        	 {name : 'reasonRelease', type : 'long'},
        	 {name : 'ftpId', type: 'long'}]
});
