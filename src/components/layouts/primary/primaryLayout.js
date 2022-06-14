import { ToastContainer } from 'react-toastify'
import Navbar from './sections/navbar'
import Footer from './sections/footer'
import ScrollTop from './sections/scrollTop'

export default function PrimaryLayout ({children}) {

    return (
        <div className="min-h-screen bg-gray-100 my-slow-motion overflow-y-hidden">

            <Navbar />

            <main className="relative bg-gray-100 dark:bg-gray-900 py-6 min-h-[calc(100vh-120px)]">
                {children}
            </main>

            <Footer />
            
            <ScrollTop />

            <ToastContainer rtl={true} position="bottom-right" /> 
            
        </div>
    )
}