Ext.define('overrides.AbstractSummary', {
    override    : 'Ext.grid.feature.AbstractSummary',
 
    init: function() {
        var me = this;
 
        me.callParent(arguments);
 
        me.generateSummaryData =  function(){
 
            var me = this,
                store = me.view.store,
                groups = store.getGroups().items,
                reader = store.getProxy().getReader(),
                len = groups.length,
                groupField = me.getGroupField(),
                data = {},
                lockingPartner = me.lockingPartner,
                i, group, record,
                root, summaryRows, hasRemote,
                convertedSummaryRow, remoteData, groupInfo;
 
            /**
             * @cfg {String} [remoteRoot=undefined]
             * The name of the property which contains the Array of summary objects.
             * It allows to use server-side calculated summaries.
             */
 
            if (me.remoteRoot && reader.rawData) {
 
                hasRemote = true;
                remoteData = {};
                // reset reader root and rebuild extractors to extract summaries data
                root = reader.getRootProperty();
                reader.setRootProperty(me.remoteRoot);
                reader.buildExtractors(true);
                summaryRows = reader.getRoot(reader.rawData) || [];
                len = summaryRows.length;
 
                for (i = 0; i < len; ++i) {
                    // Convert a raw data row into a Record's hash object using the Reader
                    convertedSummaryRow = reader.extractRecordData(summaryRows[i], me.readDataOptions);
                    remoteData[convertedSummaryRow[groupField]] = convertedSummaryRow;
                }
 
                // restore initial reader configuration
                reader.setRootProperty(root);
                reader.buildExtractors(true);
            }
 
            for (i = 0; i < len; ++i) {
                group = groups[i];
                groupInfo = me.getGroupInfo(group);
                // Something has changed or it doesn't exist, populate it
 
                record = me.populateRecord(group, groupInfo, remoteData);
 
                if (!lockingPartner || (me.view.ownerCt === me.view.ownerCt.ownerLockable.normalGrid)) {
                    groupInfo.lastGeneration =  group.generation;
                }
 
                data[group.getGroupKey()] = record;
            }
            return data;
        }
    }
});