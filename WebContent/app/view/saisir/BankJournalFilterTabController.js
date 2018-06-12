Ext.define('MaParoisse.view.saisir.BankJournalFilterTabController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.saisir-bankjournalfiltertab',

	attachmentStore: new Ext.data.Store({
		autoDestroy: true,
		model: 'MaParoisse.model.AccEntryAttachment'
	}),
	tallyToggleState: 'all',
	
	onRender: function(){
		
	},
	
	onFilterClicked: function(){
		var me = this,
			view = me.getView(),
			form = view.getComponent('northContainer').getComponent('filterForm').getForm();
		
		if(view.filterRecord == null){
			view.filterRecord = Ext.create('MaParoisse.model.JournalFilter', {paymentMethodId: view.paymentMethodId, bankAccountId: view.bankAccountId});
		}
		
		me.attachmentStore.removeAll();
		
		form.updateRecord(view.filterRecord);
		var journalFilter = view.filterRecord.getDataObjectOpt(options={serialize: true, persist: true});
		
		/*
		 * Set following two props to empty string
		 * to be sure that they do not conflict with 
		 * the proper jornal identification intended
		 * for this module
		 */
		journalFilter.bankAccountId = '';
		journalFilter.paymentMethodId = '';
		
		journalFilter.ownerId = AccBureau.Context.principal.data.compId;
		journalFilter.tally = me.tallyToggleState;
		// set option to tally to identify a tally specialized filter
		journalFilter.option = 'tally';
		
		var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/FinancialTransactionServlet',
			service_type: 'FinancialTransactionService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY,
						attachments = resp.attachments,
						accJournalResults = resp.accJournalResults,
						grid = view.getComponent('journalItemsGrid');
					
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
					
					grid.getStore().loadRawData(resp.accJournalResults);
					var columns = grid.getColumnManager().getColumns();
					var tallyColumn;
					for (var i = 0; i < columns.length; i++) {
						if (columns[i].text == "Pointage") {
							tallyColumn = columns[i];
						}
					}
					if (Ext.isDefined(tallyColumn)) {
						if (resp.tally == true) {
							tallyColumn.show();
						} else if (resp.tally == false) {
							tallyColumn.hide();
						}
					}
					me.setBalance(resp.accBalance);
//					me.tallyToggleState = resp.tally;
					
					me.updateBalances(resp.tallyAmounts);
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
		if (field.inputValue == "dateSpanFilter"){
			var dateFromF = field.up().getComponent('dateFromField');
			var dateToF = field.up().getComponent('dateToField');
			if (newValue == false){
				dateFromF.setDisabled(true);
				dateToF.setDisabled(true);
			} else {
				dateFromF.setDisabled(false);
				dateToF.setDisabled(false);
			}
		} else if (field.inputValue == "monthFilter"){
			var col1row1 = field.up().up().getComponent('col1row1');
			var monthF = col1row1.getComponent('monthField');
			var yearF = col1row1.getComponent('yearField');
			if (newValue == false){
				monthF.setDisabled(true);
				yearF.setDisabled(true);
			} else {
				monthF.setDisabled(false);
				yearF.setDisabled(false);
			}
		}
	},
	
	onJounalComboChange: function(combo, newValue, oldValue, opts) {
		var store = combo.getStore();
		var record = store.getAt(store.find("code", newValue));
		var bankAcc = record.data.accBalance.accCode;
		var accField = combo.up('form').getComponent("col2").getComponent("col2row2").getComponent("accFieldFrom");
		
		accField.suspendEvents();
		accField.setValue(bankAcc);
		accField.resumeEvents();
	},
	
	onAccFieldChange: function(field, newValue, oldValue, opts){
		var combo = field.up('form').getComponent('col3').getComponent('col3row1').getComponent('journalField');
		var store = combo.getStore();
		var currentCode = store.getAt(store.findBy(function(record, id){
			if (record.get("accBalance").accCode == newValue){
				return record.get("code");
			}
		}, this)).get("code");
		combo.suspendEvents();
		combo.setValue(currentCode);
		combo.resumeEvents();
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
	
	releaseGrid: function(){
		var me = this,
			view = me.getView(),
			grid = view.getComponent('journalItemsGrid');
		
		grid.getStore().removeAll();
	},
	
	commentRenderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
		var l = 120;
		var rValue = value.length > l ? (value.substring(0, l) + " ...") : value;
		return '<div style="white-space:normal!important">' + rValue + '</div>';
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
		if(Ext.isDefined(balanceData)) {
			var me = this,
				view = me.getView(),
				balancePanel = view.getComponent('northContainer').getComponent('balancePanel');
			
			var balanceHtml = '<p>Solde ' + balanceData.accName + '</p>' 
							+ '<p>au ' + balanceData.dateTo + 
							': <span id="balanceAmount" style="padding-left: 10px; font-size: 20px; font-weight: 700!important; color: #4390df">' +
							Ext.util.Format.currency(balanceData.finalBalance) + '</span></p>';
			
			balancePanel.update(balanceHtml);
		}
	},
	
	beforeTallyCheckChange: function(checkColumn, rowIndex , checked , eOpts){
		var me = this,
			view = me.getView(),
			grid = view.getComponent('journalItemsGrid'),
			store = grid.getStore();
		
		var recordId = store.getAt(rowIndex).get('id');
		
		var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/FinancialTransactionServlet',
			service_type: 'FinancialTransactionService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					me.onFilterClicked();
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'tallyAccJournalItem',
			params: {
				ownerId: AccBureau.Context.principal.data.compId,
				tally: checked,
				id: recordId
			}
		});
	},
	
	onTallyToggled: function(btn, pressed){
		if (pressed == true) {
			this.tallyToggleState = btn.btnId;
			this.onFilterClicked();
		}
	},
	
	updateBalances: function(tallyAmounts) {
		var tallyAllEl = document.getElementById("tallyAllSum");
		var tallyCheckedEl = document.getElementById("tallyCheckedSum");
		var tallyUncheckedEl = document.getElementById("tallyUncheckedSum");
		if (Ext.isDefined(tallyAmounts)){
			tallyAllEl.innerHTML = Ext.util.Format.currency(tallyAmounts.all) + " €";
			tallyCheckedEl.innerHTML = Ext.util.Format.currency(tallyAmounts.checked) + " €";
			tallyUncheckedEl.innerHTML = Ext.util.Format.currency(tallyAmounts.unchecked) + " €";
		} else {
			tallyAllEl.innerHTML = "";
			tallyCheckedEl.innerHTML = "";
			tallyUncheckedEl.innerHTML = "";
		}
	}
    
});
