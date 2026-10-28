import { Contact } from "@/components/Contact";
import { Countdown } from "@/components/Countdown";
import { DressCode } from "@/components/DressCode";
import { EventDetails } from "@/components/EventDetails";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { InvitationShell } from "@/components/InvitationShell";
import { InvitationText } from "@/components/InvitationText";
import { Navigation } from "@/components/Navigation";
import { RSVPSection } from "@/components/RSVPSection";
import { StorySection } from "@/components/StorySection";

export default function Home() {
  return (
    <InvitationShell>
      <Navigation />
      <main>
        <Hero />
        <InvitationText />
        <StorySection />
        <Gallery />
        <Countdown />
        <EventDetails />
        <DressCode />
        <RSVPSection />
        <Contact />
      </main>
      <Footer />
    </InvitationShell>
  );
}
