import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useRef, createRef } from "react";
import { toProperCase } from "./functions/formatValue.js";
import MultiInput from "./MultiInput.js";
import axios, {
	getRecord,
	getRecords,
	getList,
	getTable,
	getData,
} from "./apis/axios.js";
import { getValue } from "./apis/axios.js";
import Attachments from "./Attachments.js";
import TableInput from "./TableInput.js";
import { rootPath } from "./apis/fileServer.js";

const NewRecordForm = (props) => {
	const formName = props.formName;
	const updateParent = props.updateParent;
	const updateParentStates = props.updateParentStates;

	const setUploadFilesRef = props.setUploadFilesRef;

	const [formData, setFormData] = useState(props.formData);
	const [userData, setUserData] = useState(props.user);
	const [appData, setAppData] = useState(props.appData);

	const [sections, setSections] = useState([]);
	const [formElements, setFormElements] = useState([]);
	const [dropdownLists, setDropdownLists] = useState([]);
	const [allowEdit, setAllowEdit] = useState(true);
	const [valueColor, setValueColor] = useState("#5B9BD5");
	const [inputFill, setInputFill] = useState("#F4F5F5");
	const [border, setBorder] = useState("1px solid rgb(235,235,235)");
	const [initialData, setInitialData] = useState({});

	const [updatedData, setUpdatedData] = useState({});
	const [attachments, setAttachments] = useState([]);
	const [lineItems, setLineItems] = useState([]);

	const [initialValues, setInitialValues] = useState(false);
	const [formClassList, setFormClassList] = useState("form-group")

	useEffect(() => {
		getFormFields();
	}, [props.formName]);



	const getFormFields = async () => {
		const params = {
			tableName: "forms",
			conditionalField: "ui_form_name",
			condition: formName,
		};

		try {
			const formFields = await getRecords(params);

			// Saving the state.  This is always consistent.
			setFormElements(formFields);

			// Calling a function to dynamically pull multiple dropdown lists from db
			getDropDownLists(formFields);

			//Get the sections data
			getSections(formFields);

			//Setup initial formdata with default values if any
			setUpFormData(formFields);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const setUpFormData = async (formFields) => {
		
    let tempFormData = formData;
    console.log(appData.user.id);

		if (formFields && formFields.length > 0) {
      
			formFields.map((item) => {
				try {
					tempFormData = {
						...tempFormData,
						...{ [item.ui_id]: eval(item.ui_default_value) },
					};
				} catch (error) {
					console.log(error);
					console.log(item.ui_default_value);
				}
			});
			setFormData((prevState) => ({ ...prevState, ...tempFormData }));
			updateParent((prevState) => ({ ...prevState, ...tempFormData }));
			calculateForm(formFields, tempFormData);
		}
	};

	const calculateForm = async (formFields, updatedFormData) => {
		let formData = updatedFormData;
    console.log(formData);

    console.log(appData.user.id);
  
		formFields.map(async (item) => {
      
      console.log(item)
			let value = formData[item.ui_id];

			try {
				if (item.ui_calculation_type == "formula") {
					value = eval(item.ui_formula);
				}

        if(item.ui_calculation_type == "fetch"){
         const tableName = item.ui_reference_data_table;
         const fieldName = item.ui_reference_data_field;
         const conditionalField = item.ui_reference_data_conditional_field
         const conditionalValue = eval(item.ui_reference_data_conditional_value)
         value = await getValue(tableName,fieldName,conditionalField,conditionalValue)
        }
        updatedFormData = { ...updatedFormData, ...{ [item.ui_id]: value } };
				setFormData((prevState) => ({ ...prevState, ...updatedFormData }));
				updateParent((prevState) => ({ ...prevState, ...updatedFormData }));
				setInitialValues(true);
			} catch (error) {
				console.log(error);
				console.log(item);
			}
		});
	};

	const getDropDownLists = async (data) => {
		let tempDropdownLists = [];

		if (data.length > 0) {
			data.map((item) => {
				if (
					item.ui_reference_data_table !== null &&
					item.ui_reference_data_field !== null &&
					(item.ui_component_type === "select" ||
						item.ui_component_type === "table")
				) {
					const getListItems = async (req, res) => {
						try {
							const response = await getList(
								item.ui_reference_data_table,
								item.ui_reference_data_field
							);
							const listItems = await response;

							// Storing each drop down list in an object
							let listData = {
								name: `${item.ui_id}_list`,
								listItems: listItems,
							};
							tempDropdownLists.push(listData);

							//Add each list to the array of dropdown lists
							setDropdownLists([...dropdownLists, ...tempDropdownLists]);
						} catch (error) {
							console.log(error);
						}
					};
					getListItems();
				}
			});
		}
	};

	// const getAppData = async (data)=>{

	//   if(data.length>0){
	//     let tempAppData = appData
	//     data.forEach(async (item)=> {
	//     if(item.ui_reference_app_data !==null){
	//       try{
	//         const response = await getTable(item.ui_reference_app_data);
	//         let appDataTable = {[item.ui_reference_app_data]: response.data}
	//         //Add each list to the array of dropdown lists
	//         tempAppData = {...tempAppData,...appDataTable};
	//         console.log(tempAppData)
	//         setAppData({...appData,...appDataTable});
	//       }catch(error){
	//         console.log(error)
	//       }
	//       }
	//     })
	//     return(tempAppData)
	//   }
	// }

	const getSections = (data) => {
		let sectionSet = new Set();
		data.map((items) => {
			sectionSet.add(items.ui_form_section);
		});

		let sectionList = [];
		sectionSet.forEach((item) => {
			let visible = data.filter((r) => r.ui_form_section == item)[0]
				.ui_section_visible;
			sectionList.push({ name: item, visible: visible });
		});

		setSections(sectionList);
	};

	const prepareAttachments = (fileData) => {
		setAttachments([...attachments, ...fileData]);
		setFormData({
			...formData,
			...{ ["attachments"]: [...attachments, ...fileData] },
		});
	};

	const uploadFiles = async () => {
		let fileData = attachments;

		const upload = async () => {
			const updatedFiles = await Promise.all(
				fileData.map(async (file) => {
					let fileName = file.name;
					let filePath = `${rootPath}/user_${userData.id}_${userData.first_name}_${userData.last_name}/${fileName}`;
					if (userData) {
						filePath = `${rootPath}/user_${userData.id}_${userData.first_name}_${userData.last_name}/${fileName}`;
					} else {
						filePath = rootPath;
					}

					const response = await axios.post(`/getS3FolderUrl`, {
						filePath: filePath,
					});
					const url = await response.data;
					const fileURL = await url.split("?")[0];

					await fetch(url, {
						method: "PUT",
						headers: {
							"Content-Type": file.type,
						},
						body: file.data,
					});
					return {
						...file,
						...{
							["name"]: file.name,
							["type"]: file.type,
							["size"]: file.size,
							["url"]: fileURL,
						},
					};
				})
			);

			setAttachments([...attachments, ...updatedFiles]);

			let updatedDataWithAttachments = {
				...updatedData,
				...{ ["attachments"]: updatedFiles },
			};
			setUpdatedData({ ...updatedData, ...{ ["attachments"]: updatedFiles } });

			let formDataWithAttachments = {
				...formData,
				...{ ["attachments"]: updatedFiles },
			};
			setFormData({ ...formData, ...{ ["attachments"]: updatedFiles } });
			updateParent({ ...formData, ...{ ["attachments"]: updatedFiles } });

			return { formDataWithAttachments, updatedDataWithAttachments };
		};

		const output = await upload();
		return output;
	};

	setUploadFilesRef(uploadFiles);

	const iconStyle = {
		maxHeight: 30,
		maxWidth: 30,
		cursor: "pointer",
		marginLeft: 5,
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		const elementName = name.name;
		setUpdatedData({ ...updatedData, ...{ [elementName]: value } });
		setFormData({ ...formData, ...{ [elementName]: value } });
		let updatedFormData = { ...formData, ...{ [elementName]: value } };
		calculateForm(formElements, updatedFormData);
	};

	const handleClick = (e) => {
		props.handleClick();
	};

	const handleBlur = (e) => {
		props.handleBlur();
	};

	const handleHover = (e) => {
		props.handleHover();
	};

	const handleAddData = (e) => {
		props.handleAddData();
	};

	const handleSubmit = (e) => {
		props.handleSubmit();
	};

	const handleStateChanges = (e) => {};

	const editProps = () => {
		if (allowEdit) {
			setInputFill("white");
			setValueColor("#5B9BD5");
			setBorder("1px solid rgb(235,235,235)");
		} else {
			setInputFill("#F8F9FA");
			setValueColor("black");
			setBorder("none");
		}
	};

	const sectionTitle = {
		fontSize: 20,
		marginBottom: 10,
	};

	const sectionStyle = {
		border: "1px solid rgb(235,235,235)",
		borderRadius: 10,
		padding: 15,
		backgroundColor: "white",
		marginBottom: 40,
	};

	const titleStyle = {
		fontSize: 24,
		fontWeight: "normal",
	};

	useEffect(() => {
		editProps();
	}, [allowEdit]);

	const pageStyle = {
		minWidth: 300,
	};

	return (
		<div
			className="d-flex flex-column w-100 h-100 overflow-y-auto bg-light"
			style={pageStyle}
		>
			<form name='form' id="form" onSubmit={handleSubmit} className={formClassList} noValidate>
				{initialValues && (
					<div
						className="d-flex flex-column"
						style={{ height: "70vh", overflowY: "auto", overflowX: "hidden" }}
					>
						{JSON.stringify(appData.facilities)}

						{sections.map((section, sectionIndex) =>
							section.name !== null && section.visible ? (
								<div
									key={sectionIndex}
									className="d-flex flex-column shadow-sm"
									style={sectionStyle}
								>
									<div style={sectionTitle}>
										{toProperCase(section.name.replaceAll("_", " "))}
									</div>
									{formElements.map((item, index) =>
										item.ui_form_section === section.name &&
										item.ui_component_visible &&
										(item.ui_component_type === "input" ||
											item.ui_component_type == "select") &&
										item.ui_input_type !== "file" ? (
											<div key={index} className="d-flex flex-column mb-3">
												<MultiInput
													id={{ id: item.ui_id, section: item.ui_form_section }}
													name={{
														name: item.ui_name,
														section: item.ui_form_section,
													}}
													className={item.ui_classname}
													label={item.ui_label}
													type={item.ui_input_type}
													value={formData[item.ui_id]}
													valueColor={item.ui_color}
													inputFill={item.ui_backgroundColor}
													fill={item.ui_backgroundColor}
													border={border}
													readonly={eval(item.ui_readonly) || !allowEdit}
													disabled={eval(item.ui_disabled) || !allowEdit}
													onClick={eval(item.ui_onclick)}
													onChange={eval(item.ui_onchange)}
													onBlur={eval(item.ui_onblur)}
													onMouseOver={eval(item.ui_onmouseover)}
													onMouseLeave={eval(item.ui_mouseLeave)}
													list={
														dropdownLists.filter(
															(l) => l.name === `${item.ui_id}_list`
														).length > 0 &&
														dropdownLists.filter(
															(l) => l.name === `${item.ui_id}_list`
														)[0].listItems
													}
													allowAddData={item.ui_allow_add_data}
												/>
											</div>
										) : item.ui_form_section === section.name &&
										  item.ui_component_visible &&
										  item.ui_input_type == "file" ? (
											<div key={index} className="d-flex flex-column mb-3">
												<Attachments
													id={{ id: item.ui_id, section: item.ui_form_section }}
													name={{
														name: item.ui_name,
														section: item.ui_form_section,
													}}
													onChange={(e) => handleChange(e)}
													valueColor={item.ui_color}
													currentAttachments={formData.attachments}
													prepareAttachments={prepareAttachments}
													userData={userData}
													readonly={eval(item.ui_readonly) || !allowEdit}
													disabled={eval(item.ui_disabled) || !allowEdit}
												/>
											</div>
										) : item.ui_form_section === section.name &&
										  item.ui_component_visible &&
										  item.ui_component_type == "table" ? (
											<div key={index} className="d-flex flex-column mb-3">
												<TableInput
													id={{ id: item.ui_id, section: item.ui_form_section }}
													name={{
														name: item.ui_name,
														section: item.ui_form_section,
													}}
													onChange={(e) => handleChange(e)}
													valueColor={item.ui_color}
													valueSize={item.ui_font_size}
													valueWeight={item.ui_font_weight}
													valueFill={item.ui_background_color}
													initialTableData={formData[item.ui_id]}
													list={
														dropdownLists.filter(
															(l) => l.name === `${item.ui_id}_list`
														).length > 0 &&
														dropdownLists.filter(
															(l) => l.name === `${item.ui_id}_list`
														)[0].listItems
													}
													readonly={eval(item.ui_readonly) || !allowEdit}
													disabled={eval(item.ui_disabled) || !allowEdit}
												/>
											</div>
										) : null
									)}
								</div>
							) : null
						)}
					</div>
				)}
			</form>
		</div>
	);
};

export default NewRecordForm;
