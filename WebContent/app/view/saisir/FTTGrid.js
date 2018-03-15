Ext.define('MaParoisse.view.saisir.FTTGrid', {
	extend: 'Ext.grid.Panel',
	requires: 'MaParoisse.model.AccJournalEntryTemplate',
	
	controller: 'fttGridCtontroller',
	
	//configurable vars here
	moduleId: null,
	moduleType: null,
	accountsStore: null,
	amountRuleHidden: false,
	currentFTT: null,
	accountIdentificationRulesData: null, // Vesko (sorry!!!) must be configurable
	journalIdentificationRulesData: null,  // Vesko (sorry!!!) must be configurable
	
	journalStore: null,
	
	initComponent: function() {
		var me = this;
		var accIdRuleItems = [];
		switch(this.moduleType){
			case MaParoisse.lib.Globals.getAccIdentificationRules().EXPENSE:
				accIdRuleItems.push({
					accountIdentificationRuleId: MaParoisse.lib.Globals.getAccIdentificationRules().EXPENSE,
					name: 'Compte de charge'
				});
				break;
			case MaParoisse.lib.Globals.getAccIdentificationRules().REVENUE:
				accIdRuleItems.push({
					accountIdentificationRuleId: MaParoisse.lib.Globals.getAccIdentificationRules().REVENUE,
					name: 'Compte de produit'
				});
				break;
			case MaParoisse.lib.Globals.getAccIdentificationRules().THIRD_ACCOUNT:
				accIdRuleItems.push({
					accountIdentificationRuleId: MaParoisse.lib.Globals.getAccIdentificationRules().THIRD_ACCOUNT,
					name: 'Compte de tier'
				});
				if(me.moduleId == '570b4' && this.currentFTT.get('paymentMethodId') == MaParoisse.lib.Globals.getPaymentMethods().BANQUE){
					accIdRuleItems.push({
						accountIdentificationRuleId: MaParoisse.lib.Globals.getAccIdentificationRules().CASH_ACCOUNT,
						name: 'Compte caisse'
					});
				}
				break;
			case MaParoisse.lib.Globals.getAccIdentificationRules().COMBINED:
				accIdRuleItems.push({
					accountIdentificationRuleId: MaParoisse.lib.Globals.getAccIdentificationRules().DF,
					name: 'Droit de la Fabrique'
				}, {
					accountIdentificationRuleId: MaParoisse.lib.Globals.getAccIdentificationRules().CELEBRANT,
					name: 'Célébrant'
				}, {
					accountIdentificationRuleId: MaParoisse.lib.Globals.getAccIdentificationRules().QUETE,
					name: 'Quete'
				});
			
				if(me.moduleId == '560b4' && this.currentFTT.get('paymentMethodId') == MaParoisse.lib.Globals.getPaymentMethods().DIVERSES){
					accIdRuleItems.push({
						accountIdentificationRuleId: MaParoisse.lib.Globals.getAccIdentificationRules().EXPENSE,
						name: 'Compte de charge'
					});
				}
				break;
			case MaParoisse.lib.Globals.getAccIdentificationRules().VIREMENTS_INTERNES:
				accIdRuleItems.push({
					accountIdentificationRuleId: MaParoisse.lib.Globals.getAccIdentificationRules().CASH_ACCOUNT,
					name: 'Compte caisse'
				}, {
					accountIdentificationRuleId: MaParoisse.lib.Globals.getAccIdentificationRules().VIREMENTS_INTERNES,
					name: 'Virements internes'
				});
			
		}

		switch(this.currentFTT.get('paymentMethodId')){
			case MaParoisse.lib.Globals.getPaymentMethods().CAISSE:
				this.setTitle('Caisse');
				
				// FIXME must be configurable
				this.accountIdentificationRulesData = [{
					accountIdentificationRuleId: MaParoisse.lib.Globals.getAccIdentificationRules().NA,
					name: ''
				}, {
					accountIdentificationRuleId: MaParoisse.lib.Globals.getAccIdentificationRules().CASH_ACCOUNT,
					name: 'Compte caisse'
				}];
				
				for(var i = 0; i < accIdRuleItems.length; i++){
					this.accountIdentificationRulesData.push(accIdRuleItems[i]);
				}
				
				this.journalIdentificationRulesData = [{
					journalIdentificationRuleId: MaParoisse.lib.Globals.getJournalIdentificationRules().CA,
					name: 'CAISSE'
				}];
				
				break;
			case MaParoisse.lib.Globals.getPaymentMethods().BANQUE:
				this.setTitle('Banque');
				
				// FIXME must be configurable
				this.accountIdentificationRulesData = [{
					accountIdentificationRuleId: MaParoisse.lib.Globals.getAccIdentificationRules().NA,
					name: ''
				}, {
					accountIdentificationRuleId: MaParoisse.lib.Globals.getAccIdentificationRules().BANK_ACCOUNT,
					name: 'Compte bancaire'
				}];
				
				for(var i = 0; i < accIdRuleItems.length; i++){
					this.accountIdentificationRulesData.push(accIdRuleItems[i]);
				}
				
				this.journalIdentificationRulesData = [{
					journalIdentificationRuleId: MaParoisse.lib.Globals.getJournalIdentificationRules().BQ,
					name: 'BANQUE'
				}];
				
				if(me.moduleId == '570b4' && me.moduleType == MaParoisse.lib.Globals.getAccIdentificationRules().VIREMENTS_INTERNES){
					this.journalIdentificationRulesData.push({
						journalIdentificationRuleId: 20,
						name: 'CAISSE'
					});
				}
				
				break;
			case MaParoisse.lib.Globals.getPaymentMethods().DIVERSES:
				this.setTitle('Diverses');
				
				this.accountIdentificationRulesData = [{
					accountIdentificationRuleId: MaParoisse.lib.Globals.getAccIdentificationRules().NA,
					name: ''
				}, {
					accountIdentificationRuleId: MaParoisse.lib.Globals.getAccIdentificationRules().OTHER_RECEIVABLE_PAYABLE,
					name: 'Débiteurs/Créditeurs'
				}];
				
				for(var i = 0; i < accIdRuleItems.length; i++){
					this.accountIdentificationRulesData.push(accIdRuleItems[i]);
				}
			
				this.journalIdentificationRulesData = [{
					journalIdentificationRuleId: MaParoisse.lib.Globals.getJournalIdentificationRules().OD,
					name: 'OPERATIONS DIVERSES'
				}];
				
				break;
		};
		
		this.journalStore = Ext.create('Ext.data.Store', {
			fields: [{name: 'journalIdentificationRuleId', type: 'int'}, {name: 'name', type: 'string'}],
			data: this.journalIdentificationRulesData
		});
		
		var config = {
			forceFit: true,
			glyph: this.currentFTT.get('paymentMethodId') == MaParoisse.lib.Globals.getPaymentMethods().CAISSE ? 'xe026@iconFont' : 
					this.currentFTT.get('paymentMethodId') == MaParoisse.lib.Globals.getPaymentMethods().BANQUE ? 'xe140@iconFont' : 
					this.currentFTT.get('paymentMethodId') == MaParoisse.lib.Globals.getPaymentMethods().DIVERSES ? 'xe029@iconFont' : '',
			reserveScrollbar: true,
			listeners: {
				scope: 'controller',
				render: 'onRender',
				containercontextmenu: 'containerContextClick'
			},
//			tbar: [{
//		    	icon: null,
//				glyph: 'xe08c@iconFont',
//				baseCls: 'ae-ext-button-small-icon',
//		        scale: 'small',
//		        iconAlign: 'top',
//		        text: 'Ajouter',
//		        handler: 'onAddClicked'
//		    }],
			plugins:[{
				ptype: 'cellediting',
				pluginId: 'fttGridEditingPlugin'
			}],
			store: Ext.create('Ext.data.Store', {
				model: 'MaParoisse.model.AccJournalEntryTemplate',
				autoDestroy: true
			}),
			columns:[{
				flex: 1.2,
				header: 'Type de compte',
				dataIndex: 'accountIdentificationRuleId',
				renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
					var displayValue = '';
					for (var i = 0; i < this.accountIdentificationRulesData.length; i++) {
						if(this.accountIdentificationRulesData[i].accountIdentificationRuleId == value){
							displayValue = this.accountIdentificationRulesData[i].name;
							break;
						}
					}
					return displayValue;
				},
				editor: {
					xtype : 'combo',
					allowBlank: false,
					queryMode : 'local',
					triggerAction : 'all',
					valueField   : 'accountIdentificationRuleId',
					displayField: 'name',
					editable : true,
					store : Ext.create('Ext.data.Store', {
						fields: [{name: 'accountIdentificationRuleId', type: 'int'}, {name: 'name', type: 'string'}],
						data: this.accountIdentificationRulesData,
						storeId: 'accIdentificationStore'
					}),
					selectOnFocus: true,
					listeners: {
						focus: function(me){
							if(me.selectOnFocus && Ext.browser.is.Firefox){
								Ext.defer(function() {
									me.selectText();
								}, 1);
							}
						}
					}
				}
			}, {
				header: 'Compte',
				flex: 2,
				dataIndex: 'accAccountId',
				renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
					var displayValue = '';
					this.accountsStore.each(function(account){
						if(account.get('id') == value){
							displayValue = account.get('code') + ' - ' + account.get('name');
							return;
						}
					});
					return displayValue;
				},
				editor: {
					xtype : 'combo',
					queryMode : 'local',
					triggerAction : 'all',
					valueField   : 'id',
					displayField: 'code',
					displayTpl: '<tpl for=".">'+
						'<tpl if="code != 0 ">' +
						'{code}' + ' - ' + '{name}' + 
						'</tpl>'+
						'</tpl>',
					tpl: '<tpl for="."><div class="x-boundlist-item">' + '{code}' + ' - ' + '{name}' + '</div></tpl>',
					editable : true,
					store: this.accountsStore,
					selectOnFocus: true,
					listeners: {
						focus: function(me){
							if(me.selectOnFocus && Ext.browser.is.Firefox){
								Ext.defer(function() {
									me.selectText();
								}, 1);
							}
						}
					}
				}
			}, {
				header: 'Debit',
				flex: 0.7,
				dataIndex: 'dt',
				xtype: 'checkcolumn',
				listeners: {
					checkchange: 'onCheckColCheckChange'
				}
			}, {
				header: 'Credit',
				flex: 0.7,
				dataIndex: 'ct',
				xtype: 'checkcolumn',
				listeners: {
					checkchange: 'onCheckColCheckChange'
				}
			}, {
				header: 'Journal',
				flex: 1,
				dataIndex: 'journalIdentificationRuleId',
				renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
					var displayValue = '';
					for (var i = 0; i < this.journalIdentificationRulesData.length; i++) {
						if(this.journalIdentificationRulesData[i].journalIdentificationRuleId == value){
							displayValue = this.journalIdentificationRulesData[i].name;
							break;
						}
					}
					return displayValue;
				},
				editor: {
					xtype : 'combo',
					itemId: 'journalCombo',
					allowBlank: false,
					queryMode : 'local',
					triggerAction : 'all',
					valueField   : 'journalIdentificationRuleId',
					displayField: 'name',
					editable : true,
					forceSelection: true,
					store : me.journalStore,
					selectOnFocus: true,
					listeners: {
						focus: function(me){
							if(me.selectOnFocus && Ext.browser.is.Firefox){
								Ext.defer(function() {
									me.selectText();
								}, 1);
							}
						}
					}
				}
			}, {
				header: 'Code quete',
				dataIndex: 'codeQuete',
				hidden: me.moduleType != 180,
				editor: {
					xtype: 'textfield',
					minLength: 2,
					maxLength: 2,
					selectOnFocus: true,
					listeners: {
						focus: function(me){
							if(me.selectOnFocus && Ext.browser.is.Firefox){
								Ext.defer(function() {
									me.selectText();
								}, 1);
							}
						}
					}
				}
			}/*, {
				header: 'Code journal',
				flex: 1,
				dataIndex: 'journalCode',
				editor: {
					xtype : 'textfield'
				}
			}, {
				header: 'Mode de paiement',
				flex: 1,
				dataIndex: 'journalingRuleId',
				renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
					switch(value){
						case 0: 
							return '';
							break;
						case 10:
							return 'Financial Transaction';
							break;
						case 20:
							return 'Payment Transaction';
							break;
					}
				},
				editor: {
					xtype : 'combo',
					allowBlank: false,
					queryMode : 'local',
					triggerAction : 'all',
					valueField   : 'journalIdentificationRuleId',
					displayField: 'name',
					editable : true,
					store : Ext.create('Ext.data.Store', {
						fields: [{name: 'journalIdentificationRuleId', type: 'int'}, {name: 'name', type: 'string'}],
						data: [{
							journalIdentificationRuleId: 0,
							name: ''
						}, {
							journalIdentificationRuleId: 10,
							name: 'Financial Transaction'
						}, {
							journalIdentificationRuleId: 20,
							name: 'Payment Transaction'
						}],
						storeId: 'journalIdentificationStore'
					})
				}
			}, {
				header: 'Amount Rule',
				flex: 1,
				hiddent: this.ammountRuleHidden,
				dataIndex: 'amountRuleId',
				renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
					switch(value){
						case 0: 
							return '';
							break;
						case 10:
							return 'Contrepartie';
							break;
						case 20:
							return 'Compte bancaire';
							break;
					}
				},
				editor: {
					xtype : 'combo',
					queryMode : 'local',
					triggerAction : 'all',
					valueField   : 'amountRuleId',
					displayField: 'name',
					editable : true,
					store : Ext.create('Ext.data.Store', {
						fields: [{name: 'amountRuleId', type: 'int'}, {name: 'name', type: 'string'}],
						data: [{
							amountRuleId: 0,
							name: ''
						}, {
							amountRuleId: 10,
							name: 'Contrepartie'
						}, {
							amountRuleId: 20,
							name: 'Compte bancaire'
						}],
						storeId: 'amountRulesStore'
					})
				}
			}, {
				header: 'Amount Parameter',
				flex: 1,
				hidden: this.ammountRuleHidden,
				dataIndex: 'amountParameter',
				editor: {
					xtype: 'textfield'
				}
			}*/]
		};
		
		Ext.apply(this, config);
		this.callParent(arguments);
		
		this.getController().loadInitialData();
	},
	
	isSafeToClose: function(){
		var safeToClose = true,
			ftt = this.currentFTT.getDataObjectExt(),
			ds = this.getStore();
		
		if(ftt.dbState != 0){
			safeToClose = false;
			return safeToClose;
		}
		
		ds.each(function(rec){
			var record = rec.getDataObjectExt();
			if(rec.dirty || record.dbState != 0){
				safeToClose = false;
				return safeToClose;
			}
		});
		
		return safeToClose;
	}
});