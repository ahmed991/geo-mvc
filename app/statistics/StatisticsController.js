import { createMap } from "../tools.js";
import { getDistricts } from "./DistrictModel.js";
import { getColorSet } from "./ColorModel.js";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";

import * as d3 from "d3";

export let StatsCtrl = {
  navMap: null,
  district: null,
  barChart: null,
  pieChart: null,


  /*- View initialization function -*/
  onViewReady: function () {
    let mapPanel = webix.$$("sts_map");
    mapPanel.getNode().innerHTML =
      '<div class="nav_map" id="' + mapPanel.config.id + '_div"></div>';
    this.navMap = createMap(mapPanel.config.id);
    this.navMap.getView().setCenter(appdata.cityCoords);
    this.navMap.getView().setZoom(appdata.zoom);

    this.navMap.addLayer(
        new TileLayer({
            name: 'District Boundaries',
            source: new TileWMS({
                url: 'https://gisedu.itc.utwente.nl/cgi-bin/mapserv.exe?',
                params: {
                    'MAP': 'd:/iishome/student/s3182363/gpw/CityApp/api/adminboundaries.map',
                    'LAYERS': 'district',
                    'SERVER': 'MapServer',
                    'TILED': true
                }
            }),
            visible: true
        })
    );
    this.navMap.addLayer(
      new TileLayer({
        name: "Municipal Boundaries",
        source: new TileWMS({
          url: "https://service.pdok.nl/cbs/wijkenbuurten/2022/wms/v1_0?",
          params: {
            LAYERS: "gemeenten",
            TILED: true,
          },
        }),
        visible: true,
      })
    );

    getDistricts(appdata.cityName).then(
      (response) => {
        StatsCtrl.district = response.json();
        StatsCtrl.drawBarChart("sts_barchart");
        StatsCtrl.drawPieChart('sts_piechart');
        StatsCtrl.drawPieLegend('sts_pielegend');
      },
      (error) => {
        console.log(error);
      }
    );
  },

      /**
     * Render the pie chart legend
     * @param {string} targetPanel - The 'id' of the HTML element that will contain the legend object.
     */
      drawPieLegend: function(targetPanel){
        var lg = new Object;
        lg.panel = webix.$$(targetPanel);
        lg.panel.$view.innerHTML = '<div class="pie_legend" id="'+lg.panel.config.id+'_div"></div>';

        lg.width = lg.panel.$width;
        lg.height = lg.panel.$height;

        /* Legend object */
        lg.obj = d3.select("#" + lg.panel.config.id + '_div').append("svg")
            .attr('id','pie_legend')
            .attr("width", lg.width)
            .attr("height", lg.height);

            d3.json("https://gisedu.itc.utwente.nl/student/s3182363/gpw/CityApp/api/landuseclasses.py")
            .then((landuseClasses)=>{
                         /* Define row sizes and margin for the legend items */
                         var square = 28; /* size of the color squares */
                         var top = (lg.height - square * (landuseClasses.length - 1)) * 0.6;
         
                         /* Containers for each legend item */
                         lg.obj.selectAll('.legend-element')
                             .data(landuseClasses)
                           .enter()
                             .append('g')
                             .attr('id',function(r){ return r.code; })
                             .attr('class','legend-element')
                             .attr('transform', function(r, i){
                                 var x = 5;
                                 var y = i * square + top;
                                 return 'translate(' + x + ',' + y + ')';
                             });
         
                         /* Color squares */
                         lg.obj.selectAll('.legend-element')
                             .append('rect')
                             .attr('width', square/2)
                             .attr('height', square/2)
                             .style("fill-opacity", 0.6)
                             .style('fill', function(r){
                                 return getColorSet(r.code).fill;
                             })
                             .style('stroke', function(r){
                                 return getColorSet(r.code).stroke;
                             });

                             /* Legend labels */
                lg.obj.selectAll('.legend-element')
                .append('text')
                .attr('x', 20)
                .attr('y', 12)
                .style('font-weight', 400)
                .text(function(r){ return r.name; });

            /* Legend title */
            lg.obj.append('text')
                .attr('x', 5)
                .attr('y', top - 15)
                .style('font-size', '13px')
                .style('font-weight', '500')
                .style("text-anchor", "start")
                .text('Landuse Classes');
            }).catch((error)=>{
                console.error(error);
            })
    },
   /**
     * Create a pie chart using districts landuse values.
     * @param {string} targetPanel - The 'id' of the HTML element that will contain the pie chart.
     */
   drawPieChart: function(targetPanel){
    var pc = new Object;
    pc.panel = webix.$$(targetPanel);
    pc.panel.$view.innerHTML = '<div class="pie_chart" id="' + pc.panel.config.id + '_div"></div>';
    var groupArea, groupKeys, totalArea;
    groupKeys = this.district[0].landuse_2012.map(function(r){ return r.group; }).sort();
    totalArea = d3.sum(this.district, function(r){ return r.area_km2*1000000; }),
    pc.cityTotals = groupKeys.map(function(key){
        groupArea = d3.sum(StatsCtrl.district, function(r){
            return r.landuse_2012.find(function(i){ return i.group == key }).m2;
        });
        return {
            group: key,
            m2: groupArea,
            pct: Math.round(groupArea/totalArea*100)
        };
    });
 /* Pie chart margins and dimensions */
 pc.width = pc.panel.$width;
 pc.height = pc.panel.$height;
 pc.radius = Math.min(pc.width, pc.height) / 2;

 /* Pie chart object */
 pc.obj = d3.select("#" + pc.panel.config.id + '_div').append("svg")
     .attr("width", pc.width)
     .attr("height", pc.height)
     .attr("id", 'pie_chart')
   .append("g")
     .attr("transform", "translate(" + (pc.width/2) + "," + ((pc.height/2)-10)  + ")");

     pc.arc = d3.arc()
     .outerRadius(pc.radius - 45)
     .innerRadius(0);
 pc.slice = d3.pie()
     .sort(null)
     .value(function(r){ return r.m2; });

 /* Pie slices */
 pc.obj.selectAll("path")
     .data(pc.slice(pc.cityTotals))
   .enter()
     .append("path")
     .attr("id", function(r){ return "pie_" + r.data.group; })
     .attr("d", pc.arc)
     .style("fill-opacity", 0.6)
            .style("fill", function(r){
                return getColorSet(r.data.group).fill;
            })
     .style("stroke", "#888")
     .style("stroke-width", 0.5);


     /* Labels for the various pie slices */
     pc.labelArc = d3.arc()
     .outerRadius(pc.radius + 90)
     .innerRadius(0);

 pc.obj.selectAll(".pie-label")
     .data(pc.slice(pc.cityTotals))
   .enter()
     .append("text")
     .attr("class","pie-label")
     .attr("text-anchor", "middle")
     .attr("dy", ".35em")
     .attr("transform", function(r){
         return "translate(" + pc.labelArc.centroid(r) + ")";
     })
     .text(function(r){ return (r.data.pct > 0.9) ? r.data.pct + '%' : ''; });
 /* Pie Title */
 pc.obj.append('text')
     .attr('id','pie_title')
     .attr('x',0)
     .attr('y',147)
     .style('font-size', '13px')
     .style("text-anchor", "middle")
     .text('Landuse - ' + appdata.cityName + ' (2012)');

    this.pieChart = pc;
},

  /**
   * Draws a population bar chart after the data of the districts has been received.
   * @param {string} targetPanel - The 'id' of the HTML element that will contain the bar chart.
   */
  drawBarChart: function (targetPanel) {
    console.log(this.district);
    var bc = new Object();
    bc.panel = webix.$$(targetPanel);
    bc.panel.$view.innerHTML =
      '<div class="bar_chart" id="' + bc.panel.config.id + '_div"></div>';

    /* Bar chart margins and dimentions */
    bc.margin = { top: 30, right: 20, bottom: 50, left: 40 };
    bc.width = bc.panel.$width - bc.margin.left - bc.margin.right - 1;
    bc.height = bc.panel.$height - bc.margin.top - bc.margin.bottom;

    /* Bar chart object */
    bc.obj = d3
      .select("#" + bc.panel.config.id + "_div")
      .append("svg")
      .attr("id", "bar_chart")
      .attr("width", bc.width + bc.margin.left + bc.margin.right)
      .attr("height", bc.height + bc.margin.top + bc.margin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" + bc.margin.left + "," + bc.margin.top + ")"
      );

    /* x & y functions */
    bc.x = d3.scaleBand().rangeRound([0, bc.width]).padding(0.1);
    bc.y = d3.scaleLinear().rangeRound([bc.height, 0]);
    bc.x.domain(
      this.district
        .map(function (r) {
          return r.label;
        })
        .sort()
    );
    bc.y.domain([
      0,
      d3.max(this.district, function (r) {
        return r.pop_2020;
      }) * 1.1,
    ]);
    /* Population bars */
    bc.obj
      .selectAll(".bar")
      .data(this.district)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("id", function (r) {
        return "bar_" + r.code;
      })
      .attr("x", function (r) {
        return bc.x(r.label) + (bc.x.bandwidth() * 0.2) / 2;
      })
      .attr("y", function (r) {
        return bc.y(r.pop_2020);
      })
      .attr("width", bc.x.bandwidth() * 0.8)
      .attr("height", function (r) {
        return bc.height - bc.y(r.pop_2020);
      }).style("stroke", "#AAA")
      .style("stroke-width", 1)
      .style("fill", "#CACCCE")
      .style("fill-opacity", 0.4)
      .attr("class", "popbar");
/* x axis */
bc.obj.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + bc.height + ")")
.call(d3.axisBottom(bc.x))
.append("text")
.attr("id", "bc_xaxis_label")
.attr("x", bc.width/2)
.attr("y", 35)
.style("fill", "#404040")
.style("font-size", "13px")
.style("font-weight", 400)
.style("text-anchor", "middle")
.text("District Codes - (" + appdata.cityName + ")");

/* y axis */
bc.obj.append("g")
.attr("class", "y axis")
.call(d3.axisLeft(bc.y)).append("text")
.attr("id", "bc_yaxis_label")
.attr("x", 5)
.attr("y", -10)
.style("fill", "#404040")
.style("font-size", "13px")
.style("font-weight", 400)
.style("text-anchor", "start")
.text("Number of Inhabitants (2020)");
    this.barChart = bc;
  },
};