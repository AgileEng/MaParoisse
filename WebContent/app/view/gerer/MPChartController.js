Ext.define('MaParoisse.view.gerer.MPChartController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mpchartcontroller',
    
    onRender: function() {
    	Ext.apply(Ext.util.Format, {
            thousandSeparator: ' ',
            decimalSeparator: ',',
            currencySign: ' ',
            dateFormat: 'd/m/Y'
        });
    	var me = this;
    	var year = this.getView().down('toolbar').down('numberfield').getValue();
    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/TableauDeBordServlet',
			service_type: 'TableauDeBordService',
			listeners: {
				success: function () {
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					var resp = arguments[0].BODY;
					me.doLoadData(resp.chartData);
				},
				error: function () {}
			}
		});
		
		req.request({
			method: me.getView().loadMethod,
			params: {
				ownerId: AccBureau.Context.principal.data.compId,
				year: year
			}
		});
    },
    
    doLoadData: function(data) {
    	var view = this.getView();
    	view.dataStore.loadData(data);
    	if (view.chartType == MaParoisse.view.gerer.MPChart.PIE) {
    		var polar = view.down('polar');
			var colors = polar.getColors();
	        if (colors) {
	            polar.updateColors(colors);
	        }
    	}
    },
    
    onYearChange: function() {
    	this.onRender();
    },

    onPrintClicked: function() {
    	var me = this,
    		view = me.getView(),
    		year = view.down('toolbar').down('numberfield').getValue();
    	
    	var chart = null;
    	if (view.chartType == MaParoisse.view.gerer.MPChart.BAR) {
    		chart = view.down('cartesian');
    	} else if (view.chartType == MaParoisse.view.gerer.MPChart.PIE) {
    		chart = view.down('polar');
    	}
    	
    	var img = chart.getImage();
    	var req = Ext.create('MaParoisse.lib.JsonRPC', {
			url: '/TableauDeBordServlet',
			service_type: 'TableauDeBordPrint',
			listeners: {
				success: function () {
					MaParoisse.plugin.notification.showSuccess(' ','succès');
					var resp = arguments[0].BODY;
					window.open(resp.downloadUrl, '_Print');
				},
				error: function () {}
			}
		});
		
		req.request({
			method: view.printMethod,
			params: {
				ownerId: AccBureau.Context.principal.data.compId,
				year: year,
				base64ChartImage: img.data
			}
		});
    	
    },
    
    onTenantChange: function() {
    	this.onRender();
    }
    
});
