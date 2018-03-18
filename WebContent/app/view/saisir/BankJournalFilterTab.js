Ext.define('MaParoisse.view.saisir.BankJournalFilterTab', {
	extend: 'Ext.panel.Panel',
	requires: ['MaParoisse.model.AccJournalItemExtended', 'MaParoisse.model.JournalFilter'],
	
	controller: 'saisir-bankjournalfiltertab',
	
	filterRecord: null,
	paymentMethodId: null,
	bankAccountId: null,
	
	timeControlValue: 'dateSpanFilter',
	monthValue: null,
	yearValue: null,
	dateFrom: null,
	dateTo: null,
	accJournals: null,
	
	accBalance: null,
	
	initComponent: function(){
		var me = this;
		
		if(me.accBalance != null){
			me.balanceHtml = '<p>Solde ' + me.accBalance.accDescription + '</p>' + '<p>au ' + me.accBalance.dateTo + ': <span id="balanceAmount" style="padding-left: 10px; font-size: 20px; font-weight: 700!important; color: #4390df">' + me.accBalance.finalBalance + '</span></p>';
		} else {
			me.balanceHtml = '';
		}
		
		//this module requires only bank journals
		var filteredJournals = [];
		for (i=0; i < me.accJournals.length; i++){
			if (me.accJournals[i].paymentMethodId == '20'){
				filteredJournals.push(me.accJournals[i]);
			}
		}
		me.accJournals = filteredJournals;
		var journalStore = Ext.create('Ext.data.Store', {
			model: 'MaParoisse.model.util.DomainRecord',
			autoDestroy: true
		});
		journalStore.loadData(me.accJournals);
		var journalInitialValue = journalStore.getData().items[0].data.code;
		var accCodeInitialValue = journalStore.getData().items[0].data.accBalance.accCode;
		/*journalStore.insert(0, new MaParoisse.model.util.DomainRecord({
			name: 'Tous',
			code: ''
		}));*/
		
		var config = {
				autoDestroy: true,
				listeners: {
					scope: 'controller',
					render: 'onRender'
				},
				tbar: [{
					icon: null,
					glyph: 'xe147@iconFont',
					baseCls: 'ae-ext-button-small-icon',
			        scale: 'small',
			        iconAlign: 'top',
			        text: 'Filtre',
			        handler: 'onFilterClicked'
			    }, '->', {
			    	xtype: 'textfield',
			    	emptyText: 'Rechercher',
			    	enableKeyEvents: true,
			    	listeners: {
			    		keyup: 'onSearchFieldKeyUp'
			    	}
			    }],
				layout: 'border',
				style: {
					backgroundColor: '#ffffff'
				},
				items: [{
					xtype: 'container',
					region: 'north',
					height: 100,
					layout: 'border',
					itemId: 'northContainer',
					items: [{
						xtype: 'form',
						style: {
							backgroundColor: '#ffffff'
						},
						itemId: 'filterForm',
						header: false,
						frame: true,
						region: 'center',
						//height: 80,
						layout: 'column',
						padding: '10 0 10 0',
						items: [{
							itemId: 'col1',
							layout: 'form',
							defaults: {
								layout: 'hbox',
								margin: '3 0 5 0'
							},
							items: [{
								itemId: 'col1row1',
								defaults: {
									margin: '0 8 0 0',
									width: 110
								},
								items: [{
									xtype: 'radio',
									margin: '0 18 0 0',
									fieldLabel: 'Mois',
									labelWidth: 60,
									width: 80,
									name: 'timeControl',
									inputValue: 'monthFilter',
									listeners: {
										change: 'onRadioChange'
									},
									checked: me.timeControlValue == 'monthFilter'
								}, {
									xtype: 'numberfield',
									itemId: 'monthField',
									name: 'month',
									minValue: 1,
									maxValue: 12,
									step: 1,
									value: me.monthValue,
									allowDecimals: false,
									disabled: true
								}, {
									xtype: 'numberfield',
									itemId: 'yearField',
									name: 'year',
									minValue: 2000,
									maxValue: 2025,
									step: 1,
									value: me.yearValue,
									allowDecimals: false,
									disabled: true
								}]
							}, {
								itemId: 'col1row2',
								defaults: {
									margin: '0 8 0 0',
									width: 110
								},
								items: [{
									xtype: 'radio',
									margin: '0 18 0 0',
									fieldLabel: 'Période',
									labelWidth: 60,
									width: 80,
									name: 'timeControl',
									inputValue: 'dateSpanFilter',
									listeners: {
										change: 'onRadioChange'
									},
									checked: me.timeControlValue == 'dateSpanFilter'
								}, {
									xtype: 'datefield',
									itemId: 'dateFromField',
									name: 'dateFrom',
									value: me.dateFrom
								}, {
									xtype: 'datefield',
									itemId: 'dateToField',
									name: 'dateTo',
									value: me.dateTo
								}]
							}]
						}, {
							itemId: 'col2',
							layout: 'form',
							defaults: {
								layout: 'hbox',
								margin: '3 0 5 0'
							},
							items: [{
								itemId: 'col2row1',
								defaults: {
									margin: '0 8 0 0',
									width: 110
								},
								items: [{
									xtype: 'numericfield',
									alwaysDisplayDecimals: true,
									decimalSeparator: ',',
									thousandSeparator: ' ',
									decimalPrecision: 2,
									hideTrigger: true,
									keyNavEnabled: false,
									mouseWheelEnabled: false,
									fieldLabel: 'Montant',
									name: 'amountFrom',
									emptyText: 'de',
									labelWidth: 60,
									width: 170
								}, {
									xtype: 'numericfield',
									alwaysDisplayDecimals: true,
									decimalSeparator: ',',
									thousandSeparator: ' ',
									decimalPrecision: 2,
									hideTrigger: true,
									keyNavEnabled: false,
									mouseWheelEnabled: false,
									name: 'amountTo',
									emptyText: 'à'
								}]
							}, {
								itemId:'col2row2',
								defaults: {
									margin: '0 8 0 0',
									width: 110
								},
								items: [{
									xtype: 'textfield',
									fieldLabel: 'Compte',
									itemId: 'accFieldFrom',
									name: 'accCodeFrom',
									emptyText: '',
									labelWidth: 60,
									width: 170,
									value: accCodeInitialValue,
									checkChangeEvents: ['change'],
									validator: function(val){
										if (val.startsWith("512")){
											return true;
										}
										else {
											return false
										}
									},
									listeners: {
										change: 'onAccFieldChange'
									}
								}/*, {
									xtype: 'textfield',
									name: 'accCodeTo',
									emptyText: 'à'
								}*/]
							}]
						}, {
							itemId: 'col3',
							layout: 'form',
							defaults: {
								layout: 'hbox',
								margin: '3 0 5 0'
							},
							items: [{
								itemId: 'col3row1',
								defaults: {
									margin: '0 8 0 0'
								},
								items: [{
									xtype: 'combobox',
					    			itemId: 'journalField',
					    			fieldLabel: 'Journal',
					    			displayField: 'name',
					    			valueField: 'code',
					    			forceSelection: true,
					    			queryMode: 'local',
					    			autoSelect: true,
					    			value: journalInitialValue,
					    			name: 'journalCode',
					    			store: journalStore,
					    			listeners: {
										change: 'onJounalComboChange'
									},
								}]
							}, {
								itemId:'col3row2',
								defaults: {
									margin: '0 8 0 0'
								},
								items: [{
									xtype: 'textfield',
									fieldLabel: 'Commentaire',
									name: 'description'
								}]
							}]
						},  {
							itemId: 'col4',
							layout: 'form',
							defaults: {
								layout: 'hbox',
								margin: '0 0 5 0'
							},
							items: [{
								itemId: 'col4row1',
								defaults: {
									margin: '0 8 0 0'
								},
								items: [{
									itemId: 'tallyGroup',
									layout: 'hbox',
									xtype: 'buttongroup',
									defaults: {
										margin: '0 12 0 0'
									},
							        items: [{
						                xtype:'form',
						                layout: 'vbox',
						                defaults: {
											margin: '0 0 7 0'
										},
						                items: [{
								            text: 'Toutes',
								            toggleGroup: 'tallyGroup',
								            xtype: 'button',
								            width: 110,
								            btnId: 'all',
								            pressed: true,
								            listeners: {
								            	toggle: 'onTallyToggled'
								            }
								        }, {
								        	xtype: 'container',
								        	width: 110,
								        	height: 25,
								        	html: '<div id="tallyAllSum" style="width:100%; text-align:center;"></div>'
								        }]
							        }, {
						                xtype:'form',
						                layout: 'vbox',
						                defaults: {
											margin: '0 0 7 0'
										},
										items: [{
								            text: 'Pointées',
								            toggleGroup: 'tallyGroup',
								            xtype: 'button',
								            width: 110,
								            btnId: 'checked',
								            listeners: {
								            	toggle: 'onTallyToggled'
								            }
								            
								        }, {
								        	xtype: 'container',
								        	width: 110,
								        	height: 25,
								        	html: '<div id="tallyCheckedSum" style="width:100%; text-align:center;"></div>'
								        }]
							        }, {
						                xtype:'form',
						                layout: 'vbox',
						                defaults: {
											margin: '0 0 7 0'
										},
										items: [{
								            text: 'Non pointées',
								            toggleGroup: 'tallyGroup',
								            xtype: 'button',
								            width: 110,
								            btnId: 'unchecked',
								            listeners: {
								            	toggle: 'onTallyToggled'
								            }
								        }, {
								        	xtype: 'container',
								        	width: 110,
								        	height: 25,
								        	html: '<div id="tallyUncheckedSum" style="width:100%; text-align:center;"></div>'
								        }]
							        }]}
								]
							}]
						}]
					}, {
						xtype: 'panel',
						headerPosition: 'left',
						hidden: me.accBalance == null,
						itemId: 'balancePanel',
						bodyPadding: '5 0 0 10',
						region: 'east',
						width: 310,
						collapsible: true,
						collapsed: me.accBalance === null,
						collapseDirection: 'right',
						title: 'Solde',
						html: me.balanceHtml
					}]
				}, {
					xtype: 'grid',
					itemId: 'journalItemsGrid',
					header: false,
					region: 'center',
					autoScroll: true,
					reserveScrollbar: true,
					forceFit: true,
					
					listeners: {
						rowdblclick: 'onAccJournalItemDblClick'
					},
					componentCls: 'ae-grouping-grid',
					features: [{
						ftype:'grouping',//'groupingsummary',
						id: 'grSummary',
						collapsible: false,
						enableGroupingMenu: false,
						enableNoGroups: false,
						//showSummaryRow: true,
						groupHeaderTpl: [
			                 '<div style="background-color: #f0f0f0;">{name:this.formatName}</div>',
			                 {
			                	 formatName: function(entryGroupId) {
			                		 if(entryGroupId.substring(0, 1) === 'a'){
			                			 return '<b style="font-style: italic; font-weight: bold !important;">* Ecriture nouvelle</b>';
			                		 } else if (entryGroupId.substring(0, 1) === 'b'){
			                			 return '<b style="font-style: italic; font-weight: bold !important;">* Ecriture nouvelle</b>';
			                		 } else if (entryGroupId.match(/^\d*$/)){
			                			 return 'Ecriture ' + entryGroupId.substring(6, 8) + '/'+ entryGroupId.substring(4, 6)+ '/' + entryGroupId.substring(0, 4);
			                		 }
			                	 }
			                 }
		                ]
					}],
					store: Ext.create('Ext.data.Store', {
						autoDestroy: true,
						model: 'MaParoisse.model.AccJournalItemExtended',
						groupField: 'entryGroupId'
					}),
					/*store: Ext.create('Ext.data.Store', {
						autoDestroy: true,
						model: 'MaParoisse.model.AccJournalItemExtended'
					}),*/
					columns: [{
						header: 'N° Ecriture',
						//width: 88,
						//dataIndex: 'ajiEntryId',
						dataIndex: 'ajiBatchId',
						hidden: true
					}, {
						header: 'Date de saisie',
						//width: 120,
						xtype: 'datecolumn',
						dataIndex: 'ajiDateCreation',
						hidden: true
					}, {
						header: 'Date',
						//width: 100,
						flex: .1,
						xtype: 'datecolumn',
						dataIndex: 'ajiDate'
					}, {
						header: 'Journal',
						//width: 70,
						flex: .05,
						dataIndex: 'ajiJournal'
					}, {
						header: 'Compte',
						//width: 220,
						flex: .25,
						dataIndex: 'ajiAccCode',
						renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
							return value + ' - ' + record.get('ajiAccName');
						}
					}, {
						header: 'Fournisseur',
						//width: 200,
						flex: .15,
						dataIndex: 'supplier',
						renderer: 'supplierRenderer'
					}, {
						header: 'Commentaire',
						renderer: 'commentRenderer',
						//width: 200,
						flex: .20,
						dataIndex: 'ajiDescription'
					}, {
						header: 'Débit',
						//width: 90,
						flex: .075,
						align: 'right',
						renderer: function(value){
		                	return Ext.util.Format.currency(value);
		                },
						dataIndex: 'ajiDtAmount',
						renderer: function(value){
		                	return Ext.util.Format.currency(value);
		                }
					}, {
						header: 'Crédit',
						//width: 90,
						flex: .075,
						align: 'right',
						renderer: function(value){
		                	return Ext.util.Format.currency(value);
		                },
						dataIndex: 'ajiCtAmount',
						renderer: function(value){
		                	return Ext.util.Format.currency(value, '');
		                }
					}, {
						header: 'Donateur',
						//width: 240,
						dataIndex: 'contributor',
						renderer: 'contributorRenderer',
						hidden: true
					}, {
						header: 'Code Quete',
						//width: 100,
						flex: .1,
						dataIndex: 'ajiCodeQuete'
					}, {
						header: 'Pointage',
						xtype: 'checkcolumn',
						dataIndex: 'ajiTally',
						hidden: true,
						listeners: {
							beforecheckchange: 'beforeTallyCheckChange'
						}
					}, {
			            xtype:'actioncolumn',
			            flex: 0.02,
			            items: [{
			                icon: '../../../resources/images/icons/attachment.png',
			                tooltip: 'Aperçu',
			                getClass: function(v, metaData, r, rowIdx, colIdx, store){
			                	var ds = me.getComponent('journalItemsGrid').getStore();
			                	var groups = ds.getGroups();
			                	//find the current group
			                	var currentGroup = null;
			                	for(var i = 0; i < groups.items.length; i++){
			                		var group = groups.items[i];
			                		if(group._groupKey === r.data.entryGroupId){
			                			currentGroup = group;
			                			break;
			                		}
			                	}
			                	if(currentGroup != null && Ext.isDefined(currentGroup)) {
			                		var entryItems = currentGroup.items;
			                		if(r.data.id === entryItems[0].data.id && r.data.attachmentId != 0 && r.data.attachmentRemoteName.length > 0 && r.data.attachmentName.length > 0) {
				                		return 'ae-action-column-item';
				                	} else {
				                		return 'ae-displayNone';
				                	}
			                	}
			                },
			                handler: function(grid, rowIndex, colIndex, item, e, record) {
			                	var req = Ext.create('MaParoisse.lib.JsonRPC', {
			            			url: '/JcrServlet',
			            			service_type: 'JcrService',
			            			listeners: {
			            				success: function () {
			            					//show success and load the server data 
			            					MaParoisse.plugin.notification.showSuccess(' ','succès');
			            					
			            					var resp = arguments[0].BODY;
			            					window.open(resp.downloadUrl, 'Download');
			            					
			            				},
			            				error: function () {}
			            			}
			            		});
			            		
			            		req.request({
			            			method: 'getAttachmentPath',
			            			params: {
			            				ownerId: AccBureau.Context.principal.data.compId,
			            				embedded: true,
			            				attId: record.data.attachmentId
			            			}
			            		});
			                }
			            }]
			        }]
				}]
		};
		
		Ext.apply(this, config);
		this.callParent(arguments);
	}
});
