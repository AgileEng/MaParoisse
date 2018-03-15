Ext.define('MaParoisse.view.util.ParoisseSelectionWindow', {
	extend: 'Ext.window.Window',
	
	statics: {
		SELECT: 10,
		TEMPLATE: 20
	},
	
	mode: null,
	callback: null,
	
	initComponent: function(){
		var config = {
				title: 'Choisir',
				autoDestroy: true,
				modal: true,
				layout: 'fit',
				width: 700,
				height: 391,
				tbar: ['->',{
					xtype: 'textfield',
					enableKeyEvents: true,
					emptyText: 'Rechercher',
					listeners: {
						scope: this,
						keyup: {
							fn: function(field, e, eOpts){
								field.up('window').down('grid').getStore().filterBy(function (record) {
									var searchValue = field.getValue().toUpperCase();
									if (searchValue.length == 0) {
										return true;
									} else if (
										record.get('code').toUpperCase().indexOf(searchValue) > -1 ||
										record.get('name').toUpperCase().indexOf(searchValue) > -1 ||
										record.get('postCode').toUpperCase().indexOf(searchValue) > -1 ||
										record.get('town').toUpperCase().indexOf(searchValue) > -1
									) {
										return true;
									} else {
										return false;
									}
								});
							}
						}
					}
				}],
				items:[{
					xtype: 'gridpanel',
					hideHeaders: true,
					rowLines: false,
					allowDeselect: true,
					viewConfig: {
						stripeRows: false
					},
					columns: [{
						dataIndex: 'code',
						flex: 1.5,
						renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
							return '<p style="font-size: 10px; color: #4390DF; margin: 1px 2px 2px 2px;">KParois</p><p style="margin: 0px 2px 1px 2px;">' + value + '</p>';
						}
					}, {
						dataIndex: 'name',
						flex: 4,
						renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
							return '<p style="font-size: 10px; color: #4390DF; margin: 1px 2px 2px 2px;">Nom</p><p style="margin: 0px 2px 1px 2px;">' + value + '</p>';
						}
					}, {
						dataIndex: 'postCode',
						flex: 1,
						renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
							if(Ext.isDefined(value) && value != ''){
								return '<p style="font-size: 10px; color: #4390DF; margin: 1px 2px 2px 2px;">Code postal</p><p style="margin: 0px 2px 1px 2px;">' + value + '</p>';
							}
						}
					}, {
						dataIndex: 'town',
						flex: 2,
						renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
							if(Ext.isDefined(value) && value != ''){
								return '<p style="font-size: 10px; color: #4390DF; margin: 1px 2px 2px 2px;">Ville</p><p style="margin: 0px 2px 1px 2px;">' + value + '</p>';
							} else return '';
						}
					}],
					store: new MaParoisse.store.util.CustomerArr(),
					bbar: ['->', {
						text: 'Ok',
						handler: function(btn){
							var win = btn.up('window');
							var comp = win.down('grid').getSelectionModel().getSelection()[0];
							win.onCustomerChosen(comp);
						}
					}],
					listeners: {
						scope: this,
						rowdblclick: function(table, record, tr, rowIndex, e, eOpts){
							if(Ext.isDefined(record)){
								var win = table.up('window');
								win.onCustomerChosen(record);
							}
						},
						afterrender: function(grid){
							var win = grid.up('window');
							if(win.mode == win.self.SELECT){
								grid.getStore().loadData(AccBureau.Context.principal.data.companies);
							} else if(win.mode == win.self.TEMPLATE){
								var req = Ext.create('MaParoisse.lib.JsonRPC', {
									url: '/PartyServlet',
						    	    service_type: 'PartyService',
						    	    listeners: {
						    	    	success: function () {
					    	    			grid.getStore().loadData(arguments[0].BODY.organizationTemplates);
						    	    	},
						    	    	error: function () {
						    	    		
					    	    		}
					    	    	}
								});
								
								req.request({
									method: 'loadTemplates',
									params: {}
								});
							}
						}
					}
				}]
		};
		Ext.apply(this, config);
		this.callParent(arguments);
	},
	
	onCustomerChosen: function(customer){
		if(Ext.isDefined(customer)){
			if(this.mode == this.self.SELECT){
//				MaParoisse.app.getController('Root').setTenant(customer);
				this.callback(customer);
				this.close();
			} else if(this.mode == this.self.TEMPLATE) {
				this.callback(customer);
				this.close();
			}
		}
	}
});