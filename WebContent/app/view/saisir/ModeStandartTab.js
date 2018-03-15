Ext.define('MaParoisse.view.saisir.ModeStandartTab', {
	extend: 'Ext.panel.Panel',
	requires: ['MaParoisse.model.AccJournalItemExtended', 'MaParoisse.model.JournalFilter'],
	
	controller: 'saisir-modestandarttab',
	
	filterRecord: null,
	paymentMethodId: null,
	bankAccountId: null,
	
	timeControlValue: null,
	monthValue: null,
	yearValue: null,
	dateFrom: null,
	dateTo: null,
	
	accBalance: null,
	
	accStore: null,
	supplierStore: null,
	
	modifiable: true,
	
	initComponent: function(){
		var me = this;
		
		if(me.accBalance != null){
			me.balanceHtml = '<p>Solde ' + me.accBalance.accDescription + '</p>' + '<p>au ' + me.accBalance.dateTo + ': <span id="balanceAmount" style="padding-left: 10px; font-size: 20px; font-weight: 700!important; color: #4390df">' + me.accBalance.finalBalance + '</span></p>';
		} else {
			me.balanceHtml = '';
		}
		
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
			    }, '-', {
					icon: null,
					glyph: 'xe170@iconFont',
					baseCls: 'ae-ext-button-small-icon',
			        scale: 'small',
			        iconAlign: 'top',
			        text: 'Enregistrer',
			        hidden: !me.modifiable,
			        handler: 'onSaveClicked'
			    }, {
			    	icon: null,
					glyph: 'xe08c@iconFont',
					baseCls: 'ae-ext-button-small-icon',
			        scale: 'small',
			        iconAlign: 'top',
			        text: 'Ajouter',
			        hidden: !me.modifiable,
			        handler: 'onAddItemClicked'
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
									name: 'timeControl',
									inputValue: 'monthFilter',
									checked: me.timeControlValue == 'monthFilter'
								}, {
									xtype: 'numberfield',
									itemId: 'monthField',
									name: 'month',
									minValue: 1,
									maxValue: 12,
									step: 1,
									
									value: me.monthValue,
									allowDecimals: false
								}, {
									xtype: 'numberfield',
									itemId: 'yearField',
									name: 'year',
									minValue: 2000,
									maxValue: 2025,
									step: 1,
									value: me.yearValue,
									allowDecimals: false
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
									name: 'timeControl',
									inputValue: 'dateSpanFilter',
									listeners: {
										change: 'onRadioChange'
									}
								}, {
									xtype: 'datefield',
									itemId: 'dateFromField',
									name: 'dateFrom',
									value: me.dateFrom,
									disabled: true
								}, {
									xtype: 'datefield',
									itemId: 'dateToField',
									name: 'dateTo',
									value: me.dateTo,
									disabled: true
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
									margin: '0 8 0 0'
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
									emptyText: 'de'
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
									margin: '0 8 0 0'
								},
								items: [{
									xtype: 'textfield',
									fieldLabel: 'Commentaire',
									name: 'description'
								}]
							}]
						}]
					}, {
						xtype: 'panel',
						headerPosition: 'left',
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
					bufferedRenderer: false,
					componentCls: 'ae-grouping-grid',
					/*viewConfig: {
						stripeRows: true,
						getRowClass: function(record, rowIndex, rowParams, store){
							if(rowIndex % 2 === 1){
								return 'ae-grid-row-alt';
							} else {
								return '';
							}
					        
					    }
					},*/
					listeners: {
						validateedit: 'onAccJournalItemValidateEdit',
						beforeedit: 'onAccJournalItemBeforeEdit'
					},
					plugins: [{
						ptype: 'cellediting',
						pluginId: 'journalitemediting',
						clicksToEdit: 1
					}],
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
					columns: [{
						header: 'N° Ecriture',
						//width: 88,
						//dataIndex: 'ajiEntryId',
						dataIndex: 'ajiBatchId',
						renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
							if(value == 0){
								return '';
							} else {
								return value;
							}
						},
						hidden: true
					}, {
						header: 'Date de saisie',
						//width: 120,
						xtype: 'datecolumn',
						dataIndex: 'ajiDateCreation',
						editor: {
							xtype: 'datefield',
							editable: true,
							listeners: {
								focus: 'onDateEditorFocus'
							}
						},
						hidden: true
					}, {
						header: 'Date',
						//width: 100,
						flex: .08,
						xtype: 'datecolumn',
						dataIndex: 'ajiDate',
						editor: {
							xtype: 'datefield',
							editable: true,
							listeners: {
								focus: 'onDateEditorFocus'
							}
						}
					}, {
						header: 'Journal',
						//width: 70,
						dataIndex: 'ajiJournal',
						hidden: true
					}, {
						header: 'Compte',
						//width: 300,
						flex: .2,
						dataIndex: 'ajiAccId',//TODO: property name request vesko
						renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
							if(record.get('ajiAccCode').length > 0 && record.get('ajiAccName').length > 0){
								return record.get('ajiAccCode') + ' - ' + record.get('ajiAccName');
							} else {
								return '';
							}
						},
						editor: {
							xtype: 'combo',
							valueField: 'id',
							displayField: 'code',
							displayTpl: '<tpl for=".">'+
								'<tpl if="code != 0 ">' +
								'{code}' + ' - ' + '{name}' + 
								'</tpl>'+
								'</tpl>',
							tpl: '<tpl for="."><div class="x-boundlist-item">' + '{code}' + ' - ' + '{name}' + '</div></tpl>',
							queryMode: 'local',
							store: me.accStore,
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
						header: 'Fournisseur',
						//width: 210,
						flex: .15,
						dataIndex: 'supplierName',
						renderer: 'supplierRenderer',
						editor: {
							xtype: 'combo',
							itemId: 'supplierCombo',
							displayTpl: '<tpl for=".">' + '{name}' + '</tpl>',
							queryMode: 'local',
							//submitValue: false,
							anyMatch: true,
							displayField: 'name',
							valueField: 'name',
							store: me.supplierStore,
							selectOnFocus: true,
							autoSelect: false,
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
						header: 'Commentaire',
						renderer: 'commentRenderer',
						//width: 300,
						flex: .22,
						dataIndex: 'ajiDescription',
						editor: {
							margin: '36px 0 0 0',
							xtype: 'textarea',
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
						header: 'Débit',
						//width: 90,
						flex: .075,
						align: 'right',
						renderer: function(value){
		                	return Ext.util.Format.currency(value);
		                },
						dataIndex: 'ajiDtAmount',
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
						}//,
						/*summaryType: 'sum',
			            summaryRenderer: function(value, summaryData, dataIndex) {
			                return '<div style="text-align: right; font-weight: bold;">' + Ext.util.Format.currency(value) + '</div>';
			            }*/
					}, {
						header: 'Crédit',
						//width: 90,
						flex: .075,
						align: 'right',
						renderer: function(value){
		                	return Ext.util.Format.currency(value);
		                },
						dataIndex: 'ajiCtAmount',
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
						}//,
						/*summaryType: 'sum',
			            summaryRenderer: function(value, summaryData, dataIndex) {
			                return '<div style="text-align: right; font-weight: bold;">' + Ext.util.Format.currency(value) + '</div>';
			            }*/
					}, {
						header: 'Donateur',
						//width: 260,
						flex: .15,
						dataIndex: 'contributorId',
						renderer: 'contributorRenderer',
						editor: {
							xtype: 'textfield',
							editable: false,
							/*tpl: new Ext.Template('<tpl>{contributorFirstName} {contributorLastName}</tpl>'),
							tplWriteMode: 'insertFirst',*/
							triggers: {
								contributor: {
									cls: 'ae-form-trigger-user',
									handler: 'onContributorTrigger'
								},
								clearTrigger: {
									cls: 'ae-form-trigger-clear',
									handler: 'onClearTrigger'
								}
							}
						}
					}, {
						header: 'Code quête',
						//width: 130,
						flex: .1,
						dataIndex: 'ajiCodeQuete',
						editor: {
							xtype: 'combo',
							queryMode: 'local',
							allowBlank: true,
							triggerAction : 'all',
							displayField: 'name',
							valueField: 'code',
							selectOnFocus: true,
							forceSelection: true,
							autoSelect: false,
							listeners: {
								specialkey: 'onLastEditorSpecialKey',
								focus: function(me){
									if(me.selectOnFocus && Ext.browser.is.Firefox){
										Ext.defer(function() {
											me.selectText();
										}, 1);
									}
								}
							},
							store: Ext.create('Ext.data.Store', {
								model: 'MaParoisse.model.Quete',
								data: MaParoisse.lib.Globals.getQueteCodes()
							})
						}
					}, {
			            xtype:'actioncolumn',
			            flex: 0.05,
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
			                		//find if there is a record with deleteOld for this entryId in the attachmentStore
			                		var hidePreview = false;
			                		me.getController().attachmentStore.each(function(attachment){
			                			if(attachment.get('entryId') == r.data.ajiEntryId && attachment.get('deleteOld') === true){
			                				hidePreview = true;
			                			}
			                		});
			                		if(r.data.id === entryItems[0].data.id && r.data.attachmentId != 0 && r.data.attachmentRemoteName.length > 0 && r.data.attachmentName.length > 0 && !hidePreview) {
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
			            }, {
			                icon: '../../../resources/images/icons/icon-upload.png',
			                tooltip: 'Joindre',
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
			                		if(r.data.id === entryItems[0].data.id && r.data.attachmentRemoteName.length == 0 && r.data.attachmentName.length == 0) {
				                		return 'ae-action-column-item';
				                	} else {
				                		return 'ae-displayNone';
				                	}
			                	}
			                },
			                handler: function(grid, rowIndex, colIndex, item, e, record) {
			                	Ext.create(Ext.window.Window, {
			                		floating: true,
			                		autoDestroy: true,
			                		autoShow: true,
			                		modal: true,
			                		title: 'Importer',
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
			    								handler: function(){
			    									var btn = this;
			    									btn.up('form').submit({
			    										url: '../FileUploadServlet',
			    						                method: 'POST',
			    						                success: function(form, action) {
			    						                	var controller = me.getController();
			    						                	controller.attachFileToItem(record, action.result.fileAttachment);
			    						                	btn.up('window').close();
			    						                	controller.onAddItemClicked();
			    						                }
			    						            });
			    								}
			    					    	}]
			    					    }
			    		        	}]
			                	});
			                }
			            }, {
			            	icon: '../../../resources/images/icons/clear.png',
			                tooltip: 'Supprimer',
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
			                		if(r.data.id === entryItems[0].data.id && r.data.attachmentRemoteName.length > 0 && r.data.attachmentName.length > 0) {
				                		return 'ae-action-column-item';
				                	} else {
				                		return 'ae-displayNone';
				                	}
			                	}
			                },
			                handler: function(grid, rowIndex, colIndex, item, e, record) {
			                    me.getController().deleteAttachment(record);
			                }
			            }]
			        }]
				}]
		};
		
		Ext.apply(this, config);
		this.callParent(arguments);
	},
	
	isSafeToClose: function(){
		return this.getController().isSafeToClose();
	}
});