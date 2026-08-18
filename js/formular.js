/**
 * formular.js
 * Zum Testen wird die eingegebene E-Mail vom
 * User als versand E-Mail eingesetzt
 * was in Echt keinen Sinn macht, da man sich die E-Mail selber zusenden
 */
// ── Konfiguration ──────────────────────────────────────────
const GRUND = "Littlespaceman - Kontaktformular - ";
// ──────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");

    if (!form) {
        console.warn("formular.js: Kein <form>-Element gefunden.");
        return;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Pflichtfelder prüfen
        if (!validieren(form)) return;

        // Werte auslesen
        const anrede    = getRadio("anrede");
        const nachname  = getVal("text_nachname");
        const vorname   = getVal("text_name");
        const betreff   = getVal("text_betreff");
        const email     = getVal("text_email");      // Wird als Empfänger verwendet
        const nachricht = getVal("text_message");

        // E-Mail-Body aufbauen
        const body = [
            "══════════════════════════════",
            "  PERSÖNLICHE ANGABEN",
            "══════════════════════════════",
            "Anrede:        " + (anrede   || "–"),
            "Betreff:       " + (betreff  || "–"),
            "Nachname:      " + (nachname || "–"),
            "Vorname:       " + (vorname  || "–"),
            "E-Mail:        " + (email    || "–"),
            "",
            "══════════════════════════════",
            "  NACHRICHT",
            "══════════════════════════════",
            "Nachricht:         " + (nachricht || "–"),
            "",
            "──────────────────────────────",
            "Gesendet über das Kontaktformular von Littlespaceman",
        ].join("\n");

        // Empfänger-Adresse dynamisch aus dem Formular lesen
        const EMPFAENGER = email;

        // Betreff zusammensetzen
        const BETREFF = GRUND + betreff;

        // mailto-Link zusammensetzen
        const mailto =
            "mailto:" + encodeURIComponent(EMPFAENGER) +
            "?subject=" + encodeURIComponent(BETREFF) +
            "&body="    + encodeURIComponent(body);

        // Mailprogramm öffnen
        window.location.href = mailto;
    });


    // ── Hilfsfunktionen ───────────────────────────────────────

    /** Liest den Wert eines Text-Inputs (getrimmt). */
    function getVal(name) {
        const el = document.querySelector('[name="' + name + '"]');
        return el ? el.value.trim() : "";
    }

    /** Liest den Wert einer Radio-Gruppe. */
    function getRadio(name) {
        const checked = document.querySelector('[name="' + name + '"]:checked');
        if (!checked) return "";
        // Label-Text zum gewählten Radio ermitteln
        const label = document.querySelector('label[for="' + checked.id + '"]');
        return label ? label.textContent.trim() : checked.value;
    }

    /**
     * Einfache Pflichtfeld-Validierung.
     * Felder mit required werden geprüft und optisch markiert.
     */
    function validieren(form) {

        let ok = true;
        const pflichtfelder = form.querySelectorAll("[required]");

        pflichtfelder.forEach(function (el) {
            let fieldOk = true;

            // Spezielle Prüfung für Radio-Buttons (Anrede)
            if (el.type === "radio") {
                const name = el.getAttribute("name");
                const isChecked = form.querySelector(`input[name="${name}"]:checked`);
                if (!isChecked) fieldOk = false;
            } else {
                if (!el.value.trim() || !el.checkValidity()) fieldOk = false;
            }

            if (!fieldOk) {
                ok = false;
            }
        });

        if (!ok) {
            form.classList.add("has-error");
            const hinweis = document.getElementById("pflichtfeld-hinweis");
            if (hinweis) {
                hinweis.textContent = "Bitte alle Pflichtfelder (*) ausfüllen.";
            }
        } else {
            form.classList.remove("has-error");
            const hinweis = document.getElementById("pflichtfeld-hinweis");
            if (hinweis) {
                hinweis.textContent = "Felder markiert mit * sind Pflichtfelder.";
            }
        }

        return ok;
    }

    /** Zeigt die Fehlermeldung im vorhandenen Feld an und aktiviert das CSS. */
    function zeigeHinweis(form, text) {
        const hinweis = document.getElementById("pflichtfeld-hinweis");
        if (hinweis) {
            hinweis.textContent = text;
            form.classList.add("has-error");
            hinweis.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /** Setzt den Hinweis auf den Standardzustand zurück. */
    function entferneHinweis(form) {
        const hinweis = document.getElementById("pflichtfeld-hinweis");
        if (hinweis) {
            hinweis.textContent = "Felder markiert mit * sind Pflichtfelder.";
            form.classList.remove("has-error");
        }
    }

});
