Ext.define('MaParoisse.model.AppModuleTemplate', {
	extend: 'MaParoisse.model.util.DomainRecord',
	
	fields: [{
		name: 'appModuleId',
		type: 'string'
	}, {
		name: 'appModuleNamePath',
		type: 'string'
	}, {
		name: 'appModuleCodePath',
		type: 'string'
	}, {
		name: 'financialTransactionTemplates'
	}]
});