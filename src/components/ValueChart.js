import React, {useState, useEffect} from 'react'
import {getData} from './apis/axios.js'
import {formatValue} from './functions/formatValue.js'

const ValueChart = ({props}) => {

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


    const [value, setValue] = useState("")
    const subTitle = props.subTitle

    const prepareData = async ()=>{
        // let query = `SELECT count(distinct "${fieldToAggregate}") as value from ${tableName};`

        // if (aggregationMethod == "sum"){
        //   query = `SELECT SUM("${fieldToAggregate}") as value from ${tableName};`
        // }
        
        // if (aggregationMethod == "average"){
        //     query = `SELECT AVG("${fieldToAggregate}")as value from ${tableName};`
        // }

        // if (inputQuery !=null && inputQuery !="" && inputQuery.lenght>0){
        //     query = inputQuery;
        //   }

        try{
          const response = await getData(query)
          let chartValue=""
          if(response[0].value){
            const primary_series_font_size = props.primary_series_font_size
            chartValue = formatValue(response[0].value, primary_text_format, primary_text_currency_symbol, primary_text_digits, primary_text_abbreviation)
          }else{
            chartValue = formatValue(response[0][Object.keys(response[0])[0]], primary_text_format, primary_text_currency_symbol, primary_text_digits, primary_text_abbreviation)
          }
          setValue(chartValue)
        }catch(error){
            console.log(error)
        }
    }    
    useEffect(()=>{
        prepareData()
    },[props])


 const valueStyle={
    color:  chart_title_font_color,
    fontSize: chart_title_font_size,
    fontWeight: chart_title_font_weight
 }

 const subTitleStyle={
    color: chart_sub_title_font_color,
    fontSize: chart_sub_title_font_size,
    fontWeight: chart_sub_title_font_weight  
 }


    
  return (
    <div className="d-flex align-items-center">
     
        <div>
            <div className="d-flex justify-content-center w-100" style={valueStyle}>
                {value}
            </div>
            <div className="d-flex justify-content-center w-100" style={subTitleStyle}>
                {primary_data_title}
            </div>
        </div>
  </div>
  )
}

export default ValueChart