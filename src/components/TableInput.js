import React, {useState, useEffect, useRef, createRef} from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import MultiInput from './MultiInput.js';
import { generalIcons } from './apis/icons';
import { toProperCase } from './functions/formatValue';

const TableInput = (props) => {

  const id=props.id
  const name = props.name
  const onChange = props.onChange
  const valueColor = props.valueColor
  const valueSize = props.valueSize
  const initialTableData = props.initialTableData
  const list = props.list || []
  const readonly = props.readonly
  const disabled= props.disabled
  const required = props.required

  const [updatedData, setUpdatedData] = useState({})
  const [lineItems, setLineItems] = useState([
    {item_name:"", detail:"", detail: ""},
    {item_name:"", detail:"", detail: ""},
    {item_name:"", detail:"", detail: ""},
  ])

  const [optionsWindow, setOptionsWindow] = useState(false)

  const getInititalData=()=>{
    // console.log(initialTableData)
    if(initialTableData && initialTableData.length>0){
      if(Array.isArray(JSON.parse(initialTableData))){
        setLineItems(JSON.parse(initialTableData))
      }
    }
  }

  useEffect(()=>{
    getInititalData()
  },[props.initialTableData])

  useEffect(() => {
    if (tableRef.current) {
      // Accessing the width after the component has been rendered
      const width = tableRef.current.clientWidth;
      setTableWidth(width);
    }
  }, []);

  const [showAddItemError, setShowAddItemError] = useState(false)

  const tableRef = useRef(null);
  const [tableWidth, setTableWidth] = useState(0);

  const usernameRefs = useRef([]);
  usernameRefs.current = lineItems.map(
      (ref, index) =>   usernameRefs.current[index] = createRef(index)
    )

  const addIconStyle = {
    height: 30,
    width: 30,
    cursor: "pointer"
  }

  const removeIconStyle = {
    height: 30,
    width: 30,
    cursor: "pointer"
  }

  const handleChange = async (e)=>{ 
      
    const {name, value} = e.target
    const item = name.item
    const field = name.field

    const updatedLineItem = {...lineItems[item],[field]:value}
    setUpdatedData({...updatedData,...updatedLineItem})

    let lineItemsTemp = lineItems
    lineItemsTemp[item] = updatedLineItem
    setLineItems(lineItemsTemp)

    updateParent()
}


  const addItem = (e, row_index) =>{
    let newItem = {}
    for (let key in lineItems[0]) {
      newItem[key] = "";
    }
    setLineItems([...lineItems,newItem])
    updateParent()
  }

  const removeItem = (e, row_index) =>{
    const updatedLineItems = [...lineItems];
    updatedLineItems.splice(row_index, 1)
    setLineItems(updatedLineItems)
    updateParent()
  }


  const updateParent = ()=>{
    if(typeof onChange =="function"){
      let target = {
        ...props,
        value: lineItems,
      }
      onChange({target})
    }
  }

  const inputRequired = (row_index)=>{
    if(row_index==0){
      return {required: true}
    }
  }

  const addIcon = `${generalIcons}/add_icon.png`
  const removeIcon = `${generalIcons}/delete_icon.png`  

  const tableCellStyle = {
    fontSize: 12,
    padding: 2,
    color: valueColor || "black",
    // width: Number(`${Math.ceil(Math.ceil(1/(Object.keys(lineItems[0]).length)*100))}%`),
    width: "auto",
    minWidth: "100px",
    maxWidth: "200px",
    get height(){return this.fontSize+2*this.padding}
  }

  const headerCellStyle = {
    padding: 2,
    color: "black",
    width: Math.ceil(tableWidth/(Object.keys(lineItems[0]).length),150),
    minHeight: 20,
    fontSize: valueSize || 14
  }

  const rowStyle = {
    padding: 2,
    color: valueColor || "black",
    fontSize: valueSize || 14,
    get height(){return this.fontSize+2*this.padding}
  }


  return (
    <div className="d-flex flex-column mb-3 overflow-auto">
        <table ref={tableRef} className="table w-100 p-0 table-borderless rounded rounded-2" style={{fontSize: "12px"}}>
          <thead>
            <tr className="text-center text-small">
            {Object.keys(lineItems[0]).map((field, col_index)=>(
              <th 
                key={col_index} 
                scope="col"
                style={headerCellStyle}
                >{toProperCase(field.replaceAll("_"," "))}
              </th>
            ))
            }
            </tr>
            <tr className="" style={{borderBottom: "2px solid gray"}}></tr>
          </thead>
          <tbody className="table-group-divider text-small">
          {lineItems.map((item, row_index) => (
              <tr key={row_index} id={`item_${row_index}`} ref={usernameRefs.current[row_index]} style={rowStyle}>
                {Object.keys(lineItems[0]).map((field, col_index) => (
                  <td key={`${row_index}_${field}`} style={tableCellStyle}>
                    <MultiInput
                      id={{item: row_index,field: field}}
                      name={{item: row_index,field: field}}
                      style={tableCellStyle}
                      value={lineItems[row_index][field]}
                      valueSize={tableCellStyle.fontSize}
                      valueColor={tableCellStyle.color}
                      padding={0}
                      onChange={(e) => handleChange(e)}
                      required={inputRequired(row_index)}
                      readonly = {readonly}
                      disabled = {disabled}
                      list={col_index==0? list : null}
                    />
                  </td>
                ))}
                <td id={`remove_item_${row_index}`} className="small bg-second">
                  <img src={removeIcon} style={removeIconStyle} onClick={(e) => removeItem(e, row_index)} alt={`Remove ${row_index}`} />
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="2" className="small bg-second" style={{background:"none"}}>
                <img src={addIcon} style={addIconStyle} onClick={(e)=>addItem(e)}></img>Add item</td>
            </tr>
          </tbody>
        </table>
    </div>
  )
}

export default TableInput