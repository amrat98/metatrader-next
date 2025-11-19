"use client";
import React from "react";

export default function TermsPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen overflow-x-hidden pt-36">
        <main className="flex-1">
          <section className="py-8 xl:py-12">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Terms &amp; Conditions (Billionaire's Blueprint Investment Platform)</h1>
                <p className="text-sm text-muted-foreground">Last Updated: 03-July-2025</p>
              </div>
              <div className="space-y-8  p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-blue-500/30 rounded-3xl backdrop-blur-lg shadow-2xl">
                <section>
                  <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
                  <p>Welcome to Billionaire's Blueprint. By accessing or using our platform, you agree to comply with and be bound by these Terms &amp; Conditions. If you do not agree, please do not use our services.</p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">2. Eligibility</h2>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>You must be at least 18 years of age and legally capable of forming a binding contract in your jurisdiction.</li>
                    <li>Residents of India are strictly prohibited from investing on this platform. Any investment made by Indian users is done at their own risk. Billionaire's Blueprint is not responsible for any legal consequences arising from such activity.</li>
                  </ul>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">3. Investment Risk Disclosure</h2>
                  <p>All investments involve risk. You acknowledge that your use of this platform involves financial risk, including the potential loss of your entire investment. Past performance is not indicative of future results.</p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">4. Account Responsibility</h2>
                  <p>You are responsible for maintaining the confidentiality of your account and credentials. You agree to notify us immediately of any unauthorized access to your account.</p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">5. Prohibited Use</h2>
                  <p>You agree not to use Billionaire's Blueprint for any unlawful, unauthorized, or unethical activities including money laundering, terrorism financing, or any form of market manipulation.</p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">6. Intellectual Property</h2>
                  <p>All content, branding, and intellectual property on Billionaire's Blueprint is owned by or licensed to Billionaire's Blueprint. No part of the platform may be reproduced without written permission.</p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">7. Limitation of Liability</h2>
                  <p>Billionaire's Blueprint is not liable for any loss or damage incurred as a result of your use of the platform, including but not limited to loss of profits, data, or any indirect or consequential losses.</p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">8. Governing Law</h2>
                  <p>These Terms shall be governed by and interpreted in accordance with the laws.</p>
                </section>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
