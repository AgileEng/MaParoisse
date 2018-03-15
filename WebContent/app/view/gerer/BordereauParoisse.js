
Ext.define("MaParoisse.view.gerer.BordereauParoisse",{
    "extend": "Ext.grid.Panel",
    "controller": "gerer-bordereauparoisse",
    requires:['MaParoisse.model.BordereauParoisseItem'],
    
    region: 'center',
    
    initComponent: function(){
    	var me = this,
    		config = {
    		title: 'BORDEREAU DES SOMMES REVERSEES A L’ARCHEVECHE AU TITRE DE L’ANNEE',
    		reserveScrollbar: true,
    		forceFit: true,
    		sortableColumns: false,
    		viewConfig:{
    			stripeRows: true
    		},
    		tbar: [{
				icon: null,
				glyph: 'xe170@iconFont',
				baseCls: 'ae-ext-button-small-icon',
		        scale: 'small',
		        iconAlign: 'top',
		        text: 'Enregistrer',
		        handler: 'onSaveClicked',
		        itemId: 'saveBtn',
		        disabled: true
		    }, {
				icon: null,
				glyph: 'xe001@iconFont',
				baseCls: 'ae-ext-button-small-icon',
		        scale: 'small',
		        iconAlign: 'top',
		        text: 'Générer document',
		        handler: 'onGenerateClicked',
		        itemId: 'generateBtn'
		    }, '-', {
				xtype: 'numberfield',
				itemId: 'yearField',
				fieldLabel: 'Année',
				mouseWheelEnabled: false,
				labelWidth: 40,
				minValue: 2000,
				maxValue: 2030,
				//value: new Date().getFullYear(),
				step: 1,
				editable: false,
				allowDecimals: false,
				allowExponential: false,
				repeatTriggerClick: false,
				name: 'year',
				allowBlank: false,
				listeners: {
					change: 'onYearChange'
				}
		    }],
    		plugins: [{
    			ptype: 'cellediting',
    			pluginId: 'queteEditing',
    			clicksToEdit: 1,
    			listeners: {
    				scope: 'controller',
    				beforeedit: 'beforeEdit',
    				validateedit: 'validateAmountEdit'
    			}
    		}],
    		columns: [{xtype: 'rownumberer'}, {
    			header: 'Type de quête',
    			dataIndex: 'name',
    			flex: 4
    		}, {
    			header: 'Code quête',
    			dataIndex: 'code',
    			flex: 1.5,
    			align: 'center'
    		}, {
    			header: 'Montants de la comptabilité',
    			dataIndex: 'accAmount',
    			renderer: function(value){
                	return Ext.util.Format.currency(value);
                },
                flex: 2,
                align: 'right'
    		}, {
    			header: 'Montants déjà payés',
    			dataIndex: 'paidAmount',
    			renderer: function(value){
    				return Ext.util.Format.currency(value);
    			},
    			flex: 2,
    			align: 'right'
    		}, {
    			header: 'Reste à payer',
    			dataIndex: 'toPayAmount',
    			renderer: function(value){
                	return Ext.util.Format.currency(value);
                },
                flex: 2,
                align: 'right'
    		}, {
    			header: 'Montants du reversement',
    			dataIndex: 'currAmount',
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
    			flex: 2,
    			align: 'right'
    		}],
    		store: Ext.create('Ext.data.Store', {
    			autoDestroy: true,
    			model: 'MaParoisse.model.BordereauParoisseItem'
    		}),
    		listeners: {
    			scope: 'controller',
    			render: 'onRender',
    			tenantChange: 'onTenantChange'
    		}
    	};
    	
    	Ext.apply(me, config);
    	me.callParent(arguments);
    },
    
    isSafeToClose: function(){
    	return !this.getController().hasDirtyRecords();
    }
});
