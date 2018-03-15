Ext.define("MaParoisse.view.gerer.BudgetRealisation",{
	requires : ['MaParoisse.model.BudgetRealisationItem'],
    "extend": "Ext.panel.Panel",
    "controller": "gerer-budgetrealisation",
    
    initComponent: function(){
    	var me = this;
    	
    	var	config = {
    			title: 'Le réalisé - le budget',
    			layout: 'border',
    			region: 'center',
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
    			    }, '->', {
    					icon: null,
    					glyph: 'xe021@iconFont',
    					baseCls: 'ae-ext-button-small-icon',
    			        scale: 'small',
    			        iconAlign: 'top',
    			        text: 'Imprimer',
    			        btnId: 'expenseBtn',
    			        handler: 'onPrintBudgetClicked'
    			    }/*, {
    					icon: null,
    					glyph: 'xe021@iconFont',
    					baseCls: 'ae-ext-button-small-icon',
    			        scale: 'small',
    			        iconAlign: 'top',
    			        text: 'Imprimer produits',
    			        btnId: 'incomeBtn',
    			        handler: 'onPrintBudgetClicked'
    			    }*/]
    		    }],
    			items: [{
    				xtype: 'container',
    				region: 'center',
    				layout: 'border',
    				itemId: 'centerContainer',
    				items: [{
    					itemId: 'expenseColumn',
    					//columnWidth: 0.5,
    					layout: 'fit',
    					region: 'west',
    					width: '49%',
    					split: true,
    					items: [{
            				xtype: 'grid',
            				title: 'Charge',
            				itemId: 'expenseGrid',
            				columnLines: true,
            				/*tools: [{
            					type: 'print',
            					callback: me.getController().onPrintBudgetClicked
            				}],*/
            				autoScroll: true,
        					reserveScrollbar: true,
        					forceFit: true,
        					bufferedRenderer: false,
        					componentCls: 'ae-grouping-grid',
        					features: [{
        						ftype: 'groupingsummary',
        						id: 'grSummary',
        						collapsible: false,
        						enableGroupingMenu: false,
        						enableNoGroups: false,
        						showSummaryRow: true,
        						groupHeaderTpl: [
        			                 '<div style="background-color: #f0f0f0;">{name:this.formatName}</div>',
        			                 {
        			                	 formatName: function(accountGrouper) {
        			                		 return accountGrouper;
        			                	 }
        			                 }
        		                ]
        					}],
            				store: new Ext.data.Store({
            					model: 'MaParoisse.model.BudgetRealisationItem',
            					autoDestroy: true,
            					groupField: 'accountGrouper'
            				}),
            				columns: [{
            					header: 'Compte',
            					dataIndex: 'code',
            					renderer: 'compteRenderer',
            					flex: .3,
            					summaryType: 'sum',
        			            summaryRenderer: function(value, summaryData, dataIndex) {
        			                return '<div style="text-align: right; font-weight: bold;">Total</div>';
        			            }
            				}, {
            					header: 'Prévisionnel',
            					dataIndex: 'budgetAmount',
            					align: 'right',
            					renderer: 'frAmountRenderer',
            					summaryType: function(records){
            						var sum = 0;
            						for(var i = 0; i < records.length; i++){
            							sum+=Number(records[i].get('budgetAmount'));
            						}
            						return sum;
            					},
        			            summaryRenderer: function(value, summaryData, dataIndex) {
        			                return '<div style="text-align: right; font-weight: bold;">' + Ext.util.Format.currency(value) + '</div>';
        			            },
            					flex: .2
            				}, {
            					header: 'Réalisé',
            					dataIndex: 'realAmount',
            					align: 'right',
            					renderer: 'frAmountRenderer',
            					summaryType: function(records){
            						var sum = 0;
            						for(var i = 0; i < records.length; i++){
            							sum+=Number(records[i].get('realAmount'));
            						}
            						return sum;
            					},
        			            summaryRenderer: function(value, summaryData, dataIndex) {
        			                return '<div style="text-align: right; font-weight: bold;">' + Ext.util.Format.currency(value) + '</div>';
        			            },
            					flex: .2
            				}, {
            					header: 'Différence',
            					dataIndex: 'diffAmount',
            					align: 'right',
            					renderer: 'frAmountRenderer',
            					summaryType: function(records){
            						var sum = 0;
            						for(var i = 0; i < records.length; i++){
            							sum+=Number(records[i].get('diffAmount'));
            						}
            						return sum;
            					},
        			            summaryRenderer: function(value, summaryData, dataIndex) {
        			                return '<div style="text-align: right; font-weight: bold;">' + Ext.util.Format.currency(value) + '</div>';
        			            },
            					flex: .2
            				}, {
            					header: '%',
            					dataIndex: 'diffPercent',
            					align: 'right',
            					renderer: 'frAmountRenderer',
            					flex: .1,
            					summaryType: function(records){
            						var realAmountSum = 0.0;
            						var budgetAmountSum = 0.0;
            						
            						for (var i = 0; i < records.length; i++){
            							realAmountSum+=Number(records[i].get('realAmount'));
            							budgetAmountSum+=Number(records[i].get('budgetAmount'));
            						}
            						
            						//var diffAmount = realAmountSum - budgetAmountSum;
            					    var diffPercent = budgetAmountSum != 0.0 ? realAmountSum/budgetAmountSum * 100.0 : 0.0;
            					    
            					    return diffPercent;
            					},
            					summaryRenderer: function(value, summaryData, dataIndex) {
        			                return '<div style="text-align: right; font-weight: bold;">' + Ext.util.Format.currency(value) + '</div>';
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
            				title: 'Produit',
            				itemId: 'incomeGrid',
            				columnLines: true,
            				autoScroll: true,
        					reserveScrollbar: true,
        					forceFit: true,
        					bufferedRenderer: false,
        					componentCls: 'ae-grouping-grid',
        					features: [{
        						ftype: 'groupingsummary',
        						id: 'grSummary',
        						collapsible: false,
        						enableGroupingMenu: false,
        						enableNoGroups: false,
        						showSummaryRow: true,
        						groupHeaderTpl: [
        			                 '<div style="background-color: #f0f0f0;">{name:this.formatName}</div>',
        			                 {
        			                	 formatName: function(accountGrouper) {
        			                		 return accountGrouper;
        			                	 }
        			                 }
        		                ]
        					}],
        					store: new Ext.data.Store({
            					model: 'MaParoisse.model.BudgetRealisationItem',
            					autoDestroy: true,
            					groupField: 'accountGrouper'
            				}),
            				columns: [{
            					header: 'Compte',
            					dataIndex: 'code',
            					renderer: 'compteRenderer',
            					summaryType: 'sum',
        			            summaryRenderer: function(value, summaryData, dataIndex) {
        			                return '<div style="text-align: right; font-weight: bold;">Total</div>';
        			            },
            					flex: .3
            				}, {
            					header: 'Prévisionnel',
            					dataIndex: 'budgetAmount',
            					align: 'right',
            					renderer: 'frAmountRenderer',
            					summaryType: function(records){
            						var sum = 0;
            						for(var i = 0; i < records.length; i++){
            							sum+=Number(records[i].get('budgetAmount'));
            						}
            						return sum;
            					},
        			            summaryRenderer: function(value, summaryData, dataIndex) {
        			                return '<div style="text-align: right; font-weight: bold;">' + Ext.util.Format.currency(value) + '</div>';
        			            },
            					flex: .2
            				}, {
            					header: 'Réalisé',
            					dataIndex: 'realAmount',
            					align: 'right',
            					renderer: 'frAmountRenderer',
            					summaryType: function(records){
            						var sum = 0;
            						for(var i = 0; i < records.length; i++){
            							sum+=Number(records[i].get('realAmount'));
            						}
            						return sum;
            					},
        			            summaryRenderer: function(value, summaryData, dataIndex) {
        			                return '<div style="text-align: right; font-weight: bold;">' + Ext.util.Format.currency(value) + '</div>';
        			            },
            					flex: .2
            				}, {
            					header: 'Différence',
            					dataIndex: 'diffAmount',
            					align: 'right',
            					renderer: 'frAmountRenderer',
            					summaryType: function(records){
            						var sum = 0;
            						for(var i = 0; i < records.length; i++){
            							sum+=Number(records[i].get('diffAmount'));
            						}
            						return sum;
            					},
        			            summaryRenderer: function(value, summaryData, dataIndex) {
        			                return '<div style="text-align: right; font-weight: bold;">' + Ext.util.Format.currency(value) + '</div>';
        			            },
            					flex: .2
            				}, {
            					header: '%',
            					dataIndex: 'diffPercent',
            					renderer: 'frAmountRenderer',
            					align: 'right',
            					flex: .1,
            					summaryType: function(records){
            						var realAmountSum = 0.0;
            						var budgetAmountSum = 0.0;
            						
            						for (var i = 0; i < records.length; i++){
            							realAmountSum+=Number(records[i].get('realAmount'));
            							budgetAmountSum+=Number(records[i].get('budgetAmount'));
            						}
            						
            						//var diffAmount = realAmountSum - budgetAmountSum;
            					    var diffPercent = budgetAmountSum != 0.0 ? realAmountSum/budgetAmountSum * 100.0 : 0.0;
            					    
            					    return diffPercent;
            					},
            					summaryRenderer: function(value, summaryData, dataIndex) {
        			                return '<div style="text-align: right; font-weight: bold;">' + Ext.util.Format.currency(value) + '</div>';
        			            }
            				}]
            			}]
    				}]
    			}]
    	};
    	
    	Ext.apply(me, config);
    	me.callParent(arguments);
    },
    
    isSafeToClose: function(){
    	return true;
    }
});
