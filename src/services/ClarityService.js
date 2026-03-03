/**
 * ClarityService: Koza gelişim ve dönüşüm motoru.
 * Hikaye yapılandırmasına dayalı olarak "Dönüşüm Oranı" ve "Gelişim Puanı" hesaplar.
 */
export const ClarityService = {
    /**
     * Gelişim Puanını (eski adıyla XP) hesaplar.
     * @param {string} input - Ham anlatı verisi.
     * @param {object} analysis - AI tarafından oluşturulan yapılandırılmış çıktı.
     * @returns {number} Kazanılan Gelişim Puanı.
     */
    calculateClarityGain: (input, analysis) => {
        const inputWeight = Math.min(Math.floor(input.length / 50), 50); // Derinliği ödüllendir, 50 ile sınırla
        const signalStrength = analysis?.actionPoints?.length ? analysis.actionPoints.length * 10 : 20;
        const transformationBonus = 50; // Başarılı dönüşüm için sabit bonus

        return inputWeight + signalStrength + transformationBonus;
    },

    /**
     * Kullanıcı için "Dönüşüm Oranı" metriği üretir.
     */
    getEntropyReductionScore: (userStats) => {
        const baseLevel = userStats?.storiesCreated || 0;
        const multiplier = userStats?.xp || 0;

        // "Kontrol Edilen Kaos Yüzdesi"ni döndür
        return Math.min(Math.round((baseLevel * 2) + (multiplier / 1000)), 99.9);
    }
};
