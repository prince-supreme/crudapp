"use client";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body className="bg-gray-100">
        <QueryClientProvider client={queryClient}>
          {/* Navbar */}
          <nav className="bg-gray-800 text-gray-300 py-4 shadow-md">
            <div className="container mx-auto flex justify-center">
              <a className="text-2xl font-semibold tracking-wide hover:text-white transition duration-300">
                CRUD Application
              </a>
            </div>
          </nav>


          {/* Main Content */}
          <main className="container mx-auto p-4">{children}</main>

          {/* Footer */}
          <footer className="bg-gray-900 text-white w-full py-10">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-10">
              
              {/* Profile Section */}
              <div className="flex flex-col md:flex-row items-center space-x-6">
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold">Prince Kumar</h2>
                  <p className="text-xl text-gray-400">🎓 Amity University Noida | 📊 CGPA: 8.01</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-6 md:mt-0 text-center md:text-right space-y-4 text-xl">
                <p>📧 <a href="mailto:prince@example.com" className="text-blue-400 hover:underline">sprincekumar316@gmail.com</a></p>
                <p>📞 <a href="tel:+919876543210" className="text-blue-400 hover:underline">+91 7217577365</a></p>
                <p>🔗 <a href="https://linkedin.com/in/iamprincekumar" className="text-blue-400 hover:underline">linkedin.com/in/princekumar</a></p>
              </div>
            </div>

            {/* Copyright Section */}
            <div className="mt-10 text-center text-gray-400 border-t border-gray-700 pt-6 text-xl">
              © 2025 CRUD App. All rights reserved.
            </div>
          </footer>


        </QueryClientProvider>
      </body>
    </html>
  );
}
