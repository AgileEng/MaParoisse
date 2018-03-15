Ext.define('MaParoisse.view.saisir.FinancialTransaction', {
	extend: 'Ext.tab.Panel',

	appModuleCode: null,
	appModuleType: null,
	accountsStore: null,
	
	controller: 'ftcontroller',
	
	initComponent: function(){
		var config = {
			region: 'center',
			title: 'Title',
			items: [],
			listeners: {
				scope: 'controller',
				render: 'onRender',
				beforedestroy: 'beforeDestroy',
				tenantChange: 'tenantChange'
			}
		};
		
		Ext.apply(this, config);
		this.callParent(arguments);
	},
	
	isSafeToClose: function(callback){
		var safeToClose = true,
			items = this.items.items;
		
		for(var i = 0; i < items.length; i++){
			if(!items[i].isSafeToClose()){
				safeToClose = false;
				break;
			}
		}
		
		if(callback){
			callback();
		}
		
		return safeToClose;
	}
});