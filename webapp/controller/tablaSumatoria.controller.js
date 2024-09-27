sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
  ],
    function (BaseController, JSONModel) {
      "use strict";
  
      return BaseController.extend("isagen.reportimpdiferido.controller.tablaSumatoria", {
        oModel: "",
  
        onInit: function () {
          
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          // Validate/Match the Router Details sent from source using oRouter.navTo("Router_Detail", {SelectedItem: selectPO});
          oRouter.getRoute("tablaSumatoria").attachMatched(this._onRouteFound, this);

        },
        _onRouteFound: function(){
          this.oModel = sap.ui.getCore().getModel("modeloSuma");
          this.onRellenartabla();
        },
        onAfterRendering: function () {
  
         this.oModel = sap.ui.getCore().getModel("modeloSuma");
         this.onRellenartabla();
  
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