Ext.define('MaParoisse.view.saisir.FinancialTransactionTabController', {
	extend: 'Ext.app.ViewController',
	
	alias: 'controller.fttabcontroller',
	
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
		
	},
	
	onSaveClicked: function(){
		var me = this,
			view = me.getView(),
			ftForm = view.getComponent('ftForm');
		
		if(ftForm.isValid()){
			//collect data for server
			this.updateCurrentFT();
			
			var financialTransaction = view.currentFT.getDataObjectOpt(options={serialize: true, persist: true});
			
			if(view.contributor){
				var donationColumn = ftForm.getComponent('donationColumn'),
					contrLastName = donationColumn.getComponent('employeeLastField'),
					contrFirstName = donationColumn.getComponent('employeeFirstField'),
					contrAddress = donationColumn.getComponent('employeeAddressField'),
					contrPostCode = donationColumn.getComponent('employeePostCodeField'),
					contrTown = donationColumn.getComponent('employeeTownField'),
					dirtyContributor = false;
				
				
				if(view.contributorRecord == null){
					view.contributorRecord = Ext.create('MaParoisse.model.Contributor', {});
					
					view.contributorRecord.data.employee = {
							lastName: '',
							firstName: '',
							address: {}
					};
				}
				if(view.contributorRecord.data.employee == null || typeof view.contributorRecord.data.employee == 'undefined') {
					view.contributorRecord.data.employee = {
							lastName: '',
							firstName: '',
							address: {}
					};
				}
				
				if(view.contributorRecord.data.employee.lastName != contrLastName.getValue()){
					view.contributorRecord.data.employee.lastName = contrLastName.getValue();
					dirtyContributor = true;
				}
				
				if(view.contributorRecord.data.employee.firstName != contrFirstName.getValue()){
					view.contributorRecord.data.employee.firstName = contrFirstName.getValue();
					dirtyContributor = true;
				}
				
				//FIXME: workaround for missung address fields from server response
				if(contrAddress.getValue() != ''){
					if(!Ext.isDefined(view.contributorRecord.data.employee.address)){
						view.contributorRecord.data.employee.address = {};
					}
					
					if(view.contributorRecord.data.employee.address.address != contrAddress.getValue()){
						view.contributorRecord.data.employee.address.address = contrAddress.getValue();
						dirtyContributor = true;
					}
				}
				if(contrPostCode.getValue() != ''){
					if(!Ext.isDefined(view.contributorRecord.data.employee.address)){
						view.contributorRecord.data.employee.address = {};
					}
					if(view.contributorRecord.data.employee.address.postCode != contrPostCode.getValue()){
						view.contributorRecord.data.employee.address.postCode = contrPostCode.getValue();
						dirtyContributor = true;
					}
				}
				if(contrTown.getValue() != ''){
					if(!Ext.isDefined(view.contributorRecord.data.employee.address)){
						view.contributorRecord.data.employee.address = {};
					}
					
					if(view.contributorRecord.data.employee.address.town != contrTown.getValue()){
						view.contributorRecord.data.employee.address.town = contrTown.getValue();
						dirtyContributor = true;
					}
				}
				
				if(dirtyContributor){
					view.contributorRecord.dirty = true;
				}
				financialTransaction.contributor = view.contributorRecord.getDataObjectOpt(options = {persist: true});
			}
			
			if(view.questType != null){
				var questGridColumn = ftForm.getComponent('queteColumn'),
					questGrid = questGridColumn.down('grid'),
					quests = [];
				
				questGrid.getStore().each(function(record){
					quests.push(record.getDataObjectExt());
				});
				
				financialTransaction.quetes = quests;
			}
			
			if(view.suppliers != null){
				var supplierCombo = ftForm.getComponent('firstColumn').getComponent('supplierCombo'),
					supplierStore = supplierCombo.getStore(),
					supplierToSubmit = null;
				
				if(supplierStore.getCount() > 0){
					supplierStore.each(function(supplier){
						if(supplier.get('name') === supplierCombo.getRawValue()){
							supplierToSubmit = supplier;
							return false;
						}
					});
				}
				
				if(supplierToSubmit == null && supplierCombo.getRawValue() != ''){
					supplierToSubmit = Ext.create('MaParoisse.model.util.NameId', {
						name: supplierCombo.getRawValue()
					});
				}else if (supplierCombo.getRawValue() === ''){
					supplierToSubmit = Ext.create('MaParoisse.model.util.NameId', {
						name: '',
						id: 0
					});
				}
				
				financialTransaction.supplier = supplierToSubmit.data;
			}
			
			//if there is a file Attachment add it to the transaction
			if(view.fileAttachment != null){
				financialTransaction.fileAttachment = view.fileAttachment;
			}
			
			//make a save request
			var req = Ext.create('MaParoisse.lib.JsonRPC', {
				url: '/FinancialTransactionServlet',
				service_type: 'FinancialTransactionService',
				listeners: {
					success: function () {
						//show success and load the server data 
						MaParoisse.plugin.notification.showSuccess(' ','succès');
						
						var resp = arguments[0].BODY;
						console.log(resp);
						view.currentFT = Ext.create('MaParoisse.model.FinancialTransaction', resp.financialTransaction);
						
						me.updateView();
						MaParoisse.lib.Globals.setLastUsedJournal(view.title);
						if(view.allowEditing){
							view.close();
						} else {
							window.history.back();
						}
					},
					error: function () {}
				}
			});
			
			req.request({
				method: 'saveFinancialTransaction',
				params: {
					ownerId: AccBureau.Context.principal.data.compId,
					appModuleCode: view.appModuleCode,
					financialTransaction: financialTransaction
				}
			});
		} else {
			MaParoisse.plugin.notification.showError(' ','Erreur de validation');
		}
	},
	
	 onUploadClicked: function(){
    	var me = this,
    		view = me.getView(),
    		tbar = view.getDockedComponent('topToolbar'),
    		menu = tbar.getComponent('uploadBtn').getMenu(),
    		fileForm = menu.getComponent('fileForm');
    	
    	if(fileForm.getForm().isValid()){
    		fileForm.submit({
                url: '../FileUploadServlet',
                method: 'POST',
                success: function(form, action) {
                	me.doAddFile(action);
                	menu.hide();
                }
            });
    	}
    },
    
    doAddFile: function(action){
    	var me = this,
			view = me.getView();
    	
    	view.fileAttachment = action.result.fileAttachment;
    },
	
	onAddClicked: function(){
		var me = this,
			view = me.getView(),
			accJournalItemsGrid = view.getComponent('accJournalItems');
		
		var newItem = Ext.create('MaParoisse.model.AccJournalItem', {});
		
		accJournalItemsGrid.getStore().add(newItem);
		accJournalItemsGrid.getPlugin('accjournalentryplugin').startEdit(newItem, 1);
	},
	
	onChooseContributorClicked: function(){
		var me = this;
		
		Ext.create('MaParoisse.view.util.PersonSelectionWindow', {
			allowCreate: true,
			callback: function(record){
				me.setChosenContributor(record);
			}
		});
	},
	
	onQueteComboSelect: function(combo, records, eOpts){
		var me = this,
			view = me.getView(),
			ftForm = view.getComponent('ftForm'),
			queteColumn = ftForm.getComponent('queteColumn'),
			quetesGrid = queteColumn.down('grid');
		
		var gridCurrentQuete = quetesGrid.getStore().getAt(0);
		
		gridCurrentQuete.set('code', records[0].get('code'));
		
	},
	
	updateCurrentFT: function(){
		var me = this,
			view = me.getView(),
			ftForm = view.getComponent('ftForm'),
			itemsGrid = view.getComponent('accJournalItems');
		
		ftForm.updateRecord(view.currentFT);
		
		var accJournalItems = [];
		
		itemsGrid.getStore().each(function(rec){
			accJournalItems.push(rec.getDataObjectOpt(options={serialize: true, persist: true}));
		});
		
		view.currentFT.get('accJournalEntry').accJournalItems = accJournalItems;
	},
	
	updateView: function(){
		var me = this,
			view = me.getView(),
			ftForm = view.getComponent('ftForm'),
			itemsGrid = view.getComponent('accJournalItems');
		
		if(view.questType != null){
			var questGrid = ftForm.getComponent('queteColumn').down('grid');
			
			questGrid.getStore().loadData(view.currentFT.get('quetes'));
		}
		
		ftForm.loadRecord(view.currentFT);
		
		if(view.contributor){
			view.contributorRecord = MaParoisse.model.Contributor.create(view.currentFT.get('contributor'));
			if(view.contributorRecord == null || typeof view.contributorRecord == 'undefined'){
				view.contributorRecord = Ext.create('MaParoisse.model.Contributor', {});
				
				view.contributorRecord.data.employee = {
						lastName: '',
						firstName: '',
						address: {}
				};
			}
			if(view.contributorRecord.data.employee == null || typeof view.contributorRecord.data.employee == 'undefined') {
				view.contributorRecord.data.employee = {
						lastName: '',
						firstName: '',
						address: {}
				};
			}
			
			view.contributorRecord.data.employeeLastName = view.contributorRecord.data.employee.lastName;
			view.contributorRecord.data.employeeFirstName = view.contributorRecord.data.employee.firstName;
			view.contributorRecord.data.employeeAddress = view.contributorRecord.data.employee.address.address;
			view.contributorRecord.data.employeePostCode = view.contributorRecord.data.employee.address.postCode;
			view.contributorRecord.data.employeeTown = view.contributorRecord.data.employee.address.town;
			
			var donationColumn = ftForm.getComponent('donationColumn'),
			contrLastName = donationColumn.getComponent('employeeLastField'),
			contrFirstName = donationColumn.getComponent('employeeFirstField'),
			contrAddress = donationColumn.getComponent('employeeAddressField'),
			contrPostCode = donationColumn.getComponent('employeePostCodeField'),
			contrTown = donationColumn.getComponent('employeeTownField');
			
			
			contrLastName.setValue(view.contributorRecord.get('employeeLastName'));
			contrLastName.resetOriginalValue();
			contrFirstName.setValue(view.contributorRecord.get('employeeFirstName'));
			contrFirstName.resetOriginalValue();
			contrAddress.setValue(view.contributorRecord.get('employeeAddress'));
			contrAddress.resetOriginalValue();
			contrPostCode.setValue(view.contributorRecord.get('employeePostCode'));
			contrPostCode.resetOriginalValue();
			contrTown.setValue(view.contributorRecord.get('employeeTown'));
			contrTown.resetOriginalValue();
		}
		
		itemsGrid.getStore().loadData(view.currentFT.get('accJournalEntry').accJournalItems);
	},
	
	setChosenContributor: function(record){
		var me = this,
			view = me.getView();
		if(view.contributor){
			var	form = view.getComponent('ftForm'),
			donationColumn = form.getComponent('donationColumn'),
			contrLastName = donationColumn.getComponent('employeeLastField'),
			contrFirstName = donationColumn.getComponent('employeeFirstField'),
			contrAddress = donationColumn.getComponent('employeeAddressField'),
			contrPostCode = donationColumn.getComponent('employeePostCodeField'),
			contrTown = donationColumn.getComponent('employeeTownField');
		
			contrLastName.setValue(record.get('employeeLastName'));
			contrFirstName.setValue(record.get('employeeFirstName'));
			contrAddress.setValue(record.get('employeeAddress'));
			contrPostCode.setValue(record.get('employeePostCode'));
			contrTown.setValue(record.get('employeeTown'));
			
			view.contributorRecord = Ext.create('MaParoisse.model.Contributor', record.data);
		}
	}
});