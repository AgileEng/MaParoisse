Ext.define("MaParoisse.view.saisir.ModeStandart",{
    "extend": "Ext.tab.Panel",
    "controller": "saisir-modestandart",
    
    initComponent: function(){
    	var config = {
    		region: 'center',
    		items: [],
			listeners: {
				scope: 'controller',
				render: 'onRender',
				tenantChange: 'tenantChange',
				tabchange: 'onTabChange',
				beforetabchange: 'beforeTabChange',
				requestFTByAccJournalItemId: 'requestFTByAccJournalItemId',
				suppliersUpdate: 'updateSuppliers'
			}
    	};
    	
    	Ext.apply(this, config);
    	this.callParent(arguments);
    },

	isSafeToClose: function(){
		var safeToClose = true,
			tab = this.getActiveTab();

		if(Ext.isFunction(tab.isSafeToClose) && !tab.isSafeToClose()){
			safeToClose = false;
		}
		
		return safeToClose;
	}
});
