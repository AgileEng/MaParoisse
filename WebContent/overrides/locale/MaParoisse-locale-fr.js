Ext.onReady(function(){
	if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: ' ',
            decimalSeparator: ',',
            currencySign: ' ',
            // French Euro
            dateFormat: 'd/m/Y'
        });
	}
	
	Ext.define("Ext.locale.fr.grid.RowEditor", {
	    override: "Ext.grid.RowEditor",

    	saveBtnText  : 'Appliquer',
	    cancelBtnText: 'Annuler',
	    errorsText: 'Erreurs'
	});
	
	Ext.define("Ext.locale.fr.picker.Date", {
	    override: "Ext.picker.Date",
	    todayText: "Aujourd'hui",
	    minText: "Cette date est antérieure à la date minimum",
	    maxText: "Cette date est postérieure à la date maximum",
	    disabledDaysText: "",
	    disabledDatesText: "",
	    nextText: 'Mois suivant (CTRL+Flèche droite)',
	    prevText: "Mois précédent (CTRL+Flèche gauche)",
	    monthYearText: "Choisissez un mois (CTRL+Flèche haut ou bas pour changer d'année.)",
	    todayTip: "{0} (Barre d'espace)",
	    format: "d/m/Y",
	    startDay: 1
	});
	
	Ext.define("Ext.locale.fr.form.field.Date", {
	    override: "Ext.form.field.Date",
	    disabledDaysText: "Désactivé",
	    disabledDatesText: "Désactivé",
	    minText: "La date de ce champ ne peut être antérieure au {0}",
	    maxText: "La date de ce champ ne peut être postérieure au {0}",
	    invalidText: "{0} n'est pas une date valide - elle doit être au format suivant: {1}",
	    format: "d/m/Y",
	    altFormats: "d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d"
	});
	
	Ext.define("Ext.locale.fr.Date", {
		override: "Ext.Date",
		defaultFormat: "d/m/Y"
	});
});