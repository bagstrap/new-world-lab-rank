import { Inter } from "next/font/google";
import './globals.css'

const inter = Inter({ subsets: ["latin"] });




export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children; // Just pass through to the [locale] layout
}