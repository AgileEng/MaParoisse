Ext.define('MaParoisse.controller.AppModuleUtil', {
    extend: 'Ext.app.Controller',
    
    createFTTByAccJournalItemId: function(accJournalItemId, allowEditing, callback, controller){
    	
    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/FinancialTransactionServlet',
			service_type: 'FinancialTransactionService',
			listeners: {
				success: function () {
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var ftData = arguments[0].BODY;
					var financialTransactions = ftData.financialTransactions,
		    		accounts = ftData.accounts,
		    		appModuleNamePath = ftData.appModuleNamePath,
		    		appModuleId = ftData.appModuleId,
		    		appModuleCode = ftData.appModuleCode,
		    		suppliers = ftData.suppliers,
			    	requiresContributor = false,
					requiresSupplier = false,
					questType = null,
					ftTab = null;
		    	
		    	
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
				
				if(financialTransactions.length == 1){
					ftTab = Ext.create('MaParoisse.view.saisir.FinancialTransactionTab', {
						currentFT: Ext.create('MaParoisse.model.FinancialTransaction', financialTransactions[0]),
						contributor: requiresContributor,
						contributorRecord: requiresContributor ? Ext.create('MaParoisse.model.Contributor', financialTransactions[0].contributor) : null,
						suppliers: requiresSupplier ? suppliers : null,
						questType: questType,
						appModuleCode: appModuleCode,
						appModuleId: appModuleId,
						appModuleNamePath: appModuleNamePath,
						accounts: accounts,
						allowEditing: allowEditing
					});
				}
				
				callback(ftTab, controller);
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'loadFinancialTransaction',
			params: {
				ownerId: AccBureau.Context.principal.data.compId,
				accJournalItemId: accJournalItemId
			}
		});
    }
});
