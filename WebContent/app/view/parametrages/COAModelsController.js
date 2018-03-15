Ext.define('MaParoisse.view.parametrages.COAModelsController', {
	extend: 'Ext.app.ViewController',
	
	alias: 'controller.coamodels',
	
	coaModels : null,
	currentModel: null,
	
	deletedAccounts: [],
	
	onRender: function(){
		this.loadInitialData();
	},
	
	//TODO: prompt the user to save unsaved changes
	beforeModelDeselect: function(){
		
	},
	
	onModelsGridSelectionChange: function(selModel, selected, eOpts){
		var me = this;
		if(selModel.hasSelection()){
			me.doLoadModelForEditing(selected[0]);
		}
	},
	
	onGridAfterRender: function(grid){
		var view = grid.getView();
		view.on('itemupdate', function (record, y, node, options) {
        	this.validateRow(this.getColumnIndexes(grid), record, y, true);
    	}, grid);
	},
	
	onSaveClicked: function(){
		var me = this,
			accountsStore = me.getView().getComponent('centerContainer').getComponent('accountsGrid').getStore();
		
		if(me.isValidModel()){
			if(me.updateCOAModels()){
				var req = Ext.create('MaParoisse.lib.JsonRPC', {
					url: '/Accounting',
					service_type: 'AccService',
					listeners: {
						success: function () {
							//show success and load the server data 
							MaParoisse.plugin.notification.showSuccess(' ','succès');
							me.deletedAccounts = [];
							me.doLoadModelsInView(arguments[0].BODY.coaModels);
							
						},
						error: function () {
							Ext.each(me.deletedAccounts, function(deletedAccount){
								deletedAccount.set('dbState', 0);
							});
							accountsStore.add(me.deletedAccounts);
							me.deletedAccounts = [];
						}
					}
				});
				
				req.request({
					method: 'saveCOAModels',
					params: {
						coaModels: me.coaModels
					}
				});
			}
		} else {
			MaParoisse.plugin.notification.showError(' ','Erreur de validation');
		}
	},
	
	onAddClicked: function(){
		var me = this,
		accountsGrid = me.getView().getComponent('centerContainer').getComponent('accountsGrid'),
		accountsStore = accountsGrid.getStore(),
		accRowEditPlugin = accountsGrid.getPlugin('accountsEditingPlugin'),
		newAccount = new MaParoisse.model.Account({modifiable: false, system: false, accType: 0});
		
		//add the new account to the grid and start editing it
		accountsStore.insert(0, newAccount);
		
		accRowEditPlugin.startEdit(newAccount, 1);
	},
	
	onRefreshClicked: function(){
		var view = this.getView(),
			accGrid = view.getComponent('centerContainer').getComponent('accountsGrid'),
			accRowEditPlugin = accGrid.getPlugin('accountsEditingPlugin');
		
		accRowEditPlugin.completeEdit();
		
		try{
			accRowEditPlugin.cancelEdit();
		} catch(e){
			
		}
	},
	
	onDeleteClicked: function(){
		var me = this,
		accGrid = me.getView().getComponent('centerContainer').getComponent('accountsGrid'),
		accSelModel = accGrid.getSelectionModel(),
		accRowEditPlugin = accGrid.getPlugin('accountsEditingPlugin'),
		accStore = accGrid.getStore();
	
		accRowEditPlugin.completeEdit();
		var s = accSelModel.getSelection();
		for (var i = 0, r; r = s[i]; i++) {
			me.removeRecord(r, accStore);
		}
		accGrid.getView().refresh();
	},
	
	onTenantChange: function(){
		this.releaseResources();
		this.loadInitialData();
	},
	
	onGridContextMenu: function(view, record, item, index, e, eOpts){
		var me = this,
		ds = me.getView().getComponent('centerContainer').getComponent('accountsGrid').getStore(),
		accRecord = record,
		menu = Ext.create('Ext.menu.Menu', {
			autoShow: false,
			items:[]
		});
		menu.add({
			icon: null,
			glyph: 'xe059@iconFont',

	        iconAlign: 'left',
	        text: 'Supprimer',
	        handler: function(){
	        	me.removeRecord(accRecord, ds);
        	}
		});
		e.stopEvent();
	    menu.showAt(e.getXY());
	    return false;
	},
	
	loadInitialData: function(){
		var me = this,
			req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/Accounting',
			service_type: 'AccService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					/*
					 * load coa models
					 * since dontSeparateByAccType exists in the request and is set to true
					 * it is expected that all accounts and pattern should be contained in
					 * the acounts property of a model object
					*/
					me.doLoadModelsInView(arguments[0].BODY.coaModels);
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'loadCOAModels',
			params: {
				customerId:  AccBureau.Context.principal.data.compId,
				
				//if existing and set to true all accounts and pattern should be returned in the accounts property of a model
				dontSeparateByAccType: true
			}
		});
	},
	
	doLoadModelsInView: function(coaModels){
		var me = this,
			view = me.getView(),
			modelsGrid = view.getComponent('coaModelsGrid'),
			modelsStore = modelsGrid.getStore();
		
		if(Ext.isDefined(coaModels)){
			me.coaModels = coaModels;		
			modelsStore.loadData(me.coaModels);
			if(me.coaModels.length > 1){
				modelsGrid.setVisible(true);
				modelsGrid.expand();
			} else {
				//paranoic check
				if(modelsStore.getCount() == 1){
					var modelRecord = modelsStore.getAt(0);
					me.doLoadModelForEditing(modelRecord);
				}
			}
		}
	},
	
	doLoadModelForEditing: function(modelRecord){
		var me = this,
			view = me.getView(),
			accountsStore = view.getComponent('centerContainer').getComponent('accountsGrid').getStore(),
			coaForm = view.getComponent('centerContainer').getComponent('COAAttributesForm');
		
		me.currentModel = modelRecord;
		
		accountsStore.loadData(me.currentModel.get('accounts'));
		coaForm.loadRecord(me.currentModel);
	},
	
	updateCurrentModel: function(){
		var me = this,
		view = me.getView(),
		accountsStore = view.getComponent('centerContainer').getComponent('accountsGrid').getStore(),
		modelForm = view.getComponent('centerContainer').getComponent('COAAttributesForm');
		//modelNameField = modelForm.getComponent('modelNameField');
		
		if(modelForm.isValid()){
			modelForm.updateRecord(me.currentModel);
			var accounts = [];
			
			if(modelForm.isDirty()){
				me.currentModel.set('dbState', 2);
			}
			
			accountsStore.each(function(account){
				accounts.push(account.getDataObjectExt());
				
				if(account.get('dbState') == 2){
					me.currentModel.set('dbState', 2);
				}
			});
			
			Ext.each(me.deletedAccounts, function(account){
				accounts.push(account.getDataObjectExt());
			});
			
			me.currentModel.set('accounts', accounts);
			
			return true;
		} else {
			MaParoisse.plugin.notification.showError('Ce champ est obligatoire','Erreur');
			return false;
		}
	},
	
	updateCOAModels: function(){
		//get the current module data and update its record in the models store
		var me = this,
			view = me.getView(),
			modelStore = view.getComponent('coaModelsGrid').getStore();
		if(me.updateCurrentModel()){			
			var recordToUpdate = modelStore.findBy(function(record, id){
				if(Ext.isDefined(me.currentModel.get('id')) && me.currentModel.get('id') == id){
					return record;
				}
			});
			
			modelStore.remove(recordToUpdate);
			modelStore.add(me.currentModel);
			return true;
		} else {
			return false;
		}
	},
	
	removeRecord: function(rec, ds){
		var me = this;
		//if(rec.get('modifiable')){
			Ext.create('MaParoisse.lib.MessageBox', {
				title: 'Zachée',
				formHeight: 120,
				message: 'Etes vous sure de vouloir supprimer ce compte?',
				type: MaParoisse.lib.MessageBox.QUESTION,
				callback: {
					fn: function(btnId){
						if(btnId == MaParoisse.lib.MessageBox.YES){
							rec.setDeleted();
							ds.remove(rec);
							if(!rec.phantom){
								me.deletedAccounts.push(rec/*.getDataObjectExt()*/);
							}
						}
	    			}
				}
			});
		//}
		
	},
	
	//TODO: implement
	isValidModel: function(){
		var me = this,
		view = me.getView(),
		accountsStore = view.getComponent('centerContainer').getComponent('accountsGrid').getStore();
		
		var valid = true;
		
		accountsStore.each(function(record){
			if(record.get('code') == '' || record.get('name') == '' ||	record.get('description') == ''){
				valid = false;
				return valid;
			}
		});
		return valid;
	},
	
	releaseResources: function(){
		var me = this,
			view = me.getView(),
			modelsStore = view.getComponent('coaModelsGrid').getStore(),
			accountsStore = view.getComponent('centerContainer').getComponent('accountsGrid').getStore(),
			modelForm = view.getComponent('centerContainer').getComponent('COAAttributesForm');
		
		modelsStore.removeAll();
		accountsStore.removeAll();
		modelForm.reset();
		
		me.currentModel = null;
		me.coaModels = null;
		me.deletedAccounts = [];
	}
});