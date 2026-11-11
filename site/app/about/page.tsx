import type { Metadata } from "next";
import { MrSondrArt } from "@/components/site/mr-sondr";

export const metadata: Metadata = {
  title: "About me · Dhruv Hardin",
  description: "Dhruv Hardin is a simple Human Being. He has big dreams, ambition, and above all, he tries.",
};

/*
  About me: Mr. Sondr smoking bottom-left (same art as the hero, no lighting intro), the title top-right and the bio
  under it. The copy is Dhruv's own words; edit it here.
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
            Dhruv Hardin is a simple Human Being. He has big dreams, ambition, and above all, he tries.
          </p>
          <blockquote className="about-quote">
            <p>
              “Change is always apprehensive. But everything falls in place. Quicker than you think. All will be good.
              Trust yourself and all the good in you.”
            </p>
            <footer>— Robin Hardin</footer>
          </blockquote>
          <figure className="about-rating">
            <div className="about-stars" role="img" aria-label="Six stars">★★★★★★</div>
            <blockquote>
              <ol>
                <li>Physical discipline</li>
                <li>Emotional discipline</li>
                <li>Financial discipline</li>
                <li>Mental discipline</li>
                <li>Professional discipline</li>
              </ol>
            </blockquote>
          </figure>
          <p className="about-sondr">
            <strong>Sondr</strong> is the deep realization that each person has a life as complex, ambitious, and rich in
            depth as you do.
          </p>
        </div>
      </div>
    </section>
  );
}
