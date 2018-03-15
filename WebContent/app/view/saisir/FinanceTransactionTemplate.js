Ext.define('MaParoisse.view.saisir.FinanceTransactionTemplate', {
	extend: 'Ext.tab.Panel',
	requires: ['MaParoisse.model.AppModuleTemplate',
	           'MaParoisse.model.FinancialTransactionTemplate'],
	
	controller: 'fttcontroller',
	
	//configurable vars
	appModuleTemplate: null,
	appModuleType: null,
	accounts: [],
	moduleId: null,
	
	region: 'center',
	
	initComponent: function(){		
		var config = {
			tabStretchMax: true,
			frame: true,
			frameHeader: true,
			tbar: [{
				icon: null,
				glyph: 'xe170@iconFont',
				baseCls: 'ae-ext-button-small-icon',
		        scale: 'small',
		        iconAlign: 'top',
		        text: 'Enregistrer le guide',
		        handler: 'onSaveClicked'
		    }, {
		    	icon: null,
				glyph: 'xe08c@iconFont',
				baseCls: 'ae-ext-button-small-icon',
		        scale: 'small',
		        iconAlign: 'top',
		        text: 'Créer un guide',
		        handler: 'onAddClicked'
		    }, '-',{
		    	icon: null,
				glyph: 'xe083@iconFont',
				baseCls: 'ae-ext-button-small-icon',
		        scale: 'small',
		        iconAlign: 'top',
		        text: 'Ajouter une ligne',
		        handler: 'onAddEntryClicked'
		    }],
			listeners: {
				scope: 'controller',
				beforeadd: 'beforeAdd',
				render: 'onRender'
			},
			items: []
		};
		
		Ext.apply(this, config);
		this.callParent(arguments);
	},
	
	isSafeToClose: function(callback){
		var ftts = this.items.items,
			safeToClose = true;
		
		for(var i = 0; i < ftts.length; i++){
			if(!ftts[i].isSafeToClose()){
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