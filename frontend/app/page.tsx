import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Translator } from "@/components/translator";
import { AIInsights } from "@/components/ai-insights";
import { HowItWorks } from "@/components/how-it-works";
import { Features } from "@/components/features";
import { Architecture } from "@/components/architecture";
import { Statistics } from "@/components/statistics";
import { Impact } from "@/components/impact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Translator />
        <AIInsights />
        <HowItWorks />
        <Features />
        <Architecture />
        <Statistics />
        <Impact />
      </main>
      <Footer />
    </>
  );
}
