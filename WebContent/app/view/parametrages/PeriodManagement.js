
Ext.define("MaParoisse.view.parametrages.PeriodManagement",{
    "extend": "Ext.panel.Panel",
    requires: ['MaParoisse.model.AccPeriod'],
    "controller": "parametrages-periodmanagement", 

    initComponent: function(){
    	var me = this;
    	var config = {
			region: 'center',
			layout: 'border',
			header: false,
			listeners: {
				scope: 'controller',
				render: 'onRender',
				tenantChange: 'onTenantChanged'
			},
			items:[{
				xtype: 'grid',
				itemId: 'periodGrid',
				region: 'west',
				title: 'Clôture de l’exercice',
				//split: true,
				width: '50%',
				forceFit: true,
				reserveScrollbar: true,
				listeners: {
					selectionchange: 'onPeriodGridSelChange'
				},
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					itemId: 'topTbar',
					items: [{
				    	icon: null,
						glyph: 'xe046@iconFont',
						itemId: 'closePeriodBtn',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Clôturer l’exercice',
				        handler: 'onPeriodCloseClick',
				        disabled: true
				    }, {
				    	icon: null,
						glyph: 'xe047@iconFont',
						itemId: 'openPeriodBtn',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Annulation de cloture',
				        handler: 'onPeriodOpenClick',
				        disabled: true
				    }, {
						icon: null,
						glyph: 'xe021@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Etats annuels', //changed from "Etats Archevêché" to "Etats annuels" Update 11.2019
				        handler: 'onPrintClicked'
				    }, {
						icon: null,
						glyph: 'xe021@iconFont',
						baseCls: 'ae-ext-button-small-icon',
				        scale: 'small',
				        iconAlign: 'top',
				        text: 'Autres états/Journaux',
				        handler: 'onPrintReportsClicked'
				    }]
				}],
				store: new Ext.data.Store({
					model: 'MaParoisse.model.AccPeriod',
					autoDestroy: true
				}),
				columns:[{
					header: '',
					dataIndex: 'closed',
					renderer: 'periodStateRenderer',
					flex: 1
				}, {
					header: 'Du',
					dataIndex: 'startDate',
					xtype: 'datecolumn',
					flex: 3
				}, {
					header: 'Au',
					dataIndex: 'endDate',
					xtype: 'datecolumn',
					flex: 3
				}]
			}, {
				xtype: 'panel',
				title: '&nbsp;',
				region: 'center',
				tbar:[' '],
			}]
    	};
    	
    	Ext.apply(me, config);
    	me.callParent(arguments);
    },
    
    isSafeToClose: function(callback){
    	return true;
    }
});
