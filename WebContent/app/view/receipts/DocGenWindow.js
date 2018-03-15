Ext.define("MaParoisse.view.receipts.DocGenWindow",{
    "extend": "Ext.window.Window",
    "controller": "receipts-docgenwindow",
    
    contributor: null,
    alias: 'widget.docgenwindow',
    yearField: false,
    toDateField: false,
    fromDateField: false,
    period: false,
    accountSpan: false,
    accountFromField: false,
    accountToField: false,
    natureRadioGroup: false,
    cashCaseRadioGroup: false,
    journal: false,
    
    yearValue: new Date().getFullYear(),
    
    submitFunction: function(){},
    
    initComponent: function(){
    	var me = this;
    	
    	formItems = [];
    	
    	if(me.yearField){
    		formItems.push({
				xtype: 'numberfield',
				fieldLabel: 'Année',
				itemId: 'yearField',
				allowBlank: false,
				name: 'year',
				minValue: 2000,
				maxValue: 2030,
				step: 1,
				value: me.yearValue,
				allowDecimals: false
			});
    	}
    	
    	if(me.fromDateField){
    		formItems.push({
    			xtype: 'datefield',
    			itemId: 'fromDateField',
    			allowBlank: false,
    			name: 'fromDate',
    			fieldLabel: 'Date from'
    		});
    	}
    	
    	if(me.toDateField){
    		formItems.push({
    			xtype: 'datefield',
    			itemId: 'toDateField',
    			allowBlank: false,
    			name: 'toDate',
    			fieldLabel: 'Date d’édition'
    		});
    	}
    	
    	if(me.period){
    		formItems.push({
    			xtype: 'container',
    			layout: 'hbox',
    			itemId: 'periodeContainer',
    			defaults: {
    				margin: '0 8 0 0'
    			},
    			items: [{
    				xtype: 'datefield',
    				allowBlank: false,
    				fieldLabel: 'Periode',
    				itemId: 'fromDateField'
    			}, {
    				xtype: 'datefield',
    				allowBlank: false,
    				itemId: 'toDateField'
    			}]
    		});
    	}
    	
    	if(me.accountFromField){
    		formItems.push({
    			xtype: 'textfield',
    			itemId: 'fromAccountField',
    			allowBlank: false,
    			name: 'fromAcc',
    			maxLength: 4,
    			minLength: 4,
    			maskRe: /[0-9]/,
    			fieldLabel: 'Compte start'
    		});
    	}
    	
    	if(me.accountToField){
    		formItems.push({
    			xtype: 'textfield',
    			itemId: 'toAccountField',
    			allowBlank: false,
    			name: 'toAcc',
    			maxLength: 4,
    			minLength: 4,
    			maskRe: /[0-9]/,
    			fieldLabel: 'Compte end'
    		});
    	}
    	
    	if(me.accountSpan){
    		formItems.push({
    			xtype: 'container',
    			layout: 'hbox',
    			itemId: 'accountSpanContainer',
    			margin: '8 0 0 0',
    			defaults: {
    				margin: '0 8 0 0'
    			},
    			items: [{
    				xtype: 'textfield',
    				allowBlank: true,
    				fieldLabel: 'Compte',
    				maxLength: 4,
    				maskRe: /[0-9]/,
    				itemId: 'fromAccCode'
    			}, {
    				xtype: 'textfield',
    				allowBlank: true,
    				maxLength: 4,
    				maskRe: /[0-9]/,
    				itemId: 'toAccCode'
    			}]
    		});
    	}
    	
    	if(me.natureRadioGroup){
    		formItems.push({
    	        xtype: 'radiogroup',
    	        labelAlign: 'top',
    	        itemId: 'radioGr1',
    	        fieldLabel: 'Nature du don',
    	        columns: 2,
    	        vertical: true,
    	        hidden: true,
    	        defaults: {
    	        	margin: '3px 15px 3px 0'
    	        },
    	        listeners: {
    	        	change: 'onRadio1Change'
    	        },
    	        items: [
    	            { boxLabel: 'Numéraire', name: 'rb', inputValue: 10, checked: true, margin: '3px 31px 3px 0'},
    	            { boxLabel: 'Autre', name: 'rb', inputValue: 20}
    	        ]
    	    });
    	}
    	
    	if(me.cashCaseRadioGroup){
    		formItems.push({
    	        xtype: 'radiogroup',
    	        itemId: 'radioGr2',
    	        disabled: false,
    	        fieldLabel: 'En cas de don en numéraire, mode de versement du don',
    	        labelAlign: 'top',
    	        columns: 2,
    	        vertical: true,
    	        hidden: true,
    	        defaults: {
    	        	margin: '3px 15px 3px 0'
    	        },
    	        items: [
    	            { boxLabel: 'Remise d\'espèces', name: 'rb2', inputValue: 10, checked: true},
    	            { boxLabel: 'Chèque', name: 'rb2', inputValue: 20}
    	        ]
    	    });
    	}
    	
    	if(me.journal){
    		formItems.push({
    			xtype: 'combobox',
    			itemId: 'journalField',
    			fieldLabel: 'Journal',
    			margin: '8 0 0 0',
    			allowBlank: false,
    			displayField: 'name',
    			valueField: 'code',
    			forceSelection: true,
    			queryMode: 'local',
    			store: Ext.create('Ext.data.Store', {
    				model: 'MaParoisse.model.util.DomainRecord',
    				autoDestroy: true
    			})
    		});
    	}
    	
    	var config = {
    		title: me.title,
    		width: me.period ? 475 : 450,
    		autoShow: true,
    		modal: true,
    		closeAction: 'destroy',
    		renderTo: Ext.getBody(),
    		listeners: {
    			scope: 'controller',
    			render: 'onRender'
    		},
    		layout: {
    			type: 'vbox',
    			align: 'stretch'
    		},
    		labelWidth: '30%',
    		bodyPadding: '10px 10px 10px 10px',
    		items: formItems,
    	    buttons: [{
    	    	text: 'Générer',
    	    	handler: me.submitFunction
    	    }, {
    	    	text: 'Annuler',
    	    	handler: 'onCancelClicked'
    	    }]
    	};
    	
    	Ext.apply(me, config);
    	me.callParent(arguments);
    }
});
