Ext.define('MaParoisse.view.gerer.BudgetRealisationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.gerer-budgetrealisation',
    
    currentYear: null,
    
    onRender: function(){
		Ext.apply(Ext.util.Format, {
            thousandSeparator: ' ',
            decimalSeparator: ',',
            currencySign: ' ',
            dateFormat: 'd/m/Y'
        });
    	//load initial data
    	this.loadInitialData();
    },
    
    onYearChange: function(field, newValue, oldValue, eOpts){
    	this.loadInitialData();
    },
    
    loadInitialData: function(){
    	var me = this,
    		yearField = me.getYearField(),
    		year = yearField.getValue();
    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/Accounting',
			service_type: 'AccService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					
					me.doLoadInitialData(resp.expense, resp.income, resp.year);
				},
				error: function () {
					if(Ext.isDefined(year)){
						var yField = me.getYearField();
						yField.suspendEvent('change');
						yField.setValue(me.currentYear);
						yField.resumeEvent('change');
					}
				}
			}
		});
		
		req.request({
			method: 'loadBudgetReal',
			params: {
				ownerId: AccBureau.Context.principal.data.compId,
				year: yearField.getValue()
			}
		});
    },
    
    doLoadInitialData: function(expense, income, year){
    	var me = this;
    		expGrid = me.getExpenseGrid(),
    		incGrid = me.getIncomeGrid(),
    		yearField = me.getYearField();
    		
    		me.currentYear = year;
    		
    	expGrid.getStore().loadData(expense);
    	incGrid.getStore().loadData(income);
    	yearField.suspendEvent('change');
		yearField.setValue(year);
		yearField.resumeEvent('change');
		expGrid.getView().refresh();
		incGrid.getView().refresh();
    },
    
    compteRenderer: function(value, metaData, record, rowIndex, colIndex, store, view){
		if(record.get('code').length > 0 && record.get('name').length > 0){
			return record.get('code') + ' - ' + record.get('name');
		} else {
			return '';
		}
	},
	
	frAmountRenderer: function(value, metaData, record, rowIndex, colIndex, store, view){
		if(Number(value) != 0.0){
			return Ext.util.Format.currency(value);
		} else return '';
	},
	
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
	
	onPrintBudgetClicked: function(btn){
		var me = this,
			method = '';
		if(btn.btnId === 'expenseBtn'){
			method = 'budgetRealisationExpense';
		} else if(btn.btnId === 'incomeBtn'){
			method = 'budgetRealisationIncome';
		}
		if(method.length > 0){
			window.open(
				'../CefraForm?number=' + method + '&ownerId=' + AccBureau.Context.principal.data.compId
				+ '&year=' + me.getYearField().getValue(),
				'_Print');
		}
	},
	
	tenantChange: function(){
    	this.releaseResources();
    	this.loadInitialData();
    },
    
    releaseResources: function(){
    	var me = this;
    	
    	me.getExpenseGrid().getStore().removeAll();
    	me.getIncomeGrid().getStore().removeAll();
    }
});
