import "./globals.css";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata = {
 title: "Lector Hub",
 description: "Descrição Lector Hub",
};

export default function RootLayout({ children }) {
 return (
  <html
   lang="pt-BR"
   className="h-full w-full antialiased"
   suppressHydrationWarning
  >
   <body className="min-h-full flex flex-col">
    <Provider>
     <Header />
     <main className="flex-1">{children}</main>
     <Footer />
     <Toaster />
    </Provider>
   </body>
  </html>
 );
}
