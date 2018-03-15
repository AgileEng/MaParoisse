Ext.define('MaParoisse.view.saisir.ModeStandartTabController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.saisir-modestandarttab',
	requires: ['Ext.data.identifier.Negative', 'MaParoisse.model.AccEntryAttachment'],
	
	attachmentStore: new Ext.data.Store({
		autoDestroy: true,
		model: 'MaParoisse.model.AccEntryAttachment'
	}),
	
	onRender: function(){
		//create an instance of a id generator
		this.entryIdGen = new Ext.data.identifier.Negative({
			seed: 0
		});
		//generate the first id
		this.entryIdGen.generate();
		
		//paranoic clear
		this.attachmentStore.removeAll();
		//this.onFilterClicked();
	},
	
	onFilterClicked: function(){
		var me = this,
			view = me.getView(),
			accJournalItemsGrid = view.getComponent('journalItemsGrid'),
			form = view.getComponent('northContainer').getComponent('filterForm').getForm();
		
		me.attachmentStore.removeAll();
		
		if(view.filterRecord == null){
			view.filterRecord = Ext.create('MaParoisse.model.JournalFilter', {paymentMethodId: view.paymentMethodId, bankAccountId: view.bankAccountId});
		}
		
		form.updateRecord(view.filterRecord);
		var journalFilter = view.filterRecord.getDataObjectOpt(options={serialize: true, persist: true});
		if(view.bankAccountId != null){
			journalFilter.bankAccountId = view.bankAccountId;
		}
		journalFilter.ownerId = AccBureau.Context.principal.data.compId;
		/*
		 * Just be paranoic and make sure that journalCode will not conflict with
		 * the journal identification that is implemented for this module
		 */
		journalFilter.journalCode = '';
		var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/FinancialTransactionServlet',
			service_type: 'FinancialTransactionService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY,
						ds = accJournalItemsGrid.getStore(),
						accJournalResults = resp.accJournalResults,
						attachments = resp.attachments;
					if(Ext.isDefined(attachments)){
						for(var i = 0; i < accJournalResults.length; i++){
							for(var j = 0; j < attachments.length; j++){
								if(accJournalResults[i].accJournalItem.entryId === attachments[j].entryId){
									accJournalResults[i].attachmentName = attachments[j].name;
									accJournalResults[i].attachmentRemoteName = attachments[j].remoteName;
									accJournalResults[i].attachmentId = attachments[j].attId;
								}
							}
						}
					}
					
					ds.loadRawData(accJournalResults);
					if(view.modifiable){
						me.createNewJournalItem(ds, true);
					}
					me.setBalance(resp.accBalance);
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'loadAccJournalItemsByFilter',
			params: {
				ownerId: AccBureau.Context.principal.data.compId,
				accJournalItemsFilter: journalFilter
			}
		});
	},
	
	onRadioChange: function(field, newValue, oldValue, eOpts){
		field.up().getComponent('dateFromField').setDisabled(!newValue);
		field.up().getComponent('dateToField').setDisabled(!newValue);
		
		var col1row1 = field.up().up().getComponent('col1row1');
		
		col1row1.getComponent('monthField').setDisabled(newValue);
		col1row1.getComponent('yearField').setDisabled(newValue);
	},
	
	onAccJournalItemDblClick: function(view, record, tr, rowIndex, e, eOpts){
		this.getView().findParentByType('tabpanel').fireEvent('requestFTByAccJournalItemId', record.get('id'));
	},
	
	onSearchFieldKeyUp: function(field, e, eOpts){
		var me = this,
			view = me.getView(),
			grid = view.getComponent('journalItemsGrid');
		
		grid.getStore().filterBy(function (record) {
			var searchValue = field.getValue().toUpperCase();
			if (searchValue.length == 0) {
				return true;
			} else if (
				record.get('ajiEntryId').toString().indexOf(searchValue) > -1 ||
				Ext.util.Format.date(record.get('ajiDateCreation')).toUpperCase().indexOf(searchValue) > -1 ||
				Ext.util.Format.date(record.get('ajiDate')).toUpperCase().indexOf(searchValue) > -1 ||
				record.get('ajiJournal').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('ajiAccCode').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('ajiAccName').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('ajiDtAmount').toString().indexOf(searchValue) > -1 ||
				record.get('ajiCtAmount').toString().indexOf(searchValue) > -1 ||
				record.get('ajiDescription').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('contributorFirstName').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('contributorLastName').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('contributorAddress').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('contributorPostCode').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('contributorTown').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('supplierName').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('ajiCodeQuete').toUpperCase().indexOf(searchValue) > -1
			) {
				return true;
			} else {
				return false;
			}
		});
	},
	
	onContributorTrigger: function(field, trigger, eOpts){
		var me = this;
		
		Ext.create('MaParoisse.view.util.PersonSelectionWindow', {
			//set allowCreate to true to include the functionality of creating a new contributor directly from the selection window
			allowCreate: true,
			title: 'Choisir / Ajouter',
			callback: function(record){
				me.setChosenContributor(record, field);
			}
		});
	},
	
	onClearTrigger: function(field, trigger, eOpts){
		var me = this,
			view = me.getView(),
			grid = view.getComponent('journalItemsGrid'),
			sm = grid.getSelectionModel(),
			record = sm.getSelection()[0];
		
		grid.getPlugin('journalitemediting').completeEdit();
		
		record.set('contributorId', 0);
		record.set('contributorFirstName', '');
		record.set('contributorLastName', '');
		record.set('contributorAddress', '');
		record.set('contributorPostCode', '');
		record.set('contributorTown', '');
		
		grid.getView().refreshNode(record);
	},
	
	setChosenContributor: function(contributorRecord, field){
		var me = this,
			view = me.getView(),
			grid = view.getComponent('journalItemsGrid'),
			sm = grid.getSelectionModel(),
			record = sm.getSelection()[0];
		
		record.set('contributorId', contributorRecord.get('id'));
		record.set('contributorFirstName', contributorRecord.get('employeeFirstName'));
		record.set('contributorLastName', contributorRecord.get('employeeLastName'));
		record.set('contributorAddress', contributorRecord.get('employeeAddress'));
		record.set('contributorPostCode', contributorRecord.get('employeePostCode'));
		record.set('contributorTown', contributorRecord.get('employeeTown'));
		
		/*field.setData({
			contributorFirstName: contributorRecord.get('employeeFirstName'),
			contributorLastName: contributorRecord.get('employeeLastName')
		});
		*/
		grid.getView().refreshNode(record);
	},
	
	onAccJournalItemBeforeEdit: function(editor, context, eOpts){		
		if(!this.getView().modifiable){
			return false;
		}
	},
	
	onDateEditorFocus: function(cmp, eOpts){
		var task = new Ext.util.DelayedTask(function(){
			cmp.selectText();
		});
		
		task.delay(200);
	},

	onAccJournalItemValidateEdit: function(editor, context, eOpts){
		var me = this,
			view = me.getView(),
			grid = view.getComponent('journalItemsGrid'),
			rec = context.record;
		
		if(context.column.dataIndex === 'ajiAccId' && context.originalValue != context.value){
			var accCode = null,
				accName = null;
			
			view.accStore.each(function(accRec){
				if(accRec.get('id') === context.value){
					accCode = accRec.get('code');
					accName = accRec.get('name');
					return false;
				}
			});
			
			if(accCode != null && accName != null){
				rec.set('ajiAccCode', accCode);
				rec.set('ajiAccName', accName);
			}
		} else if(context.column.dataIndex === 'supplierName' && context.originalValue != context.value){
			var supplierId = null,
				supplierName = null;
			
			view.supplierStore.each(function(supplierRec){
				if(supplierRec.get('name') === context.value){
					supplierId = supplierRec.get('id');
					supplierName = supplierRec.get('name');
					return false;
				}
			});
			
			if(supplierName != null && supplierId != null){
				rec.set('supplierId', supplierId);
				rec.set('supplierName', supplierName);
			} else if(supplierName === null && supplierId === null && context.value != ''){
				rec.set('supplierName', context.value);
				rec.set('supplierId', 0);
			} else if(supplierName === null && supplierId === null && context.value === ''){
				rec.set('supplierName', context.value);
				rec.set('supplierId', 0);
			}
		} else if(context.column.dataIndex === 'ajiCodeQuete' && context.originalValue != context.value){
			if (context.value === ''){
				rec.set('ajiCodeQuete', '');
			}
		}
		
		if(context.column.dataIndex === 'ajiDate' && context.originalValue != context.value) {
			var store = grid.getStore();
			
			store.each(function(accRec){
				if(Ext.isDefined(accRec) && accRec.get('ajiEntryId') === rec.get('ajiEntryId') && accRec.get('id') != rec.get('id')){
					var delayedTask = new Ext.util.DelayedTask(function(){
						accRec.set('ajiDate', context.value);
					});
					delayedTask.delay(100);
				}
			});
		}
		
		//grid.getView().refreshNode(rec);
	},
	
	onAddItemClicked: function(){
		var me = this,
			view = me.getView(),
			accJournalItemsGrid = view.getComponent('journalItemsGrid'),
			editingPlugin = accJournalItemsGrid.getPlugin('journalitemediting');
		
		me.createNewJournalItem(accJournalItemsGrid.getStore(), true);
	},
	
	onSaveClicked: function(){
		var me = this,
			view = me.getView(),
			accJournalItemsGrid = view.getComponent('journalItemsGrid');
		
		var attachments = [];
		me.attachmentStore.each(function(rec){
			attachments.push(rec.getDataObjectOpt({persist: true}));
		});
		
		var accJournalItems = [];
		
		accJournalItemsGrid.getStore().each(function(rec){
			if(!me.isEmptyRecord(rec)){
				var accJournalItem;
				if(rec.generation > 1){
					rec.set('date', rec.get('ajiDate'));
					rec.set('dateCreation', rec.get('ajiDateCreation'));
					
					accJournalItem = rec.getDataObjectOpt(options={serialize: true, persist: true});
					
					accJournalItem.contributorId = rec.get('contributorId');
					
					if(rec.get('supplierName').length > 0){
						accJournalItem.supplier = {};
						accJournalItem.supplier.name = rec.get('supplierName');
						accJournalItem.supplier.id = rec.get('supplierId');
					}
					
					accJournalItem.description = rec.get('ajiDescription');
					
					if(rec.get('ajiCodeQuete') != ''){
						accJournalItem.codeQuete = rec.get('ajiCodeQuete');	
					}
					
					accJournalItem.journal = rec.get('ajiJournal');
					accJournalItem.dtAmount = rec.get('ajiDtAmount').toString();
					accJournalItem.ctAmount = rec.get('ajiCtAmount').toString();
					accJournalItem.accCode = rec.get('ajiAccCode');
					accJournalItem.accId = rec.get('ajiAccId');
					accJournalItem.entryId = rec.get('ajiEntryId');
				} else {
					accJournalItem = rec.data.accJournalItem;
					
					accJournalItem.entryId = rec.get('ajiEntryId');
					
					//Ugly stupid quick fix to not possibly break other functionality
					accJournalItem.dtAmount = accJournalItem.dtAmount.toString();
					accJournalItem.ctAmount = accJournalItem.ctAmount.toString();
					
					if(Ext.isDefined(rec.data.supplier.id)){
						accJournalItem.supplier = {
								name: rec.data.supplier.name,
								id: rec.data.supplier.id
						};
					}
				}
				//add also entryId property
				if(Ext.isDefined(rec.data.accJournalItem) && Ext.isDefined(rec.data.accJournalItem.entryId)){
					accJournalItem.entryId = rec.data.accJournalItem.entryId;
				}
				
				accJournalItems.push(accJournalItem);
			}
		});
		
		var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/FinancialTransactionServlet',
			service_type: 'FinancialTransactionService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					var suppliers = resp.suppliers;
					if(suppliers) {
						view.parentRef.fireEvent('suppliersUpdate', suppliers);
					}
					//me.resetTab();
					//me.setBalance(resp.accBalance);
					me.onFilterClicked();
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'saveAccJournalItems',
			params: {
				ownerId: AccBureau.Context.principal.data.compId,
				accJournalItems: accJournalItems,
				accJournal: {
					paymentMethodId: view.paymentMethodId,
					bankAccountId: view.bankAccountId != null ? view.bankAccountId : ''
				},
				attachments: attachments
			}
		});
	},
	
	resetTab: function(){
		this.releaseGrid();
	},
	
	releaseGrid: function(){
		var me = this,
			view = me.getView(),
			grid = view.getComponent('journalItemsGrid');
		
		grid.getStore().removeAll();
	},
	
	commentRenderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
		var l = 120;
		var rValue = value.length > l ? (value.substring(0, l) + " ...") : value;
		
		if(value.length > 0){
			return '<div style="white-space:normal!important">' + rValue + '</div>';
		} else {
			return '';
		}
	},
	
	contributorRenderer: function(value, metaData, record, rowIndex, colIndex, store, view){
		var htmlString = '';
		
		if(record.get('contributorLastName') != ''){
			htmlString = '<div style="font-size: 8;white-space:normal!important"><span style="font-weight: 300;color:#4390df">Nom: </span> {0} {1}</br>'+
			'<span style="font-weight: 300;color:#4390df">Adresse: </span> {2}</br>' + 
			'<span style="font-weight: 300;color:#4390df">CP: </span> {3} <span style="font-weight: 300;color:#4390df">Commune: </span>{4}</br>' +
			'</div>';
		}
		return Ext.String.format(htmlString, record.get('contributorLastName'), record.get('contributorFirstName'), record.get('contributorAddress'), record.get('contributorPostCode'), record.get('contributorTown'));
	},
	
	supplierRenderer: function(value, metaData, record, rowIndex, colIndex, store, view){
		return record.get('supplierName');
	},
	
	setBalance: function(balanceData){
		var me = this,
			view = me.getView(),
			balancePanel = view.getComponent('northContainer').getComponent('balancePanel');
		
		var balanceHtml = '<p>Solde ' + balanceData.accName + '</p>' 
						+ '<p>au ' + balanceData.dateTo + 
						': <span id="balanceAmount" style="padding-left: 10px; font-size: 20px; font-weight: 700!important; color: #4390df">' +
						Ext.util.Format.currency(balanceData.finalBalance) + '</span></p>';
		
		balancePanel.update(balanceHtml);
	},
	
	onLastEditorSpecialKey: function(field, e, eOpts){
		if(e.event.keyCode === 9 && !e.shiftKey){
			var me = this,
				view = me.getView(),
				grid = view.getComponent('journalItemsGrid'),
				store = grid.getStore(),
				sm = grid.getSelectionModel(),
				editingPlugin = grid.getPlugin('journalitemediting');
			
			if(sm.hasSelection()){
				var record = sm.getLastSelected();
				
				if(store.getCount() - 1 === store.indexOf(record)){
					
					me.createNewJournalItem(store, false);
					
				}
			}
		}
	},
	
	createNewJournalItem: function(ds, forceStartEdit){
		//get reference to controller for convenience
		var me = this,
			plugin = me.getView().getComponent('journalItemsGrid').getPlugin('journalitemediting'),
			gridview = me.getView().getComponent('journalItemsGrid').getView();
		
		if(ds.getCount() === 0){
			//create new item with entryId=0
			newItem = Ext.create('MaParoisse.model.AccJournalItemExtended', {
				ajiDateCreation: new Date(),
				ajiEntryId: 0
			});
			ds.add(newItem);			
			gridview.refresh();
			if(forceStartEdit){
				plugin.startEdit(newItem, 2);
			}
			//else check if last record has minimum required data
		}else if(!me.isEmptyRecord(ds.getAt(ds.getCount()-1))){
			//check balance of new items
			var ct = 0, dt = 0, date = null;
			ds.each(function(rec){
				if(rec.get('ajiEntryId') === 0){
					if(date === null){
						date = rec.get('ajiDate');
					}
					ct += Number(rec.get('ajiCtAmount'));
					dt += Number(rec.get('ajiDtAmount'));
				}
			});
			var newItem, index = 2;
			plugin.suspendEvents();
			if(ct > 0 && ct === dt){
				//BALANCED -> generate entryIds for records with entryid==0
				var newId = me.entryIdGen.generate();
				ds.each(function(rec){
					if(rec.get('ajiEntryId') === 0){
						rec.set('ajiEntryId', newId);
					}
				});
				//try to find the corresponding record with entryId=0 in the attachmentStore 
				var attachment = me.attachmentStore.findRecord('entryId', 0);
				//if there is such record update it's entryId
				if(attachment != null){
					attachment.set('entryId', newId);
				}
				//create new item with entryId=0
				newItem = Ext.create('MaParoisse.model.AccJournalItemExtended', {
					ajiDateCreation: new Date(),
					ajiEntryId: 0
				});
			} else {
				//UNBALANCED -> create new record with the current entryId and date
				newItem = Ext.create('MaParoisse.model.AccJournalItemExtended', {
					ajiDateCreation: new Date(),
					ajiEntryId: 0,
					ajiDate: date
				});
			}
			ds.add(newItem);
			plugin.resumeEvents();
			
			gridview.refresh();
			
			if(forceStartEdit){
				plugin.startEdit(newItem, index);
			}
			
			
			/*var delayedTask = new Ext.util.DelayedTask(function(){
				plugin.startEdit(newItem, index);
			});
			
			delayedTask.delay(3000);*/
		} else {
			//warn user to fill the empty record first
			
		}
	},
	
	
	
	/*
	 * Indentifies if a record is empty by checking its visible fields
	 */
	isEmptyRecord: function(record){
		var empty = true;
		
		if(record.get('ajiAccId') != 0 ||
				record.get('supplierId') != '' ||
				record.get('ajiDescription') != '' ||
				record.get('ajiDtAmount') != '' ||
				record.get('ajiCtAmount') != '' ||
				record.get('contributorId') != 0 ||
				record.get('ajiCodeQuete') != ''		
		){
			empty = false;
		}
		
		return empty;
	},
	
	isSafeToClose: function(){
		var isSafeToClose = true,
			me = this,
			view = me.getView(),
			grid = view.getComponent('journalItemsGrid');
		
		grid.getStore().each(function(record){
			if(/*!me.isEmptyRecord(record) && */record.generation > 1){
				isSafeToClose = false;
				return false;
			}
		});
		
		return isSafeToClose;
	},
	
	attachFileToItem: function(record, fileAttachment){
		record.set('attachmentName', fileAttachment.name);
		record.set('attachmentRemoteName', fileAttachment.remoteName);
		var found = this.attachmentStore.findRecord('entryId', record.get('ajiEntryId'));
		if(found != null){
			found.set('name', fileAttachment.name);
			found.set('remoteName', fileAttachment.remoteName);
			if(found.get('attId') != 0){
				found.set('deleteOld', true);
			}
		} else {
			this.attachmentStore.add({
				entryId: record.get('ajiEntryId'),
				name: fileAttachment.name,
				remoteName: fileAttachment.remoteName
			});
		}
	},
	
	deleteAttachment: function(record){
		var me = this;
		Ext.create('MaParoisse.lib.MessageBox', {
			title: 'Suppression feuille de travail',
			formHeight: 130,
			message: 'Etes vous sur de vouloir supprimer <b style="font-weight:900;">définitivement</b> cette feuille de travail?',
			type: MaParoisse.lib.MessageBox.QUESTION,
			callback: {
				fn: function(btnId){
					if(btnId === MaParoisse.lib.MessageBox.YES){
						var found = me.attachmentStore.findRecord('entryId', record.get('ajiEntryId'));
						if(found != null){
							if(record.get('attachmentId') != 0) {
								found.set('name', '');
								found.set('remoteName', '');
								found.set('deleteOld', true);
								//found.set('attId', record.get('attachmentId'));
							} else {
								me.attachmentStore.remove(found);
							}
						} else if(record.get('attachmentId') != 0){
							me.attachmentStore.add({
								entryId: record.get('ajiEntryId'),
								name: '',
								remoteName: '',
								deleteOld: true,
								attId: record.get('attachmentId')
							});
						}
						record.set('attachmentName', '');
						record.set('attachmentRemoteName', '');
					}
				}
			}
		});
	}
});