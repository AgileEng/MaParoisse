/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('MaParoisse.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    requires: ['MaParoisse.lib.MessageBox'],

    alias: 'controller.main',
    
    onRender: function(c){
    	$(window).on('beforeunload', function(){
    		if(!Ext.getCmp('ae-viewport').getController().isSafeToCloseCurrentModule()){
        		return 'Vous vous apprêtez à quitter ce module sans sauvegarder. Les données saisies seront perdues. <br/><br/>Etes vous sur de vouloir poursuivre?';
        	} else {
        		return
        	}
    	});
    },
    
	loadTipText: function(){
		
	},
    
    onBackButtonClick: function(){
    	//this.isSafeToCloseCurrentModule(this.doHistoryBack);
    	this.doHistoryBack(true)
    },
    
    doHistoryBack: function(allowed){
    	if(allowed){
    		window.history.back();
    	} else {
    		//do nothing
    	}
    },
    
    onLogout: function(){
    	this.isSafeToCloseCurrentModule(this.doLogout);
    },
    
    doLogout: function(allowed){
    	if(allowed){
	    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
	    	    url: '/AccBureau',
	    	    service_type: 'AccBureauService',
	    	    listeners: {
	    	    	success: function () {
	    	    		MaParoisse.app.logOff();
	    	    	},
	    	    	error: function () {
	    	    		MaParoisse.app.logOff();
	    	    	}
	    	    }
	    	});
	    	   
	    	req.request({method: 'logoff', params: {}});
    	}
    },
    
    /*
     * A function to first find what's inside the Module Holder
     *	if there's a menu (the Metro tiles) the decision is to pass true to the callback function
     *	if there's an Ext Component (so called Application Modules) the isSafeToClose function of the module is called
     *	!!! note every module should have its own implementation of the isSafeToClose function returning true or false
     *	on negative result a window notifies and forces the user to make a decision:
     *	either to discard the changes or to interrupt closing and prevent loosing unsaved data.
     *	The user decision is passed to the callback function
     *	
     */
    isSafeToCloseCurrentModule: function(callback){
    	var isSafeToClose = false;
    	if(!Ext.isDefined(Ext.getCmp('moduleHolder'))){
    		//case when there's no module holder
    		//it should be safe to close
    		isSafeToClose = true;
    	} else if(Ext.getCmp('moduleHolder').items.items.length == 1){
    		if(Ext.isDefined(Ext.getCmp('moduleHolder').items.items[0]) && (Ext.getCmp('moduleHolder').items.items[0].id != 'aeTilesPanel') && Ext.getCmp('moduleHolder').items.items[0].isSafeToClose()){
            	//case when there is a menu (tiles) and it should be always safe to close since there's no editable data
        		isSafeToClose = true;
        	} else if(Ext.isDefined(Ext.getCmp('moduleHolder').items.items[0]) && Ext.getCmp('moduleHolder').items.items[0].id == 'aeTilesPanel'){
        		//case when there is a metro tiles menu
        		//it should be always safe to close it since there is no editable data
        		isSafeToClose = true;
        	}
    		//TODO: find out why ext creates one additional panel in the default module(the example module with grids) case
    	} else if(Ext.getCmp('moduleHolder').items.items.length == 2){
    		if(Ext.isDefined(Ext.getCmp('moduleHolder').items.items[1]) && Ext.getCmp('moduleHolder').items.items[1].id != 'aeTilesPanel' && Ext.getCmp('moduleHolder').items.items[1].isSafeToClose()){
            	//case when there is a menu (tiles) and it should be always safe to close since there's no editable data
        		isSafeToClose = true;
        	} else if(Ext.isDefined(Ext.getCmp('moduleHolder').items.items[0]) && Ext.getCmp('moduleHolder').items.items[0].id == 'aeTilesPanel'){
        		//case when there is a metro tiles menu
        		//it should be always safe to close it since there is no editable data
        		isSafeToClose = true;
        	}
    	}
    	if(callback){
	    	if(!isSafeToClose){
	    		Ext.create('MaParoisse.lib.MessageBox', {
	    			//header: false,
	    			title: 'Zachée',
	    			formHeight: 140,
	    			message: 'Vous vous apprêtez à quitter ce module sans sauvegarder. Les données saisies seront perdues. <br/><br/>Etes vous sur de vouloir poursuivre?',
	    			type: MaParoisse.lib.MessageBox.QUESTION,
	    			callback: {
	    				fn: function(btnId){
	    					
			            	if(btnId == MaParoisse.lib.MessageBox.YES){
			            		isSafeToClose = true;
			            	}
			            	if(callback){
				            	callback(isSafeToClose);
			            	} else {
			            		return isSafeToClose;
			            	}
	    				}
	    			}
	    		});
	    	} else {
	    		if(callback){
	            	callback(isSafeToClose);
	        	} else {
	        		return isSafeToClose;
	        	}
	    	}
    	}
    	return isSafeToClose;
    }

});
