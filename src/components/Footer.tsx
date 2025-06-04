// src/components/Footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex justify-center">
      <div className="flex max-w-[960px] flex-1 flex-col">
        <div className="flex flex-col gap-6 px-5 py-10 text-center @container">
          <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
            <Link
              href="/privacy"
              className="text-[#6a8a5c] text-base font-normal leading-normal min-w-40 hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[#6a8a5c] text-base font-normal leading-normal min-w-40 hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-[#6a8a5c] text-base font-normal leading-normal min-w-40 hover:underline"
            >
              Contact Us
            </Link>
          </div>
          <p className="text-[#6a8a5c] text-base font-normal leading-normal">
            © 2025 Alwahdi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
