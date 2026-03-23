// lib/refs.js
import { db } from "@/lib/firebase";
import { doc, collection } from "firebase/firestore";

export const refs = {
  // ── Home / Hero ─────────────────────────────────────
  homeCol:    () => collection(db, "home"),
  homeVar:    (id) => doc(db, "home", id),
  cvDoc:      () => doc(db, "home", "cv"),
  // hero_prenom, hero_intro, hero_role, hero_location
  // ticker_items (JSON array), typewriter_phrases (JSON array)
  // header_tagline, about_quote, about_p1, about_p2
  // v1_title, v1_desc, v2_title, v2_desc, v3_title, v3_desc

  // ── Services ────────────────────────────────────────
  serviceVar: (id) => doc(db, "services", id),
  // svc_01_title, svc_01_desc ... svc_06_title, svc_06_desc

  // ── Work ────────────────────────────────────────────
  workVar:    (id) => doc(db, "work", id),
  // proj_01_title, proj_01_desc, proj_01_year, proj_01_live, proj_01_github ...

  // ── Resume ──────────────────────────────────────────
  resumeVar:  (id) => doc(db, "resume", id),
  // exp_0_period, exp_0_title, exp_0_sub, exp_0_desc
  // edu_0_period, edu_0_title, edu_0_sub, edu_0_desc
  // cert_0_year, cert_0_label ...

  // ── Contact ─────────────────────────────────────────
  contactVar: (id) => doc(db, "contact", id),
  // email, location, linkedin, github
};