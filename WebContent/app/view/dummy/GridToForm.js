Ext.define('MaParoisse.view.dummy.GridToForm', {
    extend: 'Ext.container.Container',
    
    requires: [
        'Ext.grid.*',
        'Ext.form.*',
        'Ext.layout.container.HBox',
        'Ext.dd.DropTarget',
        'MaParoisse.model.dummy.Simple'
    ],    
    xtype: 'dd-grid-to-form',
    
    
    width: 750,
    height: 300,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    bodyPadding: 5,
    myData: [
        { name : 'Record 0', column1 : '0', column2 : '0' },
        { name : 'Record 1', column1 : '1', column2 : 1400 },
        { name : 'Record 2', column1 : '2', column2 : 2345.1231 },
        { name : 'Record 3', column1 : '3', column2 : '3' },
        { name : 'Record 4', column1 : '4', column2 : '4' },
        { name : 'Record 5', column1 : '5', column2 : '5' },
        { name : 'Record 6', column1 : '6', column2 : '6' },
        { name : 'Record 7', column1 : '7', column2 : '7' },
        { name : 'Record 8', column1 : '8', column2 : '8' },
        { name : 'Record 9', column1 : '9', column2 : '9' }
    ],
    
    initComponent: function(){
        this.items = [{
            xtype: 'grid',
            width: 400,
            tbar: [{
        	    xtype: 'button',
        	    tooltip: 'Nouveau',
        	    text: 'Nouveau',
        	    glyph: 'xe083@iconFont',
        	    scale: 'small',
        	    iconAlign: 'top',
        	    iconCls: 'ae-ext-button-small-icon',
        	    style: {
        	    	backgroundColor: '#ffffff',
        	    	border: 'none'
        	    },
        	    cls: 'ae-metro-button-small'
            }, {
                xtype: 'button',
                tooltip: 'Supprimer',
                text: 'Supprimer',
                glyph: 'xe059@iconFont',
                scale: 'small',
        	    iconAlign: 'top',
                iconCls: 'ae-ext-button-small-icon',
                style: {
                	backgroundColor: '#ffffff',
                	border: 'none'
                },
                cls: 'ae-metro-button-small'
            }],
            viewConfig: {
                plugins: {
                    ddGroup: 'grid-to-form',
                    ptype: 'gridviewdragdrop',
                    enableDrop: false
                }
            },
            store: new Ext.data.Store({
                model: MaParoisse.model.dummy.Simple,
                data: this.myData
            }),
            columns: [{
                flex:  1,  
                header: 'Record Name', 
                sortable: true, 
                dataIndex: 'name'
            }, {
                header: 'Quantity', 
                width: 110, 
                sortable: true, 
                dataIndex: 'column1'
            }, {
                header: 'Amount', 
                width: 110, 
                sortable: true, 
                dataIndex: 'column2',
                renderer: function(value){
                	return Ext.util.Format.currency(value);
                }
            }],
            enableDragDrop: true,
            width: 325,
            margins: '0 5 0 0',
            title: 'Data Grid',
            tools: [{
                type: 'refresh',
                tooltip: 'Reset example',
                scope: this,
                handler: this.onResetClick
            }],
            selModel: new Ext.selection.RowModel({
                singleSelect : true
            }),
            scope: this,
            listeners: {
            	beforeclose: this.preventDirtyDataLoss,
            	beforedestroy: this.preventDirtyDataLoss
            },
            isSafeToClose: function(cmp){
            	var safeToClose = true;
        		cmp.getStore().each(function(rec){
        			if(rec.dirty){
        				safeToClose = false;
        				return false;
        			}
        		}, cmp);        		
        		return safeToClose;
            }
        }, {
            xtype: 'form',
            flex: 1,
            title: 'Generic Form Panel',
            bodyPadding: 10,
            labelWidth: 100,
            defaultType: 'textfield',
            items: [{
                fieldLabel: 'Record Name',
                name: 'name'
            }, {
                fieldLabel: 'Column 1',
                name: 'column1'
            }, {
                fieldLabel: 'Column 2',
                name: 'column2'
            }]
        }];

        this.callParent();
    },
    
    preventDirtyDataLoss: function(cmp){
    	var closable = this.isSafeToClose(cmp);
		if(!closable){
			Ext.MessageBox.show({
			     title:'Save Changes?',
			     msg: 'You are closing a module that has unsaved changes. Would you like to save your changes?',
			     buttons: Ext.Msg.YESNO,
			     icon: Ext.Msg.WARNING,
			     fn: function(btn){                    
			         if (btn == "no"){
			            //NO              
			        }
			        if (btn == "yes"){
			            //YES           
			        }
			   }                
			});
		}
		return closable;
	},
    
    onResetClick: function(){
        this.down('grid').getStore().loadData(this.myData);
        this.down('form').getForm().reset();
    },
    
    onBoxReady: function(){
        this.callParent(arguments);
        var form = this.down('form'),
            body = form.body;
            
        this.formPanelDropTarget = new Ext.dd.DropTarget(body, {
            ddGroup: 'grid-to-form',
            notifyEnter: function(ddSource, e, data) {
                //Add some flare to invite drop.
                body.stopAnimation();
                body.highlight();
            },
            notifyDrop: function(ddSource, e, data) {
                // Reference the record (single selection) for readability
                var selectedRecord = ddSource.dragData.records[0];

                // Load the record into the form
                form.getForm().loadRecord(selectedRecord);

                // Delete record from the source store.  not really required.
                ddSource.view.store.remove(selectedRecord);
                return true;
            }
        });
    },
    
    beforeDestroy: function(){
        var target = this.formPanelDropTarget;
        if (target) {
            target.unreg();
            this.formPanelDropTarget = null;
        }
        this.callParent();
    }
});