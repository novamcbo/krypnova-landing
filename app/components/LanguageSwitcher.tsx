"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronDown, Globe2 } from "lucide-react";
import {
  localeNames,
  localeShortNames,
  locales,
  pathForLocale,
  type Locale,
} from "@/lib/i18n";
import styles from "./LanguageSwitcher.module.css";

const COOKIE_NAME = "krypnova_locale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function localeFromPath(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0];
  return first === "es" || first === "pt" || first === "fr" ? first : "en";
}

function readLocaleCookie(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${COOKIE_NAME}=`));
  const value = match?.split("=")[1];
  return value && locales.includes(value as Locale) ? (value as Locale) : null;
}

function writeLocaleCookie(locale: Locale) {
  document.cookie = `${COOKIE_NAME}=${locale}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`;
}

export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const currentLocale = useMemo(() => localeFromPath(pathname), [pathname]);

  useEffect(() => {
    const explicitLocale = localeFromPath(pathname);
    if (explicitLocale !== "en") {
      writeLocaleCookie(explicitLocale);
      return;
    }

    const preferred = readLocaleCookie();
    if (preferred && preferred !== "en") {
      router.replace(pathForLocale(pathname, preferred));
    }
  }, [pathname, router]);

  const chooseLocale = (locale: Locale) => {
    writeLocaleCookie(locale);
    setOpen(false);
    router.push(pathForLocale(pathname, locale));
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Choose language"
        onClick={() => setOpen((value) => !value)}
      >
        <Globe2 size={16} />
        <span>{localeShortNames[currentLocale]}</span>
        <ChevronDown size={14} className={open ? styles.rotated : undefined} />
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          {locales.map((locale) => (
            <button
              key={locale}
              type="button"
              role="menuitem"
              className={styles.option}
              onClick={() => chooseLocale(locale)}
            >
              <span>
                <strong>{localeShortNames[locale]}</strong>
                {localeNames[locale]}
              </span>
              {locale === currentLocale && <Check size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
