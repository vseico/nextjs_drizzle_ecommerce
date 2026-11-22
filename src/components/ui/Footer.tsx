import Link from "next/link";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import {
  FiMapPin,
  FiPhone,
  FiMail,
} from "react-icons/fi";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "My Orders", href: "/orders" },
];

const customerServiceLinks = [
  { label: "Delivery Information", href: "/delivery" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "FAQs", href: "/faqs" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-10">
      <div className="mx-auto max-w-[1110px] px-6 pt-14">
        {/* Main footer */}
        <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-lg font-bold text-white">
                G
              </span>

              <span className="text-xl font-bold tracking-tight text-gray-950">
                Grocery<span className="text-emerald-500">Cart</span>
              </span>
            </Link>

            <p className="mb-6 max-w-[240px] text-sm leading-6 text-gray-500">
              Fresh groceries and everyday essentials delivered
              straight to your doorstep.
            </p>

            {/* Social media */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-emerald-500 hover:text-emerald-500"
              >
                <FaFacebookF size={15} />
              </a>

              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-emerald-500 hover:text-emerald-500"
              >
                <FaInstagram size={16} />
              </a>

              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-emerald-500 hover:text-emerald-500"
              >
                <FaTwitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-gray-900">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-500 transition hover:text-emerald-500"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-gray-900">
              Customer Service
            </h3>

            <ul className="space-y-3">
              {customerServiceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-500 transition hover:text-emerald-500"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact information */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-gray-900">
              Get in Touch
            </h3>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin
                  className="mt-0.5 shrink-0 text-emerald-500"
                  size={18}
                />
                <span className="text-sm leading-5 text-gray-500">
                  123 Market Street
                  <br />
                  San Francisco, CA 94105,
                  <br />
                  USA
                </span>
              </li>

              <li className="flex items-center gap-3">
                <FiPhone
                  className="shrink-0 text-emerald-500"
                  size={18}
                />
                <a
                  href="tel:+14155550123"
                  className="text-sm text-gray-500 transition hover:text-emerald-500"
                >
                  +1 (415) 555-0123
                </a>
              </li>

              <li className="flex items-center gap-3">
                <FiMail
                  className="shrink-0 text-emerald-500"
                  size={18}
                />
                <a
                  href="mailto:support@grocerycart.com"
                  className="break-all text-sm text-gray-500 transition hover:text-emerald-500"
                >
                  support@grocerycart.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="flex flex-col gap-3 border-t border-gray-200 py-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Â© {new Date().getFullYear()} GroceryCart. All rights reserved.
          </p>

          <p>
            Fresh groceries, delivered with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
