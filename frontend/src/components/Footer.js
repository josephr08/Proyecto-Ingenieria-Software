import React from 'react'

export default function Footer() {
    return (
        <footer className="w-full border-t bg-white text-gray-700 py-4">
            <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center">
                <div className="font-semibold text-lg">Sangil Water</div>
                <div className="text-sm text-gray-500">Portal Demo © {new Date().getFullYear()}</div>
            </div>
        </footer>
    )
}
