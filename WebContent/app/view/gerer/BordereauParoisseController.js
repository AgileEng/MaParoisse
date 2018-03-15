Ext.define('MaParoisse.view.gerer.BordereauParoisseController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.gerer-bordereauparoisse',
    
    currentYear: null,
    modifiable: false,
    
    onRender: function(){
    	Ext.apply(Ext.util.Format, {
            thousandSeparator: ' ',
            decimalSeparator: ',',
            currencySign: ' ',
            dateFormat: 'd/m/Y'
        });
    	
    	this.loadInitialData();
    },
    
    getTopToolbar: function(){
    	return this.getView().getDockedItems('toolbar[dock="top"]')[0];
    },
    
    getYearField: function(){
    	return this.getTopToolbar().getComponent('yearField');
    },
    
    getSaveButton: function(){
    	return this.getTopToolbar().getComponent('saveBtn');
    },
    
    getGenerateButton: function(){
    	return this.getTopToolbar().getComponent('generateBtn');
    },
    
    loadInitialData: function(year){
    	var me = this,
    		params = {
    			ownerId: AccBureau.Context.principal.data.compId
    	};
    	
    	if(Ext.isDefined(year)){
    		params.year = year;
    	}
    	
    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/Accounting',
			service_type: 'AccService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					if(Ext.isDefined(year)){
						me.resetView();
					}
					me.doLoadInitialData(resp.year, resp.quetes, resp.modifiable);
				},
				error: function () {
					if(Ext.isDefined(year)){
						var yField = me.getYearField();
						yField.suspendEvent('change');
						yField.setValue(me.currentYear);
						yField.resumeEvent('change');
					}
				}
			}
		});
		
		req.request({
			method: 'loadBordereauParoisse',
			params: params
		});
    },
    
    doLoadInitialData: function(year, quetes, modifiable){
    	if(modifiable){
    		this.modifiable = true;
    		this.getSaveButton().setDisabled(false);
    	}
    	this.currentYear = year;
    	
    	var yField = this.getYearField();
    	yField.suspendEvent('change');
    	yField.setValue(this.currentYear);
    	yField.resumeEvent('change');
    	
    	this.getView().getStore().loadData(quetes);
    },
    
    onSaveClicked: function(){
    	var me = this,
    		quetes = [];
    	
    	me.getView().getStore().each(function(rec){
    		quetes.push(rec.getDataObjectExt());
    	});
		
		var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/Accounting',
			service_type: 'AccService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					me.doLoadInitialData(resp.year, resp.quetes, resp.modifiable);
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'saveBordereauParoisse',
			params: {
				ownerId: AccBureau.Context.principal.data.compId,
				year: me.currentYear,
				quetes: quetes
			}
		});
    },
    
    onGenerateClicked: function(){
    	if(this.hasDirtyRecords()){
    		MaParoisse.plugin.notification.showError('Vous devez sauvegarder votre saisie, avant de générer le document.','Erreur');
    	} else {
	    	window.open(
					'../CefraForm?number=bordereau_paroisses&ownerId=' + AccBureau.Context.principal.data.compId
					+ '&year=' + this.currentYear,
					'_Print');
	    	// this.loadInitialData(this.currentYear);
	    	this.resetView();
	    	window.history.back();
    	}
    },
    
    onYearChange: function(field, newValue, oldValue, eOpts){
    	var me = this; 
    	
    	if(!me.hasDirtyRecords()){
    		me.loadInitialData(newValue);
    	} else {
    		Ext.create('MaParoisse.lib.MessageBox', {
    			//header: false,
    			title: 'Zachée',
    			formHeight: 140,
    			message: 'Vous vous apprêtez à quitter ce module sans sauvegarder. Les données saisies seront perdues. <br/><br/>Etes vous sur de vouloir poursuivre?',
    			type: MaParoisse.lib.MessageBox.QUESTION,
    			callback: {
    				fn: function(btnId){
		            	if(btnId == MaParoisse.lib.MessageBox.YES){
		            		me.loadInitialData(newValue);
		            	} else {
		            		field.suspendEvent('change');
		            		field.setValue(me.currentYear);
		            		field.resumeEvent('change');
		            	}
    				}
    			}
    		});
    	}
    },
    
    beforeEdit: function(editor, context, eOpts){
    	if(!this.modifiable){
    		return false;
    	}
    },
    
    /*
     * context : Object
		
		An editing context event with the following properties:
		
		    grid : Ext.grid.Panel
		    The owning grid Panel.
		    
		    record : Ext.data.Model
		    The record being edited.
		    
		    field : String
		    The name of the field being edited.
		    
		    value : Mixed
		    The field's current value.
		    
		    row : HTMLElement
		    The grid row element.
		    
		    column : Ext.grid.column.Column
		    The Ext.grid.column.Column Column} being edited.
		    
		    rowIdx : Number
		    The index of the row being edited.
		    
		    colIdx : Number
		    The index of the column being edited.
		    
		    cancel : Boolean
		    Set this to true to cancel the edit or return false from your handler.

     */
    validateAmountEdit: function(editor, context, eOpts){
    	
    	if(context.field === 'currAmount' && context.record.get('toPayAmount') < context.value){
    		var prevValue = context.record.get(context.field);
			Ext.create('MaParoisse.lib.MessageBox', {
    			title: 'Zachée',
    			formHeight: 140,
    			message: 'Attention le total des montants que vous allez declarer pour le code ' + context.record.get('code') + ' est supérieur au montant comptabilisé pour ce meme code. <br/><br/>Etes vous sur de vouloir poursuivre?',
    			type: MaParoisse.lib.MessageBox.QUESTION,
    			callback: {
    				fn: function(btnId){
		            	if(btnId == MaParoisse.lib.MessageBox.YES){
		            		//context.record.set(context.field, context.value);
		            		//do nothing
		            	} else {
		            		//editor.cancelEdit();
		            		context.record.set(context.field, prevValue);
		            	}
    				}
    			}
    		});
			return true;
    	} else {
    		return true;
    	}
    },
    
    onTenantChange: function(){
    	this.currentYear = null;
    	this.modifiable = false;
    	this.resetView();
    	this.loadInitialData();
    },
    
    hasDirtyRecords: function(){
    	var me = this,
    		grid = me.getView(),
    		store = grid.getStore(),
    		dirty = false;
    	
    	store.each(function(rec){
    		//examining the generation counter of the record has been proved to be a reliable way to tell if a record has been edited or not
    		if(rec.generation > 1){
    			dirty = true;
    			//returning false here just terminates iteration over the records
    			return false;
    		}
    	});
    	
    	return dirty;
    },
    
    resetView: function(){
    	this.getSaveButton().setDisabled(true);
    	
    	/*var yField = this.getYearField();
    	yField.suspendEvent('change');
    	yField.reset();
    	yField.resumeEvent('change');*/
    	
    	this.getView().getStore().removeAll();
    }
});
