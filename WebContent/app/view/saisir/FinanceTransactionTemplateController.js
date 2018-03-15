Ext.define('MaParoisse.view.saisir.FinanceTransactionTemplateController', {
	extend: 'Ext.app.ViewController',
	
	alias: 'controller.fttcontroller',
	
	onRender: function(){
		this.loadInitialData();
	},
	
	beforeAdd: function(container, component, index, eOpts){
		if(!component.currentFTT.get('paymentMethodId')){
			return false;
		} else {
			return true;
		}
	},
	
	onAddClicked: function(btn, e){
		
		var me = this,
			view = me.getView();
		var menu = Ext.create('Ext.menu.Menu', {
			items: [{
	        	text: 'Caisse',
	        	icon: null,
				glyph: 'xe026@iconFont',
				//baseCls: 'ae-ext-button-small-icon',
		        iconAlign: 'left',
	        	btnPaymentMethod: '10',
	        	scope: me,
	        	handler: me.doAddFTT
	        }, {
	        	text: 'Banque',
	        	icon: null,
				glyph: 'xe140@iconFont',
				//baseCls: 'ae-ext-button-small-icon',
		        iconAlign: 'left',
	        	btnPaymentMethod: '20',
	        	scope: me,
	        	handler: me.doAddFTT
	        }, {
	        	text: 'Diverses',
	        	icon: null,
	        	glyph: 'xe029@iconFont',
	        	iconAlign: 'left',
	        	btnPaymentMethod: '30',
	        	scope: me,
	        	handler: me.doAddFTT
	        }]		
		});
		e.stopEvent();
        menu.showAt(e.getXY());
		
	},
	
	onAddEntryClicked: function(){
		var view = this.getView(),
			currentFTT = view.getActiveTab();
		
		currentFTT.getController().onAddClicked();
	},
	
	onSaveClicked: function(btn, e){
		var me = this;
		this.updateAppModuleTemplate();
		var appModuleTemplate = this.getView().appModuleTemplate.getDataObjectExt();
		
		if(me.isValidModule()){
			var req = Ext.create('MaParoisse.lib.JsonRPC', {
				url: '/FinancialTransactionServlet',
				service_type: 'FinancialTransactionService',
				listeners: {
					success: function () {
						//show success and load the server data 
						MaParoisse.plugin.notification.showSuccess(' ','succès');
						
						me.updateView(arguments[0].BODY.appModuleTemplate);
	
					},
					error: function () {}
				}
			});
			
			req.request({
				method: 'saveFinancialTransactionTemplates',
				params: {
					appModuleTemplate: appModuleTemplate
				}
			});
		} else {
			MaParoisse.plugin.notification.showError(' ','Erreur de validation');
		}
	},
	
	updateView: function(appModuleTemplate){
		var me = this,
			view = me.getView();
		
		view.appModuleTemplate =  Ext.create('MaParoisse.model.AppModuleTemplate', appModuleTemplate);
		
		var ftts = view.appModuleTemplate.get('financialTransactionTemplates');
		
		Ext.each(view.items.items, function(item){
			item.getController().updateView(ftts);
		});
	},
	
	loadInitialData: function(){
		//TODO: load inital data from server		
		var me = this,
			view = me.getView(),
			fttArr = [];

		
			/*
			 * dummy gridpanel fot testing only
			 * remove when done
			 */ 
//			var fttGrid1 = Ext.create('MaParoisse.view.saisir.FTTGrid', {
//				moduleId: view.moduleId,
//				title: 'Banque',
//				currentFTT: Ext.create('MaParoisse.model.FinancialTransactionTemplate', {
//					paymentMethodId: 10,
//					accJournalEntryTemplates: []
//				})
//			});
//			fttArr.push(fttGrid1);
			//remove when real data is loaded from server
		
		var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/FinancialTransactionServlet',
			service_type: 'FinancialTransactionService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					//delete view.moduleId;
					
					view.appModuleTemplate =  Ext.create('MaParoisse.model.AppModuleTemplate', arguments[0].BODY.appModuleTemplate);
					view.accounts = arguments[0].BODY.accounts;
					
					var ftts = view.appModuleTemplate.get('financialTransactionTemplates');
					
					if(ftts){
						for(var i = 0; i < ftts.length; i++){
							fttArr.push(Ext.create('MaParoisse.view.saisir.FTTGrid', {
								moduleId: view.moduleId,
								moduleType: view.appModuleType,
								currentFTT: Ext.create('MaParoisse.model.FinancialTransactionTemplate', ftts[i]),
								accountsStore: Ext.create('Ext.data.Store', {
									model: 'MaParoisse.model.Account',
									data: view.accounts
								})
							}));
						}
						
						view.add(fttArr);
						view.setActiveTab(0);
					}
					me.setModuleTitle();
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'loadFinancialTransactionTemplates',
			params: {
				appModuleCode: view.moduleId
			}
		});
	},
	
	/*
	 * Since this component will be used in multiple cases
	 * this function is planned to be helper function to determine
	 * the components title based on module's moduleId
	 * If other way to do that is found remove this function
	 */
	setModuleTitle: function(){
		var me = this,
			view = me.getView();
		
		view.setTitle(view.appModuleTemplate.get('appModuleNamePath'));
	},
	
	doAddFTT: function(btn, e){
		var me = this,
			view = me.getView(),
			paymentMethodId = btn.btnPaymentMethod;
		
		var fttTabs = view.items.items,
			samePaymentTabExists = false;
		
		for(var i = 0; i < fttTabs.length; i++){
			if(fttTabs[i].currentFTT.get('paymentMethodId') == paymentMethodId){
				samePaymentTabExists = true;
				break;
			}
		}
		
		
		if(!samePaymentTabExists){
			var newFTT = Ext.create('MaParoisse.view.saisir.FTTGrid', {
				moduleId: view.moduleId,
				moduleType: view.appModuleType,
				currentFTT: Ext.create('MaParoisse.model.FinancialTransactionTemplate', {
					paymentMethodId: paymentMethodId
				}),
				accountsStore: Ext.create('Ext.data.Store', {
					model: 'MaParoisse.model.Account',
					data: view.accounts
				})
			});
			
			view.add(newFTT);
			view.setActiveTab(newFTT);
		} else {
			MaParoisse.plugin.notification.showError('There is already a template configured with this payment type!','erreur');
		}
	},
	
	updateAppModuleTemplate: function(){
		var me = this,
			view = me.getView(),
			ftts = [];
		
		Ext.each(view.items.items, function(fttGrid){
			ftts.push(fttGrid.getController().getCurrentFTT());
		});
		
		view.appModuleTemplate.set('financialTransactionTemplates', ftts);
	},
	
	/*
	 * A function to validate the data of the whole module
	 * before sending it to the server
	 * 
	 * Validations to apply here should encompass module data
	 * such as:
	 * 	-appModuleId - should be present
	 * 	-financialTransactionTeplates - should have:
	 * 		paymentType
	 * 		accJournalEntryTemplates - should have:
	 * 			all fields except amountRuleId & amountParameter
	 * 			also one and only one between ct & dt must be true
	 */
	isValidModule: function(){
		var me = this,
			appModuleTemplate = me.getView().appModuleTemplate,
			valid = true;
		
		//always be paranoic!!!
		var appModuleId = appModuleTemplate.get('appModuleId');
		if(!Ext.isDefined(appModuleId) || appModuleId == null || appModuleId == 0){
			valid = false;
			return valid;
		}
		
		//validate templates data
		var ftts = appModuleTemplate.get('financialTransactionTemplates');
		for(var i = 0; i < ftts.length; i++){
			
			//paymentMethodId
			if(!Ext.isDefined(ftts[i].paymentMethodId) || ftts[i].paymentMethodId == null || ftts[i].paymentMethodId == 0){
				valid = false;
				return valid;
			}
			//validate accJournalEntryTemplates
			for(var j = 0; j < ftts[i].accJournalEntryTemplates.length; j++){
				var accJET = ftts[i].accJournalEntryTemplates[j];
				
				//only one of credit of debit should be true
				if(accJET.ct){
					if(accJET.dt){
						valid = false;
						return valid;
					}
				} else if(!accJET.dt){
					valid = false;
					return valid;
				}
				
				//accountIdentificationRuleId
				if(!Ext.isDefined(accJET.accountIdentificationRuleId) || accJET.accountIdentificationRuleId == null || accJET.accountIdentificationRuleId == 0){
					valid = false;
					return valid;
				}
				
				//accAccountId
				if(!Ext.isDefined(accJET.accAccountId) || accJET.accAccountId == null || accJET.accAccountId == 0){
					valid = false;
					return valid;
				}
				
				//journalIdentificationRuleId
				if(!Ext.isDefined(accJET.journalIdentificationRuleId) || accJET.journalIdentificationRuleId == null || accJET.journalIdentificationRuleId == 0){
					valid = false;
					return valid;
				}
			}
		}
		
		return valid;
	}
});