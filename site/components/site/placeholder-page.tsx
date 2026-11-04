/** Simple page: big title and one line of text (About me for now). */
export function PlaceholderPage({ title, text = "Coming up next." }: { title: string; text?: string }) {
  return (
    <section className="placeholder">
      <h1 className="display-rough">{title}</h1>
      <p className="coming">{text}</p>
    </section>
  );
}
