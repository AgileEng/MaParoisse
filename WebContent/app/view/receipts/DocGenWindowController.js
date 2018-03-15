Ext.define('MaParoisse.view.receipts.DocGenWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.receipts-docgenwindow',
    
    onRender: function(){
    	var me = this;
    	
    	if(me.getView().journal){
    		var req = Ext.create('MaParoisse.lib.JsonRPC', {
				url: '/FinancialTransactionServlet',
				service_type: 'FinancialTransactionService',
				listeners: {
					success: function () {
						//show success and load the server data 
						MaParoisse.plugin.notification.showSuccess(' ','succès');
						
						var resp = arguments[0].BODY;
						
						me.loadJournalCombo(resp.accJournals);
					},
					error: function () {}
				}
			});
			
			req.request({
				method: 'loadAccJournals',
				params: {
					ownerId: AccBureau.Context.principal.data.compId,
					loadAccAccounts: false,
					loadSuppliers: false
				}
			});
    	}
    },
    
    loadJournalCombo: function(journals){
    	if(Ext.isDefined(journals) && journals.length > 0){
    		var journalDataStore = this.getView().getComponent('journalField').getStore();
    		
    		journalDataStore.loadData(journals);
    		journalDataStore.insert(0, new MaParoisse.model.util.DomainRecord({
    			name: 'Tous',
    			code: ''
    		}));
    	}
    },
    
    onGenerateClicked: function(){
    	
    },
    
    onCancelClicked: function(){
    	this.getView().close();
    },
    
    onRadio1Change: function(field, newValue, oldValue, eOpts){
    	var me = this,
		view = me.getView(),
		radio2 = view.getComponent('radioGr2');
    	if(newValue === 10){
    		radio2.setDisabled(false);
    	} else if(oldValue === 10 && newValue != 10){
    		radio2.setDisabled(true);
    	}
    }
});
