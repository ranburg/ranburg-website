"use client";

import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

export default function ApexTestGenerator() {
  const [className, setClassName] = useState("AccountService");
  const [methodName, setMethodName] = useState("updateAccounts");

  const code = `@isTest
private class ${className}Test {
    @TestSetup
    static void setupData() {
        insert new Account(Name = 'Test Account', Industry = 'Technology');
    }

    @isTest
    static void test${methodName}() {
        List<Account> accounts = [SELECT Id, Name FROM Account LIMIT 1];
        Test.startTest();
        ${className}.${methodName}(accounts);
        Test.stopTest();
        System.assertEquals(1, accounts.size(), 'Expected one account');
    }
}`;

  return (
    <div className="glass-card space-y-6 p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm text-theme-muted">Class Name</label>
          <input value={className} onChange={(e) => setClassName(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm text-theme-muted">Method to Test</label>
          <input value={methodName} onChange={(e) => setMethodName(e.target.value)} className="input-field mt-1" />
        </div>
      </div>
      <div className="rounded-xl bg-slate-950/50 p-4">
        <div className="mb-2 flex justify-between"><span className="text-sm text-theme-body">Test Class</span><CopyButton text={code} /></div>
        <pre className="overflow-x-auto font-mono text-xs text-accent-emerald">{code}</pre>
      </div>
    </div>
  );
}
