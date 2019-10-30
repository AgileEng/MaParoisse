
Ext.define("MaParoisse.view.receipts.Contributors",{
    "extend": "Ext.panel.Panel",
    "controller": "receipts-contributors",
    
    region: 'center',
    mode: null,
    
    initComponent: function(){
    	var me = this;
    	
    	var config = {
    		title: me.mode === MaParoisse.lib.Globals.getContributorsModuleModes().CRUDCONTRIBUTOR ? 'Table des donateurs' :
    				me.mode === MaParoisse.lib.Globals.getContributorsModuleModes().DOCGENERATION ? 'Edition - Impression' : '',
    		layout: 'border',
    		listeners: {
    			scope: 'controller',
    			render: 'onRender',
    			tenantChange: 'onTenantChange'
    		},
    		items: [{
    			xtype: 'grid',
    			itemId: 'contributorsGrid',
    			header: false,
    			region: 'center',
    			forceFit: true,
    			reserveScrollbar: true,
    			tbar: {
    				itemId: 'topToolbar',
					items:[{
						icon: null,
						glyph: 'xe001@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Générer document fiscal',
				        handler: 'onGenerateFiscalDocument',
				        hidden: me.mode != MaParoisse.lib.Globals.getContributorsModuleModes().DOCGENERATION
				    }, {
				    	icon: null,
				    	itemId: 'checkAllBtn',
						glyph: 'xe0a6@iconFont',
						iconAlign: 'left',
						text: 'Cochez toutes',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        handler: 'onCheckBtn',
				        hidden: me.mode != MaParoisse.lib.Globals.getContributorsModuleModes().DOCGENERATION
				    }, {
				    	icon: null,
				    	itemId: 'uncheckAllBtn',
						glyph: 'xe0a7@iconFont',
						iconAlign: 'left',
						text: 'Décocher tout',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        handler: 'onCheckBtn',
				        hidden: me.mode != MaParoisse.lib.Globals.getContributorsModuleModes().DOCGENERATION
				    }, {
						icon: null,
						glyph: 'xe170@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Enregistrer',
				        handler: 'onSaveContributorsClicked',
				        hidden: me.mode != MaParoisse.lib.Globals.getContributorsModuleModes().CRUDCONTRIBUTOR
				    }, {
				    	icon: null,
						glyph: 'xe08c@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Ajouter',
				        handler: 'onAddContributorClicked',
				        hidden: me.mode != MaParoisse.lib.Globals.getContributorsModuleModes().CRUDCONTRIBUTOR
				    }, {
				    	icon: null,
						glyph: 'xe059@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Supprimer',
				        handler: 'onDeleteContributorClicked',
				        hidden: me.mode != MaParoisse.lib.Globals.getContributorsModuleModes().CRUDCONTRIBUTOR
				    }, '-', {
						icon: null,
						glyph: 'xe02d@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Importer',
				        itemId: 'uploadBtn',
				        hidden: me.mode != MaParoisse.lib.Globals.getContributorsModuleModes().CRUDCONTRIBUTOR,
				        menu: {
				        	floating: true,
				        	items: [{
				        		xtype: 'form',
				        		padding: '10 10 10 10',
				        		itemId: 'fileForm',
				        		frame: true,
				        		items: [{
							        xtype: 'filefield',
							        width: 400,
							        name: 'file',
							        allowBlank: false,
							        fieldLabel: 'Fichier',
							        labelWidth: 50,
							        msgTarget: 'side',
							        anchor: '100%'
							    }],
							    bbar: {
							    	style: {
							    		background: '#ffffff'
							    	},
							    	items: ['->', {
								    	text: 'Importer',
								    	icon: null,
								    	glyph: 'xe02d@iconFont',
										baseCls: 'ae-ext-button-small-icon',
										handler: 'onUploadClicked'
							    	}]
							    }
				        	}]
				        }
			        }, {
						xtype: 'numberfield',
						itemId: 'yearField',
						fieldLabel: 'Année',
						labelWidth: 55,
						name: 'year',
						minValue: 2000,
						maxValue: 2050,
						step: 1,
						allowDecimals: false,
						listeners: {
							change: 'onYearChange'
						},
						hidden: me.mode != MaParoisse.lib.Globals.getContributorsModuleModes().DOCGENERATION
					}, '->',{
    					icon: null,
    					glyph: 'xe021@iconFont',
    					baseCls: 'ae-ext-button-small-icon',
    			        scale: 'small',
    			        iconAlign: 'top',
    			        text: 'Liste des donateurs',
    			        btnId: 'expenseBtn',
    			        handler: 'onPrintContributorsClicked',
    			        hidden: me.mode != MaParoisse.lib.Globals.getContributorsModuleModes().DOCGENERATION
    			    }, {
				    	xtype: 'textfield',
				    	emptyText: 'Rechercher',
				    	enableKeyEvents: true,
				    	listeners: {
				    		keyup: 'onSearchFieldKeyUp'
				    	}
				    }]
    			},
    			plugins: me.mode === MaParoisse.lib.Globals.getContributorsModuleModes().CRUDCONTRIBUTOR ? [{
    				ptype: 'cellediting',
    				pluginId: 'contributorediting',
    				clicksToEdit: 1
    				/*listeners: {
    					edit: 'onCellEditorEdit'
    				}*/
    			}] : [],
    			store: new Ext.data.Store({
    				model: 'MaParoisse.model.Contributor',
    				autoDestroy: true,
    				sorters: [{
    	                property: 'employeeLastName',
    	                direction: 'asc'
    	            },{
    	                property: 'employeeFirstName',
    	                direction: 'asc'
    	            }]
    			}),
    			columns: [{
    				xtype: 'rownumberer',
    				width: 35
    			}, {
					xtype: 'checkcolumn',
					hidden: me.mode != MaParoisse.lib.Globals.getContributorsModuleModes().DOCGENERATION,
					dataIndex: 'checked'
				}, {
					header: 'Salutation',
					dataIndex: 'employeeSalutationID',
					width:40,
					renderer: function(value){
						switch (value) {
						case 0:
							return ' ';
							break;
						case 10:
							return 'Monsieur';
							break;
						case 20:
							return 'Madame';
							break;
						case 30:
							return 'Mademoiselle';
							break;
						}
					},
					editor: {
						xtype: 'combo',
						queryMode: 'local',
						allowBlank: true,
						displayField: 'name',
						valueField: 'employeeSalutationID',
						store: new Ext.data.Store({
							fields: ['name', 'employeeSalutationID'],
							data: [{
								'name': ' ',
								'employeeSalutationID': 0
							}, {
								'name': 'Monsieur',
								'employeeSalutationID': 10
							}, {
								'name': 'Madame',
								'employeeSalutationID': 20
							}, {
								'name': 'Mademoiselle',
								'employeeSalutationID': 30
							}]
						})
					}
				}, {
    				header: 'Nom',
    				dataIndex: 'employeeLastName',
    				editor: {
    					xtype: 'textfield',
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
    				header: 'Prénom',
    				dataIndex: 'employeeFirstName',
    				editor: {
    					xtype: 'textfield',
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
    				header: 'Adresse',
    				dataIndex: 'employeeAddress',
    				editor: {
    					xtype: 'textfield',
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
    				header: 'CP',
    				dataIndex: 'employeePostCode',
    				editor: {
    					xtype: 'textfield',
    					minLength: 5,
    					maxLength: 5,
    					maskRe: /[0-9]/,
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
    				header: 'Commune',
    				dataIndex: 'employeeTown',
    				editor: {
						xtype: 'textfield',
						selectOnFocus: true,
						listeners: {
							focus: function(me){
								if(me.selectOnFocus && Ext.browser.is.Firefox){
									Ext.defer(function() {
										me.selectText();
									}, 1);
								}
							},
							specialkey: 'onTextFieldSpKey'
						}
    				}
    			}]
    		}]
    	};
    	
    	Ext.apply(me, config);
    	me.callParent(arguments);
    },
    
    isSafeToClose: function(callback){
    	var ds = this.getComponent('contributorsGrid').getStore();
    	
    	var safeToClose = true;
    	ds.each(function(contr){
    		if(Ext.isDefined(contr.generation) && contr.generation > 1){
    			safeToClose = false;
    			return false;
    		}
    	});
    	
    	if(callback){
    		callback(safeToClose);
    	}
    	
    	return safeToClose;
    }
});
