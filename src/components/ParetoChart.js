import React, {useEffect, useState} from 'react';
import { Bar} from 'react-chartjs-2';
import {getData} from './apis/axios.js'
import {toProperCase} from './functions/formatValue.js'
import {formatValue} from './functions/formatValue.js'

import "bootstrap/dist/css/bootstrap.min.css"


const ParetoChart = ({props}) => {

  const id = props.id
  const record_created = props.record_created
  const app = props.app
  const name = props.name
  const type = props.type
  const json_props = props.json_props
  const height = props.height
  const width = props.width
  const db_table_name = props.db_table_name
  const group_by_field = props.group_by_field
  const aggregation_method = props.aggregation_method
  const aggregation_field = props.aggregation_field
  const query = props.query
  const chart_title = props.chart_title
  const chart_title_font_size = props.chart_title_font_size
  const chart_title_font_color = props.chart_title_font_color
  const chart_title_font_weight = props.chart_title_font_weight
  const chart_subtitle = props.chart_subtitle
  const chart_sub_title_font_size = props.chart_sub_title_font_size
  const chart_sub_title_font_color = props.chart_sub_title_font_color
  const chart_sub_title_font_weight = props.chart_sub_title_font_weight
  const max_number_of_categories_to_show = props.max_number_of_categories_to_show
  const category_label_size = props.category_label_size
  const category_label_color = props.category_label_color
  const primary_series_background_colors = props.primary_series_background_colors
  const primary_series_font_colors = props.primary_series_font_colors
  const primary_series_line_colors = props.primary_series_line_colors
  const primary_series_marker_shape = props.primary_series_marker_shape
  const primary_series_marker_size = props.primary_series_marker_size
  const primary_data_title = props.primary_data_title
  const secondary_data_title = props.secondary_data_title
  const primary_series_font_size = props.primary_series_font_size
  const primary_text_format = props.primary_text_format
  const primary_text_currency_symbol = props.primary_text_currency_symbol
  const primary_text_digits = props.primary_text_digits
  const primary_text_abbreviation = props.primary_text_abbreviation
  const secondary_series_background_colors = props.secondary_series_background_colors
  const secondary_series_font_colors = props.secondary_series_font_colors
  const secondary_series_font_size = props.secondary_series_font_size
  const secondary_text_format = props.secondary_text_format
  const secondary_text_currency_symbol = props.secondary_text_currency_symbol
  const secondary_text_digits = props.secondary_text_digits
  const secondary_text_abbreviation = props.secondary_text_abbreviation
  const secondary_series_line_colors = props.secondary_series_line_colors
  const secondary_series_marker_shape = props.secondary_series_marker_shape
  const secondary_series_marker_size = props.secondary_series_marker_size
  

    // const chartTitle = props.chartTitle
    // const categoryLabels = props.categoryLabels
    // const tableName = props.tableName
    // const aggregationMethod = props.aggregationMethod
    // const fieldToAggregate = props.fieldToAggregate
    // const valueColors = props.valueColors
    // const barColors = props.barColors
    // const barValueColors = props.barValueColors
    // const barDataTitle = props.barDataTitle
    // const lineColors = props.lineColors
    // const lineValueColors = props.lineValueColors
    // const lineDataTitle = props.lineDataTitle

    // const primaryTextFormat = props.primaryTextformat || "quantity"
    // const primaryTextCurrencySymbol = props.primaryTextformat || "$"
    // const primaryTextDigits = props.primaryTextDigits || 1
    // const primaryTextAbbreviate = props.primaryTextAbbreviate || true

    // const secondaryTextFormat = props.secondaryTextFormat || "percent"
    // const secondaryTextCurrencySymbol = props.secondaryTextCurrencySymbol || "$"
    // const secondaryTextDigits = props.secondaryTextDigits || 1
    // const secondaryTextAbbreviate = props.secondaryTextAbbreviate || false
    
    // const query = props.query

    const xLimit = props.xLimit

    const [data, setData] = useState({})
    const [options, setOptions] = useState({})

    const prepareData = async ()=>{

      // let query = ""
      // if (inputQuery !=""){
      //   query = inputQuery;
      // }else if(aggregation_method == "sum"){
      //   query = `SELECT "${group_by_field}" as label, sum("${fieldToAggregate}") as value from ${tableName} group by "${categoryLabels}" order by sum("${fieldToAggregate}") desc`
      // }else{
      //   query = `SELECT "${group_by_field}" as label, count(distinct "id") as value from ${tableName} group by "${categoryLabels}" order by count(distinct "id") desc;`
      // }
      
        try{
          const response = await getData(query)

          let totalRecords = response.length

          // get total
          let total=0
            response.map(item=>{
              total += parseFloat(item.value)
            })

        
          // Additional fields needed for pareto chart
            var pareto_data =[]
            var running_total = 0
            let running_pct_of_total = 0
            let tail_value = 0
            let tail_pct_of_total = 0
            let tail_running_total = 0
            let tail_running_pct_of_total = 0

            await response.forEach((item,index)=>{
              if(index<=(max_number_of_categories_to_show-1)){
                var value = Number(item.value)
                var pct_of_total = Number((100*value / total).toFixed(2))
                running_total = Number(parseFloat(running_total + value).toFixed(0))
                running_pct_of_total = Number(parseFloat(100*(running_total / total)).toFixed(2))
                var new_data = {pct_of_total, running_total,running_pct_of_total}
                var updated_item = {...item,...new_data}
                pareto_data.push(updated_item)
              }
              else{
                tail_value = tail_value + Number(item.value)
                tail_pct_of_total = Number((100*tail_value / total).toFixed(2))
                tail_running_total = Number(parseFloat(running_total + tail_value).toFixed(0))
                tail_running_pct_of_total = Number(parseFloat(100*(tail_running_total / total)).toFixed(2))
              }
              
            })
            
            //Create Tail Bar
            if(totalRecords > (max_number_of_categories_to_show-1)){
              let tail_item = {
                label: "Others",
                value: tail_value, 
                pct_of_total: tail_pct_of_total, 
                running_total: tail_running_total,
                running_pct_of_total: tail_running_pct_of_total
              }
              pareto_data.push(tail_item)
            }

            console.log(pareto_data)
        
            let labels = []
            pareto_data.map((item)=>{
                labels.push(toProperCase((item.label).replaceAll("_"," ")))
            })

            let barData = []
            pareto_data.map((item)=>{
                barData.push(Number(item.value))
            })

            let lineData = []
            pareto_data.map((item)=>{
                lineData.push(Number(item.running_pct_of_total))
            })

            const d = {
                labels: labels,
                datasets: [
                {
                    label: primary_data_title,
                    data: barData,
                    backgroundColor: primary_series_background_colors || "rgba(0,100,200,0.25)",
                    order: 0,
                    datalabels: 
                      {
                        color: primary_series_font_colors || "rgb(0,100,200)",
                        display: true,
                        anchor: "end",
                        align: "top",
                        offset: "1",
                        font: {
                          weight: 'bold',
                          size: primary_series_font_size
                        },
                        formatter: function(value) {
                          return formatValue(value,primary_text_format,primary_text_currency_symbol,primary_text_digits,primary_text_abbreviation);
                        }
                      },
                },
                { 
                    type: 'line',
                    label: secondary_data_title,
                    data: lineData,
                    borderColor: secondary_series_background_colors || "rgba(200,200,200,0.5)",
                    backgroundColor: secondary_series_line_colors || "rgba(200,200,200,0.5)",
                    order: 1,
                    pointStyle: secondary_series_marker_shape,
                    pointRadius: secondary_series_marker_size,
                    datalabels: 
                      {
                        color: secondary_series_font_colors || "rgb(200,200,200)",
                        display: true,
                        anchor: "end",
                        align: "top",
                        offset: "1",
                        font: {
                          weight: 'normal',
                          size: secondary_series_font_size
                        },
                        formatter: function(value) {
                          return formatValue(value,secondary_text_format,secondary_text_currency_symbol,secondary_text_digits,secondary_text_abbreviation);
                        }
                      }
                }
                ]
            }
            setData(d)
            prepareOptions(d)
        }catch(error){
            //console.log(error)
        }
    }    
        
    

    const prepareOptions = (data) => {
      const numberOfCategories = data.labels.length;
    
      let fontSize = 12;
      let xRotation = 0;
    
      if (numberOfCategories > 5) {
        fontSize = 10;
        xRotation = 90;
      }
    
      const options = {
        maintainAspectRatio: false,
        layout: {
          padding: {
            bottom: 0,
          },
          legend: {
            position: "bottom",
          },
        },
        scales: {
          x: {
            type: 'category',
            position: 'bottom',
            grid: {
              display: false,
            },
            align: 'center',
            ticks: {
              autoSkip: false,
              minRotation: xRotation,
              maxRotation: xRotation,
              font: {
                size: fontSize,
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              display: false,
            },
            display: false,
          },
        },
        plugins: {
          title: {
            text: chart_title,
            display: true,
            color: chart_title_font_color,
            font: {
              size: chart_title_font_size,
              weight: chart_title_font_weight
            },
          },
          subtitle: {
            text: chart_subtitle || "",
            color: chart_sub_title_font_color,
            font: {
              size: chart_sub_title_font_size,
              weight: chart_sub_title_font_weight
            },
          },
        },
      };
    
      // Custom plugin for label wrapping
      options.plugins = {
        ...options.plugins,
        customLabels: {
          formatter: (value, context) => {
            const label = data.labels[context.dataIndex];
            return label.split("_").join(" "); // Replace underscores with spaces
          },
        },
      };
    
      setOptions(options);
    };

   

    useEffect(()=>{
      prepareData()
  },[props])

    
  return (
    <div className="container p-3">
      {Object.keys(data).length>0 && Object.keys(options).length>0 && 
          <Bar data={data} options={options} />
      }
    </div>
  );
};

export default ParetoChart;


