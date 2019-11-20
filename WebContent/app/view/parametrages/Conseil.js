Ext.define('MaParoisse.view.parametrages.Conseil', {
	extend: 'Ext.form.Panel',
	xtype: 'haralampi',
	requires: ['Ext.grid.feature.Grouping',
	           'MaParoisse.model.CouncilMember',
	           'MaParoisse.store.CouncilMembersArr'],
	
	controller: 'conseil',
	
	region: 'center',
	frame: true,
	title: 'IDENTITE / CONSEIL DE FABRIQUE',
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	autoScroll: true,
    
    listeners: {
    	render: 'onRender',
    	tenantChange: 'onTenantChange',
    	scope: 'controller'
    },
    
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
        text: 'Ajouter',
        handler: 'onAddClicked'
    }, {
    	icon: null,
		glyph: 'xe059@iconFont',
		baseCls: 'ae-ext-button-small-icon',
        scale: 'small',
        iconAlign: 'top',
        text: 'Supprimer',
        handler: 'onDeleteClicked'
    }, '-', {
		icon: null,
		glyph: 'xe021@iconFont',
		baseCls: 'ae-ext-button-small-icon',
        scale: 'small',
        iconAlign: 'top',
        text: 'Imprimer',
        handler: 'onPrintCouncilClicked'
    }, {
		icon: null,
		glyph: 'xe021@iconFont',
		baseCls: 'ae-ext-button-small-icon',
        scale: 'small',
        iconAlign: 'top',
        text: 'Imprimer PROCÈS VERBAL',
        handler: 'onPrintBoardProtocolClicked'
    }, '->', {
    	icon: null,
		glyph: 'xe03d@iconFont',
		baseCls: 'ae-ext-button-small-icon',
        scale: 'small',
        iconAlign: 'top',
        text: 'Élections',
        handler: 'onElectionsClicked'
    }],
	
	initComponent: function(){
		var controller = this.controller;
		
		var config = {
				items:[{
					xtype: 'gridpanel',
					itemId: 'bureauGrid',
					reserveScrollbar: true,
					forceFit: true,
					flex: 5,
					store: new Ext.data.Store({
						model: 'MaParoisse.model.CouncilMember',
						groupField: 'councilId',
						sorters: [{
							property: 'guiGroupId',
							direction: 'DESC'
						}]
					}),
					features: [{
				        ftype: 'grouping',
				        groupHeaderTpl: 'Le Bureau *',
				        hideGroupedHeader: true,
				        startCollapsed: false,
				        collapsible: false,
				        id: 'conseilGrouping'
				    }],
				    
				    listeners: {
				    	afterrender: 'onGridAfterRender',
				    	select: 'onBureauGridSelectionChange',
				    	itemcontextmenu: 'onGridItemContextMenu'
				    },
				    
				    plugins:[{
				    	ptype: 'cellediting',
				    	clicksToEdit: 2,
				    	pluginId: 'bureauEditingPlugin',
				    	listeners: {
				    		beforeEdit: 'onBeforeGridCellEdit'
				    	}
				    }],
				    
				    columns: [{
						text: 'Poste',
						resizable: false,
						flex: 1,
						dataIndex: 'positionId',
						modelValidation: true,
						renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
							switch(record.get('positionId')){//
								/*case 20:
									return 'Président';
									break;*/
								case 30:
									return 'Trésorier';
									break;
								/*case 40:
									return 'Secrétaire';
									break;*/
								default:
									switch(record.get('typeId')){
										case 20:
											return 'Curé';
											break;
										default:
											return 'Autre';
											break;
									}
									break;
							}
						}
					},{
						text: 'Nom',
						resizable: false,
						flex: 1,
						dataIndex: 'employeeLastName',
						editor: {
							xtype: 'textfield',
							allowBlank: false
						}
//						renderer: 'recordValidationRenderer'
					}, {
						text: 'Prénom',
						resizable: false,
						flex: 1,
						dataIndex: 'employeeFirstName',
						editor: {
							xtype: 'textfield',
							allowBlank: false
						}
//						renderer: 'recordValidationRenderer'
					//}, {
					//	text: 'Adresse N° rue',
					//	flex: 1,
					//	dataIndex: 'addressNumber'
					}, {
						text: 'Adresse Nom Rue',
						resizable: false,
						flex: 1,
						dataIndex: 'employeeAddress',
						editor: {
							xtype: 'textfield'
						}
//						renderer: 'recordValidationRenderer'
					}, {
						text: 'CP',
						resizable: false,
						flex: 0.5,
						dataIndex: 'employeePostCode',
						editor: {
							xtype: 'textfield',
							maskRe: /[0-9.]/,
							maxLength: 5,
							minLength: 5
						}
//						renderer: 'recordValidationRenderer'
					}, {
						text: 'Commune',
						resizable: false,
						flex: 1,
						dataIndex: 'employeeTown',
						editor: {
							xtype: 'textfield',
							maxLength: 25
						}
//						renderer: 'recordValidationRenderer'
					}, {
						text: 'N° Téléphone',
						resizable: false,
						flex: 1,
						dataIndex: 'employeePhone',
						editor: {
							xtype: 'textfield',
							maskRe: /[0-9.]/
						}
//						renderer: 'recordValidationRenderer'
					}, {
						text: 'Adresse Mail',
						resizable: false,
						flex: 1,
						dataIndex: 'employeeEmail',
						editor: {
							xtype: 'textfield',
							vtype: 'email'
						}
//						renderer: 'recordValidationRenderer'
					}],
					validateRow: function (columnIndexes, record, y) {
		    		    var me, view, errors;
		    		
		    		    me = this;
		    		    view = me.getView();
		    		
		    		    errors = record.validate();
		    		    if (errors.isValid()) {
		    		    	for(var i = 0; i < columnIndexes.length; i++){
		    		    		if(Ext.isDefined(columnIndexes[i])){
			    		    		var cell = view.getCellByPosition({row: y, column: i});
			    		    		cell.removeCls("ae-grid-invalid-cell");
		    		    		}
		    		    	}
		    		        return true;
		    		    }
		    		
		    		    Ext.each(columnIndexes, function (columnIndex, x) {
		    		        var cellErrors, cell, messages;
		    		
		    		        cellErrors = errors.getByField(columnIndex);
		    		        if (!Ext.isEmpty(cellErrors)) {
		    		            cell = view.getCellByPosition({row: y, column: x});
		    		            messages = [];
		    		            Ext.each(cellErrors, function (cellError) {
		    		                messages.push(cellError.message);
		    		            });
		    		
		    		            cell.addCls("ae-grid-invalid-cell");
		    		            // set error tooltip attribute
		    		            //cell.set({'data-errorqtip': Ext.String.format('<ul><li class="last">{0}</li></ul>', messages.join('<br/>'))});
		    		        }
		    		    });
		    		    return false;
		    		},
		    	
		    		getColumnIndexes: function (grid) {
		    		    var columnIndexes = [];
		    		    var getIndex = function(column) {
		    		        if (Ext.isDefined(column.getEditor())) {
		    		            columnIndexes.push(column.dataIndex);
		    		        } else {
		    		            columnIndexes.push(undefined);
		    		        }
		    		    };
		    		    
		    		    if (grid) {
		    		    
		    		        Ext.each(grid.columns, function(column) {
		    		            // # only validate column with editor - with support to grouped headers
		    		            if (column.isGroupHeader) {
		    		                Ext.each(column.items.items, function(subcolumn) {
		    		                    getIndex(subcolumn);
		    		                }); 
		    		            } else {
		    		                getIndex(column);
		    		            }
		    		        });        
		    		        return columnIndexes;
		    		        
		    		    }
		    		}
				}, {
					xtype: 'gridpanel',
					itemId: 'membersGrid',
					reserveScrollbar: true,
					hideHeaders: true,
					forceFit: true,
					flex: 5.5,
					modelValidation: true,
					store: new MaParoisse.store.CouncilMembersArr({
						autoDestroy: true
					}),
					features: [{
				        ftype: 'grouping',
				        collapsible: false,
				        groupHeaderTpl: [
	                         '{name:this.formatName}',
	                         {
	                             formatName: function(name) {
	                                 if(name == 10){
	                                	 return 'Autres Membres du Conseil';
	                                 } else if(name == 20){
	                                	 return 'Les Membres de droit';
	                                 } else {
	                                	 return '';
	                                 }
	                             }
	                         }
	                     ],
				        hideGroupedHeader: false,
				        startCollapsed: false
				    }],
				    
				    plugins:[{
				    	ptype: 'cellediting',
				    	clicksToEdit: 2,
				    	pluginId: 'memberEditingPlugin',
				    	listeners: {
				    		beforeEdit: 'onBeforeGridCellEdit'
				    	}
				    }],
				    
				    listeners: {
				    	afterrender: 'onGridAfterRender',
				    	select: 'onMembersGridSelectionChange',
				    	itemcontextmenu: 'onGridItemContextMenu'
				    },
				    
				    columns: [{
				    	hidden: true,
				    	dataIndex: 'positionId'
				    }, {
						text: 'Poste',
						resizable: false,
						flex: 1,
						dataIndex: 'typeId',
						renderer: 'positionRenderer'//,
						//editor: 'textfield'
					}, {
						text: 'Nom',
						resizable: false,
						flex: 1,
						dataIndex: 'employeeLastName',
						editor: {
							xtype: 'textfield',
							allowBlank: false
						}
//						renderer: 'recordValidationRenderer'
					}, {
						text: 'Prénom',
						resizable: false,
						flex: 1,
						dataIndex: 'employeeFirstName',
						editor: {
							xtype: 'textfield',
							allowBlank: false
						}
//						renderer: 'recordValidationRenderer'
					//}, {
					//	text: 'Adresse N° rue',
					//	flex: 1,
					//	dataIndex: 'addressNumber'
					}, {
						text: 'Adresse Nom Rue',
						resizable: false,
						flex: 1,
						dataIndex: 'employeeAddress',
						editor: {
							xtype: 'textfield'
						}
//						renderer: 'recordValidationRenderer'
					}, {
						text: 'CP',
						resizable: false,
						flex: 0.5,
						dataIndex: 'employeePostCode',
						editor: {
							xtype: 'textfield',
							maskRe: /[0-9.]/,
							maxLength: 5,
							minLength: 5
						}
//						renderer: 'recordValidationRenderer'
					}, {
						text: 'Commune',
						resizable: false,
						flex: 1,
						dataIndex: 'employeeTown',
						editor: {
							xtype: 'textfield',
							maxLength: 25
						}
//						renderer: 'recordValidationRenderer'
					}, {
						text: 'N° Téléphone',
						resizable: false,
						flex: 1,
						dataIndex: 'employeePhone',
						editor: {
							xtype: 'textfield',
							maskRe: /[0-9.]/
						}
//						renderer: 'recordValidationRenderer'
					}, {
						text: 'Adresse Mail',
						resizable: false,
						flex: 1,
						dataIndex: 'employeeEmail',
						editor: {
							xtype: 'textfield',
							vtype: 'email'
						}
//						renderer: 'recordValidationRenderer'
					}],
					validateRow: function (columnIndexes, record, y) {
		    		    var me, view, errors;

		    		    me = this;
		    		    view = me.getView();
		    		
		    		    errors = record.validate();
		    		    if (errors.isValid()) {
		    		    	for(var i = 0; i < columnIndexes.length; i++){
		    		    		if(Ext.isDefined(columnIndexes[i])){
			    		    		var cell = view.getCellByPosition({row: y, column: i});
			    		    		cell.removeCls("ae-grid-invalid-cell");
		    		    		}
		    		    	}
		    		        return true;
		    		    }
		    		
		    		    Ext.each(columnIndexes, function (columnIndex, x) {
		    		        var cellErrors, cell, messages;
		    		
		    		        cellErrors = errors.getByField(columnIndex);
		    		        if (!Ext.isEmpty(cellErrors)) {
		    		            cell = view.getCellByPosition({row: y, column: x});
		    		            messages = [];
		    		            Ext.each(cellErrors, function (cellError) {
		    		                messages.push(cellError.message);
		    		            });
		    		
		    		            cell.addCls("ae-grid-invalid-cell");
		    		            // set error tooltip attribute
		    		            //cell.set({'data-errorqtip': Ext.String.format('<ul><li class="last">{0}</li></ul>', messages.join('<br/>'))});
		    		        } else {
		    		        	
		    		        }
		    		    });
		    		    return errors;
		    		},
		    	
		    		getColumnIndexes: function (grid) {
		    		    var columnIndexes = [];
		    		    var getIndex = function(column) {
		    		        if (Ext.isDefined(column.getEditor())) {
		    		            columnIndexes.push(column.dataIndex);
		    		        } else {
		    		            columnIndexes.push(undefined);
		    		        }
		    		    };
		    		    
		    		    if (grid) {
		    		    
		    		        Ext.each(grid.columns, function(column) {
		    		            // # only validate column with editor - with support to grouped headers
		    		            if (column.isGroupHeader) {
		    		                Ext.each(column.items.items, function(subcolumn) {
		    		                    getIndex(subcolumn);
		    		                }); 
		    		            } else {
		    		                getIndex(column);
		    		            }
		    		        });        
		    		        return columnIndexes;
		    		        
		    		    }
		    		}
				},{
					hidden: true,//Update 11.2019
			        xtype: 'fieldcontainer', 
			        flex: .5,
			        itemId: 'fieldContainer',
			        msgTarget : 'side',
			        layout: 'hbox',
			        defaults: {
						width: 400
					},
					fieldDefaults: {
				        labelAlign: 'left',
				        labelWidth: 200
				    },
					style: {
						paddingLeft: '20px'
					},
					items:[{
						xtype: 'datefield',
						itemId: 'endDateField',
						fieldLabel: 'Date renouvellement bureau',
						allowBlank: false
					}, {
						xtype: 'label',
						style: {
							paddingLeft: '30px'
						},
						text: 'Le Bureau est à renouveler tous les ans. Date à laquelle ce bureau a été renouvelé'
					}]
			    }]
		};
		if(AccBureau.Context.principal['data']['appType'] === 'fabrique'){
			config['items'][0]['columns'][0]['renderer'] = function(value, metaData, record, rowIndex, colIndex, store, view){
				switch(record.get('positionId')){
					case 20:
						return 'Président';
						break;
					case 30:
						return 'Trésorier';
						break;
					case 40:
						return 'Secrétaire';
						break;
					default:
						return '';
						break;
				}
			};
			config['items'][0]['columns'].push({ 
						//hidden: true,//Update 11.2019
						text: 'Date entrée au Conseil',
						resizable: false,
						xtype: 'datecolumn',
						format: 'd/m/Y',
						flex: 1,
						dataIndex: 'entryDate',
						editor: {
							xtype: 'datefield',
							format: 'd/m/Y'
						}
					});
			config['items'][0]['columns'].push({
						//hidden: true,//Update 11.2019
						text: 'Date 1ère Election',
						resizable: false,
						xtype: 'datecolumn',
						format: 'd/m/Y',
						flex: 1,
						dataIndex: 'firstElectionDate',
						editor: {
							xtype: 'datefield',
							format: 'd/m/Y'
						}
					});
			config['items'][0]['columns'].push({
						//hidden: true,//Update 11.2019
						text: 'Date prochain renouvellement',
						resizable: false,
						xtype: 'datecolumn',
						format: 'd/m/Y',
						flex: 1,
						dataIndex: 'nextRenewalDate',
						editor: {
							xtype: 'datefield',
							format: 'd/m/Y'
						}
					});
			config['items'][1]['columns'][0]['hidden'] = false;
			config['items'][1]['columns'].push( {
						//hidden: true,//Update 11.2019
						text: 'Date entrée au Conseil', 
						resizable: false,
						xtype: 'datecolumn',
						format: 'd/m/Y',
						flex: 1,
						dataIndex: 'entryDate',
						editor: {
							xtype: 'datefield',
							format: 'd/m/Y'
						}
					});
			config['items'][1]['columns'].push( {
				//hidden: true,//Update 11.2019
				text: 'Date 1ère Election',
				resizable: false,
				xtype: 'datecolumn',
				format: 'd/m/Y',
				flex: 1,
				dataIndex: 'firstElectionDate',
				editor: {
					xtype: 'datefield',
					format: 'd/m/Y'
				}
			});
			config['items'][1]['columns'].push({
						//hidden: true,//Update 11.2019
						text: 'Date prochain renouvellement',
						resizable: false,
						xtype: 'datecolumn',
						format: 'd/m/Y',
						flex: 1,
						dataIndex: 'nextRenewalDate',
						editor: {
							xtype: 'datefield',
							format: 'd/m/Y'
						}
					});
			config['items'][2]['hidden'] = false;
			}
		Ext.apply(this, config);
		this.callParent(arguments);
	},
	
	isSafeToClose: function(callback){
		var deletedMembers = this.getController().deletedMembers,
			ds = this.getComponent('membersGrid').getStore(),
			dsBureau = this.getComponent('bureauGrid').getStore(),
			safeToClose = true;	
		
		if(deletedMembers.length > 0){
			safeToClose = false;
			return false;
		}

		ds.each(function(rec){
			var record = rec.getDataObjectExt();
			if(rec.dirty || record.dbState != 0){
				safeToClose = false;
				return false;
			}
		});
		
		dsBureau.each(function(rec){
			var record = rec.getDataObjectExt();
			if(rec.dirty || record.dbState != 0){
				safeToClose = false;
				return false;
			}
		});
		
		if(callback){
			callback();
		}
		return safeToClose;
	}
});
