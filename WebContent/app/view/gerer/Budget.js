Ext.define("MaParoisse.view.gerer.Budget",{
    "extend": "Ext.panel.Panel",
    requires: ['MaParoisse.model.BudgetItem'/*, 'MaParoisse.view.gerer.BudgetController'*/],
    "controller": "gerer-budgetcontroller",
    
    region: 'center',
    layout: 'border',
    title: 'Saisir le budget prévisionnel',
    appModuleCode: null,
    
    initComponent: function(){
    	var me = this;
    	var config = {
			listeners: {
				scope: me.getController(),
				render: 'onRender',
				tenantChange: 'tenantChange'
			},
			dockedItems: [{
		        xtype: 'toolbar',
		        dock: 'top',
		        itemId: 'topTbar',
		        items: [{
					icon: null,
					glyph: 'xe170@iconFont',
					baseCls: 'ae-ext-button-small-icon',
			        scale: 'small',
			        iconAlign: 'top',
			        text: 'Enregistrer',
			        handler: 'onSaveAccBalanceClicked'
			    }, '-', {
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
					name: 'year',
					allowBlank: false,
					listeners: {
						scope: me.getController(),
						change: 'onYearChange'
					}
			    }]
		    }],
			items: [{
				xtype: 'container',
				region: 'center',
				layout: 'border',
				itemId: 'centerContainer',
				items: [{
					itemId: 'expenseColumn',
					layout: 'fit',
					region: 'west',
					width: '49%',
					split: true,
					items: [{
        				xtype: 'grid',
        				title: 'Charges',
        				itemId: 'expenseGrid',
        				autoScroll: true,
    					reserveScrollbar: true,
    					forceFit: true,
    					bufferedRenderer: false,
    					componentCls: 'ae-grouping-grid',
    					plugins: [{
    						ptype: 'cellediting',
    						pluginId: 'budgetexpenseediting',
    						clicksToEdit: 1,
    						listeners: {
    							edit: 'updateTotals'
    						}
    					}],
        				store: new Ext.data.Store({
        					model: 'MaParoisse.model.BudgetItem',
        					autoDestroy: true
        				}),
        				columns: [{
        					header: 'Compte',
        					dataIndex: 'code',
        					flex: 1
        				}, {
        					header: 'Description',
        					dataIndex: 'description',
        					flex: 5
        				}, {
        					header: 'Montant',
        					dataIndex: 'amount',
        					align: 'right',
        					flex: 1.5,
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
        							focus: function(editor){
        								if(editor.selectOnFocus && Ext.browser.is.Firefox){
        									Ext.defer(function() {
        										editor.selectText();
        									}, 1);
        								}
        							}
        						}
        					}
        				}]
        			}]
				},{
					itemId: 'incomeColumn',
					layout: 'fit',
					region: 'center',
					width: '50%',
					split: true,
					items: [{
        				xtype: 'grid',
        				title: 'Produits',
        				itemId: 'incomeGrid',
        				autoScroll: true,
    					reserveScrollbar: true,
    					forceFit: true,
    					bufferedRenderer: false,
    					componentCls: 'ae-grouping-grid',
    					plugins: [{
    						ptype: 'cellediting',
    						pluginId: 'budgetincomeediting',
    						clicksToEdit: 1,
    						listeners: {
    							edit: 'updateTotals'
    						}
    					}],
    					store: new Ext.data.Store({
        					model: 'MaParoisse.model.BudgetItem',
        					autoDestroy: true
        				}),
        				columns: [{
        					header: 'Compte',
        					dataIndex: 'code',
        					flex: 1
        				}, {
        					header: 'Description',
        					dataIndex: 'description',
        					flex: 5
        				}, {
        					header: 'Montant',
        					dataIndex: 'amount',
        					align: 'right',
        					flex: 1.5,
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
        							focus: function(editor){
        								if(editor.selectOnFocus && Ext.browser.is.Firefox){
        									Ext.defer(function() {
        										editor.selectText();
        									}, 1);
        								}
        							}
        						}
        					}
        				}]
        			}]
				}]
			}, {
				xtype: 'container',
				header: 'Totals',
				region: 'south',
				layout: 'fit',
				width: '100%',
				height: '85px',
				style: {
					background: '#ffffff'
				},
				html: '<div style="text-align: right; padding-right: 20px; font-size: 15px; font-weight: 600!important; color: #4390df;"><p id="produitsField" style="margin-top: 2px !important; margin-bottom: 1px !important;">Total produits: 10 000,00 </p><p id="chargesField" style="margin-top: 2px !important; margin-bottom: 1px !important;">Total charges:8 000,00 </p><p id="balanceField" style="font-weight: 700!important; margin-top: 5px !important; margin-bottom: 1px !important;"></p></div>'
			}]
    	};
    	
    	Ext.apply(me, config);
    	me.callParent(arguments);
    },
    
    isSafeToClose: function(){
    	var safeToClose = true;
    		me = this,
    		expenseGrid = me.getComponent('centerContainer').getComponent('expenseColumn').getComponent('expenseGrid');
    		incomeGrid = me.getComponent('centerContainer').getComponent('incomeColumn').getComponent('incomeGrid');
    	
		expenseGrid.getStore().each(function(rec){
    		if (rec.dirty){
    			safeToClose = false;
    			return safeToClose;
    		}
    	});
		
		incomeGrid.getStore().each(function(rec){
    		if (rec.dirty){
    			safeToClose = false;
    			return safeToClose;
    		}
    	});
    	
    	return safeToClose;
    }
});
