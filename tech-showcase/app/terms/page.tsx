"use client";

import React, { useState } from "react";
import { CircleArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PrivacyContent, TermsContent } from "@/components/terms-privacy";
import { useRouter } from "next/navigation";

const TermsAndPrivacy = () => {
  const [activeTab, setActiveTab] = useState("terms");
  const router = useRouter();
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex flex-col md:flex-row mb-4">
        <Button
          variant={activeTab === "terms" ? "default" : "ghost"}
          className="mb-2 md:mb-0 md:mr-4 px-4 py-2 rounded"
          onClick={() => setActiveTab("terms")}
        >
          Terms of Service
        </Button>
        <Button
          variant={activeTab === "privacy" ? "default" : "ghost"}
          className="mb-2 md:mb-0 md:mr-4 px-4 py-2 rounded"
          onClick={() => setActiveTab("privacy")}
        >
          Privacy Policy
        </Button>
      </div>

      <div
        className={`bg-white p-6 rounded-lg shadow-md ${activeTab === "privacy" ? "h-[700px]" : "h-[700px] md:h-auto"}`}
      >
        {activeTab === "privacy" ? (
          <ScrollArea className="h-full">
            <PrivacyContent />
          </ScrollArea>
        ) : (
          <ScrollArea className="md:hidden h-full">
            <TermsContent />
          </ScrollArea>
        )}
        {activeTab === "terms" && (
          <div className="hidden md:block">
            <TermsContent />
          </div>
        )}
      </div>

      <div className="flex mt-4 text-md">
        <div>
          <Button variant={"ghost"} onClick={() => router.back()}>
            <div className="flex items-center">
              <CircleArrowLeft className="h-7 w-5 mr-1" />
              <span>Back</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacy;
