Ext.define('MaParoisse.view.parametrages.PlanComptableController', {
	extend: 'Ext.app.ViewController',
	
	alias: 'controller.plancomptable',
	
	/*
	 * Controller vars
	 */
	
	//current Chart Of Accounts
	currentCOA: null,
	
	//store here the data from the deleted accounts
	deletedAccounts: [],
	
	/*
	 * View event listener functions
	 */
	
	onRender: function(){
		this.loadInitialData();
	},
	
	onSaveClicked: function(){
		var me = this;
		
		me.onRefreshClicked();
		
		if(me.isValidCOA()){
			me.updateCurrentCOA();
	
			var req = Ext.create('MaParoisse.lib.JsonRPC', {
				url: '/Accounting',
				service_type: 'AccService',
				listeners: {
					success: function () {
						//show success and load the server data 
						MaParoisse.plugin.notification.showSuccess(' ','succès');
						me.deletedAccounts = [];
						me.doLoadCustomersCOA(arguments[0].BODY.chartOfAccounts);
						
					},
					error: function () {}
				}
			});
			
			req.request({
				method: 'saveCOA',
				params: {
					customerId:  AccBureau.Context.principal.data.compId,
					chartOfAccounts: me.currentCOA.getDataObjectExt()
				}
			});
		} else {
			MaParoisse.plugin.notification.showError(' ','Erreur de validation');
		}
	},
	
	onAddClicked: function(){
		var me = this,
			patternGrid = me.getView().getComponent('patternGrid'),
			patternSelModel = patternGrid.getSelectionModel();
		
		me.onRefreshClicked();
		
		if(Ext.isDefined(patternSelModel) && patternSelModel.hasSelection()){
			var pattern = patternSelModel.getSelection()[0];
			me.doCreateAccFromPattern(pattern);
		} else {
			MaParoisse.plugin.notification.showError('Pour ajouter un nouveau compte, vous devez sélectionner le compte racine dans la liste des comptes personnalisables.','Erreur');
		}
		
	},
	
	onDeleteClicked: function(){
		var me = this,
			accGrid = this.getView().getComponent('accountsGrid'),
			accSelModel = accGrid.getSelectionModel(),
			accRowEditPlugin = accGrid.getPlugin('accountsEditingPlugin'),
			accStore = accGrid.getStore();
		
		me.onRefreshClicked();
		
		accRowEditPlugin.completeEdit();
		var s = accSelModel.getSelection();
		for (var i = 0, r; r = s[i]; i++) {
			me.removeRecord(r, accStore);
		}
		accGrid.getView().refresh();
	},
	
	onRefreshClicked: function(){
		var accGrid = this.getView().getComponent('accountsGrid'),
		accRowEditPlugin = accGrid.getPlugin('accountsEditingPlugin');
		
		accRowEditPlugin.completeEdit();
		
		try{
			accRowEditPlugin.cancelEdit();
		} catch(e){
			
		}
	},
	
	onModelsComboSelect: function(combo, value){
		var me = this,
			ds = me.getView().getComponent('accountsGrid').getStore();
		
		var newCOA = Ext.create('MaParoisse.model.ChartOfAccounts', value[0].getDataObjectExt());
		
		newCOA.resetAsNew();
		
		var accounts = newCOA.get('accounts');
		var patterns = newCOA.get('patterns');
		
		me.doLoadAccPatterns(patterns);
		
		Ext.each(accounts, function(acc){
			var newId = (-1 * Ext.data.Record.AUTO_ID++);
			acc.parent = {
					id: acc.id,
					code: acc.code
			};
			acc.id = newId;
			acc.coaId = -1;
			acc.dbState = 1;
		});
		
		newCOA.set('accounts', accounts);
		newCOA.set('modelId', value[0].id);
		
		me.doLoadCustomersCOA(newCOA.getDataObjectExt(), true);
		
		ds.each(function(r){
			r.phantom = true;
		}, this);
	},
	
	/*
	* @event beforeedit
    * Fires before editing is triggered. Return false from event handler to stop the editing.
    *
    * @param {Ext.grid.plugin.Editing} editor
    * @param {Object} context The editing context with the following properties:
    *  @param {Ext.grid.Panel}         context.grid The owning grid Panel.
    *  @param {Ext.data.Model}         context.record The record being edited.
    *  @param {String}                 context.field The name of the field being edited.
    *  @param {Mixed}                  context.value The field's current value.
    *  @param {HTMLElement}            context.row The grid row element.
    *  @param {Ext.grid.column.Column} context.column The Column being edited.
    *  @param {Number}                 context.rowIdx The index of the row being edited.
    *  @param {Number}                 context.colIdx The index of the column being edited.
    *  @param {Boolean}                context.cancel Set this to `true` to cancel the edit or return false from your handler.
    *  @param {Mixed}                  context.originalValue Alias for value (only when using {@link Ext.grid.plugin.CellEditing CellEditing}).
    */
	beforeAccountEdit: function(editor, context){
		if(context.record.get('modifiable')){
			
		} else {
			return false;
		}
	},
	
	/* @param {Ext.grid.plugin.Editing} editor
	* @param {Object} context The editing context with the following properties:
	*  @param {Ext.grid.Panel}         context.grid The owning grid Panel.
	*  @param {Ext.data.Model}         context.record The record being edited.
	*  @param {String}                 context.field The name of the field being edited.
	*  @param {Mixed}                  context.value The field's current value.
	*  @param {HTMLElement}            context.row The grid row element.
	*  @param {Ext.grid.column.Column} context.column The Column being edited.
	*  @param {Number}                 context.rowIdx The index of the row being edited.
	*  @param {Number}                 context.colIdx The index of the column being edited.
	*/
	onValidateAccount: function(editor, context){
		var record = context.record,
		pattern = record.get('parent').code,
		patternFixedNumbers = new RegExp(pattern.replace(/[xX]/g, '\\d') + '$');
		if(context.field != 'code'){
			return true;
		} else if(patternFixedNumbers.test(context.newValues[context.field])){
			return true;
		} else {
			return false;
		}
	},
	
	onTenantChange: function(){
		this.releaseResources();
		this.loadInitialData();
	},
	
	onGridAfterRender: function(grid){
		var view = grid.getView();
		view.on('itemupdate', function (record, y, node, options) {
        	this.validateRow(this.getColumnIndexes(grid), record, y, true);
    	}, grid);
	},
	
	onRowCancelEdit: function(editor, context, eOpts){
		var view = context.grid.getView(),
			record = context.record,
			y = context.rowIdx;
		
		
		//view.fireEvent('itemupdate', record, y);
	},
	
	onPatternDblClick: function(view, record, item, index, e, eOpts){
		var me = this,
			patternRecord = record;
		
		
		if(Ext.isDefined(patternRecord)){
			me.doCreateAccFromPattern(patternRecord);
		}
	},
	
	onPatternContextMenu: function(view, record, item, index, e, eOpts){
		var me = this,
			patternRecord = record,
			menu = Ext.create('Ext.menu.Menu', {
			autoShow: false,
			items:[]
		});
		menu.add({
			text: 'Ajouter un compte',
			icon: null,
			glyph: 'xe08c@iconFont',
			iconAlign: 'left',
			handler: function(){
				me.doCreateAccFromPattern(patternRecord);
			}
		});
		e.stopEvent();
        menu.showAt(e.getXY());
        return false;
	},

	/*
	 * Business logic functions
	 */

	//TODO: load COA: specify servlet, service & method
	loadInitialData: function(){

		var me = this;
		
		//load COA models
		var req1 = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/Accounting',
			service_type: 'AccService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					me.doLoadCOAModels(arguments[0].BODY.coaModels);
					//load Customer's current COA
					var req2 = Ext.create('MaParoisse.lib.JsonRPC', {
						url: '/Accounting',
						service_type: 'AccService',
						listeners: {
							success: function () {
								//show success and load the server data 
								MaParoisse.plugin.notification.showSuccess(' ','succès');
								var resp = arguments[0].BODY;
								me.doLoadCustomersCOA(resp.chartOfAccounts, false);
								me.doLoadAccPatterns(resp.chartOfAccounts.patterns);
								
							},
							error: function () {}
						}
					});
					
					req2.request({
						method: 'loadCOA',
						params: {
							customerId:  AccBureau.Context.principal.data.compId
						}
					});
				},
				error: function () {}
			}
		});
		
		req1.request({
			method: 'loadCOAModels',
			params: {
				customerId:  AccBureau.Context.principal.data.compId
			}
		});
		
		/*
		 * VAT request is not needed
		 */
		//load VAT combo data
//		var req3 = Ext.create('MaParoisse.lib.JsonRPC', {
//			url: '/Accounting',
//			service_type: 'AccService',
//			listeners: {
//				success: function () {
//					//show success and load the server data 
//					MaParoisse.plugin.notification.showSuccess(' ','succès');
//					
//					//load the VAT combo store
//					me.doLoadVATCombo(arguments[0].BODY.items);
//				},
//				error: function () {}
//			}
//		});
//		
//		req3.request({
//			method: 'loadVATItems',
//			params: {
//				filter:  null
//			}
//		});
		
		
	},
	
	doCreateAccFromPattern: function(pattern){
		var me = this,
			accountsGrid = me.getView().getComponent('accountsGrid'),
			accountsStore = accountsGrid.getStore(),
			accRowEditPlugin = accountsGrid.getPlugin('accountsEditingPlugin'),
			newAccount = new MaParoisse.model.Account();
		
		//TODO: fill the required fields of the new account with the data from the pattern
		newAccount.set('modifiable', true);
		newAccount.set('parent', {
			id: pattern.get('id'),
			code: pattern.get('code')
		});
		
		//calculate suggested code without X
		newAccount.set('code', pattern.get('code').replace(/[xX]+$/, ''));
		
		newAccount.set('name', pattern.get('name'));
		newAccount.set('description', pattern.get('description'));
		newAccount.set('coaId', me.currentCOA.get('id'));
		newAccount.set('accType', '50');
		
		//add the new account to the grid and start editing it
		accountsStore.insert(0, newAccount);
		
//		var rowIndex = accountsStore.find('id', newAccount.get('id'));
//		accountsGrid.getSelectionModel().select(rowIndex);
//		Ext.fly(accountsGrid.getView().getNode(rowIndex)).scrollIntoView();
		
		accRowEditPlugin.startEdit(newAccount, 1);
	},
	
	doLoadAccPatterns: function(patterns){
		var patternDs = Ext.data.StoreManager.lookup('patternStore');
		
		patternDs.loadData(patterns);
	},
	
//	doLoadVATCombo: function(vatItems){
//		var comboDs = Ext.data.StoreManager.lookup('VATStore');
//		comboDs.loadData(vatItems);
//	},
	
	doLoadCustomersCOA: function(chartOfAccounts, isModelLoad){
		var me = this,
			ds = me.getView().getComponent('accountsGrid').getStore(),
			coaForm = me.getView().getComponent('COAAttributesForm');
		
		me.currentCOA = Ext.create('MaParoisse.model.ChartOfAccounts', chartOfAccounts);
		
		ds.loadData(me.currentCOA.get('accounts'));
		coaForm.loadRecord(me.currentCOA);
		
		/*
		 * since the form is configured with
		 * trackResetOnLoad = true
		 * reset function will not clear the form
		 * to its initial empty state, but to the last
		 * loaded Record (load methods or setValue method)
		 * 
		 * passing a true parameter though should 
		 * clear the form
		 */
		coaForm.resetForm();
		
		//if COA is already created disable the models combo
		if(!isModelLoad && (me.currentCOA.get('modelId') != -1 || typeof me.currentCOA.get('id') == 'number')){
			var modelCombo = coaForm.getComponent('formFieldContainer').getComponent('firstColFieldCont').getComponent('modelCombo'),
				ds = modelCombo.getStore(),
				recordToSelect;
			
			modelCombo.suspendEvent('select');

			ds.each(function(rec){
				if(rec.get('id') === me.currentCOA.get('modelId')){
					recordToSelect = rec;
					return false;
				}
			});
			if (Ext.isDefined(recordToSelect)){
				modelCombo.select(recordToSelect);
			}
			modelCombo.resumeEvent('select');
			modelCombo.disable();
		}
		
	},
	
	doLoadCOAModels: function(coaModels){
		var //me = this,
			//coaForm = me.getView().getComponent('COAAttributesForm'),
			modelsStore = Ext.data.StoreManager.lookup('modelsStore');
		
		modelsStore.loadData(coaModels);
	},
	
	updateCurrentCOA: function(){
		var me = this,
			ds = me.getView().getComponent('accountsGrid').getStore(),
			coaForm = me.getView().getComponent('COAAttributesForm'),
			accounts = [];
		
		coaForm.updateRecord(me.currentCOA);
		
		ds.each(function(record){
			accounts.push(record.getDataObjectExt());
		});
		
		Ext.each(me.deletedAccounts, function(record){
			accounts.push(record);
		});
		
		me.currentCOA.set('accounts', accounts);
	},
	
	removeRecord: function(rec, ds){
		var me = this;
		if(rec.get('modifiable')){
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
								me.deletedAccounts.push(rec.getDataObjectExt());
							}
						}
	    			}
				}
			});
		}
		
	},
	
	releaseResources: function(){
		var me = this,
			accGrid = me.getView().getComponent('accountsGrid'),
			coaForm = me.getView().getComponent('COAAttributesForm'),
			accStore = accGrid.getStore(),
			patternStore = Ext.data.StoreManager.lookup('patternStore');
		
		me.currentCOA = null;
		coaForm.reset(true);
		coaForm.getComponent('formFieldContainer').getComponent('firstColFieldCont').getComponent('modelCombo').enable();
		accStore.removeAll();
		patternStore.removeAll();
		me.deletedAccounts = [];
	},
	
	isValidCOA: function(){
		var valid = true,
			view = this.getView(),
			ds = view.getComponent('accountsGrid').getStore(),
			form = view.getComponent('COAAttributesForm').getForm();
		
		if(!form.isValid()){
			return false;
		}
		
		ds.each(function(m){
			if(m.validate().items.length > 0){
				valid = false;
				return valid;
			}
		});
		
		
		return valid;
	},
	
	onPrintClicked: function(){
		window.open(
			'../CefraForm?number=chart_of_accounts&ownerId=' + AccBureau.Context.principal.data.compId,
			'_Print');
	}
});