"use client";
import { Hero } from './sections/hero';
import { Problem } from './sections/problem';
import { WelcomingPackage } from './sections/welcomingpackage';
import { IncomePillars } from './sections/incomepillars';
import { RiskManagement } from './sections/riskmanagement';
import { ProfitSharing } from './sections/profitsharing';
import { LuxuryRewards } from './sections/luxuryrewards';
import { CTA } from './sections/cta';


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
