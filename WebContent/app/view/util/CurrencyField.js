Ext.define('MaParoisse.view.util.CurrencyField', {
    extend: 'Ext.form.field.Number',//Extending the NumberField
    alias: 'widget.currencyfield',//Defining the xtype
    
    currencySymbol: Ext.util.Format.currencySign,
    

    isCurrency : false,

    currencySymbolPos : 'left',
    displayCurrencySymbol: false,
    
    useThousandSeparator: true,
    thousandSeparator: Ext.util.Format.thousandSeparator,
    decimalSeparator: ',',
    alwaysDisplayDecimals: true,
    
    allowExponential : false,
    
    /**
     * initComponent
     */
    initComponent: function(){
        
        this.isCurrency = !Ext.isEmpty(this.currencySymbol);
        
        this.callParent(arguments);
    },
    
    /**
     * setValue
     */
    setValue: function(value){
        // MOD - chamacs
        MaParoisse.view.util.CurrencyField.superclass.setValue.apply(this, [value != null ? value.toString().replace('.', this.decimalSeparator) : value]);
        
        this.setRawValue(this.getFormattedValue(this.getValue()));
    },
    
    /**
     * getFormattedValue
     */
    getFormattedValue: function(value){
        if (Ext.isEmpty(value) || !this.hasFormat()) {
            return value;
        }
        else {
            var neg = null;
            
            value = (neg = value < 0) ? value * -1 : value;
            value = this.allowDecimals && this.alwaysDisplayDecimals ? value.toFixed(this.decimalPrecision) : value;
            
            if (this.useThousandSeparator) {
                if (this.useThousandSeparator && Ext.isEmpty(this.thousandSeparator)) {
                    throw ('NumberFormatException: invalid thousandSeparator, property must has a valid character.');
                }
                if (this.thousandSeparator == this.decimalSeparator) {
                    throw ('NumberFormatException: invalid thousandSeparator, thousand separator must be different from decimalSeparator.');
                }
                
                value = value.toString();
                
                var ps = value.split('.');
                ps[1] = ps[1] ? ps[1] : null;
                
                var whole = ps[0];
                
                var r = /(\d+)(\d{3})/;
                
                var ts = this.thousandSeparator;
                
                while (r.test(whole)) {
                    whole = whole.replace(r, '$1' + ts + '$2');
                }
                
                value = whole + (ps[1] ? this.decimalSeparator + ps[1] : '');
            }
            
            if(this.displayCurrencySymbol){
	            var position1 = this.isCurrency ? this.currencySymbol + ' ' : '';
	            var position2 = value;
	            if (this.currencySymbolPos === 'right') {
	                position1 = value;
	                position2 = this.isCurrency ? ' ' + this.currencySymbol : '';
	            }
	            return Ext.String.format('{0}{1}{2}', (neg ? '-'  : ''), position1, position2);
            } else {
            	var position1 = value;
	            var position2 = '';
	            return Ext.String.format('{0}{1}{2}', (neg ? '-'  : ''), position1, position2);
            }
        }
    },
    
    /**
     * overrides parseValue to remove the format applied by this class
     */
    parseValue: function(value){
        // MOD - chamacs
        //Replace the currency symbol and thousand separator
        return MaParoisse.view.util.CurrencyField.superclass.parseValue.apply(this, [this.removeFormat(value)]);
    },
    
    /**
     * Remove only the format added by this class to let the superclass validate with it's rules.
     * @param {Object} value
     */
    removeFormat: function(value){
        // MOD - chamacs
        if (Ext.isEmpty(value)) {
            return '';
        }
        else if (!this.hasFormat()) {
            return value;
        }
        else {
            // MOD - bhaidaya
            value = Ext.String.trim(value.toString().replace(this.currencySymbol, ''));
            
            value = this.useThousandSeparator ? value.replace(new RegExp('[' + this.thousandSeparator + ']', 'g'), '') : value;   
            return value;
        }
    },
    
    /**
     * Remove the format before validating the the value.
     * @param {Number} value
     */
    getErrors: function(value) {
        // MOD - chamacs
        return MaParoisse.view.util.CurrencyField.superclass.getErrors.apply(this, [this.removeFormat(value)]);
    },
    
    /**
     * hasFormat
     */
    hasFormat: function() {
        return this.decimalSeparator != '.' || (this.useThousandSeparator == true && this.getRawValue() != null) || !Ext.isEmpty(this.currencySymbol) || this.alwaysDisplayDecimals;
    },
    
    /**
     * Display the numeric value with the fixed decimal precision and without the format using the setRawValue, don't need to do a setValue because we don't want a double
     * formatting and process of the value because beforeBlur perform a getRawValue and then a setValue.
     */
    onFocus: function() {
        this.setRawValue(this.removeFormat(this.getRawValue()));
        
        this.callParent(arguments);
    },
    
    /**
     * MOD - Jeff.Evans
     */
    processRawValue: function(value) {
        return this.removeFormat(value);
    }
});