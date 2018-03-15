Ext.define("MaParoisse.view.parametrages.BankStatements",{
    "extend": "Ext.panel.Panel",
    "controller": "parametrages-bankstatements",
    requires: ['MaParoisse.model.BankAccount',
               'MaParoisse.model.BankStatement'],
    
    region: 'center',
	layout: 'border',
	
	accounts: [],
	accAccounts: [],
	currentBankAccount: null,
	
	initComponent: function(){
		var me = this;
		var config = {
				//title: 'Codification Banque',
				header: false,
				listeners: {
					scope: 'controller',
					render: 'onRender',
					tenantChange: 'onTenantChange'
				},
				items: [{
					itemId: 'bankAccountGrid',
					xtype: 'gridpanel',
					region: 'west',
					width: '25%',
					title: 'Compte bancaires',
					listeners: {
						selectionchange: 'onBankAccGridSelChange'
					},
					dockedItems: [{
						xtype: 'toolbar',
						dock: 'top',
						itemId: 'topTbar',
						items: [{
	    					xtype: 'numberfield',
	    					itemId: 'yearField',
	    					fieldLabel: 'Année',
	    					mouseWheelEnabled: false,
	    					labelWidth: 40,
	    					minValue: 2000,
	    					maxValue: 2030,
	    					value: new Date().getFullYear(),
	    					step: 1,
	    					allowDecimals: false,
	    					allowExponential: false,
	    					repeatTriggerClick: false,
	    					name: 'year',
	    					allowBlank: false,
	    					listeners: {
	    						scope: me.getController(),
	    						change: 'onYearChange'
	    					}
	    			    }]
					}],
					forceFit: true,
					split: true,
					columns : [{
					    header : 'Libellé',
					    dataIndex: 'name',
					    width: 0.5
					}, {
					    header : 'Compte',
					    dataIndex: 'accCode',
					    width: 0.5
					}],
					store: Ext.create('Ext.data.Store', {
						autoDestroy: true,
						model: 'MaParoisse.model.BankAccount',
						storeId: 'bankAccStore'
					})
				}, {
					itemId:'bankCentralPanel',
					title: 'Banque',
					xtype:'panel',
					region: 'center',
					layout: 'border',
					disabled: true,
					tbar: [{
						icon: null,
						glyph: 'xe170@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Enregistrer',
				        handler: 'onSaveAccountClicked'
				    }/*, '-', {
				    	icon: null,
						glyph: 'xe08c@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Ajouter',
				        handler: 'onAddItemClicked'
				    }*/],
					items: [{
						itemId: 'bankStatementsGrid',
						xtype: 'grid',
						forceFit: true,
						reserveScrollbar: true,
						header: false,
						region: 'center',
						border: false,
						disabled: false,
						plugins: [{
							ptype: 'cellediting',
							pluginId: 'statementsediting',
							clicksToEdit: 1
						}],
						store: new Ext.data.Store({
							model: 'MaParoisse.model.BankStatement',
							autoDestroy: true
						}),
						columns: [{
							header: 'Date',
							xtype: 'datecolumn',
//							editor: {
//								xtype: 'datefield',
//								selectOnFocus: true,
//								editable: true
//							},
							dataIndex: 'bankFinalBalanceDate'
						}, {
							header: 'Balance',
							align: 'right',
							renderer: function(value){
			                	return Ext.util.Format.currency(value);
			                },
							dataIndex: 'bankFinalBalance',
							editor: {
								xtype: 'numericfield',
								alwaysDisplayDecimals: true,
								decimalSeparator: ',',
								thousandSeparator: ' ',
								decimalPrecision: 2,
								hideTrigger: true,
								keyNavEnabled: false,
								mouseWheelEnabled: false,
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
						}]
					}]
				}]
		};
		
		Ext.apply(this, config);
		this.callParent(arguments);
	},
	
	isSafeToClose: function(callback){
		var bankCentralPanel = this.getComponent('bankCentralPanel'),
			bankStatementsGrid = bankCentralPanel.getComponent('bankStatementsGrid');
		
		var safeToClose = true;
		var store = bankStatementsGrid.getStore();
		store.each(function(statement){
			var data = statement.getDataObjectExt();
			
			if(data.dbState != 0 || statement.dirty){
				if(statement.get('bankFinalBalanceDate') != null){
					safeToClose = false;
				}
				return safeToClose;
			}
		});
		
		if(callback){
			callback();
		}	
		
		return safeToClose;
	}
});