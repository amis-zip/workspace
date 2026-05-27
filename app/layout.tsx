import "./globals.css";
import CommandMenu from "./components/CommandMenu";

export const metadata = {
  title: "Amy S.",
  description: "personal workspace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">

        <CommandMenu />

        {children}

      </body>
    </html>
  );
}