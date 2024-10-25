sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
  ],
    function (BaseController, JSONModel, exportLibrary, Spreadsheet) {
      "use strict";
      var EdmType = exportLibrary.EdmType;
      return BaseController.extend("isagen.reportimpdiferido.controller.tablaSumatoria", {
        oModel: "",
        grupoLedger:"",
        onInit: function () {
          
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          // Validate/Match the Router Details sent from source using oRouter.navTo("Router_Detail", {SelectedItem: selectPO});
          oRouter.getRoute("tablaSumatoria").attachMatched(this._onRouteFound, this);

        },
        _onRouteFound: function(){
          this.oModel = sap.ui.getCore().getModel("modeloSuma");
          this.grupoLedger=sap.ui.getCore().getModel("modeloLedger");
          this.setTitle();
          
          this.onRellenartabla();
        },
        setTitle:function(){
        try{
        var texto="<strong>Impuesto -"+this.grupoLedger+"</strong>";
          this.byId("tablaSumatoria").getColumns()[5].getAggregation("header").setProperty("htmlText",texto);
          
        }catch(ex)
        {
          
        }
        },
        onAfterRendering: function () {
  
         this.oModel = sap.ui.getCore().getModel("modeloSuma");
         this.onRellenartabla();
  
        },
        onExport: function(){
          var aCols, oRowBinding, oSettings, oSheet, oTable;

          if (!this._oTable) {
              this._oTable = this.byId("tablaSumatoria");
          }

          oTable = this._oTable;
          oRowBinding = oTable.getBinding("items");
          var aItems = oRowBinding.getContexts().map(function(oContext) {
            return oContext.getObject();  // Obtener el objeto de cada contexto (cada fila de datos)
        });
    
        // Aquí puedes añadir un campo nuevo a todos los items. Ejemplo, agregar un campo "NuevoCampo"
        aItems.forEach(function(oItem) {
            oItem.FechaEjecucion = new Date().toLocaleDateString(); // Puedes definir el valor que deseas agregar para este nuevo campo
        });
          aCols = this.createColumnConfig();

          oSettings = {
              workbook: {
                  columns: aCols,
                  hierarchyLevel: "Level"
              },
              dataSource: oRowBinding,
              fileName: "Contabilizacion.xlsx",
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
        },
        createColumnConfig: function () {

          var aCols = [];

          aCols.push({
              label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaSum1"),
              property: "Ostatus",
              type: EdmType.String
          });

          aCols.push({
              label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaSum2"),
              property: "Ogrupcuentas",
              type: EdmType.String
          });

          aCols.push({
              label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaSum3"),
              property: "Oclasectas",
              type: EdmType.String
          });

          aCols.push({
              label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaSum4"),
              property: "Ocuenta",
              type: EdmType.String
          });

          aCols.push({
              label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaSum5"),
              property: "Ocuentagasto",
              type: EdmType.String
          });

          aCols.push({
              label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaSum6")+"-"+this.grupoLedger,
              property: "Oimpuesto",
              type: EdmType.String
          });

          aCols.push({
              label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaSum7"),
              property: "Odocumento",
              type: EdmType.String
          });

          aCols.push({
              label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaSum8"), 
              property: "Omensaje",
              type: EdmType.String
          });
          aCols.push({
            label: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titTablaImp17"), 
            property: "FechaEjecucion",
            type: EdmType.String
        });
            return aCols;
      },
        onRellenartabla: function(){
  
          var datos = [];
          for(let i=0; i<this.oModel.length; i++){
  
            if((this.oModel[i].Oimpuesto).includes("-"))
            {
              this.oModel[i].Oimpuesto = (this.oModel[i].Oimpuesto).replace("-"," ");
              var numero = Number(this.oModel[i].Oimpuesto);
            var format = numero.toLocaleString("de-DE");
            var num = format.toString(format);
            var Oimpuesto = "-" + num;
            }else{
            var numero = Number(this.oModel[i].Oimpuesto);
            var format = numero.toLocaleString("de-DE");
            var Oimpuesto = format.toString(format);
            }
  
              datos.push({
                Oclascta: this.oModel[i].Oclascta,
                Oclasectas: this.oModel[i].Oclasectas,
                Ocuenta: this.oModel[i].Ocuenta,
                Ocuentagasto: this.oModel[i].Ocuentagasto,
                Odocumento: this.oModel[i].Odocumento,
                Ogrupcuentas: this.oModel[i].Ogrupcuentas,
                Oimpuesto: Oimpuesto,
                Omensaje: this.oModel[i].Omensaje,
                Omoneda: this.oModel[i].Omoneda,
                Ostatus: this.oModel[i].Ostatus,
                Pbukrs: this.oModel[i].Pbukrs
              });
          }
            var odata = new JSONModel(datos);
            this.getView().setModel(odata, "modeloSuma");
  
  
        }
  
      });
    }
  );