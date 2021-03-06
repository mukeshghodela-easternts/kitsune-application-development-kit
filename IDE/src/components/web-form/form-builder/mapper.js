// base object for webaction properties
const webActionProperties = {
	DisplayName: '',
	PropertyName: '',
	PropertyType: 0,
	DataType: null,
	IsRequired: false,
	ValidationRegex: null
}

// base object for webformProperties
const webformProperties = {
	label : '',
	type: '',
	required : '',
	className: '',
	name: ''
}

// base types of data
const webActionPropertyType = [
	[0, 'str'],
	[1, 'array'],
	[2, 'number'],
	[3, 'boolean'],
	[4, 'date'],
	[5, 'image'],
	[6, 'link'],
	[7, 'webaction'],
	['str', 'str'],
	['array', 'array'],
	['number', 'number'],
	['boolean', 'boolean'],
	['date', 'date'],
	['image', 'image'],
	['link', 'link'],
	['webaction', 'webaction']
]

/*const webFormDataTypesToWebAction = [
	[ 'text', 'str' ],
	['number','number'],
	['checkbox-group','boolean'],
	['date','date']
]*/

const webFormDataTypesToWebAction = [
	['text', 0],
	['number',2],
	['checkbox-group',0],
	['date',4],
	['select',0],
	['radio-group',0]
]

const webFormDataTypesToWebActionPropertyValue = [
	[ 'text', '0' ],
	['number','2'],
	['checkbox-group','3'],
	['date','4']
]

const webActionToWebFormDataTypes = [
	[ 'str', 'text' ],
	['number','number'],
	['boolean','checkbox-group'],
	['date','date']
]

// maps of all the mappings
const webActionPropertyTypeMap = new Map(webActionPropertyType);

const webFormDataTypesToWebActionMap = new Map(webFormDataTypesToWebAction);

const webActionToWebFormDataTypesMap = new Map(webActionToWebFormDataTypes);

const webFormDataTypesToWebActionPropertyValueMap = new Map(webFormDataTypesToWebActionPropertyValue)

const getDataType = (dataType) => {
	return webFormDataTypesToWebActionMap.get(dataType);
}

const getPropertyName = (name) => {
	return name.split(' ').map(function (word, index) {
		if (index === 0) {
			return word.toLowerCase()
		}
		return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
	}).join('')
}

const convertWebFormToWebaction = (data) => {
	let webactionObject = Object.assign({}, webActionProperties);
	webactionObject.DisplayName = data.label;
	webactionObject.PropertyName = getPropertyName(data.label);
	webactionObject.PropertyType = getDataType(data.type);
	webactionObject.IsRequired = data.required ? true : false;
	return webactionObject;
}

const convertWebFormToWebactionWithEnum = (data) => {
	let webactionObject = Object.assign({}, webActionProperties);
	webactionObject.DisplayName = data.label;
	webactionObject.PropertyName = getPropertyName(data.label);
	webactionObject.PropertyType = webFormDataTypesToWebActionPropertyValueMap.get(data.type);
	webactionObject.IsRequired = data.required ? true : false;
	return webactionObject;
}

/*
* webform object contains name and className properties
* because without these properties the html generated by form builder is not correct
*
* note : name property uses Date.now() as it is also used id for fields (id need to be unique)
* **/
const convertWebactionToWebform = (data) => {
	let webformObject = Object.assign({}, webformProperties);
	webformObject.label = data.DisplayName;
	webformObject.required = data.IsRequired ? true : false;
	let propertyType = parseInt(data.PropertyType);
	let propertyName = webActionPropertyTypeMap.get(isNaN(propertyType) ? data.PropertyType : propertyType );
	webformObject.type = webActionToWebFormDataTypesMap.get(propertyName);
	return webformObject;
}


const getWebActionProperties = (webformObject) => {
	let webactionProperties = [];

	webformObject.forEach((object)=>{
		webactionProperties.push(convertWebFormToWebaction(object));
	})

	return webactionProperties;
}

const getWebformObject = (webactionObject) => {
	let webformProperties = [];

	webactionObject.Properties.forEach((object) => {
		webformProperties.push(convertWebactionToWebform(object));
	})

	return webformProperties;
}

const getWebFormToWebactionWithEnum = (webformObject) => {
	let webactionProperties = [];

	webformObject.forEach((object)=>{
		if(Object.keys(object).length > 0) {
			webactionProperties.push(convertWebFormToWebactionWithEnum(object));
		}
	})

	return webactionProperties;
}

const mapperFunctions = {
	getWebActionProperties,
	getWebformObject,
	getPropertyName,
	getWebFormToWebactionWithEnum,
	webActionToWebFormDataTypesMap,
	webFormDataTypesToWebActionPropertyValueMap
}

export default mapperFunctions;
