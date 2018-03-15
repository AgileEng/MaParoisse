Ext.define('MaParoisse.view.parametrages.COAModels', {
	extend: 'Ext.panel.Panel',
	requires: 'MaParoisse.view.parametrages.COAModelsController',
	
	region: 'center',
	layout: 'border',
	
	title: 'Modèle Plan Comptables',
	
	controller: 'coamodels',
	
	listeners: {
		render: 'onRender',
		tenantChange: 'onTenantChange',
		beforedestroy: 'releaseResources',
		scope: 'controller'
	},
	
	initComponent: function(){
		var config = {
				tbar: [{
					icon: null,
					glyph: 'xe170@iconFont',
					baseCls: 'ae-ext-button-small-icon',
			        scale: 'small',
			        iconAlign: 'top',
			        text: 'Enregistrer',
			        handler: 'onSaveClicked'
			    }, '-', {
			    	icon: null,
					glyph: 'xe08c@iconFont',
					baseCls: 'ae-ext-button-small-icon',
			        scale: 'small',
			        iconAlign: 'top',
			        text: 'Ajouter un compte',
			        handler: 'onAddClicked'
			    }, {
			    	icon: null,
					glyph: 'xe059@iconFont',
					baseCls: 'ae-ext-button-small-icon',
			        scale: 'small',
			        iconAlign: 'top',
			        text: 'Supprimer',
			        handler: 'onDeleteClicked'
			    }
//			    , {
//			    	icon: null,
//					glyph: 'xe173@iconFont',
//					baseCls: 'ae-ext-button-small-icon',
//			        scale: 'small',
//			        iconAlign: 'top',
//			        text: 'Actualiser',
//			        handler: 'onRefreshClicked'
//			    }
			    ],	
				items:[{
					xtype: 'gridpanel',
					title: 'Modeles',
					hidden: true,
					itemId: 'coaModelsGrid',
					region: 'west',
					width: 300,
					collapsible: true,
					collapsed: true,
					hidden: true,
					store: new MaParoisse.store.ChartOfAccountsArr(),
					listeners: {
						selectionchange: 'onModelsGridSelectionChange'
					}
				}, {
					xtype: 'container',
					region: 'center',
					itemId: 'centerContainer',
					layout: 'border',
					items: [{
		    			xtype: 'form',
		    			trackResetOnLoad: true,
		    			itemId: 'COAAttributesForm',
		    			height: 50,
		    			border: false,
		    			region: 'north',
		    			bodyPadding: 10,
		    			frame: true,
		    			items: [{
	    					xtype : 'textfield',
	    					allowBlank: false,
	    					itemId: 'modelNameField',
							fieldLabel : 'Model',
							name : 'name',
							anchor : '95%'
		    			}]
		    		}, {
						xtype: 'gridpanel',
		    			itemId: 'accountsGrid',
		    			title: 'Plan comptable',
		    			bufferedRenderer: false,
		    			
		    			region: 'center',
		    			forceFit: true,		
		    			stripeRows: true,
		    			selModel: 'rowModel',
		    			
		    			store: new MaParoisse.store.AccountArr({
		    				sorters:[{
		    					property: 'code',
		                        direction: 'ASC'
		    				}]
		    				
		    			}),
		    			
		    			plugins: [{
		    				ptype: 'rowediting',
		    				pluginId: 'accountsEditingPlugin',
		    				clicksToEdit: 2,
		    				listeners : {
		    					//canceledit: 'onRowCancelEdit',
		    					//beforeedit: 'beforeAccountEdit',
		    					//validateedit: 'onValidateAccount'
		    				}
		    			}],
		    			
		    			listeners: {
		    				itemcontextmenu: 'onGridContextMenu'
		    			},
		    			
		    			/*
						 * reserveScrollbar set to true fixes a render issue
						 * with misplaced column headers and coresponding data columns
						 * and should be fixed in ExtJS 5.0.1
						 */
						reserveScrollbar: true,
		    			columns: [{
		    				xtype: 'rownumberer',
		    				width: 20
		    			}, {
							header : 'Compte',
							dataIndex : 'code',
							width : 80,
							sortable : true,
							editor : {
								xtype : 'textfield',
								minLength: 4,
								allowBlank: false,
								maskRe: /[0-9xX]/,
								vtype: 'accountcode'
							}
						}, 
//						{
//							header : 'Type',
//							dataIndex : 'accType',
//							width : 40,
//							sortable : true,
//							renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
//								switch(value){
//									case '40':
//										return 'Modèle';
//										break;
//									case '50': 
//										return 'Compte';
//										break;
//								}
//							},
//							editor : {
//								xtype : 'combo',
//								allowBlank: false,
//								itemId: 'accountTypeColumn',
//								queryMode : 'local',
//								triggerAction : 'all',
//								valueField   : 'accType',
//								displayField: 'name',
//								editable : true,
//								store : Ext.create('Ext.data.Store', {
//									fields: [{name: 'accType'}, {name: 'name', type: 'string'}],
//									data: [{
//										accType: '40',
//										name: 'Modèle'
//									}, {
//										accType: '50',
//										name: 'Compte'
//									}],
//									storeId: 'accTypeStore'
//								})
//							}
//						},
						{
							id : 'name',
							header : 'Nom',
							dataIndex : 'name',
							width : 180,
							sortable : true,
							editor : {
								xtype : 'textfield',
								allowBlank: false
							}
						}, {
							header : 'Description',
							dataIndex : 'description',
							width : 200,
							sortable : true,
							editor : {
								xtype : 'textfield',
								allowBlank: false
							}
						}, {	
							xtype : 'booleancolumn',
							header : 'Active',
							dataIndex : 'active',
							align : 'center',
							width : 50,
							trueText : 'Oui',
							falseText : 'No',
							editor : {
								xtype : 'checkbox'
							}
						}]
					}]
				}]
		};
		
		Ext.apply(this, config);
		this.callParent(arguments);
	},
	
	isSafeToClose: function(callback){
		var deletedAccounts = this.getController().deletedAccounts,
		ds = this.getComponent('centerContainer').getComponent('accountsGrid').getStore(),
		safeToClose = true,
		modelNameField = this.getComponent('centerContainer').getComponent('COAAttributesForm').getComponent('modelNameField');
		
		if(modelNameField.isDirty()){
			safeToClose = false;
			return safeToClose;
		}
		
		if(deletedAccounts.length > 0){
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
		
		if(callback){
			callback();
		}
		return safeToClose;
	}
});