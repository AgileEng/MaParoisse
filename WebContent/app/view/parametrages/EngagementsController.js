Ext.define('MaParoisse.view.parametrages.EngagementsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.parametrages-engagements',
    
    onRender: function(){
    	/*
		 * temporal fix for Chrome
		 */
		Ext.apply(Ext.util.Format, {
            thousandSeparator: ' ',
            decimalSeparator: ',',
            currencySign: ' ',
            dateFormat: 'd/m/Y'
        });
    	
    	this.loadInitialData();
    },
    
    loadInitialData: function(doAddYear){
    	var me = this,
    		view = me.getView();
    	
    	view.deletedEngagements = [];
    	view.deletedTitres = [];
    	
    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/CouncilServlet',
			service_type: 'EngTitresService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					var yField = me.getYearField();
					yField.suspendEvent('change');
					yField.setValue(resp.year);
					yField.resumeEvent('change');
					me.loadServerDataInTabs(resp.engagements, resp.titres);
				},
				error: function () {}
			}
		});
    	
    	var params = {};
		params.ownerId = AccBureau.Context.principal.data.compId;
		if(doAddYear){
			params.year = me.getYearField().getValue();
		}
    	
		req.request({
			method: 'loadEngTitres',
			params: params
		});
    },
    
    loadServerDataInTabs: function(engagements, titres){
    	var me = this,
    		view = me.getView(),
    		engGrid = view.getComponent('engagementsGrid'),
    		titrGrid = view.getComponent('titresGrid');
    	
    	engGrid.getStore().loadRawData(engagements);
    	titrGrid.getStore().loadRawData(titres);
    },
    
    //START OF ENGAGEMENT FUNCTIONS
    getSelectedEng: function(){
    	var me = this,
    		view = me.getView(),
    		engGrid = view.getComponent('engagementsGrid'),
    		sm = engGrid.getSelectionModel();
    	
    	if(sm.hasSelection()){
    		//paranoic check
    		var selRec = sm.getSelection()[0];
    		if(Ext.isDefined(selRec)){
    			return selRec;
    		} else {
    			return null;
    		}
    	}
    },
    
    onSaveEngClicked: function(){
    	var me = this,
    		view = me.getView(),
			engagementsGrid = view.getComponent('engagementsGrid');
    	
    	var engagements = [];
    	
    	engagementsGrid.getStore().each(function(rec){
    		engagements.push(rec.getDataObjectOpt(options={serialize: true}));
    	});
    	
    	for(var i = 0; i < view.deletedEngagements.length; i++){
    		engagements.push(view.deletedEngagements[i]);
    	}
    	
    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/CouncilServlet',
			service_type: 'EngTitresService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					me.refreshTab(resp.engagements);
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'saveEngTitres',
			params: {
				ownerId: AccBureau.Context.principal.data.compId,
				engagements: engagements,
				year: me.getYearField().getValue()
			}
		});
    },
    
    onAddEngClicked: function(){
    	var me = this,
			view = me.getView(),
			engagementsGrid = view.getComponent('engagementsGrid');
		
		var editingPlugin = engagementsGrid.getPlugin('engagementsEditing');
		
		var newRec = Ext.create('MaParoisse.model.Engagement', {});
		engagementsGrid.getStore().add(newRec);
		editingPlugin.startEdit(newRec, 0);
    },
    
    onDeleteEngClicked: function(){
    	var me = this;
    	var eng = me.getSelectedEng();
    	if(eng != null){
    		Ext.create('MaParoisse.lib.MessageBox', {
    			title: 'Suppression feuille de travail',
    			formHeight: 130,
    			message: 'Etes vous sur de vouloir supprimer <b style="font-weight:900;">définitivement</b>?',
    			type: MaParoisse.lib.MessageBox.QUESTION,
    			callback: {
    				fn: function(btnId){
    					if(btnId === MaParoisse.lib.MessageBox.YES){
    						me.doDeleteEngagement(eng);
    					}
    				}
    			}
			});
    	}
    },
    
    doDeleteEngagement: function(engagement){
    	var me = this,
			view = me.getView(),
			engGrid = view.getComponent('engagementsGrid');
    	
    	engGrid.getStore().remove(engagement);
    	engagement.setDeleted();
    	view.deletedEngagements.push(engagement.getDataObjectOpt(options={serialize:true}));
    },
    
    refreshTab: function(engagements){
    	var me = this,
			view = me.getView(),
			engagementsGrid = view.getComponent('engagementsGrid');
    	
    	engagementsGrid.getStore().loadData(engagements);
    },
    //END OF ENGAGEMENT FUNCTIONS
    //====================================================================================================================================================
    
    //START OF TITRES FUNCTIONS
    getSelectedTitre: function(){
    	var me = this,
    		view = me.getView(),
    		titreGrid = view.getComponent('titresGrid'),
    		sm = titreGrid.getSelectionModel();
    	
    	if(sm.hasSelection()){
    		//paranoic check
    		var selRec = sm.getSelection()[0];
    		if(Ext.isDefined(selRec)){
    			return selRec;
    		} else {
    			return null;
    		}
    	}
    },
    
    onSaveTitreClicked: function(){
    	var me = this,
			view = me.getView(),
			titresGrid = view.getComponent('titresGrid');
		
		var titres = [];
		
		titresGrid.getStore().each(function(rec){
			titres.push(rec.getDataObjectOpt(options={serialize: true}));
		});
		
		for(var i = 0; i < view.deletedTitres.length; i++){
			titres.push(view.deletedTitres[i]);
		}
		
		var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/CouncilServlet',
			service_type: 'EngTitresService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					me.refreshTitreTab(resp.titres);
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'saveEngTitres',
			params: {
				ownerId: AccBureau.Context.principal.data.compId,
				titres: titres,
				year: me.getYearField().getValue()
			}
		});
    },
    
    onAddTitreClicked: function(){
    	var me = this,
			view = me.getView(),
			titreGrid = view.getComponent('titresGrid');
    	
    	var editingPlugin = titreGrid.getPlugin('titreEditing');
    	
    	var newRec = Ext.create('MaParoisse.model.Titre', {});
    	titreGrid.getStore().add(newRec);
    	editingPlugin.startEdit(newRec, 0);
    },
    
    onDeleteTitreClicked: function(){
    	var me = this;
    	var titre = me.getSelectedTitre();
    	if(titre != null){
    		Ext.create('MaParoisse.lib.MessageBox', {
    			title: 'Suppression feuille de travail',
    			formHeight: 130,
    			message: 'Etes vous sur de vouloir supprimer <b style="font-weight:900;">définitivement</b>?',
    			type: MaParoisse.lib.MessageBox.QUESTION,
    			callback: {
    				fn: function(btnId){
    					if(btnId === MaParoisse.lib.MessageBox.YES){
    						me.doDeleteTitre(titre);
    					}
    				}
    			}
			});
    	}
    },
    
    doDeleteTitre: function(titre){
    	var me = this,
			view = me.getView(),
			titreGrid = view.getComponent('titresGrid');
    	
    	titreGrid.getStore().remove(titre);
    	titre.setDeleted();
    	view.deletedTitres.push(titre.getDataObjectOpt(options={serialize:true}));
    },
    
    refreshTitreTab: function(titres){
    	var me = this,
			view = me.getView(),
			titresGrid = view.getComponent('titresGrid');
	
    	titresGrid.getStore().loadData(titres);
    },
    //END OF TITRES FUNCTIONS
    
    onTenantChange: function(){
    	this.releaseResources();
    	this.loadInitialData();
    },
    
    onBeforeClose: function(){
    	this.releaseResources();
    },
    
    releaseResources: function(){
    	var me = this,
			view = me.getView(),
			engGrid = view.getComponent('engagementsGrid'),
			titrGrid = view.getComponent('titresGrid');
    	
    	engGrid.getStore().removeAll();
    	titrGrid.getStore().removeAll();
    	
    	view.deletedEngagements = [];
    	view.deletedTitres = [];
    },
    
    onPrintClicked: function(){
    	Ext.create('MaParoisse.view.receipts.DocGenWindow', {
			title: 'DÉTAIL DES COMPTES FINANCIERS',
			yearField: true,
			submitFunction: function(btn){
				var view = btn.up('window'),
					yearField = view.getComponent('yearField');
					
				if(yearField.isValid()){
					window.open(
						'../CefraForm?number=finances&ownerId=' + AccBureau.Context.principal.data.compId
						+ '&year=' + yearField.getValue(),
						'_Print');
			    	view.close();
				}
			}
		});
    },
    
    getYearField: function() {
    	var me = this,
    		view = me.getView(),
			topToolbar = view.getDockedComponent('topTbar');
    	
    	return topToolbar.getComponent('yearField');
    },
    
    onYearChange: function(){
    	this.loadInitialData(true);
    },
    
    isSafeToClose: function(){
    	var safeToClose = true,
    		me = this,
    		view = me.getView(),
    		engGrid = view.getComponent('engagementsGrid'),
    		titrGrid = view.getComponent('titresGrid');
    	
    	engGrid.getStore().each(function(rec){
    		var dataObject = rec.getDataObjectExt(); 		
    		if(rec.dirty || dataObject.dbState != 0){
    			safeToClose = false;
    			return safeToClose;
    		}
    	});
    	
    	titrGrid.getStore().each(function(rec){
    		var dataObject = rec.getDataObjectExt(); 		
    		if(rec.dirty || dataObject.dbState != 0){
    			safeToClose = false;
    			return safeToClose;
    		}
    	});
    	
    	return safeToClose;
    }
});
