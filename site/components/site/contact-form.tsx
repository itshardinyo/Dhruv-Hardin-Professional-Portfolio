"use client";

/*
  "Say hi" contact form: a small card over the page (name, email, subject, message) that sends straight to
  Dhruv's inbox through FormSubmit (https://formsubmit.co, free, no account). The very first message sent from
  the live site triggers a one-time "Activate form" email to Dhruv; after he clicks it, every message lands in
  his inbox. If sending fails, the form offers to open the visitor's mail app with everything filled in.
  Esc, the backdrop or Close shuts it; focus returns to whatever opened it.
*/

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { getLenis } from "@/lib/lenis-store";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm({ open, onClose, to }: { open: boolean; onClose: () => void; to: string }) {
  const [mounted, setMounted] = React.useState(false);
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState("");
  const [fields, setFields] = React.useState({ name: "", email: "", subject: "", message: "" });
  const cardRef = React.useRef<HTMLDivElement>(null);
  const firstRef = React.useRef<HTMLInputElement>(null);
  const opener = React.useRef<Element | null>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    setStatus("idle");
    setError("");
    const lenis = getLenis();
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => firstRef.current?.focus());
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  const set = (k: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  const mailto = `mailto:${to}?subject=${encodeURIComponent(fields.subject || "Hi Dhruv")}&body=${encodeURIComponent(
    `${fields.message}\n\n— ${fields.name}${fields.email ? ` (${fields.email})` : ""}`,
  )}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${to}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          _replyto: fields.email,
          _subject: `Portfolio · ${fields.subject || "New message"}`,
          subject: fields.subject,
          message: fields.message,
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && String(data.success) === "true") {
        setStatus("sent");
        setFields({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setError(data.message || "It didn't go through.");
      }
    } catch {
      setStatus("error");
      setError("It didn't go through.");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); onClose(); }
    else if (e.key === "Tab") {
      const f = cardRef.current?.querySelectorAll<HTMLElement>("input, textarea, button, a[href]");
      if (!f || !f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="cf"
          className="cf-backdrop"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
          onKeyDown={onKeyDown}
        >
          <motion.div
            ref={cardRef}
            className="cf-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cf-title"
            initial={{ opacity: 0, y: 24, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            <div className="cf-head">
              <h2 id="cf-title" className="cf-title">Say hi</h2>
              <button type="button" className="gv-chip" onClick={onClose}>Close <span aria-hidden="true">✕</span></button>
            </div>

            {status === "sent" ? (
              <div className="cf-done" role="status">
                <p>Sent. Dhruv will get back to you soon.</p>
                <button type="button" className="gv-chip gv-chip-red" onClick={onClose}>Done</button>
              </div>
            ) : (
              <form className="cf-form" onSubmit={submit}>
                <label className="cf-field">
                  <span>Name</span>
                  <input ref={firstRef} name="name" required autoComplete="name" value={fields.name} onChange={set("name")} />
                </label>
                <label className="cf-field">
                  <span>Your email</span>
                  <input name="email" type="email" required autoComplete="email" value={fields.email} onChange={set("email")} />
                </label>
                <label className="cf-field">
                  <span>Subject</span>
                  <input name="subject" required value={fields.subject} onChange={set("subject")} />
                </label>
                <label className="cf-field">
                  <span>Message</span>
                  <textarea name="message" required rows={5} value={fields.message} onChange={set("message")} />
                </label>
                {status === "error" && (
                  <p className="cf-error" role="alert">
                    {error} <a href={mailto}>Send it from your mail app instead</a>.
                  </p>
                )}
                <div className="cf-actions">
                  <button type="submit" className="gv-chip gv-chip-red" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : "Send"} <span aria-hidden="true">→</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
