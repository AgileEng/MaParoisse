Ext.define('MaParoisse.view.parametrages.AccInitialBalanceController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.parametrages-accinitialbalance',
    
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
    	var me = this;
    	
    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/Accounting',
			service_type: 'AccService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					me.loadInitialBalanceDate(resp.date);
					me.loadAccBalancesInView(resp.accounts);
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'loadInitialBalance',
			params: {
				ownerId: AccBureau.Context.principal.data.compId
			}
		});
    },
    
    loadAccBalancesInView: function(accounts){
    	var me = this,
    		view = me.getView();
    	
    	view.getStore().loadData(accounts);
    },
    
    loadInitialBalanceDate: function(dateStr){
    	var me = this,
    		view = me.getView(),
    		dateField = view.getDockedComponent('topToolbar').getComponent('dateField');
    	
    	dateField.setValue(dateStr);
    },
    
    onSaveAccBalanceClicked: function(){
    	var me = this,
    		view = me.getView(),
    		ds = view.getStore(),
    		dateField = view.getDockedComponent('topToolbar').getComponent('dateField');
    	
    	if(dateField.isValid()){
    		var accounts = [];
        	
        	ds.each(function(record){
        		accounts.push(record.getDataObjectExt());
        	});
        	
        	var date = view.getDockedComponent('topToolbar').getComponent('dateField').getRawValue();
        	
        	var req = Ext.create('MaParoisse.lib.JsonRPC', {
    			url: '/Accounting',
    			service_type: 'AccService',
    			listeners: {
    				success: function () {
    					//show success and load the server data 
    					MaParoisse.plugin.notification.showSuccess(' ','succès');
    					
    					var resp = arguments[0].BODY;
    					me.loadAccBalancesInView(resp.accounts);
    					//dateField.setValue(resp.date);
    				},
    				error: function () {}
    			}
    		});
    		
    		req.request({
    			method: 'saveInitialBalance',
    			params: {
    				ownerId: AccBureau.Context.principal.data.compId,
    				accounts: accounts,
    				date: date
    			}
    		});
    	} else {
    		MaParoisse.plugin.notification.showError(' ','Erreur de validation');
    	}
    },
    
    releaseResources: function(){
    	var me = this,
    		view = me.getView();
    	
    	view.getStore().removeAll();
    	view.getDockedComponent('topToolbar').getComponent('dateField').reset();
    }
});
