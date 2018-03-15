Ext.define('MaParoisse.model.Contact', {
	extend: 'MaParoisse.model.util.DomainRecord',
	
	fields:[
	    {name : 'typeId', type : 'number', defaultValue : 10},
	    {name : 'phone', type : 'string'},
	    {name : 'mobile', type : 'string'},
	    {name : 'fax', type : 'string'},
	    {name : 'email', type : 'string'},
	    {name : 'homepage', type : 'string'}]

});