// app/sign-in/[[...sign-in]]/page.tsx

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafbf9] px-4">
      <div className="max-w-md w-full">
        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#539932", // لون الأزرار
              colorText: "#131810", // لون النصوص
              colorBackground: "#fafbf9", // الخلفية
              colorInputBackground: "#ffffff",
              borderRadius: "0.75rem",
              fontSize: "0.95rem",
            },
            elements: {
              card: "shadow-xl border border-[#ecf1ea] rounded-2xl p-6",
              headerTitle: "text-[#131810] font-bold text-lg",
              headerSubtitle: "text-[#4a8a2b] text-sm",
              formButtonPrimary:
                "bg-[#539932] hover:bg-[#4a8a2b] text-[#fafbf9] font-bold tracking-wide text-sm h-10 rounded-md",
              footerActionText: "text-[#131810]",
              footerActionLink: "text-[#4a8a2b] hover:underline",
              socialButtonsBlockButton:
                "bg-white border border-[#ecf1ea] hover:bg-[#f3f5f2] text-[#131810]",
            },
          }}
        />
      </div>
    </div>
  );
}
