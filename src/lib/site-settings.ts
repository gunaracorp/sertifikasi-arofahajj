import { db } from "@/lib/db";
import { DEFAULT_THEME_ID, THEME_IDS } from "@/lib/themes";

// ============================================================
// AROFAHAJJ UNIVERSE — Studio CMS: Pengaturan Situs (v2.4.0)
// Penyimpanan key/value ala wp_options di tabel SiteSetting.
// Fungsi "aman" selalu mengembalikan nilai default saat DB
// tidak tersedia — build statis & dev tanpa DB tidak pernah crash.
// ============================================================

export const SETTING_KEYS = {
  activeTheme: "activeTheme",
} as const;

/** Baca satu setting (null bila tidak ada / DB mati) */
export async function getSetting(key: string): Promise<string | null> {
  try {
    const row = await db.siteSetting.findUnique({ where: { key } });
    return row?.value ?? null;
  } catch {
    return null;
  }
}

/** Tulis (upsert) satu setting */
export async function setSetting(key: string, value: string): Promise<void> {
  await db.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}

/** Tema aktif situs — tervalidasi terhadap registri tema */
export async function getActiveThemeId(): Promise<string> {
  const raw = await getSetting(SETTING_KEYS.activeTheme);
  return raw && THEME_IDS.includes(raw) ? raw : DEFAULT_THEME_ID;
}

/** Simpan tema aktif (asumsi sudah divalidasi pemanggil) */
export async function setActiveThemeId(themeId: string): Promise<void> {
  await setSetting(SETTING_KEYS.activeTheme, themeId);
}
