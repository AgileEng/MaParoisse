
Ext.define("MaParoisse.view.saisir.JournalFilter",{
    "extend": "Ext.tab.Panel",
    "controller": "saisir-journalfilter",
    
    moduleId:'30b2',
    
    initComponent: function(){
    	var config = {
    		region: 'center',
    		moduleId: this.moduleId,
    		items: [],
			listeners: {
				scope: 'controller',
				render: 'onRender',
				tenantChange: 'tenantChange',
				tabchange: 'onTabChange',
				requestFTByAccJournalItemId: 'requestFTByAccJournalItemId'
			}
    	};
    	
    	Ext.apply(this, config);
    	this.callParent(arguments);
    },

	isSafeToClose: function(){
		return true;
	}
});
