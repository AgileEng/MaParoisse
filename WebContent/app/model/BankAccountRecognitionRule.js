Ext.define('MaParoisse.model.BankAccountRecognitionRule', {
	extend: 'MaParoisse.model.util.DomainRecord',
	fields : [{
		name: 'codeAFB',
		type: 'string'
	}, {
		name: 'textCondition',
		type: 'string'
	}, {
		name: 'ruleConditionId',
		type: 'int'
	}, {
		name: 'bankAccountId',
		type: 'int'
	}, {
		name: 'abstractAccId',
		type: 'int'
	}, {
		name: 'accId',
		type: 'int'
	}, {
		name: 'accCode',
		type: 'string'
	}, {
		name: 'auxiliaryId',
		type: 'int'
	}, {
		name: 'auxiliaryCode',
		type: 'string'
	}, {
		name: 'isSystem',
		type: 'string'
	}, {
		name: 'isActive',
		type: 'string'
	}]
});