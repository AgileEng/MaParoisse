
Ext.define("MaParoisse.view.receipts.Donation",{
    "extend": "Ext.panel.Panel",
    requires: ['MaParoisse.view.receipts.DonationController', 'MaParoisse.model.Donation'],
    "controller": "receipts-donation",
    
    region: 'center',
    
    initComponent: function(){
    	var me = this,
    		config = {
    			title: 'Table des dons annuels',
    			listeners: {
    				scope: 'controller',
    				render: 'onRender',
    				tenantChange: 'onTenantChange'
    			},
    			layout: 'border',
    			items: [{
    				xtype: 'grid',
    				title: 'Dons',
    				region: 'north',
    				itemId: 'donationGrid',
    				height: '70%',
    				split: true,
    				tbar: {
    					itemId: 'topToolbar',
    					items: [{
        					icon: null,
        					glyph: 'xe170@iconFont',
        					baseCls: 'ae-ext-button-small-icon',
        			        scale: 'small',
        			        iconAlign: 'top',
        			        text: 'Enregistrer',
        			        handler: 'onSaveDonationsClicked'
        			    }, '->', {
    				    	xtype: 'textfield',
    				    	emptyText: 'Rechercher',
    				    	enableKeyEvents: true,
    				    	listeners: {
    				    		keyup: 'onSearchFieldKeyUp'
    				    	}
    				    }, '-', {
    						xtype: 'numberfield',
    						itemId: 'yearField',
    						fieldLabel: 'Année',
    						labelWidth: 55,
    						name: 'year',
    						minValue: 2000,
    						maxValue: 2030,
    						step: 1,
    						//value: new Date().getFullYear(),
    						//editable: false,
    						//hideTrigger: true,
    						allowDecimals: false,
    						listeners: {
    							change: 'onYearChange'
    						}
    					}, {
    						itemId: 'totalAcc',
    						fieldLabel: 'Comptabilité',
    						labelWidth: 70,
    						width: 200,
    						editable: false,
    						xtype: 'numericfield',
							alwaysDisplayDecimals: true,
							decimalSeparator: ',',
							thousandSeparator: ' ',
							decimalPrecision: 2,
							hideTrigger: true,
							keyNavEnabled: false,
							mouseWheelEnabled: false,
							fieldStyle: 'text-align: right;'
    					}, {
    						itemId: 'totalDons',
    						fieldLabel: 'Distribué',
    						labelWidth: 70,
    						width: 200,
    						editable: false,
    						xtype: 'numericfield',
							alwaysDisplayDecimals: true,
							decimalSeparator: ',',
							thousandSeparator: ' ',
							decimalPrecision: 2,
							hideTrigger: true,
							keyNavEnabled: false,
							mouseWheelEnabled: false,
							fieldStyle: 'text-align: right;'
    					}, {
    						itemId: 'diff',
    						fieldLabel: 'Différence',
    						labelWidth: 60,
    						width: 200,
    						editable: false,
    						xtype: 'numericfield',
							alwaysDisplayDecimals: true,
							decimalSeparator: ',',
							thousandSeparator: ' ',
							decimalPrecision: 2,
							hideTrigger: true,
							keyNavEnabled: false,
							mouseWheelEnabled: false,
							fieldStyle: 'text-align: right;'
    					}]
    				},
    				forceFit: true,
    				reserveScrollbar: true,
    				plugins: [{
    					ptype: 'cellediting',
    					pluginId: 'amountEditing',
    					clicksToEdit: 1,
    					listeners: {
							edit: 'onEditAmountCompleted'
						}
    				}],
    				columns: [{
						header: 'Donateur',
						flex: .6,
						dataIndex: 'employeeLastName',
						renderer: 'contributorRenderer'
					}, {
        				header: 'Montants reconnus',
        				flex: .1,
        				align: 'right',
        				dataIndex: 'amountAcc',
        				renderer: function(value){
		                	return Ext.util.Format.currency(value);
		                }
        			}, {
        				header: 'Corrections à apporter',
        				flex: .1,
        				align: 'right',
        				dataIndex: 'amountChange',
        				renderer: function(value){
		                	return Ext.util.Format.currency(value);
		                },
        				editor: {
							xtype: 'numericfield',
							alwaysDisplayDecimals: true,
							selectOnFocus: true,
							decimalSeparator: ',',
							thousandSeparator: ' ',
							decimalPrecision: 2,
							hideTrigger: true,
							keyNavEnabled: false,
							mouseWheelEnabled: false
		                }
        			}, {
        				header: 'Montants corrigés',
        				flex: .1,
        				align: 'right',
        				dataIndex: 'amountEnd',
        				renderer: function(value){
		                	return Ext.util.Format.currency(value);
		                }
        			}],
        			store: Ext.create('Ext.data.Store', {
        				model: 'MaParoisse.model.Donation',
        				autoDestroy: true
        			})
    			}, {
    				xtype: 'grid',
    				region: 'center',
    				itemId: 'accountingGrid',
    				title: 'Comptabilité',
    				forceFit: true,
    				reserveScrollbar: true,
    				columns: [{
    					header: 'Compte',
    					flex: .2,
    					dataIndex: 'account',
    					renderer: 'accountRenderer'
    				}, {
						header: 'Donateur',
						flex: .5,
						dataIndex: 'contributor',
						renderer: 'contributorRenderer'
					}, {
        				header: 'Montant',
        				flex: .1,
        				align: 'right',
        				renderer: function(value){
		                	return Ext.util.Format.currency(value);
		                },
        				dataIndex: 'amount'
        			}],
        			store: Ext.create('Ext.data.Store', {
        				model: 'MaParoisse.model.Donation',
        				autoDestroy: true,
        				sorters: [{
        					property: 'id',
        					direction: 'ASC'
        				}]
        			})
    			}]
    	};
    	
    	Ext.apply(me, config);
    	me.callParent(arguments);
    },
    
    isSafeToClose: function(){
    	//TODO: 
    	return true;
    }
});
