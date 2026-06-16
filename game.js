class SoundSynth {
    constructor() { this.ctx = null; this.enabled = true; }
    init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
    playClick() {
        if (!this.enabled) return; this.init();
        const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.type = 'sine'; osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime); gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.start(); osc.stop(this.ctx.currentTime + 0.05);
    }
    playSuccess() {
        if (!this.enabled) return; this.init(); const t = this.ctx.currentTime;
        const playTone = (freq, delay, dur) => {
            const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
            osc.connect(gain); gain.connect(this.ctx.destination); osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + delay); gain.gain.setValueAtTime(0.06, t + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, t + delay + dur - 0.01);
            osc.start(t + delay); osc.stop(t + delay + dur);
        };
        playTone(392.00, 0, 0.1); playTone(523.25, 0.1, 0.1); playTone(659.25, 0.2, 0.12); playTone(783.99, 0.32, 0.25);
    }
    playFail() {
        if (!this.enabled) return; this.init();
        const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination); osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime); osc.frequency.linearRampToValueAtTime(70, this.ctx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);
        osc.start(); osc.stop(this.ctx.currentTime + 0.45);
    }
    playArrest() {
        if (!this.enabled) return; this.init(); const t = this.ctx.currentTime;
        const playTone = (freq, delay, dur) => {
            const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
            osc.connect(gain); gain.connect(this.ctx.destination); osc.type = 'square';
            osc.frequency.setValueAtTime(freq, t + delay); gain.gain.setValueAtTime(0.04, t + delay);
            gain.gain.linearRampToValueAtTime(0.001, t + delay + dur);
            osc.start(t + delay); osc.stop(t + delay + dur);
        };
        playTone(440.00, 0, 0.15); playTone(440.00, 0.18, 0.15); playTone(349.23, 0.36, 0.3);
    }
    playFire() {
        if (!this.enabled) return; this.init(); const dur = 0.5;
        const bufferSize = this.ctx.sampleRate * dur, buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate), data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = this.ctx.createBufferSource(); noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = 400;
        const gain = this.ctx.createGain(); gain.gain.setValueAtTime(0.12, this.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
        noise.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination); noise.start(); noise.stop(this.ctx.currentTime + dur);
    }
    playExplosion() {
        if (!this.enabled) return; this.init(); const dur = 0.8;
        const bufferSize = this.ctx.sampleRate * dur, buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate), data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = this.ctx.createBufferSource(); noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.setValueAtTime(600, this.ctx.currentTime); filter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + dur);
        const gain = this.ctx.createGain(); gain.gain.setValueAtTime(0.2, this.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
        noise.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination); noise.start(); noise.stop(this.ctx.currentTime + dur);
    }
    playToolSound() {
        if (!this.enabled) return; this.init();
        const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination); osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(1174.66, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime); gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        osc.start(); osc.stop(this.ctx.currentTime + 0.15);
    }
}
const sfx = new SoundSynth();

let currentLang = localStorage.getItem('vigilant_sov_lang') || 'en';
const UI_TRANSLATIONS = {
    en: {
        title1: "THE VIGILANT", title2: "SOVEREIGN", subtitle: "CYBER-DEFENSE REALM", shieldLabel: "KINGDOM SHIELD", wisdomLabel: "WISDOM", economyLabel: "ECONOMY", levelLabel: "DEFENSE LEVEL", secureStatus: "GATE SECURITY: SECURE", congestionStatus: "QUEUE CRITICAL: CONGESTION!", levelText: "LEVEL", bootProtocols: "BOOT REALM PROTOCOLS", introTitle: "DEFEND THE SOVEREIGN REALM!", introText: "Welcome, Royal Security Officer. Suspicious caravans are approaching the castle gates. Each caravan represents a **Data Packet** attempting to enter the kingdom's network. Inspect them using your **Security Tools**, then make your decision. Block threats, protect the Economy from false alarms, and gain Wisdom to secure the realm.", senderLabel: "Claimed Sender:", routeLabel: "Trade Route:", sealLabel: "Seal of Authenticity:", weightLabel: "Cargo Weight:", loading: "Loading...", unresolved: "Unresolved", realSourceLabel: "[LENS] Real Source:", realSizeLabel: "[SCALE] Real Size / Format:", sigIntegrityLabel: "[CRYPTO] Signature Integrity:", toolsTitle: "ACTIVE SECURITY TOOLS", toolLens: "Truth Lens", toolScale: "Magic Scale", toolCrypto: "Cryptographer", toolCage: "Quarantine Cage", decisionTitle: "SOVEREIGN DECISION", btnAllow: "ALLOW / OPEN", btnVerify: "TRUST & VERIFY", btnArrest: "DENY & REPORT", btnBurn: "IGNORE & BURN", modalTitle: "REPORTING SECURITY THREAT", modalDesc: "Identify the precise vector of this attack:", feedbackTitleSuccess: "REALM PROTECTED", feedbackTitleFailure: "SECURITY BREACH ALERT", continueDuty: "CONTINUE DUTY", rebootRetry: "REBOOT REALM (RETRY)", victoryTitle: "THE REALM IS SECURED!", victoryText: "All caravans have been inspected. The kingdom stands secure against modern cyber threats!", restartBtn: "REPLAY DUTY PROTOCOLS", soundLabel: "SOUND", themeLabel: "THEME", langLabel: "LANGUAGE", guardsLabel: "GUARDS", on: "ON", off: "OFF", firewallGateSign: "FIREWALL GATE", incineratorSign: "INCINERATOR", sandboxActive: "Quarantine Cage Sandbox Active...", sandboxMalware: "Cage Sandbox: MALWARE WARNING!", sandboxClean: "Cage Sandbox: BEHAVIOR CLEAN", inspectedProfile: "Inspected Caravan Profile", trueSize: "TRUE SIZE:", intrusionAlertTitle: "⚠️ FIREWALL BREACH ALERT ⚠️", malwareDetected: "MALWARE DETECTED IN THE CASTLE KEEP!", breachDetected: "BREACH DETECTED:", gameOverInfected: "THE CASTLE IS INFECTED!", gameOverBankrupt: "THE KINGDOM BANKRUPT!", gameOverCongestion: "CONGESTION COLLAPSE!", gameOverInfectedText: "Critical security failure. Your health hit 0. The castle data was fully encrypted by Ransomware and backdoors leaked royal databases. <br><br><b>Educational Tip:</b> Always verify file sizes on the scale and inspect certificate signatures before granting entrance.", gameOverBankruptText: "The economy has collapsed. Your paranoia led you to block, burn, and arrest legitimate merchant supply lines. The local marketplaces shut down. <br><br><b>Educational Tip:</b> Balanced security relies on productivity. Do not block items that check out as valid and secure. Verify before blocking!", gameOverCongestionText: "The gate queue overflowed. Trade came to a standstill, causing local riots.", feedbackInfectionDetected: "INFECTION DETECTED! ", feedbackSafeAccess: "SAFE ACCESS: You successfully allowed a legitimate supply caravan into the kingdom. The marketplace flourishes.", feedbackSuccessReport: "SUCCESSFUL SECURITY REPORT! You correctly identified the threat as ", feedbackSuccessReportSuffix: ". +10 Wisdom Points. <br><br><b>Explanation:</b> ", feedbackIncompleteReport: "THREAT BLOCKED: You reported <b>{wrong}</b>, but the actual threat was ", feedbackIncompleteReportSuffix: ". +3 Wisdom Points. <br><br><b>Explanation:</b> ", feedbackSecurityInfringement: "SECURITY INFRINGEMENT: You arrested a legitimate trade caravan (", feedbackSecurityInfringementSuffix: "). Innocent merchants were imprisoned, which disrupted the marketplace. -15% Economy.", feedbackThreatIncinerated: "THREAT INCINERATED: You safely burned the suspicious caravan, preventing infection. However, reporting it to the Council would have yielded higher Wisdom points. +5 Wisdom Points.", feedbackEconomicSabotage: "ECONOMIC SABOTAGE: You completely incinerated a safe cargo caravan (", feedbackEconomicSabotageSuffix: "). The guild suffered severe losses, damaging castle trade. -15% Economy.", feedbackLevelCompleted: "LEVEL COMPLETED! <br><br>You successfully guarded the gate. Level ", feedbackLevelCompletedSuffix: " presents complex vulnerabilities. Prepare your tools!", victoryStatsWisdom: "Final Wisdom Score:", victoryStatsRank: "Final Guard Rank:", victoryStatsPhish: "Phishing Attacks Stopped:", victoryStatsTrojan: "Trojans Identified:", victoryStatsZipBomb: "Zip Bombs Incinerated:", victoryStatsSocial: "Social Engineering Defeated:", victoryStatsMitm: "Insecure Connections Blocked (MITM):", victoryStatsFakeUpdate: "Fake Updates Blocked:", victoryStatsFalseAlarms: "False Alarms Raised:", victoryStatsLeaks: "Malware Leaks:", rankSovereign: "Sovereign Defender", rankApprentice: "Apprentice Sentry", rankKnight: "Knight Watchman", rankHighGuard: "High Guard Inquisitor", tutorialTitle: "HOW TO PLAY", tutorialSubtitle: "Royal Security Officer Training Manual", tutStep1Title: "\ud83d\udd0d Inspect", tutStep1Desc: 'Use your <strong>Security Tools</strong> to reveal hidden info.', tutStep2Title: "\u2696\ufe0f Analyze", tutStep2Desc: 'Compare <strong>Claimed Sender</strong> with <strong>Real Source</strong>.', tutStep3Title: "\u2705 Decide", tutStep3Desc: '<strong>Allow</strong> safe caravans or <strong>Deny & Report</strong> threats.', tutStep4Title: "\ud83d\udcdd Report", tutStep4Desc: 'Pick the <strong>correct threat type</strong> to earn max Wisdom.', tutToolsTitle: "SECURITY TOOLS GUIDE", tutGuideDescLens: "Reveals actual sender domains to catch spoofing.", tutGuideDescScale: "Shows true file size and hidden extensions.", tutGuideDescCrypto: "Verifies digital signatures and secure routes.", tutGuideDescCage: "Sandbox to safely test suspicious payloads.", tutThreatsTitle: "THREAT TYPES GUIDE", tutThreatName1: "Phishing / Spoofing", tutThreatDesc1: "Fake senders tricking you into revealing credentials.", tutThreatName2: "Double Ext. Trojan", tutThreatDesc2: "Malware disguised as a safe file (e.g., .pdf.exe).", tutThreatName3: "Zip Bomb", tutThreatDesc3: "A tiny archive that crashes systems when expanded.", tutThreatName4: "Social Eng. / Baiting", tutThreatDesc4: "Manipulating human fear or greed to gain access.", tutThreatName5: "Unencrypted (MITM)", tutThreatDesc5: "HTTP traffic where data can be intercepted.", tutThreatName6: "Fake Update", tutThreatDesc6: "Malicious payload disguised as a system patch.", tutDecisionsTitle: "DECISION GUIDE", tutGuideAllowLabel: "ALLOW / OPEN", tutGuideAllowText: "Use when all tools show VALID / MATCH results. Boosts Economy +5%.", tutGuideVerifyLabel: "TRUST & VERIFY", tutGuideVerifyText: "Sends to quarantine sandbox for a deep scan.", tutGuideDenyLabel: "DENY & REPORT", tutGuideDenyText: "Block threat & file report (+10 Wisdom).", tutGuideBurnLabel: "IGNORE & BURN", tutGuideBurnText: "Destroy without reporting (+5 Wisdom).", tutorialCloseBtn: "BEGIN DUTY", progressLabel: "CARAVAN", keyTipsText: "Tip: Look for MISMATCH in sender or EXTERNAL routes!", tooltipAllow: "Use when all tools show VALID / MATCH results", tooltipAllowHint: "\u2705 SAFE CARAVAN", tooltipVerify: "Sends to quarantine for a deep scan", tooltipVerifyHint: "\ud83d\udd2c UNSURE?", tooltipArrest: "Block & report for +10 Wisdom", tooltipArrestHint: "\ud83d\udea8 THREAT FOUND", tooltipBurn: "Incinerate for +5 Wisdom", tooltipBurnHint: "\ud83d\udd25 QUICK DESTROY", realWorldLabel: "Real-World Example:"
    },
    ru: {
        title1: "БДИТЕЛЬНЫЙ", title2: "СУВЕРЕН", subtitle: "ЦАРСТВО КИБЕРЗАЩИТЫ", shieldLabel: "ЩИТ КОРОЛЕВСТВА", wisdomLabel: "МУДРОСТЬ", economyLabel: "ЭКОНОМИКА", levelLabel: "УРОВЕНЬ ЗАЩИТЫ", secureStatus: "БЕЗОПАСНОСТЬ ВОРОТ: НАДЁЖНО", congestionStatus: "ОЧЕРЕДЬ КРИТИЧЕСКАЯ: ПЕРЕГРУЗКА!", levelText: "УРОВЕНЬ", bootProtocols: "ЗАПУСТИТЬ ПРОТОКОЛЫ", introTitle: "ЗАЩИТИТЕ СУВЕРЕННОЕ КОРОЛЕВСТВО!", introText: "Приветствуем вас, королевский офицер безопасности. Подозрительные караваны приближаются к воротам. Каждый караван - это **пакет данных**. Осмотрите их и примите решение.", senderLabel: "Заявленный отправитель:", routeLabel: "Торговый путь:", sealLabel: "Печать подлинности:", weightLabel: "Вес груза:", loading: "Загрузка...", unresolved: "Не определено", realSourceLabel: "[ЛИНЗА] Реальный источник:", realSizeLabel: "[ВЕСЫ] Реальный размер/формат:", sigIntegrityLabel: "[КРИПТО] Целостность подписи:", toolsTitle: "АКТИВНЫЕ ИНСТРУМЕНТЫ", toolLens: "Линза Истины", toolScale: "Волшебные Весы", toolCrypto: "Криптограф", toolCage: "Карантинная Клетка", decisionTitle: "РЕШЕНИЕ СУВЕРЕНА", btnAllow: "ПРОПУСТИТЬ / ОТКРЫТЬ", btnVerify: "ПРОВЕРИТЬ В КАРАНТИНЕ", btnArrest: "ЗАДЕРЖАТЬ / ДОЛОЖИТЬ", btnBurn: "СЖЕЧЬ / ИГНОРИРОВАТЬ", modalTitle: "ОТЧЕТ ОБ УГРОЗЕ БЕЗОПАСНОСТИ", modalDesc: "Определите точный вектор этой атаки:", feedbackTitleSuccess: "КОРОЛЕВСТВО ЗАЩИЩЕНО", feedbackTitleFailure: "ТРЕВОГА: ПРОРЫВ БЕЗОПАСНОСТИ", continueDuty: "ПРОДОЛЖИТЬ СЛУЖБУ", rebootRetry: "ПЕРЕЗАГРУЗИТЬ (ПОВТОРИТЬ)", victoryTitle: "КОРОЛЕВСТВО В БЕЗОПАСНОСТИ!", victoryText: "Все караваны проверены. Королевство надежно защищено!", restartBtn: "ИГРАТЬ СНОВА", soundLabel: "ЗВУК", themeLabel: "ТЕМА", langLabel: "ЯЗЫК", guardsLabel: "СТРАЖА", on: "ВКЛ", off: "ВЫКЛ", firewallGateSign: "КИБЕР-ВОРОТА", incineratorSign: "УТИЛИЗАТОР", sandboxActive: "Карантинная клетка: анализ...", sandboxMalware: "Анализ: ОБНАРУЖЕНО ВРЕДОНОСНОЕ ПО!", sandboxClean: "Анализ: УГРОЗ НЕ ОБНАРУЖЕНО", inspectedProfile: "Проверенный профиль каравана", trueSize: "РЕАЛЬНЫЙ РАЗМЕР:", intrusionAlertTitle: "⚠️ ОБНАРУЖЕН ПРОРЫВ ⚠️", malwareDetected: "ВНУТРИ ЗАМКА ОБНАРУЖЕНО ВРЕДОНОСНОЕ ПО!", breachDetected: "ОБНАРУЖЕН ПРОРЫВ:", gameOverInfected: "ЗАМОК ЗАРАЖЕН!", gameOverBankrupt: "КОРОЛЕВСТВО ОБАНКРОТИЛОСЬ!", gameOverCongestion: "КОЛЛАПС ИЗ-ЗА ПЕРЕГРУЗКИ!", gameOverInfectedText: "Критический сбой. Замок зашифрован вымогателями.", gameOverBankruptText: "Экономика рухнула. Вы блокировали легальные пути.", gameOverCongestionText: "Очередь у ворот переполнилась. Торговля остановилась.", feedbackInfectionDetected: "ОБНАРУЖЕНО ЗАРАЖЕНИЕ! ", feedbackSafeAccess: "БЕЗОПАСНЫЙ ДОСТУП: Вы впустили законный торговый караван.", feedbackSuccessReport: "УСПЕШНЫЙ ОТЧЕТ! Вы правильно задержали угрозу: ", feedbackSuccessReportSuffix: ". +10 очков Мудрости. <br><br><b>Объяснение:</b> ", feedbackIncompleteReport: "УГРОЗА БЛОКИРОВАНА: Вы выбрали <b>{wrong}</b>, но на самом деле это ", feedbackIncompleteReportSuffix: ". +3 очка Мудрости. <br><br><b>Объяснение:</b> ", feedbackSecurityInfringement: "НАРУШЕНИЕ ПРАВ: Вы задержали законный караван (", feedbackSecurityInfringementSuffix: "). -15% Экономики.", feedbackThreatIncinerated: "УГРОЗА СЖЖЕНА: Вы сожгли подозрительный караван. +5 Мудрости.", feedbackEconomicSabotage: "ЭКОНОМИЧЕСКИЙ САБОТАЖ: Вы сожгли безопасный караван (", feedbackEconomicSabotageSuffix: "). -15% Экономики.", feedbackLevelCompleted: "УРОВЕНЬ ЗАВЕРШЕН! Уровень ", feedbackLevelCompletedSuffix: " пройден.", victoryStatsWisdom: "Итоговая мудрость:", victoryStatsRank: "Итоговый ранг:", victoryStatsPhish: "Фишинговых атак:", victoryStatsTrojan: "Троянов:", victoryStatsZipBomb: "Архивных бомб:", victoryStatsSocial: "Социальной инженерии:", victoryStatsMitm: "MITM-атак:", victoryStatsFakeUpdate: "Фальшивых обновлений:", victoryStatsFalseAlarms: "Ложных тревог:", victoryStatsLeaks: "Утечек ПО:", rankSovereign: "Суверенный защитник", rankApprentice: "Подмастерье часового", rankKnight: "Рыцарь-страж", rankHighGuard: "Инквизитор Высшей Стражи", tutorialTitle: "КАК ИГРАТЬ", tutorialSubtitle: "Пособие офицера", tutStep1Title: "\ud83d\udd0d Осмотр", tutStep1Desc: 'Используйте инструменты для проверки.', tutStep2Title: "\u2696\ufe0f Анализ", tutStep2Desc: 'Сравните отправителя с реальным источником.', tutStep3Title: "\u2705 Решение", tutStep3Desc: 'Пропустите безопасные или задержите угрозы.', tutStep4Title: "\ud83d\udcdd Отчёт", tutStep4Desc: 'Выберите верный тип угрозы.', tutToolsTitle: "ИНСТРУМЕНТЫ БЕЗОПАСНОСТИ", tutGuideDescLens: "Раскрывает реальный домен для защиты от подмены.", tutGuideDescScale: "Показывает истинный вес и скрытые расширения.", tutGuideDescCrypto: "Проверяет цифровые подписи и безопасность маршрута.", tutGuideDescCage: "Песочница для безопасной проверки подозрительных грузов.", tutThreatsTitle: "ВИДЫ УГРОЗ", tutThreatName1: "Фишинг / Подмена", tutThreatDesc1: "Поддельные отправители, крадущие ваши данные.", tutThreatName2: "Троян (Двойное расш.)", tutThreatDesc2: "Вирус, замаскированный под файл (напр. .pdf.exe).", tutThreatName3: "Архивная бомба", tutThreatDesc3: "Крошечный архив, ломающий систему при распаковке.", tutThreatName4: "Соц. инженерия", tutThreatDesc4: "Манипуляция страхом или жаждой наживы.", tutThreatName5: "Незашифрованный (MITM)", tutThreatDesc5: "Перехват данных при передаче без защиты.", tutThreatName6: "Фальшивое обновление", tutThreatDesc6: "Вирус под видом системного патча.", tutDecisionsTitle: "СПРАВОЧНИК", tutGuideAllowLabel: "ПРОПУСТИТЬ", tutGuideAllowText: "+5% Экономики.", tutGuideVerifyLabel: "КАРАНТИН", tutGuideVerifyText: "Безопасный вариант при сомнениях.", tutGuideDenyLabel: "ЗАДЕРЖАТЬ", tutGuideDenyText: "Отчет об угрозе (+10 Мудрости).", tutGuideBurnLabel: "СЖЕЧЬ", tutGuideBurnText: "Уничтожить без отчёта (+5 Мудрости).", tutorialCloseBtn: "НАЧАТЬ ИГРУ", progressLabel: "КАРАВАН", keyTipsText: "Совет: Ищите НЕСОВПАДЕНИЯ отправителя!", tooltipAllow: "Используйте для безопасных", tooltipAllowHint: "\u2705 БЕЗОПАСНЫЙ", tooltipVerify: "Отправить в карантин", tooltipVerifyHint: "\ud83d\udd2c НЕ УВЕРЕНЫ?", tooltipArrest: "Блокировать и доложить", tooltipArrestHint: "\ud83d\udea8 УГРОЗА", tooltipBurn: "Уничтожить без отчёта", tooltipBurnHint: "\ud83d\udd25 БЫСТРОЕ УНИЧТОЖЕНИЕ", realWorldLabel: "Пример из жизни:"
    },
    kk: {
        title1: "САҚ", title2: "ӘМІРШІ", subtitle: "КИБЕРҚОРҒАНЫС ӘЛЕМІ", shieldLabel: "ҚАМАЛ ҚАЛҚАНЫ", wisdomLabel: "ДАНАЛЫҚ", economyLabel: "ЭКОНОМИКА", levelLabel: "ҚОРҒАНЫС ДЕҢГЕЙІ", secureStatus: "ҚАҚПА ҚАУІПСІЗДІГІ: СЕНІМДІ", congestionStatus: "КЕЗЕК КРИТИКАЛЫҚ: ШЕКТЕН ТЫС!", levelText: "ДЕҢГЕЙ", bootProtocols: "ӘЛЕМ ПРОТОКОЛДАРЫН ІСКЕ ҚОСУ", introTitle: "СУВЕРЕНДІ ӘЛЕМДІ ҚОРҒАҢЫЗ!", introText: "Қош келдіңіз, Корольдік қауіпсіздік офицері. Қамал қақпасына күдікті керуендер жақындап келеді. Әр керуен патшалық желісіне кіруге тырысатын **Деректер пакетін** білдіреді. Оларды **Қауіпсіздік құралдарымен** тексеріп, шешім қабылдаңыз.", senderLabel: "Көрсетілген жіберуші:", routeLabel: "Сауда жолы:", sealLabel: "Түпнұсқалық мөрі:", weightLabel: "Жүк салмағы:", loading: "Жүктелуде...", unresolved: "Анықталмаған", realSourceLabel: "[ЛИНЗА] Нақты дереккөз:", realSizeLabel: "[ТАРАЗЫ] Нақты өлшемі / пішімі:", sigIntegrityLabel: "[КРИПТО] Қолтаңба тұтастығы:", toolsTitle: "БЕЛСЕНДІ ҚАУІПСІЗДІК ҚҰРАЛДАРЫ", toolLens: "Шындық линзасы", toolScale: "Сиқырлы таразы", toolCrypto: "Криптограф", toolCage: "Карантин торы", decisionTitle: "ӘМІРШІ ШЕШІМІ", btnAllow: "РҰҚСАТ БЕРУ / АШУ", btnVerify: "ТЕКСЕРУ ЖӘНЕ КАРАНТИН", btnArrest: "ҚАМАУҒА АЛУ ЖӘНЕ БАЯНДАУ", btnBurn: "ЕЛЕМЕУ ЖӘНЕ ӨРТЕУ", modalTitle: "ҚАУІПСІЗДІК ҚАТЕРІ ТУРАЛЫ БАЯНДАУ", modalDesc: "Жоғарғы Кеңеске дұрыс есеп жіберу үшін шабуыл векторын анықтаңыз:", feedbackTitleSuccess: "ӘЛЕМ ҚОРҒАЛДЫ", feedbackTitleFailure: "ҚАУІПСІЗДІКТІ БҰЗУ ДАБЫЛЫ", continueDuty: "ҚЫЗМЕТТІ ЖАЛҒАСТЫРУ", rebootRetry: "ӘЛЕМДІ ҚАЙТА ҚОСУ", victoryTitle: "ӘЛЕМ ҚАУІПСІЗДІКТЕ!", victoryText: "Барлық керуендер тексерілді. Патшалық қорғалған!", restartBtn: "ҚЫЗМЕТКЕ ҚАЙТА ОРАЛУ", soundLabel: "ДЫБЫС", themeLabel: "ТАҚЫРЫП", langLabel: "ТІЛ", guardsLabel: "КҮЗЕТШІЛЕР", on: "ҚОСУЛЫ", off: "ӨШІРУЛІ", firewallGateSign: "КИБЕР-ҚАҚПА", incineratorSign: "ӨРТЕГІШ", sandboxActive: "Карантин торы: талдау...", sandboxMalware: "Талдау: ЗИЯНДЫ БАҒДАРЛАМА АНЫҚТАЛДЫ!", sandboxClean: "Талдау: ҚАУІП АНЫҚТАЛҒАН ЖОҚ", inspectedProfile: "Тексерілген керуен профилі", trueSize: "НАҚТЫ ӨЛШЕМІ:", intrusionAlertTitle: "⚠️ БРАНДМАУЭРДІ БҰЗУ ДАБЫЛЫ ⚠️", malwareDetected: "ҚАМАЛ ІШІНДЕ ЗИЯНДЫ БАҒДАРЛАМА АНЫҚТАЛДЫ!", breachDetected: "БҰЗУ АНЫҚТАЛДЫ:", gameOverInfected: "ҚАМАЛ ЗАҚЫМДАНДЫ!", gameOverBankrupt: "ПАТШАЛЫҚ БАНКРОТ БОЛДЫ!", gameOverCongestion: "КЕЗЕКТЕН ШЕКТЕН ТЫС ЖҮКТЕМЕ!", gameOverInfectedText: "Қауіпсіздіктің сыни қателігі. Қамал деректері шифрланды.", gameOverBankruptText: "Экономика күйреді. Сіз заңды сауда жолдарын бұғаттадыңыз.", gameOverCongestionText: "Қақпадағы кезек толып кетті. Сауда тоқтап, бүлік тудырды.", feedbackInfectionDetected: "ЖҰҚПА АНЫҚТАЛДЫ! ", feedbackSafeAccess: "ҚАУІПСІЗ КІРУ: Сіз заңды сауда керуенін кіргіздіңіз.", feedbackSuccessReport: "СӘТТІ ЕСЕП! Сіз қауіпті дұрыс анықтадыңыз: ", feedbackSuccessReportSuffix: ". +10 Даналық ұпайы. <br><br><b>Түсініктеме:</b> ", feedbackIncompleteReport: "ҚАУІП БҰҒАТТАЛДЫ: Сіз <b>{wrong}</b> деп таңдадыңыз, бірақ нақты қауіп ", feedbackIncompleteReportSuffix: ". +3 Даналық ұпайы. <br><br><b>Түсініктеме:</b> ", feedbackSecurityInfringement: "ҚҰҚЫҚ БҰЗУШЫЛЫҚ: Сіз заңды керуенді қамауға алдыңыз (", feedbackSecurityInfringementSuffix: "). -15% Экономика.", feedbackThreatIncinerated: "ҚАУІП ӨРТЕЛДІ: Сіз күдікті керуенді өртедіңіз. +5 Даналық.", feedbackEconomicSabotage: "ЭКОНОМИКАЛЫҚ САБОТАЖ: Сіз қауіпсіз жүк керуенін өртедіңіз (", feedbackEconomicSabotageSuffix: "). -15% Экономика.", feedbackLevelCompleted: "ДЕҢГЕЙ АЯҚТАЛДЫ! Деңгей ", feedbackLevelCompletedSuffix: " аяқталды.", victoryStatsWisdom: "Қорытынды Даналық:", victoryStatsRank: "Қорытынды шен:", victoryStatsPhish: "Фишинг шабуылдары:", victoryStatsTrojan: "Трояндар:", victoryStatsZipBomb: "Мұрағат бомбалары:", victoryStatsSocial: "Әлеуметтік инженерия:", victoryStatsMitm: "MITM шабуылдары:", victoryStatsFakeUpdate: "Жалған жаңартулар:", victoryStatsFalseAlarms: "Жалған дабылдар:", victoryStatsLeaks: "Деректердің жылыстауы:", rankSovereign: "Егемен қорғаушы", rankApprentice: "Шәкірт күзетші", rankKnight: "Сері-күзетші", rankHighGuard: "Жоғарғы күзет инквизиторы", tutorialTitle: "ҚАЛАЙ ОЙНАУ КЕРЕК", tutorialSubtitle: "Оқу құралы", tutStep1Title: "\ud83d\udd0d Тексеру", tutStep1Desc: 'Құралдарды пайдаланып ақпаратты ашыңыз.', tutStep2Title: "\u2696\ufe0f Талдау", tutStep2Desc: 'Мәлімделген мен нақты дереккөзді салыстырыңыз.', tutStep3Title: "\u2705 Шешім", tutStep3Desc: 'Рұқсат етіңіз немесе Қамауға алыңыз.', tutStep4Title: "\ud83d\udcdd Баяндау", tutStep4Desc: 'Дұрыс қауіп түрін таңдаңыз.', tutToolsTitle: "ҚАУІПСІЗДІК ҚҰРАЛДАРЫ", tutGuideDescLens: "Жалғандықтан қорғау үшін нақты доменді ашады.", tutGuideDescScale: "Нақты салмақты және жасырын кеңейтімдерді көрсетеді.", tutGuideDescCrypto: "Сандық қолтаңбалар мен маршрут қауіпсіздігін тексереді.", tutGuideDescCage: "Күдікті жүктерді қауіпсіз тексеруге арналған құмсалғыш.", tutThreatsTitle: "ҚАУІП ТҮРЛЕРІ", tutThreatName1: "Фишинг / Ауыстыру", tutThreatDesc1: "Деректеріңізді ұрлайтын жалған жіберушілер.", tutThreatName2: "Троян (Қос кеңейтім)", tutThreatDesc2: "Қауіпсіз файл түрінде жасырылған вирус.", tutThreatName3: "Мұрағат бомбасы", tutThreatDesc3: "Ашылғанда жүйені бұзатын кішкентай мұрағат.", tutThreatName4: "Әлеуметтік инженерия", tutThreatDesc4: "Қорқыныш немесе ашкөздікті пайдаланып алдау.", tutThreatName5: "Шифрланбаған (MITM)", tutThreatDesc5: "Қорғаныссыз тасымалдау кезінде деректерді ұстап алу.", tutThreatName6: "Жалған жаңарту", tutThreatDesc6: "Жүйелік патч түрінде жасырылған вирус.", tutDecisionsTitle: "НҰСҚАУЛЫҚ", tutGuideAllowLabel: "РҰҚСАТ БЕРУ", tutGuideAllowText: "Экономиканы +5% көтереді.", tutGuideVerifyLabel: "КАРАНТИН", tutGuideVerifyText: "Сенімді болмаған кездегі қауіпсіз нұсқа.", tutGuideDenyLabel: "БАЯНДАУ", tutGuideDenyText: "Есеп жіберіңіз (+10 Даналық).", tutGuideBurnLabel: "ӨРТЕУ", tutGuideBurnText: "Есепсіз жою (+5 Даналық).", tutorialCloseBtn: "ОЙЫНДЫ БАСТАУ", progressLabel: "КЕРУЕН", keyTipsText: "Кеңес: СӘЙКЕССІЗДІКТЕРДІ іздеңіз!", tooltipAllow: "ЖАРАМДЫ болғанда пайдаланыңыз", tooltipAllowHint: "\u2705 ҚАУІПСІЗ", tooltipVerify: "Карантинге жібереді", tooltipVerifyHint: "\ud83d\udd2c СЕНІМДІ ЕМЕСПІЗ БЕ?", tooltipArrest: "Бұғаттау және баяндау", tooltipArrestHint: "\ud83d\udea8 ҚАУІП", tooltipBurn: "Есепсіз жою", tooltipBurnHint: "\ud83d\udd25 ЖЫЛДАМ ЖОЮ", realWorldLabel: "Өмірдегі мысал:"
    }
};

const SCENARIO_TRANSLATIONS = {
    ru: {
        phish_typo: { category: "Гонец", threatType: "Фишинг", displayName: "Срочный свиток", claimedSender: "Королевское казначейство", claimedSeal: "Королевская печать", claimedWeight: "15 КБ", actualSender: "treasury@roya1.gov (НЕСОВПАДЕНИЕ)", actualRoute: "http://roya1.gov/login", actualSeal: "Поддельная печать", description: "Домен отправителя содержал опечатку (roya1 вместо royal).", realWorld: "Злоумышленники регистрируют домены с опечатками (например, paypa1.com вместо paypal.com) для кражи паролей." },
        phish_subdomain: { category: "Торговец", threatType: "Фишинг", displayName: "Телега стражи", claimedSender: "Служба безопасности", claimedSeal: "Знак стражи", claimedWeight: "2 МБ", actualSender: "royal.gov.security-check.com (НЕСОВПАДЕНИЕ)", actualRoute: "https://royal.gov.security-check.com", actualSeal: "Сертификат security-check.com", description: "Отправитель использовал поддельный субдомен.", realWorld: "Субдомен 'apple.com.security-check.net' принадлежит 'security-check.net'. Смотрите в конец адреса." },
        trojan_pdf_exe: { category: "Троян", threatType: "Троян", displayName: "Финансовый отчет", claimedSender: "Бухгалтер", claimedSeal: "Печать бухгалтерии", claimedWeight: "3.5 МБ", actualSender: "accountant@royal.gov (СОВПАДЕНИЕ)", actualRoute: "https://royal.gov/ledger", actualSeal: "Печать (СОВПАДЕНИЕ)", actualWeight: "3.5 МБ", trueExtension: "Ledger2026.pdf.exe", description: "Файл выдавал себя за PDF, но был исполняемым вирусом.", realWorld: "Windows скрывает расширения. 'Report.pdf.exe' выглядит как 'Report.pdf'. Вирус запускается при клике." },
        trojan_vbs: { category: "Троян", threatType: "Троян скрипт", displayName: "Список гильдии", claimedSender: "Гильдия кузнецов", claimedSeal: "Штамп гильдии", claimedWeight: "50 КБ", actualSender: "blacksmiths@royal.gov (СОВПАДЕНИЕ)", actualRoute: "https://royal.gov", actualSeal: "Штамп (СОВПАДЕНИЕ)", actualWeight: "50 КБ", trueExtension: "Members.xlsx.vbs", description: "Документ оказался вредоносным VBS-скриптом.", realWorld: "Скрипты (.vbs, .bat) маскируются под документы. При запуске они скачивают вирусы в фоновом режиме." },
        mitm_http: { category: "Гонец", threatType: "Атака посредника", displayName: "Незашифрованный голубь", claimedSender: "Пограничный пост", claimedSeal: "Значок поста", claimedWeight: "12 КБ", actualSender: "outpost@royal.gov (СОВПАДЕНИЕ)", actualRoute: "http://outpost.royal.gov (НЕЗАШИФРОВАНО)", actualSeal: "Нет шифрования", description: "Сообщение отправлено без шифрования.", realWorld: "Сайты на HTTP (без 's') передают данные в открытом виде. На публичном Wi-Fi любой может прочесть ваши пароли." },
        mitm_cert: { category: "Торговец", threatType: "Атака посредника", displayName: "Припасы союзников", claimedSender: "Король Севера", claimedSeal: "Северный герб", claimedWeight: "500 МБ", actualSender: "north-kingdom.gov (СОВПАДЕНИЕ)", actualRoute: "https://north-kingdom.gov", actualSeal: "Недействительный сертификат", description: "Цифровая печать (сертификат) была недействительна.", realWorld: "Даже с HTTPS, если браузер выдает ошибку 'Недействительный сертификат', хакер может перехватывать ваше соединение." },
        zip_bomb: { category: "Троян", threatType: "Архивная бомба", displayName: "Крошечный архив", claimedSender: "Архивариус", claimedSeal: "Печать архива", claimedWeight: "4 КБ", actualSender: "archive@royal.gov (СОВПАДЕНИЕ)", actualRoute: "https://royal.gov/archive", actualSeal: "Печать (СОВПАДЕНИЕ)", actualWeight: "4.5 Петабайт (КРИТИЧЕСКИЙ ВЕС)", trueExtension: "History.zip", description: "Архивная бомба была создана для уничтожения памяти королевства.", realWorld: "«Архивная бомба» — это файл размером в пару килобайт, который при распаковке заполняет весь жесткий диск и ломает систему." },
        social_urgency: { category: "Указ", threatType: "Социальная инженерия", displayName: "Генерал в панике", claimedSender: "Генерал Главнокомандующий", claimedSeal: "Военный значок", claimedWeight: "5 КБ", actualSender: "impostor@freemail.biz (НЕСОВПАДЕНИЕ)", actualRoute: "http://freemail.biz/urgent", actualSeal: "Отсутствует", description: "Мошенник создал ложную срочность для обхода защиты.", realWorld: "Атака BEC: хакер пишет от имени вашего босса или CEO с требованием срочно перевести деньги или купить подарочные карты." },
        social_baiting: { category: "Указ", threatType: "Социальная инженерия", displayName: "Глашатай лотереи", claimedSender: "Комитет благосостояния", claimedSeal: "Золотой штамп", claimedWeight: "10 КБ", actualSender: "scam-rewards.net (НЕСОВПАДЕНИЕ)", actualRoute: "http://scam-rewards.net/claim", actualSeal: "Поддельная печать", description: "Приманка использует жадность, предлагая фальшивую награду.", realWorld: "Фишинг-приманка (Baiting) обещает бесплатные фильмы или выигрыш смартфона. В реальном мире — это зараженная флешка на парковке." },
        fake_update_plugin: { category: "Мимик", threatType: "Ложное обновление", displayName: "Инспектор ворот", claimedSender: "Королевские инженеры", claimedSeal: "Печать с молотом", claimedWeight: "15 МБ", actualSender: "hackers-depot.com (НЕСОВПАДЕНИЕ)", actualRoute: "http://hackers-depot.com", actualSeal: "Отсутствует", description: "Инспектор заявил, что воротам нужен срочный патч.", realWorld: "Всплывающее окно на сайте сообщает, что ваш Flash Player или браузер устарел. Кнопка «Обновить» скачивает вирус." },
        fake_update_scareware: { category: "Мимик", threatType: "Ложная тревога", displayName: "Безумный экзорцист", claimedSender: "Служба безопасности", claimedSeal: "Печать Щита", claimedWeight: "2 МБ", actualSender: "scareware-alerts.biz (НЕСОВПАДЕНИЕ)", actualRoute: "http://scareware-alerts.biz", actualSeal: "Отсутствует", description: "Злоумышленник обманом заставил поверить, что замок уже заражен.", realWorld: "Scareware: веб-страница блокирует экран красным фоном и надписью «У вас 100 вирусов! Позвоните в техподдержку» для вымогательства денег." },
        safe_taxes: { category: "Торговец", threatType: "Безопасно", displayName: "Налоговая телега", claimedSender: "Налоговое министерство", claimedSeal: "Королевская печать", claimedWeight: "120 КБ", actualSender: "Налоговое министерство (СОВПАДЕНИЕ)", actualRoute: "https://taxes.royal.gov (БЕЗОПАСНЫЙ)", actualSeal: "Королевская печать (СОВПАДЕНИЕ)", trueExtension: "Taxes.xlsx", description: "Безопасная и подлинная налоговая декларация." },
        safe_supplies: { category: "Торговец", threatType: "Безопасно", displayName: "Припасы фермеров", claimedSender: "Гильдия фермеров", claimedSeal: "Печать фермеров", claimedWeight: "80 КБ", actualSender: "Гильдия фермеров (СОВПАДЕНИЕ)", actualRoute: "https://farms.royal.gov (БЕЗОПАСНЫЙ)", actualSeal: "Печать фермеров (СОВПАДЕНИЕ)", trueExtension: "List.pdf", description: "Настоящая телега с сельскохозяйственными припасами." },
        safe_diplomat: { category: "Гонец", threatType: "Безопасно", displayName: "Дипломатический голубь", claimedSender: "Королевство Союзников", claimedSeal: "Герб Союзников", claimedWeight: "15 КБ", actualSender: "Королевство Союзников (СОВПАДЕНИЕ)", actualRoute: "https://allies.gov (БЕЗОПАСНЫЙ)", actualSeal: "Герб Союзников (СОВПАДЕНИЕ)", trueExtension: "Treaty.docx", description: "Официальный дипломатический документ от союзников." },
        safe_internal: { category: "Указ", threatType: "Безопасно", displayName: "Всадник стражи", claimedSender: "Начальник стражи", claimedSeal: "Значок стражи", claimedWeight: "5 КБ", actualSender: "Начальник стражи (СОВПАДЕНИЕ)", actualRoute: "https://guards.royal.gov (БЕЗОПАСНЫЙ)", actualSeal: "Значок стражи (СОВПАДЕНИЕ)", trueExtension: "Report.txt", description: "Внутренний отчет об утреннем патрулировании." }
    },
    kk: {
        phish_typo: { category: "Шабарман", threatType: "Фишинг", displayName: "Шұғыл шиыршық", claimedSender: "Корольдік қазынашылық", claimedSeal: "Корольдік мөр", claimedWeight: "15 КБ", actualSender: "treasury@roya1.gov (СӘЙКЕС ЕМЕС)", actualRoute: "http://roya1.gov/login", actualSeal: "Жалған мөр", description: "Жіберуші доменінде қате болды (royal орнына roya1).", realWorld: "Шабуылшылар құпия сөздерді ұрлау үшін қатесі бар домендерді (мысалы, paypal.com орнына paypa1.com) тіркейді." },
        phish_subdomain: { category: "Саудагер", threatType: "Фишинг", displayName: "Күзет арбасы", claimedSender: "Қауіпсіздік қызметі", claimedSeal: "Күзет белгісі", claimedWeight: "2 МБ", actualSender: "royal.gov.security-check.com (СӘЙКЕС ЕМЕС)", actualRoute: "https://royal.gov.security-check.com", actualSeal: "security-check.com сертификаты", description: "Жіберуші жалған субдоменді пайдаланды.", realWorld: "'apple.com.security-check.net' субдомені 'security-check.net'-ке тиесілі. Әрқашан мекенжайдың соңына қараңыз." },
        trojan_pdf_exe: { category: "Троян", threatType: "Троян", displayName: "Қаржылық есеп", claimedSender: "Есепші", claimedSeal: "Бухгалтерия мөрі", claimedWeight: "3.5 МБ", actualSender: "accountant@royal.gov (СӘЙКЕС)", actualRoute: "https://royal.gov/ledger", actualSeal: "Мөр (СӘЙКЕС)", actualWeight: "3.5 МБ", trueExtension: "Ledger2026.pdf.exe", description: "Файл өзін PDF ретінде көрсетті, бірақ орындалатын вирус болды.", realWorld: "Windows кеңейтімдерді жасырады. 'Report.pdf.exe' 'Report.pdf' болып көрінеді. Басқан кезде вирус іске қосылады." },
        trojan_vbs: { category: "Троян", threatType: "Троян скрипт", displayName: "Гильдия тізімі", claimedSender: "Ұсталар гильдиясы", claimedSeal: "Гильдия мөрқалыбы", claimedWeight: "50 КБ", actualSender: "blacksmiths@royal.gov (СӘЙКЕС)", actualRoute: "https://royal.gov", actualSeal: "Мөрқалып (СӘЙКЕС)", actualWeight: "50 КБ", trueExtension: "Members.xlsx.vbs", description: "Құжат зиянды VBS-скрипт болып шықты.", realWorld: "Скрипттер (.vbs, .bat) құжаттар ретінде жасырылады. Іске қосылғанда олар фондық режимде вирустарды жүктейді." },
        mitm_http: { category: "Шабарман", threatType: "Делдал шабуылы", displayName: "Шифрланбаған көгершін", claimedSender: "Шекара бекеті", claimedSeal: "Бекет белгісі", claimedWeight: "12 КБ", actualSender: "outpost@royal.gov (СӘЙКЕС)", actualRoute: "http://outpost.royal.gov (ШИФРЛАНБАҒАН)", actualSeal: "Шифрлау жоқ", description: "Хабарлама шифрлаусыз жіберілді.", realWorld: "HTTP (s-сіз) сайттар деректерді ашық түрде тасымалдайды. Қоғамдық Wi-Fi-да кез келген адам құпия сөздеріңізді оқи алады." },
        mitm_cert: { category: "Саудагер", threatType: "Делдал шабуылы", displayName: "Одақтастар керек-жарағы", claimedSender: "Солтүстік Королі", claimedSeal: "Солтүстік елтаңба", claimedWeight: "500 МБ", actualSender: "north-kingdom.gov (СӘЙКЕС)", actualRoute: "https://north-kingdom.gov", actualSeal: "Жарамсыз сертификат", description: "Сандық мөр (сертификат) жарамсыз болды.", realWorld: "HTTPS болса да, егер браузер 'Жарамсыз сертификат' қатесін берсе, хакер қосылымыңызды ұстап қалуы мүмкін." },
        zip_bomb: { category: "Троян", threatType: "Мұрағат бомбасы", displayName: "Кішкентай мұрағат", claimedSender: "Мұрағатшы", claimedSeal: "Мұрағат мөрі", claimedWeight: "4 КБ", actualSender: "archive@royal.gov (СӘЙКЕС)", actualRoute: "https://royal.gov/archive", actualSeal: "Мөр (СӘЙКЕС)", actualWeight: "4.5 Петабайт (КРИТИКАЛЫҚ САЛМАҚ)", trueExtension: "History.zip", description: "Мұрағат бомбасы патшалық жадын жою үшін жасалған.", realWorld: "«Мұрағат бомбасы» — ашылған кезде бүкіл қатты дискіні толтырып, жүйені бұзатын бірнеше килобайттық файл." },
        social_urgency: { category: "Жарлық", threatType: "Әлеуметтік инженерия", displayName: "Дүрбелеңдегі генерал", claimedSender: "Бас қолбасшы", claimedSeal: "Әскери белгі", claimedWeight: "5 КБ", actualSender: "impostor@freemail.biz (СӘЙКЕС ЕМЕС)", actualRoute: "http://freemail.biz/urgent", actualSeal: "Жоқ", description: "Алаяқ қорғанысты айналып өту үшін жалған шұғылдық тудырды.", realWorld: "BEC шабуылы: хакер бастығыңыздың немесе CEO-ның атынан жазып, шұғыл ақша аударуды талап етеді." },
        social_baiting: { category: "Жарлық", threatType: "Әлеуметтік инженерия", displayName: "Лотерея жаршысы", claimedSender: "Әл-ауқат комитеті", claimedSeal: "Алтын мөрқалып", claimedWeight: "10 КБ", actualSender: "scam-rewards.net (СӘЙКЕС ЕМЕС)", actualRoute: "http://scam-rewards.net/claim", actualSeal: "Жалған мөр", description: "Еліктіру жалған сыйлық ұсынып, ашкөздікті пайдаланады.", realWorld: "Еліктіру (Baiting) тегін фильмдер немесе смартфон ұтып алуды уәде етеді. Өмірде бұл тұраққа тасталған вирусты флешка болуы мүмкін." },
        fake_update_plugin: { category: "Мимик", threatType: "Жалған жаңарту", displayName: "Қақпа инспекторы", claimedSender: "Корольдік инженерлер", claimedSeal: "Балға мөрі", claimedWeight: "15 МБ", actualSender: "hackers-depot.com (СӘЙКЕС ЕМЕС)", actualRoute: "http://hackers-depot.com", actualSeal: "Жоқ", description: "Инспектор қақпаға шұғыл патч қажет екенін айтты.", realWorld: "Сайттағы қалқымалы терезе Flash Player немесе браузер ескіргенін хабарлайды. «Жаңарту» батырмасы вирусты жүктейді." },
        fake_update_scareware: { category: "Мимик", threatType: "Жалған дабыл", displayName: "Ақылсыз экзорцист", claimedSender: "Қауіпсіздік қызметі", claimedSeal: "Қалқан мөрі", claimedWeight: "2 МБ", actualSender: "scareware-alerts.biz (СӘЙКЕС ЕМЕС)", actualRoute: "http://scareware-alerts.biz", actualSeal: "Жоқ", description: "Шабуылшы қамалдың зақымдалғанына сендіріп, алдап соқты.", realWorld: "Scareware: веб-бет экранды қызыл фонмен бұғаттап, ақша бопсалау үшін «Сізде 100 вирус бар! Техқолдауға хабарласыңыз» деп жазады." },
        safe_taxes: { category: "Саудагер", threatType: "Қауіпсіз", displayName: "Салық арбасы", claimedSender: "Салық министрлігі", claimedSeal: "Корольдік мөр", claimedWeight: "120 КБ", actualSender: "Салық министрлігі (СӘЙКЕС)", actualRoute: "https://taxes.royal.gov (ҚАУІПСІЗ)", actualSeal: "Корольдік мөр (СӘЙКЕС)", trueExtension: "Taxes.xlsx", description: "Қауіпсіз және түпнұсқа салық декларациясы." },
        safe_supplies: { category: "Саудагер", threatType: "Қауіпсіз", displayName: "Фермерлер керек-жарағы", claimedSender: "Фермерлер гильдиясы", claimedSeal: "Фермерлер мөрі", claimedWeight: "80 КБ", actualSender: "Фермерлер гильдиясы (СӘЙКЕС)", actualRoute: "https://farms.royal.gov (ҚАУІПСІЗ)", actualSeal: "Фермерлер мөрі (СӘЙКЕС)", trueExtension: "List.pdf", description: "Ауылшаруашылық керек-жарақтары бар нағыз арба." },
        safe_diplomat: { category: "Шабарман", threatType: "Қауіпсіз", displayName: "Дипломатиялық көгершін", claimedSender: "Одақтастар Корольдігі", claimedSeal: "Одақтастар елтаңбасы", claimedWeight: "15 КБ", actualSender: "Одақтастар Корольдігі (СӘЙКЕС)", actualRoute: "https://allies.gov (ҚАУІПСІЗ)", actualSeal: "Одақтастар елтаңбасы (СӘЙКЕС)", trueExtension: "Treaty.docx", description: "Одақтастардан келген ресми дипломатиялық құжат." },
        safe_internal: { category: "Жарлық", threatType: "Қауіпсіз", displayName: "Күзет салт аттысы", claimedSender: "Күзет бастығы", claimedSeal: "Күзет белгісі", claimedWeight: "5 КБ", actualSender: "Күзет бастығы (СӘЙКЕС)", actualRoute: "https://guards.royal.gov (ҚАУІПСІЗ)", actualSeal: "Күзет белгісі (СӘЙКЕС)", trueExtension: "Report.txt", description: "Таңғы патрульдеу туралы ішкі есеп." }
    }
};

const CARAVAN_SCENARIOS = [
    { id: "phish_typo", type: "pigeon", category: "Royal Messenger", threatType: "Phishing Attack", isMalware: true, displayName: "Urgent Treasury Scroll", claimedSender: "Royal Treasury", claimedRoute: "treasury@royal.gov", claimedSeal: "Royal Crest", claimedWeight: "15 KB", actualSender: "treasury@roya1.gov (MISMATCH)", actualRoute: "http://roya1.gov/login (EXTERNAL)", actualSeal: "Forged Wax (FAKE)", actualWeight: "15 KB", description: "The sender domain contained a subtle typo (roya1 instead of royal).", realWorld: "Typo-squatting: Attackers register domains like 'paypa1.com' or 'g00gle.com' to steal your passwords." },
    { id: "phish_subdomain", type: "wagon", category: "Foreign Merchant", threatType: "Phishing Attack", isMalware: true, displayName: "Secure Login Cart", claimedSender: "Castle Security", claimedRoute: "https://login.royal.gov", claimedSeal: "Security Mark", claimedWeight: "2 MB", actualSender: "royal.gov.security-check.com (MISMATCH)", actualRoute: "https://royal.gov.security-check.com (EXTERNAL)", actualSeal: "Valid Cert for security-check.com", actualWeight: "2 MB", description: "The sender used a deceptive subdomain to look official.", realWorld: "Subdomain spoofing: 'apple.com.security-check.net' belongs to 'security-check.net'. Look at the very end of the domain." },
    { id: "trojan_pdf_exe", type: "trojan", category: "Trojan Horse", threatType: "Trojan", isMalware: true, displayName: "Financial Ledger", claimedSender: "Royal Accountant", claimedRoute: "accountant@royal.gov", claimedSeal: "Accounting Seal", claimedWeight: "3.5 MB", actualSender: "accountant@royal.gov (MATCH)", actualRoute: "https://royal.gov/ledger (VALID)", actualSeal: "Accounting Seal (MATCH)", actualWeight: "3.5 MB", trueExtension: "Ledger2026.pdf.exe", description: "The file pretended to be a PDF, but was an executable virus.", realWorld: "Windows hides known file extensions. 'Report.pdf.exe' shows up as 'Report.pdf'. Always enable 'Show File Extensions'!" },
    { id: "trojan_vbs", type: "trojan", category: "Trojan Horse", threatType: "Trojan Script", isMalware: true, displayName: "Guild Member List", claimedSender: "Blacksmith Guild", claimedRoute: "blacksmiths@royal.gov", claimedSeal: "Guild Stamp", claimedWeight: "50 KB", actualSender: "blacksmiths@royal.gov (MATCH)", actualRoute: "https://royal.gov/guilds (VALID)", actualSeal: "Guild Stamp (MATCH)", actualWeight: "50 KB", trueExtension: "Members.xlsx.vbs", description: "The spreadsheet was actually a malicious VBScript.", realWorld: "Scripts (.vbs, .bat) are often disguised as documents. When double-clicked, they quietly download ransomware in the background." },
    { id: "mitm_http", type: "pigeon", category: "Royal Messenger", threatType: "Man-in-the-Middle", isMalware: true, displayName: "Unencrypted Pigeon", claimedSender: "Border Outpost", claimedRoute: "https://outpost.royal.gov", claimedSeal: "Outpost Badge", claimedWeight: "12 KB", actualSender: "outpost@royal.gov (MATCH)", actualRoute: "http://outpost.royal.gov (UNENCRYPTED)", actualSeal: "No Encryption (UNSECURED)", actualWeight: "12 KB", description: "The message was sent without encryption, allowing spies to read it.", realWorld: "HTTP (without 's') sends data in plain text. On public Wi-Fi, hackers can intercept your passwords and messages." },
    { id: "mitm_cert", type: "wagon", category: "Foreign Merchant", threatType: "Man-in-the-Middle", isMalware: true, displayName: "Allied Kingdom Supplies", claimedSender: "King of the North", claimedRoute: "https://north-kingdom.gov", claimedSeal: "Northern Crest", claimedWeight: "500 MB", actualSender: "north-kingdom.gov (MATCH)", actualRoute: "https://north-kingdom.gov (INTERCEPTED)", actualSeal: "Invalid / Self-Signed Cert (WARNING)", actualWeight: "500 MB", description: "The digital seal (certificate) was invalid, indicating an imposter.", realWorld: "Even with HTTPS, if your browser warns about an 'Invalid Certificate', a hacker might be intercepting your secure connection." },
    { id: "zip_bomb", type: "trojan", category: "Trojan Horse", threatType: "Zip Bomb Attack", isMalware: true, displayName: "Tiny Archive Crate", claimedSender: "Royal Archivist", claimedRoute: "archive@royal.gov", claimedSeal: "Archive Seal", claimedWeight: "4 KB", actualSender: "archive@royal.gov (MATCH)", actualRoute: "https://royal.gov/archive (VALID)", actualSeal: "Archive Seal (MATCH)", actualWeight: "4.5 PetaBytes (CRITICAL MASS!)", trueExtension: "History.zip", description: "A tiny zip file designed to explode and crash the kingdom's memory.", realWorld: "A 'Zip Bomb' is a highly compressed file (e.g., 4KB) that extracts into Petabytes of garbage data, instantly crashing antivirus software and hard drives." },
    { id: "social_urgency", type: "rider", category: "Urgent Decree", threatType: "Social Engineering", isMalware: true, displayName: "Panicking General", claimedSender: "General Commander", claimedRoute: "commander@royal.gov", claimedSeal: "Military Badge", claimedWeight: "5 KB", actualSender: "impostor@freemail.biz (MISMATCH)", actualRoute: "http://freemail.biz/urgent (EXTERNAL)", actualSeal: "None (MISSING)", actualWeight: "5 KB", description: "An impostor created fake urgency to bypass security protocols.", realWorld: "Business Email Compromise (BEC): Attackers pretend to be your boss or CEO, demanding urgent money transfers so you panic and skip verification." },
    { id: "social_baiting", type: "rider", category: "Urgent Decree", threatType: "Social Engineering", isMalware: true, displayName: "Lottery Herald", claimedSender: "Royal Welfare Board", claimedRoute: "welfare@royal.gov", claimedSeal: "Gold Stamp", claimedWeight: "10 KB", actualSender: "scam-rewards.net (MISMATCH)", actualRoute: "http://scam-rewards.net/claim (UNSECURED)", actualSeal: "Forged Wax (FAKE)", actualWeight: "10 KB", description: "Baiting relies on greed, offering fake rewards to steal data.", realWorld: "Baiting uses greed: 'You won an iPhone!' or free movie downloads. In physical form, it's dropping an infected USB drive in a parking lot." },
    { id: "fake_update_plugin", type: "mimic", category: "The Mimic", threatType: "Fake Browser Update", isMalware: true, displayName: "Gate Inspector", claimedSender: "Royal Engineering", claimedRoute: "engineers.royal.gov", claimedSeal: "Hammer Seal", claimedWeight: "15 MB", actualSender: "hackers-depot.com (MISMATCH)", actualRoute: "http://hackers-depot.com/patch.exe (EXTERNAL)", actualSeal: "Unsigned (MISSING)", actualWeight: "15 MB", description: "The 'inspector' claimed your gate needed a critical software patch.", realWorld: "You visit a site and a pop-up says 'Your Flash Player/Chrome is outdated.' Clicking 'Update' downloads a virus instead of a patch." },
    { id: "fake_update_scareware", type: "mimic", category: "The Mimic", threatType: "Tech Support Scam", isMalware: true, displayName: "Frantic Exorcist", claimedSender: "Realm Security", claimedRoute: "security.royal.gov", claimedSeal: "Shield Seal", claimedWeight: "2 MB", actualSender: "scareware-alerts.biz (MISMATCH)", actualRoute: "http://scareware-alerts.biz/cleaner (EXTERNAL)", actualSeal: "None (MISSING)", actualWeight: "2 MB", description: "Scareware tricked you into thinking the castle was already infected.", realWorld: "Scareware: A webpage locks your screen, flashes red, and claims '100 Viruses Found! Call Microsoft Support!' to extort money from you." },
    { id: "safe_taxes", type: "wagon", category: "Foreign Merchant", threatType: "Safe", isMalware: false, displayName: "Tax Collection Cart", claimedSender: "Tax Ministry", claimedRoute: "https://taxes.royal.gov", claimedSeal: "Valid Royal Seal", claimedWeight: "120 KB", actualSender: "Tax Ministry (MATCH)", actualRoute: "https://taxes.royal.gov (SECURE)", actualSeal: "Valid Royal Seal (MATCH)", actualWeight: "120 KB", trueExtension: "Taxes.xlsx", description: "A secure, valid tax delivery." },
    { id: "safe_supplies", type: "wagon", category: "Foreign Merchant", threatType: "Safe", isMalware: false, displayName: "Farmer Supplies", claimedSender: "Farming Guild", claimedRoute: "https://farms.royal.gov", claimedSeal: "Farming Seal", claimedWeight: "80 KB", actualSender: "Farming Guild (MATCH)", actualRoute: "https://farms.royal.gov (SECURE)", actualSeal: "Farming Seal (MATCH)", actualWeight: "80 KB", trueExtension: "List.pdf", description: "A valid agricultural supply delivery." },
    { id: "safe_diplomat", type: "pigeon", category: "Royal Messenger", threatType: "Safe", isMalware: false, displayName: "Diplomatic Pigeon", claimedSender: "Allied Kingdom", claimedRoute: "https://allies.gov", claimedSeal: "Allied Crest", claimedWeight: "15 KB", actualSender: "Allied Kingdom (MATCH)", actualRoute: "https://allies.gov (SECURE)", actualSeal: "Allied Crest (MATCH)", actualWeight: "15 KB", trueExtension: "Treaty.docx", description: "Official diplomatic documents from allies." },
    { id: "safe_internal", type: "rider", category: "Urgent Decree", threatType: "Safe", isMalware: false, displayName: "Guard Rider", claimedSender: "Guard Captain", claimedRoute: "https://guards.royal.gov", claimedSeal: "Guard Badge", claimedWeight: "5 KB", actualSender: "Guard Captain (MATCH)", actualRoute: "https://guards.royal.gov (SECURE)", actualSeal: "Guard Badge (MATCH)", actualWeight: "5 KB", trueExtension: "Report.txt", description: "Internal security report from morning patrols." }
];

const REPORT_THREAT_OPTIONS = [
    { text: "Phishing / Domain Spoofing", id: "phish" }, { text: "Double Extension Trojan", id: "trojan" },
    { text: "Zip Bomb Payload", id: "zip_bomb" }, { text: "Social Engineering / Baiting", id: "social" },
    { text: "Unencrypted Protocol (MITM)", id: "mitm" }, { text: "Fake Update / Patch", id: "fake_update" }
];

function getThreatName(id, lang) {
    if (lang === 'ru') {
        if (id === "phish") return "Фишинг / Подмена домена"; if (id === "trojan") return "Троян (Двойное расширение)";
        if (id === "zip_bomb") return "Архивная бомба"; if (id === "social") return "Социальная инженерия";
        if (id === "mitm") return "Незашифрованный протокол"; if (id === "fake_update") return "Фальшивое обновление";
    } else if (lang === 'kk') {
        if (id === "phish") return "Фишинг / Доменді ауыстыру"; if (id === "trojan") return "Троян (Қос кеңейтім)";
        if (id === "zip_bomb") return "Мұрағат бомбасы"; if (id === "social") return "Әлеуметтік инженерия";
        if (id === "mitm") return "Шифрланбаған хаттама"; if (id === "fake_update") return "Жалған жаңарту";
    }
    if (id === "phish") return "Phishing / Domain Spoofing"; if (id === "trojan") return "Double Extension Trojan";
    if (id === "zip_bomb") return "Zip Bomb Payload"; if (id === "social") return "Social Engineering / Baiting";
    if (id === "mitm") return "Unencrypted Protocol (MITM)"; if (id === "fake_update") return "Fake Update / Patch";
    return id;
}

function getLocalizedScenarioField(scenario, field) {
    if (currentLang === 'ru' && SCENARIO_TRANSLATIONS.ru[scenario.id] && SCENARIO_TRANSLATIONS.ru[scenario.id][field] !== undefined) return SCENARIO_TRANSLATIONS.ru[scenario.id][field];
    if (currentLang === 'kk' && SCENARIO_TRANSLATIONS.kk[scenario.id] && SCENARIO_TRANSLATIONS.kk[scenario.id][field] !== undefined) return SCENARIO_TRANSLATIONS.kk[scenario.id][field];
    return scenario[field];
}

function mapScenarioToThreatType(scenario) {
    if (!scenario.isMalware) return "safe";
    const tt = scenario.threatType.toLowerCase();
    if (tt.includes("phish") || tt.includes("spoof")) return "phish";
    if (tt.includes("extension") || tt.includes("trojan")) return "trojan";
    if (tt.includes("zip bomb")) return "zip_bomb";
    if (tt.includes("ransomware") || tt.includes("impersonation") || tt.includes("baiting") || tt.includes("social")) return "social";
    if (tt.includes("middle") || tt.includes("unencrypted") || tt.includes("cert")) return "mitm";
    if (tt.includes("fake") || tt.includes("browser") || tt.includes("tech")) return "fake_update";
    return "unknown";
}

function setLanguage(lang) {
    if (!UI_TRANSLATIONS[lang]) return;
    currentLang = lang; localStorage.setItem('vigilant_sov_lang', lang);
    document.title = lang === 'ru' ? "Бдительный Суверен: Царство Киберзащиты" : lang === 'kk' ? "Сақ Әмірші: Киберқорғаныс Әлемі" : "The Vigilant Sovereign: Cyber-Defense Realm";

    const t = UI_TRANSLATIONS[lang];
    const safeSetText = (id, text) => { const el = document.getElementById(id); if (el && text) el.textContent = text; };
    const safeSetHTML = (id, html) => { const el = document.getElementById(id); if (el && html) el.innerHTML = html; };

    safeSetText("langToggleBtn", lang.toUpperCase());
    safeSetText("themeToggleBtn", lang === 'ru' ? "НЕОНОВЫЙ МИР" : lang === 'kk' ? "НЕОНДЫ ӘЛЕМ" : "NEON REALM");
    safeSetText("marqueeTitle1", t.title1); safeSetText("marqueeTitle2", t.title2); safeSetText("marqueeSubtitle", t.subtitle);
    safeSetText("hudShieldLabel", t.shieldLabel); safeSetText("wisdomLabel", t.wisdomLabel); safeSetText("economyLabel", t.economyLabel); safeSetText("hudLevelLabel", t.levelLabel);
    
    if(typeof currentLevel !== 'undefined') safeSetText("levelVal", `${t.levelText} ${currentLevel}`);

    const threatInd = document.getElementById("threatIndicator");
    if (threatInd) {
        if (threatInd.textContent.includes("SECURE") || threatInd.textContent.includes("НАДЁЖНО") || threatInd.textContent.includes("СЕНІМДІ")) threatInd.textContent = t.secureStatus;
        else threatInd.textContent = t.congestionStatus;
    }

    safeSetText("intrusionAlertTitle", t.intrusionAlertTitle);
    const alertMsg = document.getElementById("alertMessage");
    if (alertMsg && alertMsg.textContent.includes("MALWARE DETECTED")) alertMsg.textContent = t.malwareDetected;

    safeSetText("introTitle", t.introTitle);
    if(t.introText) safeSetHTML("introText", t.introText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'));
    safeSetText("startBtn", t.bootProtocols);
    safeSetText("labelSender", t.senderLabel); safeSetText("labelRoute", t.routeLabel); safeSetText("labelSeal", t.sealLabel); safeSetText("labelWeight", t.weightLabel);
    safeSetText("labelLens", t.realSourceLabel); safeSetText("labelScale", t.realSizeLabel); safeSetText("labelCrypto", t.sigIntegrityLabel);

    ["lensValue", "scaleValue", "cryptoValue"].forEach(id => {
        const el = document.getElementById(id);
        if (el && (el.textContent === "Unresolved" || el.textContent === "Не определено" || el.textContent === "Анықталмаған")) el.textContent = t.unresolved;
    });

    safeSetText("titleTools", t.toolsTitle); safeSetText("nameLens", t.toolLens); safeSetText("nameScale", t.toolScale); safeSetText("nameCrypto", t.toolCrypto); safeSetText("nameCage", t.toolCage);
    safeSetText("titleDecision", t.decisionTitle); safeSetText("btnAllow", t.btnAllow); safeSetText("btnVerify", t.btnVerify); safeSetText("btnArrest", t.btnArrest); safeSetText("btnBurn", t.btnBurn);
    safeSetText("threatModalTitle", t.modalTitle); safeSetText("threatModalDesc", t.modalDesc);
    
    const nextBtn = document.getElementById("nextBtn"); if(nextBtn && nextBtn.textContent) nextBtn.textContent = t.continueDuty;
    safeSetText("retryBtn", t.rebootRetry); safeSetText("victoryTitle", t.victoryTitle); safeSetText("victoryText", t.victoryText); safeSetText("restartBtn", t.restartBtn);
    safeSetText("labelSound", t.soundLabel); safeSetText("labelTheme", t.themeLabel); safeSetText("labelLang", t.langLabel); safeSetText("labelGuards", t.guardsLabel);

    if (typeof currentLevelData !== 'undefined' && currentLevelData[queueIndex]) {
        const scenario = currentLevelData[queueIndex];
        const cTitle = document.getElementById("caravanTitle");
        if (cTitle) {
            if (cTitle.textContent.startsWith("Caravan") || cTitle.textContent.startsWith("Профиль") || cTitle.textContent.startsWith("Керуен")) cTitle.textContent = lang === 'ru' ? `Профиль #${queueIndex + 1}` : lang === 'kk' ? `Керуен #${queueIndex + 1}` : `Profile #${queueIndex + 1}`;
            else if (cTitle.textContent.includes("Active") || cTitle.textContent.includes("анализ")) cTitle.textContent = t.sandboxActive;
            else if (cTitle.textContent.includes("MALWARE") || cTitle.textContent.includes("ЗИЯНДЫ") || cTitle.textContent.includes("ВРЕДОНОСНОЕ")) cTitle.textContent = t.sandboxMalware;
            else if (cTitle.textContent.includes("CLEAN") || cTitle.textContent.includes("ҚАУІП") || cTitle.textContent.includes("УГРОЗ")) cTitle.textContent = t.sandboxClean;
            else cTitle.textContent = t.inspectedProfile;
        }
        safeSetText("caravanType", getLocalizedScenarioField(scenario, "category")); safeSetText("profileSender", getLocalizedScenarioField(scenario, "claimedSender")); safeSetText("profileRoute", getLocalizedScenarioField(scenario, "claimedRoute")); safeSetText("profileSeal", getLocalizedScenarioField(scenario, "claimedSeal")); safeSetText("profileWeight", getLocalizedScenarioField(scenario, "claimedWeight"));

        const lVal = document.getElementById("lensValue"); if (lVal && lVal.textContent !== t.unresolved) lVal.textContent = getLocalizedScenarioField(scenario, "actualSender");
        const sVal = document.getElementById("scaleValue");
        if (sVal && sVal.textContent !== t.unresolved) {
            let actWt = getLocalizedScenarioField(scenario, "actualWeight"), tExt = getLocalizedScenarioField(scenario, "trueExtension");
            if(typeof isSandboxed !== 'undefined' && isSandboxed) { sVal.textContent = t.trueSize + " " + actWt; }
            else { sVal.textContent = actWt + (tExt ? ` | Ext: ${tExt}` : ""); }
        }
        const cVal = document.getElementById("cryptoValue"); if (cVal && cVal.textContent !== t.unresolved) cVal.textContent = getLocalizedScenarioField(scenario, "actualSeal");
    }

    if (typeof currentScene !== 'undefined' && currentScene) {
        if (currentScene.textSign) currentScene.textSign.setText(t.firewallGateSign);
        if (currentScene.fireText) currentScene.fireText.setText(t.incineratorSign);
    }

    safeSetText("tutorialTitle", t.tutorialTitle); safeSetText("tutorialSubtitle", t.tutorialSubtitle);
    safeSetHTML("tutStep1Title", t.tutStep1Title); safeSetHTML("tutStep1Desc", t.tutStep1Desc);
    safeSetHTML("tutStep2Title", t.tutStep2Title); safeSetHTML("tutStep2Desc", t.tutStep2Desc);
    safeSetHTML("tutStep3Title", t.tutStep3Title); safeSetHTML("tutStep3Desc", t.tutStep3Desc);
    safeSetHTML("tutStep4Title", t.tutStep4Title); safeSetHTML("tutStep4Desc", t.tutStep4Desc);

    safeSetText("tutToolsTitle", t.tutToolsTitle);
    safeSetText("tutGuideNameLens", t.toolLens); safeSetText("tutGuideDescLens", t.tutGuideDescLens);
    safeSetText("tutGuideNameScale", t.toolScale); safeSetText("tutGuideDescScale", t.tutGuideDescScale);
    safeSetText("tutGuideNameCrypto", t.toolCrypto); safeSetText("tutGuideDescCrypto", t.tutGuideDescCrypto);
    safeSetText("tutGuideNameCage", t.toolCage); safeSetText("tutGuideDescCage", t.tutGuideDescCage);

    safeSetText("tutThreatsTitle", t.tutThreatsTitle);
    safeSetText("tutThreatName1", t.tutThreatName1); safeSetText("tutThreatDesc1", t.tutThreatDesc1);
    safeSetText("tutThreatName2", t.tutThreatName2); safeSetText("tutThreatDesc2", t.tutThreatDesc2);
    safeSetText("tutThreatName3", t.tutThreatName3); safeSetText("tutThreatDesc3", t.tutThreatDesc3);
    safeSetText("tutThreatName4", t.tutThreatName4); safeSetText("tutThreatDesc4", t.tutThreatDesc4);
    safeSetText("tutThreatName5", t.tutThreatName5); safeSetText("tutThreatDesc5", t.tutThreatDesc5);
    safeSetText("tutThreatName6", t.tutThreatName6); safeSetText("tutThreatDesc6", t.tutThreatDesc6);

    safeSetText("tutDecisionsTitle", t.tutDecisionsTitle);
    safeSetText("tutGuideAllowLabel", t.tutGuideAllowLabel); safeSetText("tutGuideAllowText", t.tutGuideAllowText);
    safeSetText("tutGuideVerifyLabel", t.tutGuideVerifyLabel); safeSetText("tutGuideVerifyText", t.tutGuideVerifyText);
    safeSetText("tutGuideDenyLabel", t.tutGuideDenyLabel); safeSetText("tutGuideDenyText", t.tutGuideDenyText);
    safeSetText("tutGuideBurnLabel", t.tutGuideBurnLabel); safeSetText("tutGuideBurnText", t.tutGuideBurnText);
    
    safeSetText("tutorialCloseBtn", t.tutorialCloseBtn); safeSetText("progressLabel", t.progressLabel); safeSetText("keyTipsText", t.keyTipsText);

    safeSetHTML("tooltipAllow", `<span class="tip-hint">${t.tooltipAllowHint}</span>${t.tooltipAllow}`); safeSetHTML("tooltipVerify", `<span class="tip-hint">${t.tooltipVerifyHint}</span>${t.tooltipVerify}`); safeSetHTML("tooltipArrest", `<span class="tip-hint">${t.tooltipArrestHint}</span>${t.tooltipArrest}`); safeSetHTML("tooltipBurn", `<span class="tip-hint">${t.tooltipBurnHint}</span>${t.tooltipBurn}`);
}

let gameInstance = null, currentScene = null;

function createPixelTexture(scene, key, pixelData, palette, scale = 2) {
    const rows = pixelData.length, cols = pixelData[0].length;
    const canvas = scene.textures.createCanvas(key, cols * scale, rows * scale);
    const ctx = canvas.context;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const color = palette[pixelData[r][c]];
            if (color) { ctx.fillStyle = color; ctx.fillRect(c * scale, r * scale, scale, scale); }
        }
    }
    canvas.refresh();
}

function preload() {
    currentScene = this;
    const PIGEON_PALETTE = { '.': null, 'W': '#ffffff', 'G': '#708090', 'O': '#ffa500', 'E': '#ff0000' };
    createPixelTexture(this, 'pigeon1', ["....WWWW....","...WWWWWW...","..WWEWWWW...","..WWOWWWW...","...WWWWWW...","WWWWWWWWWWWW",".WWWWWWWWWW.","..WWWWWWWW..","...WWWWWW...","....O..O...."], PIGEON_PALETTE, 2);
    createPixelTexture(this, 'pigeon2', ["....WWWW....","...WWWWWW...","..WWEWWWW...","..WWOWWWW...",".WWWWWWWWWW.","WW.WWWWWW.WW","W..WWWWWW..W","...WWWWWW...","....WWWW....","....O..O...."], PIGEON_PALETTE, 2);
    createPixelTexture(this, 'wagon', ["......CCCCCCCCCC........","....CCCCCCCCCCCCCC......","...CCCCCCCCCCCCCCCC.....","...DDDDDDDDDDDDDDDD.....","..DDWWWWWWWWWWWWDDDD....","..DDDDDDDDDDDDDDDDDD..HH","...I..I......I..I...HHHH","..IIIIII....IIIIII..H..H","...I..I......I..I...H..H"], { '.': null, 'W': '#d2b48c', 'D': '#8b5a2b', 'C': '#f5f5dc', 'I': '#4d4d4d', 'H': '#a0522d' }, 2);
    createPixelTexture(this, 'rider', ["......RRRR......",".....RSSSP......","....RRSSSSS.....",".....RSSSSD.....","....DHHHHHHD....","...DDDDDDDDDD...","...HHHHHHHHHH...","...H..H..H..H...","...D..D..D..D..."], { '.': null, 'H': '#8b5a2b', 'D': '#5c4033', 'S': '#c0c0c0', 'R': '#ff0000', 'P': '#fcd2b2', 'K': '#000000' }, 2);
    createPixelTexture(this, 'trojan', ["....DDDDDDDDDDDDDD......","...DBBBBBBBBBBBBBBD.....","..DBBBDDDDDDDBBBDD......","..DBBBDTTTTTDBBBDD......","..DBBBDTTTTTDBBBDD......","..DBBBDBBBBBDBBBDD..HHHH","..DCCCCCCCCCCCCCCD..HHHH","...I..I......I..I...H..H","..IIIIII....IIIIII..H..H"], { '.': null, 'B': '#8b5a2b', 'D': '#5c4033', 'I': '#4a4a4a', 'T': '#000000', 'C': '#cccccc', 'H': '#a0522d' }, 2);
    createPixelTexture(this, 'mimic', ["....KKKK....","...KHHHHK...","...KSSSSK...","....KSSK....","...KCCCCK...","..KCCCCCCK..","..KCPPPPCK..","...KCCCCK...","....KBKB...."], { '.': null, 'S': '#fcd2b2', 'H': '#ffd700', 'C': '#008080', 'B': '#8b5a2b', 'P': '#ffffff', 'K': '#000000' }, 2);
    createPixelTexture(this, 'guard', ["....RRRR....","...RSSSR...","...RSSSR...","...RSPBR...","...SSSSS...","..SGSSGS..","..SGGSSG..","...SSSSS...","....B..B...."], { '.': null, 'S': '#c0c0c0', 'G': '#ffd700', 'R': '#ff0000', 'B': '#000000', 'P': '#fcd2b2' }, 2);
    createPixelTexture(this, 'king', ["......KK......",".....KCPK.....","....CCCCSS....","....CSSSSS....","...CSSSSSHHH..","..HHHHHHHHHHH.","..HHHHHHHHHH..","..H..H...H..H.","..H..H...H..H."], { '.': null, 'H': '#8b5a2b', 'K': '#ffd700', 'C': '#bc13fe', 'S': '#c0c0c0', 'P': '#fcd2b2' }, 2);
    createPixelTexture(this, 'cage', ["GGGGSSSSSSGGGG","G..S.C.C.S..G.","S..S.C.C.S..S.","S..SCCSSCS..S.","S..S.C.C.S..S.","S..S.C.C.S..S.","GGGGSSSSSSGGGG"], { '.': null, 'S': '#708090', 'C': '#00f3ff', 'G': '#2c3154' }, 4);
    createPixelTexture(this, 'spark', [".Y.","YOY","ROR","YOY",".Y."], { 'Y': '#ffcc00', 'O': '#ff5500', 'R': '#ff0000' }, 1);
}

function create() {
    let sky = this.add.graphics(); sky.fillGradientStyle(0x0a0f26, 0x0a0f26, 0x16132d, 0x16132d, 1); sky.fillRect(0, 0, 800, 200);
    let bgTrees = this.add.graphics(); bgTrees.fillStyle(0x0e1124, 0.7);
    bgTrees.fillTriangle(50,200,120,80,190,200); bgTrees.fillTriangle(150,200,250,50,350,200); bgTrees.fillTriangle(280,200,340,100,400,200); bgTrees.fillTriangle(480,200,550,80,620,200); bgTrees.fillTriangle(600,200,700,60,800,200);
    let river = this.add.graphics(); river.fillStyle(0x080914, 1); river.fillRect(0, 200, 800, 120);
    river.lineStyle(1, 0x00f3ff, 0.08); for (let y = 200; y < 320; y += 10) river.lineBetween(0, y, 800, y);
    let path = this.add.graphics(); path.fillStyle(0x2d2319, 1); path.fillRect(0, 170, 800, 35); path.fillStyle(0x181410, 1); path.fillRect(0, 205, 800, 4);

    let wall = this.add.graphics(); wall.fillStyle(0x3c4260, 1); wall.fillRect(410, 20, 45, 185); wall.lineStyle(2, 0x1d2135, 1);
    for (let y = 20; y < 200; y += 15) wall.lineBetween(410, y, 455, y);
    for (let y = 20; y < 200; y += 30) { wall.lineBetween(425, y, 425, y + 15); wall.lineBetween(440, y + 15, 440, y + 30); }

    let wallSign = this.add.graphics(); wallSign.fillStyle(0x1b1c2b, 0.9); wallSign.lineStyle(2, 0x00f3ff, 1); wallSign.strokeRect(360, 10, 145, 24); wallSign.fillRect(360, 10, 145, 24);
    this.textSign = this.add.text(372, 16, UI_TRANSLATIONS[currentLang].firewallGateSign, { fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: '#00f3ff' }); this.textSign.setShadow(0, 0, '#00f3ff', 3);

    this.portcullis = this.add.graphics(); this.portcullis.lineStyle(3, 0x1f2438, 1); this.portcullis.fillStyle(0x1f2438, 0.8); this.portcullis.strokeRect(415, 110, 35, 95);
    for (let gy = 110; gy <= 205; gy += 16) this.portcullis.lineBetween(415, gy, 450, gy);
    for (let gx = 422; gx <= 445; gx += 8) this.portcullis.lineBetween(gx, 110, gx, 205);

    this.kingObj = this.add.sprite(520, 178, 'king'); this.kingObj.setScale(1.5);
    this.guardObj = this.add.sprite(470, 182, 'guard'); this.guardObj.setScale(1.4);

    let castle = this.add.graphics(); castle.fillStyle(0x282c40, 1); castle.fillRect(620, 40, 80, 160); castle.fillRect(720, 60, 60, 140);
    [620,650,685].forEach(x => castle.fillRect(x, 28, x===650?20:15, 12)); [720,765].forEach(x => castle.fillRect(x, 48, 15, 12));

    this.cageObj = this.add.sprite(300, 85, 'cage'); this.cageObj.setScale(1.2); this.cageObj.setVisible(false);
    this.scanBarBg = this.add.graphics(); this.scanBarBg.fillStyle(0x111322, 1); this.scanBarBg.fillRoundedRect(250, 122, 100, 8, 3); this.scanBarBg.setVisible(false);
    this.scanBarFill = this.add.graphics(); this.scanBarFill.setVisible(false);

    this.fireObj = this.add.graphics(); this.fireObj.fillStyle(0x3c1910, 1); this.fireObj.fillRoundedRect(180, 230, 80, 25, 4); this.fireObj.lineStyle(1, 0xff5500, 0.5); this.fireObj.strokeRoundedRect(180, 230, 80, 25, 4);
    this.fireText = this.add.text(188, 236, UI_TRANSLATIONS[currentLang].incineratorSign, { fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', color: '#ff5500' });

    this.sparkEmitter = this.add.particles(0, 0, 'spark', { speed: { min: -50, max: 50 }, angle: { min: 0, max: 360 }, scale: { start: 1.5, end: 0 }, blendMode: 'ADD', lifespan: 600, emitting: false });
    this.anims.create({ key: 'pigeon_fly', frames: [ { key: 'pigeon1' }, { key: 'pigeon2' } ], frameRate: 4, repeat: -1 });

    this.caravanSprites = []; this.cameras.main.fadeIn(500, 5, 6, 11);
}

function update() {}

const MAX_HEALTH = 5; let health = MAX_HEALTH; let wisdom = 0; let economy = 100; let currentLevel = 1; let currentLevelData = []; let queueIndex = 0;
let currentScenario = null; let inspectedState = { lens: false, scale: false, crypto: false }; let isSandboxed = false; let sandboxProgress = 0; let sandboxTimerObj = null;
let statistics = { phish_resolved: 0, trojan_resolved: 0, zip_bomb_resolved: 0, social_resolved: 0, mitm_resolved: 0, fake_update_resolved: 0, false_alarms: 0, threats_leaked: 0 };

document.addEventListener("DOMContentLoaded", () => {
    const config = { type: Phaser.AUTO, scale: { mode: Phaser.Scale.FIT, parent: 'phaserGame', autoCenter: Phaser.Scale.CENTER_BOTH, width: 800, height: 320 }, backgroundColor: '#07080f', physics: { default: 'arcade' }, scene: { preload: preload, create: create, update: update } };
    gameInstance = new Phaser.Game(config);

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

    const audioBtn = document.getElementById("audioToggleBtn");
    audioBtn.addEventListener("click", () => {
        sfx.enabled = !sfx.enabled;
        audioBtn.textContent = currentLang === 'ru' ? (sfx.enabled ? "ВКЛ" : "ВЫКЛ") : currentLang === 'kk' ? (sfx.enabled ? "ҚОСУЛЫ" : "ӨШІРУЛІ") : (sfx.enabled ? "ON" : "OFF");
        audioBtn.classList.toggle("toggle-active", sfx.enabled);
        sfx.playClick();
    });

    const langBtn = document.getElementById("langToggleBtn");
    if (langBtn) {
        langBtn.addEventListener("click", () => {
            const langs = ['en', 'ru', 'kk']; let idx = langs.indexOf(currentLang);
            setLanguage(langs[(idx + 1) % langs.length]);
            audioBtn.textContent = currentLang === 'ru' ? (sfx.enabled ? "ВКЛ" : "ВЫКЛ") : currentLang === 'kk' ? (sfx.enabled ? "ҚОСУЛЫ" : "ӨШІРУЛІ") : (sfx.enabled ? "ON" : "OFF");
            sfx.playClick();
        });
    }

    const tutClose = document.getElementById("tutorialCloseBtn"), helpBtn = document.getElementById("helpBtn");
    if (tutClose) tutClose.addEventListener("click", () => { sfx.playClick(); document.getElementById("tutorialOverlay").classList.add("hidden"); localStorage.setItem('vigilant_sov_tutorial_seen', 'true'); });
    if (helpBtn) helpBtn.addEventListener("click", () => { sfx.playClick(); document.getElementById("tutorialOverlay").classList.remove("hidden"); });

    setLanguage(currentLang);
    audioBtn.textContent = currentLang === 'ru' ? (sfx.enabled ? "ВКЛ" : "ВЫКЛ") : currentLang === 'kk' ? (sfx.enabled ? "ҚОСУЛЫ" : "ӨШІРУЛІ") : (sfx.enabled ? "ON" : "OFF");
});

function bootGame() {
    sfx.playClick();
    if (!localStorage.getItem('vigilant_sov_tutorial_seen')) document.getElementById("tutorialOverlay").classList.remove("hidden");
    document.getElementById("introScreen").classList.add("hidden"); document.getElementById("auditScreen").classList.remove("hidden");
    loadLevel(1);
}

function loadLevel(lvl) {
    currentLevel = lvl;
    document.getElementById("levelVal").textContent = `${UI_TRANSLATIONS[currentLang].levelText} ${lvl}`;
    document.getElementById("threatIndicator").textContent = UI_TRANSLATIONS[currentLang].secureStatus; document.getElementById("threatIndicator").className = "status-indicator pulse warning";
    
    let pool = [];
    if (lvl === 1) pool = [ "phish_typo", "mitm_http", "safe_taxes", "social_baiting", "safe_supplies" ];
    else if (lvl === 2) pool = [ "trojan_pdf_exe", "phish_subdomain", "zip_bomb", "safe_diplomat", "mitm_cert" ];
    else pool = [ "social_urgency", "fake_update_plugin", "fake_update_scareware", "trojan_vbs", "safe_internal" ];

    currentLevelData = pool.map(id => CARAVAN_SCENARIOS.find(s => s.id === id)).sort(() => Math.random() - 0.5);
    queueIndex = 0; updateProgressBadge();

    if (currentScene) { currentScene.caravanSprites.forEach(s => s.destroy()); currentScene.caravanSprites = []; }
    spawnQueueSprites();
}

function spawnQueueSprites() {
    if (!currentScene) return;
    for (let i = 0; i < currentLevelData.length; i++) {
        const sc = currentLevelData[i];
        let key = sc.type === 'pigeon' ? 'pigeon1' : sc.type === 'rider' ? 'rider' : sc.type === 'trojan' ? 'trojan' : sc.type === 'mimic' ? 'mimic' : 'wagon';
        let spr = currentScene.add.sprite(-100 - (i * 90), 175, key);
        spr.setScale(sc.type === 'pigeon' ? 1.4 : 1.6); spr.setInteractive(); spr.scenarioData = sc; spr.indexInQueue = i;
        if (sc.type === 'pigeon') spr.play('pigeon_fly');
        currentScene.tweens.add({ targets: spr, x: 340 - (i * 90), duration: 1200, ease: 'Power2' });
        currentScene.caravanSprites.push(spr);
    }
    setTimeout(startAuditCurrent, 1300);
}

function startAuditCurrent() {
    if (queueIndex >= currentLevelData.length) return checkLevelCompletion();
    currentScenario = currentLevelData[queueIndex];
    inspectedState = { lens: false, scale: false, crypto: false }; isSandboxed = false; sandboxProgress = 0;

    ['toolLens', 'toolScale', 'toolCrypto', 'toolCage'].forEach(id => { const el = document.getElementById(id); el.className = "tool-btn"; el.disabled = false; });
    const t = UI_TRANSLATIONS[currentLang];
    document.getElementById("caravanTitle").textContent = currentLang === 'ru' ? `Профиль #${queueIndex + 1}` : currentLang === 'kk' ? `Керуен #${queueIndex + 1}` : `Caravan Profile #${queueIndex + 1}`;
    document.getElementById("caravanType").textContent = getLocalizedScenarioField(currentScenario, "category"); document.getElementById("profileSender").textContent = getLocalizedScenarioField(currentScenario, "claimedSender"); document.getElementById("profileRoute").textContent = getLocalizedScenarioField(currentScenario, "claimedRoute"); document.getElementById("profileSeal").textContent = getLocalizedScenarioField(currentScenario, "claimedSeal"); document.getElementById("profileWeight").textContent = getLocalizedScenarioField(currentScenario, "claimedWeight");
    document.getElementById("truthLensReadout").classList.add("hidden"); document.getElementById("magicScaleReadout").classList.add("hidden"); document.getElementById("cryptographerReadout").classList.add("hidden");

    enableActionButtons(true); updateProgressBadge();
    if (currentScene) currentScene.caravanSprites.forEach((s, idx) => { idx === queueIndex ? s.setTint(0x00f3ff) : s.clearTint(); });
    checkQueueCongestion();
}

function checkQueueCongestion() {
    const uCount = currentLevelData.length - queueIndex, t = UI_TRANSLATIONS[currentLang];
    if (uCount >= 3) {
        document.getElementById("threatIndicator").textContent = t.congestionStatus; document.getElementById("threatIndicator").className = "status-indicator pulse text-red";
        economy = Math.max(0, economy - 3); updateHUD();
        if (economy <= 0) triggerGameOver("congestion");
    } else { document.getElementById("threatIndicator").textContent = t.secureStatus; document.getElementById("threatIndicator").className = "status-indicator pulse warning"; }
}

function activateTool(tool) {
    if (isSandboxed) return; sfx.playToolSound();
    const btn = document.getElementById(`tool${tool.charAt(0).toUpperCase() + tool.slice(1)}`);
    btn.classList.add("inspected"); btn.disabled = true;

    if (tool === 'lens') {
        inspectedState.lens = true; document.getElementById("lensValue").textContent = getLocalizedScenarioField(currentScenario, "actualSender"); document.getElementById("truthLensReadout").classList.remove("hidden");
        if (currentScene) { let scan = currentScene.add.graphics(); scan.lineStyle(2, 0x00f3ff, 0.8); scan.strokeCircle(340, 175, 45); currentScene.tweens.add({ targets: scan, alpha: 0, scale: 1.5, duration: 400, onComplete: () => scan.destroy() }); }
    } else if (tool === 'scale') {
        inspectedState.scale = true;
        let actWt = getLocalizedScenarioField(currentScenario, "actualWeight"), tExt = getLocalizedScenarioField(currentScenario, "trueExtension");
        let str = currentLang === 'ru' ? `Реальный вес: ${actWt}` : currentLang === 'kk' ? `Нақты салмағы: ${actWt}` : `True Weight: ${actWt}`;
        if (tExt) str += currentLang === 'ru' ? ` | Расш: ${tExt}` : currentLang === 'kk' ? ` | Кеңейтім: ${tExt}` : ` | Ext: ${tExt}`;
        document.getElementById("scaleValue").textContent = str; document.getElementById("magicScaleReadout").classList.remove("hidden");
        if (currentScene) currentScene.tweens.add({ targets: currentScene.caravanSprites[queueIndex], y: 155, yoyo: true, duration: 200, repeat: 1 });
    } else if (tool === 'crypto') {
        inspectedState.crypto = true; document.getElementById("cryptoValue").textContent = getLocalizedScenarioField(currentScenario, "actualSeal"); document.getElementById("cryptographerReadout").classList.remove("hidden");
        if (currentScene) { let glow = currentScene.add.graphics(); glow.fillStyle(0xffd700, 0.4); glow.fillCircle(340, 160, 20); currentScene.tweens.add({ targets: glow, alpha: 0, duration: 500, onComplete: () => glow.destroy() }); }
    } else if (tool === 'cage') startQuarantineSandbox();
}

function startQuarantineSandbox() {
    isSandboxed = true; enableActionButtons(false); document.getElementById("toolCage").classList.add("active"); document.getElementById("caravanTitle").textContent = UI_TRANSLATIONS[currentLang].sandboxActive;
    if (currentScene) {
        currentScene.cageObj.setVisible(true); currentScene.scanBarBg.setVisible(true); currentScene.scanBarFill.setVisible(true);
        currentScene.tweens.add({ targets: currentScene.caravanSprites[queueIndex], x: 300, y: 85, scale: 1.0, duration: 800, ease: 'Power1', onComplete: () => { sandboxProgress = 0; runSandboxProgress(); } });
    }
}

function runSandboxProgress() {
    if (!currentScene) return;
    sandboxTimerObj = setInterval(() => {
        sandboxProgress += 10; currentScene.scanBarFill.clear(); currentScene.scanBarFill.fillStyle(0x00f3ff, 1); currentScene.scanBarFill.fillRoundedRect(250, 122, sandboxProgress, 8, 3);
        sfx.playClick(); currentScene.sparkEmitter.explode(2, 300, 85);
        if (sandboxProgress >= 100) { clearInterval(sandboxTimerObj); completeSandboxAnalysis(); }
    }, 1000);
}

function completeSandboxAnalysis() {
    isSandboxed = false; enableActionButtons(true);
    const cage = document.getElementById("toolCage"); cage.className = "tool-btn inspected"; cage.disabled = true;
    document.getElementById("caravanTitle").textContent = UI_TRANSLATIONS[currentLang].inspectedProfile;

    if (currentScenario.isMalware) {
        sfx.playExplosion(); document.getElementById("caravanTitle").textContent = UI_TRANSLATIONS[currentLang].sandboxMalware; document.getElementById("caravanTitle").style.color = "var(--color-red)";
        if (currentScene) { currentScene.sparkEmitter.explode(25, 300, 85); currentScene.cageObj.setTint(0xff3c3c); currentScene.scanBarFill.clear(); currentScene.scanBarFill.fillStyle(0xff3c3c, 1); currentScene.scanBarFill.fillRoundedRect(250, 122, 100, 8, 3); }
        activateTool('lens'); activateTool('scale'); activateTool('crypto');
        document.getElementById("scaleValue").textContent = (currentLang === 'ru' ? 'РЕАЛЬНЫЙ РАЗМЕР: ' : currentLang === 'kk' ? 'НАҚТЫ ӨЛШЕМІ: ' : 'TRUE SIZE: ') + getLocalizedScenarioField(currentScenario, "actualWeight");
    } else {
        sfx.playSuccess(); document.getElementById("caravanTitle").textContent = UI_TRANSLATIONS[currentLang].sandboxClean; document.getElementById("caravanTitle").style.color = "var(--color-green)";
        if (currentScene) { currentScene.cageObj.setTint(0x39ff14); currentScene.scanBarFill.clear(); currentScene.scanBarFill.fillStyle(0x39ff14, 1); currentScene.scanBarFill.fillRoundedRect(250, 122, 100, 8, 3); }
    }
}

function handleAllow() {
    if (isSandboxed) return; sfx.playClick(); enableActionButtons(false);
    if (currentScene) {
        currentScene.tweens.add({
            targets: currentScene.portcullis, y: -80, duration: 500, ease: 'Power2',
            onComplete: () => {
                const spr = currentScene.caravanSprites[queueIndex];
                currentScene.tweens.add({ targets: spr, x: [spr.x, 420, 600], y: [spr.y, 175, 175], alpha: { start: 1, end: 0 }, duration: 1500, onComplete: () => {
                    currentScene.tweens.add({ targets: currentScene.portcullis, y: 0, duration: 400, ease: 'Bounce' });
                    resolveAllowOutcome();
                }});
            }
        });
    } else resolveAllowOutcome();
}

function resolveAllowOutcome() {
    cleanupSandboxOverlay();
    if (currentScenario.isMalware) {
        health--; statistics.threats_leaked++; sfx.playExplosion();
        if (currentScene) {
            currentScene.cameras.main.shake(400, 0.02);
            let pfx = currentLang === 'ru' ? 'ОБНАРУЖЕН ПРОРЫВ: ' : currentLang === 'kk' ? 'БҰЗУ АНЫҚТАЛДЫ: ' : 'BREACH DETECTED: ';
            document.getElementById("alertMessage").textContent = `${pfx}${getLocalizedScenarioField(currentScenario, "threatType")}!`;
            document.getElementById("intrusionAlert").classList.remove("hidden"); setTimeout(() => document.getElementById("intrusionAlert").classList.add("hidden"), 3000);
        }
        let fPfx = currentLang === 'ru' ? 'ОБНАРУЖЕНО ЗАРАЖЕНИЕ! ' : currentLang === 'kk' ? 'ЖҰҚПА АНЫҚТАЛДЫ! ' : 'INFECTION DETECTED! ';
        let realWorld = getLocalizedScenarioField(currentScenario, "realWorld");
        let rwText = realWorld ? `<br><br><span style="color:var(--color-cyan);"><b>${UI_TRANSLATIONS[currentLang].realWorldLabel}</b> ${realWorld}</span>` : "";
        showFeedback(false, `${fPfx}${getLocalizedScenarioField(currentScenario, "description")}${rwText}`);
    } else {
        economy = Math.min(100, economy + 5); sfx.playSuccess();
        showFeedback(true, UI_TRANSLATIONS[currentLang].feedbackSafeAccess);
    }
    updateHUD(); checkGameProgress();
}

function handleVerify() { if (!isSandboxed) { sfx.playClick(); startQuarantineSandbox(); } }

function handleArrest() {
    if (isSandboxed) return; sfx.playClick(); enableActionButtons(false);
    if (currentScene) {
        const spr = currentScene.caravanSprites[queueIndex];
        currentScene.tweens.add({
            targets: currentScene.guardObj, x: spr.x + 35, duration: 600, ease: 'Power1', onComplete: () => {
                sfx.playArrest();
                currentScene.tweens.add({ targets: [currentScene.guardObj, spr], y: -50, alpha: 0, duration: 1200, onComplete: () => {
                    currentScene.guardObj.x = 470; currentScene.guardObj.y = 182; currentScene.guardObj.alpha = 1; openThreatSelector();
                }});
            }
        });
    } else openThreatSelector();
}

function openThreatSelector() {
    document.getElementById("auditScreen").classList.add("hidden"); document.getElementById("threatSelectModal").classList.remove("hidden");
    const grid = document.getElementById("threatOptions"); grid.innerHTML = "";
    REPORT_THREAT_OPTIONS.forEach((opt, idx) => {
        const card = document.createElement("div"); card.className = "threat-option-card";
        let txt = getThreatName(opt.id, currentLang);
        card.innerHTML = `<span class="threat-option-num">${idx + 1}</span> <span>${txt}</span>`;
        card.addEventListener("click", () => resolveArrestSelection(opt.id)); grid.appendChild(card);
    });
}

function resolveArrestSelection(selectedId) {
    sfx.playClick(); cleanupSandboxOverlay();
    document.getElementById("threatSelectModal").classList.add("hidden"); document.getElementById("feedbackScreen").classList.remove("hidden");
    const correctThreat = mapScenarioToThreatType(currentScenario);

    if (currentScenario.isMalware) {
        let tType = getLocalizedScenarioField(currentScenario, "threatType"), desc = getLocalizedScenarioField(currentScenario, "description");
        let realWorld = getLocalizedScenarioField(currentScenario, "realWorld");
        let rwText = realWorld ? `<br><br><span style="color:var(--color-cyan);"><b>${UI_TRANSLATIONS[currentLang].realWorldLabel}</b> ${realWorld}</span>` : "";
        if (selectedId === correctThreat) {
            wisdom += 10; recordResolvedThreat(correctThreat); sfx.playSuccess();
            showFeedback(true, UI_TRANSLATIONS[currentLang].feedbackSuccessReport + "<b>" + tType + "</b>" + UI_TRANSLATIONS[currentLang].feedbackSuccessReportSuffix + desc + rwText);
        } else {
            wisdom += 3; recordResolvedThreat(correctThreat); sfx.playArrest();
            let wrongName = getThreatName(selectedId, currentLang);
            let baseText = UI_TRANSLATIONS[currentLang].feedbackIncompleteReport.replace('{wrong}', wrongName);
            showFeedback(true, baseText + "<b>" + tType + "</b>" + UI_TRANSLATIONS[currentLang].feedbackIncompleteReportSuffix + desc + rwText);
        }
    } else {
        economy = Math.max(0, economy - 15); statistics.false_alarms++; sfx.playFail();
        showFeedback(false, UI_TRANSLATIONS[currentLang].feedbackSecurityInfringement + getLocalizedScenarioField(currentScenario, "category") + UI_TRANSLATIONS[currentLang].feedbackSecurityInfringementSuffix);
    }
    updateHUD(); checkGameProgress();
}

function handleBurn() {
    if (isSandboxed) return; sfx.playClick(); enableActionButtons(false);
    if (currentScene) {
        const spr = currentScene.caravanSprites[queueIndex];
        currentScene.tweens.add({ targets: spr, x: 220, y: 220, scale: 0.8, duration: 500, onComplete: () => {
            sfx.playFire(); currentScene.sparkEmitter.explode(20, 220, 220);
            currentScene.tweens.add({ targets: spr, scale: 0, alpha: 0, duration: 500, onComplete: resolveBurnOutcome });
        }});
    } else resolveBurnOutcome();
}

function resolveBurnOutcome() {
    cleanupSandboxOverlay();
    if (currentScenario.isMalware) {
        wisdom += 5; recordResolvedThreat(mapScenarioToThreatType(currentScenario)); sfx.playSuccess();
        let realWorld = getLocalizedScenarioField(currentScenario, "realWorld");
        let rwText = realWorld ? `<br><br><span style="color:var(--color-cyan);"><b>${UI_TRANSLATIONS[currentLang].realWorldLabel}</b> ${realWorld}</span>` : "";
        showFeedback(true, UI_TRANSLATIONS[currentLang].feedbackThreatIncinerated + rwText);
    } else {
        economy = Math.max(0, economy - 15); statistics.false_alarms++; sfx.playFail();
        showFeedback(false, UI_TRANSLATIONS[currentLang].feedbackEconomicSabotage + getLocalizedScenarioField(currentScenario, "category") + UI_TRANSLATIONS[currentLang].feedbackEconomicSabotageSuffix);
    }
    updateHUD(); checkGameProgress();
}

function recordResolvedThreat(type) {
    if (type === "phish") statistics.phish_resolved++; else if (type === "trojan") statistics.trojan_resolved++;
    else if (type === "zip_bomb") statistics.zip_bomb_resolved++; else if (type === "social") statistics.social_resolved++;
    else if (type === "mitm") statistics.mitm_resolved++; else if (type === "fake_update") statistics.fake_update_resolved++;
}

function updateHUD() {
    for (let i = 1; i <= MAX_HEALTH; i++) {
        const h = document.getElementById(`heart${i}`);
        if (h) i <= health ? h.classList.add("active") : h.classList.remove("active");
    }
    document.getElementById("wisdomScore").textContent = wisdom; document.getElementById("economyScore").textContent = `${economy}%`;
}

function enableActionButtons(enable) { ["btnAllow", "btnVerify", "btnArrest", "btnBurn"].forEach(b => document.getElementById(b).disabled = !enable); }

function cleanupSandboxOverlay() {
    if (currentScene) { currentScene.cageObj.setVisible(false); currentScene.cageObj.clearTint(); currentScene.scanBarBg.setVisible(false); currentScene.scanBarFill.setVisible(false); currentScene.scanBarFill.clear(); }
}

function updateProgressBadge() {
    const total = currentLevelData ? currentLevelData.length : 0, current = queueIndex + 1;
    const pt = document.getElementById("progressText"), pb = document.getElementById("progressBarFill");
    if (pt) pt.textContent = `${Math.min(current, total)}/${total}`;
    if (pb) pb.style.width = `${Math.min(total > 0 ? ((current - 1) / total) * 100 : 0, 100)}%`;
}

function showFeedback(isSuccess, text) {
    document.getElementById("auditScreen").classList.add("hidden"); document.getElementById("feedbackScreen").classList.remove("hidden");
    const t = UI_TRANSLATIONS[currentLang], title = document.getElementById("feedbackTitle");
    title.textContent = isSuccess ? t.feedbackTitleSuccess : t.feedbackTitleFailure;
    title.className = isSuccess ? "feedback-title glow-text-green" : "feedback-title glow-text-red blink";
    document.getElementById("feedbackText").innerHTML = text;
}

function checkGameProgress() { if (health <= 0) triggerGameOver("health"); else if (economy <= 0) triggerGameOver("economy"); }

function advanceQueue() {
    sfx.playClick(); document.getElementById("feedbackScreen").classList.add("hidden");
    if (currentScene && currentScene.caravanSprites[queueIndex]) currentScene.caravanSprites[queueIndex].destroy();
    queueIndex++; updateProgressBadge();
    if (queueIndex >= currentLevelData.length) checkLevelCompletion();
    else {
        if (currentScene) {
            for (let i = queueIndex; i < currentLevelData.length; i++) {
                if (currentScene.caravanSprites[i]) currentScene.tweens.add({ targets: currentScene.caravanSprites[i], x: 340 - ((i - queueIndex) * 90), duration: 500, ease: 'Power1' });
            }
        }
        document.getElementById("auditScreen").classList.remove("hidden"); setTimeout(startAuditCurrent, 600);
    }
}

function checkLevelCompletion() {
    if (currentLevel < 3) {
        currentLevel++; sfx.playSuccess();
        showFeedback(true, UI_TRANSLATIONS[currentLang].feedbackLevelCompleted + currentLevel + UI_TRANSLATIONS[currentLang].feedbackLevelCompletedSuffix);
        document.getElementById("nextBtn").onclick = () => {
            document.getElementById("feedbackScreen").classList.add("hidden"); document.getElementById("auditScreen").classList.remove("hidden");
            loadLevel(currentLevel); document.getElementById("nextBtn").onclick = advanceQueue;
        };
    } else triggerVictory();
}

function triggerGameOver(reason) {
    sfx.playFail();
    ["auditScreen", "feedbackScreen", "threatSelectModal"].forEach(id => document.getElementById(id).classList.add("hidden"));
    document.getElementById("gameOverScreen").classList.remove("hidden");
    const pm = document.getElementById("postMortemText"), title = document.getElementById("failTitle"), t = UI_TRANSLATIONS[currentLang];
    if (reason === "health") { title.textContent = t.gameOverInfected; pm.innerHTML = t.gameOverInfectedText; }
    else if (reason === "economy") { title.textContent = t.gameOverBankrupt; pm.innerHTML = t.gameOverBankruptText; }
    else { title.textContent = t.gameOverCongestion; pm.innerHTML = t.gameOverCongestionText; }
}

function triggerVictory() {
    sfx.playSuccess();
    ["auditScreen", "feedbackScreen"].forEach(id => document.getElementById(id).classList.add("hidden"));
    document.getElementById("victoryScreen").classList.remove("hidden");
    const t = UI_TRANSLATIONS[currentLang];
    let rank = t[wisdom < 50 ? "rankApprentice" : wisdom < 100 ? "rankKnight" : wisdom < 130 ? "rankHighGuard" : "rankSovereign"];
    document.getElementById("victoryStatsSummary").innerHTML = `
        <div class="stat-row"><span>${t.victoryStatsWisdom}</span> <span>${wisdom}</span></div>
        <div class="stat-row"><span>${t.victoryStatsRank}</span> <span><b>${rank}</b></span></div>
        <div class="stat-row"><span>${t.victoryStatsPhish}</span> <span>${statistics.phish_resolved}</span></div>
        <div class="stat-row"><span>${t.victoryStatsTrojan}</span> <span>${statistics.trojan_resolved}</span></div>
        <div class="stat-row"><span>${t.victoryStatsZipBomb}</span> <span>${statistics.zip_bomb_resolved}</span></div>
        <div class="stat-row"><span>${t.victoryStatsSocial}</span> <span>${statistics.social_resolved}</span></div>
        <div class="stat-row"><span>${t.victoryStatsMitm}</span> <span>${statistics.mitm_resolved}</span></div>
        <div class="stat-row"><span>${t.victoryStatsFakeUpdate}</span> <span>${statistics.fake_update_resolved}</span></div>
        <div class="stat-row"><span>${t.victoryStatsFalseAlarms}</span> <span>${statistics.false_alarms}</span></div>
        <div class="stat-row"><span>${t.victoryStatsLeaks}</span> <span>${statistics.threats_leaked}</span></div>`;
}

function restartGame() {
    sfx.playClick();
    health = MAX_HEALTH; wisdom = 0; economy = 100; currentLevel = 1;
    statistics = { phish_resolved: 0, trojan_resolved: 0, zip_bomb_resolved: 0, social_resolved: 0, mitm_resolved: 0, fake_update_resolved: 0, false_alarms: 0, threats_leaked: 0 };
    updateHUD();
    ["gameOverScreen", "victoryScreen"].forEach(id => document.getElementById(id).classList.add("hidden"));
    document.getElementById("auditScreen").classList.remove("hidden");
    loadLevel(1);
}
