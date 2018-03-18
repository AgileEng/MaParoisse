Ext.define('MaParoisse.view.saisir.JournalFilterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.saisir-journalfilter',
    
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
    
    onTabChange: function(tabpanel, newTab, oldTab, eOpts){
    	if(oldTab && oldTab.getXType() != 'financialtransactiontab'){
    		oldTab.getController().releaseGrid();
    	}
    	
    	if(newTab && newTab.getXType() != 'financialtransactiontab'){
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
					
					var accJournals = resp.accJournals;
					
					if (view.moduleId == "35b2" ){
						view.add(Ext.create('MaParoisse.view.saisir.BankJournalFilterTab', {
							title: 'Pointages',
							paymentMethodId: '',
							bankAccountId: '',
							monthValue: resp.accJournalFilter.month,
							yearValue: resp.accJournalFilter.year,
							//timeControlValue: resp.accJournalFilter.timeControl,
							dateFrom: resp.accJournalFilter.dateFrom,
							dateTo: resp.accJournalFilter.dateTo,
							accJournals: accJournals
						}));
						
						view.setActiveTab(0);
					} else {
						view.add(Ext.create('MaParoisse.view.saisir.JournalFilterTab', {
							title: 'Consulter',
							paymentMethodId: '',
							bankAccountId: '',
							monthValue: resp.accJournalFilter.month,
							yearValue: resp.accJournalFilter.year,
							timeControlValue: resp.accJournalFilter.timeControl,
							dateFrom: resp.accJournalFilter.dateFrom,
							dateTo: resp.accJournalFilter.dateTo,
							accJournals: accJournals
						}));
						
						view.setActiveTab(0);
					}
				},
				error: function () {}
			}
		});
		
    	if (view.moduleId == "35b2" ){
    		req.request({
				method: 'loadAccJournals',
				params: {
					ownerId:  AccBureau.Context.principal.data.compId,
					paymentMethodId: "20"
				}
			});
    	} else {
			req.request({
				method: 'loadAccJournals',
				params: {
					ownerId:  AccBureau.Context.principal.data.compId
				}
			});
    	}
    },
    
    releaseResources: function(){
    	var me = this,
    		view = me.getView();
    	
    	view.removeAll();
    }
});
