import "./globals.css";
import TopBar from "../components/TopBar";

export const metadata = {
  title: "FeedPulse",
  description: "AI-powered product feedback platform"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TopBar />
        {children}
      </body>
    </html>
  );
}
