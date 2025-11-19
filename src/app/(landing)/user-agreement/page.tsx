"use client";
import React from "react";

export default function UserAgreementPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen overflow-x-hidden pt-36">
        <main className="flex-1">
          <section className="py-8 xl:py-12">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">User Agreement (Billionaire's Blueprint Investment Platform)</h1>
                <p className="text-sm text-muted-foreground">This User Agreement ("Agreement") outlines the rights and obligations between Billionaire's Blueprint and the user.</p>
              </div>
              <div className="space-y-8  p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-blue-500/30 rounded-3xl backdrop-blur-lg shadow-2xl">
                <section>
                  <h2 className="text-xl font-semibold mb-2">1. Acceptance</h2>
                  <p>By creating an account or using the platform, you accept and agree to this Agreement in full.</p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">2. Regulatory Compliance</h2>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>You are solely responsible for determining whether your use of the platform is legal in your jurisdiction.</li>
                    <li>Residents of India are prohibited from investing on Billionaire's Blueprint.</li>
                  </ul>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">3. Platform Use</h2>
                  <p>You may use the platform only for lawful and authorized investment activity. Misuse will result in account termination.</p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">4. Investment Disclaimer</h2>
                  <p>Billionaire's Blueprint does not guarantee any return on investment. All decisions are made at your sole discretion and risk.</p>
                </section>
                <section>
                  <h2 className="text-xl font-semibold mb-2">5. Dispute Resolution</h2>
                  <p>In case of any disputes, the matter will be settled in accordance with the arbitration laws.</p>
                </section>
                <section className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <span role="img" aria-label="warning">⚠️</span> Jurisdictional Disclaimer
                  </h2>
                  <p className="font-semibold mb-1">Restricted Jurisdiction – India</p>
                  <ul className="list-disc pl-6 space-y-1 mb-2">
                    <li>Residents of India are not permitted to invest in or use this platform for investment purposes.</li>
                    <li>By accessing or using this platform, you confirm that you are not a resident, citizen, or tax resident of India.</li>
                  </ul>
                  <p>If an Indian resident proceeds to invest in or use the services of this platform, they do so entirely at their own risk. The platform, its operators, and affiliates shall not be held liable for any legal or regulatory consequences arising from such use. It is the sole responsibility of the user to ensure they comply with all applicable laws and regulations of their jurisdiction.</p>
                </section>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
