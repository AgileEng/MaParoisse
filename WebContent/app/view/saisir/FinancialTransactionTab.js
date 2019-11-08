Ext.define('MaParoisse.view.saisir.FinancialTransactionTab', {
	extend: 'Ext.panel.Panel',
	requires: ['MaParoisse.model.AccJournalItem', 'Ext.ux.form.NumericField', 'MaParoisse.model.Quete', 'MaParoisse.model.util.NameId'],
	xtype: 'financialtransactiontab',
	
	controller: 'fttabcontroller',
	
	title: '',
	currentFT: null,
	contributor: false,
	suppliers: null,
	contributorRecord: null,
	questType: null,
	appModuleCode: null,
	appModuleId: null,
	autoDestroy: true,
	allowEditing: false,
	accounts: null,//used only in editing mode - TODO: think again later
	fileAttachment: null,//file attachement
	additionalComment: '',
	
	initComponent: function(){
		var me = this,
			queteData,
			questGridColumn;
		
		me.titleComment = MaParoisse.lib.Globals.getTitleCommentByModule(me.appModuleCode) ? MaParoisse.lib.Globals.getTitleCommentByModule(me.appModuleCode) : '';
		me.additionalComment = MaParoisse.lib.Globals.getAdditionalCommentByModule(me.appModuleCode) ? MaParoisse.lib.Globals.getAdditionalCommentByModule(me.appModuleCode): '';
		if(Ext.isDefined(me.currentFT.get('accBalance'))) {
			me.balanceHtml = '<p>Solde ' + me.currentFT.get("accBalance").accName + '</p>' 
				+ '<p>au ' + me.currentFT.get("accBalance").dateTo + ': <span id="balanceAmount" style="padding-left: 10px; font-size: 20px; font-weight: 700!important; color: #4390df">' 
				+ Ext.util.Format.currency(me.currentFT.get("accBalance").finalBalance) + '</span></p>';
		} else {
			me.balanceHtml = '';
		}
		if(me.allowEditing){
			me.accStore = Ext.create('Ext.data.Store', {
				autoDestroy: true,
				model: 'MaParoisse.model.Account',
				data: me.accounts
			});
			
			if(Ext.isDefined(me.currentFT.get('quetes')) && me.currentFT.get('quetes').length > 0){
				queteData = me.currentFT.get('quetes');
			}
		}
		
		if(me.questType == MaParoisse.lib.Globals.getSaisieGuidee().queteTypes.type1){
			questGridColumn = {
					columnWidth: 0.5,
					itemId: 'queteColumn',
					items:[{
						xtype: 'grid',
						disableSelection: true,
						sortableColumns: false,
						enableColumnHide: false,
						enableColumnResize: false,
						enableColumnMove: false,
						header: false,
						forceFit: true,
						reserveScrollbar: true,
						plugins: [{
							ptype: 'cellediting'
						}],
						columns:[{
							header: 'Détail',
							dataIndex: 'name',
							flex: 1,
							resizable: false,
							sortable: false
						}, {
							header: 'Montant',
							dataIndex: 'amount',
							flex: 1,
							resizable: false,
							sortable: false,
							renderer: function(value){
								if(value != 0){
									return Ext.util.Format.currency(value);
								} else {
									return '';
								}
			                },
							editor: {
								xtype: 'numericfield',
								alwaysDisplayDecimals: true,
								decimalSeparator: ',',
								thousandSeparator: ' ',
								decimalPrecision: 2,
								hideTrigger: true,
								keyNavEnabled: false,
								mouseWheelEnabled: false,
								allowBlank: false,
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
							header: 'Code',
							dataIndex: 'code',
							resizable: false,
							sortable: false,
							flex: 1
						}],
						store: Ext.create('Ext.data.Store', {
							model: 'MaParoisse.model.Quete',
							data: me.allowEditing ? queteData : [{
								name: 'Droit de la Fabrique',
								code: MaParoisse.lib.Globals.getSaisieGuidee().quetes.DF.code,
								type: MaParoisse.lib.Globals.getSaisieGuidee().quetes.DF.type
							}, {
								name: 'Célébrant',
								code: MaParoisse.lib.Globals.getSaisieGuidee().quetes.Celebrant.code,
								type: MaParoisse.lib.Globals.getSaisieGuidee().quetes.Celebrant.type
							}, {
								name: 'Prélèvement sur Messe / Archevêché',
								code: '20',
								type: MaParoisse.lib.Globals.getSaisieGuidee().quetes.fromList.type
							}, {
								name: 'Taxe Mariage-Décès / Archevêché',
								code: '14',
								type: MaParoisse.lib.Globals.getSaisieGuidee().quetes.fromList.type
							}]
						})
					}]
				};
		} else if(me.questType == MaParoisse.lib.Globals.getSaisieGuidee().queteTypes.type2){
			questGridColumn = {
					columnWidth: 0.5,
					itemId: 'queteColumn',
					items:[{
						xtype: 'grid',
						disableSelection: true,
						sortableColumns: false,
						enableColumnHide: false,
						enableColumnResize: false,
						enableColumnMove: false,
						header: false,
						forceFit: true,
						reserveScrollbar: true,
						columns:[{
							header: 'Type de quête',
							dataIndex: 'name',
							flex: 1,
							resizable: false,
							sortable: false
						}, {
							header: 'Code',
							dataIndex: 'code',
							flex: 1,
							resizable: false,
							sortable: false
						}]
					}]
				};
			if(AccBureau.Context.principal['data']['appType'] == 'fabrique'){
				questGridColumn['items'][0]['store'] = Ext.create('Ext.data.Store', {
					model: 'MaParoisse.model.Quete',
					data: me.allowEditing ? queteData : [{
						name: me.appModuleCode == '890b4' ? '2% Revenus' : me.appModuleCode == '980b4' ? 'Binages versés' : me.appModuleCode == '990b4' ? 'Messes à célébrer' : '', // changed form "2% Revenus" to "20 % quêtes mariages enterrements"
						code: me.appModuleCode == '890b4' ? '15' : me.appModuleCode == '980b4' ? '19' : me.appModuleCode == '990b4' ? '22' : '',
						type: '20'
					}]
				});
			}else if(AccBureau.Context.principal['data']['appType'] == 'mense'){
				questGridColumn['items'][0]['store'] = Ext.create('Ext.data.Store', {
					model: 'MaParoisse.model.Quete',
					data: me.allowEditing ? queteData : [{
						name: me.appModuleCode == '890b4' ? '20% Quêtes Mariages Enterrements' : me.appModuleCode == '980b4' ? 'Binages versés' : me.appModuleCode == '990b4' ? 'Messes à célébrer' : '', // changed form "2% Revenus" to "20 % quêtes mariages enterrements"
						code: me.appModuleCode == '890b4' ? '16' : me.appModuleCode == '980b4' ? '19' : me.appModuleCode == '990b4' ? '22' : '',
						type: '20'
					}]
				});
			}
		} else if(me.questType == MaParoisse.lib.Globals.getSaisieGuidee().queteTypes.type3){
			questGridColumn = {
					columnWidth: 0.5,
					itemId: 'queteColumn',
					items:[{
						xtype: 'grid',
						disableSelection: true,
						sortableColumns: false,
						enableColumnHide: false,
						enableColumnResize: false,
						enableColumnMove: false,
						header: false,
						forceFit: true,
						reserveScrollbar: true,
						plugins: [{
							ptype: 'cellediting'
						}],
						columns:[{
							header: 'Type de quête',
							dataIndex: 'name',
							flex: 1,
							editor: {
								xtype: 'combo',
								queryMode: 'local',
								allowBlank: false,
								triggerAction : 'all',
								forceSelection: true,
								displayField: 'name',
								valueField: 'name',
								store: Ext.create('Ext.data.Store', {
									model: 'MaParoisse.model.Quete',
									data: MaParoisse.lib.Globals.getQueteCodes()
								}),
								selectOnFocus: true,
								listeners: {
									focus: function(me){
										if(me.selectOnFocus && Ext.browser.is.Firefox){
											Ext.defer(function() {
												me.selectText();
											}, 1);
										}
									},
									select: 'onQueteComboSelect'
								}
							},
							resizable: false,
							sortable: false
						}, {
							header: 'Code',
							dataIndex: 'code',
							flex: 1,
							resizable: false,
							sortable: false
						}],
						store: Ext.create('Ext.data.Store', {
							model: 'MaParoisse.model.Quete',
							data: me.allowEditing ? queteData : [{
								name: '',
								code: '',
								type: '30'
							}]
						})
					}]
				};
		}

		var donationFieldsColumn = {
				columnWidth: 0.5,
				itemId: 'donationColumn',
				defaults: {
					width: 450,
					labelWidth: 180
				},
				
				items: [{
					xtype: 'label',
					text: 'Coordonnées du donateur',
					style: {
						color: '#666666',
						fontSize: '14px',
						margin: '0px 0px 10px 0px'
					}
				}, {
					xtype: 'textfield',
					fieldLabel: 'Nom',
					editable: false,
					name: 'employeeLastName',
					itemId: 'employeeLastField'
				}, {
					xtype: 'textfield',
					fieldLabel: 'Prénom',
					editable: false,
					name: 'employeeFirstName',
					itemId: 'employeeFirstField'
				}, {
					xtype: 'textfield',
					fieldLabel: 'Adresse',
					editable: false,
					name: 'employeeAddress',
					itemId: 'employeeAddressField'
				}, {
					xtype: 'textfield',
					fieldLabel: 'CP',
					editable: false,
					maskRe: /[0-9]/,
					maxLength: 5,
					minLength: 5,
					name: 'employeePostCode',
					itemId: 'employeePostCodeField'
				}, {
					xtype: 'textfield',
					fieldLabel: 'Commune',
					editable: false,
					name: 'employeeTown',
					itemId: 'employeeTownField'
				}]
	    };
		
		var config = {
			closable: me.allowEditing,
			layout: {
				type: 'vbox'
			},
			title: me.allowEditing ? me.appModuleNamePath : this.currentFT.get('name'),
			glyph: this.currentFT.get('paymentMethodId') == 10 ? 'xe026@iconFont' : this.currentFT.get('paymentMethodId') == 20 ? 'xe140@iconFont' : this.currentFT.get('paymentMethodId') == 30 ? 'xe029@iconFont' : '',
			listeners: {
				scope: 'controller',
				render: 'onRender'
			},
			autoScroll: true,
			width: '100%',
			height: 600,
			
			tbar: {
				itemId: 'topToolbar',
				items: [{
					icon: null,
					glyph: 'xe170@iconFont',
					baseCls: 'ae-ext-button-small-icon',
			        scale: 'small',
			        iconAlign: 'top',
			        text: 'Enregistrer',
			        handler: 'onSaveClicked'
			    }, ' ', {
					icon: null,
					glyph: 'xe02d@iconFont',
					baseCls: 'ae-ext-button-small-icon',
			        scale: 'small',
			        iconAlign: 'top',
			        text: 'Importer',
			        itemId: 'uploadBtn',
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
			    }, '-', {
					icon: null,
					hidden: !this.contributor,
					glyph: 'xe03b@iconFont',
					baseCls: 'ae-ext-button-small-icon',
			        scale: 'small',
			        iconAlign: 'top',
			        text: 'Chercher / créer un donateur',
			        handler: 'onChooseContributorClicked'
			    }]
			},
			
			items: [{
				xtype: 'form',
				trackResetOnLoad: true,
				//autoScroll: true,
				itemId: 'ftForm',
				header: false,
				//region: 'north',
				//split: true,
				height: 260,
				width: '100%',
				frame: true,
				bodyPadding: 20,
				layout: 'column',
				fieldDefaults: {
			        labelAlign: 'left',
			        labelWidth: 180,
			        width: 450
			    },
				items: [{
					columnWidth: 0.5,
					defaults: {
						width: 450,
						labelWidth: 180
					},
					itemId: 'firstColumn',
					items:[{
						// The Posting Date determines the posting period and 
						// defines in which fiscal period a document will post. 
						xtype: 'datefield',
						fieldLabel: 'Date', //formerly known as Posting Date (Date Opération)
						name: 'dateAccounting',
						allowBlank: false
					}, {
						xtype: 'combo',
						queryMode: 'local',
						fieldLabel: 'Nature',
						name: 'accAccountExpIncId',
						valueField: 'id',
						forceSelection: me.questType == null,
						displayField: 'name',
						allowBlank: me.questType != null && me.contributor == false,
						hidden: me.questType != null && me.contributor == false,
						store: Ext.create('Ext.data.Store', {
							autoDestroy: true,
							model: 'MaParoisse.model.Account',
							data: me.currentFT.get('accExpIncAccounts')
						})
					}, 
//					{
//						xtype: 'datefield',
//						fieldLabel: 'Date Opération',
//						hidden: this.currentFT.get('paymentMethodId') != 20,
//						allowBlank: this.currentFT.get('paymentMethodId') != 20,
//						name: 'dateTransaction' // formerly known as Entry Date (Date de saisie)
//					}, 
	//				{
	//					xtype: 'combo',
	//					queryMode: 'local',
	//					fieldLabel: 'Bank Journal',
	//					forceSelection: true,
	//					name: 'bankAccountId',
	//					hidden: this.currentFT.get('paymentMethodId') != 20 ,
	//					allowBlank: this.currentFT.get('paymentMethodId') != 20,
	//					valueField: 'id',
	//					displayField: 'name',
	//					store: Ext.create('Ext.data.Store', {
	//						autoDestroy: true,
	//						model: 'MaParoisse.model.BankAccount',
	//						data: me.currentFT.get('bankAccounts')
	//					})
	//				},
					{
						xtype: 'numericfield',
						fieldLabel: 'Montant',
						name: 'amount',
						alwaysDisplayDecimals: true,
						decimalSeparator: ',',
						thousandSeparator: ' ',
						decimalPrecision: 2,
						hideTrigger: true,
						keyNavEnabled: false,
						mouseWheelEnabled: false,
						allowBlank: false
					}, {
						xtype: 'combo',
						hidden: me.suppliers === null,
						fieldLabel: 'Fournisseur',
						name: 'supplierName',
						itemId: 'supplierCombo',
						queryMode: 'local',
						submitValue: false,
						anyMatch: true,
						displayField: 'name',
						valueField: 'name',
						autoSelect: false,
						store: Ext.create('Ext.data.Store', {
							model: 'MaParoisse.model.util.NameId',
							autoDestroy: true,
							data: me.suppliers
						})
					}, {
						xtype: 'textarea',
						fieldLabel: 'Commentaire',
						name: 'description',
						maxLength: 2048,
						allowBlank: true
					}, {
						xtype: 'label',
						text: me.additionalComment
					}]
				}, this.contributor ? donationFieldsColumn : this.questType != null ? questGridColumn : {}, {
					xtype: 'panel',
					itemId: 'balancePanel',
					bodyPadding: '5 0 0 10',
					title: 'Solde',
					header: false,
					width: '100%',
					html: me.balanceHtml
				}]
			}, {
				xtype: 'grid',
				itemId: 'accJournalItems',
				title: 'ECRITURE PASSEE',
				//region: 'center',
				height: 249,
				width: '100%',
				forceFit: true,
				reserveScrollbar: true,
//				tbar: [{
//			    	icon: null,
//					glyph: 'xe08c@iconFont',
//					baseCls: 'ae-ext-button-small-icon',
//			        scale: 'small',
//			        iconAlign: 'top',
//			        text: 'Ajouter',
//			        handler: 'onAddClicked'
//			    }],
				plugins: me.allowEditing ? [{ptype: 'cellediting',pluginId: 'accjournalentryplugin'}] : [],
				store: Ext.create('Ext.data.Store', {
					autoDestroy: true,
					model: 'MaParoisse.model.AccJournalItem',
					data: me.currentFT.get('accJournalEntry').accJournalItems
				}),
				columns: [{
					header: 'N° Ecriture',
					flex: 1,
					editable: false,
					dataIndex: 'batchId'
				}, {
					header: 'Date de saisie',
					flex: 1,
					xtype: 'datecolumn',
					dataIndex: 'dateCreation',
					editor: {
						xtype: 'datefield',
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
					header: 'Date',
					flex: 1,
					xtype: 'datecolumn',
					dataIndex: 'date',
					editor: {
						xtype: 'datefield',
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
					header: 'Journal',
					flex: 1,
					dataIndex: 'journal',
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
					header: 'Compte',
					flex: 2.2,
					dataIndex: 'accId',
					renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
						var displayValue = '',
							ds = null;
						if(me.allowEditing){
							ds = me.accStore;
						} else {
							ds = Ext.data.StoreManager.lookup('accountsstore');
						}
						
						ds.each(function(account){
							if(account.get('id') == value){
								displayValue = account.get('code') + ' - ' + account.get('name');
							}
						});
						return displayValue;
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
						store: me.allowEditing ? me.accStore: Ext.data.StoreManager.lookup('accountsstore'),
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
					flex: 1,
					dataIndex: 'dtAmount',
					renderer: function(value){
	                	return Ext.util.Format.currency(value);
	                },
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
				}, {
					header: 'Crédit',
					flex: 1,
					dataIndex: 'ctAmount',
					renderer: function(value){
	                	return Ext.util.Format.currency(value, '');
	                },
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
				}, {
					header: 'Commentaire',
					flex: 1,
					dataIndex: 'description',
					editor: {
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
					header: 'Code Quete',
					flex: 1,
					hidden: me.questType == null,
					dataIndex: 'codeQuete'
				}]
			}]
		};
		
		if(me.titleComment.length > 0){
			config.items.splice(0, 0, {
				xtype: 'container',
				height: '30',
				html: '<p style="padding-left: 15px; color: #666666; font-size: 14px;">' + me.titleComment + '</p>'
			});
		}
		
		Ext.apply(this, config);
		this.callParent(arguments);
		
		this.getComponent('ftForm').loadRecord(this.currentFT);
		
		
		if(this.allowEditing){
			
			if(this.contributor && this.contributorRecord != null){
				var donationColumn = this.getComponent('ftForm').getComponent('donationColumn');
				
				if(this.contributorRecord.get('employee') != null && typeof this.contributorRecord.get('employee') != 'undefined') {
					donationColumn.getComponent('employeeLastField').setValue(this.contributorRecord.get('employee').lastName);
					donationColumn.getComponent('employeeFirstField').setValue(this.contributorRecord.get('employee').firstName);
					if(this.contributorRecord.get('employee').address != null && typeof this.contributorRecord.get('employee').address != 'undefined') {
						donationColumn.getComponent('employeeAddressField').setValue(this.contributorRecord.get('employee').address.address);
						donationColumn.getComponent('employeePostCodeField').setValue(this.contributorRecord.get('employee').address.postCode);
						donationColumn.getComponent('employeeTownField').setValue(this.contributorRecord.get('employee').address.town);
					}
				}
			}
			
			if(this.suppliers != null && Ext.isDefined(me.currentFT.get('supplier')) && Ext.isDefined(me.currentFT.get('supplier').name)){
				var supplierCombo = me.getComponent('ftForm').getComponent('firstColumn').getComponent('supplierCombo'),
					supplier = null;
				
				supplierCombo.getStore().each(function(rec){
					if(rec.get('name') === me.currentFT.get('supplier').name){
						supplier = rec;
						return false;
					}
				});
				
				if(supplier != null){
					supplierCombo.select(supplier);
				}
			}
		}
		
	},
	
	isSafeToClose: function(){
		var safeToClose = true;
		
		if(this.getComponent('ftForm').isDirty()){
			safeToClose = false;
			return safeToClose;
		}

//		var accJournalItemsStore = this.getComponent('accJournalItems').getStore();
//		
//		accJournalItemsStore.each(function(rec){
//			var record = rec.getDataObjectExt();
//			/*
//			 * Only dirty and phantom records should be considered new
//			 * since in this case template records are always
//			 * generated from the server and come with a 
//			 * dbState INSERT
//			 */
//			if(rec.dirty || rec.phantom /*|| record.dbState != 0*/){
//				safeToClose = false;
//				return safeToClose;
//			}
//		});
		
		return safeToClose;
	}
});