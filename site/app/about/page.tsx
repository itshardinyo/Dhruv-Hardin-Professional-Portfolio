import type { Metadata } from "next";
import { MrSondrArt } from "@/components/site/mr-sondr";

export const metadata: Metadata = {
  title: "About me · Dhruv Hardin",
  description: "Dhruv Hardin: Mauritian-Canadian, UBC grad, football, streetwear, drawing and SONDR.",
};

/*
  About me: Mr. Sondr smoking bottom-left (same art as the hero, no lighting intro), the title top-right and the bio
  under it. Draft bio written from what Dhruv has shared; edit the copy here.
*/
export default function Page() {
  return (
    <section className="about">
      <div className="mr-sondr" aria-hidden="true">
        <MrSondrArt />
      </div>
      <div className="about-body">
        <h1 className="display-rough about-title">About me</h1>
        <div className="about-text">
          <p>
            I’m Dhruv. Mauritian-Canadian, UBC grad in Economics, Commerce and Languages, and I switch between English,
            French and Spanish without thinking about it.
          </p>
          <p>
            SONDR is the feeling that every stranger has a life as vivid as your own. It’s the name on everything I make:
            the clothes, the comics, and the guy smoking over there.
          </p>
          <p className="about-kicker">What makes me, me</p>
          <ul>
            <li>Football, always. One day: Sporting Director.</li>
            <li>Streetwear and brand culture. I co-founded Hustler Jerseys.</li>
            <li>Drawing. Mr. Sondr started as a sketch.</li>
            <li>Fantasy books. ACOTAR, Fourth Wing.</li>
            <li>New cities, new cultures.</li>
          </ul>
          <p className="about-last">Also, a very good looking human being.</p>
        </div>
      </div>
    </section>
  );
}
