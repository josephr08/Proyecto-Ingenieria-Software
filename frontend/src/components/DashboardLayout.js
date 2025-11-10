import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Navbar />
                <main className="p-6">{children}</main>
            </div>
        </div>
    )
}

export default DashboardLayout