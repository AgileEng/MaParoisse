Ext.define('MaParoisse.view.saisir.FinancialTransactionController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.ftcontroller',
	
	onRender: function(){
		this.loadInitialData();
	},
	
	tenantChange: function(){
		this.releaseResources();
		this.loadInitialData();
	},
	
	beforeDestroy: function(){
		var me = this,
			view = me.getView();
		
		if(view.accountsStore != null){
			view.accountsStore.destroy();
		}
		
		return true;
	},
	
	loadInitialData: function(){
		var me = this,
			view = me.getView();
		/*
		 * load initial data
		 * 
		 * array of financialTransaction expected
		 * 
		 */
		var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/FinancialTransactionServlet',
			service_type: 'FinancialTransactionService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY,
						financialTransactions = resp.financialTransactions,
						appModuleNamePath = resp.appModuleNamePath,
						accounts = resp.accounts,
						suppliers = resp.suppliers;
					
					view.accountsStore = Ext.create('Ext.data.Store', {
						autoDestroy: true,
						storeId: 'accountsstore',
						model: 'MaParoisse.model.Account',
						data: accounts
					});
					
					me.loadDataIntoView(appModuleNamePath, financialTransactions, suppliers);
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'createFinancialTransaction',
			params: {
				ownerId: AccBureau.Context.principal.data.compId,
				appModuleCode: view.appModuleCode
			}
		}); 
	},
	
	loadDataIntoView: function(appModuleNamePath, financialTransactions, suppliers){
		var me = this,
			view = me.getView(),
			tabs = [];
		
		view.setTitle(appModuleNamePath);
		
		/*
		 * Make decision which special case occurs,
		 * possibilities are:
		 * 	contributor (requiresContributor)
		 * 	quest(3 types questType != null):
		 * 		grid with 3 columns, 4 preconfigured records, editable amount only (questType 10)
		 * 		grid with 2 columns, 1 preconfigured record, not editable (questType 20)
		 * 		grid with 2 columns, 1 record , select from combo (questType 30)
		 */
		var appModuleCode = view.appModuleCode,
			requiresContributor = false,
			requiresSupplier = false,
			questType = null;
		
		if(appModuleCode == '690b4' || appModuleCode == '700b4' || appModuleCode == '720b4'){
			requiresContributor = true;
		}
		
		if(appModuleCode == '730b4' || appModuleCode == '740b4' || appModuleCode == '750b4' ||
				appModuleCode == '760b4' || appModuleCode == '770b4' || appModuleCode == '780b4' ||
				appModuleCode == '790b4' || appModuleCode == '800b4' || appModuleCode == '810b4' ||
				appModuleCode == '820b4' || appModuleCode == '830b4' || appModuleCode == '840b4' ||
				appModuleCode == '850b4'){
			requiresSupplier = true;
		}
		
		if(appModuleCode == '950b4' || appModuleCode == '960b4'){
			questType = MaParoisse.lib.Globals.getSaisieGuidee().queteTypes.type1;
		} else if(appModuleCode == '980b4' || appModuleCode == '990b4'){
			questType = MaParoisse.lib.Globals.getSaisieGuidee().queteTypes.type2;
		} else if(appModuleCode == '970b4'){
			questType = MaParoisse.lib.Globals.getSaisieGuidee().queteTypes.type3;
		} else if(appModuleCode == '890b4'){
			questType = MaParoisse.lib.Globals.getSaisieGuidee().queteTypes.type2;
		}
		
		for(var i = 0; i < financialTransactions.length; i++){
			var tab = Ext.create('MaParoisse.view.saisir.FinancialTransactionTab', {
				currentFT: Ext.create('MaParoisse.model.FinancialTransaction', financialTransactions[i]),
				contributor: requiresContributor,
				suppliers: requiresSupplier ? suppliers : null,
				questType: questType,
				appModuleCode: appModuleCode
			});
			tabs.push(tab);
		}
		
		view.add(tabs);
		
//		Dummy data only for initial testing
//		view.add(Ext.create('MaParoisse.view.saisir.FinancialTransactionTab', {
//			currentFT: Ext.create('MaParoisse.model.FinancialTransaction', {
//				paymentMethodId: 20,
//				dateTransaction: new Date(),
//				accJournalItems: []
//			})
//		}));
//		
//		view.add(Ext.create('MaParoisse.view.saisir.FinancialTransactionTab', {
//			currentFT: Ext.create('MaParoisse.model.FinancialTransaction', {
//				paymentMethodId: 10,
//				accJournalItems: []
//			})
//		}));
		if(MaParoisse.lib.Globals.getLastUsedJournal() != null){
			var tabToActivate = null;
			for(var i = 0; i < view.items.items.length; i ++){
				if(view.items.items[i].title == MaParoisse.lib.Globals.getLastUsedJournal()){
					tabToActivate = view.items.items[i];
					break;
				}
			}
			if(tabToActivate){
				view.setActiveTab(tabToActivate);
			} else {
				view.setActiveTab(0);
			}
		} else {
			view.setActiveTab(0);
		}
	},
	
	releaseResources: function(){
		var me = this,
			view = me.getView();
		
		delete view.accountsStore;
		view.accountsStore = null;
		
		view.removeAll(true);
	}
});