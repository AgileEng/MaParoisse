Ext.define("MaParoisse.view.parametrages.AccInitialBalance",{
    "extend": "Ext.grid.Panel",
    requires: ['MaParoisse.model.AccountBalance'],
    "controller": "parametrages-accinitialbalance",
    
    region: 'center',
    
    initComponent: function(){
    	var me = this;
    	var config = {
			title: 'A NOUVEAUX',
			reserveScrollbar: true,
			listeners: {
				scope: 'controller',
				render: 'onRender',
				tenantChange: 'onTenantChange'
			},
			tbar: {
				itemId: 'topToolbar',
				items: [{
					icon: null,
					glyph: 'xe170@iconFont',
					baseCls: 'ae-ext-button-small-icon',
			        scale: 'small',
			        iconAlign: 'top',
			        text: 'Enregistrer',
			        handler: 'onSaveAccBalanceClicked'
			    }, ' ', ' ', ' ', {
					xtype: 'datefield',
					itemId: 'dateField',
					fieldLabel: 'Date',
					labelWidth: 40,
					name: 'date',
					allowBlank: false
			    }]
			},
			plugins: [{
				ptype: 'cellediting',
				clicksToEdit: 1,
				pluginId: 'dtCtCellEditing'
			}],
			forceFit: true,
			columns: [{
				header: 'Compte',
				dataIndex: 'code',
				flex: 1
			}, {
				header: 'Nom',
				dataIndex: 'name',
				flex: 2.5
			}, {
				header: 'Description',
				dataIndex: 'description',
				flex: 2.5
			}, {
				header: 'Débit',
				dataIndex: 'dtAmount',
				align: 'right',
				flex: 1,
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
				dataIndex: 'ctAmount',
				align: 'right',
				flex: 1,
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
			}],
			store: Ext.create('Ext.data.Store', {
				model: 'MaParoisse.model.AccountBalance',
				autoDestroy: true
			})
    	};
    	
    	Ext.apply(me, config);
    	me.callParent(arguments);
    },
    
    isSafeToClose: function(){
    	var safeToClose = true,
    		me = this,
    		dateField = me.getDockedComponent('topToolbar').getComponent('dateField');
    	
    	me.getStore().each(function(rec){
    		if (rec.dirty){
    			safeToClose = false;
    			return safeToClose;
    		}
    	});
    	
    	return safeToClose;
    }
});
