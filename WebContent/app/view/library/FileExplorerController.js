Ext.define('MaParoisse.view.library.FileExplorerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.library-fileexplorer',
    
    onRender: function(){
    	this.loadInitialData();
    },
    
    onDownloadClicked: function(){
    	var me = this,
    		view = me.getView(),
    		grid = view.getComponent('filesGrid');
    	
    	var sm = grid.getSelectionModel();
    	
    	if(sm.hasSelection()){
    		var selected = sm.getSelection()[0];
    		var req = Ext.create('MaParoisse.lib.JsonRPC', {
    			url: '/JcrServlet',
    			service_type: 'JcrService',
    			listeners: {
    				success: function () {
    					//show success and load the server data 
    					MaParoisse.plugin.notification.showSuccess(' ','succès');
    					
    					var resp = arguments[0].BODY;
    					window.open(resp.downloadUrl, 'Download');
    					
    				},
    				error: function () {}
    			}
    		});
    		
    		req.request({
    			method: 'download',
    			params: {
    				ownerId: AccBureau.Context.principal.data.compId,
    				appModuleCode: view.appModuleCode,
    				fileName: selected.get('name'),
    				id: selected.get('id'),
    				xType: selected.get('xType'),
    				system: selected.get("system")
    			}
    		});
    	}
    },
    
    onFileSearchFieldKeyUp: function(field, e, eOpts){
    	var me = this,
			view = me.getView(),
			filesGrid = view.getComponent('filesGrid');
		
    	filesGrid.getStore().filterBy(function (record) {
			var searchValue = field.getValue().toUpperCase();
			if (searchValue.length == 0) {
				return true;
			} else if (
				record.get('name').toUpperCase().indexOf(searchValue) > -1 ||
				record.get('description').toUpperCase().indexOf(searchValue) > -1
			) {
				return true;
			} else {
				return false;
			}
	});
    },
    
    onUploadClicked: function(){
    	var me = this,
    		view = me.getView(),
    		tbar = view.getDockedComponent('topToolbar'),
    		menu = tbar.getComponent('uploadBtn').getMenu(),
    		fileForm = menu.getComponent('fileForm');
    	
    	if(fileForm.getForm().isValid()){
    		fileForm.submit({
                url: '../JcrUploadServlet',
                method: 'POST',
                success: function(form, action) {
                	me.doAddFile(action);
                	menu.hide();
                }
            });
    	}
    },
    
    onTenantChange: function(){
    	this.releaseResources();
    	this.loadInitialData();
	},
    
    loadInitialData: function(){
    	var me = this, view = me.getView();
    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/JcrServlet',
			service_type: 'JcrService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					me.loadFilesInView(resp.files);
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'loadInitialData',
			params: {
				ownerId: AccBureau.Context.principal.data.compId,
				appModuleCode: view.appModuleCode
			}
		});
    },
    
    loadFilesInView: function(files){
    	var me = this,
    		view = me.getView(),
    		grid = view.getComponent('filesGrid');
    	
    	if(typeof files.length === 'number'){
    		grid.getStore().loadData(files);
    	} else if(Ext.isDefined(files)){
    		grid.getStore().add(new MaParoisse.model.util.DomainRecord(files));
    	}
    },
    
    fileTypeRenderer: function(value, metaData, record, rowIndex, colIndex, store, view){
    	if(Ext.isDefined(value)){
    		if(value === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        			value === 'application/vnd.ms-excel'){
    			return '<i class="icon-file-excel" style="color: #666666;font-size:20px"></i>';
    		} else if(value === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    				value === 'application/msword'){
    			return '<i class="icon-file-word" style="color: #666666;font-size:20px"></i>';
    		} else if(value === 'application/pdf' ||
    				value === 'application/x-pdf'){
    			return '<i class="icon-file-pdf" style="color: #666666;font-size:20px"></i>';
    		} else {
    			return '<i class="icon-file" style="color: #666666;font-size:20px"></i>';
    		}
    	} else {
    		return '<i class="icon-file" style="color: #666666;font-size:20px"></i>';
    	}
    },
    
    releaseResources: function(){
    	var me = this,
    		view = me.getView(),
    		grid = view.getComponent('filesGrid');
    	
    	var uploadBtn = view.getDockedComponent('topToolbar').getComponent('uploadBtn');
    	if(Ext.isDefined(uploadBtn)){
    		uploadBtn.getMenu().getComponent('fileForm').reset();
    	}
    	
    	grid.getStore().removeAll();
    },
    
    doAddFile: function(action){
    	var me = this, view = me.getView();
    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/JcrServlet',
			service_type: 'JcrService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					me.loadFilesInView(resp.file);
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'upload',
			params: {
				ownerId: AccBureau.Context.principal.data.compId,
				appModuleCode: view.appModuleCode,
				fileName: action.result.fileName
			}
		});
    },
    
    onDeleteFile: function(){
    	var me = this,
			view = me.getView(),
			grid = view.getComponent('filesGrid');
		
		var sm = grid.getSelectionModel();
		
		if(sm.hasSelection()){
			var file = sm.getSelection()[0];
			//paranoic check
			if(Ext.isDefined(file)){
				Ext.create('MaParoisse.lib.MessageBox', {
	    			title: 'Suppression feuille de travail',
	    			formHeight: 130,
	    			message: 'Etes vous sur de vouloir supprimer <b style="font-weight:900;">définitivement</b> cette feuille de travail?<br><br><b style="font-weight:900;">\t' + file.get('name') + '</b>',
	    			type: MaParoisse.lib.MessageBox.QUESTION,
	    			callback: {
	    				fn: function(btnId){
	    					if(btnId === MaParoisse.lib.MessageBox.YES){
	    						me.doDeleteFile(file);
	    					}
	    				}
	    			}
				});
			}
		}
    },
    
    doDeleteFile: function(file){
    	var me = this,
    		view = me.getView();
    	
    	file.setDeleted();
		var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/JcrServlet',
			service_type: 'JcrService',
			listeners: {
				success: function () {
					//show success and load the server data 
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					
					var resp = arguments[0].BODY;
					me.removeFileFromView(resp.file);
				},
				error: function () {}
			}
		});
		
		req.request({
			method: 'delete',
			params: {
				ownerId: AccBureau.Context.principal.data.compId,
				appModuleCode: view.appModuleCode,
				fileName: file.get('name'),
				system: file.get('system'),
				id: file.get('id'),
			}
		});
    },
    
    removeFileFromView: function(file){
    	var me = this,
			view = me.getView(),
			grid = view.getComponent('filesGrid'),
			ds = grid.getStore(),
			sm = grid.getSelectionModel();
    	
    	var fileRecord;
    	ds.each(function(filerec){
    		if(filerec.get('id') === file.id && filerec.get('name') === file.name){
    			fileRecord = filerec;
    			return false;
    		}
    	});
    	
    	if(Ext.isDefined(fileRecord)){
    		if(sm.hasSelection()){
        		sm.deselectAll();
        	}
    		ds.remove(fileRecord);
    	}
    }
});
