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
      <body
        style={{
          margin: 0,
          paddingTop: "52px",
          backgroundColor: "#000000",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 999999,
            backgroundColor: "#ffe4ec",
            color: "#3f1d2a",
            borderBottom: "1px solid #f9a8c3",
            padding: "12px 16px",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <span style={{ marginRight: "8px" }}>
            새로운 amisOS가 열렸어요.
          </span>
          <a
            href="https://amis-os.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#be185d",
              fontWeight: 700,
              textDecoration: "underline",
              textUnderlineOffset: "4px",
            }}
          >
            새 amisOS 보러가기 →
          </a>
        </div>

        <CommandMenu />

        {children}
      </body>
    </html>
  );
}