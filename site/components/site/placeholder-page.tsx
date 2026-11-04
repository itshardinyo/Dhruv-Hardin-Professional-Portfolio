import Image from "next/image";

/** Simple page: big title, one line of text, and optionally the signature bottom-right (as on the hero). */
export function PlaceholderPage({ title, text = "Coming up next.", signature = false }: { title: string; text?: string; signature?: boolean }) {
  return (
    <section className="placeholder" style={{ position: "relative" }}>
      <h1 className="display-rough">{title}</h1>
      <p className="coming">{text}</p>
      {signature && (
        <div className="sig">
          <Image src="/signature.png" alt="Dhruv Hardin’s signature" width={1005} height={345} sizes="(max-width: 639px) 160px, 21vw" />
        </div>
      )}
    </section>
  );
}
