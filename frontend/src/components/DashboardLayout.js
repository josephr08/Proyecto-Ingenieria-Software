import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
const DashboardLayout = ({children}) => { return (<div style={{display:'flex',minHeight:'100vh'}}><Sidebar /><div style={{flex:1}}><Navbar /><main style={{padding:20}}>{children}</main></div></div>); };
export default DashboardLayout;
