import AppSidebar from '@/components/Application/Admin/AppSidebar'
import ThemeProvider from '@/components/Application/Admin/ThemeProvider'
import Topbar from '@/components/Application/Admin/Topbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const layout = ({ children }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
                <AppSidebar />
                <main className="md:w-[calc(100vw-16rem)] w-full overflow-x-hidden" >
                    <div className='pt-[70px] md:px-8 px-5 min-h-[calc(100vh-40px)] pb-10'>
                        <Topbar />
                        {children}
                    </div>

                    <div className='border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm'>
                        © 2025 Developer Goswami™. All Rights Reserved.
                    </div>
                </main>
            </SidebarProvider>
        </ThemeProvider>
    )
}

export default layout