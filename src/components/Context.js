import React, { useState, createContext } from 'react'

export const Context = createContext(null);

export const ContextProvider = ({children}) =>{

    const [user, setUser] = useState("")
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [page, setPage] = useState({});
    const [pageName, setPageName] = useState("Log In");
    const [pages, setPages] = useState([])
    const [requestType, setRequestType] = useState({});
    const [requestTypes, setRequestTypes] = useState([])
    const [appData, setAppData] = useState({});
    const [attachments, setAttachments] = useState({});
    const [initialFormData, setInitialFormData] = useState({})
    const [tableName, setTableName] = useState("requests")
    const [tables, setTables] = useState([])
    const icons = "https://nlightnlabs01.s3.us-west-1.amazonaws.com/spendFlow/intake/icons"
    const generalIcons = "https://nlightnlabs01.s3.us-west-1.amazonaws.com/icons"
    const [apps, setApps] = useState([])
    const [selectedApp, setSelectedApp] = useState("")
    const [currency, setCurrency] = useState("United States Dollar")
    const [currencySymbol, setCurrencySymbol] = useState("$")
    const [language, setLanguage] = useState("English")
   
    const [pageList, setPageList] = useState([])

    const globalStates = {
        user,
        setUser,
        userLoggedIn,
        setUserLoggedIn,
        page,
        setPage,
        pages,
        setPages,
        pageName,
        setPageName,
        requestType,
        setRequestType,
        appData,
        setAppData,
        attachments,
        setAttachments,
        pageList,
        setPageList,
        requestTypes,
        setRequestTypes,
        initialFormData,
        setInitialFormData,
        icons,
        generalIcons,
        tableName,
        setTableName,
        tables,
        setTables,
        apps,
        setApps,
        selectedApp,
        setSelectedApp,
        currency,
        setCurrency,
        language,
        setLanguage,
        currencySymbol,
        setCurrencySymbol
    }

    return(
        <Context.Provider value={globalStates}>{children}</Context.Provider>
    )
}