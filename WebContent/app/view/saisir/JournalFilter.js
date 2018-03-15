
Ext.define("MaParoisse.view.saisir.JournalFilter",{
    "extend": "Ext.tab.Panel",
    "controller": "saisir-journalfilter",
    
    initComponent: function(){
    	var config = {
    		region: 'center',
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
