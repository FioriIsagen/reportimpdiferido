sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/GroupHeaderListItem",
    "sap/m/BusyDialog",
    "sap/m/MessageBox",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, ResourceModel, exportLibrary, Spreadsheet, Filter, FilterOperator, GroupHeaderListItem, BusyDialog, MessageBox, MessageToast, ValueHelpDialog) {
        "use strict";

        var EdmType = exportLibrary.EdmType;

        return Controller.extend("isagen.reportimpdiferido.controller.MainView", {

            //Variables Globales
            Permanente: "",
            Imponible: "",
            Deducible: "",
            Sociedad: "",
            Ejercicio: "",
            Ledger: "",
            LedgerBase: "",
            GLedger: "",
            MesIni: "",
            MesFin: "",
            NumCuentIni: "",
            NumCuentFin: "",
            TarifImpuesto: "",
            Test: "",
            grupo: "",
            impu: "",
            fechCont: "",
            subtotal: [],
            fechContRev: "",
            fechContJob: "",
            revCont: "",
            ledgerTxt: "",
            gLedgerTxt: "",
            txtLedgerBase: "",
            bFirstSearch:true,
            sFilter:"",
            contrapartida:"",
            bTarImp:true,

            onInit: function () {
                var that = this;
                sap.ui.getCore().getConfiguration().setLanguage("en");             
                // Para utilizar el i18n
                var i18nModel = new sap.ui.model.resource.ResourceModel({
                   bundleName: "isagen.reportimpdiferido.i18n.i18n"
                });
                this._oResourceBundle = i18nModel.getResourceBundle();
                this.getView().setModel(i18nModel, "i18n");
                // Enlazar el SmartFilterBar con el método onSearch
                var oSmartFilterBar = this.byId("smart");
                if (oSmartFilterBar) {
                    oSmartFilterBar.attachSearch(this.onSearch, this);
                } else {
                    console.error("El SmartFilterBar no pudo ser encontrado con el ID proporcionado.");
                } 
            },
            onSeleccionMes: function (mes) {
                let mesSeleccionado
                switch (mes) {
                    case "0":
                        mesSeleccionado = "Mes Cero"
                        break;
                    case "1":
                        mesSeleccionado = "Enero"
                        break;
                    case "2":
                        mesSeleccionado = "Febrero"
                        break;
                    case "3":
                        mesSeleccionado = "Marzo"
                        break;
                    case "4":
                        mesSeleccionado = "Abril"
                        break;
                    case "5":
                        mesSeleccionado = "Mayo"
                        break;
                    case "6":
                        mesSeleccionado = "Junio"
                        break;
                    case "7":
                        mesSeleccionado = "Julio"
                        break;
                    case "8":
                        mesSeleccionado = "Agosto"
                        break;
                    case "9":
                        mesSeleccionado = "Septiembre"
                        break;
                    case "10":
                        mesSeleccionado = "Octubre"
                        break;
                    case "11":
                        mesSeleccionado = "Noviembre"
                        break;
                    case "12":
                        mesSeleccionado = "Diciembre"
                        break;
                    default:
                        break;
                }

                return mesSeleccionado;

            },
            onRellenarTabla: function (sFilter) {


                this.subtotal=[];
                var Deducible, Imponible, Permanente;
                var sServiceURL = "/sap/opu/odata/sap/ZFI_IMP_DIFERIDO_REP1_SRV/";
                var sSource=sServiceURL+"ZFI_IMPDIF_REP1Set?"+sFilter;
                this.sFilter=sFilter;
                //var sSource = sServiceURL + "ZFI_IMPDIF_REP1Set?$filter=( Pbukrs eq '" + this.Sociedad + "' and Pryear eq '" + this.Ejercicio + "' and Prldnr eq '" + this.Ledger + "' and Pldgrp eq '" + this.GLedger + "' and Pbfrper eq '" + this.MesIni + "' and Pbtoper eq '" + this.MesFin + "' and Pbudat eq '" + this.fechCont + "' and PtarifImp eq '" + this.TarifImpuesto + "' and Pfechcontrev eq '" + this.fechCont + "' and Preversar eq '" + this.revCont + "'and Pfechjobrev eq '" + this.fechContJob + "'and Ptest eq'" + this.Test + "' " + filterIni + " and  Brldnr eq '" + this.LedgerBase + "')";


                var xhr = new XMLHttpRequest();
                var json;
                var that = this;
                try {
                    xhr.addEventListener("readystatechange", function () {
                        if (this.readyState === 4) {
                            if (this.status === 200) {
                                that.json = JSON.parse(this.response);
                            }
                        }
                    });
                    xhr.open("GET", sSource, false)
                    xhr.setRequestHeader("accept", "application/json");
                    xhr.send();


                    var datos = [];
                    var that = this
                    for (let i = 0; i < that.json.d.results.length; i++) {
                        var result = that.json.d.results[i];
                        if (result && result.CalseCuenta !== undefined) {



                            var num = that.json.d.results[i].LedgerBasico;
                            var numero = Number(num);
                            var X100 = (numero * 100);
                            var formatoMoneda = X100.toLocaleString("es-CO");
                            var LedgerBasico = formatoMoneda.toString(formatoMoneda);


                            var num2 = that.json.d.results[i].LedgerComp;
                            var numero2 = Number(num2);
                            var x1002 = (numero2 * 100)
                            var formatoMoneda2 = x1002.toLocaleString("es-CO");
                            var LedgerComp = formatoMoneda2.toString(formatoMoneda2);

                            var num3 = that.json.d.results[i].Diferencia
                            var numero3 = Number(num3);
                            var x1003 = (numero3 * 100)
                            var formatoMoneda3 = x1003.toLocaleString("es-CO");
                            var Diferencia = formatoMoneda3.toString(formatoMoneda3);

                            var num4 = that.json.d.results[i].ImpDiferido
                            var numero4 = Number(num4);
                            var x1004 = (numero4 * 100)
                            var formatoMoneda4 = x1004.toLocaleString("es-CO");
                            var ImpDiferido = formatoMoneda4.toString(formatoMoneda4);
                            this.contrapartida=result.Contrapartida;
                            datos.push({
                                CalseCuenta: result.CalseCuenta,
                                ClaseCuenta: result.ClaseCuenta,
                                Deducible: result.Deducible,
                                Diferencia: Diferencia,
                                GrupoCta: result.GrupoCta,
                                ImpDiferido: ImpDiferido,
                                Imponible: result.Imponible,
                                LedgerBasico: LedgerBasico,
                                LedgerComp: LedgerComp,
                                Pbfrper: result.Pbfrper,
                                Pbtoper: result.Pbtoper,
                                Pbudat: result.Pbudat,
                                Pbukrs: result.Pbukrs,
                                Permanente: result.Permanente,
                                Pldgrp: result.Pldgrp,
                                Pracct: result.Pracct,
                                Prldnr: result.Prldnr,
                                Pryear: result.Pryear,
                                PtarifImp: result.PtarifImp,
                                Ptest: result.Ptest,
                                Racct: result.Racct,
                                Rtcur: result.Rtcur,
                                TarifaImp: result.TarifaImp,
                                TipoImp: result.TipoImp,
                                Txt50: result.Txt50,
                                Contrapartida:result.Contrapartida,
                                FechaEjecucion:result.FechaEjecucion.replace(/(\d{4})(\d{2})(\d{2})/, "$3/$2/$1")
                            });
                        }
                    }
                    var odata4 = new JSONModel(datos);
                    odata4.setSizeLimit(9999);
                    odata4.refresh(true);
                    this.getView().setModel(odata4, "modelo4");                 
                    if (datos.length > 0) {
                        this.getView().byId("btnExcel").setVisible(true);
                        this.getView().byId("btnHtml").setVisible(true);
                        this.getView().byId("btnContabilizar").setVisible(true);
                        this.getView().byId("panelTablaImpuestoDiferido").setVisible(true);
                        this.setColumnsVisible(this.getImpDifOri());
                        this.setTitle();
                        this.onRevisionCheck();
                    }
                    else {
                        this.getView().byId("btnExcel").setVisible(false);
                        this.getView().byId("btnHtml").setVisible(false);
                        this.getView().byId("btnContabilizar").setVisible(false);
                        this.getView().byId("panelTablaImpuestoDiferido").setVisible(false);
                        this.contrapartida="";
                        MessageBox.alert("No se encontraron datos con los filtros seleccionados");
                    }
                    
                } catch (err) {
                    sap.ui.core.BusyIndicator.hide();
                }

            },
            setTitle:function()
            {
                try
                {
                var texto1="<strong>Ledger Básico"+this.getLedgerBase()+"</strong>";
                var texto2="<strong>Ledger Comparativo"+this.getLedgerComparativo()+"</strong>";
                this.byId("tablaImpuestoDiferido").getColumns()[4].getAggregation("header").setProperty("htmlText",texto1);
                this.byId("tablaImpuestoDiferido").getColumns()[5].getAggregation("header").setProperty("htmlText",texto2);    
                }catch(ex)
                {
                    
                }
                
            },
            getCounty: function (oContext) {
                var sKey = oContext.getProperty('CalseCuenta') + "-" + oContext.getProperty('GrupoCta') + "-" + oContext.getProperty('TipoImp');
                return {
                    key: sKey,
                    text: sKey
                };
            },

            getGroup: function (oContext) {

                if(!this.getImpDifOri())
                {
                    var grupo = oContext.getProperty('GrupoCta');
                    var impu = oContext.getProperty('TipoImp');
                    var clase = oContext.getProperty('CalseCuenta');
                    var moneda = oContext.getProperty('Rtcur');
                    return grupo + '-' + impu + '-' + clase + '-' + moneda;
                }
            },
            getGroup3: function (position) {

              
                    var modelo=this.getView().getModel("modelo4").getData();
                    if(modelo.length>0)
                    {
                        
                        var grupo = modelo[position].GrupoCta;
                        var impu = modelo[position].TipoImp;
                        var clase = modelo[position].CalseCuenta;
                        var moneda = modelo[position].Rtcur;
                        return grupo + '-' + impu + '-' + clase + '-' + moneda;
                    }
                
            },
            getGroup2: function (oContext) {
                this.impu = oContext.getProperty('TipoImp')
                return this.impu;

            },

            getGroupHeader: function (oGroup) {

                this.grupo;
                this.impu;

                if(!this.getImpDifOri())
                {
                    return new sap.m.GroupHeaderListItem({

                        title: "Subtotal " + this.getGroupSum(oGroup.key)
                    });
                    
                }
                else
                {
                    var a=this.getGroupSum(oGroup.key?oGroup.key:oGroup);
                }
            },

            getGroupSum: function (sKey) {

                var datos = [];
                var that = this

                var KEY = sKey.split('-');
                if(KEY.length>4)
                {
                    KEY.splice(1, 1);
                }
                var grupo = KEY[0];
                var impu = KEY[1];
                var clase = KEY[2];
                var moneda = KEY[3];


                var aContexts = that.json.d.results,
                    iSum = 0,
                    sumtotal = 0,
                    sumtotalClas = 0;
                aContexts.forEach(function (oContext) {
                    if (oContext.GrupoCta === grupo && oContext.TipoImp === impu) {
                        var num01 = oContext.ImpDiferido
                        var mat = Number(num01)
                        var x100 = Math.round(mat * 100);
                        iSum += x100;
                    }

                });
                var formato = iSum.toLocaleString("es-CO");
                var suma = impu + ": " + String(formato);
                var sumafin = String(formato);


                this.subtotal.push({
                    suma: sumafin,
                    grupo: grupo,
                    impu: impu,
                    clase: clase,
                    moneda: moneda
                });
                return suma




            },
            buildODataFilterStringFromAppliedFilters: function(aFilters) {
                var aFilterParts = [];
            
                aFilters.forEach(function(oFilter) {
                    var sField = oFilter.sPath; // Nombre del campo
                    var sOperator = oFilter.sOperator; // Operador del filtro (eq, lt, gt, etc.)
                    var sValue = oFilter.oValue1; // Valor del filtro
            
                    // Construir cada parte del filtro
                    aFilterParts.push(sField + " " + sOperator + " '" + sValue + "'");
                });
            
                // Unir los filtros con "and" para cumplir el formato de OData
                return aFilterParts.join(" and ");
            },
            onRevisionCheck: function () {
                var oTable = this.byId("tablaImpuestoDiferido");
                var aItems = oTable.getItems();

                aItems.forEach(function (oItem) {
                    var oModelContext = oItem.getBindingContext("modelo4");
                    if (oModelContext) {
                        var oModelData = oModelContext.getObject();

                        // Verifica si oModelData es válido antes de usarlo
                        if (oModelData) {
                            var bCheckbox8Selected = oModelData.Permanente ? true : false;
                            var bCheckbox9Selected = oModelData.Imponible ? true : false;
                            var bCheckbox10Selected = oModelData.Deducible ? true : false;

                            // Establece la propiedad selected de los checkboxes
                            oItem.getCells()[7].setSelected(bCheckbox8Selected); // Checkbox 8
                            oItem.getCells()[8].setSelected(bCheckbox9Selected); // Checkbox 9
                            oItem.getCells()[9].setSelected(bCheckbox10Selected); // Checkbox 10
                        }
                    }
                });
            },
            /*
            onExport: function () {
                var aCols, oRowBinding, oSettings, oSheet, oTable;

                if (!this._oTable) {
                    this._oTable = this.byId("tablaImpuestoDiferido");
                }

                oTable = this._oTable;
                oRowBinding = oTable.getBinding("items");
                aCols = this.createColumnConfig();

                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: "Level"
                    },
                    dataSource: oRowBinding,
                    fileName: "Impuesto Diferido.xlsx",
                    worker: false, // We need to disable worker because we are using a MockServer as OData Service
                    onBeforeExport: function (oEvent) {
                        var oSheet = oEvent.getParameter("exportSettings").workbook.getWorksheet(0);
                        var aRows = oSheet.getRows();

                        aRows.forEach(function (oRow) {
                            oRow.eachCell({ includeEmpty: true }, function (cell, colNumber) {
                                var value = cell.value;
                                if (value === true || value === "true") {
                                    cell.value = "X";
                                }
                            });
                        });
                    }
                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },*/
            onExport: function () {
                var aCols, oRowBinding, oSettings, oSheet, oTable;
                var oController = this;
            
                if (!this._oTable) {
                    this._oTable = this.byId("tablaImpuestoDiferido");
                }
            
                oTable = this._oTable;
                oRowBinding = oTable.getBinding("items");
                aCols = this.createColumnConfig();
            
                // Realizar validación previa para determinar el tipo de exportación
                var bIncludeGroupHeaders = this.getImpDifOri(); // Método para validar si se incluyen encabezados
            
                if (!bIncludeGroupHeaders) {
                    // Configuración con encabezados de grupo
                    var aData = [];
                    var aContexts = oRowBinding.getContexts();
            
                    // Variables para mantener el estado de los grupos actuales
                    var sLastGroupKey = null;
            
                    // Recorrer los datos y agregar encabezados de grupo cuando sea necesario
                    aContexts.forEach(function (oContext, i) {
                        var oRowData = oContext.getObject();
            
                        // Construir la clave del grupo actual para comparación
                        var sCurrentGroupKey = oRowData.GrupoCta + "-" + oRowData.TipoImp;
            
                        // Si la clave de grupo cambia o es el primer grupo, agregar un subtotal antes de las filas de datos
                        if (sLastGroupKey !== sCurrentGroupKey) {
                            if (sLastGroupKey !== null) {
                                // Agregar el subtotal del grupo anterior
                                var sSubtotal = oController.getGroupSum(sLastGroupKey);
                                aData.push({
                                    CalseCuenta: "Subtotal " + sSubtotal, // Subtotal en la primera columna como encabezado
                                    GrupoCta: "", // Dejar las otras columnas en blanco
                                    Racct: "",
                                    Txt50: "",
                                    LedgerBasico: "",
                                    LedgerComp: "",
                                    Diferencia: "",
                                    Permanente: "",
                                    Imponible: "",
                                    Deducible: "",
                                    TarifaImp: "",
                                    ImpDiferido: "",
                                    TipoImp: "",
                                    FechaEjecucion:"",
                                    style: { bold: true } // Aplicar estilo bold
                                });
                            }
            
                            // Actualizar la clave del último grupo
                            sLastGroupKey = sCurrentGroupKey;
                        }
            
                        // Agregar la fila de datos actual
                        aData.push({
                            CalseCuenta: oRowData.CalseCuenta,
                            GrupoCta: oRowData.GrupoCta,
                            Racct: oRowData.Racct,
                            Txt50: oRowData.Txt50,
                            LedgerBasico: oRowData.LedgerBasico,
                            LedgerComp: oRowData.LedgerComp,
                            Diferencia: oRowData.Diferencia,
                            Permanente: oRowData.Permanente,
                            Imponible: oRowData.Imponible,
                            Deducible: oRowData.Deducible,
                            TarifaImp: oRowData.TarifaImp,
                            ImpDiferido: oRowData.ImpDiferido,
                            TipoImp: oRowData.TipoImp,
                            FechaEjecucion:oRowData.FechaEjecucion
                        });
                    });
            
                    // Agregar el subtotal para el último grupo si hay datos
                    if (sLastGroupKey) {
                        var sFinalSubtotal = oController.getGroupSum(sLastGroupKey);
                        aData.push({
                            CalseCuenta: "Subtotal " + sFinalSubtotal, // Encabezado en la primera columna
                            GrupoCta: "",
                            Racct: "",
                            Txt50: "",
                            LedgerBasico: "",
                            LedgerComp: "",
                            Diferencia: "",
                            Permanente: "",
                            Imponible: "",
                            Deducible: "",
                            TarifaImp: "",
                            ImpDiferido: "",
                            TipoImp: "",
                            style: { bold: true } // Aplicar estilo bold
                        });
                    }
            
                    // Ajuste de configuración para incluir encabezados personalizados
                    oSettings = {
                        workbook: {
                            columns: aCols,
                            hierarchyLevel: "Level"
                        },
                        dataSource: aData,
                        fileName: "Impuesto_Diferido.xlsx",
                        worker: false, // Necesario para deshabilitar worker porque se está usando un MockServer como OData Service
                        onBeforeExport: function (oEvent) {
                            var oSheet = oEvent.getParameter("exportSettings").workbook.getWorksheet(0);
                            var aRows = oSheet.getRows();
                            
                               // Obtener la fecha actual
                            var oDate = new Date();
                            var sDate = oDate.toLocaleDateString() + " " + oDate.toLocaleTimeString();
                            
                            // Insertar la fila con la fecha de generación en la primera posición
                            aRows.unshift({
                                cells: [
                                    { value: "Fecha de generación del reporte: " + sDate }
                                ]
                            });

                            aRows.forEach(function (oRow) {
                                oRow.eachCell({ includeEmpty: true }, function (cell, colNumber) {
                                    var value = cell.value;
                                    if (value === true || value === "true") {
                                        cell.value = "X";
                                    }
                                    // Aplicar estilo bold a las filas de subtotales
                                    if (value && value.toString().startsWith("Subtotal")) {
                                        cell.font = { bold: true };
                                    }
                                });
                            });
                        }
                    };
            
                } else {
                    // Configuración original sin encabezados de grupo
                    oSettings = {
                        workbook: {
                            columns: aCols,
                            hierarchyLevel: "Level"
                        },
                        dataSource: oRowBinding,
                        fileName: "Impuesto_Diferido.xlsx",
                        worker: false, // Necesario para deshabilitar worker porque se está usando un MockServer como OData Service
                        onBeforeExport: function (oEvent) {
                            var oSheet = oEvent.getParameter("exportSettings").workbook.getWorksheet(0);
                            var aRows = oSheet.getRows();
            
                            aRows.forEach(function (oRow) {
                                oRow.eachCell({ includeEmpty: true }, function (cell, colNumber) {
                                    var value = cell.value;
                                    if (value === true || value === "true") {
                                        cell.value = "X";
                                    }
                                });
                            });
                        }
                    };
                }
            
                oSheet = new sap.ui.export.Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },
            getGroupHeaderForRow: function (oRowData, iRowIndex, aData, oController) {
                var grupo = oRowData.GrupoCta;
                var impu = oRowData.TipoImp;
                var clase = oRowData.Clase;
                var moneda = oRowData.Moneda;
            
                // Construir la clave de grupo
                var sKey = grupo + '-' + impu + '-' + clase + '-' + moneda;
            
                // Llamar a getGroupSum para obtener el subtotal
                var sSubtotal = oController.getGroupSum(sKey);
            
                // Si es el inicio de un nuevo grupo, devolver el encabezado
                if (iRowIndex === 0 || (aData[iRowIndex - 1].GrupoCta !== grupo || aData[iRowIndex - 1].TipoImp !== impu)) {
                    return "Subtotal " + sSubtotal;
                }
            
                // Si no es un nuevo grupo, devolver null
                return null;
            },
            
            exportTableToHTML: function() {
                // Referencia a la tabla
                var oTable = this.byId("tablaImpuestoDiferido");
                var oDate = new Date();
                var sDate = oDate.toLocaleDateString() + " " + oDate.toLocaleTimeString();
                // Inicio del HTML
                var sHtml = "<html><head><title>Exported Table</title></head><body>";
                sHtml += "<table border='1'><thead><tr>";
                // Añadir la columna de "Fecha de ejecución" al encabezado
                var columns = oTable.getColumns();
                var that=this;
                // Añadir las cabeceras de las columnas
                columns.forEach(function(column) {
                    var sHeaderText = column.getHeader().mProperties.htmlText; // Obtener el texto del encabezado
                    if(sHeaderText.includes(that.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp5")))
                    {
                        sHeaderText="<strong>"+that.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp5")+that.getLedgerBase()+"</strong>";
                    }
                    else if(sHeaderText.includes(that.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp6")))
                    {
                        sHeaderText="<strong>"+that.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp6")+that.getLedgerComparativo()+"</strong>";
                    }   
                    sHtml += "<th>" + sHeaderText + "</th>";
                });
                sHtml += "<th>Fecha de Ejecución</th>";
                sHtml += "</tr></thead><tbody>";
            
                // Obtener los items (filas) de la tabla
                var aItems = oTable.getItems();
                console.log(aItems);
                // Iterar sobre las filas para añadir los datos de cada columna
                aItems.forEach(function(item) {
                    if (item.getCells) { // Verificar que el item tenga el método getCells
                        sHtml += "<tr>";
                        item.getCells().forEach(function(cell, index) {
                            var sText = "";
                            // Verificar si la columna es una de las específicas (columnImpDif8, columnImpDif9, columnImpDif10)
                            if (index === 7 || index === 8 || index === 9) { // Asegúrate de que estos índices coinciden con las columnas correspondientes
                                // Si es verdadero, coloca "X", de lo contrario, deja vacío
                                sText = cell?.mProperties?.selected === true ? "X" : "";
                            } else if (cell.getText) {
                                // Para las otras celdas, simplemente obtener el texto
                                sText = cell.getText();
                            }
            
                            sHtml += '<td style="text-align: center;">' + sText + "</td>";
                        });
                        sHtml += '<td style="text-align: center;">' + sDate + "</td>";
                        sHtml += "</tr>";
                    }
                    else
                    {
                        sHtml += "<tr>";
                        sHtml +=`<td colspan="${columns.length + 1}">${item.mProperties.title}</td>`;
                        sHtml += "</tr>";
                    }
                });
            
                sHtml += "</tbody></table></body></html>";
            
                // Crear un Blob con el contenido HTML
                var blob = new Blob([sHtml], { type: "text/html" });
                
                // Crear un enlace temporal para la descarga
                var link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "tablaImpuestoDiferido.html";
                document.body.appendChild(link);
                link.click();
            
                // Remover el enlace temporal
                document.body.removeChild(link);
            },
            onNavBack: function () {
                var oHistory = sap.ui.core.routing.History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteparamSelec", {}, true /*no history*/);
                }
            },
            createColumnConfig: function () {

                var aCols = [];

                aCols.push({
                    label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp1"),
                    property: "CalseCuenta",
                    type: EdmType.String
                });

                aCols.push({
                    label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp2"),
                    property: "GrupoCta",
                    type: EdmType.String
                });

                aCols.push({
                    label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp3"),
                    property: "Racct",
                    type: EdmType.String
                });

                aCols.push({
                    label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp4"),
                    property: "Txt50",
                    type: EdmType.String
                });

                aCols.push({
                    label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp5")+this.getLedgerBase(),
                    property: "LedgerBasico",
                    type: EdmType.String
                });

                aCols.push({
                    label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp6")+this.getLedgerComparativo(),
                    property: "LedgerComp",
                    type: EdmType.String
                });

                aCols.push({
                    label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp7"),
                    property: "Diferencia",
                    type: EdmType.String
                });

                aCols.push({
                    label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp8"), //este es checkbox
                    property: "Permanente",
                    type: EdmType.boolean
                });
                aCols.push({
                    label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp9"), //este es checkbox
                    property: "Imponible",
                    type: EdmType.Boolean
                });
                aCols.push({
                    label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp10"), //este es checkbox
                    property: "Deducible",
                    type: EdmType.Boolean
                });
                aCols.push({
                    label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp11"),
                    property: "TarifaImp",
                    type: EdmType.String
                });
                aCols.push({
                    label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp12"),
                    property: "ImpDiferido",
                    type: EdmType.String
                });
                aCols.push({
                    label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp13"),
                    property: "TipoImp",
                    type: EdmType.String
                });
                aCols.push({
                    label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp17"),
                    property: "FechaEjecucion",
                    type: EdmType.String
                });

                return aCols;
            },
            onCheckboxSelectPerm: function (oEvent) {
                var bSelected = oEvent.getParameter("selected");
                if (bSelected === true) {
                    this.Permanente = "X";
                } else {
                    this.Permanente = " ";
                }
            },
            onCheckboxSelectImpo: function (oEvent) {
                var bSelected = oEvent.getParameter("selected");
                if (bSelected === true) {
                    this.Imponible = "X";
                } else {
                    this.Imponible = " ";
                }
            },
            onCheckboxSelectPornc: function (oEvent) {
                var bSelected = oEvent.getParameter("selected");
                if (bSelected === true) {
                    this.Deducible = "X";
                } else {
                    this.Deducible = " ";
                }
            },
            onContabilizar: function () {
                var that=this;
             MessageBox.confirm("¿Está seguro que desea contabilizar?", {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        that.onContabilizar2();
                    } else {
                       return;
                    }
                }
            });               
            },
            onContabilizar2: function(){
                sap.ui.core.BusyIndicator.show(true);
                let ImpDifCont = [];
                if(this.subtotal.length==0)
                {
                    var model=this.getView().getModel("modelo4").getData();
                    for(let j = 0; j < model.length; j++)
                    {

                        this.subtotal.push({
                            suma: model[j].ImpDiferido.split(".").join(""),
                            grupo: "",
                            impu: model[j].TipoImp,
                            clase: "",
                            moneda: model[j].Rtcur,
                            contrapartida:model[j].Contrapartida
                        });
                        //var oGroup=this.getGroup3(j);
                        //this.getGroupHeader(oGroup);
                    }
                }
                for (let i = 0; i < this.subtotal.length; i++) {

                    var num = this.subtotal[i].suma;
                    let textoSinPuntos = num.replace(/\./g, '');



                    ImpDifCont.push({
                        Pbukrs: this.Sociedad,
                        Ostatus: "",
                        Oclascta: this.subtotal[i].clase,
                        Ogrupcuentas: this.subtotal[i].grupo,
                        Oclasectas: this.subtotal[i].impu,
                        Ocuenta: this.subtotal[i].contrapartida,
                        Ocuentagasto: "",
                        Oimpuesto: textoSinPuntos,
                        Omoneda: this.subtotal[i].moneda,
                        Odocumento: "",
                        Omensaje: ""
                    })
                }
                var oSmartFilterBar = this.byId("smart");
                var aFilterData = oSmartFilterBar.getFilterData();
                try
                {
                    var script = {
                        "Pbukrs": aFilterData["Pbukrs"].ranges[0].value1,//this.Sociedad,
                        "Pfechacont": aFilterData["Pbudat"].ranges[0].value1,//this.fechCont,
                        "Pldgrp": aFilterData["Pldgrp"].items[0].key,//this.GLedger,
                        "Pfechcontrev": aFilterData["Pfechcontrev"].ranges[0].value1,
                        "Preversar": this.formatBoolean(aFilterData["Preversar"]),
                        "Pfechjobrev": aFilterData["Pfechjobrev"]?aFilterData["Pfechjobrev"].ranges[0].value1:"",
                        "Pbtoper": aFilterData["Pbtoper"].items.length>0?aFilterData["Pbtoper"].items[0].key:aFilterData["Pbtoper"].value,
                        "Ptest": this.formatBoolean(aFilterData["Ptest"]),
                        "ImpDifOri":this.formatBoolean2(aFilterData["ImpDifOri"]),
                        ImpDifCont
                    }
                }catch(ex)
                {
                    console.log(ex);
                }

                //URL DEL PORTAL


                var modelo = "/sap/opu/odata/sap/ZFI_IMP_DIFERIDO_CONT_SRV"
                var oModel = new sap.ui.model.odata.v2.ODataModel(modelo);
                var that = this;

                let modeloSuma = [];
                let modeloLedger=[];
                modeloLedger.push(script.Pldgrp);

                oModel.create("/CabeceraSet", script, {
                    success: function (oData, oResponse) {
                        //   console.log(oData)
                        //   console.log(oResponse)
                    if(!oResponse.data.Mensaje)
                    {        
                        for (let j = 0; j < oResponse.data.ImpDifCont.results.length; j++) {
                            modeloSuma.push({
                                Oclascta: oResponse.data.ImpDifCont.results[j].Oclascta,
                                Oclasectas: oResponse.data.ImpDifCont.results[j].Oclasectas,
                                Ocuenta: oResponse.data.ImpDifCont.results[j].Ocuenta,
                                Ocuentagasto: oResponse.data.ImpDifCont.results[j].Ocuentagasto,
                                Odocumento: oResponse.data.ImpDifCont.results[j].Odocumento,
                                Ogrupcuentas: oResponse.data.ImpDifCont.results[j].Ogrupcuentas,
                                Oimpuesto: oResponse.data.ImpDifCont.results[j].Oimpuesto,
                                Omensaje: oResponse.data.ImpDifCont.results[j].Omensaje,
                                Omoneda: oResponse.data.ImpDifCont.results[j].Omoneda,
                                Ostatus: oResponse.data.ImpDifCont.results[j].Ostatus,
                                Pbukrs: oResponse.data.ImpDifCont.results[j].Pbukrs
                            });
                        }
                        sap.ui.getCore().setModel(modeloSuma, "modeloSuma");
                        sap.ui.getCore().setModel(modeloLedger,"modeloLedger");
                        that.onPasarTabla();
                        sap.ui.core.BusyIndicator.hide();
                    }else
                    {
                        MessageBox.alert(oResponse.data.Mensaje);
                        sap.ui.core.BusyIndicator.hide();
                        return;
                    }

                    },
                    error: function (oError) {
                        console.log(oError.message);
                        console.log(oError.responseText);
                        sap.ui.core.BusyIndicator.hide();
                    }
                });
            },
            onPasarTabla: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("tablaSumatoria");
            },

            onSearch: function (oEvent) {
                var d = oEvent;

                var params = this.byId("smart");
                var oSmartTable = this.byId("tablaImpuesto"); // Cambia el ID si es necesario

                // Obtener el binding del modelo que está relacionado con los items de la tabla
                var oTable = oSmartTable.getTable();
                var oBinding = oTable.getBinding("rows"); // El binding de los items de la tabla
            
                // Obtener los filtros aplicados al binding
                if(oBinding)
                {
                     var aAppliedFilters = oBinding.aFilters;
                    
                    // Verificar si hay filtros aplicados
                    if (aAppliedFilters && aAppliedFilters.length > 0) {
                        console.log("Filtros aplicados:", aAppliedFilters);
                
                        // Si necesitas construir una cadena de filtro OData a partir de estos filtros
                        var sODataFilterString = this.buildODataFilterStringFromAppliedFilters(aAppliedFilters);
                        console.log("Cadena de filtros OData:", sODataFilterString);
                    } else {
                        console.log("No hay filtros aplicados");
                    }
                }
  
                sap.ui.core.BusyIndicator.hide();
            },
            onGetFilter: function(oEvent){
                 
                var d=oEvent;
                var oTable=this.getView().byId("tablaImpuesto").getTable();
                var params = this.byId("smart");
                if(oTable)
                {
                    var oBinding=oTable.getBinding("rows");
                    if(oBinding)
                    {
                        var oFilter=oBinding.sFilterParams;
                        console.log(oFilter);
                        if(this.getImpDifOri())
                        {
                            this.onRellenarTabla(oFilter);
                        }
                        else
                        {
                            if(this.byId("smart").getFilterData()["PtarifImp"])
                            {
                                this.onRellenarTabla(oFilter);
                            }
                            else
                            {
                                MessageBox.alert("Por favor ingresar Tarifa de impuesto");
                                return;    
                            }
                        }
                    }
                    else
                    {
                        
                        params.search();
                    }
    
                }                          
            },
            handleChange: function (oEvent) {
                try {
                    var oSmartFilterBar = oEvent.getSource();      
                    var filterChanged=oEvent.getParameters('value').getParameters().id;
                    if(oSmartFilterBar)
                    {
                        var filterData=oSmartFilterBar.getFilterData();    
                        if(filterChanged)
                        {
                            //Validación año
                            if(filterChanged.includes("Pryear"))
                            {
                                var yearPattern = /^\d{4}$/;
                                var sPryearValue = filterData["Pryear"].value;
                                if (sPryearValue && !yearPattern.test(sPryearValue)) {
                                    // Mostrar mensaje de error si el formato es incorrecto
                                    
                                    MessageBox.alert("Formato de año inválido. Ingrese un año en formato 'yyyy'.");    
                                    // Resetear el valor del campo
                                    oSmartFilterBar.getControlByKey("Pryear").setValue("");
                                }

                            }
                            //Validación fecha reversion contabilización
                            else if(filterChanged.includes("Pfechcontrev"))
                            {
                                if(!filterData["Pbudat"])
                                {
                                    MessageBox.alert("Por favor diligenciar la fecha de Contabilización primero");
                                    filterData["Pfechcontrev"] = 
                                    { items: [],
                                        ranges: [],
                                        value: null
                                    }; // Resetear el campo específico
                                    oSmartFilterBar.setFilterData(filterData,true); 
                                    return;
                                }
                                else
                                {
                                    let Pbudat=filterData["Pbudat"].ranges[0].value1;
                                    let oPbudat=this.stringToDate(Pbudat);//new Date(Pbudat);
                                    let sSelectedDate=filterData["Pfechcontrev"].ranges[0].value1;
                                    let oSelectedDate = this.stringToDate(sSelectedDate);//new Date(sSelectedDate);
                                    if(oPbudat>oSelectedDate)
                                    {
                                        MessageBox.alert("La fecha de reversión no puede ser menor que la fecha de contabilización");
                                        filterData["Pfechcontrev"] = 
                                        { items: [],
                                            ranges: [],
                                            value: null
                                        };
                                        oSmartFilterBar.setFilterData(filterData,true);
                                        return;
                                    }
                                    else
                                    {
                                        if(!this.areDatesInDifferentMonths(oPbudat,oSelectedDate))
                                        {
                                            MessageBox.alert("La fecha de reversión debe estar en un mes distinto a la fecha de contabilización");
                                            filterData["Pfechcontrev"] = 
                                            { items: [],
                                                ranges: [],
                                                value: null
                                            };
                                            oSmartFilterBar.setFilterData(filterData,true);
                                            return;    
                                        }
                                    }
                                }
                                /*      
                                var sSelectedDate=filterData["Pfechcontrev"].ranges[0].value1;
                                var oSelectedDate = this.stringToDate(sSelectedDate);
                                var oToday = new Date();
                                oToday.setHours(0, 0, 0, 0);
                                if (oSelectedDate < oToday) {
                                    // Mostrar mensaje de error
                                    MessageBox.alert("La fecha seleccionada no puede ser anterior a hoy.");
                        
                                    // Resetear el valor del campo de fecha usando setFilterData
                                 // Obtener todos los filtros actuales
                                    filterData["Pfechcontrev"] = 
                                    { items: [],
                                        ranges: [],
                                        value: null
                                    }; // Resetear el campo específico
                                    oSmartFilterBar.setFilterData(filterData,true);  // Aplicar los datos modificados
                                } 
                                    */
                            }
                            else if(filterChanged.includes("Pfechjobrev"))
                            {
                                if(filterData["Preversar"])
                                {
                                    var bReversar=filterData["Preversar"].ranges[0].value1;
                                    if(!bReversar)
                                    {
                                      MessageBox.alert("No se puede diligenciar la fecha ya que no se desea reversar la contabilización");
                                      filterData["Pfechjobrev"] = 
                                        { items: [],
                                            ranges: [],
                                            value: null
                                        }; // Resetear el campo específico
                                        oSmartFilterBar.setFilterData(filterData,true); 
                                    }
                                }
                                if(filterData["Pfechcontrev"])
                                {
                                    
                                        var oSelectedDate=this.stringToDate(filterData["Pfechjobrev"].ranges[0].value1);
                                        var oSelectedDate2=this.stringToDate(filterData["Pfechcontrev"].ranges[0].value1);
                                        if(oSelectedDate<oSelectedDate2)
                                        {
                                            MessageBox.alert("La Fecha de JOB de Reversión debe ser superior a La fecha de reversión de la contabilización");
                                            filterData["Pfechjobrev"] = 
                                                { items: [],
                                                    ranges: [],
                                                    value: null
                                                }; // Resetear el campo específico
                                                oSmartFilterBar.setFilterData(filterData,true); 
                                        }
                                    
                                }  
                            }
                            else if(filterChanged.includes("Pbudat"))
                            {
                                if(filterData["Pfechcontrev"])
                                {
                                    let Pbudat=filterData["Pbudat"].ranges[0].value1;
                                    let oPbudat=this.stringToDate(Pbudat);//new Date(Pbudat);
                                    let sSelectedDate=filterData["Pfechcontrev"].ranges[0].value1;
                                    let oSelectedDate = this.stringToDate(sSelectedDate);//new Date(sSelectedDate);
                                    if(oPbudat>oSelectedDate)
                                    {
                                        MessageBox.alert("La fecha de reversión no puede ser menor que la fecha de contabilización");
                                        filterData["Pbudat"] = 
                                        { items: [],
                                            ranges: [],
                                            value: null
                                        };
                                        oSmartFilterBar.setFilterData(filterData,true);
                                        return;
                                    }
                                    else
                                    {
                                        if(!this.areDatesInDifferentMonths(oPbudat,oSelectedDate))
                                        {
                                            MessageBox.alert("La fecha de reversión debe estar en un mes distinto a la fecha de contabilización");
                                            filterData["Pbudat"] = 
                                            { items: [],
                                                ranges: [],
                                                value: null
                                            };
                                            oSmartFilterBar.setFilterData(filterData,true);
                                            return;    
                                        }
                                    }     
                                }
                                
                            }
                        }
                    }    
                } catch (error) {
                    console.log(error);
                }
                
            },
            stringToDate:  function (dateString) {
                // Extraer el año, mes y día de la cadena
                const year = dateString.substring(0, 4);
                const month = dateString.substring(4, 6) - 1; // Los meses en JavaScript van de 0 a 11
                const day = dateString.substring(6, 8);
                
                // Crear y devolver el objeto Date
                return new Date(year, month, day);
            },
            areDatesInDifferentMonths: function(date1, date2) {
                
                const month1 = date1.getMonth(); 
                const month2 = date2.getMonth();
                
                // Comparar si el año y el mes son distintos
                return month1 !== month2;
            },
            formatBoolean: function(array)
            {
                if(array)
                {
                    if(array.items.length>0)
                    {
                        if(array.items[0].key)
                        {
                            return "X";
                        }
                        else
                        {
                            return "";
                        }
                    }
                    else if(array.ranges.length>0)
                    {
                        if(array.ranges[0].value1)
                        {
                            return "X";
                        }
                        else
                        {
                            return "";
                        }
                    }
                }
                else
                {
                    return "";
                }
            },
            setColumnsVisible: function(impOri)
            {
                if(impOri)
                {
                    this.byId("columnImpDif16").setVisible(true);
                    this.byId("columnImpDif8").setVisible(false);
                    this.byId("columnImpDif9").setVisible(false);
                    this.byId("columnImpDif10").setVisible(false);
                    this.byId("columnImpDif1").setVisible(false);
                    this.byId("columnImpDif2").setVisible(false);
                }
                else
                {
                    this.byId("columnImpDif16").setVisible(false);
                    this.byId("columnImpDif8").setVisible(true);
                    this.byId("columnImpDif9").setVisible(true);
                    this.byId("columnImpDif10").setVisible(true);
                    this.byId("columnImpDif1").setVisible(true);
                    this.byId("columnImpDif2").setVisible(true);
                }
            },
            getImpDifOri: function()
            {
                var impOri;
                var filterData=this.byId("smart").getFilterData();
                if(filterData["ImpDifOri"])
                {
                    if(filterData.ImpDifOri.ranges.length>0)
                    {
                        impOri=filterData.ImpDifOri.ranges[0].value1
                    }
                    else
                    {
                        impOri=false;
                    }
                }
                else
                {
                    impOri=false;
                }
                return impOri;
            },
            getLedgerBase:function()
            {
                var filterData=this.byId("smart").getFilterData();
                if(filterData["Brldnr"])
                {
                    if(filterData.Brldnr.items.length>0)
                        {
                            return " -"+filterData.Brldnr.items[0].key;
                        }
                    else if(filterData.Brldnr.ranges.length>0)
                    {
                        return " -"+filterData.Brldnr.ranges[0].value1
                    }
                    else
                    {
                        return "";
                    }   
                }
                else
                {
                    return "";
                }
            },
            getLedgerComparativo:function()
            {
                var filterData=this.byId("smart").getFilterData();
                if(filterData["Prldnr"])
                {
                    if(filterData.Prldnr.items.length>0)
                        {
                            return " -"+filterData.Prldnr.items[0].key;
                        }
                    else if(filterData.Prldnr.ranges.length>0)
                    {
                        return " -"+filterData.Prldnr.ranges[0].value1
                    }
                    else
                    {
                        return "";
                    }   
                }
                else
                {
                    return "";
                }
            },
            formatBoolean2: function(array)
            {
               if(array)
                {
                    if(array.ranges.length>0)
                        {
                            if(array.ranges[0].value1)
                            {
                                return true;
                            }
                            else
                            {
                                return false;
                            }
                        }
                        else{
                            return false;
                        }
                }     
            }
        });
    });
