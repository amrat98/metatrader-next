"use client";
import * as React from "react";
import SubscriptionTable from "./subscriptiontable";
import SubscriptionPlan from "./subscriptionplan";
import { Suspense } from 'react';

export default function Subscription() {
  return (
    <>
      <div className="flex flex-1 flex-col gap-5 p-4">
        <div className="flex-1">
          <Suspense fallback={<div>Loading...</div>}>
          <SubscriptionPlan />
          </Suspense>
        </div>
        <div className="flex-1 pb-5">
          <Suspense fallback={<div>Loading...</div>}>
            <SubscriptionTable />
          </Suspense>
        </div>
      </div>
    </>
  );
}
