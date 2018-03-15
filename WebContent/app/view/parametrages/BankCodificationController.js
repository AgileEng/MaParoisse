Ext.define('MaParoisse.view.parametrages.BankCodificationController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.bankcodification',
	
	onRender: function(){
		this.loadInitialData();
	},
	
	onBankAccGridSelChange: function(){
		var me = this,
			view = me.getView(),
			bankAccGrid = view.getComponent('bankAccountGrid'),
			bankCentralPanel = view.getComponent('bankCentralPanel'),
			bankAccForm = bankCentralPanel.getComponent('bankAccForm');
			
		
		if(bankAccGrid.getSelectionModel().hasSelection()){
			bankCentralPanel.setDisabled(false);
			
			var record = bankAccGrid.getSelectionModel().getSelection()[0],
				accountsStore = bankAccForm.getComponent('accCombo').getStore();
			
			view.currentBankAccount = record;
			accountsStore.loadData(view.accounts);
			bankAccForm.loadRecord(view.currentBankAccount);
			bankCentralPanel.setTitle(view.currentBankAccount.get('name'));
		}
	},
	
	onSaveAccountClicked: function(){
		var me = this,
		view = me.getView(),
		bankAccGrid = view.getComponent('bankAccountGrid'),
		bankAccStore = bankAccGrid.getStore();
		bankCentralPanel = view.getComponent('bankCentralPanel'),
		bankAccForm = bankCentralPanel.getComponent('bankAccForm');
		if(bankAccForm.isValid()){
			bankAccForm.updateRecord(view.currentBankAccount);
			
			var bankAcc = view.currentBankAccount.getDataObjectExt();
			
			//index of the selected record
			var selectedAcc = bankAccGrid.getSelectionModel().getSelection()[0],
				selectedIdx = bankAccStore.indexOf(selectedAcc);
			
			var req = Ext.create('MaParoisse.lib.JsonRPC', {
				url: '/CashServlet',
				service_type: 'CashService',
				listeners: {
					success: function () {
						//show success and load the server data 
						MaParoisse.plugin.notification.showSuccess(' ','succès');
						
						me.updateViewOnSaveSuccess(arguments[0].BODY.bankAccount, selectedIdx);
					},
					error: function () {}
				}
			});
			
			req.request({
				method: 'saveBankAccount',
				params: {
					bankAccount: bankAcc,
					ownerId: AccBureau.Context.principal.data.compId,
					recognitionRules: []
				}
			});
		} else {
			MaParoisse.plugin.notification.showError(' ','Erreur de validation');
		}
	},
	
	onAddAccountClicked: function(){
		var me = this,
			view = me.getView(),
			bankAccGrid = view.getComponent('bankAccountGrid'),
			bankCentralPanel = view.getComponent('bankCentralPanel'),
			bankAccForm = bankCentralPanel.getComponent('bankAccForm'),
			bankAccStore = Ext.data.StoreManager.lookup('bankAccStore');
		
		//partially release resources
		bankAccForm.reset();
		
		//add new record to grid and select it
		var newBankAccount = Ext.create('MaParoisse.model.BankAccount', {id:-1, ownerId: AccBureau.Context.principal.data.compId});
		bankAccStore.add(newBankAccount);
		bankAccGrid.getSelectionModel().select([newBankAccount]);
	},
	
	onTenantChange: function(){
		this.releaseResources();
		this.loadInitialData();
	},
	
	loadInitialData: function(){
		var me = this;
		var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/CashServlet',
			service_type: 'CashService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					me.updateView(arguments[0].BODY.accounts , arguments[0].BODY.bankAccounts);
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'loadBankAccounts',
			params: {
				loadAccounts: true,
				ownerId: AccBureau.Context.principal.data.compId
			}
		});
	},
	
	updateView: function(accounts, bankAccounts){
		var me = this,
			view = me.getView(),
			bankAccGrid = view.getComponent('bankAccountGrid'),
			bankAccStore = bankAccGrid.getStore();
		
		bankAccStore.loadData(bankAccounts);
		
		view.accounts = accounts;
		if(bankAccGrid.getSelectionModel().hasSelection()){
			me.onBankAccGridSelChange();
		}
	},
	
	releaseResources: function(){
		var me = this,
			view = me.getView(),
			bankAccStore = Ext.data.StoreManager.lookup('bankAccStore'),
			bankCentralPanel = view.getComponent('bankCentralPanel'),
			bankAccForm = bankCentralPanel.getComponent('bankAccForm');
		
		view.accounts = [];
		view.accAccounts = [];
		
		bankAccStore.removeAll();
		bankAccForm.reset();
		
		bankCentralPanel.setDisabled(true);
	},
	
	updateViewOnSaveSuccess: function(bankAccount, selectedIdx){
		var me = this,
			view = me.getView(),
			bankAccGrid = view.getComponent('bankAccountGrid'),
			bankAccStore = bankAccGrid.getStore();
		
		var oldRec = bankAccStore.getAt(selectedIdx),
			savedRec = Ext.create('MaParoisse.model.BankAccount', bankAccount);
		
		bankAccStore.remove(oldRec);
		bankAccStore.insert(selectedIdx, [savedRec]);
		
		bankAccGrid.getSelectionModel().select(selectedIdx);
		
		me.onBankAccGridSelChange();
	}
});