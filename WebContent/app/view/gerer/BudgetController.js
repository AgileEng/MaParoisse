Ext.define('MaParoisse.view.gerer.BudgetController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.gerer-budgetcontroller',
    
    getExpenseGrid: function(){
		var me = this,
			view = me.getView(),
			expenseGrid = null;
		
		expenseGrid = view.getComponent('centerContainer').getComponent('expenseColumn').getComponent('expenseGrid');
		return expenseGrid;
	},
	
	getIncomeGrid: function(){
		var me = this,
			view = me.getView(),
			incomeGrid = null;
		
		incomeGrid = view.getComponent('centerContainer').getComponent('incomeColumn').getComponent('incomeGrid');
		return incomeGrid;
	},
	
	getYearField: function(){
		var me = this,
			view = me.getView(),
			yearField = null;
		
		yearField = view.getDockedComponent('topTbar').getComponent('yearField');
		
		return yearField;
	},
    
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

    onTenantChange: function(){
    	this.releaseResources();
    	this.loadInitialData();
    },
    
    loadInitialData: function(){
    	var me = this,
			yearField = me.getYearField();
    	
    	
    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/Accounting',
			service_type: 'AccService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					me.loadAccBalancesInView(resp.accounts);
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'loadBudget',
			params: {
				ownerId: AccBureau.Context.principal.data.compId,
				year: yearField.getValue()
			}
		});
    },
    
    loadAccBalancesInView: function(accounts){
    	var me = this,
    		expenseGrid = me.getExpenseGrid(),
    		incomeGrid = me.getIncomeGrid(),
    		expenseAccounts = [],
    		incomeAccounts = [];
    	
    	for(var i = 0; i < accounts.length; i++){
    		if(accounts[i].code.substring(0,1) === "6"){
    			expenseAccounts.push(accounts[i]);
    		} else if (accounts[i].code.substring(0, 1) === "7"){
    			incomeAccounts.push(accounts[i]);
    		}
    	}
    	
    	expenseGrid.getStore().loadData(expenseAccounts);
    	incomeGrid.getStore().loadData(incomeAccounts);
    	
    	me.updateTotals();
    },
    
    updateTotals: function() {
    	var me = this,
			expenseGrid = me.getExpenseGrid(),
			incomeGrid = me.getIncomeGrid();
    	
    	var produitsTotal = document.getElementById('produitsField'),
			chargesTotal =  document.getElementById('chargesField'),
			balanceField =  document.getElementById('balanceField');
		 
		var prodSum = incomeGrid.getStore().sum("amount");
		if (Ext.isDefined(prodSum)) {
			produitsTotal.innerHTML ="Total produits: " + Ext.util.Format.currency(prodSum) + " €";
		}
		
		var chargesSum = expenseGrid.getStore().sum("amount");
		if (Ext.isDefined(chargesSum)) {
			chargesTotal.innerHTML = "Total charges: " + Ext.util.Format.currency(chargesSum) + " €";
		}
		
		var balance = prodSum - chargesSum;
		var balanceText = "";
		if (balance < 0){
			balanceText = "Déficit de l'exercice:";
			balance *= -1;
		} else if (balance > 0) {
			balanceText = "Excédent de l'exercice:";
		} else {
			balanceText = "Résultat:";
		}
		
		balanceField.innerHTML = balanceText + " " + Ext.util.Format.currency(balance) + " €";
    },
    
    onSaveAccBalanceClicked: function(){
    	var me = this,
    		yearField = me.getYearField(),
    		expenseGrid = me.getExpenseGrid(),
    		incomeGrid = me.getIncomeGrid();
    	
    	if(yearField.isValid()){
    		var accounts = [];
        	
        	expenseGrid.getStore().each(function(record){
        		accounts.push(record.getDataObjectExt());
        	});
        	
        	incomeGrid.getStore().each(function(record){
        		accounts.push(record.getDataObjectExt());
        	});
        	
        	var year = yearField.getRawValue();
        	
        	var req = Ext.create('MaParoisse.lib.JsonRPC', {
    			url: '/Accounting',
    			service_type: 'AccService',
    			listeners: {
    				success: function () {
    					//show success and load the server data 
    					MaParoisse.plugin.notification.showSuccess(' ','succès');
    					
    					var resp = arguments[0].BODY;
    					me.loadAccBalancesInView(resp.accounts);
    					//yearField.setValue(resp.date);
    				},
    				error: function () {}
    			}
    		});
    		
    		req.request({
    			method: 'saveBudget',
    			params: {
    				ownerId: AccBureau.Context.principal.data.compId,
    				accounts: accounts,
    				year: year
    			}
    		});
    	} else {
    		MaParoisse.plugin.notification.showError(' ','Erreur de validation');
    	}
    },
    
    onYearChange: function(field, newValue, oldValue, eOpts){
    	var me = this,
			view = me.getView(),
			expenseGrid = me.getExpenseGrid(),
			incomeGrid = me.getIncomeGrid();
		
    	if(view.isSafeToClose()){
    		expenseGrid.getStore().removeAll();
    		incomeGrid.getStore().removeAll();
    		me.loadInitialData();
    	} else {
    		Ext.create('MaParoisse.lib.MessageBox', {
    			//header: false,
    			title: 'Zachée',
    			formHeight: 140,
    			message: 'Vous vous apprêtez à quitter ce module sans sauvegarder. Les données saisies seront perdues. <br/><br/>Etes vous sur de vouloir poursuivre?',
    			type: MaParoisse.lib.MessageBox.QUESTION,
    			callback: {
    				fn: function(btnId){
		            	if(btnId == MaParoisse.lib.MessageBox.YES){
		            		expenseGrid.getStore().removeAll();
		            		incomeGrid.getStore().removeAll();
		            		me.loadInitialData();
		            	} else {
		            		field.suspendEvent('change');
		            		field.setValue(oldValue);
		            		field.resumeEvent('change');
		            	}
    				}
    			}
    		});
    	}
    },
    
    tenantChange: function(){
    	this.releaseResources();
    	this.loadInitialData();
    },
    
    releaseResources: function(){
    	var me = this,
    		view = me.getView(),
    		expenseGrid = me.getExpenseGrid(),
			incomeGrid = me.getIncomeGrid();
    	
    	expenseGrid.getStore().removeAll();
		incomeGrid.getStore().removeAll();
    	me.getYearField().reset();
    }
});
