"use client";
import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <>
    <div className="flex flex-col min-h-screen overflow-x-hidden pt-36">
        <main className="flex-1">
          <section className="py-8 xl:py-12">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Privacy Policy (Metatrader Investment Platform)</h1>
                <p className="text-sm text-muted-foreground">Effective Date: 03-July-2025</p>
                <p className="mt-2">Metatrader is committed to protecting your privacy. This policy outlines how we collect, use, store, and share your data.</p>
              </div>
              <div className="space-y-8 p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-blue-500/30 rounded-3xl backdrop-blur-lg shadow-2xl">
                <section>
                  <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Personal Identification (e.g., name, email, ID documents)</li>
                    <li>Financial Information (wallet addresses, investment history)</li>
                    <li>Usage Data (IP address, browser type, time spent on platform)</li>
                  </ul>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">2. How We Use Your Data</h2>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>To operate and maintain your account</li>
                    <li>To process transactions and verify identity</li>
                    <li>To comply with legal obligations (e.g., KYC/AML requirements)</li>
                    <li>For analytics and service improvement</li>
                  </ul>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>
                  <p>We do not sell your data. We may share your information with trusted third-party partners or regulators only when required by law or necessary to provide our services.</p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
                  <p>We use encryption, firewalls, and secure servers to protect your data, but we cannot guarantee absolute security.</p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">5. Cookies</h2>
                  <p>Metatrader uses cookies to enhance user experience and collect statistical data. You may disable cookies in your browser settings.</p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
                  <p>You may request access to, correction, or deletion of your data by contacting our support team.</p>
                </section>
              </div>
            </div>
          </section>
        </main>
        </div>
    </>
  );
}
