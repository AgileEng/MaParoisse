Ext.define('MaParoisse.view.parametrages.BankStatementsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.parametrages-bankstatements',
    
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
	
	getYearField: function(){
		var me = this,
			view = me.getView(),
			bankAccGrid = view.getComponent('bankAccountGrid');
		
		return bankAccGrid.getComponent('topTbar').getComponent('yearField');
	},
	
	getBankStatementsGrid: function(){
		var me = this,
			view = me.getView(),
			bankStatementsGrid = view.getComponent('bankCentralPanel').getComponent('bankStatementsGrid');
		
		return bankStatementsGrid;
	},
	
	onBankAccGridSelChange: function(){
		var me = this,
			view = me.getView(),
			bankAccGrid = view.getComponent('bankAccountGrid');
		
		if(bankAccGrid.getSelectionModel().hasSelection()){
			var selectedBank = bankAccGrid.getSelectionModel().getSelection()[0];
			var req = Ext.create('MaParoisse.lib.JsonRPC', {
				url: '/CashServlet',
				service_type: 'CashService',
				listeners: {
					success: function () {
						//show success and load the server data 
						MaParoisse.plugin.notification.showSuccess(' ','succès');
						view.getComponent('bankCentralPanel').setDisabled(false);
						var statements = arguments[0].BODY.items;
						me.loadStatements(statements);
						if(statements.length == 0){
							me.onAddItemClicked();	
						}
					},
					error: function () {}
				}
			});
			
			req.request({
				method: 'loadBankBalances',
				params: {
					ownerId: AccBureau.Context.principal.data.compId,
					bankAccountId: selectedBank.get('id'),
					year: me.getYearField().getValue()
				}
			});
		}
	},
	
	loadStatements: function(bankStatements){
		var me = this,
			ds = me.getBankStatementsGrid().getStore();
		
		ds.loadData(bankStatements);
	},
	
	onSaveAccountClicked: function(){
		var me = this,
			view = me.getView(),
			bankAccGrid = view.getComponent('bankAccountGrid'),
			bankStatementsGrid = me.getBankStatementsGrid();
		
		var isValidStatementSet = true,
			bankStatements = [];
		bankStatementsGrid.getStore().each(function(statement){
			if(statement.get('bankFinalBalanceDate') != null){
				bankStatements.push(statement.getDataObjectOpt(options={serialize: true, persist: true}));
			} else {
				//isValidStatementSet = false;
			}
		});
	
		if(bankAccGrid.getSelectionModel().hasSelection() /*&& isValidStatementSet*/){
			var selectedBank = bankAccGrid.getSelectionModel().getSelection()[0];
			var req = Ext.create('MaParoisse.lib.JsonRPC', {
				url: '/CashServlet',
				service_type: 'CashService',
				listeners: {
					success: function () {
						//show success and load the server data 
						MaParoisse.plugin.notification.showSuccess(' ','succès');
						me.onBankAccGridSelChange();
					},
					error: function () {}
				}
			});
			
			req.request({
				method: 'saveBankBalances',
				params: {
					ownerId: AccBureau.Context.principal.data.compId,
					bankAccountId: selectedBank.get('id'),
					items: bankStatements
				}
			});
		} else {
			MaParoisse.plugin.notification.showError(' ','erreur');
		}
	},
	
	onAddItemClicked: function(){
		var me = this,
			view = me.getView(),
			bankAccGrid = view.getComponent('bankAccountGrid'),
			bankStatementsGrid = me.getBankStatementsGrid();
		
		if(bankAccGrid.getSelectionModel().hasSelection()){
			var currentPeriod = bankAccGrid.getSelectionModel().getSelection()[0],
				bankAccId = currentPeriod.get('id'),
				year = me.getYearField().getValue(),
				bankFinalBalanceDate = Ext.Date.parse(year + '-12-31', 'Y-m-d');
			var newStatement = new MaParoisse.model.BankStatement({
				bankAccId: bankAccId,
				bankFinalBalanceDate: bankFinalBalanceDate
			});
			bankStatementsGrid.getStore().add(newStatement);
			
			bankStatementsGrid.getPlugin('statementsediting').startEdit(newStatement, 1);
		}
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
					
					me.updateView(arguments[0].BODY.bankAccounts);
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
	
	updateView: function(bankAccounts){
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
			bankAccGrid = view.getComponent('bankAccountGrid'),
			bankCentralPanel = view.getComponent('bankCentralPanel'),
			bankStatementsGrid = me.getBankStatementsGrid();
		
		view.accounts = [];
		view.accAccounts = [];
		
		bankStatementsGrid.getStore().removeAll();
		bankAccGrid.getStore().removeAll();
		
		bankCentralPanel.setDisabled(true);
	},
	
	onYearChange: function(){
		this.clearStatements();
		this.onBankAccGridSelChange();
	},
	
	clearStatements: function(){
		var me = this,
			view = me.getView(),
			bankStatementsGrid = me.getBankStatementsGrid();

		bankStatementsGrid.getStore().removeAll();
	}
});
