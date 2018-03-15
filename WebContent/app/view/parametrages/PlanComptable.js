Ext.define('MaParoisse.view.parametrages.PlanComptable', {
	extend: 'Ext.panel.Panel',
	
	region: 'center',
	layout: 'border',
	
	controller: 'plancomptable',
	
	/*
	 * copied from MonEntreprise
	 * decide later which vars to keep
	 */
	btnNew : 'New',
	btnEdit : 'Edit',
	btnRemove : 'Remove',
	btnRefresh : 'Refresh',
	btnMoveUpText : 'Up',
	btnMoveUpTooltip : 'Move Up',
	btnMoveDownText : 'Down',
	btnMoveDownTooltip : 'Move Down',
	nAccount : 'Account',
	nName : 'Name',
	nDescript : 'Description',
	nVAT : 'VAT',
	nActive : 'Active',
	btnCancel : 'Cancel',
	activeTrue : 'Oui',
	activeFalse : 'Non',
	btnOK : 'OK',
	rgn : 'center',
	tbhide : true,
	btnNewHide : false, 
	btnEditHide : false, 
	btnRemoveHide : false, 
	btnRefreshHide : false, 
	btnMoveUpHide : true, 
	btnMoveDownHide : true, 
	isCashText       : 'Caisse',
	isBankText       : 'Banque',
	isSupplyTest     : 'Achats',
	isSaleTest       : 'Ventes',
	hideColCode   : false,
	hideColName   : false,
	hideColDescription : false,
	hideColVAT    : true,
	hideColActive : false,
	hideColIsCash : false,
	hideColIsBank : false,
	hideColIsSupply : false,
	hideColIsSale   : false,
	sortInfoField : 'code',
	sortInfoDirection : 'ASC',
	
	initComponent: function(){
		var config = {
			title: 'Plan de compte',
			listeners: {
				render: 'onRender',
				beforedestroy: 'releaseResources',
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
		    }, {
		    	icon: null,
				glyph: 'xe173@iconFont',
				baseCls: 'ae-ext-button-small-icon',
		        scale: 'small',
		        iconAlign: 'top',
		        text: 'Actualiser',
		        handler: 'onRefreshClicked'
		    }, '-', {
				icon: null,
				glyph: 'xe021@iconFont',
				baseCls: 'ae-ext-button-small-icon',
		        scale: 'small',
		        iconAlign: 'top',
		        text: 'Imprimer',
		        handler: 'onPrintClicked'
		    }],	
    		items: [{
    			xtype: 'form',
    			
    			//custom reset function
    			resetForm: function(){
    				this.items.each(function(f){
    					if(f.xtype != 'fieldcontainer' && f.itemId != 'modelCombo'){
        					f.reset();
    					}
    				});
					return this;
    			},
    			
    			trackResetOnLoad: true,
    			
    			itemId: 'COAAttributesForm',
    			height: 75,
    			border: false,
    			region: 'north',
    			bodyPadding: 10,
    			//split: true,
    			
    			//header: false,
    			frame: true,
    			items: [{
    				xtype: 'fieldcontainer',
    				layout: 'hbox',
    				itemId: 'formFieldContainer',
    				width: '100%',
    				items: [{
    					xtype: 'fieldcontainer',
    					itemId: 'firstColFieldCont',
    					flex: .49,
    					layout: 'form',
    					items: [{
	    					xtype : 'combo',
	    					itemId: 'modelCombo',
							queryMode : 'local',
							fieldLabel : 'Models',
							displayField : 'name',
							valueField : 'id',
							editable : false,
							anchor : '95%',
							store: Ext.create('MaParoisse.store.ChartOfAccountsArr', {
								storeId: 'modelsStore'
							}),
							listeners: {
								select: 'onModelsComboSelect'
							}
	    				}]
    				}, {
    					xtype: 'fieldcontainer',
    					flex: .3,
    					layout: 'form',
    					items: [
//    					        {
//							anchor : '95%',  // anchor width by percentage
//							xtype : 'numberfield',
//							minValue : 3,
//							maxValue : 99,
//							step : 1,
//							fieldLabel : 'Généraux',
//							itemId : 'LengthG',
//							value : 6,
//							name: 'lengthG'
//						}, {
//							anchor : '95%',  // anchor width by percentage
//							xtype : 'numberfield',
//							//minValue : 3,
//							//maxValue : 99,
//							step : 1,
//							fieldLabel : 'Auxiliaries',
//							hidden: true,
//							itemId : 'LengthA',
//							value : 6,
//							name: 'lengthA'
//						}
						]
    				}, {
    					xtype: 'fieldcontainer',
    					flex: .2,
    					layout: 'form',
    					items: [
//    					        {
//							anchor : '95%',  // anchor width by percentage
//							xtype : 'textfield',
//							hidden: true,
//							fieldLabel : 'Caractère',
//							maxLength : 1,
//							/*size is deprecated
//							 * use width or use layout
//							 * instead
//							 */
//							//size : 1,
//							width: '100%',
//							value : '0'
//						}, {
//							anchor : '95%',  // anchor width by percentage
//							xtype : 'textfield',
//							hidden: true,
//							fieldLabel : 'Caractère',
//							maxLength : 1,
//							/*size is deprecated
//							 * use width or use layout
//							 * instead
//							 */
//							//size : 1,
//							width: '100%',
//							value : '0'
//						}
						]
    				}]
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
    					canceledit: 'onRowCancelEdit',
    					beforeedit: 'beforeAccountEdit',
    					validateedit: 'onValidateAccount'
    				}
    			}],
    			
    			listeners: {
    				afterrender: 'onGridAfterRender'
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
					hidden : this.hideColCode,
					width : 80,
					sortable : true,
					editor : {
						xtype : 'textfield',
						maskRe: /[0-9]/
					}
				}, {
					id : 'name',
					header : 'Nom',
					hidden : this.hideColName,
					dataIndex : 'name',
					width : 180,
					sortable : true,
					editor : {
						xtype : 'textfield',
						allowBlank: false
					}
				}, {
					header : 'Description',
					hidden : this.hideColDescription,
					dataIndex : 'description',
					width : 200,
					sortable : true,
					editor : {
						xtype : 'textfield',
						allowBlank: false
					}
				}, 
//				{
//					header : 'TVA',
//					dataIndex : 'vatCode',
//					hidden : this.hideColVAT,
//					width : 40,
//					sortable : true,
//					editor : {
//						xtype : 'combo',
//						itemId: 'VATComboEditor',
//						queryMode : 'local',
//						triggerAction : 'all',
//						displayField : 'code',
//						valueField   : 'code',
//						editable : true,
//						store : Ext.create('MaParoisse.store.VAT', {
//							storeId: 'VATStore'
//						})
//					}
//				},
				{
					xtype : 'booleancolumn',
					hidden : this.hideColActive,
					header : 'Active',
					dataIndex : 'active',
					align : 'center',
					width : 50,
					trueText : this.activeTrue,
					falseText : this.activeFalse,
					editor : {
						xtype : 'checkbox'
					}
				}//, {
//					xtype : 'booleancolumn',
//					header : 'Caisse',
//					hidden : this.hideColIsCash,
//					dataIndex : 'isCash',
//					align : 'center',
//					width : 50,
//					trueText : this.activeTrue,
//					falseText : this.activeFalse,
//					editor : {
//						xtype : 'checkbox'
//					}
//				}, {
//					xtype : 'booleancolumn',
//					header : 'Banque',
//					hidden : this.hideColIsBank,
//					dataIndex : 'isBank',
//					align : 'center',
//					width : 50,
//					trueText : this.activeTrue,
//					falseText : this.activeFalse,
//					editor : {
//						xtype : 'checkbox'
//					}
//				}, {
//					xtype : 'booleancolumn',
//					header : 'Achats',
//					hidden : this.hideColIsSupply,
//					dataIndex : 'isSupply',
//					align : 'center',
//					width : 50,
//					trueText : this.activeTrue,
//					falseText : this.activeFalse,
//					editor : {
//						xtype : 'checkbox'
//					}
//				}, {
//					xtype : 'booleancolumn',
//					header : 'Ventes',
//					hidden : this.hideColIsSale,
//					dataIndex : 'isSale',
//					align : 'center',
//					width : 50,
//					trueText : this.activeTrue,
//					falseText : this.activeFalse,
//					editor : {
//						xtype : 'checkbox'
//					}
				//}
				],
				validateRow: function (columnIndexes, record, y) {
	    		    var me, view, errors;
	    		
	    		    me = this;
	    		    view = me.getView();
	    		
	    		    errors = record.validate();
	    		    if (errors.isValid()) {
	    		    	for(var i = 0; i < columnIndexes.length; i++){
	    		    		if(Ext.isDefined(columnIndexes[i])){
		    		    		var cell = view.getCellByPosition({row: y, column: i});
		    		    		//paranoic
		    		    		if(Ext.isDefined(cell) && cell != null){
			    		    		cell.removeCls("ae-grid-invalid-cell");
		    		    		}
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
    			title: 'Comptes personnalisables',
    			split: true,
    			region: 'east',
    			forceFit: true,
    			reserveScrollbar: true,
    			width: '40%',
    			stripeRows: true,
    			selModel: 'rowModel',
    			
    			listeners: {
    				itemdblclick: 'onPatternDblClick',
    				itemcontextmenu: 'onPatternContextMenu'
    			},
    			
    			store: new MaParoisse.store.AccountArr({
    				storeId: 'patternStore'
    			}),
    			
    			itemId: 'patternGrid',
    			
    			columns: [{
    				header: 'Compte modèle',
    				dataIndex: 'code'
    			}, {
    				header: 'Nom',
    				dataIndex: 'name'
    			}, {
    				header: 'Description',
    				dataIndex: 'description'
    			}]
    		}]
		};
		
		Ext.apply(this, config);
		this.callParent(arguments);
	},
	
	//TODO: Implement isSafeToClose function depending on module requirements
	isSafeToClose: function(callback){
		var deletedAccounts = this.getController().deletedAccounts,
		ds = this.getComponent('accountsGrid').getStore(),
		safeToClose = true;	
		
		var form = this.getComponent('COAAttributesForm').getForm();
		if(form.isDirty()){
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