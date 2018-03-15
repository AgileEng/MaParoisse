Ext.define('MaParoisse.controller.ApplicationRouter', {
	extend: 'Ext.app.Controller',
	
	saisieGuideeCreationExpenseModules: ['400b4', '410b4', '420b4', '430b4', '440b4',
	                      '450b4', '460b4', '470b4', '480b4', '490b4',
	                      '500b4', '510b4', '520b4', '530b4', '540b4',
	                      '550b4', '560b4'],
	                      
	saisieGuideeCreationIncomeModules: ['340b4', '350b4', '360b4', '370b4', '380b4',
      	                      '390b4', '394b4', '397b4'],
      	                      
    saisieGuideeCreationSpecificModules: ['620b4', '630b4', '640b4', '650b4', '660b4'],
    
    saisieGuideeCreationTresorierModules: ['570b4', '580b4', '590b4', '600b4', '610b4'],
      	                      
    saisieGuideeIncomeModules: ['670b4', '680b4', '690b4', '700b4', '710b4', '720b4', '723b4', '727b4'],

    saisieGuideeExpenseModules: ['730b4', '740b4', '750b4', '760b4', '770b4',
	                      '780b4', '790b4', '800b4', '810b4', '820b4',
	                      '830b4', '840b4', '850b4', '860b4', '870b4',
	                      '880b4', '890b4'],
	                      
	saisieGuideeSpecificModules: ['950b4', '960b4', '970b4', '980b4', '990b4'],
	
	saisieGuideeTresorierModules: ['900b4', '910b4', '920b4', '930b4', '940b4'],
	
	bibliothequeModules: ['80a1', '70b3', '80b3', '90b3', '100b3', 
	                      '110b3', '120b3', '130b3', '140b3', '150b3',
	                      '160b3', '163b3', '166b3', '170b3', '175b3', '225b3', '145b3', '195b3'],
	                      
	lePersonnelModules: ['150a2', '170a2', '250b3', '260b3'],
	
	requires: [
	           'MaParoisse.view.dummy.GridToForm',
	           'MaParoisse.view.dummy.GroupedGrid',
	           'MaParoisse.view.util.ParoisseSelectionWindow',
	           'MaParoisse.view.Customer',
	           'MaParoisse.view.parametrages.Conseil',
	           'MaParoisse.view.parametrages.PlanComptable',
	           'MaParoisse.view.parametrages.COAModels'
	],
	routes: {
		'' : 'onDefaultRoute',
		'home' : 'onHome',
		'component/:compId' : {
			before: 'onBeforeComponent',
			action: 'onComponent'
		},
		'module/:moduleId' : {
//			before: 'onBeforeModule',
			action: 'onModule'
		} 
	},
	
	isStringInArray: function(str, strArray) {
	    for (var j=0; j<strArray.length; j++) {
	        if (strArray[j] === str) return true;
	    }
	    return false;
	},
	
	onDefaultRoute: function(){
		window.history.back();
		//Ext.getCmp('ae-viewport').getController().onLogout();
	},
	
	onHome: function(){
		var menu = AccBureau.lastMenuState;
		var moduleContainer = Ext.getCmp('moduleHolder');
		if(Ext.isDefined(menu) && menu != null){
			moduleContainer.removeAll(true);
			moduleContainer.add(AccBureau.lastMenuState);
			AccBureau.lastMenuState = null;
		}
		if(Ext.getCmp('ae-viewport').getComponent('mainInnerPanel').getDockedComponent('leftBar').isVisible()){
			Ext.getCmp('ae-viewport').getComponent('mainInnerPanel').getDockedComponent('leftBar').hide();
		}
		Ext.getCmp('aeTilesPanel').getLoader().load();
	},
	
	onBeforeComponent: function(param, action){
		Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(function(allowed){
			if(allowed){
				//TODO: here implement conditions for components that require selected tenant/customer
					action.resume();
			} else {
				//old code- ExtJs 5.0.0 Beta
				//action.resume(false);
				
				//new working code - post beta versions
				action.stop();
				
				window.history.forward();
			}
		});
	},
	
	onComponent: function(compConf){
		var menu = AccBureau.lastMenuState;
		var moduleContainer = Ext.getCmp('moduleHolder');
		Ext.getCmp('ae-viewport').getComponent('mainInnerPanel').getDockedComponent('leftBar').show();
		compConf = JSON.parse(Ext.util.Base64.decode(compConf));
		if(Ext.isDefined(menu) && menu != null){
			moduleContainer.removeAll(true);
			//moduleContainer.remove(Ext.getCmp('centerComponent'), true);
			moduleContainer.add(AccBureau.lastMenuState);
			AccBureau.lastMenuState = null;
		}
		Ext.getCmp('aeTilesPanel').getLoader().load({
			url:  '/partials/' + compConf.jsp + '.jsp',
			params: {
				compCode: compConf.compCode
			}
		});
	},
	
//	onBeforeModule: function(param, action){
//		Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(function(allowed){
//			if(allowed){
//					action.resume();
//				//}
//			} else {
//				//TODO: in future implementations of ExtJS 5 this bahavior should be implemented with action.stop()
//				//for now this is the working code
//				action.resume(false);
//				window.history.forward();
//			}
//		});
//	},
	
	onModule: function(moduleId){
		var moduleContainer = Ext.getCmp('moduleHolder');
		//check if there is currently opened module other than menu
		if(moduleContainer.items.items.length == 1 && moduleContainer.items.items[0].id == 'aeTilesPanel'){
			if(moduleId == '270b3'){
				//create the module, remove tiles and add the module to the container
				if(AccBureau.lastMenuState == null){
					AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
				}
				moduleContainer.add(Ext.create('MaParoisse.view.Customer', {}));
			} else if(moduleId == '280b3'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									//create the module, remove tiles and add the module to the container
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.parametrages.Conseil', {}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				} else {
					//create the module, remove tiles and add the module to the container
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.parametrages.Conseil', {}));
				}
			} else if(moduleId == '310b3'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.parametrages.PlanComptable', {}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				} else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.parametrages.PlanComptable', {}));
				}
			}else if(moduleId == '315b3'){
				if(AccBureau.lastMenuState == null){
					AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
				}
				moduleContainer.add(Ext.create('MaParoisse.view.parametrages.COAModels', {}));
			}else if(this.isStringInArray(moduleId, this.saisieGuideeCreationExpenseModules)){
				if(AccBureau.lastMenuState == null){
					AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
				}
				moduleContainer.add(Ext.create('MaParoisse.view.saisir.FinanceTransactionTemplate', {moduleId: moduleId, appModuleType: moduleId == '560b4' ? 180 : 6}));
			}else if(this.isStringInArray(moduleId, this.saisieGuideeCreationIncomeModules)){
				if(AccBureau.lastMenuState == null){
					AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
				}
				moduleContainer.add(Ext.create('MaParoisse.view.saisir.FinanceTransactionTemplate', {moduleId: moduleId, appModuleType: 7}));
			}else if(this.isStringInArray(moduleId, this.saisieGuideeCreationTresorierModules)){
				if(AccBureau.lastMenuState == null){
					AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
				}
				moduleContainer.add(Ext.create('MaParoisse.view.saisir.FinanceTransactionTemplate', {moduleId: moduleId, appModuleType: moduleId == '570b4' ? MaParoisse.lib.Globals.getAccIdentificationRules().VIREMENTS_INTERNES : MaParoisse.lib.Globals.getAccIdentificationRules().THIRD_ACCOUNT}));
			}else if(this.isStringInArray(moduleId, this.saisieGuideeCreationSpecificModules)){
				if(AccBureau.lastMenuState == null){
					AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
				}
				moduleContainer.add(Ext.create('MaParoisse.view.saisir.FinanceTransactionTemplate', {moduleId: moduleId, appModuleType: 180}));
			}else if(this.isStringInArray(moduleId, this.saisieGuideeExpenseModules)){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.saisir.FinancialTransaction', {appModuleCode: moduleId, appModuleType: 6}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				} else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.saisir.FinancialTransaction', {appModuleCode: moduleId, appModuleType: 6}));
				}
			} else if(this.isStringInArray(moduleId, this.saisieGuideeIncomeModules)){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.saisir.FinancialTransaction', {appModuleCode: moduleId, appModuleType: 7}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				}  else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.saisir.FinancialTransaction', {appModuleCode: moduleId, appModuleType: 7}));
				}
			} else if(this.isStringInArray(moduleId, this.saisieGuideeTresorierModules)){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.saisir.FinancialTransaction', {appModuleCode: moduleId, appModuleType: 40}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				}  else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.saisir.FinancialTransaction', {appModuleCode: moduleId, appModuleType: 40}));
				}
			} else if(this.isStringInArray(moduleId, this.saisieGuideeSpecificModules)){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.saisir.FinancialTransaction', {appModuleCode: moduleId, appModuleType: 180}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				}  else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.saisir.FinancialTransaction', {appModuleCode: moduleId, appModuleType: 180}));
				}
			} else if(moduleId == '290b3'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.parametrages.BankCodification', {}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				} else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.parametrages.BankCodification', {}));
				}
			}else if(moduleId == '30b2'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.saisir.JournalFilter', {}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				} else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.saisir.JournalFilter', {}));
				}
			} else if(moduleId == '25b2'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.saisir.ModeStandart', {}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				} else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.saisir.ModeStandart', {}));
				}
			}else if(moduleId == '230b3'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.receipts.Contributors', {
			    										mode: MaParoisse.lib.Globals.getContributorsModuleModes().CRUDCONTRIBUTOR
			    									}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				} else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.receipts.Contributors', {
						mode: MaParoisse.lib.Globals.getContributorsModuleModes().CRUDCONTRIBUTOR
					}));
				}
			}else if(moduleId == '140a2'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.receipts.Contributors', {
			    										mode: MaParoisse.lib.Globals.getContributorsModuleModes().DOCGENERATION
			    									}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				} else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.receipts.Contributors', {
						mode: MaParoisse.lib.Globals.getContributorsModuleModes().DOCGENERATION
					}));
				}
			} else if(moduleId === '320b3'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.parametrages.AccInitialBalance', {appModuleCode: moduleId}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				}  else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.parametrages.AccInitialBalance', {appModuleCode: moduleId}));
				}
			} else if(moduleId === '300b3'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.parametrages.Engagements', {appModuleCode: moduleId}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				}  else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.parametrages.Engagements', {appModuleCode: moduleId}));
				}
			} else if(this.isStringInArray(moduleId, this.bibliothequeModules)){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.library.FileExplorer', {appModuleCode: moduleId}));
			    									var leftNavBar = Ext.getCmp('ae-viewport').getComponent('mainInnerPanel').getDockedComponent('leftBar');
			    									if(leftNavBar.hidden) {
			    										leftNavBar.show();
			    									}
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				}  else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.library.FileExplorer', {appModuleCode: moduleId}));
					var leftNavBar = Ext.getCmp('ae-viewport').getComponent('mainInnerPanel').getDockedComponent('leftBar');
					if(leftNavBar.hidden) {
						leftNavBar.show();
					}
				}
			}else if(moduleId === '325b3'){
				if(AccBureau.lastMenuState == null){
					AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
				}
				moduleContainer.add(Ext.create('MaParoisse.view.parametrages.Users', {appModuleId: moduleId}));
			} else if(moduleId === '240b3'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.receipts.Donation', {appModuleCode: moduleId}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				}  else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.receipts.Donation', {appModuleCode: moduleId}));
				}
			} else if(moduleId === '180b3'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.gerer.Budget', {appModuleCode: moduleId}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				}  else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.gerer.Budget', {appModuleCode: moduleId}));
				}
			} else if(moduleId === '190b3'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.gerer.BudgetRealisation', {appModuleCode: moduleId}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				}  else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.gerer.BudgetRealisation', {appModuleCode: moduleId}));
				}
			} else if(moduleId === '220b3'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.gerer.BordereauParoisse', {appModuleCode: moduleId}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				}  else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.gerer.BordereauParoisse', {appModuleCode: moduleId}));
				}
			} else if(moduleId === '295b3'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.parametrages.BankStatements', {appModuleCode: moduleId}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				}  else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.parametrages.BankStatements', {appModuleCode: moduleId}));
				}
			}else if(moduleId === '205a2'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.parametrages.PeriodManagement', {appModuleCode: moduleId}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				}  else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.parametrages.PeriodManagement', {appModuleCode: moduleId}));
				}
			}else if(moduleId === '200b3'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.gerer.MPChart', {
			    										appModuleCode: moduleId,
			    										title: 'Chauffage & électricité',
			    										chartHeading: 'Les 5 dernières années : chauffage & électricité',
			    										chartType: MaParoisse.view.gerer.MPChart.BAR,
			    										sortDirection: 'ASC',
			    										sortByProp: 'year',
			    										loadMethod: 'loadChauffage',
			    										printMethod: 'chauffage',
			    										storeFields: [{
			    									    	header: 'Année',
			    									    	dataIndex: 'year'
			    									    }, {
			    									    	header: 'Montant',
			    									    	align: 'right',
			    									    	renderer: function(value) {
			    									    		return Ext.util.Format.currency(value) + " &#8364;";
			    									    	},
			    									    	dataIndex: 'amount'
			    									    }]
			    									}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				}  else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.gerer.MPChart', {
						appModuleCode: moduleId,
						title: 'Chauffage & électricité',
						chartHeading: 'Les 5 dernières années : chauffage & électricité',
						chartType: MaParoisse.view.gerer.MPChart.BAR,
						sortDirection: 'ASC',
						sortByProp: 'year',
						loadMethod: 'loadChauffage',
						printMethod: 'chauffage',
						storeFields: [{
					    	header: 'Année',
					    	dataIndex: 'year'
					    }, {
					    	header: 'Montant',
					    	align: 'right',
					    	renderer: function(value) {
					    		return Ext.util.Format.currency(value) + " &#8364;";
					    	},
					    	dataIndex: 'amount'
					    }]
					}));
				}
			}else if(moduleId === '203b3'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.gerer.MPChart', {
			    										appModuleCode: moduleId,
			    										title: 'Quêtes ordinaires',
			    										chartHeading: 'Les 5 dernières années  : Quêtes ordinaires',
			    										chartType: MaParoisse.view.gerer.MPChart.BAR,
			    										sortDirection: 'ASC',
			    										sortByProp: 'year',
			    										loadMethod: 'quetesOrdinaires',
			    										printMethod: 'quetesOrdinaires',
			    										storeFields: [{
			    									    	header: 'Année',
			    									    	dataIndex: 'year'
			    									    }, {
			    									    	header: 'Montant',
			    									    	align: 'right',
			    									    	renderer: function(value) {
			    									    		return Ext.util.Format.currency(value) + " &#8364;";
			    									    	},
			    									    	dataIndex: 'amount'
			    									    }]
			    									}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				}  else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.gerer.MPChart', {
						appModuleCode: moduleId,
						title: 'Quêtes ordinaires',
						chartHeading: 'Les 5 dernières années  : Quêtes ordinaires',
						chartType: MaParoisse.view.gerer.MPChart.BAR,
						sortDirection: 'ASC',
						sortByProp: 'year',
						loadMethod: 'quetesOrdinaires',
						printMethod: 'quetesOrdinaires',
						storeFields: [{
					    	header: 'Année',
					    	dataIndex: 'year'
					    }, {
					    	header: 'Montant',
					    	align: 'right',
					    	renderer: function(value) {
					    		return Ext.util.Format.currency(value) + " &#8364;";
					    	},
					    	dataIndex: 'amount'
					    }]
					}));
				}
			}else if(moduleId === '205b3'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.gerer.MPChart', {
			    										appModuleCode: moduleId,
			    										title: 'Quêtes particulières',
			    										chartHeading: 'Les 5 dernières années  : Quêtes particulières/  pour chauffage',
			    										chartType: MaParoisse.view.gerer.MPChart.BAR,
			    										sortDirection: 'ASC',
			    										sortByProp: 'year',
			    										loadMethod: 'quetesParticuleres',
			    										printMethod: 'quetesParticuleres',
			    										storeFields: [{
			    									    	header: 'Année',
			    									    	dataIndex: 'year'
			    									    }, {
			    									    	header: 'Montant',
			    									    	align: 'right',
			    									    	renderer: function(value) {
			    									    		return Ext.util.Format.currency(value) + " &#8364;";
			    									    	},
			    									    	dataIndex: 'amount'
			    									    }]
			    									}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				}  else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.gerer.MPChart', {
						appModuleCode: moduleId,
						title: 'Quêtes particulières',
						chartHeading: 'Les 5 dernières années  : Quêtes particulières/  pour chauffage',
						chartType: MaParoisse.view.gerer.MPChart.BAR,
						sortDirection: 'ASC',
						sortByProp: 'year',
						loadMethod: 'quetesParticuleres',
						printMethod: 'quetesParticuleres',
						storeFields: [{
					    	header: 'Année',
					    	dataIndex: 'year'
					    }, {
					    	header: 'Montant',
					    	align: 'right',
					    	renderer: function(value) {
					    		return Ext.util.Format.currency(value) + " &#8364;";
					    	},
					    	dataIndex: 'amount'
					    }]
					}));
				}
			}else if(moduleId === '207b3'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.gerer.MPChart', {
			    										appModuleCode: moduleId,
			    										title: 'CHARGES DE L\'ANNEE',
			    										chartHeading: 'CHARGES DE L\'ANNEE',
			    										chartType: MaParoisse.view.gerer.MPChart.PIE,
			    										sortDirection: 'ASC',
			    										sortByProp: 'year',
			    										loadMethod: 'syntheseCharges',
			    										printMethod: 'syntheseCharges',
			    										storeFields: [{
			    									    	header: 'Comptes',
			    									    	dataIndex: 'entry',
			    									    	width: '75%'
			    									    }, {
			    									    	header: 'Montant',
			    									    	dataIndex: 'amount',
			    									    	align: 'right',
			    									    	renderer: function(value) {
			    									    		return Ext.util.Format.currency(value) + " &#8364;";
			    									    	},
			    									    	width: '25%'
			    									    }]
			    									}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				}  else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.gerer.MPChart', {
						appModuleCode: moduleId,
						title: 'CHARGES DE L\'ANNEE',
						chartHeading: 'CHARGES DE L\'ANNEE',
						chartType: MaParoisse.view.gerer.MPChart.PIE,
						sortDirection: 'ASC',
						sortByProp: 'entry',
						loadMethod: 'syntheseCharges',
						printMethod: 'syntheseCharges',
						storeFields: [{
					    	header: 'Comptes',
					    	dataIndex: 'entry',
					    	width: '75%'
					    }, {
					    	header: 'Montant',
					    	dataIndex: 'amount',
					    	align: 'right',
					    	renderer: function(value) {
					    		return Ext.util.Format.currency(value) + " &#8364;";
					    	},
					    	width: '25%'
					    }]
					}));
				}
			}else if(moduleId === '210b3'){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.gerer.MPChart', {
			    										appModuleCode: moduleId,
			    										title: 'LES RECETTES',
			    										chartHeading: 'LES RECETTES',
			    										chartType: MaParoisse.view.gerer.MPChart.PIE,
			    										sortDirection: 'ASC',
			    										sortByProp: 'year',
			    										loadMethod: 'syntheseRecettes',
			    										printMethod: 'syntheseRecettes',
			    										storeFields: [{
			    									    	header: 'Comptes',
			    									    	dataIndex: 'entry',
			    									    	width: '75%'
			    									    }, {
			    									    	header: 'Montant',
			    									    	dataIndex: 'amount',
			    									    	width: '25%',
			    									    	align: 'right',
			    									    	renderer: function(value) {
			    									    		return Ext.util.Format.currency(value) + " &#8364;";
			    									    	},
			    									    }]
			    									}));
		    									}
										});
				    				}}).show();
			    			}
		    			}
					}); 
				}  else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.gerer.MPChart', {
						appModuleCode: moduleId,
						title: 'LES RECETTES',
						chartHeading: 'LES RECETTES',
						chartType: MaParoisse.view.gerer.MPChart.PIE,
						sortDirection: 'ASC',
						sortByProp: 'entry',
						loadMethod: 'syntheseRecettes',
						printMethod: 'syntheseRecettes',
						storeFields: [{
					    	header: 'Comptes',
					    	dataIndex: 'entry',
					    	width: '75%'
					    }, {
					    	header: 'Montant',
					    	dataIndex: 'amount',
					    	align: 'right',
					    	renderer: function(value) {
					    		return Ext.util.Format.currency(value) + " &#8364;";
					    	},
					    	width: '25%'
					    }]
					}));
				}
			} else if(this.isStringInArray(moduleId, this.lePersonnelModules)){
				if(!Ext.isDefined(AccBureau.Context.principal.get('compId'))){
					Ext.create('MaParoisse.lib.MessageBox', {
		    			//header: false,
		    			title: 'Zachée',
		    			formHeight: 120,
		    			message: 'Aucun dossier sélectionné,<br/><br/>veuillez d\'abord sélectionner un dossier.',
		    			type: MaParoisse.lib.MessageBox.OK,
		    			callback: {
		    				fn: function(){
			    				Ext.create('MaParoisse.view.util.ParoisseSelectionWindow', {
				    				mode:10, 
				    				callback: function(customer){
				    					Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule(
			    							function(safe){
			    								if(safe){
			    									MaParoisse.app.getController('Root').setTenant(customer);
			    									if(AccBureau.lastMenuState == null){
			    										AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
			    									}
			    									moduleContainer.add(Ext.create('MaParoisse.view.library.FileExplorer', {appModuleCode: moduleId, allowUserDelete: false, allowUserUpload: false}));
			    									var leftNavBar = Ext.getCmp('ae-viewport').getComponent('mainInnerPanel').getDockedComponent('leftBar');
			    									if(leftNavBar.hidden) {
			    										leftNavBar.show();
			    									}
		    									}
										});
				    				}}).show();
			    			}
		    			}
					});
				}  else {
					if(AccBureau.lastMenuState == null){
						AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
					}
					moduleContainer.add(Ext.create('MaParoisse.view.library.FileExplorer', {appModuleCode: moduleId, allowUserDelete: false, allowUserUpload: false}));
					var leftNavBar = Ext.getCmp('ae-viewport').getComponent('mainInnerPanel').getDockedComponent('leftBar');
					if(leftNavBar.hidden) {
						leftNavBar.show();
					}
				}
			} else {
				if(AccBureau.lastMenuState == null){
					AccBureau.lastMenuState = moduleContainer.remove(Ext.getCmp('aeTilesPanel'), false);
				}
				moduleContainer.add(Ext.create('Ext.panel.Panel', {isSafeToClose: function(){return true;}}));
				window.history.back();
			}
		}
	}
});