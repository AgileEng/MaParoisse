Ext.define('MaParoisse.view.saisir.FTTGridController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.fttGridCtontroller',
	
	onRender: function(){
		//TODO: load journalRecordTemplates
		//this.loadInitialData();
	},
	
	containerContextClick: function(view, e, eOpts){
		var me = this;
		var menu = Ext.create('Ext.menu.Menu', {
			items: [{
	        	text: 'Ajouter Entry',
	        	icon: null,
				glyph: 'xe083@iconFont',
				//baseCls: 'ae-ext-button-small-icon',
		        iconAlign: 'left',
	        	btnPaymentMethod: '10',
	        	scope: me,
	        	handler: me.onAddClicked
	        }]		
		});
		e.stopEvent();
	    menu.showAt(e.getXY());
	},
	
	onAddClicked: function(btn, e){
		var me = this,
			view = me.getView(),	
			ds = view.getStore(),
			newRec = Ext.create('MaParoisse.model.AccJournalEntryTemplate', {}),
			editingPlugin = view.getPlugin('fttGridEditingPlugin');
		
		//set the journalIdentificationRuleId if there is only one journal
		var journalStore = view.journalStore;
		if(journalStore.getCount() == 1){
			newRec.set('journalIdentificationRuleId', journalStore.first().get('journalIdentificationRuleId'));
		}
		
		// ds.insert(0, newRec);
		ds.add(newRec);
		editingPlugin.startEdit(newRec, 0);
	},
	
	onCheckColCheckChange: function(checkCol, rowIndex, checked, eOpts){
		if(checked){
			var me = this,
				view = me.getView(),
				ds = view.getStore();
			
			var record = ds.getAt(rowIndex);
			
			if(checkCol.dataIndex == 'dt'){
				record.set('ct', false);
			} else if(checkCol.dataIndex == 'ct'){
				record.set('dt', false);
			}
		}
	},
	
	loadInitialData: function(){
		var me = this,
			view = me.getView(),
			accJournalEntryTemplates = view.currentFTT.get('accJournalEntryTemplates');
		//TODO: load accountsStore of the view instance
		
		if(accJournalEntryTemplates){
			view.getStore().loadData(accJournalEntryTemplates);
			view.updateLayout();
		}
	},
	
	getCurrentFTT: function(){
		var me = this,
			view = me.getView();
		
		me.updateCurrentFTTFromView();
		return view.currentFTT.getDataObjectExt();
	},
	
	updateView: function(ftts){
		var me = this,
			view = me.getView();
			
		for(var i = 0; i < ftts.length; i++){
			if(ftts[i].paymentMethodId == view.currentFTT.get('paymentMethodId')){
				view.currentFTT = Ext.create('MaParoisse.model.FinancialTransactionTemplate', ftts[i]);
				break;
			}
		}
		
		view.getStore().loadData(view.currentFTT.get('accJournalEntryTemplates'));
	},
	
	updateCurrentFTTFromView: function(){
		var me = this,
			view = me.getView(),
			ds = view.getStore(),
			accJournalEntryTemplates = [];
		
		ds.each(function(rec){
			accJournalEntryTemplates.push(rec.getDataObjectExt());
		});
		
		view.currentFTT.set('accJournalEntryTemplates', accJournalEntryTemplates);
	}
});