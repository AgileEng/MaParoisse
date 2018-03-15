Ext.define("MaParoisse.view.gerer.MPChart",{
    extend: "Ext.panel.Panel",
    requires: ['Ext.chart.series.Bar', 'Ext.chart.CartesianChart'],
    controller: "mpchartcontroller",
    listeners: {
    	scope: 'controller',
    	render: 'onRender',
    	tenantChange: 'onTenantChange'
    },
    
    statics: {
    	PIE: 0,
    	BAR: 1
    },
    title: null,
    chartHeading: null,
    chartType: null,
    storeFields: null,
    sortDirection: null,
	sortByProp: null,
	dataStore: null,
	loadMethod: null,
	printMethod: null,
    
    initComponent: function() {
    	
    	var fields = [],
    		columns = [];
    	if (Ext.isDefined(this.storeFields)) {
	    	for (var i = 0; i < this.storeFields.length; i++) {
	    		fields.push(this.storeFields[i].dataIndex);
	    		columns.push(this.storeFields[i]);
	    	}
    	}
    	
    	var chart = null;
    	var sorters = [];
    	if (Ext.isDefined(this.sortByProp) && Ext.isDefined(this.sortDirection)) {
    		sorters = [{
    			direction: this.sortDirection,
    			property: this.sortByProp
    		}];
    	}
    	var ds = new Ext.data.Store({
	        fields: fields,
	        sorters: sorters
	    });
    	this.dataStore = ds;
    	
    	if (this.chartType == MaParoisse.view.gerer.MPChart.PIE) {
    		//Initial data is needed for the chart to render, otherwise later the chart is displayed broken (probably a bug???)
    		//dummy data for initializing the pie chart
    		data = [];
    		this.dataStore.loadData(data);
    		chart = {
		        xtype: 'polar',
		        interactions: 'rotate',
		        region: 'center',
		        reference: 'chart',
		        width: '85%',
		        //height: 500,
		        insetPadding: 50,
		        innerPadding: 20,
		        store: this.dataStore,
		        sprites: [{
	                type: 'text',
	                text: this.chartHeading,
	                font: '22px',
	                x: 70, // the sprite x position
	                y: 40  // the sprite y position
	            }],
		        series: {
		            type: 'pie',
		            label: {
		                field: fields[0],
		                display: 'outside',
		                calloutLine: {
		                    length: 70,
		                    width: 4
		                },
		                renderer: function(text, sprite, config, rendererData, index){
		                	var store = rendererData.store;
		                	var sum = store.sum('amount');
		                	var value = store.getAt(index).get('amount');
		                	var percentage = value/sum*100;
		                	return text + ' ' + Number(percentage).toFixed(2) + "%";
		                }
		            },
		            xField: fields[1],
		            donut: 2
		        }
		    }
    	} else if (this.chartType == MaParoisse.view.gerer.MPChart.BAR) {
    		chart = {
				xtype: 'cartesian',
				region: 'center',
				forceFit: true,
				reserveScrollbar: true,
				insetPadding: 70,
				theme: 'Sky',
				sprites: [{
	                type: 'text',
	                text: this.chartHeading,
	                font: '22px',
	                x: 70, // the sprite x position
	                y: 40  // the sprite y position
	            }],
	            store: ds,
	            axes: [{
	                type: 'numeric',
	                position: 'left',
	                title: {
	                    text: columns[1].header,
	                    fontSize: 15
	                },
	                fields: columns[1].dataIndex
	            }, {
	                type: 'category',
	                position: 'bottom',
	                title: {
	                    text: columns[0].header,
	                    fontSize: 15
	                },
	                fields: columns[0].dataIndex
	            }],
	            series: {
	                type: 'bar',
	                xField: columns[0].dataIndex,
	                yField: columns[1].dataIndex,
	                style: {
	                    fill: 'blue'
	                },
	                style: {
	                    opacity: 0.80,
	                },
	                label: {
	                    field: columns[1].dataIndex,
	                    display: 'insideEnd',
	                    renderer: function(text, sprite, config, rendererData, index) {
	                    	return Ext.util.Format.currency(text) + " €";
	                    },
	                    orientation: 'horizontal'
	                },
	            }
	        };
    	}
    	
    	var config = {
    		region: 'center',
    		tbar: [{
				xtype: 'numberfield',
				itemId: 'yearField',
				fieldLabel: 'Année',
				labelWidth: 55,
				name: 'year',
				minValue: 2000,
				maxValue: 2050,
				step: 1,
				allowDecimals: false,
				value: new Date().getFullYear(),
				listeners: {
					change: 'onYearChange'
				}
			},'->',{
				icon: null,
				glyph: 'xe021@iconFont',
				baseCls: 'ae-ext-button-small-icon',
		        scale: 'small',
		        iconAlign: 'top',
		        text: 'Imprimer',
		        btnId: 'printBtn',
		        handler: 'onPrintClicked'
		    }],
    		layout: 'border',
    		items: [{
    			xtype: 'grid',
    			region: 'west',
    			width: this.chartType == MaParoisse.view.gerer.MPChart.BAR ? 200 : 450,
    			store: ds,
    			columns: columns
    		}, chart]
    	};
    	
    	Ext.apply(this, config);
    	this.callParent(arguments);
    },
    
    isSafeToClose: function() {
    	// should be always safe to close without checking
    	return true;
    }
});
