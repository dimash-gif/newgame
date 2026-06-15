// "The Vigilant Sovereign" - Cyber-Defense Medieval Game
// Powered by Phaser.js and Custom Web Audio Synth

// ==========================================
// 1. RETRO SOUND SYNTHESIZER (Web Audio API)
// ==========================================
class SoundSynth {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playClick() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playSuccess() {
        if (!this.enabled) return;
        this.init();
        const t = this.ctx.currentTime;
        const playTone = (freq, delay, duration) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + delay);
            gain.gain.setValueAtTime(0.06, t + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, t + delay + duration - 0.01);
            osc.start(t + delay);
            osc.stop(t + delay + duration);
        };
        playTone(392.00, 0, 0.1);     // G4
        playTone(523.25, 0.1, 0.1);   // C5
        playTone(659.25, 0.2, 0.12);  // E5
        playTone(783.99, 0.32, 0.25); // G5
    }

    playFail() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(70, this.ctx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.45);
    }

    playArrest() {
        if (!this.enabled) return;
        this.init();
        const t = this.ctx.currentTime;
        const playTone = (freq, delay, duration) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, t + delay);
            gain.gain.setValueAtTime(0.04, t + delay);
            gain.gain.linearRampToValueAtTime(0.001, t + delay + duration);
            osc.start(t + delay);
            osc.stop(t + delay + duration);
        };
        playTone(440.00, 0, 0.15); // A4 (Trumpet blast)
        playTone(440.00, 0.18, 0.15);
        playTone(349.23, 0.36, 0.3); // F4
    }

    playFire() {
        if (!this.enabled) return;
        this.init();
        const duration = 0.5;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 400;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
        noise.stop(this.ctx.currentTime + duration);
    }

    playExplosion() {
        if (!this.enabled) return;
        this.init();
        const duration = 0.8;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + duration);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
        noise.stop(this.ctx.currentTime + duration);
    }

    playToolSound() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(1174.66, this.ctx.currentTime + 0.15); // D6
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }
}

const sfx = new SoundSynth();

// ==========================================
// LOCALIZATION SYSTEM (English & Russian)
// ==========================================
let currentLang = localStorage.getItem('vigilant_sov_lang') || 'en';

const UI_TRANSLATIONS = {
    en: {
        title1: "THE VIGILANT",
        title2: "SOVEREIGN",
        subtitle: "CYBER-DEFENSE REALM",
        shieldLabel: "KINGDOM SHIELD",
        wisdomLabel: "WISDOM",
        economyLabel: "ECONOMY",
        levelLabel: "DEFENSE LEVEL",
        secureStatus: "GATE SECURITY: SECURE",
        congestionStatus: "QUEUE CRITICAL: CONGESTION!",
        levelText: "LEVEL",
        bootProtocols: "BOOT REALM PROTOCOLS",
        introTitle: "DEFEND THE SOVEREIGN REALM!",
        introText: "Welcome, Royal Security Officer. Suspicious caravans are approaching the castle gates. Each caravan represents a **Data Packet** attempting to enter the kingdom's network. Inspect them using your **Security Tools**, then make your decision. Block threats, protect the Economy from false alarms, and gain Wisdom to secure the realm.",
        senderLabel: "Claimed Sender:",
        routeLabel: "Trade Route:",
        sealLabel: "Seal of Authenticity:",
        weightLabel: "Cargo Weight:",
        loading: "Loading...",
        unresolved: "Unresolved",
        realSourceLabel: "[LENS] Real Source:",
        realSizeLabel: "[SCALE] Real Size / Format:",
        sigIntegrityLabel: "[CRYPTO] Signature Integrity:",
        toolsTitle: "ACTIVE SECURITY TOOLS",
        toolLens: "Truth Lens",
        toolScale: "Magic Scale",
        toolCrypto: "Cryptographer",
        toolCage: "Quarantine Cage",
        decisionTitle: "SOVEREIGN DECISION",
        btnAllow: "ALLOW / OPEN",
        btnVerify: "TRUST & VERIFY",
        btnArrest: "DENY & REPORT",
        btnBurn: "IGNORE & BURN",
        modalTitle: "REPORTING SECURITY THREAT",
        modalDesc: "Identify the precise vector of this attack to file correct report details with the High Council:",
        feedbackTitleSuccess: "REALM PROTECTED",
        feedbackTitleFailure: "SECURITY BREACH ALERT",
        continueDuty: "CONTINUE DUTY",
        rebootRetry: "REBOOT REALM (RETRY)",
        victoryTitle: "THE REALM IS SECURED!",
        victoryText: "All caravans have been inspected. The kingdom stands secure against modern cyber threats!",
        restartBtn: "REPLAY DUTY PROTOCOLS",
        soundLabel: "SOUND",
        themeLabel: "THEME",
        langLabel: "LANGUAGE",
        guardsLabel: "GUARDS",
        on: "ON",
        off: "OFF",
        firewallGateSign: "FIREWALL GATE",
        incineratorSign: "INCINERATOR",
        
        // Dynamic texts
        sandboxActive: "Quarantine Cage Sandbox Active...",
        sandboxMalware: "Cage Sandbox: MALWARE WARNING!",
        sandboxClean: "Cage Sandbox: BEHAVIOR CLEAN",
        inspectedProfile: "Inspected Caravan Profile",
        trueSize: "TRUE SIZE:",
        intrusionAlertTitle: "⚠️ FIREWALL BREACH ALERT ⚠️",
        malwareDetected: "MALWARE DETECTED IN THE CASTLE KEEP!",
        breachDetected: "BREACH DETECTED:",
        
        // Game Over titles and post-mortems
        gameOverInfected: "THE CASTLE IS INFECTED!",
        gameOverBankrupt: "THE KINGDOM BANKRUPT!",
        gameOverCongestion: "CONGESTION COLLAPSE!",
        gameOverInfectedText: "Critical security failure. Your health hit 0. The castle data was fully encrypted by Ransomware and backdoors leaked royal databases. <br><br><b>Educational Tip:</b> Always verify file sizes on the scale and inspect certificate signatures before granting entrance.",
        gameOverBankruptText: "The economy has collapsed. Your paranoia led you to block, burn, and arrest legitimate merchant supply lines. The local marketplaces shut down. <br><br><b>Educational Tip:</b> Balanced security relies on productivity. Do not block items that check out as valid and secure. Verify before blocking!",
        gameOverCongestionText: "The gate queue overflowed. Trade came to a standstill, causing local riots. Security officers must act swiftly and efficiently.",
        
        // Feedback texts
        feedbackInfectionDetected: "INFECTION DETECTED! ",
        feedbackSafeAccess: "SAFE ACCESS: You successfully allowed a legitimate supply caravan into the kingdom. The marketplace flourishes.",
        feedbackSuccessReport: "SUCCESSFUL SECURITY REPORT! You correctly arrested the merchant and identified the threat as ",
        feedbackSuccessReportSuffix: ". +10 Wisdom Points. <br><br><b>Explanation:</b> ",
        feedbackIncompleteReport: "THREAT BLOCKED (INCOMPLETE REPORT): The caravan was blocked safely, but your report filed it under the wrong category. The actual threat was ",
        feedbackIncompleteReportSuffix: ". +3 Wisdom Points. <br><br><b>Explanation:</b> ",
        feedbackSecurityInfringement: "SECURITY INFRINGEMENT: You arrested a legitimate trade caravan (",
        feedbackSecurityInfringementSuffix: "). Innocent merchants were imprisoned, which disrupted the marketplace. -15% Economy.",
        feedbackThreatIncinerated: "THREAT INCINERATED: You safely burned the suspicious caravan, preventing infection. However, reporting it to the Council would have yielded higher Wisdom points. +5 Wisdom Points.",
        feedbackEconomicSabotage: "ECONOMIC SABOTAGE: You completely incinerated a safe cargo caravan (",
        feedbackEconomicSabotageSuffix: "). The guild suffered severe losses, damaging castle trade. -15% Economy.",
        feedbackLevelCompleted: "LEVEL COMPLETED! <br><br>You successfully guarded the gate. Level ",
        feedbackLevelCompletedSuffix: " presents complex vulnerabilities (double extension Trojans, Mimic installers, and Zip Bombs). Prepare your tools!",
        
        // Victory stats
        victoryStatsWisdom: "Final Wisdom Score:",
        victoryStatsRank: "Final Guard Rank:",
        victoryStatsPhish: "Phishing Attacks Stopped:",
        victoryStatsTrojan: "Trojans Identified:",
        victoryStatsZipBomb: "Zip Bombs Incinerated:",
        victoryStatsSocial: "Social Engineering Defeated:",
        victoryStatsMitm: "Insecure Connections Blocked (MITM):",
        victoryStatsFakeUpdate: "Fake Updates Blocked:",
        victoryStatsFalseAlarms: "False Alarms Raised:",
        victoryStatsLeaks: "Malware Leaks:",
        
        // Rank Names
        rankSovereign: "Sovereign Defender",
        rankApprentice: "Apprentice Sentry",
        rankKnight: "Knight Watchman",
        rankHighGuard: "High Guard Inquisitor",

        // Tutorial / Guidance
        tutorialTitle: "HOW TO PLAY",
        tutorialSubtitle: "Royal Security Officer Training Manual",
        tutStep1Title: "\ud83d\udd0d Inspect",
        tutStep1Desc: 'Use your <strong>Security Tools</strong> (Truth Lens, Magic Scale, Cryptographer) to reveal hidden information about each caravan. Look for mismatches between claimed and actual values.',
        tutStep2Title: "\u2696\ufe0f Analyze",
        tutStep2Desc: 'Compare the <strong>Claimed Sender</strong> with the <strong>Real Source</strong>. Check if the seal is valid. If values say MISMATCH or the route is EXTERNAL \u2014 it\'s likely a threat!',
        tutStep3Title: "\u2705 Decide",
        tutStep3Desc: 'Choose your action: <strong>Allow</strong> safe caravans to boost Economy, or <strong>Deny & Report</strong> threats. Wrong decisions cost Health or Economy!',
        tutStep4Title: "\ud83d\udcdd Report",
        tutStep4Desc: 'When reporting a threat, pick the <strong>correct threat type</strong> to earn <strong>+10 Wisdom</strong>. Wrong category still blocks the threat but gives only +3 Wisdom.',
        tutDecisionsTitle: "DECISION GUIDE",
        tutGuideAllowLabel: "ALLOW / OPEN",
        tutGuideAllowText: "Use when all tools show VALID / MATCH results. Boosts Economy +5%.",
        tutGuideVerifyLabel: "TRUST & VERIFY",
        tutGuideVerifyText: "Sends to quarantine sandbox for a deep scan. Safe option when unsure.",
        tutGuideDenyLabel: "DENY & REPORT",
        tutGuideDenyText: "Block the threat and file a report. Pick correct type for max Wisdom (+10).",
        tutGuideBurnLabel: "IGNORE & BURN",
        tutGuideBurnText: "Destroy without reporting. Blocks threat but gives only +5 Wisdom.",
        tutorialCloseBtn: "BEGIN DUTY",
        progressLabel: "CARAVAN",
        keyTipsText: "Tip: Look for MISMATCH in sender or EXTERNAL routes \u2014 those are threats!",
        tooltipAllow: "Use when all tools show VALID / MATCH results",
        tooltipAllowHint: "\u2705 SAFE CARAVAN",
        tooltipVerify: "Sends to quarantine for a deep sandbox scan",
        tooltipVerifyHint: "\ud83d\udd2c UNSURE?",
        tooltipArrest: "Block & report \u2014 pick the correct threat type for +10 Wisdom",
        tooltipArrestHint: "\ud83d\udea8 THREAT FOUND",
        tooltipBurn: "Incinerate without report \u2014 only +5 Wisdom",
        tooltipBurnHint: "\ud83d\udd25 QUICK DESTROY"
    },
    ru: {
        title1: "БДИТЕЛЬНЫЙ",
        title2: "СУВЕРЕН",
        subtitle: "ЦАРСТВО КИБЕРЗАЩИТЫ",
        shieldLabel: "ЩИТ КОРОЛЕВСТВА",
        wisdomLabel: "МУДРОСТЬ",
        economyLabel: "ЭКОНОМИКА",
        levelLabel: "УРОВЕНЬ ЗАЩИТЫ",
        secureStatus: "БЕЗОПАСНОСТЬ ВОРОТ: НАДЁЖНО",
        congestionStatus: "ОЧЕРЕДЬ КРИТИЧЕСКАЯ: ПЕРЕГРУЗКА!",
        levelText: "УРОВЕНЬ",
        bootProtocols: "ЗАПУСТИТЬ ПРОТОКОЛЫ КОРОЛЕВСТВА",
        introTitle: "ЗАЩИТИТЕ СУВЕРЕННОЕ КОРОЛЕВСТВО!",
        introText: "Приветствуем вас, королевский офицер безопасности. Подозрительные караваны приближаются к воротам замка. Каждый караван представляет собой **пакет данных**, пытающийся проникнуть в сеть королевства. Осмотрите их с помощью ваших **инструментов безопасности** и примите решение. Блокируйте угрозы, оберегайте Экономику от ложных тревог и накапливайте Мудрость, чтобы защитить королевство.",
        senderLabel: "Заявленный отправитель:",
        routeLabel: "Торговый путь:",
        sealLabel: "Печать подлинности:",
        weightLabel: "Вес груза:",
        loading: "Загрузка...",
        unresolved: "Не определено",
        realSourceLabel: "[ЛИНЗА] Реальный источник:",
        realSizeLabel: "[ВЕСЫ] Реальный размер/формат:",
        sigIntegrityLabel: "[КРИПТО] Целостность подписи:",
        toolsTitle: "АКТИВНЫЕ ИНСТРУМЕНТЫ БЕЗОПАСНОСТИ",
        toolLens: "Линза Истины",
        toolScale: "Волшебные Весы",
        toolCrypto: "Криптограф",
        toolCage: "Карантинная Клетка",
        decisionTitle: "РЕШЕНИЕ СУВЕРЕНА",
        btnAllow: "ПРОПУСТИТЬ / ОТКРЫТЬ",
        btnVerify: "ПРОВЕРИТЬ В КАРАНТИНЕ",
        btnArrest: "ЗАДЕРЖАТЬ / ДОЛОЖИТЬ",
        btnBurn: "СЖЕЧЬ / ИГНОРИРОВАТЬ",
        modalTitle: "ОТЧЕТ ОБ УГРОЗЕ БЕЗОПАСНОСТИ",
        modalDesc: "Определите точный вектор этой атаки, чтобы отправить верный отчет в Высший Совет:",
        feedbackTitleSuccess: "КОРОЛЕВСТВО ЗАЩИЩЕНО",
        feedbackTitleFailure: "ТРЕВОГА: ПРОРЫВ БЕЗОПАСНОСТИ",
        continueDuty: "ПРОДОЛЖИТЬ СЛУЖБУ",
        rebootRetry: "ПЕРЕЗАГРУЗИТЬ (ПОВТОРИТЬ)",
        victoryTitle: "КОРОЛЕВСТВО В БЕЗОПАСНОСТИ!",
        victoryText: "Все караваны проверены. Королевство надежно защищено от современных киберугроз!",
        restartBtn: "ИГРАТЬ СНОВА",
        soundLabel: "ЗВУК",
        themeLabel: "ТЕМА",
        langLabel: "ЯЗЫК",
        guardsLabel: "СТРАЖА",
        on: "ВКЛ",
        off: "ВЫКЛ",
        firewallGateSign: "КИБЕР-ВОРОТА",
        incineratorSign: "УТИЛИЗАТОР",
        
        // Dynamic texts
        sandboxActive: "Карантинная клетка: анализ...",
        sandboxMalware: "Анализ: ОБНАРУЖЕНО ВРЕДОНОСНОЕ ПО!",
        sandboxClean: "Анализ: УГРОЗ НЕ ОБНАРУЖЕНО",
        inspectedProfile: "Проверенный профиль каравана",
        trueSize: "РЕАЛЬНЫЙ РАЗМЕР:",
        intrusionAlertTitle: "⚠️ ОБНАРУЖЕН ПРОРЫВ БРАНДМАУЭРА ⚠️",
        malwareDetected: "ВНУТРИ ЗАМКА ОБНАРУЖЕНО ВРЕДОНОСНОЕ ПО!",
        breachDetected: "ОБНАРУЖЕН ПРОРЫВ:",
        
        // Game Over titles and post-mortems
        gameOverInfected: "ЗАМОК ЗАРАЖЕН!",
        gameOverBankrupt: "КОРОЛЕВСТВО ОБАНКРОТИЛОСЬ!",
        gameOverCongestion: "КОЛЛАПС ИЗ-ЗА ПЕРЕГРУЗКИ!",
        gameOverInfectedText: "Критический сбой безопасности. Ваша прочность упала до 0. Данные замка были полностью зашифрованы программами-вымогателями, а бэкдоры слили королевские базы данных. <br><br><b>Обучающий совет:</b> Всегда взвешивайте файлы на весах и проверяйте подписи сертификатов перед тем, как разрешить вход.",
        gameOverBankruptText: "Экономика рухнула. Ваша паранойя привела к блокировке, сожжению и задержанию легальных торговых путей. Местные рынки закрылись. <br><br><b>Обучающий совет:</b> Сбалансированная безопасность зависит от производительности. Не блокируйте объекты, которые определены как легитимные и безопасные. Проверяйте перед тем как блокировать!",
        gameOverCongestionText: "Очередь у ворот переполнилась. Торговля остановилась, вызвав бунты среди местных жителей. Офицеры безопасности должны действовать быстро и эффективно.",
        
        // Feedback texts
        feedbackInfectionDetected: "ОБНАРУЖЕНО ЗАРАЖЕНИЕ! ",
        feedbackSafeAccess: "БЕЗОПАСНЫЙ ДОСТУП: Вы успешно впустили законный торговый караван в королевство. Рынок процветает.",
        feedbackSuccessReport: "УСПЕШНЫЙ ОТЧЕТ ОБ УГРОЗЕ! Вы правильно задержали торговца и определили угрозу как ",
        feedbackSuccessReportSuffix: ". +10 очков Мудрости. <br><br><b>Объяснение:</b> ",
        feedbackIncompleteReport: "УГРОЗА БЛОКИРОВАНА (НЕПОЛНЫЙ ОТЧЕТ): Караван успешно заблокирован, но вы указали неверную категорию в отчете. Фактическая угроза: ",
        feedbackIncompleteReportSuffix: ". +3 очка Мудрости. <br><br><b>Объяснение:</b> ",
        feedbackSecurityInfringement: "НАРУШЕНИЕ ПРАВ: Вы задержали законный торговый караван (",
        feedbackSecurityInfringementSuffix: "). Невинные торговцы заключены под стражу, что нарушило работу рынка. -15% Экономики.",
        feedbackThreatIncinerated: "УГРОЗА СЖЕЧЬ: Вы благополучно сожгли подозрительный караван, предотвратив заражение. Однако сообщение об этом Совету принесло бы больше очков Мудрости. +5 очков Мудрости.",
        feedbackEconomicSabotage: "ЭКОНОМИЧЕСКИЙ САБОТАЖ: Вы полностью сожгли безопасный караван с грузом (",
        feedbackEconomicSabotageSuffix: "). Гильдия понесла серьезные убытки, торговля пострадала. -15% Экономики.",
        feedbackLevelCompleted: "УРОВЕНЬ ЗАВЕРШЕН! <br><br>Вы успешно защитили ворота. Уровень ",
        feedbackLevelCompletedSuffix: " представляет собой сложные уязвимости (трояны с двойным расширением, фальшивые обновления-мимики и архивные бомбы). Подготовьте свои инструменты!",
        
        // Victory stats
        victoryStatsWisdom: "Итоговая мудрость:",
        victoryStatsRank: "Итоговый ранг стражи:",
        victoryStatsPhish: "Остановлено фишинговых атак:",
        victoryStatsTrojan: "Выявлено троянов:",
        victoryStatsZipBomb: "Уничтожено архивных бомб:",
        victoryStatsSocial: "Побеждено социальной инженерии:",
        victoryStatsMitm: "Заблокировано небезопасных соединений (MITM):",
        victoryStatsFakeUpdate: "Заблокировано фальшивых обновлений:",
        victoryStatsFalseAlarms: "Ложных тревог поднято:",
        victoryStatsLeaks: "Утечек вредоносного ПО:",
        
        // Rank Names
        rankSovereign: "Суверенный защитник",
        rankApprentice: "Подмастерье часового",
        rankKnight: "Рыцарь-страж",
        rankHighGuard: "Инквизитор Высшей Стражи",

        // Tutorial / Guidance
        tutorialTitle: "КАК ИГРАТЬ",
        tutorialSubtitle: "Учебное пособие королевского офицера безопасности",
        tutStep1Title: "\ud83d\udd0d Осмотр",
        tutStep1Desc: 'Используйте <strong>Инструменты безопасности</strong> (Линза Истины, Волшебные Весы, Криптограф), чтобы раскрыть скрытую информацию о каждом караване. Ищите несоответствия между заявленными и реальными значениями.',
        tutStep2Title: "\u2696\ufe0f Анализ",
        tutStep2Desc: 'Сравните <strong>Заявленного отправителя</strong> с <strong>Реальным источником</strong>. Проверьте подлинность печати. Если значения показывают НЕСОВПАДЕНИЕ или путь ВНЕШНИЙ \u2014 скорее всего, это угроза!',
        tutStep3Title: "\u2705 Решение",
        tutStep3Desc: 'Выберите действие: <strong>Пропустите</strong> безопасные караваны для роста Экономики или <strong>Задержите и доложите</strong> об угрозах. Неверные решения стоят Здоровья или Экономики!',
        tutStep4Title: "\ud83d\udcdd Отчёт",
        tutStep4Desc: 'При докладе об угрозе выберите <strong>правильный тип угрозы</strong>, чтобы получить <strong>+10 Мудрости</strong>. Неверная категория всё равно блокирует угрозу, но даёт только +3 Мудрости.',
        tutDecisionsTitle: "СПРАВОЧНИК ПО РЕШЕНИЯМ",
        tutGuideAllowLabel: "ПРОПУСТИТЬ / ОТКРЫТЬ",
        tutGuideAllowText: "Используйте, когда все инструменты показывают ДЕЙСТВИТЕЛЬНЫЙ / СОВПАДЕНИЕ. +5% Экономики.",
        tutGuideVerifyLabel: "ПРОВЕРИТЬ В КАРАНТИНЕ",
        tutGuideVerifyText: "Отправляет в карантинную клетку для глубокого анализа. Безопасный вариант при сомнениях.",
        tutGuideDenyLabel: "ЗАДЕРЖАТЬ / ДОЛОЖИТЬ",
        tutGuideDenyText: "Заблокировать угрозу и отправить отчёт. Правильный тип \u2014 максимум Мудрости (+10).",
        tutGuideBurnLabel: "СЖЕЧЬ / ИГНОРИРОВАТЬ",
        tutGuideBurnText: "Уничтожить без отчёта. Блокирует угрозу, но даёт только +5 Мудрости.",
        tutorialCloseBtn: "ПРИСТУПИТЬ К СЛУЖБЕ",
        progressLabel: "КАРАВАН",
        keyTipsText: "Совет: Ищите НЕСОВПАДЕНИЕ отправителя или ВНЕШНИЕ маршруты \u2014 это угрозы!",
        tooltipAllow: "Используйте, когда все инструменты показывают ДЕЙСТВИТЕЛЬНЫЙ / СОВПАДЕНИЕ",
        tooltipAllowHint: "\u2705 БЕЗОПАСНЫЙ КАРАВАН",
        tooltipVerify: "Отправить в карантин для глубокого анализа",
        tooltipVerifyHint: "\ud83d\udd2c НЕ УВЕРЕНЫ?",
        tooltipArrest: "Заблокировать и доложить \u2014 выберите правильный тип угрозы для +10 Мудрости",
        tooltipArrestHint: "\ud83d\udea8 УГРОЗА ОБНАРУЖЕНА",
        tooltipBurn: "Уничтожить без отчёта \u2014 только +5 Мудрости",
        tooltipBurnHint: "\ud83d\udd25 БЫСТРОЕ УНИЧТОЖЕНИЕ"
    }
};

const SCENARIO_TRANSLATIONS = {
    ru: {
        phish_email: {
            category: "Королевский гонец",
            threatType: "Фишинг (подмена домена)",
            displayName: "Почтовый голубь",
            visualDesc: "Белый голубь, несущий свиток с золотой печатью и отметками о срочности.",
            claimedSender: "Архиепископ Алистер",
            claimedSeal: "Печать Святого Духовенства",
            claimedWeight: "15 КБ (Пергамент)",
            actualSender: "scammer-guild.biz (НЕСОВПАДЕНИЕ)",
            actualRoute: "http://royal.gov/mail (НЕЗАШИФРОВАНО)",
            actualSeal: "Поддельная сургучная печать (ФАЛЬШИВКА)",
            description: "Ваше королевство пострадало от фишинга. Отправитель утверждал, что он «Архиепископ», но тег голубя вел на «scammer-guild.biz». В следующий раз проверяйте реального отправителя с помощью Линзы Истины."
        },
        spear_phish: {
            category: "Королевский гонец",
            threatType: "Целевой фишинг (персональная подделка)",
            displayName: "Срочный королевский курьер",
            visualDesc: "Темно-серый голубь с синей лентой, летящий к Казначейству.",
            claimedSender: "Лорд Верховный казначей",
            claimedSeal: "Королевская печать Хранилища",
            claimedWeight: "22 КБ (Свиток)",
            actualSender: "treasury-support@kingdom-taxes.com (НЕСОВПАДЕНИЕ)",
            actualRoute: "https://kingdom-taxes.com/mail (ВНЕШНИЙ)",
            actualSeal: "Хрустальная копия печати (ФАЛЬШИВКА)",
            description: "Свиток с целевым фишингом обманул стражу. Он требовал перевода королевского золота с поддельного домена поддержки. Всегда проверяйте домен реального отправителя с помощью Линзы Истины."
        },
        mal_attachment: {
            category: "Королевский гонец",
            threatType: "Фишинговое вложение (вредоносная нагрузка)",
            displayName: "Голубь со счетом от торговца",
            visualDesc: "Коричневый голубь, несущий стандартную налоговую книгу.",
            claimedSender: "Королевский налоговый инспектор",
            claimedSeal: "Печать Налогового реестра",
            claimedWeight: "12 КБ (Книга)",
            actualSender: "taxes@royal.gov (СОВПАДЕНИЕ)",
            actualRoute: "https://taxes.royal.gov/portal (ДЕЙСТВИТЕЛЬНЫЙ)",
            actualSeal: "Отсутствует криптографическая подпись (ФАЛЬШИВКА/ОТСУТСТВУЕТ)",
            actualWeight: "480 КБ (Тяжелый груз)",
            description: "Свиток счета содержал вредоносное ПО. Хотя адрес отправителя был подделан правильно, цифровая печать отсутствовала или была повреждена. Всегда проверяйте печать с помощью инструмента Криптограф."
        },
        mitm_messenger: {
            category: "Королевский гонец",
            threatType: "Атака посредника (MITM / открытый текст)",
            displayName: "Незашифрованный оруженосец",
            visualDesc: "Обычный почтовый голубь, летящий от соседнего барона.",
            claimedSender: "Барон Ист-Рича",
            claimedSeal: "Герб Ист-Рича",
            claimedWeight: "5 КБ (Записка)",
            actualSender: "eastreach@baron-mail.net (СОВПАДЕНИЕ)",
            actualRoute: "http://plain-courier-post.net/eastreach (НЕЗАЩИЩЕННЫЙ)",
            actualSeal: "Нет криптографической подписи (НЕЗАЩИЩЕННЫЙ)",
            description: "Свиток был перехвачен. Поскольку он был незашифрован (нет аналога HTTPS/SSL), бандиты прочитали пароли королевства при передаче. Всегда блокируйте незашифрованные (HTTP/без печати) сообщения."
        },
        mal_download: {
            category: "Иностранный торговец",
            threatType: "Небезопасная загрузка (вредоносный сайт)",
            displayName: "Телега с бесплатными товарами",
            visualDesc: "Ярко раскрашенная телега с рекламой «Бесплатные волшебные мечи!»",
            claimedSender: "Форпост Гильдии волшебников",
            claimedSeal: "Печать Гильдии волшебников",
            claimedWeight: "2.4 МБ (Сундук заклинаний)",
            actualSender: "shady-hackers-guild.ru (НЕСОВПАДЕНИЕ)",
            actualRoute: "http://wizard-spells.org/free (НЕЗАШИФРОВАНО)",
            actualSeal: "Просроченный/самоподписанный сертификат (НЕДЕЙСТВИТЕЛЬНЫЙ)",
            description: "Ваше королевство пало жертвой скрытой загрузки вредоносного ПО. Торговый путь использовал HTTP (не HTTPS/SSL), а печать была просрочена. Всегда проверяйте безопасность протокола HTTPS в торговом пути."
        },
        homograph_spoof: {
            category: "Иностранный торговец",
            threatType: "Подмена домена (омографическая атака)",
            displayName: "Телега Государственного банка",
            visualDesc: "Бронированная телега с логотипом Королевского казначейства.",
            claimedSender: "Королевский банк казначейства",
            claimedSeal: "Герб Королевского банка",
            claimedWeight: "1.8 МБ (Транзакции)",
            actualSender: "https://royаlbank.com (Кириллическая подмена)",
            actualRoute: "https://royаlbank.com (ВНЕШНИЙ)",
            actualSeal: "Неверифицированный регистратор (ФАЛЬШИВКА)",
            description: "Поддельный домен проник в замок. Атакующий использовал омографическую атаку, заменив латинскую 'a' в royalbank.com на кириллическую 'а'. Используйте Линзу Истины, чтобы обнаружить подмену символов!"
        },
        driveby_wagon: {
            category: "Иностранный торговец",
            threatType: "Скрытая загрузка (набор эксплойтов)",
            displayName: "Телега бродячего алхимика",
            visualDesc: "Деревянная купеческая телега со стандартными ингредиентами для зелий.",
            claimedSender: "Проверенная гильдия алхимиков",
            claimedSeal: "Проверенная печать алхимика",
            claimedWeight: "200 КБ (Список ингредиентов)",
            actualSender: "alchemists.org (СОВПАДЕНИЕ)",
            actualRoute: "https://alchemists.org/potions/exploit.js (ВРЕДОНОСНЫЙ СКРИПТ)",
            actualSeal: "Проверенная печать алхимика (СОВПАДЕНИЕ)",
            actualWeight: "1.5 МБ (Скрипт-нагрузка)",
            description: "Набор эксплойтов заразил замок при скрытой загрузке. Сайт алхимика был взломан для раздачи скрытого вредоносного скрипта. Отправляйте караван в карантин или используйте Волшебные Весы для проверки подозрительного размера."
        },
        watering_hole: {
            category: "Иностранный торговец",
            threatType: "Атака водопоя (компрометация гильдии)",
            displayName: "Телега с хлебом",
            visualDesc: "Телега пекаря из надежной местной гильдии, везущая ежедневный хлеб.",
            claimedSender: "Королевская гильдия пекарей",
            claimedSeal: "Штамп Гильдии пекарей",
            claimedWeight: "50 КБ (Журнал заказов)",
            actualSender: "trusted-bakery.com (СОВПАДЕНИЕ)",
            actualRoute: "https://trusted-bakery.com/bread/update (ПРОСРОЧЕННЫЙ СЕРТИФИКАТ)",
            actualSeal: "Просроченный сертификат (ПРОСРОЧЕН)",
            actualWeight: "2.1 МБ (Дополнительный пакет)",
            description: "Сайт местной пекарни был взломан для размещения вредоносного ПО (атака типа «водопой»). Вы доверились ему вслепую. Проверка печати с помощью Криптографа обнаруживает просроченную/поддельную подпись."
        },
        ransomware_rider: {
            category: "Срочный указ",
            threatType: "Вымогательство программ-вымогателей",
            displayName: "Панический темный всадник",
            visualDesc: "Всадник в темных доспехах, панически скачущий и кричащий во весь голос.",
            claimedSender: "Дальний сторожевой форпост",
            claimedSeal: "Значок Королевской стражи",
            claimedWeight: "35 КБ (Срочное предупреждение)",
            actualSender: "black-hand-extortionists.biz (НЕСОВПАДЕНИЕ)",
            actualRoute: "http://black-hand.net/extort (ВНЕШНИЙ)",
            actualSeal: "Отсутствует (ОТСУТСТВУЕТ)",
            description: "Программа-вымогатель заблокировала замковое хранилище. Всадник сеял панику и требовал срочно выдать монеты на чрезвычайные расходы. Социальная инженерия полагается на страх. Проверяйте отправителя и печать!"
        },
        authority_impersonation: {
            category: "Срочный указ",
            threatType: "Социальная инженерия (выдача себя за другое лицо)",
            displayName: "Королевский паладин",
            visualDesc: "Всадник в королевской ливрее, размахивающий указом.",
            claimedSender: "Лорд-протектор королевства",
            claimedSeal: "Печать Лорда-протектора",
            claimedWeight: "10 КБ (Приказ)",
            actualSender: "impostor-guild.net (НЕСОВПАДЕНИЕ)",
            actualRoute: "https://impostor-guild.net/order (ВНЕШНИЙ)",
            actualSeal: "Поддельный латунный штамп (ФАЛЬШИВКА)",
            description: "Всадник назвался Защитником Короля и потребовал доступ к базе данных, чтобы заблокировать «демона». Выдача себя за авторитетное лицо — частый трюк. Линза Истины показывает, что отправитель был фальшивым."
        },
        baiting_lottery: {
            category: "Срочный указ",
            threatType: "Социальная инженерия (приманка)",
            displayName: "Глашатай-оруженосец",
            visualDesc: "Яркий всадник, трубящий в рог и раздающий свитки.",
            claimedSender: "Королевский комитет благосостояния",
            claimedSeal: "Королевская марка благосостояния",
            claimedWeight: "40 КБ (Наградной ваучер)",
            actualSender: "scammer-jackpot.com (НЕСОВПАДЕНИЕ)",
            actualRoute: "http://scammer-jackpot.com/claim (НЕЗАЩИЩЕННЫЙ)",
            actualSeal: "Отсутствует печать подписи (ОТСУТСТВУЕТ)",
            description: "Свиток-приманка обещал бесплатный горшок золота. Переход по ссылке загрузил шпионское ПО. Если предложение кажется слишком заманчивым, чтобы быть правдой, блокируйте его! Отправителем был мошенник."
        },
        trojan_exe: {
            category: "Троянский конь",
            threatType: "Троян (файл с двойным расширением)",
            displayName: "Грузовой ящик с налогами",
            visualDesc: "Телега с огромным грузовым ящиком, помеченным как 'Taxes_2026.pdf'.",
            claimedSender: "Королевский налоговый аудитор",
            claimedSeal: "Королевская печать аудита",
            claimedWeight: "1.2 МБ (Аудиторские листы)",
            actualSender: "finance@royal.gov (СОВПАДЕНИЕ)",
            actualRoute: "https://finance.royal.gov/ledger (ДЕЙСТВИТЕЛЬНЫЙ)",
            actualSeal: "Королевская печать аудита (СОВПАДЕНИЕ)",
            actualWeight: "1.2 МБ (Аудиторские листы)",
            trueExtension: "Taxes_2026.pdf.exe (ОБНАРУЖЕН ИСПОЛНЯЕМЫЙ ФАЙЛ)",
            description: "Троян с двойным расширением заразил замок. Ящик назывался Taxes_2026.pdf, но Волшебные Весы показали, что на самом деле это Taxes_2026.pdf.exe. Всегда взвешивайте груз и проверяйте расширения!"
        },
        trojan_vbs: {
            category: "Троянский конь",
            threatType: "Троян (двойное расширение скрипта)",
            displayName: "Ящик со списком гильдии",
            visualDesc: "Телега с ящиком, помеченным как 'GuildMembers.csv'.",
            claimedSender: "Гильдейский мастер ремесел",
            claimedSeal: "Печать Гильдии ремесленников",
            claimedWeight: "45 КБ (Таблица)",
            actualSender: "crafts@royal.gov (СОВПАДЕНИЕ)",
            actualRoute: "https://crafts.royal.gov/files (ДЕЙСТВИТЕЛЬНЫЙ)",
            actualSeal: "Печать Гильдии ремесленников (СОВПАДЕНИЕ)",
            actualWeight: "45 КБ (Таблица)",
            trueExtension: "GuildMembers.csv.vbs (VBS СКРИПТ)",
            description: "Ящик выдавал себя за GuildMembers.csv, но на самом деле это был GuildMembers.csv.vbs. Запуск этого скрипта открыл бэкдоры в замок. Проверяйте расширения на Волшебных Весах!"
        },
        zip_bomb: {
            category: "Троянский конь",
            threatType: "Архивная бомба (Zip Bomb)",
            displayName: "Сжатые архивы",
            visualDesc: "Телега с набором плотно упакованных мини-ящиков вложенных друг в друга.",
            claimedSender: "Картограф королевства",
            claimedSeal: "Печать картографии",
            claimedWeight: "10 КБ (KingdomMap.zip)",
            actualSender: "maps@royal.gov (СОВПАДЕНИЕ)",
            actualRoute: "https://maps.royal.gov/archive (ДЕЙСТВИТЕЛЬНЫЙ)",
            actualSeal: "Печать картографии (СОВПАДЕНИЕ)",
            actualWeight: "500 МБ (Невероятно тяжелый архив!)",
            trueExtension: "KingdomMap.zip (ZIP-БОМБА)",
            description: "Архивная бомба перегрузила реестр ворот. Вы открыли крошечный архив размером 10 КБ, который развернулся в 500 МБ мусорных данных, вызвав сбой системы. Проверяйте реальный вес на Волшебных Весах!"
        },
        mimic_patch: {
            category: "Мимик",
            threatType: "Ложное обновление (вредоносный патч)",
            displayName: "Гильдия королевских архитекторов",
            visualDesc: "Архитектор с чертежами для «Патча воротного щита».",
            claimedSender: "Главный королевский строитель",
            claimedSeal: "Печать Королевской арки",
            claimedWeight: "8.5 МБ (Патч магической стены)",
            actualSender: "hackers-scaffold.biz (НЕСОВПАДЕНИЕ)",
            actualRoute: "http://realm-updater-patch.com/download (ВНЕШНИЙ)",
            actualSeal: "Поддельный меловой знак (ФАЛЬШИВКА)",
            description: "Архитектор-мимик обманом заставил вас скачать фальшивое обновление. Он утверждал, что стене нужен защитный патч, но источником был hackers-scaffold.biz. Блокируйте неофициальные источники обновлений!"
        },
        fake_antivirus: {
            category: "Мимик",
            threatType: "Афера под видом техподдержки (ложная тревога)",
            displayName: "Королевский экзорцист",
            visualDesc: "Священник со склянкой святой воды, кричащий о «призраках!»",
            claimedSender: "Церковь безопасности королевства",
            claimedSeal: "Печать Святого Экзорциста",
            claimedWeight: "3.2 МБ (Очищающий скрипт)",
            actualSender: "fake-priest-scam.net (НЕСОВПАДЕНИЕ)",
            actualRoute: "http://clean-castle-ghosts.xyz/holywater (ВНЕШНИЙ)",
            actualSeal: "Неподписанный пергамент (ОТСУТСТВУЕТ)",
            description: "Мошенник под видом техподдержки проник в замок. «Экзорцист» утверждал, что замок полон призраков (вредоносных программ), и вынудил вас купить поддельную защиту. Линза Истины выявляет фальшивого отправителя."
        },
        safe_cleric: {
            category: "Королевский гонец",
            threatType: "Безопасно",
            displayName: "Священный голубь",
            visualDesc: "Белый голубь с золотой застежкой.",
            claimedSender: "Камергер Алистер",
            claimedSeal: "Проверенная королевская печать",
            claimedWeight: "8 КБ (Указания)",
            actualSender: "Камергер Алистер (chamberlain@royal.gov)",
            actualRoute: "https://chamberlain.royal.gov/directives (БЕЗОПАСНЫЙ)",
            actualSeal: "Проверенная королевская печать (ДЕЙСТВИТЕЛЬНЫЙ)",
            description: "Законный свиток, содержащий налоговые инструкции от Камергера."
        },
        safe_merchant: {
            category: "Иностранный торговец",
            threatType: "Безопасно",
            displayName: "Телега с зерном",
            visualDesc: "Телега, груженная мешками с пшеницей и ячменем.",
            claimedSender: "Северная фермерская гильдия",
            claimedSeal: "Печать фермерского кооператива",
            claimedWeight: "320 КБ (Торговый манифест)",
            actualSender: "Северная фермерская гильдия (farms@royal.gov)",
            actualRoute: "https://farms.royal.gov/supplies (БЕЗОПАСНЫЙ)",
            actualSeal: "Печать фермерского кооператива (ДЕЙСТВИТЕЛЬНЫЙ)",
            description: "Настоящая телега с припасами, доставляющая зерно для пропитания жителей. Жизненно важна для экономики!"
        },
        safe_rider: {
            category: "Срочный указ",
            threatType: "Безопасно",
            displayName: "Всадник-разведчик замка",
            visualDesc: "Разведчик на быстрой лошади, демонстрирующий королевские флаги.",
            claimedSender: "Командир пограничного дозора",
            claimedSeal: "Печать Сторожевой башни",
            claimedWeight: "12 КБ (Отчет разведки)",
            actualSender: "Командир пограничного дозора (borderwatch@royal.gov)",
            actualRoute: "https://borderwatch.royal.gov/reports (БЕЗОПАСНЫЙ)",
            actualSeal: "Печать Сторожевой башни (ДЕЙСТВИТЕЛЬНЫЙ)",
            description: "Срочное предупреждение пограничного патруля о диких кабанах. Никаких злых намерений, только важные новости!"
        },
        safe_crate: {
            category: "Троянский конь",
            threatType: "Безопасно",
            displayName: "Ящик со стальными латами",
            visualDesc: "Прочная телега, везущая тяжелые стальные листы для доспехов.",
            claimedSender: "Гильдия великих кузнецов",
            claimedSeal: "Печать Гильдии кузнецов",
            claimedWeight: "1.4 МБ (Ведомость и чертежи)",
            actualSender: "Гильдия великих кузнецов (blacksmiths@royal.gov)",
            actualRoute: "https://blacksmiths.royal.gov/inventory (БЕЗОПАСНЫЙ)",
            actualSeal: "Печать Гильдии кузнецов (ДЕЙСТВИТЕЛЬНЫЙ)",
            trueExtension: "Ledger.xlsx (ДАННЫЕ EXCEL)",
            description: "Безопасный, тяжелый ящик с чертежами щитов от Гильдии кузнецов."
        },
        safe_architect: {
            category: "Мимик",
            threatType: "Безопасно",
            displayName: "Королевский каменщик",
            visualDesc: "Мастер-каменщик в каменной пыли, несущий чертежи.",
            claimedSender: "Глава королевской каменной кладки",
            claimedSeal: "Печать с гербом каменщиков",
            claimedWeight: "4.5 МБ (Спецификации укреплений)",
            actualSender: "Глава королевской каменной кладки (masonry@royal.gov)",
            actualRoute: "https://masonry.royal.gov/blueprint (БЕЗОПАСНЫЙ)",
            actualSeal: "Печать с гербом каменщиков (ДЕЙСТВИТЕЛЬНЫЙ)",
            description: "Законопослушный королевский каменщик, несущий строительные спецификации для укрепления стен замка."
        }
    }
};

function getLocalizedScenarioField(scenario, field) {
    if (currentLang === 'ru' && SCENARIO_TRANSLATIONS.ru[scenario.id] && SCENARIO_TRANSLATIONS.ru[scenario.id][field]) {
        return SCENARIO_TRANSLATIONS.ru[scenario.id][field];
    }
    return scenario[field];
}

function setLanguage(lang) {
    if (!UI_TRANSLATIONS[lang]) return;
    currentLang = lang;
    localStorage.setItem('vigilant_sov_lang', lang);

    document.title = lang === 'ru' ? "Бдительный Суверен: Царство Киберзащиты" : "The Vigilant Sovereign: Cyber-Defense Realm";

    const t = UI_TRANSLATIONS[lang];

    // 1. Update control deck buttons
    const langBtn = document.getElementById("langToggleBtn");
    if (langBtn) {
        langBtn.textContent = lang.toUpperCase();
    }
    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) {
        themeBtn.textContent = lang === 'ru' ? "НЕОНОВЫЙ МИР" : "NEON REALM";
    }

    // 2. Update top marquee titles
    const marqueeTitle1 = document.getElementById("marqueeTitle1");
    if (marqueeTitle1) marqueeTitle1.textContent = t.title1;
    const marqueeTitle2 = document.getElementById("marqueeTitle2");
    if (marqueeTitle2) marqueeTitle2.textContent = t.title2;
    const marqueeSubtitle = document.getElementById("marqueeSubtitle");
    if (marqueeSubtitle) marqueeSubtitle.textContent = t.subtitle;

    // 3. Update HUD labels
    const hudShieldLabel = document.getElementById("hudShieldLabel");
    if (hudShieldLabel) hudShieldLabel.textContent = t.shieldLabel;
    const wisdomLabel = document.getElementById("wisdomLabel");
    if (wisdomLabel) wisdomLabel.textContent = t.wisdomLabel;
    const economyLabel = document.getElementById("economyLabel");
    if (economyLabel) economyLabel.textContent = t.economyLabel;
    const hudLevelLabel = document.getElementById("hudLevelLabel");
    if (hudLevelLabel) hudLevelLabel.textContent = t.levelLabel;

    // Update level badge (dynamic)
    const levelVal = document.getElementById("levelVal");
    if (levelVal) {
        levelVal.textContent = `${t.levelText} ${currentLevel}`;
    }

    // Update Gate Security indicator if default
    const threatIndicator = document.getElementById("threatIndicator");
    if (threatIndicator) {
        if (threatIndicator.textContent.includes("SECURE") || threatIndicator.textContent.includes("НАДЁЖНО")) {
            threatIndicator.textContent = t.secureStatus;
        } else if (threatIndicator.textContent.includes("CONGESTION") || threatIndicator.textContent.includes("ПЕРЕГРУЗКА")) {
            threatIndicator.textContent = t.congestionStatus;
        }
    }

    // 4. Update Intrusion Alert
    const intrusionAlertTitle = document.getElementById("intrusionAlertTitle");
    if (intrusionAlertTitle) intrusionAlertTitle.textContent = t.intrusionAlertTitle;
    const alertMessage = document.getElementById("alertMessage");
    if (alertMessage && alertMessage.textContent.includes("MALWARE DETECTED")) {
        alertMessage.textContent = t.malwareDetected;
    }

    // 5. Update Intro Screen
    const introTitle = document.getElementById("introTitle");
    if (introTitle) introTitle.textContent = t.introTitle;
    const introText = document.getElementById("introText");
    if (introText) {
        let rawText = t.introText;
        let formatted = rawText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        introText.innerHTML = formatted;
    }
    const startBtn = document.getElementById("startBtn");
    if (startBtn) startBtn.textContent = t.bootProtocols;

    // 6. Update Parchment scroll labels
    const labelSender = document.getElementById("labelSender");
    if (labelSender) labelSender.textContent = t.senderLabel;
    const labelRoute = document.getElementById("labelRoute");
    if (labelRoute) labelRoute.textContent = t.routeLabel;
    const labelSeal = document.getElementById("labelSeal");
    if (labelSeal) labelSeal.textContent = t.sealLabel;
    const labelWeight = document.getElementById("labelWeight");
    if (labelWeight) labelWeight.textContent = t.weightLabel;

    const labelLens = document.getElementById("labelLens");
    if (labelLens) labelLens.textContent = t.realSourceLabel;
    const labelScale = document.getElementById("labelScale");
    if (labelScale) labelScale.textContent = t.realSizeLabel;
    const labelCrypto = document.getElementById("labelCrypto");
    if (labelCrypto) labelCrypto.textContent = t.sigIntegrityLabel;

    // Update unresolved values if default
    const lensValue = document.getElementById("lensValue");
    if (lensValue && (lensValue.textContent === "Unresolved" || lensValue.textContent === "Не определено")) {
        lensValue.textContent = t.unresolved;
    }
    const scaleValue = document.getElementById("scaleValue");
    if (scaleValue && (scaleValue.textContent === "Unresolved" || scaleValue.textContent === "Не определено")) {
        scaleValue.textContent = t.unresolved;
    }
    const cryptoValue = document.getElementById("cryptoValue");
    if (cryptoValue && (cryptoValue.textContent === "Unresolved" || cryptoValue.textContent === "Не определено")) {
        cryptoValue.textContent = t.unresolved;
    }

    // 7. Update Active Tools
    const titleTools = document.getElementById("titleTools");
    if (titleTools) titleTools.textContent = t.toolsTitle;
    const nameLens = document.getElementById("nameLens");
    if (nameLens) nameLens.textContent = t.toolLens;
    const nameScale = document.getElementById("nameScale");
    if (nameScale) nameScale.textContent = t.toolScale;
    const nameCrypto = document.getElementById("nameCrypto");
    if (nameCrypto) nameCrypto.textContent = t.toolCrypto;
    const nameCage = document.getElementById("nameCage");
    if (nameCage) nameCage.textContent = t.toolCage;

    // 8. Update Decisions
    const titleDecision = document.getElementById("titleDecision");
    if (titleDecision) titleDecision.textContent = t.decisionTitle;
    const btnAllow = document.getElementById("btnAllow");
    if (btnAllow) btnAllow.textContent = t.btnAllow;
    const btnVerify = document.getElementById("btnVerify");
    if (btnVerify) btnVerify.textContent = t.btnVerify;
    const btnArrest = document.getElementById("btnArrest");
    if (btnArrest) btnArrest.textContent = t.btnArrest;
    const btnBurn = document.getElementById("btnBurn");
    if (btnBurn) btnBurn.textContent = t.btnBurn;

    // 9. Update Threat Modal Title/Desc
    const threatModalTitle = document.getElementById("threatModalTitle");
    if (threatModalTitle) threatModalTitle.textContent = t.modalTitle;
    const threatModalDesc = document.getElementById("threatModalDesc");
    if (threatModalDesc) threatModalDesc.textContent = t.modalDesc;

    // 10. Update Feedback Screen static text if visible
    const nextBtn = document.getElementById("nextBtn");
    if (nextBtn && nextBtn.textContent) {
        nextBtn.textContent = t.continueDuty;
    }

    // 11. Update Game Over Screen static texts
    const retryBtn = document.getElementById("retryBtn");
    if (retryBtn) retryBtn.textContent = t.rebootRetry;

    // 12. Update Victory Screen static texts
    const victoryTitle = document.getElementById("victoryTitle");
    if (victoryTitle) victoryTitle.textContent = t.victoryTitle;
    const victoryText = document.getElementById("victoryText");
    if (victoryText) victoryText.textContent = t.victoryText;
    const restartBtn = document.getElementById("restartBtn");
    if (restartBtn) restartBtn.textContent = t.restartBtn;

    // 13. Update Control deck static labels
    const labelSound = document.getElementById("labelSound");
    if (labelSound) labelSound.textContent = t.soundLabel;
    const labelTheme = document.getElementById("labelTheme");
    if (labelTheme) labelTheme.textContent = t.themeLabel;
    const labelLang = document.getElementById("labelLang");
    if (labelLang) labelLang.textContent = t.langLabel;
    const labelGuards = document.getElementById("labelGuards");
    if (labelGuards) labelGuards.textContent = t.guardsLabel;

    // 14. Update active caravan display texts in real-time
    if (currentLevelData && currentLevelData[queueIndex]) {
        const scenario = currentLevelData[queueIndex];
        const caravanTitle = document.getElementById("caravanTitle");
        if (caravanTitle) {
            if (caravanTitle.textContent.startsWith("Caravan Profile #") || caravanTitle.textContent.startsWith("Профиль каравана #")) {
                caravanTitle.textContent = lang === 'ru' ? `Профиль каравана #${queueIndex + 1}` : `Caravan Profile #${queueIndex + 1}`;
            } else if (caravanTitle.textContent.includes("Quarantine Cage Sandbox Active") || caravanTitle.textContent.includes("Карантинная клетка")) {
                caravanTitle.textContent = t.sandboxActive;
            } else if (caravanTitle.textContent.includes("MALWARE WARNING") || caravanTitle.textContent.includes("ОБНАРУЖЕНО ВРЕДОНОСНОЕ")) {
                caravanTitle.textContent = t.sandboxMalware;
            } else if (caravanTitle.textContent.includes("BEHAVIOR CLEAN") || caravanTitle.textContent.includes("УГРОЗ НЕ ОБНАРУЖЕНО")) {
                caravanTitle.textContent = t.sandboxClean;
            } else if (caravanTitle.textContent.includes("Inspected Caravan Profile") || caravanTitle.textContent.includes("Проверенный профиль")) {
                caravanTitle.textContent = t.inspectedProfile;
            }
        }

        const caravanType = document.getElementById("caravanType");
        if (caravanType) {
            caravanType.textContent = getLocalizedScenarioField(scenario, "category");
        }
        const profileSender = document.getElementById("profileSender");
        if (profileSender) {
            profileSender.textContent = getLocalizedScenarioField(scenario, "claimedSender");
        }
        const profileRoute = document.getElementById("profileRoute");
        if (profileRoute) {
            profileRoute.textContent = getLocalizedScenarioField(scenario, "claimedRoute");
        }
        const profileSeal = document.getElementById("profileSeal");
        if (profileSeal) {
            profileSeal.textContent = getLocalizedScenarioField(scenario, "claimedSeal");
        }
        const profileWeight = document.getElementById("profileWeight");
        if (profileWeight) {
            profileWeight.textContent = getLocalizedScenarioField(scenario, "claimedWeight");
        }

        // Lens, Scale, Cryptographer dynamic readouts
        const lensValue = document.getElementById("lensValue");
        if (lensValue && lensValue.textContent !== t.unresolved) {
            lensValue.textContent = getLocalizedScenarioField(scenario, "actualSender");
        }
        const scaleValue = document.getElementById("scaleValue");
        if (scaleValue && scaleValue.textContent !== t.unresolved) {
            if (isSandboxed) {
                let actualWeightVal = getLocalizedScenarioField(scenario, "actualWeight");
                scaleValue.textContent = (lang === 'ru' ? 'РЕАЛЬНЫЙ РАЗМЕР: ' : 'TRUE SIZE: ') + actualWeightVal;
            } else {
                let actualWeightVal = getLocalizedScenarioField(scenario, "actualWeight");
                let trueExt = getLocalizedScenarioField(scenario, "trueExtension");
                let scaleStr = lang === 'ru' ? `Реальный вес: ${actualWeightVal}` : `True Weight: ${actualWeightVal}`;
                if (trueExt) {
                    scaleStr += lang === 'ru' ? ` | Расш: ${trueExt}` : ` | Ext: ${trueExt}`;
                }
                scaleValue.textContent = scaleStr;
            }
        }
        const cryptoValue = document.getElementById("cryptoValue");
        if (cryptoValue && cryptoValue.textContent !== t.unresolved) {
            cryptoValue.textContent = getLocalizedScenarioField(scenario, "actualSeal");
        }
    }

    // 15. Update Phaser sign texts if scene is initialized
    if (currentScene) {
        if (currentScene.textSign) {
            currentScene.textSign.setText(t.firewallGateSign);
        }
        if (currentScene.fireText) {
            currentScene.fireText.setText(t.incineratorSign);
        }
    }

    // 16. Update Tutorial modal texts
    const tutorialTitle = document.getElementById("tutorialTitle");
    if (tutorialTitle) tutorialTitle.textContent = t.tutorialTitle;
    const tutorialSubtitle = document.getElementById("tutorialSubtitle");
    if (tutorialSubtitle) tutorialSubtitle.textContent = t.tutorialSubtitle;
    const tutStep1Title = document.getElementById("tutStep1Title");
    if (tutStep1Title) tutStep1Title.innerHTML = t.tutStep1Title;
    const tutStep1Desc = document.getElementById("tutStep1Desc");
    if (tutStep1Desc) tutStep1Desc.innerHTML = t.tutStep1Desc;
    const tutStep2Title = document.getElementById("tutStep2Title");
    if (tutStep2Title) tutStep2Title.innerHTML = t.tutStep2Title;
    const tutStep2Desc = document.getElementById("tutStep2Desc");
    if (tutStep2Desc) tutStep2Desc.innerHTML = t.tutStep2Desc;
    const tutStep3Title = document.getElementById("tutStep3Title");
    if (tutStep3Title) tutStep3Title.innerHTML = t.tutStep3Title;
    const tutStep3Desc = document.getElementById("tutStep3Desc");
    if (tutStep3Desc) tutStep3Desc.innerHTML = t.tutStep3Desc;
    const tutStep4Title = document.getElementById("tutStep4Title");
    if (tutStep4Title) tutStep4Title.innerHTML = t.tutStep4Title;
    const tutStep4Desc = document.getElementById("tutStep4Desc");
    if (tutStep4Desc) tutStep4Desc.innerHTML = t.tutStep4Desc;
    const tutDecisionsTitle = document.getElementById("tutDecisionsTitle");
    if (tutDecisionsTitle) tutDecisionsTitle.textContent = t.tutDecisionsTitle;
    const tutGuideAllowLabel = document.getElementById("tutGuideAllowLabel");
    if (tutGuideAllowLabel) tutGuideAllowLabel.textContent = t.tutGuideAllowLabel;
    const tutGuideAllowText = document.getElementById("tutGuideAllowText");
    if (tutGuideAllowText) tutGuideAllowText.textContent = t.tutGuideAllowText;
    const tutGuideVerifyLabel = document.getElementById("tutGuideVerifyLabel");
    if (tutGuideVerifyLabel) tutGuideVerifyLabel.textContent = t.tutGuideVerifyLabel;
    const tutGuideVerifyText = document.getElementById("tutGuideVerifyText");
    if (tutGuideVerifyText) tutGuideVerifyText.textContent = t.tutGuideVerifyText;
    const tutGuideDenyLabel = document.getElementById("tutGuideDenyLabel");
    if (tutGuideDenyLabel) tutGuideDenyLabel.textContent = t.tutGuideDenyLabel;
    const tutGuideDenyText = document.getElementById("tutGuideDenyText");
    if (tutGuideDenyText) tutGuideDenyText.textContent = t.tutGuideDenyText;
    const tutGuideBurnLabel = document.getElementById("tutGuideBurnLabel");
    if (tutGuideBurnLabel) tutGuideBurnLabel.textContent = t.tutGuideBurnLabel;
    const tutGuideBurnText = document.getElementById("tutGuideBurnText");
    if (tutGuideBurnText) tutGuideBurnText.textContent = t.tutGuideBurnText;
    const tutorialCloseBtn = document.getElementById("tutorialCloseBtn");
    if (tutorialCloseBtn) tutorialCloseBtn.textContent = t.tutorialCloseBtn;

    // 17. Update Progress badge label
    const progressLabel = document.getElementById("progressLabel");
    if (progressLabel) progressLabel.textContent = t.progressLabel;

    // 18. Update Tooltips
    const tooltipAllow = document.getElementById("tooltipAllow");
    if (tooltipAllow) tooltipAllow.innerHTML = `<span class="tip-hint">${t.tooltipAllowHint}</span>${t.tooltipAllow}`;
    const tooltipVerify = document.getElementById("tooltipVerify");
    if (tooltipVerify) tooltipVerify.innerHTML = `<span class="tip-hint">${t.tooltipVerifyHint}</span>${t.tooltipVerify}`;
    const tooltipArrest = document.getElementById("tooltipArrest");
    if (tooltipArrest) tooltipArrest.innerHTML = `<span class="tip-hint">${t.tooltipArrestHint}</span>${t.tooltipArrest}`;
    const tooltipBurn = document.getElementById("tooltipBurn");
    if (tooltipBurn) tooltipBurn.innerHTML = `<span class="tip-hint">${t.tooltipBurnHint}</span>${t.tooltipBurn}`;

    // 19. Update Key Tips text
    const keyTipsText = document.getElementById("keyTipsText");
    if (keyTipsText) keyTipsText.textContent = t.keyTipsText;
}

// ==========================================
// 2. CARAVAN DATA PACKETS (21 SCENARIOS)
// ==========================================
const CARAVAN_SCENARIOS = [
    // --- EMAIL ATTACHMENTS (Pigeons) ---
    {
        id: "phish_email",
        type: "pigeon",
        category: "Royal Messenger",
        threatType: "Phishing Attack (Spoofed Domain)",
        isMalware: true,
        displayName: "Messenger Pigeon",
        visualDesc: "A white pigeon carrying a gold-sealed scroll with urgency tags.",
        claimedSender: "The Arch-Bishop Alistair",
        claimedRoute: "royal.gov/mail",
        claimedSeal: "Seal of the Holy Clergy",
        claimedWeight: "15 KB (Parchment)",
        // Inspected
        actualSender: "scammer-guild.biz (MISMATCH)",
        actualRoute: "http://royal.gov/mail (UNENCRYPTED)",
        actualSeal: "Forged Wax Seal (FAKE)",
        actualWeight: "15 KB (Parchment)",
        description: "Your kingdom fell to credential harvesting. The sender claimed to be 'The Arch-Bishop' but the pigeon tag was actually 'scammer-guild.biz'. Next time, check the true sender with the Truth Lens."
    },
    {
        id: "spear_phish",
        type: "pigeon",
        category: "Royal Messenger",
        threatType: "Spear Phishing (Targeted Forgery)",
        isMalware: true,
        displayName: "Urgent Royal Courier",
        visualDesc: "A dark gray pigeon with a blue ribbon, targeting the Treasury.",
        claimedSender: "Lord High Treasurer",
        claimedRoute: "treasury@royal.gov",
        claimedSeal: "Royal Vault Signet",
        claimedWeight: "22 KB (Scroll)",
        // Inspected
        actualSender: "treasury-support@kingdom-taxes.com (MISMATCH)",
        actualRoute: "https://kingdom-taxes.com/mail (EXTERNAL)",
        actualSeal: "Crystalline Replica Seal (FAKE)",
        actualWeight: "22 KB (Scroll)",
        description: "A spear phishing scroll fooled the guards. It asked for a royal gold transfer from a forged support domain. Always check the actual sender address domain using the Truth Lens."
    },
    {
        id: "mal_attachment",
        type: "pigeon",
        category: "Royal Messenger",
        threatType: "Phishing Attachment (Malicious payload)",
        isMalware: true,
        displayName: "Merchant Invoice Pigeon",
        visualDesc: "A brown pigeon carrying a standard tax ledger.",
        claimedSender: "Royal Tax Collector",
        claimedRoute: "taxes@royal.gov",
        claimedSeal: "Tax Registry Seal",
        claimedWeight: "12 KB (Ledger)",
        // Inspected
        actualSender: "taxes@royal.gov (MATCH)",
        actualRoute: "https://taxes.royal.gov/portal (VALID)",
        actualSeal: "Missing Seal Signature (FORGED/MISSING)",
        actualWeight: "480 KB (Heavy Payload)",
        description: "An invoice scroll carried malware. Although the sender address was spoofed correctly, the signature seal was missing/invalid. Always verify the seal using the Cryptographer tool."
    },
    {
        id: "mitm_messenger",
        type: "pigeon",
        category: "Royal Messenger",
        threatType: "Man-in-the-Middle (MITM / Plaintext)",
        isMalware: true,
        displayName: "Unencrypted Squire",
        visualDesc: "A standard courier pigeon flying from a neighboring baron.",
        claimedSender: "Baron of East-Reach",
        claimedRoute: "eastreach@baron-mail.net",
        claimedSeal: "East-Reach Crest",
        claimedWeight: "5 KB (Note)",
        // Inspected
        actualSender: "eastreach@baron-mail.net (MATCH)",
        actualRoute: "http://plain-courier-post.net/eastreach (UNSECURED)",
        actualSeal: "No Cryptographic Signature (UNSECURED)",
        actualWeight: "5 KB (Note)",
        description: "The scroll was intercepted. Because it was unencrypted (no HTTPS/SSL equivalent), bandits read the realm passwords in transit. Always block unencrypted (HTTP/No Seal) messages."
    },

    // --- WEB DOWNLOADS (Wagons) ---
    {
        id: "mal_download",
        type: "wagon",
        category: "Foreign Merchant",
        threatType: "Insecure Download (Malware Web)",
        isMalware: true,
        displayName: "Free Goods Wagon",
        visualDesc: "A brightly painted wagon advertising 'Free Magic Swords!'",
        claimedSender: "Wizard Guild Outpost",
        claimedRoute: "wizard-spells.org/free",
        claimedSeal: "Seal of Wizards Guild",
        claimedWeight: "2.4 MB (Spell Chest)",
        // Inspected
        actualSender: "shady-hackers-guild.ru (MISMATCH)",
        actualRoute: "http://wizard-spells.org/free (UNENCRYPTED)",
        actualSeal: "Expired/Self-Signed Mark (INVALID)",
        actualWeight: "2.4 MB (Spell Chest)",
        description: "Your kingdom fell to a drive-by malware download. The trade route was HTTP (not HTTPS/SSL) and the seal was expired. Always verify the Trade Route has secure HTTPS protocol."
    },
    {
        id: "homograph_spoof",
        type: "wagon",
        category: "Foreign Merchant",
        threatType: "Domain Spoofing (Homograph Attack)",
        isMalware: true,
        displayName: "Sovereign Bank Cart",
        visualDesc: "An ironclad wagon displaying the Royal Treasury logo.",
        claimedSender: "Royal Treasury Bank",
        claimedRoute: "https://royalbank.com",
        claimedSeal: "Royal Bank Crest",
        claimedWeight: "1.8 MB (Transactions)",
        // Inspected
        actualSender: "https://royаlbank.com (Cyrillic Spoof)",
        actualRoute: "https://royаlbank.com (EXTERNAL)",
        actualSeal: "Unverified Registrar (FAKE)",
        actualWeight: "1.8 MB (Transactions)",
        description: "A spoofed domain breached your castle. The attacker used a homograph attack, replacing the latin 'a' in royalbank.com with a cyrillic 'а'. Use the Truth Lens to catch character spoofs!"
    },
    {
        id: "driveby_wagon",
        type: "wagon",
        category: "Foreign Merchant",
        threatType: "Drive-by Download (Exploit Kit)",
        isMalware: true,
        displayName: "Traveling Alchemist Wagon",
        visualDesc: "A wooden merchant wagon carrying standard potion ingredients.",
        claimedSender: "Trusted Alchemist Guild",
        claimedRoute: "https://alchemists.org/potions",
        claimedSeal: "Verified Alchemist Seal",
        claimedWeight: "200 KB (Ingredients list)",
        // Inspected
        actualSender: "alchemists.org (MATCH)",
        actualRoute: "https://alchemists.org/potions/exploit.js (MALICIOUS SCRIPT)",
        actualSeal: "Verified Alchemist Seal (MATCH)",
        actualWeight: "1.5 MB (Script payload)",
        description: "A drive-by exploit kit infected the castle. The alchemist was compromised, serving a hidden exploit script. Quarantine the caravan or use Magic Scale to inspect suspicious sizes."
    },
    {
        id: "watering_hole",
        type: "wagon",
        category: "Foreign Merchant",
        threatType: "Watering Hole Attack (Compromised Guild)",
        isMalware: false, // Wait, watering hole is malware, let's set it to true
        isMalware: true,
        displayName: "Bread Supply Wagon",
        visualDesc: "A baker's cart from the trusted local guild, delivering daily bread.",
        claimedSender: "Royal Baker Guild",
        claimedRoute: "https://trusted-bakery.com/bread",
        claimedSeal: "Baker Guild Stamp",
        claimedWeight: "50 KB (Orders ledger)",
        // Inspected
        actualSender: "trusted-bakery.com (MATCH)",
        actualRoute: "https://trusted-bakery.com/bread/update (EXPIRED CERT)",
        actualSeal: "Expired Certificate Seal (EXPIRED)",
        actualWeight: "2.1 MB (Extra Package)",
        description: "The local bakery's site was hacked to host malware (Watering Hole). You trusted it blindly. Inspecting the seal with the Cryptographer reveals the expired/forged signature."
    },

    // --- URGENT DECREES (Riders) ---
    {
        id: "ransomware_rider",
        type: "rider",
        category: "Urgent Decree",
        threatType: "Ransomware Extortion",
        isMalware: true,
        displayName: "Frantic Dark Rider",
        visualDesc: "A rider clad in dark armor, galloping frantically and shouting.",
        claimedSender: "High Sentry Outpost",
        claimedRoute: "sentry-dispatch.gov",
        claimedSeal: "Royal Guard Badge",
        claimedWeight: "35 KB (Urgent warning)",
        // Inspected
        actualSender: "black-hand-extortionists.biz (MISMATCH)",
        actualRoute: "http://black-hand.net/extort (EXTERNAL)",
        actualSeal: "None (MISSING)",
        actualWeight: "35 KB (Urgent warning)",
        description: "Ransomware locked the castle vault. The rider screamed of panic and requested emergency coins immediately. Social engineering counts on fear. Check the sender and seal!"
    },
    {
        id: "authority_impersonation",
        type: "rider",
        category: "Urgent Decree",
        threatType: "Social Engineering (Impersonation)",
        isMalware: true,
        displayName: "Sovereign Paladin",
        visualDesc: "A rider wearing royal livery, waving a decree.",
        claimedSender: "Lord Protector of Realm",
        claimedRoute: "lord-protector@royal.gov",
        claimedSeal: "Lord Protector Signet",
        claimedWeight: "10 KB (Order)",
        // Inspected
        actualSender: "impostor-guild.net (MISMATCH)",
        actualRoute: "https://impostor-guild.net/order (EXTERNAL)",
        actualSeal: "Forged Brass Stamp (FAKE)",
        actualWeight: "10 KB (Order)",
        description: "The rider claimed to be the King's Protector, demanding database access to block a 'demon'. Authority impersonation is common. Truth Lens shows the sender was fake."
    },
    {
        id: "baiting_lottery",
        type: "rider",
        category: "Urgent Decree",
        threatType: "Social Engineering (Baiting)",
        isMalware: true,
        displayName: "Heralding Squire",
        visualDesc: "A colorful rider playing a horn and distributing scrolls.",
        claimedSender: "Royal Welfare Board",
        claimedRoute: "lottery@royal.gov",
        claimedSeal: "Royal Welfare Stamp",
        claimedWeight: "40 KB (Reward Voucher)",
        // Inspected
        actualSender: "scammer-jackpot.com (MISMATCH)",
        actualRoute: "http://scammer-jackpot.com/claim (UNSECURED)",
        actualSeal: "No signature seal (MISSING)",
        actualWeight: "40 KB (Reward Voucher)",
        description: "The baiting scroll promised a free pot of gold. Clicking the link/allowing it downloaded spyware. If it sounds too good to be true, block it! Sender was a scammer."
    },

    // --- TROJAN HORSES (Trojan Crate) ---
    {
        id: "trojan_exe",
        type: "trojan",
        category: "Trojan Horse",
        threatType: "Trojan (Double Extension File)",
        isMalware: true,
        displayName: "Taxes Cargo Crate",
        visualDesc: "A cart with a massive cargo box labeled 'Taxes_2026.pdf'.",
        claimedSender: "Royal Tax Auditor",
        claimedRoute: "finance@royal.gov",
        claimedSeal: "Royal Seal of Auditing",
        claimedWeight: "1.2 MB (Audit Sheets)",
        // Inspected
        actualSender: "finance@royal.gov (MATCH)",
        actualRoute: "https://finance.royal.gov/ledger (VALID)",
        actualSeal: "Royal Seal of Auditing (MATCH)",
        actualWeight: "1.2 MB (Audit Sheets)",
        trueExtension: "Taxes_2026.pdf.exe (EXECUTABLE DETECTED)",
        description: "A double-extension Trojan infected the castle. The crate was named Taxes_2026.pdf, but the Magic Scale revealed it was actually Taxes_2026.pdf.exe. Always weigh and check extensions!"
    },
    {
        id: "trojan_vbs",
        type: "trojan",
        category: "Trojan Horse",
        threatType: "Trojan (Script Double Extension)",
        isMalware: true,
        displayName: "Guild Roster Crate",
        visualDesc: "A cart with a crate labeled 'GuildMembers.csv'.",
        claimedSender: "Guildmaster of Crafting",
        claimedRoute: "crafts@royal.gov",
        claimedSeal: "Crafting Guild Seal",
        claimedWeight: "45 KB (Spreadsheet)",
        // Inspected
        actualSender: "crafts@royal.gov (MATCH)",
        actualRoute: "https://crafts.royal.gov/files (VALID)",
        actualSeal: "Crafting Guild Seal (MATCH)",
        actualWeight: "45 KB (Spreadsheet)",
        trueExtension: "GuildMembers.csv.vbs (VBS SCRIPT)",
        description: "The crate claimed to be GuildMembers.csv, but it was actually GuildMembers.csv.vbs. Running it executed a script that opened the castle backdoors. Check extensions with the Magic Scale!"
    },
    {
        id: "zip_bomb",
        type: "trojan",
        category: "Trojan Horse",
        threatType: "Zip Bomb Attack",
        isMalware: true,
        displayName: "Compressed Archives",
        visualDesc: "A cart containing a nested set of tightly packed mini crates.",
        claimedSender: "Realm Cartographer",
        claimedRoute: "maps@royal.gov",
        claimedSeal: "Cartography Seal",
        claimedWeight: "10 KB (KingdomMap.zip)",
        // Inspected
        actualSender: "maps@royal.gov (MATCH)",
        actualRoute: "https://maps.royal.gov/archive (VALID)",
        actualSeal: "Cartography Seal (MATCH)",
        actualWeight: "500 MB (Extremely Heavy Archive!)",
        trueExtension: "KingdomMap.zip (ZIP BOMB)",
        description: "A Zip Bomb crashed the gate registry. You opened a tiny 10 KB archive that expanded into 500 MB of garbage data, overloading the system. Inspect weights on the Magic Scale!"
    },

    // --- MIMICS (Architects) ---
    {
        id: "mimic_patch",
        type: "mimic",
        category: "The Mimic",
        threatType: "Fake Browser Update (Malicious Patch)",
        isMalware: true,
        displayName: "Royal Architect Guild",
        visualDesc: "An architect holding blueprints for a 'Gate Shield Patch'.",
        claimedSender: "Chief Royal Builder",
        claimedRoute: "builders.royal.gov/patch",
        claimedSeal: "Seal of the Royal Arch",
        claimedWeight: "8.5 MB (Magic Wall Patch)",
        // Inspected
        actualSender: "hackers-scaffold.biz (MISMATCH)",
        actualRoute: "http://realm-updater-patch.com/download (EXTERNAL)",
        actualSeal: "Forged Chalk Mark (FAKE)",
        actualWeight: "8.5 MB (Magic Wall Patch)",
        description: "A mimic architect tricked you into downloading a fake update. He claimed the wall needed a magic shield patch, but the source was hackers-scaffold.biz. Block unofficial update sources!"
    },
    {
        id: "fake_antivirus",
        type: "mimic",
        category: "The Mimic",
        threatType: "Tech Support Scam (Fake Security Alert)",
        isMalware: true,
        displayName: "Royal Exorcist",
        visualDesc: "A priest holding a vial of holy water and screaming of 'Ghosts!'",
        claimedSender: "Church of Realm Security",
        claimedRoute: "church-security.gov/exorcise",
        claimedSeal: "Holy Exorcist Seal",
        claimedWeight: "3.2 MB (Holy Cleansing Script)",
        // Inspected
        actualSender: "fake-priest-scam.net (MISMATCH)",
        actualRoute: "http://clean-castle-ghosts.xyz/holywater (EXTERNAL)",
        actualSeal: "Unsigned Parchment (MISSING)",
        actualWeight: "3.2 MB (Holy Cleansing Script)",
        description: "A tech support scammer infected the castle. The 'exorcist' claimed the castle was full of ghosts (malware) and forced you to buy fake protection. Truth Lens reveals the fake sender."
    },

    // --- LEGITIMATE MERCHANTS (Safe Goods) ---
    {
        id: "safe_cleric",
        type: "pigeon",
        category: "Royal Messenger",
        threatType: "Safe",
        isMalware: false,
        displayName: "Holy Messenger Pigeon",
        visualDesc: "A white dove wearing a gold clasp.",
        claimedSender: "Chamberlain Alistair",
        claimedRoute: "https://chamberlain.royal.gov/directives",
        claimedSeal: "Verified Royal Seal",
        claimedWeight: "8 KB (Directives)",
        // Inspected
        actualSender: "Chamberlain Alistair (chamberlain@royal.gov)",
        actualRoute: "https://chamberlain.royal.gov/directives (SECURE)",
        actualSeal: "Verified Royal Seal (VALID)",
        actualWeight: "8 KB (Directives)",
        description: "A legitimate scroll containing tax instructions from the Chamberlain."
    },
    {
        id: "safe_merchant",
        type: "wagon",
        category: "Foreign Merchant",
        threatType: "Safe",
        isMalware: false,
        displayName: "Grain Supply Wagon",
        visualDesc: "A wagon loaded with sacks of wheat and barley.",
        claimedSender: "Northern Farming Guild",
        claimedRoute: "https://farms.royal.gov/supplies",
        claimedSeal: "Farming Cooperative Seal",
        claimedWeight: "320 KB (Trade Manifesto)",
        // Inspected
        actualSender: "Northern Farming Guild (farms@royal.gov)",
        actualRoute: "https://farms.royal.gov/supplies (SECURE)",
        actualSeal: "Farming Cooperative Seal (VALID)",
        actualWeight: "320 KB (Trade Manifesto)",
        description: "A valid supply wagon delivering grain to feed the peasants. Essential for the economy!"
    },
    {
        id: "safe_rider",
        type: "rider",
        category: "Urgent Decree",
        threatType: "Safe",
        isMalware: false,
        displayName: "Castle Scout Rider",
        visualDesc: "A scout riding a swift horse, displaying royal banner colors.",
        claimedSender: "Border Watch Commander",
        claimedRoute: "borderwatch@royal.gov",
        claimedSeal: "Watchtower Signet",
        claimedWeight: "12 KB (Scout Report)",
        // Inspected
        actualSender: "Border Watch Commander (borderwatch@royal.gov)",
        actualRoute: "https://borderwatch.royal.gov/reports (SECURE)",
        actualSeal: "Watchtower Signet (VALID)",
        actualWeight: "12 KB (Scout Report)",
        description: "An urgent border patrol warning about wild boars. No malicious intent, just vital updates!"
    },
    {
        id: "safe_crate",
        type: "trojan",
        category: "Trojan Horse",
        threatType: "Safe",
        isMalware: false,
        displayName: "Armor Cargo Crate",
        visualDesc: "A sturdy wagon carrying heavy iron plates.",
        claimedSender: "Grand Blacksmith Guild",
        claimedRoute: "blacksmiths@royal.gov",
        claimedSeal: "Blacksmith Guild Seal",
        claimedWeight: "1.4 MB (Ledger & Blueprints)",
        // Inspected
        actualSender: "Grand Blacksmith Guild (blacksmiths@royal.gov)",
        actualRoute: "https://blacksmiths.royal.gov/inventory (SECURE)",
        actualSeal: "Blacksmith Guild Seal (VALID)",
        actualWeight: "1.4 MB (Ledger & Blueprints)",
        trueExtension: "Ledger.xlsx (EXCEL DATA)",
        description: "A safe, heavy crate of shield blueprints from the Blacksmith Guild."
    },
    {
        id: "safe_architect",
        type: "mimic",
        category: "The Mimic",
        threatType: "Safe",
        isMalware: false,
        displayName: "Royal Mason Architect",
        visualDesc: "A master mason wearing stone dust, carrying blueprints.",
        claimedSender: "Royal Masonry Lead",
        claimedRoute: "masonry.royal.gov/blueprint",
        claimedSeal: "Mason Crest Seal",
        claimedWeight: "4.5 MB (Wall Reinforcement Specs)",
        // Inspected
        actualSender: "Royal Masonry Lead (masonry@royal.gov)",
        actualRoute: "https://masonry.royal.gov/blueprint (SECURE)",
        actualSeal: "Mason Crest Seal (VALID)",
        actualWeight: "4.5 MB (Wall Reinforcement Specs)",
        description: "A legitimate Royal Mason carrying building specs to patch the castle walls."
    }
];

// List of all threat categories for report modal multiple choice selection
const REPORT_THREAT_OPTIONS = [
    { text: "Phishing / Domain Spoofing", id: "phish" },
    { text: "Double Extension Trojan File", id: "trojan" },
    { text: "Zip Bomb Payload (Size Mismatch)", id: "zip_bomb" },
    { text: "Social Engineering / Urgent Baiting", id: "social" },
    { text: "Unencrypted Protocol (MITM Vulnerability)", id: "mitm" },
    { text: "Fake Update / Unverified Source Patch", id: "fake_update" }
];

// Map a scenario ID/Threat category to the correct ID above
function mapScenarioToThreatType(scenario) {
    if (!scenario.isMalware) return "safe";
    const tt = scenario.threatType.toLowerCase();
    if (tt.includes("phish") || tt.includes("spoof")) return "phish";
    if (tt.includes("double extension") || tt.includes("trojan")) return "trojan";
    if (tt.includes("zip bomb")) return "zip_bomb";
    if (tt.includes("ransomware") || tt.includes("impersonation") || tt.includes("baiting")) return "social";
    if (tt.includes("man-in-the-middle") || tt.includes("unencrypted")) return "mitm";
    if (tt.includes("fake update") || tt.includes("browser update") || tt.includes("tech support")) return "fake_update";
    return "unknown";
}

// ==========================================
// 3. PHASER ENGINE SCENE & TEXTURES
// ==========================================
let gameInstance = null;
let currentScene = null;

// Pixel drawing helpers
function createPixelTexture(scene, key, pixelData, palette, scale = 2) {
    const rows = pixelData.length;
    const cols = pixelData[0].length;
    const width = cols * scale;
    const height = rows * scale;
    const canvas = scene.textures.createCanvas(key, width, height);
    const ctx = canvas.context;
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const char = pixelData[r][c];
            const color = palette[char];
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(c * scale, r * scale, scale, scale);
            }
        }
    }
    canvas.refresh();
}

function preload() {
    currentScene = this;
    
    // Procedural Sprites
    // 1. Pigeon
    const PIGEON_PALETTE = { '.': null, 'W': '#ffffff', 'G': '#708090', 'O': '#ffa500', 'E': '#ff0000' };
    const PIGEON_F1 = [
        "....WWWW....",
        "...WWWWWW...",
        "..WWEWWWW...",
        "..WWOWWWW...",
        "...WWWWWW...",
        "WWWWWWWWWWWW",
        ".WWWWWWWWWW.",
        "..WWWWWWWW..",
        "...WWWWWW...",
        "....O..O...."
    ];
    const PIGEON_F2 = [
        "....WWWW....",
        "...WWWWWW...",
        "..WWEWWWW...",
        "..WWOWWWW...",
        ".WWWWWWWWWW.",
        "WW.WWWWWW.WW",
        "W..WWWWWW..W",
        "...WWWWWW...",
        "....WWWW....",
        "....O..O...."
    ];
    createPixelTexture(this, 'pigeon1', PIGEON_F1, PIGEON_PALETTE, 2);
    createPixelTexture(this, 'pigeon2', PIGEON_F2, PIGEON_PALETTE, 2);

    // 2. Wagon
    const WAGON_PALETTE = { '.': null, 'W': '#d2b48c', 'D': '#8b5a2b', 'C': '#f5f5dc', 'I': '#4d4d4d', 'H': '#a0522d' };
    const WAGON = [
        "......CCCCCCCCCC........",
        "....CCCCCCCCCCCCCC......",
        "...CCCCCCCCCCCCCCCC.....",
        "...DDDDDDDDDDDDDDDD.....",
        "..DDWWWWWWWWWWWWDDDD....",
        "..DDDDDDDDDDDDDDDDDD..HH",
        "...I..I......I..I...HHHH",
        "..IIIIII....IIIIII..H..H",
        "...I..I......I..I...H..H"
    ];
    createPixelTexture(this, 'wagon', WAGON, WAGON_PALETTE, 2);

    // 3. Rider
    const RIDER_PALETTE = { '.': null, 'H': '#8b5a2b', 'D': '#5c4033', 'S': '#c0c0c0', 'R': '#ff0000', 'P': '#fcd2b2', 'K': '#000000' };
    const RIDER = [
        "......RRRR......",
        ".....RSSSP......",
        "....RRSSSSS.....",
        ".....RSSSSD.....",
        "....DHHHHHHD....",
        "...DDDDDDDDDD...",
        "...HHHHHHHHHH...",
        "...H..H..H..H...",
        "...D..D..D..D..."
    ];
    createPixelTexture(this, 'rider', RIDER, RIDER_PALETTE, 2);

    // 4. Trojan Crate
    const TROJAN_PALETTE = { '.': null, 'B': '#8b5a2b', 'D': '#5c4033', 'I': '#4a4a4a', 'T': '#000000', 'C': '#cccccc', 'H': '#a0522d' };
    const TROJAN = [
        "....DDDDDDDDDDDDDD......",
        "...DBBBBBBBBBBBBBBD.....",
        "..DBBBDDDDDDDBBBDD......",
        "..DBBBDTTTTTDBBBDD......",
        "..DBBBDTTTTTDBBBDD......",
        "..DBBBDBBBBBDBBBDD..HHHH",
        "..DCCCCCCCCCCCCCCD..HHHH",
        "...I..I......I..I...H..H",
        "..IIIIII....IIIIII..H..H"
    ];
    createPixelTexture(this, 'trojan', TROJAN, TROJAN_PALETTE, 2);

    // 5. Mimic
    const MIMIC_PALETTE = { '.': null, 'S': '#fcd2b2', 'H': '#ffd700', 'C': '#008080', 'B': '#8b5a2b', 'P': '#ffffff', 'K': '#000000' };
    const MIMIC = [
        "....KKKK....",
        "...KHHHHK...",
        "...KSSSSK...",
        "....KSSK....",
        "...KCCCCK...",
        "..KCCCCCCK..",
        "..KCPPPPCK..",
        "...KCCCCK...",
        "....KBKB...."
    ];
    createPixelTexture(this, 'mimic', MIMIC, MIMIC_PALETTE, 2);

    // 6. Sentry/Guard
    const GUARD_PALETTE = { '.': null, 'S': '#c0c0c0', 'G': '#ffd700', 'R': '#ff0000', 'B': '#000000', 'P': '#fcd2b2' };
    const GUARD = [
        "....RRRR....",
        "...RSSSR...",
        "...RSSSR...",
        "...RSPBR...",
        "...SSSSS...",
        "..SGSSGS..",
        "..SGGSSG..",
        "...SSSSS...",
        "....B..B...."
    ];
    createPixelTexture(this, 'guard', GUARD, GUARD_PALETTE, 2);

    // 7. Sovereign/King
    const KING_PALETTE = { '.': null, 'H': '#8b5a2b', 'K': '#ffd700', 'C': '#bc13fe', 'S': '#c0c0c0', 'P': '#fcd2b2' };
    const KING = [
        "......KK......",
        ".....KCPK.....",
        "....CCCCSS....",
        "....CSSSSS....",
        "...CSSSSSHHH..",
        "..HHHHHHHHHHH.",
        "..HHHHHHHHHH..",
        "..H..H...H..H.",
        "..H..H...H..H."
    ];
    createPixelTexture(this, 'king', KING, KING_PALETTE, 2);
    
    // 8. Cage
    const CAGE_PALETTE = { '.': null, 'S': '#708090', 'C': '#00f3ff', 'G': '#2c3154' };
    const CAGE = [
        "GGGGSSSSSSGGGG",
        "G..S.C.C.S..G.",
        "S..S.C.C.S..S.",
        "S..SCCSSCS..S.",
        "S..S.C.C.S..S.",
        "S..S.C.C.S..S.",
        "GGGGSSSSSSGGGG"
    ];
    createPixelTexture(this, 'cage', CAGE, CAGE_PALETTE, 4);

    // 9. Particles/Sparks
    const SPARK_PALETTE = { 'Y': '#ffcc00', 'O': '#ff5500', 'R': '#ff0000' };
    const SPARK = [
        ".Y.",
        "YOY",
        "ROR",
        "YOY",
        ".Y."
    ];
    createPixelTexture(this, 'spark', SPARK, SPARK_PALETTE, 1);
}

function create() {
    // Parallax background drawing
    // Sky
    let sky = this.add.graphics();
    sky.fillGradientStyle(0x0a0f26, 0x0a0f26, 0x16132d, 0x16132d, 1);
    sky.fillRect(0, 0, 800, 200);

    // Forest tree outlines in background
    let bgTrees = this.add.graphics();
    bgTrees.fillStyle(0x0e1124, 0.7);
    bgTrees.fillTriangle(50, 200, 120, 80, 190, 200);
    bgTrees.fillTriangle(150, 200, 250, 50, 350, 200);
    bgTrees.fillTriangle(280, 200, 340, 100, 400, 200);
    bgTrees.fillTriangle(480, 200, 550, 80, 620, 200);
    bgTrees.fillTriangle(600, 200, 700, 60, 800, 200);

    // River Reflection & water area at the bottom
    let river = this.add.graphics();
    river.fillStyle(0x080914, 1);
    river.fillRect(0, 200, 800, 120);
    // Add grid lines representing water reflection
    river.lineStyle(1, 0x00f3ff, 0.08);
    for (let y = 200; y < 320; y += 10) {
        river.lineBetween(0, y, 800, y);
    }

    // Path for caravans (Dirt route)
    let path = this.add.graphics();
    path.fillStyle(0x2d2319, 1); // Dark brown
    path.fillRect(0, 170, 800, 35);
    // Path border
    path.fillStyle(0x181410, 1);
    path.fillRect(0, 205, 800, 4);

    // Stone Firewall Wall Structure in the middle
    let wall = this.add.graphics();
    wall.fillStyle(0x3c4260, 1); // Gray stone
    wall.fillRect(410, 20, 45, 185);
    // Stone brick grid lines
    wall.lineStyle(2, 0x1d2135, 1);
    for (let y = 20; y < 200; y += 15) {
        wall.lineBetween(410, y, 455, y);
    }
    // Vertical mortar lines
    for (let y = 20; y < 200; y += 30) {
        wall.lineBetween(425, y, 425, y + 15);
        wall.lineBetween(440, y + 15, 440, y + 30);
    }

    // Computer Firewall Wooden/Neon Arch Signboard
    let wallSign = this.add.graphics();
    wallSign.fillStyle(0x1b1c2b, 0.9);
    wallSign.lineStyle(2, 0x00f3ff, 1);
    wallSign.strokeRect(360, 10, 145, 24);
    wallSign.fillRect(360, 10, 145, 24);
    
    let textSign = this.add.text(372, 16, UI_TRANSLATIONS[currentLang].firewallGateSign, {
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '11px',
        color: '#00f3ff'
    });
    textSign.setShadow(0, 0, '#00f3ff', 3);
    this.textSign = textSign;

    // Gate Portcullis Grate Object
    this.portcullis = this.add.graphics();
    this.portcullis.lineStyle(3, 0x1f2438, 1);
    this.portcullis.fillStyle(0x1f2438, 0.8);
    // Horizontal bars
    this.portcullis.strokeRect(415, 110, 35, 95);
    for (let gy = 110; gy <= 205; gy += 16) {
        this.portcullis.lineBetween(415, gy, 450, gy);
    }
    // Vertical iron bars
    for (let gx = 422; gx <= 445; gx += 8) {
        this.portcullis.lineBetween(gx, 110, gx, 205);
    }

    // Sovereign/King static placement on right
    this.kingObj = this.add.sprite(520, 178, 'king');
    this.kingObj.setScale(1.5);

    // Guard Sentry static placement at gate
    this.guardObj = this.add.sprite(470, 182, 'guard');
    this.guardObj.setScale(1.4);

    // Castle towers on the right
    let castle = this.add.graphics();
    castle.fillStyle(0x282c40, 1);
    castle.fillRect(620, 40, 80, 160); // Main keep tower
    castle.fillRect(720, 60, 60, 140); // Side tower
    // Merlons (battlements)
    castle.fillRect(620, 28, 15, 12);
    castle.fillRect(650, 28, 20, 12);
    castle.fillRect(685, 28, 15, 12);
    castle.fillRect(720, 48, 15, 12);
    castle.fillRect(765, 48, 15, 12);

    // Cage/Sandbox placement
    this.cageObj = this.add.sprite(300, 85, 'cage');
    this.cageObj.setScale(1.2);
    this.cageObj.setVisible(false);

    // Scanning progress bar for sandbox
    this.scanBarBg = this.add.graphics();
    this.scanBarBg.fillStyle(0x111322, 1);
    this.scanBarBg.fillRoundedRect(250, 122, 100, 8, 3);
    this.scanBarBg.setVisible(false);

    this.scanBarFill = this.add.graphics();
    this.scanBarFill.setVisible(false);

    // Incinerator Fire (Dragon Pit)
    this.fireObj = this.add.graphics();
    this.fireObj.fillStyle(0x3c1910, 1);
    this.fireObj.fillRoundedRect(180, 230, 80, 25, 4);
    this.fireObj.lineStyle(1, 0xff5500, 0.5);
    this.fireObj.strokeRoundedRect(180, 230, 80, 25, 4);

    this.fireText = this.add.text(188, 236, UI_TRANSLATIONS[currentLang].incineratorSign, {
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '9px',
        color: '#ff5500'
    });

    // Particle emitter for burning and sandbox sparks (Phaser 3.60+ compatible)
    this.sparkEmitter = this.add.particles(0, 0, 'spark', {
        speed: { min: -50, max: 50 },
        angle: { min: 0, max: 360 },
        scale: { start: 1.5, end: 0 },
        blendMode: 'ADD',
        lifespan: 600,
        emitting: false
    });

    // Animate pigeon flap
    this.anims.create({
        key: 'pigeon_fly',
        frames: [
            { key: 'pigeon1' },
            { key: 'pigeon2' }
        ],
        frameRate: 4,
        repeat: -1
    });

    // Setup active game queue
    this.caravanSprites = [];

    // Trigger initial visual draw
    this.cameras.main.fadeIn(500, 5, 6, 11);
}

function update() {
    // Left empty: visual updates handled via tweens
}

// ==========================================
// 4. GAME STATE VARIABLES & MECHANICS
// ==========================================
const MAX_HEALTH = 5;
let health = MAX_HEALTH;
let wisdom = 0;
let economy = 100;
let currentLevel = 1;
let currentLevelData = [];
let queueIndex = 0;

let currentScenario = null;
let inspectedState = { lens: false, scale: false, crypto: false };
let isSandboxed = false;
let sandboxProgress = 0;
let sandboxTimerObj = null;

// Track history of threats for final screen
let statistics = {
    phish_resolved: 0,
    trojan_resolved: 0,
    zip_bomb_resolved: 0,
    social_resolved: 0,
    mitm_resolved: 0,
    fake_update_resolved: 0,
    false_alarms: 0,
    threats_leaked: 0
};

// ==========================================
// 5. GAME CONTROLLERS & ENGINE COUPLING
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Phaser game config
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 320,
        parent: 'phaserGame',
        backgroundColor: '#07080f',
        physics: {
            default: 'arcade'
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };
    gameInstance = new Phaser.Game(config);

    // Setup Button Event Listeners
    document.getElementById("startBtn").addEventListener("click", bootGame);
    document.getElementById("toolLens").addEventListener("click", () => activateTool('lens'));
    document.getElementById("toolScale").addEventListener("click", () => activateTool('scale'));
    document.getElementById("toolCrypto").addEventListener("click", () => activateTool('crypto'));
    document.getElementById("toolCage").addEventListener("click", () => activateTool('cage'));

    document.getElementById("btnAllow").addEventListener("click", handleAllow);
    document.getElementById("btnVerify").addEventListener("click", handleVerify);
    document.getElementById("btnArrest").addEventListener("click", handleArrest);
    document.getElementById("btnBurn").addEventListener("click", handleBurn);
    document.getElementById("nextBtn").addEventListener("click", advanceQueue);
    
    document.getElementById("retryBtn").addEventListener("click", restartGame);
    document.getElementById("restartBtn").addEventListener("click", restartGame);

    // Audio toggle deck
    const audioBtn = document.getElementById("audioToggleBtn");
    audioBtn.addEventListener("click", () => {
        sfx.enabled = !sfx.enabled;
        audioBtn.textContent = currentLang === 'ru' ? (sfx.enabled ? "ВКЛ" : "ВЫКЛ") : (sfx.enabled ? "ON" : "OFF");
        audioBtn.classList.toggle("toggle-active", sfx.enabled);
        sfx.playClick();
    });

    // Language toggle deck
    const langBtn = document.getElementById("langToggleBtn");
    if (langBtn) {
        langBtn.addEventListener("click", () => {
            const nextLang = currentLang === 'en' ? 'ru' : 'en';
            setLanguage(nextLang);
            // Also update audio button text format
            audioBtn.textContent = currentLang === 'ru' ? (sfx.enabled ? "ВКЛ" : "ВЫКЛ") : (sfx.enabled ? "ON" : "OFF");
            sfx.playClick();
        });
    }

    // Tutorial close button
    const tutorialCloseBtn = document.getElementById("tutorialCloseBtn");
    if (tutorialCloseBtn) {
        tutorialCloseBtn.addEventListener("click", () => {
            sfx.playClick();
            document.getElementById("tutorialOverlay").classList.add("hidden");
            localStorage.setItem('vigilant_sov_tutorial_seen', 'true');
        });
    }

    // Help button to reopen tutorial
    const helpBtn = document.getElementById("helpBtn");
    if (helpBtn) {
        helpBtn.addEventListener("click", () => {
            sfx.playClick();
            document.getElementById("tutorialOverlay").classList.remove("hidden");
        });
    }

    // Run initial setLanguage to apply currentLang preference
    setLanguage(currentLang);
});

function bootGame() {
    sfx.playClick();

    // Show tutorial on first play
    const tutorialSeen = localStorage.getItem('vigilant_sov_tutorial_seen');
    if (!tutorialSeen) {
        document.getElementById("tutorialOverlay").classList.remove("hidden");
    }

    document.getElementById("introScreen").classList.add("hidden");
    document.getElementById("auditScreen").classList.remove("hidden");
    
    // Initialize level 1 scenarios
    loadLevel(1);
}

function loadLevel(lvl) {
    currentLevel = lvl;
    const t = UI_TRANSLATIONS[currentLang];
    document.getElementById("levelVal").textContent = `${t.levelText} ${lvl}`;
    document.getElementById("threatIndicator").textContent = t.secureStatus;
    document.getElementById("threatIndicator").className = "status-indicator pulse warning";
    
    // Level Design Scenario Pools
    let scenarioPool = [];
    if (lvl === 1) {
        scenarioPool = [
            CARAVAN_SCENARIOS.find(s => s.id === "phish_email"),
            CARAVAN_SCENARIOS.find(s => s.id === "safe_merchant"),
            CARAVAN_SCENARIOS.find(s => s.id === "spear_phish"),
            CARAVAN_SCENARIOS.find(s => s.id === "safe_cleric"),
            CARAVAN_SCENARIOS.find(s => s.id === "mitm_messenger")
        ];
    } else if (lvl === 2) {
        scenarioPool = [
            CARAVAN_SCENARIOS.find(s => s.id === "trojan_exe"),
            CARAVAN_SCENARIOS.find(s => s.id === "safe_crate"),
            CARAVAN_SCENARIOS.find(s => s.id === "mal_download"),
            CARAVAN_SCENARIOS.find(s => s.id === "homograph_spoof"),
            CARAVAN_SCENARIOS.find(s => s.id === "zip_bomb"),
            CARAVAN_SCENARIOS.find(s => s.id === "safe_rider"),
            CARAVAN_SCENARIOS.find(s => s.id === "mal_attachment")
        ];
    } else {
        scenarioPool = [
            CARAVAN_SCENARIOS.find(s => s.id === "mimic_patch"),
            CARAVAN_SCENARIOS.find(s => s.id === "safe_architect"),
            CARAVAN_SCENARIOS.find(s => s.id === "ransomware_rider"),
            CARAVAN_SCENARIOS.find(s => s.id === "authority_impersonation"),
            CARAVAN_SCENARIOS.find(s => s.id === "fake_antivirus"),
            CARAVAN_SCENARIOS.find(s => s.id === "watering_hole"),
            CARAVAN_SCENARIOS.find(s => s.id === "driveby_wagon"),
            CARAVAN_SCENARIOS.find(s => s.id === "baiting_lottery")
        ];
    }

    currentLevelData = scenarioPool.sort(() => Math.random() - 0.5);
    queueIndex = 0;

    updateProgressBadge();

    if (currentScene) {
        currentScene.caravanSprites.forEach(s => s.destroy());
        currentScene.caravanSprites = [];
    }

    spawnQueueSprites();
}

function spawnQueueSprites() {
    if (!currentScene) return;
    
    for (let i = 0; i < currentLevelData.length; i++) {
        const scenario = currentLevelData[i];
        let key = 'wagon';
        if (scenario.type === 'pigeon') key = 'pigeon1';
        if (scenario.type === 'rider') key = 'rider';
        if (scenario.type === 'trojan') key = 'trojan';
        if (scenario.type === 'mimic') key = 'mimic';
        
        const targetX = 340 - (i * 90);
        const targetY = 175;
        
        let sprite = currentScene.add.sprite(-100 - (i * 90), targetY, key);
        sprite.setScale(scenario.type === 'pigeon' ? 1.4 : 1.6);
        sprite.setInteractive();
        
        sprite.scenarioData = scenario;
        sprite.indexInQueue = i;
        
        if (scenario.type === 'pigeon') {
            sprite.play('pigeon_fly');
        }

        currentScene.tweens.add({
            targets: sprite,
            x: targetX,
            duration: 1200,
            ease: 'Power2'
        });

        currentScene.caravanSprites.push(sprite);
    }

    setTimeout(startAuditCurrent, 1300);
}

function startAuditCurrent() {
    if (queueIndex >= currentLevelData.length) {
        checkLevelCompletion();
        return;
    }

    currentScenario = currentLevelData[queueIndex];
    inspectedState = { lens: false, scale: false, crypto: false };
    isSandboxed = false;
    sandboxProgress = 0;

    const tools = ['toolLens', 'toolScale', 'toolCrypto', 'toolCage'];
    tools.forEach(t => {
        const el = document.getElementById(t);
        el.className = "tool-btn";
        el.disabled = false;
    });

    document.getElementById("caravanTitle").textContent = currentLang === 'ru' ? `Профиль каравана #${queueIndex + 1}` : `Caravan Profile #${queueIndex + 1}`;
    document.getElementById("caravanType").textContent = getLocalizedScenarioField(currentScenario, "category");
    document.getElementById("profileSender").textContent = getLocalizedScenarioField(currentScenario, "claimedSender");
    document.getElementById("profileRoute").textContent = getLocalizedScenarioField(currentScenario, "claimedRoute");
    document.getElementById("profileSeal").textContent = getLocalizedScenarioField(currentScenario, "claimedSeal");
    document.getElementById("profileWeight").textContent = getLocalizedScenarioField(currentScenario, "claimedWeight");

    document.getElementById("truthLensReadout").classList.add("hidden");
    document.getElementById("magicScaleReadout").classList.add("hidden");
    document.getElementById("cryptographerReadout").classList.add("hidden");

    enableActionButtons(true);
    updateProgressBadge();

    if (currentScene) {
        currentScene.caravanSprites.forEach((s, idx) => {
            if (idx === queueIndex) {
                s.setTint(0x00f3ff);
            } else {
                s.clearTint();
            }
        });
    }

    checkQueueCongestion();
}

function checkQueueCongestion() {
    const unservedCount = currentLevelData.length - queueIndex;
    const t = UI_TRANSLATIONS[currentLang];
    if (unservedCount >= 3) {
        document.getElementById("threatIndicator").textContent = t.congestionStatus;
        document.getElementById("threatIndicator").className = "status-indicator pulse text-red";
        economy = Math.max(0, economy - 3);
        updateHUD();
        if (economy <= 0) {
            triggerGameOver("congestion");
        }
    } else {
        document.getElementById("threatIndicator").textContent = t.secureStatus;
        document.getElementById("threatIndicator").className = "status-indicator pulse warning";
    }
}

function activateTool(tool) {
    if (isSandboxed) return;
    sfx.playToolSound();

    const toolBtn = document.getElementById(`tool${tool.charAt(0).toUpperCase() + tool.slice(1)}`);
    toolBtn.classList.add("inspected");
    toolBtn.disabled = true;

    if (tool === 'lens') {
        inspectedState.lens = true;
        document.getElementById("lensValue").textContent = getLocalizedScenarioField(currentScenario, "actualSender");
        document.getElementById("truthLensReadout").classList.remove("hidden");
        if (currentScene) {
            let scan = currentScene.add.graphics();
            scan.lineStyle(2, 0x00f3ff, 0.8);
            scan.strokeCircle(340, 175, 45);
            currentScene.tweens.add({
                targets: scan,
                alpha: 0,
                scale: 1.5,
                duration: 400,
                onComplete: () => scan.destroy()
            });
        }
    } else if (tool === 'scale') {
        inspectedState.scale = true;
        let actualWeight = getLocalizedScenarioField(currentScenario, "actualWeight");
        let trueExt = getLocalizedScenarioField(currentScenario, "trueExtension");
        let scaleStr = currentLang === 'ru' ? `Реальный вес: ${actualWeight}` : `True Weight: ${actualWeight}`;
        if (trueExt) {
            scaleStr += currentLang === 'ru' ? ` | Расш: ${trueExt}` : ` | Ext: ${trueExt}`;
        }
        document.getElementById("scaleValue").textContent = scaleStr;
        document.getElementById("magicScaleReadout").classList.remove("hidden");
        if (currentScene) {
            const currentSprite = currentScene.caravanSprites[queueIndex];
            currentScene.tweens.add({
                targets: currentSprite,
                y: 155,
                yoyo: true,
                duration: 200,
                repeat: 1
            });
        }
    } else if (tool === 'crypto') {
        inspectedState.crypto = true;
        document.getElementById("cryptoValue").textContent = getLocalizedScenarioField(currentScenario, "actualSeal");
        document.getElementById("cryptographerReadout").classList.remove("hidden");
        if (currentScene) {
            let glow = currentScene.add.graphics();
            glow.fillStyle(0xffd700, 0.4);
            glow.fillCircle(340, 160, 20);
            currentScene.tweens.add({
                targets: glow,
                alpha: 0,
                duration: 500,
                onComplete: () => glow.destroy()
            });
        }
    } else if (tool === 'cage') {
        startQuarantineSandbox();
    }
}

function startQuarantineSandbox() {
    isSandboxed = true;
    enableActionButtons(false);
    document.getElementById("toolCage").classList.add("active");
    document.getElementById("caravanTitle").textContent = UI_TRANSLATIONS[currentLang].sandboxActive;

    if (currentScene) {
        currentScene.cageObj.setVisible(true);
        currentScene.scanBarBg.setVisible(true);
        currentScene.scanBarFill.setVisible(true);

        const currentSprite = currentScene.caravanSprites[queueIndex];
        currentScene.tweens.add({
            targets: currentSprite,
            x: 300,
            y: 85,
            scale: 1.0,
            duration: 800,
            ease: 'Power1',
            onComplete: () => {
                sandboxProgress = 0;
                runSandboxProgress();
            }
        });
    }
}

function runSandboxProgress() {
    if (!currentScene) return;

    sandboxTimerObj = setInterval(() => {
        sandboxProgress += 10;
        
        currentScene.scanBarFill.clear();
        currentScene.scanBarFill.fillStyle(0x00f3ff, 1);
        currentScene.scanBarFill.fillRoundedRect(250, 122, sandboxProgress, 8, 3);

        sfx.playClick();
        currentScene.sparkEmitter.explode(2, 300, 85);

        if (sandboxProgress >= 100) {
            clearInterval(sandboxTimerObj);
            completeSandboxAnalysis();
        }
    }, 1000);
}

function completeSandboxAnalysis() {
    isSandboxed = false;
    enableActionButtons(true);
    document.getElementById("toolCage").className = "tool-btn inspected";
    document.getElementById("toolCage").disabled = true;

    document.getElementById("caravanTitle").textContent = UI_TRANSLATIONS[currentLang].inspectedProfile;

    if (currentScenario.isMalware) {
        sfx.playExplosion();
        document.getElementById("caravanTitle").textContent = UI_TRANSLATIONS[currentLang].sandboxMalware;
        document.getElementById("caravanTitle").style.color = "var(--color-red)";
        
        if (currentScene) {
            currentScene.sparkEmitter.explode(25, 300, 85);
            currentScene.cageObj.setTint(0xff3c3c);
            
            currentScene.scanBarFill.clear();
            currentScene.scanBarFill.fillStyle(0xff3c3c, 1);
            currentScene.scanBarFill.fillRoundedRect(250, 122, 100, 8, 3);
        }

        inspectedState.lens = true;
        inspectedState.scale = true;
        inspectedState.crypto = true;
        document.getElementById("lensValue").textContent = getLocalizedScenarioField(currentScenario, "actualSender");
        document.getElementById("truthLensReadout").classList.remove("hidden");
        document.getElementById("scaleValue").textContent = (currentLang === 'ru' ? 'РЕАЛЬНЫЙ РАЗМЕР: ' : 'TRUE SIZE: ') + getLocalizedScenarioField(currentScenario, "actualWeight");
        document.getElementById("magicScaleReadout").classList.remove("hidden");
        document.getElementById("cryptoValue").textContent = getLocalizedScenarioField(currentScenario, "actualSeal");
        document.getElementById("cryptographerReadout").classList.remove("hidden");
        
    } else {
        sfx.playSuccess();
        document.getElementById("caravanTitle").textContent = UI_TRANSLATIONS[currentLang].sandboxClean;
        document.getElementById("caravanTitle").style.color = "var(--color-green)";
        if (currentScene) {
            currentScene.cageObj.setTint(0x39ff14);
            currentScene.scanBarFill.clear();
            currentScene.scanBarFill.fillStyle(0x39ff14, 1);
            currentScene.scanBarFill.fillRoundedRect(250, 122, 100, 8, 3);
        }
    }
}

function handleAllow() {
    if (isSandboxed) return;
    sfx.playClick();
    enableActionButtons(false);

    if (currentScene) {
        currentScene.tweens.add({
            targets: currentScene.portcullis,
            y: -80,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                const currentSprite = currentScene.caravanSprites[queueIndex];
                const currentX = currentSprite.x;
                const targetPathY = 175;

                currentScene.tweens.add({
                    targets: currentSprite,
                    x: [currentX, 420, 600],
                    y: [currentSprite.y, targetPathY, targetPathY],
                    alpha: { start: 1, end: 0 },
                    duration: 1500,
                    onComplete: () => {
                        currentScene.tweens.add({
                            targets: currentScene.portcullis,
                            y: 0,
                            duration: 400,
                            ease: 'Bounce'
                        });
                        resolveAllowOutcome();
                    }
                });
            }
        });
    } else {
        resolveAllowOutcome();
    }
}

function resolveAllowOutcome() {
    cleanupSandboxOverlay();

    if (currentScenario.isMalware) {
        health--;
        statistics.threats_leaked++;
        sfx.playExplosion();
        
        if (currentScene) {
            currentScene.cameras.main.shake(400, 0.02);
            let threatTypeVal = getLocalizedScenarioField(currentScenario, "threatType");
            let prefix = currentLang === 'ru' ? 'ОБНАРУЖЕН ПРОРЫВ: ' : 'BREACH DETECTED: ';
            document.getElementById("alertMessage").textContent = `${prefix}${threatTypeVal}!`;
            document.getElementById("intrusionAlert").classList.remove("hidden");
            setTimeout(() => {
                document.getElementById("intrusionAlert").classList.add("hidden");
            }, 3000);
        }

        let descVal = getLocalizedScenarioField(currentScenario, "description");
        let prefixFeedback = currentLang === 'ru' ? 'ОБНАРУЖЕНО ЗАРАЖЕНИЕ! ' : 'INFECTION DETECTED! ';
        showFeedback(false, `${prefixFeedback}${descVal}`);
    } else {
        economy = Math.min(100, economy + 5);
        sfx.playSuccess();
        showFeedback(true, UI_TRANSLATIONS[currentLang].feedbackSafeAccess);
    }
    
    updateHUD();
    checkGameProgress();
}

function handleVerify() {
    if (isSandboxed) return;
    sfx.playClick();
    startQuarantineSandbox();
}

function handleArrest() {
    if (isSandboxed) return;
    sfx.playClick();
    enableActionButtons(false);

    if (currentScene) {
        const currentSprite = currentScene.caravanSprites[queueIndex];
        const currentX = currentSprite.x;

        currentScene.tweens.add({
            targets: currentScene.guardObj,
            x: currentX + 35,
            duration: 600,
            ease: 'Power1',
            onComplete: () => {
                sfx.playArrest();
                currentScene.tweens.add({
                    targets: [currentScene.guardObj, currentSprite],
                    y: -50,
                    alpha: 0,
                    duration: 1200,
                    onComplete: () => {
                        currentScene.guardObj.x = 470;
                        currentScene.guardObj.y = 182;
                        currentScene.guardObj.alpha = 1;
                        openThreatSelector();
                    }
                });
            }
        });
    } else {
        openThreatSelector();
    }
}

function openThreatSelector() {
    document.getElementById("auditScreen").classList.add("hidden");
    document.getElementById("threatSelectModal").classList.remove("hidden");

    const optionsGrid = document.getElementById("threatOptions");
    optionsGrid.innerHTML = "";

    REPORT_THREAT_OPTIONS.forEach((opt, idx) => {
        const card = document.createElement("div");
        card.className = "threat-option-card";
        let localizedText = opt.text;
        if (currentLang === 'ru') {
            if (opt.id === "phish") localizedText = "Фишинг / Подмена домена";
            else if (opt.id === "trojan") localizedText = "Троян (Двойное расширение файла)";
            else if (opt.id === "zip_bomb") localizedText = "Архивная бомба (Несовпадение размера)";
            else if (opt.id === "social") localizedText = "Социальная инженерия / Срочная приманка";
            else if (opt.id === "mitm") localizedText = "Незашифрованный протокол (Уязвимость MITM)";
            else if (opt.id === "fake_update") localizedText = "Фальшивое обновление / Патч из непроверенного источника";
        }
        card.innerHTML = `<span class="threat-option-num">${idx + 1}</span> <span>${localizedText}</span>`;
        card.addEventListener("click", () => resolveArrestSelection(opt.id));
        optionsGrid.appendChild(card);
    });
}

function resolveArrestSelection(selectedId) {
    sfx.playClick();
    cleanupSandboxOverlay();

    document.getElementById("threatSelectModal").classList.add("hidden");
    document.getElementById("feedbackScreen").classList.remove("hidden");

    const correctThreat = mapScenarioToThreatType(currentScenario);

    if (currentScenario.isMalware) {
        let threatType = getLocalizedScenarioField(currentScenario, "threatType");
        let description = getLocalizedScenarioField(currentScenario, "description");
        if (selectedId === correctThreat) {
            wisdom += 10;
            recordResolvedThreat(correctThreat);
            sfx.playSuccess();
            let text = UI_TRANSLATIONS[currentLang].feedbackSuccessReport + threatType + UI_TRANSLATIONS[currentLang].feedbackSuccessReportSuffix + description;
            showFeedback(true, text);
        } else {
            wisdom += 3;
            recordResolvedThreat(correctThreat);
            sfx.playArrest();
            let text = UI_TRANSLATIONS[currentLang].feedbackIncompleteReport + threatType + UI_TRANSLATIONS[currentLang].feedbackIncompleteReportSuffix + description;
            showFeedback(true, text);
        }
    } else {
        economy = Math.max(0, economy - 15);
        statistics.false_alarms++;
        sfx.playFail();
        let cat = getLocalizedScenarioField(currentScenario, "category");
        let text = UI_TRANSLATIONS[currentLang].feedbackSecurityInfringement + cat + UI_TRANSLATIONS[currentLang].feedbackSecurityInfringementSuffix;
        showFeedback(false, text);
    }

    updateHUD();
    checkGameProgress();
}

function handleBurn() {
    if (isSandboxed) return;
    sfx.playClick();
    enableActionButtons(false);

    if (currentScene) {
        const currentSprite = currentScene.caravanSprites[queueIndex];
        currentScene.tweens.add({
            targets: currentSprite,
            x: 220,
            y: 220,
            scale: 0.8,
            duration: 500,
            onComplete: () => {
                sfx.playFire();
                currentScene.sparkEmitter.explode(20, 220, 220);

                currentScene.tweens.add({
                    targets: currentSprite,
                    scale: 0,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        resolveBurnOutcome();
                    }
                });
            }
        });
    } else {
        resolveBurnOutcome();
    }
}

function resolveBurnOutcome() {
    cleanupSandboxOverlay();

    if (currentScenario.isMalware) {
        wisdom += 5;
        const threatType = mapScenarioToThreatType(currentScenario);
        recordResolvedThreat(threatType);
        sfx.playSuccess();
        showFeedback(true, UI_TRANSLATIONS[currentLang].feedbackThreatIncinerated);
    } else {
        economy = Math.max(0, economy - 15);
        statistics.false_alarms++;
        sfx.playFail();
        let cat = getLocalizedScenarioField(currentScenario, "category");
        let text = UI_TRANSLATIONS[currentLang].feedbackEconomicSabotage + cat + UI_TRANSLATIONS[currentLang].feedbackEconomicSabotageSuffix;
        showFeedback(false, text);
    }

    updateHUD();
    checkGameProgress();
}

function recordResolvedThreat(type) {
    if (type === "phish") statistics.phish_resolved++;
    else if (type === "trojan") statistics.trojan_resolved++;
    else if (type === "zip_bomb") statistics.zip_bomb_resolved++;
    else if (type === "social") statistics.social_resolved++;
    else if (type === "mitm") statistics.mitm_resolved++;
    else if (type === "fake_update") statistics.fake_update_resolved++;
}

function updateHUD() {
    for (let i = 1; i <= MAX_HEALTH; i++) {
        const heart = document.getElementById(`heart${i}`);
        if (heart) {
            if (i <= health) {
                heart.classList.add("active");
            } else {
                heart.classList.remove("active");
            }
        }
    }
    document.getElementById("wisdomScore").textContent = wisdom;
    document.getElementById("economyScore").textContent = `${economy}%`;
}

function enableActionButtons(enable) {
    const btns = ["btnAllow", "btnVerify", "btnArrest", "btnBurn"];
    btns.forEach(b => {
        document.getElementById(b).disabled = !enable;
    });
}

function cleanupSandboxOverlay() {
    if (currentScene) {
        currentScene.cageObj.setVisible(false);
        currentScene.cageObj.clearTint();
        currentScene.scanBarBg.setVisible(false);
        currentScene.scanBarFill.setVisible(false);
        currentScene.scanBarFill.clear();
    }
}

function updateProgressBadge() {
    const total = currentLevelData ? currentLevelData.length : 0;
    const current = queueIndex + 1;
    const progressText = document.getElementById("progressText");
    const progressBarFill = document.getElementById("progressBarFill");
    if (progressText) {
        progressText.textContent = `${Math.min(current, total)}/${total}`;
    }
    if (progressBarFill) {
        const pct = total > 0 ? ((current - 1) / total) * 100 : 0;
        progressBarFill.style.width = `${Math.min(pct, 100)}%`;
    }
}

function showFeedback(isSuccess, text) {
    document.getElementById("auditScreen").classList.add("hidden");
    document.getElementById("feedbackScreen").classList.remove("hidden");

    const feedbackTitle = document.getElementById("feedbackTitle");
    const feedbackText = document.getElementById("feedbackText");
    const t = UI_TRANSLATIONS[currentLang];

    if (isSuccess) {
        feedbackTitle.textContent = t.feedbackTitleSuccess;
        feedbackTitle.className = "feedback-title glow-text-green";
    } else {
        feedbackTitle.textContent = t.feedbackTitleFailure;
        feedbackTitle.className = "feedback-title glow-text-red blink";
    }

    feedbackText.innerHTML = text;
}

function checkGameProgress() {
    if (health <= 0) {
        triggerGameOver("health");
    } else if (economy <= 0) {
        triggerGameOver("economy");
    }
}

function advanceQueue() {
    sfx.playClick();
    document.getElementById("feedbackScreen").classList.add("hidden");
    
    if (currentScene) {
        const spr = currentScene.caravanSprites[queueIndex];
        if (spr) spr.destroy();
    }

    queueIndex++;
    updateProgressBadge();

    if (queueIndex >= currentLevelData.length) {
        checkLevelCompletion();
    } else {
        if (currentScene) {
            for (let i = queueIndex; i < currentLevelData.length; i++) {
                const spr = currentScene.caravanSprites[i];
                if (spr) {
                    const targetX = 340 - ((i - queueIndex) * 90);
                    currentScene.tweens.add({
                        targets: spr,
                        x: targetX,
                        duration: 500,
                        ease: 'Power1'
                    });
                }
            }
        }
        
        document.getElementById("auditScreen").classList.remove("hidden");
        setTimeout(startAuditCurrent, 600);
    }
}

function checkLevelCompletion() {
    if (currentLevel < 3) {
        currentLevel++;
        sfx.playSuccess();
        let text = UI_TRANSLATIONS[currentLang].feedbackLevelCompleted + currentLevel + UI_TRANSLATIONS[currentLang].feedbackLevelCompletedSuffix;
        showFeedback(true, text);
        document.getElementById("nextBtn").onclick = () => {
            document.getElementById("feedbackScreen").classList.add("hidden");
            document.getElementById("auditScreen").classList.remove("hidden");
            loadLevel(currentLevel);
            document.getElementById("nextBtn").onclick = advanceQueue;
        };
    } else {
        triggerVictory();
    }
}

function triggerGameOver(reason) {
    sfx.playFail();
    document.getElementById("auditScreen").classList.add("hidden");
    document.getElementById("feedbackScreen").classList.add("hidden");
    document.getElementById("threatSelectModal").classList.add("hidden");
    document.getElementById("gameOverScreen").classList.remove("hidden");

    const pm = document.getElementById("postMortemText");
    const title = document.getElementById("failTitle");

    if (reason === "health") {
        title.textContent = UI_TRANSLATIONS[currentLang].gameOverInfected;
        pm.innerHTML = UI_TRANSLATIONS[currentLang].gameOverInfectedText;
    } else if (reason === "economy") {
        title.textContent = UI_TRANSLATIONS[currentLang].gameOverBankrupt;
        pm.innerHTML = UI_TRANSLATIONS[currentLang].gameOverBankruptText;
    } else {
        title.textContent = UI_TRANSLATIONS[currentLang].gameOverCongestion;
        pm.innerHTML = UI_TRANSLATIONS[currentLang].gameOverCongestionText;
    }
}

function triggerVictory() {
    sfx.playSuccess();
    document.getElementById("auditScreen").classList.add("hidden");
    document.getElementById("feedbackScreen").classList.add("hidden");
    document.getElementById("victoryScreen").classList.remove("hidden");

    let rankKey = "rankSovereign";
    if (wisdom < 50) rankKey = "rankApprentice";
    else if (wisdom < 100) rankKey = "rankKnight";
    else if (wisdom < 130) rankKey = "rankHighGuard";
    
    let rank = UI_TRANSLATIONS[currentLang][rankKey];

    const stats = document.getElementById("victoryStatsSummary");
    const t = UI_TRANSLATIONS[currentLang];
    stats.innerHTML = `
        <div class="stat-row"><span>${t.victoryStatsWisdom}</span> <span>${wisdom}</span></div>
        <div class="stat-row"><span>${t.victoryStatsRank}</span> <span><b>${rank}</b></span></div>
        <div class="stat-row"><span>${t.victoryStatsPhish}</span> <span>${statistics.phish_resolved}</span></div>
        <div class="stat-row"><span>${t.victoryStatsTrojan}</span> <span>${statistics.trojan_resolved}</span></div>
        <div class="stat-row"><span>${t.victoryStatsZipBomb}</span> <span>${statistics.zip_bomb_resolved}</span></div>
        <div class="stat-row"><span>${t.victoryStatsSocial}</span> <span>${statistics.social_resolved}</span></div>
        <div class="stat-row"><span>${t.victoryStatsMitm}</span> <span>${statistics.mitm_resolved}</span></div>
        <div class="stat-row"><span>${t.victoryStatsFakeUpdate}</span> <span>${statistics.fake_update_resolved}</span></div>
        <div class="stat-row"><span>${t.victoryStatsFalseAlarms}</span> <span>${statistics.false_alarms}</span></div>
        <div class="stat-row"><span>${t.victoryStatsLeaks}</span> <span>${statistics.threats_leaked}</span></div>
    `;
}

function restartGame() {
    sfx.playClick();
    health = MAX_HEALTH;
    wisdom = 0;
    economy = 100;
    currentLevel = 1;
    statistics = {
        phish_resolved: 0,
        trojan_resolved: 0,
        zip_bomb_resolved: 0,
        social_resolved: 0,
        mitm_resolved: 0,
        fake_update_resolved: 0,
        false_alarms: 0,
        threats_leaked: 0
    };
    
    updateHUD();

    document.getElementById("gameOverScreen").classList.add("hidden");
    document.getElementById("victoryScreen").classList.add("hidden");
    document.getElementById("auditScreen").classList.remove("hidden");

    loadLevel(1);
}
