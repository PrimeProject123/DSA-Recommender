import "@/styles/globals.css";
import ThemeProvider from "../utils/ThemeProvider.js";
import { AuthProvider } from "../contexts/AuthContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
}
