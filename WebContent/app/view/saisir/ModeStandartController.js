Ext.define('MaParoisse.view.saisir.ModeStandartController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.saisir-modestandart',
    
    onRender: function(){
    	/*
		 * temporal fix for Chrome
		 */
		Ext.apply(Ext.util.Format, {
            thousandSeparator: ' ',
            decimalSeparator: ',',
            currencySign: ' ',
            dateFormat: 'd/m/Y'
        });
    	
    	this.loadInitialData();
    },
    
    tenantChange: function(){   
    	this.releaseResources();
    	this.loadInitialData();
    },
    
    beforeTabChange: function(tabpanel, newTab, oldTab, eOpts){
    	if(Ext.isDefined(oldTab) && oldTab != null && Ext.isFunction(oldTab.isSafeToClose) && !oldTab.isSafeToClose()){

    		Ext.create('MaParoisse.lib.MessageBox', {
    			//header: false,
    			title: 'Zachée',
    			formHeight: 140,
    			message: 'Vous vous apprêtez à quitter ce module sans sauvegarder. Les données saisies seront perdues. <br/><br/>Etes vous sur de vouloir poursuivre?',
    			type: MaParoisse.lib.MessageBox.QUESTION,
    			callback: {
    				fn: function(btnId, p){
		            	if(btnId == MaParoisse.lib.MessageBox.YES){
		            		tabpanel.suspendEvent('beforetabchange');
		            		tabpanel.setActiveTab(newTab);
		            		tabpanel.resumeEvent('beforetabchange');
		            	} else {
		            		//do nothing
		            	}
    				}
    			}
    		});
    		
    		return false;
    	}
    },
    
    onTabChange: function(tabpanel, newTab, oldTab, eOpts){
    	/*if(oldTab && oldTab.getXType() != 'financialtransactiontab'){
    		//oldTab.getController().releaseGrid();
    	}
    	
    	if(newTab && newTab.getXType() != 'financialtransactiontab'){
    		//newTab.getController().onFilterClicked();
    	}*/
    	if(newTab.rendered){
    		newTab.getController().onFilterClicked();
    	}
    },
    
    requestFTByAccJournalItemId: function(accJournalItemId){
		var me = this;
		
		MaParoisse.app.getController('AppModuleUtil').createFTTByAccJournalItemId(accJournalItemId, true, me.loadFTTabIntoView, me);
    },
    
    loadFTTabIntoView: function(ftTab, controller){
    	var me = controller,
    		view = me.getView();
    	
    	if(ftTab != null){
			view.add(ftTab);
			view.setActiveTab(ftTab);
		}
    },
    
    loadInitialData: function(){
    	var me = this,
    		view = me.getView();
    	
    	/*
    	 * make request to the server
    	 * and for each journal 
    	 * create a tab
    	 */
    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/FinancialTransactionServlet',
			service_type: 'FinancialTransactionService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					for(var i = 0; i < resp.accJournals.length; i++){
						var accJournal = resp.accJournals[i];
						var accBalance = null;
						if (Ext.isDefined(accJournal.accBalance)){
							accBalance = {
								accCode: accJournal.accBalance.accCode,
								accDescription: accJournal.accBalance.accDescription,
								accName: accJournal.accBalance.accName,
								dateTo: accJournal.accBalance.dateTo,
								finalBalance: Ext.util.Format.currency(accJournal.accBalance.finalBalance)
							};
						}
						/*
						 * Create an appropriate store for the journal considering its account blacklist
						 */
						var accountsStore = Ext.create('Ext.data.Store', {
							autoDestroy: true,
							model: 'MaParoisse.model.Account',
							data: resp.accounts
						});
						if(Ext.isDefined(accJournal.accBlackList) && accJournal.accBlackList.constructor === Array){
							for(var j = 0; j < accJournal.accBlackList.length; j++){
								var record = accountsStore.findRecord('id', accJournal.accBlackList[j].id);
								if(record != -1 && record.isModel){
									accountsStore.remove(record);
								}
							}
						}
						
						view.add(Ext.create('MaParoisse.view.saisir.ModeStandartTab', {
							parentRef: view,
							title: accJournal.name,
							paymentMethodId: accJournal.paymentMethodId,
							bankAccountId: Ext.isDefined(accJournal.bankAccountId) ? accJournal.bankAccountId : null,
							monthValue: resp.accJournalFilter.month,
							yearValue: resp.accJournalFilter.year,
							timeControlValue: resp.accJournalFilter.timeControl,
							dateFrom: resp.accJournalFilter.dateFrom,
							dateTo: resp.accJournalFilter.dateTo,
							accBalance: accBalance,
							accStore: accountsStore,
							modifiable: Ext.isDefined(accJournal.modifiable) ? accJournal.modifiable : true,
							supplierStore: Ext.create('Ext.data.Store', {
								model: 'MaParoisse.model.util.NameId',
								autoDestroy: true,
								data: resp.suppliers
							})
						}));
					}
					
					view.setActiveTab(0);
					
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'loadAccJournals',
			params: {
				ownerId:  AccBureau.Context.principal.data.compId,
				loadAccAccounts: true,
				loadSuppliers: true
			}
		});
    },
    
    releaseResources: function(){
    	var me = this,
    		view = me.getView();
    	
    	view.removeAll();
    },
    
    updateSuppliers: function(suppliers) {
    	if(suppliers) {
    		var me = this,
    			view = me.getView(),
    			tabs = view.items.items;
    		
    		for(var i = 0; i < tabs.length; i++) {
    			tabs[i].supplierStore.loadData(suppliers);
    		}
    	}
    }
});
