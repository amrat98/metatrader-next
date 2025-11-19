"use client";
import { Hero } from './sections/Hero';
import { Problem } from './sections/Problem';
import { WelcomingPackage } from './sections/WelcomingPackage';
import { IncomePillars } from './sections/IncomePillars';
import { RiskManagement } from './sections/RiskManagement';
import { ProfitSharing } from './sections/ProfitSharing';
import { LuxuryRewards } from './sections/LuxuryRewards';
import { CTA } from './sections/CTA';
import { Navigation } from './sections/Navigation';
import { Footer } from './sections/Footer';


export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <WelcomingPackage />
      <IncomePillars />
      <RiskManagement />
      <ProfitSharing />
      <LuxuryRewards />
      <CTA />
    </>
  );
}
