
Ext.define("MaParoisse.view.parametrages.Engagements",{
    "extend": "Ext.tab.Panel",
    requires: ['MaParoisse.model.Engagement', 'MaParoisse.model.Titre'],
    "controller": "parametrages-engagements",
    
    region: 'center',
    
    deletedEngagements: [],
    deletedTitres: [],
    
    initComponent: function(){
    	var me = this;
    	var config = {
    			header: false,
    			listeners: {
    				scope: 'controller',
    				render: 'onRender',
    				tenantChange: 'onTenantChange',
    				beforeclose: 'onBeforeClose'
    			},
    			dockedItems: [{
    				xtype: 'toolbar',
    				itemId: 'topTbar',
    				dock: 'top',
    				items: [{
    					xtype: 'numberfield',
    					itemId: 'yearField',
    					fieldLabel: 'Année',
    					mouseWheelEnabled: false,
    					labelWidth: 40,
    					minValue: 2000,
    					maxValue: 2030,
    					//value: new Date().getFullYear(),
    					step: 1,
    					allowDecimals: false,
    					name: 'year',
    					allowBlank: false,
    					listeners: {
    						change: 'onYearChange'
    					}
    			    }]
    			}],
    			items: [{
    				xtype: 'grid',
    				itemId: 'engagementsGrid',
    				title: 'Engagements',
    				tbar: [{
    					icon: null,
    					glyph: 'xe170@iconFont',
    					baseCls: 'ae-ext-button-small-icon',
    			        scale: 'small',
    			        iconAlign: 'top',
    			        text: 'Enregistrer',
    			        handler: 'onSaveEngClicked'
    			    }, '-', {
				    	icon: null,
						glyph: 'xe08c@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Ajouter',
				        handler: 'onAddEngClicked'
				    }, {
				    	icon: null,
						glyph: 'xe059@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Supprimer',
				        handler: 'onDeleteEngClicked'
				    }, '-', {
						icon: null,
						glyph: 'xe021@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Imprimer',
				        btnId: 'expenseBtn',
				        handler: 'onPrintClicked'
				    }],
				    plugins: [{
				    	ptype: 'cellediting',
				    	clicksToEdit: 1,
				    	pluginId: 'engagementsEditing'
				    }],
				    store: Ext.create('Ext.data.Store', {
				    	autoDestroy: true,
				    	model: 'MaParoisse.model.Engagement'
				    }),
				    forceFit: true,
				    reserveScrollbar: true,
				    columns: [{
				    	header: 'Nom de l\'organisme financier',
				    	dataIndex: 'name',
				    	editor: {
				    		xtype: 'textfield',
				    		maxLength: 35,
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
				    	},
				    	flex: 5
				    }, {
				    	header: 'Montant initial emprunté',
				    	dataIndex: 'amountInitial',
				    	align: 'right',
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
						},
				    	flex: 2
				    }, {
				    	header: 'Date du prêt',
				    	dataIndex: 'date',
				    	xtype: 'datecolumn',
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
				    	},
				    	flex: 1.5
				    }, {
				    	header: 'Durée du prêt',
				    	dataIndex: 'duration',
				    	editor: {
				    		xtype: 'textfield',
				    		maskRe: /[0-9]/,
					    	maxLength: 3,
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
				    	},
				    	flex: 1.5
				    }, {
				    	header: 'Montant échéance annuelle',
				    	dataIndex: 'amountDueYearly',
				    	align: 'right',
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
						},
						flex: 2
				    }, {
				    	header: 'Montant échéance mensuelle',
				    	dataIndex: 'amountDueMonthly',
				    	align: 'right',
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
						},
						flex: 2
				    }]
    			}, {
    				xtype: 'grid',
    				itemId: 'titresGrid',
    				title: 'Titres',
    				tbar: [{
    					icon: null,
    					glyph: 'xe170@iconFont',
    					baseCls: 'ae-ext-button-small-icon',
    			        scale: 'small',
    			        iconAlign: 'top',
    			        text: 'Enregistrer',
    			        handler: 'onSaveTitreClicked'
    			    }, '-', {
				    	icon: null,
						glyph: 'xe08c@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Ajouter',
				        handler: 'onAddTitreClicked'
				    }, {
				    	icon: null,
						glyph: 'xe059@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Supprimer',
				        handler: 'onDeleteTitreClicked'
				    }],
				    plugins: [{
				    	ptype: 'cellediting',
				    	clicksToEdit: 1,
				    	pluginId: 'titreEditing'
				    }],
				    store: Ext.create('Ext.data.Store', {
				    	autoDestroy: true,
				    	model: 'MaParoisse.model.Titre'
				    }),
				    forceFit: true,
				    reserveScrollbar: true,
				    columns: [{
				    	header: 'Dénomination des Titres',
				    	dataIndex: 'description',
				    	editor: {
				    		xtype: 'textfield',
				    		maxLength: 35,
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
				    	},
				    	flex: .7
				    }, {
				    	header: 'Quantité',
				    	dataIndex: 'qty',
				    	editor: {
				    		xtype: 'textfield',
				    		maskRe: /[0-9]/,
				    		maxLength: 12,
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
				    	},
				    	flex: .2
				    }, {
				    	header: 'Prix de revient / Prix d\'acquisition',
				    	dataIndex: 'price',
				    	align: 'right',
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
						},
						flex: .1
				    }]
    			}]
    	};
    	
    	Ext.apply(me, config);
    	me.callParent(arguments);
    },
    
    isSafeToClose: function(callback){
    	var safeToClose = this.getController().isSafeToClose();
    	
    	if(callback){
    		callback();
    	}
    	
    	return safeToClose;
    }
});
