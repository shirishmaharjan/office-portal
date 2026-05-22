import "./globals.css";
import { Users } from 'lucide-react'; // <--- MAKE SURE THIS IS HERE

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="flex justify-between items-center px-12 py-6 bg-white border-b">
          <div className="flex items-center space-x-4">
            <div className="bg-[#1B4332] text-white p-2 rounded font-bold text-xl">HI</div>
            <div>
              <h1 className="font-bold text-lg leading-tight uppercase tracking-tighter text-gray-900">HERD International</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold text-left">Research Data System</p>
            </div>
          </div>
          <div className="flex items-center space-x-8 font-medium text-sm text-gray-600 italic">
            <a href="/" className="hover:text-blue-600 transition">Home</a>
            <a href="/" className="hover:text-blue-600 transition">Projects</a>
            <a href="/login" className="bg-[#0066CC] text-white px-6 py-2.5 rounded-full flex items-center space-x-2 hover:bg-blue-700 transition shadow-md shadow-blue-100">
               <Users size={16} /> <span className="font-bold not-italic">Sign In</span>
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}