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
        title1: "THE VIGILANT", title2: "SOVEREIGN", subtitle: "CYBER-DEFENSE REALM", shieldLabel: "KINGDOM SHIELD", wisdomLabel: "WISDOM", economyLabel: "ECONOMY", levelLabel: "DEFENSE LEVEL", secureStatus: "GATE SECURITY: SECURE", congestionStatus: "QUEUE CRITICAL: CONGESTION!", levelText: "LEVEL", bootProtocols: "BOOT REALM PROTOCOLS", introTitle: "DEFEND THE SOVEREIGN REALM!", introText: "Welcome, Royal Security Officer. Suspicious caravans are approaching the castle gates. Each caravan represents a **Data Packet** attempting to enter the kingdom's network. Inspect them using your **Security Tools**, then make your decision. Block threats, protect the Economy from false alarms, and gain Wisdom to secure the realm.", senderLabel: "Claimed Sender:", routeLabel: "Trade Route:", sealLabel: "Seal of Authenticity:", weightLabel: "Cargo Weight:", loading: "Loading...", unresolved: "Unresolved", realSourceLabel: "[LENS] Real Source:", realSizeLabel: "[SCALE] Real Size / Format:", sigIntegrityLabel: "[CRYPTO] Signature Integrity:", toolsTitle: "ACTIVE SECURITY TOOLS", toolLens: "Truth Lens", toolScale: "Magic Scale", toolCrypto: "Cryptographer", toolCage: "Quarantine Cage", decisionTitle: "SOVEREIGN DECISION", btnAllow: "ALLOW / OPEN", btnVerify: "TRUST & VERIFY", btnArrest: "DENY & REPORT", btnBurn: "IGNORE & BURN", modalTitle: "REPORTING SECURITY THREAT", modalDesc: "Identify the precise vector of this attack:", feedbackTitleSuccess: "REALM PROTECTED", feedbackTitleFailure: "SECURITY BREACH ALERT", continueDuty: "CONTINUE DUTY", rebootRetry: "REBOOT REALM (RETRY)", victoryTitle: "THE REALM IS SECURED!", victoryText: "All caravans have been inspected. The kingdom stands secure against modern cyber threats!", restartBtn: "REPLAY DUTY PROTOCOLS", soundLabel: "SOUND", themeLabel: "THEME", langLabel: "LANGUAGE", guardsLabel: "GUARDS", on: "ON", off: "OFF", firewallGateSign: "FIREWALL GATE", incineratorSign: "INCINERATOR", sandboxActive: "Quarantine Cage Sandbox Active...", sandboxMalware: "Cage Sandbox: MALWARE WARNING!", sandboxClean: "Cage Sandbox: BEHAVIOR CLEAN", inspectedProfile: "Inspected Caravan Profile", trueSize: "TRUE SIZE:", intrusionAlertTitle: "⚠️ FIREWALL BREACH ALERT ⚠️", malwareDetected: "MALWARE DETECTED IN THE CASTLE KEEP!", breachDetected: "BREACH DETECTED:", gameOverInfected: "THE CASTLE IS INFECTED!", gameOverBankrupt: "THE KINGDOM BANKRUPT!", gameOverCongestion: "CONGESTION COLLAPSE!", gameOverInfectedText: "Critical security failure. Your health hit 0. The castle data was fully encrypted by Ransomware and backdoors leaked royal databases. <br><br><b>Educational Tip:</b> Always verify file sizes on the scale and inspect certificate signatures before granting entrance.", gameOverBankruptText: "The economy has collapsed. Your paranoia led you to block, burn, and arrest legitimate merchant supply lines. The local marketplaces shut down. <br><br><b>Educational Tip:</b> Balanced security relies on productivity. Do not block items that check out as valid and secure. Verify before blocking!", gameOverCongestionText: "The gate queue overflowed. Trade came to a standstill, causing local riots.", feedbackInfectionDetected: "INFECTION DETECTED! ", feedbackSafeAccess: "SAFE ACCESS: You successfully allowed a legitimate supply caravan into the kingdom. The marketplace flourishes.", feedbackSuccessReport: "SUCCESSFUL SECURITY REPORT! You correctly arrested the threat. ", feedbackSuccessReportSuffix: ". +10 Wisdom Points. <br><br><b>Explanation:</b> ", feedbackIncompleteReport: "THREAT BLOCKED (INCOMPLETE REPORT): Blocked safely, but wrong category. Actual threat: ", feedbackIncompleteReportSuffix: ". +3 Wisdom Points. <br><br><b>Explanation:</b> ", feedbackSecurityInfringement: "SECURITY INFRINGEMENT: You arrested a legitimate trade caravan (", feedbackSecurityInfringementSuffix: "). Innocent merchants were imprisoned, which disrupted the marketplace. -15% Economy.", feedbackThreatIncinerated: "THREAT INCINERATED: You safely burned the suspicious caravan, preventing infection. However, reporting it to the Council would have yielded higher Wisdom points. +5 Wisdom Points.", feedbackEconomicSabotage: "ECONOMIC SABOTAGE: You completely incinerated a safe cargo caravan (", feedbackEconomicSabotageSuffix: "). The guild suffered severe losses, damaging castle trade. -15% Economy.", feedbackLevelCompleted: "LEVEL COMPLETED! <br><br>You successfully guarded the gate. Level ", feedbackLevelCompletedSuffix: " presents complex vulnerabilities. Prepare your tools!", victoryStatsWisdom: "Final Wisdom Score:", victoryStatsRank: "Final Guard Rank:", victoryStatsPhish: "Phishing Attacks Stopped:", victoryStatsTrojan: "Trojans Identified:", victoryStatsZipBomb: "Zip Bombs Incinerated:", victoryStatsSocial: "Social Engineering Defeated:", victoryStatsMitm: "Insecure Connections Blocked (MITM):", victoryStatsFakeUpdate: "Fake Updates Blocked:", victoryStatsFalseAlarms: "False Alarms Raised:", victoryStatsLeaks: "Malware Leaks:", rankSovereign: "Sovereign Defender", rankApprentice: "Apprentice Sentry", rankKnight: "Knight Watchman", rankHighGuard: "High Guard Inquisitor", tutorialTitle: "HOW TO PLAY", tutorialSubtitle: "Royal Security Officer Training Manual", tutStep1Title: "\ud83d\udd0d Inspect", tutStep1Desc: 'Use your <strong>Security Tools</strong> to reveal hidden info.', tutStep2Title: "\u2696\ufe0f Analyze", tutStep2Desc: 'Compare <strong>Claimed Sender</strong> with <strong>Real Source</strong>.', tutStep3Title: "\u2705 Decide", tutStep3Desc: '<strong>Allow</strong> safe caravans or <strong>Deny & Report</strong> threats.', tutStep4Title: "\ud83d\udcdd Report", tutStep4Desc: 'Pick the <strong>correct threat type</strong> to earn max Wisdom.', tutToolsTitle: "SECURITY TOOLS GUIDE", tutGuideDescLens: "Reveals actual sender domains to catch spoofing.", tutGuideDescScale: "Shows true file size and hidden extensions.", tutGuideDescCrypto: "Verifies digital signatures and secure routes.", tutGuideDescCage: "Sandbox to safely test suspicious payloads.", tutThreatsTitle: "THREAT TYPES GUIDE", tutThreatName1: "Phishing / Spoofing", tutThreatDesc1: "Fake senders tricking you into revealing credentials.", tutThreatName2: "Double Ext. Trojan", tutThreatDesc2: "Malware disguised as a safe file (e.g., .pdf.exe).", tutThreatName3: "Zip Bomb", tutThreatDesc3: "A tiny archive that crashes systems when expanded.", tutThreatName4: "Social Eng. / Baiting", tutThreatDesc4: "Manipulating human fear or greed to gain access.", tutThreatName5: "Unencrypted (MITM)", tutThreatDesc5: "HTTP traffic where data can be intercepted.", tutThreatName6: "Fake Update", tutThreatDesc6: "Malicious payload disguised as a system patch.", tutDecisionsTitle: "DECISION GUIDE", tutGuideAllowLabel: "ALLOW / OPEN", tutGuideAllowText: "Use when all tools show VALID / MATCH results. Boosts Economy +5%.", tutGuideVerifyLabel: "TRUST & VERIFY", tutGuideVerifyText: "Sends to quarantine sandbox for a deep scan.", tutGuideDenyLabel: "DENY & REPORT", tutGuideDenyText: "Block threat & file report (+10 Wisdom).", tutGuideBurnLabel: "IGNORE & BURN", tutGuideBurnText: "Destroy without reporting (+5 Wisdom).", tutorialCloseBtn: "BEGIN DUTY", progressLabel: "CARAVAN", keyTipsText: "Tip: Look for MISMATCH in sender or EXTERNAL routes!", tooltipAllow: "Use when all tools show VALID / MATCH results", tooltipAllowHint: "\u2705 SAFE CARAVAN", tooltipVerify: "Sends to quarantine for a deep scan", tooltipVerifyHint: "\ud83d\udd2c UNSURE?", tooltipArrest: "Block & report for +10 Wisdom", tooltipArrestHint: "\ud83d\udea8 THREAT FOUND", tooltipBurn: "Incinerate for +5 Wisdom", tooltipBurnHint: "\ud83d\udd25 QUICK DESTROY", realWorldLabel: "Real-World Example:"
    },
    ru: {
        title1: "БДИТЕЛЬНЫЙ", title2: "СУВЕРЕН", subtitle: "ЦАРСТВО КИБЕРЗАЩИТЫ", shieldLabel: "ЩИТ КОРОЛЕВСТВА", wisdomLabel: "МУДРОСТЬ", economyLabel: "ЭКОНОМИКА", levelLabel: "УРОВЕНЬ ЗАЩИТЫ", secureStatus: "БЕЗОПАСНОСТЬ ВОРОТ: НАДЁЖНО", congestionStatus: "ОЧЕРЕДЬ КРИТИЧЕСКАЯ: ПЕРЕГРУЗКА!", levelText: "УРОВЕНЬ", bootProtocols: "ЗАПУСТИТЬ ПРОТОКОЛЫ", introTitle: "ЗАЩИТИТЕ СУВЕРЕННОЕ КОРОЛЕВСТВО!", introText: "Приветствуем вас, королевский офицер безопасности. Подозрительные караваны приближаются к воротам. Каждый караван - это **пакет данных**. Осмотрите их и примите решение.", senderLabel: "Заявленный отправитель:", routeLabel: "Торговый путь:", sealLabel: "Печать подлинности:", weightLabel: "Вес груза:", loading: "Загрузка...", unresolved: "Не определено", realSourceLabel: "[ЛИНЗА] Реальный источник:", realSizeLabel: "[ВЕСЫ] Реальный размер/формат:", sigIntegrityLabel: "[КРИПТО] Целостность подписи:", toolsTitle: "АКТИВНЫЕ ИНСТРУМЕНТЫ", toolLens: "Линза Истины", toolScale: "Волшебные Весы", toolCrypto: "Криптограф", toolCage: "Карантинная Клетка", decisionTitle: "РЕШЕНИЕ СУВЕРЕНА", btnAllow: "ПРОПУСТИТЬ / ОТКРЫТЬ", btnVerify: "ПРОВЕРИТЬ В КАРАНТИНЕ", btnArrest: "ЗАДЕРЖАТЬ / ДОЛОЖИТЬ", btnBurn: "СЖЕЧЬ / ИГНОРИРОВАТЬ", modalTitle: "ОТЧЕТ ОБ УГРОЗЕ БЕЗОПАСНОСТИ", modalDesc: "Определите точный вектор этой атаки:", feedbackTitleSuccess: "КОРОЛЕВСТВО ЗАЩИЩЕНО", feedbackTitleFailure: "ТРЕВОГА: ПРОРЫВ БЕЗОПАСНОСТИ", continueDuty: "ПРОДОЛЖИТЬ СЛУЖБУ", rebootRetry: "ПЕРЕЗАГРУЗИТЬ (ПОВТОРИТЬ)", victoryTitle: "КОРОЛЕВСТВО В БЕЗОПАСНОСТИ!", victoryText: "Все караваны проверены. Королевство надежно защищено!", restartBtn: "ИГРАТЬ СНОВА", soundLabel: "ЗВУК", themeLabel: "ТЕМА", langLabel: "ЯЗЫК", guardsLabel: "СТРАЖА", on: "ВКЛ", off: "ВЫКЛ", firewallGateSign: "КИБЕР-ВОРОТА", incineratorSign: "УТИЛИЗАТОР", sandboxActive: "Карантинная клетка: анализ...", sandboxMalware: "Анализ: ОБНАРУЖЕНО ВРЕДОНОСНОЕ ПО!", sandboxClean: "Анализ: УГРОЗ НЕ ОБНАРУЖЕНО", inspectedProfile: "Проверенный профиль каравана", trueSize: "РЕАЛЬНЫЙ РАЗМЕР:", intrusionAlertTitle: "⚠️ ОБНАРУЖЕН ПРОРЫВ ⚠️", malwareDetected: "ВНУТРИ ЗАМКА ОБНАРУЖЕНО ВРЕДОНОСНОЕ ПО!", breachDetected: "ОБНАРУЖЕН ПРОРЫВ:", gameOverInfected: "ЗАМОК ЗАРАЖЕН!", gameOverBankrupt: "КОРОЛЕВСТВО ОБАНКРОТИЛОСЬ!", gameOverCongestion: "КОЛЛАПС ИЗ-ЗА ПЕРЕГРУЗКИ!", gameOverInfectedText: "Критический сбой. Замок зашифрован вымогателями.", gameOverBankruptText: "Экономика рухнула. Вы блокировали легальные пути.", gameOverCongestionText: "Очередь у ворот переполнилась. Торговля остановилась.", feedbackInfectionDetected: "ОБНАРУЖЕНО ЗАРАЖЕНИЕ! ", feedbackSafeAccess: "БЕЗОПАСНЫЙ ДОСТУП: Вы впустили законный торговый караван.", feedbackSuccessReport: "УСПЕШНЫЙ ОТЧЕТ! Вы правильно задержали угрозу: ", feedbackSuccessReportSuffix: ". +10 очков Мудрости. <br><br><b>Объяснение:</b> ", feedbackIncompleteReport: "УГРОЗА БЛОКИРОВАНА: Караван заблокирован, но категория неверна. Угроза: ", feedbackIncompleteReportSuffix: ". +3 очка Мудрости. <br><br><b>Объяснение:</b> ", feedbackSecurityInfringement: "НАРУШЕНИЕ ПРАВ: Вы задержали законный караван (", feedbackSecurityInfringementSuffix: "). -15% Экономики.", feedbackThreatIncinerated: "УГРОЗА СЖЖЕНА: Вы сожгли подозрительный караван. +5 Мудрости.", feedbackEconomicSabotage: "ЭКОНОМИЧЕСКИЙ САБОТАЖ: Вы сожгли безопасный караван (", feedbackEconomicSabotageSuffix: "). -15% Экономики.", feedbackLevelCompleted: "УРОВЕНЬ ЗАВЕРШЕН! Уровень ", feedbackLevelCompletedSuffix: " пройден.", victoryStatsWisdom: "Итоговая мудрость:", victoryStatsRank: "Итоговый ранг:", victoryStatsPhish: "Фишинговых атак:", victoryStatsTrojan: "Троянов:", victoryStatsZipBomb: "Архивных бомб:", victoryStatsSocial: "Социальной инженерии:", victoryStatsMitm: "MITM-атак:", victoryStatsFakeUpdate: "Фальшивых обновлений:", victoryStatsFalseAlarms: "Ложных тревог:", victoryStatsLeaks: "Утечек ПО:", rankSovereign: "Суверенный защитник", rankApprentice: "Подмастерье часового", rankKnight: "Рыцарь-страж", rankHighGuard: "Инквизитор Высшей Стражи", tutorialTitle: "КАК ИГРАТЬ", tutorialSubtitle: "Пособие офицера", tutStep1Title: "\ud83d\udd0d Осмотр", tutStep1Desc: 'Используйте инструменты для проверки.', tutStep2Title: "\u2696\ufe0f Анализ", tutStep2Desc: 'Сравните отправителя с реальным источником.', tutStep3Title: "\u2705 Решение", tutStep3Desc: 'Пропустите безопасные или задержите угрозы.', tutStep4Title: "\ud83d\udcdd Отчёт", tutStep4Desc: 'Выберите верный тип угрозы.', tutToolsTitle: "ИНСТРУМЕНТЫ БЕЗОПАСНОСТИ", tutGuideDescLens: "Раскрывает реальный домен для защиты от подмены.", tutGuideDescScale: "Показывает истинный вес и скрытые расширения.", tutGuideDescCrypto: "Проверяет цифровые подписи и безопасность маршрута.", tutGuideDescCage: "Песочница для безопасной проверки подозрительных грузов.", tutThreatsTitle: "ВИДЫ УГРОЗ", tutThreatName1: "Фишинг / Подмена", tutThreatDesc1: "Поддельные отправители, крадущие ваши данные.", tutThreatName2: "Троян (Двойное расш.)", tutThreatDesc2: "Вирус, замаскированный под файл (напр. .pdf.exe).", tutThreatName3: "Архивная бомба", tutThreatDesc3: "Крошечный архив, ломающий систему при распаковке.", tutThreatName4: "Соц. инженерия", tutThreatDesc4: "Манипуляция страхом или жаждой наживы.", tutThreatName5: "Незашифрованный (MITM)", tutThreatDesc5: "Перехват данных при передаче без защиты.", tutThreatName6: "Фальшивое обновление", tutThreatDesc6: "Вирус под видом системного патча.", tutDecisionsTitle: "СПРАВОЧНИК", tutGuideAllowLabel: "ПРОПУСТИТЬ", tutGuideAllowText: "+5% Экономики.", tutGuideVerifyLabel: "КАРАНТИН", tutGuideVerifyText: "Безопасный вариант при сомнениях.", tutGuideDenyLabel: "ЗАДЕРЖАТЬ", tutGuideDenyText: "Отчет об угрозе (+10 Мудрости).", tutGuideBurnLabel: "СЖЕЧЬ", tutGuideBurnText: "Уничтожить без отчёта (+5 Мудрости).", tutorialCloseBtn: "НАЧАТЬ ИГРУ", progressLabel: "КАРАВАН", keyTipsText: "Совет: Ищите НЕСОВПАДЕНИЯ отправителя!", tooltipAllow: "Используйте для безопасных", tooltipAllowHint: "\u2705 БЕЗОПАСНЫЙ", tooltipVerify: "Отправить в карантин", tooltipVerifyHint: "\ud83d\udd2c НЕ УВЕРЕНЫ?", tooltipArrest: "Блокировать и доложить", tooltipArrestHint: "\ud83d\udea8 УГРОЗА", tooltipBurn: "Уничтожить без отчёта", tooltipBurnHint: "\ud83d\udd25 БЫСТРОЕ УНИЧТОЖЕНИЕ", realWorldLabel: "Пример из жизни:"
    },
    kk: {
        title1: "САҚ", title2: "ӘМІРШІ", subtitle: "КИБЕРҚОРҒАНЫС ӘЛЕМІ", shieldLabel: "ҚАМАЛ ҚАЛҚАНЫ", wisdomLabel: "ДАНАЛЫҚ", economyLabel: "ЭКОНОМИКА", levelLabel: "ҚОРҒАНЫС ДЕҢГЕЙІ", secureStatus: "ҚАҚПА ҚАУІПСІЗДІГІ: СЕНІМДІ", congestionStatus: "КЕЗЕК КРИТИКАЛЫҚ: ШЕКТЕН ТЫС!", levelText: "ДЕҢГЕЙ", bootProtocols: "ӘЛЕМ ПРОТОКОЛДАРЫН ІСКЕ ҚОСУ", introTitle: "СУВЕРЕНДІ ӘЛЕМДІ ҚОРҒАҢЫЗ!", introText: "Қош келдіңіз, Корольдік қауіпсіздік офицері. Қамал қақпасына күдікті керуендер жақындап келеді. Әр керуен патшалық желісіне кіруге тырысатын **Деректер пакетін** білдіреді. Оларды **Қауіпсіздік құралдарымен** тексеріп, шешім қабылдаңыз.", senderLabel: "Көрсетілген жіберуші:", routeLabel: "Сауда жолы:", sealLabel: "Түпнұсқалық мөрі:", weightLabel: "Жүк салмағы:", loading: "Жүктелуде...", unresolved: "Анықталмаған", realSourceLabel: "[ЛИНЗА] Нақты дереккөз:", realSizeLabel: "[ТАРАЗЫ] Нақты өлшемі / пішімі:", sigIntegrityLabel: "[КРИПТО] Қолтаңба тұтастығы:", toolsTitle: "БЕЛСЕНДІ ҚАУІПСІЗДІК ҚҰРАЛДАРЫ", toolLens: "Шындық линзасы", toolScale: "Сиқырлы таразы", toolCrypto: "Криптограф", toolCage: "Карантин торы", decisionTitle: "ӘМІРШІ ШЕШІМІ", btnAllow: "РҰҚСАТ БЕРУ / АШУ", btnVerify: "ТЕКСЕРУ ЖӘНЕ КАРАНТИН", btnArrest: "ҚАМАУҒА АЛУ ЖӘНЕ БАЯНДАУ", btnBurn: "ЕЛЕМЕУ ЖӘНЕ ӨРТЕУ", modalTitle: "ҚАУІПСІЗДІК ҚАТЕРІ ТУРАЛЫ БАЯНДАУ", modalDesc: "Жоғарғы Кеңеске дұрыс есеп жіберу үшін шабуыл векторын анықтаңыз:", feedbackTitleSuccess: "ӘЛЕМ ҚОРҒАЛДЫ", feedbackTitleFailure: "ҚАУІПСІЗДІКТІ БҰЗУ ДАБЫЛЫ", continueDuty: "ҚЫЗМЕТТІ ЖАЛҒАСТЫРУ", rebootRetry: "ӘЛЕМДІ ҚАЙТА ҚОСУ", victoryTitle: "ӘЛЕМ ҚАУІПСІЗДІКТЕ!", victoryText: "Барлық керуендер тексерілді. Патшалық қорғалған!", restartBtn: "ҚЫЗМЕТКЕ ҚАЙТА ОРАЛУ", soundLabel: "ДЫБЫС", themeLabel: "ТАҚЫРЫП", langLabel: "ТІЛ", guardsLabel: "КҮЗЕТШІЛЕР", on: "ҚОСУЛЫ", off: "ӨШІРУЛІ", firewallGateSign: "КИБЕР-ҚАҚПА", incineratorSign: "ӨРТЕГІШ", sandboxActive: "Карантин торы: талдау...", sandboxMalware: "Талдау: ЗИЯНДЫ БАҒДАРЛАМА АНЫҚТАЛДЫ!", sandboxClean: "Талдау: ҚАУІП АНЫҚТАЛҒАН ЖОҚ", inspectedProfile: "Тексерілген керуен профилі", trueSize: "НАҚТЫ ӨЛШЕМІ:", intrusionAlertTitle: "⚠️ БРАНДМАУЭРДІ БҰЗУ ДАБЫЛЫ ⚠️", malwareDetected: "ҚАМАЛ ІШІНДЕ ЗИЯНДЫ БАҒДАРЛАМА АНЫҚТАЛДЫ!", breachDetected: "БҰЗУ АНЫҚТАЛДЫ:", gameOverInfected: "ҚАМАЛ ЗАҚЫМДАНДЫ!", gameOverBankrupt: "ПАТШАЛЫҚ БАНКРОТ БОЛДЫ!", gameOverCongestion: "КЕЗЕКТЕН ШЕКТЕН ТЫС ЖҮКТЕМЕ!", gameOverInfectedText: "Қауіпсіздіктің сыни қателігі. Қамал деректері шифрланды.", gameOverBankruptText: "Экономика күйреді. Сіз заңды сауда жолдарын бұғаттадыңыз.", gameOverCongestionText: "Қақпадағы кезек толып кетті. Сауда тоқтап, бүлік тудырды.", feedbackInfectionDetected: "ЖҰҚПА АНЫҚТАЛДЫ! ", feedbackSafeAccess: "ҚАУІПСІЗ КІРУ: Сіз заңды сауда керуенін кіргіздіңіз.", feedbackSuccessReport: "СӘТТІ ЕСЕП! Сіз қауіпті дұрыс анықтадыңыз: ", feedbackSuccessReportSuffix: ". +10 Даналық ұпайы. <br><br><b>Түсініктеме:</b> ", feedbackIncompleteReport: "ҚАУІП БҰҒАТТАЛДЫ: Керуен бұғатталды, бірақ санат қате. Қауіп: ", feedbackIncompleteReportSuffix: ". +3 Даналық ұпайы. <br><br><b>Түсініктеме:</b> ", feedbackSecurityInfringement: "ҚҰҚЫҚ БҰЗУШЫЛЫҚ: Сіз заңды керуенді қамауға алдыңыз (", feedbackSecurityInfringementSuffix: "). -15% Экономика.", feedbackThreatIncinerated: "ҚАУІП ӨРТЕЛДІ: Сіз күдікті керуенді өртедіңіз. +5 Даналық.", feedbackEconomicSabotage: "ЭКОНОМИКАЛЫҚ САБОТАЖ: Сіз қауіпсіз жүк керуенін өртедіңіз (", feedbackEconomicSabotageSuffix: "). -15% Экономика.", feedbackLevelCompleted: "ДЕҢГЕЙ АЯҚТАЛДЫ! Деңгей ", feedbackLevelCompletedSuffix: " аяқталды.", victoryStatsWisdom: "Қорытынды Даналық:", victoryStatsRank: "Қорытынды шен:", victoryStatsPhish: "Фишинг шабуылдары:", victoryStatsTrojan: "Трояндар:", victoryStatsZipBomb: "Мұрағат бомбалары:", victoryStatsSocial: "Әлеуметтік инженерия:", victoryStatsMitm: "MITM шабуылдары:", victoryStatsFakeUpdate: "Жалған жаңартулар:", victoryStatsFalseAlarms: "Жалған дабылдар:", victoryStatsLeaks: "Деректердің жылыстауы:", rankSovereign: "Егемен қорғаушы", rankApprentice: "Шәкірт күзетші", rankKnight: "Сері-күзетші", rankHighGuard: "Жоғарғы күзет инквизиторы", tutorialTitle: "ҚАЛАЙ ОЙНАУ КЕРЕК", tutorialSubtitle: "Оқу құралы", tutStep1Title: "\ud83d\udd0d Тексеру", tutStep1Desc: 'Құралдарды пайдаланып ақпаратты ашыңыз.', tutStep2Title: "\u2696\ufe0f Талдау", tutStep2Desc: 'Мәлімделген мен нақты дереккөзді салыстырыңыз.', tutStep3Title: "\u2705 Шешім", tutStep3Desc: 'Рұқсат етіңіз немесе Қамауға алыңыз.', tutStep4Title: "\ud83d\udcdd Баяндау", tutStep4Desc: 'Дұрыс қауіп түрін таңдаңыз.', tutToolsTitle: "ҚАУІПСІЗДІК ҚҰРАЛДАРЫ", tutGuideDescLens: "Жалғандықтан қорғау үшін нақты доменді ашады.", tutGuideDescScale: "Нақты салмақты және жасырын кеңейтімдерді көрсетеді.", tutGuideDescCrypto: "Сандық қолтаңбалар мен маршрут қауіпсіздігін тексереді.", tutGuideDescCage: "Күдікті жүктерді қауіпсіз тексеруге арналған құмсалғыш.", tutThreatsTitle: "ҚАУІП ТҮРЛЕРІ", tutThreatName1: "Фишинг / Ауыстыру", tutThreatDesc1: "Деректеріңізді ұрлайтын жалған жіберушілер.", tutThreatName2: "Троян (Қос кеңейтім)", tutThreatDesc2: "Қауіпсіз файл түрінде жасырылған вирус.", tutThreatName3: "Мұрағат бомбасы", tutThreatDesc3: "Ашылғанда жүйені бұзатын кішкентай мұрағат.", tutThreatName4: "Әлеуметтік инженерия", tutThreatDesc4: "Қорқыныш немесе ашкөздікті пайдаланып алдау.", tutThreatName5: "Шифрланбаған (MITM)", tutThreatDesc5: "Қорғаныссыз тасымалдау кезінде деректерді ұстап алу.", tutThreatName6: "Жалған жаңарту", tutThreatDesc6: "Жүйелік патч түрінде жасырылған вирус.", tutDecisionsTitle: "НҰСҚАУЛЫҚ", tutGuideAllowLabel: "РҰҚСАТ БЕРУ", tutGuideAllowText: "Экономиканы +5% көтереді.", tutGuideVerifyLabel: "КАРАНТИН", tutGuideVerifyText: "Сенімді болмаған кездегі қауіпсіз нұсқа.", tutGuideDenyLabel: "БАЯНДАУ", tutGuideDenyText: "Есеп жіберіңіз (+10 Даналық).", tutGuideBurnLabel: "ӨРТЕУ", tutGuideBurnText: "Есепсіз жою (+5 Даналық).", tutorialCloseBtn: "ОЙЫНДЫ БАСТАУ", progressLabel: "КЕРУЕН", keyTipsText: "Кеңес: СӘЙКЕССІЗДІКТЕРДІ іздеңіз!", tooltipAllow: "ЖАРАМДЫ болғанда пайдаланыңыз", tooltipAllowHint: "\u2705 ҚАУІПСІЗ", tooltipVerify: "Карантинге жібереді", tooltipVerifyHint: "\ud83d\udd2c СЕНІМДІ ЕМЕСПІЗ БЕ?", tooltipArrest: "Бұғаттау және баяндау", tooltipArrestHint: "\ud83d\udea8 ҚАУІП", tooltipBurn: "Есепсіз жою", tooltipBurnHint: "\ud83d\udd25 ЖЫЛДАМ ЖОЮ", realWorldLabel: "Өмірдегі мысал:"
    }
};

const SCENARIO_TRANSLATIONS = {
    ru: {
        phish_email: { category: "Гонец", threatType: "Фишинг", displayName: "Почтовый голубь", claimedSender: "Архиепископ", claimedSeal: "Печать Духовенства", claimedWeight: "15 КБ", actualSender: "scammer-guild.biz (НЕСОВПАДЕНИЕ)", actualRoute: "http://royal.gov/mail", actualSeal: "Поддельная (ФАЛЬШИВКА)", description: "Королевство пострадало от фишинга.", realWorld: "Злоумышленник отправляет письмо якобы от вашего банка, прося перейти по ссылке и ввести пароль." },
        spear_phish: { category: "Гонец", threatType: "Целевой фишинг", displayName: "Срочный курьер", claimedSender: "Лорд казначей", claimedSeal: "Королевская печать", claimedWeight: "22 КБ", actualSender: "support@kingdom-taxes.com (НЕСОВПАДЕНИЕ)", actualRoute: "https://kingdom-taxes.com/mail (ВНЕШНИЙ)", actualSeal: "Хрустальная копия (ФАЛЬШИВКА)", description: "Свиток обманул стражу.", realWorld: "Хакеры изучают сотрудника и отправляют письмо от имени директора с просьбой перевести деньги." },
        mal_attachment: { category: "Гонец", threatType: "Вложение с вирусом", displayName: "Голубь со счетом", claimedSender: "Налоговый инспектор", claimedSeal: "Печать Реестра", claimedWeight: "12 КБ", actualSender: "taxes@royal.gov (СОВПАДЕНИЕ)", actualRoute: "https://taxes.royal.gov", actualSeal: "Отсутствует (ФАЛЬШИВКА)", actualWeight: "480 КБ (Тяжелый)", description: "Свиток счета содержал вредоносное ПО.", realWorld: "Вы получаете письмо с «накладной». При ее открытии запускается макрос, заражающий ПК." },
        mitm_messenger: { category: "Гонец", threatType: "Перехват (MITM)", displayName: "Незашифрованный", claimedSender: "Барон Ист-Рича", claimedSeal: "Герб Ист-Рича", claimedWeight: "5 КБ", actualSender: "eastreach@baron-mail.net (СОВПАДЕНИЕ)", actualRoute: "http://plain-courier-post.net", actualSeal: "Нет подписи", description: "Свиток был перехвачен (незашифрован).", realWorld: "Вход на сайт без HTTPS через публичный Wi-Fi позволяет хакерам перехватить пароли." },
        mal_download: { category: "Торговец", threatType: "Вредоносный сайт", displayName: "Телега с товарами", claimedSender: "Форпост Гильдии", claimedSeal: "Печать Гильдии", claimedWeight: "2.4 МБ", actualSender: "shady-hackers-guild.ru (НЕСОВПАДЕНИЕ)", actualRoute: "http://wizard-spells.org/free", actualSeal: "Просроченный сертификат", description: "Королевство пало жертвой скрытой загрузки.", realWorld: "Скачивание «взломанных» программ с неофициальных сайтов часто приводит к установке вирусов." },
        homograph_spoof: { category: "Торговец", threatType: "Подмена домена", displayName: "Телега банка", claimedSender: "Королевский банк", claimedSeal: "Герб Банка", claimedWeight: "1.8 МБ", actualSender: "https://royаlbank.com (Подмена)", actualRoute: "https://royаlbank.com (ВНЕШНИЙ)", actualSeal: "Неверифицированный регистратор", description: "Поддельный домен проник в замок.", realWorld: "Хакер регистрирует домен, используя кириллицу (например, аpple.com)." },
        driveby_wagon: { category: "Торговец", threatType: "Скрытая загрузка", displayName: "Телега алхимика", claimedSender: "Гильдия алхимиков", claimedSeal: "Печать алхимика", claimedWeight: "200 КБ", actualSender: "alchemists.org (СОВПАДЕНИЕ)", actualRoute: "https://alchemists.org/exploit.js (ВРЕДОНОСНЫЙ СКРИПТ)", actualSeal: "Печать алхимика (СОВПАДЕНИЕ)", actualWeight: "1.5 МБ", description: "Набор эксплойтов заразил замок.", realWorld: "Зараженный сайт незаметно выполняет скрипт в фоне, используя уязвимости браузера." },
        watering_hole: { category: "Торговец", threatType: "Атака водопоя", displayName: "Телега с хлебом", claimedSender: "Гильдия пекарей", claimedSeal: "Штамп пекарей", claimedWeight: "50 КБ", actualSender: "trusted-bakery.com (СОВПАДЕНИЕ)", actualRoute: "https://trusted-bakery.com/update", actualSeal: "Просроченный сертификат", actualWeight: "2.1 МБ", description: "Сайт пекарни был взломан.", realWorld: "Хакеры заражают сайт, который часто посещает их жертва (например, форум отрасли)." },
        ransomware_rider: { category: "Указ", threatType: "Вымогательство", displayName: "Темный всадник", claimedSender: "Дальний форпост", claimedSeal: "Значок стражи", claimedWeight: "35 КБ", actualSender: "extortionists.biz (НЕСОВПАДЕНИЕ)", actualRoute: "http://black-hand.net", actualSeal: "Отсутствует", description: "Вирус заблокировал замковое хранилище.", realWorld: "Вирус шифрует все ваши файлы и требует выкуп в криптовалюте." },
        authority_impersonation: { category: "Указ", threatType: "Социальная инженерия", displayName: "Королевский паладин", claimedSender: "Лорд-протектор", claimedSeal: "Печать Лорда", claimedWeight: "10 КБ", actualSender: "impostor-guild.net (НЕСОВПАДЕНИЕ)", actualRoute: "https://impostor-guild.net", actualSeal: "Поддельный штамп", description: "Всадник назвался Защитником Короля.", realWorld: "Мошенник звонит под видом полиции или службы безопасности банка." },
        baiting_lottery: { category: "Указ", threatType: "Приманка", displayName: "Глашатай", claimedSender: "Комитет благосостояния", claimedSeal: "Марка благосостояния", claimedWeight: "40 КБ", actualSender: "scammer-jackpot.com (НЕСОВПАДЕНИЕ)", actualRoute: "http://scammer-jackpot.com", actualSeal: "Отсутствует", description: "Свиток-приманка обещал бесплатное золото.", realWorld: "Всплывающее окно сообщает, что вы выиграли iPhone. Для получения нужно скачать файл." },
        trojan_exe: { category: "Троян", threatType: "Троян", displayName: "Ящик с налогами", claimedSender: "Налоговый аудитор", claimedSeal: "Печать аудита", claimedWeight: "1.2 МБ", actualSender: "finance@royal.gov (СОВПАДЕНИЕ)", actualRoute: "https://finance.royal.gov", actualSeal: "Печать аудита (СОВПАДЕНИЕ)", actualWeight: "1.2 МБ", trueExtension: "Taxes_2026.pdf.exe", description: "Троян заразил замок.", realWorld: "Файл назван 'Отчет.pdf.exe'. Windows скрывает '.exe', и пользователь запускает вирус." },
        trojan_vbs: { category: "Троян", threatType: "Троян скрипт", displayName: "Ящик гильдии", claimedSender: "Мастер ремесел", claimedSeal: "Печать ремесленников", claimedWeight: "45 КБ", actualSender: "crafts@royal.gov (СОВПАДЕНИЕ)", actualRoute: "https://crafts.royal.gov/files", actualSeal: "Печать ремесленников (СОВПАДЕНИЕ)", actualWeight: "45 КБ", trueExtension: "GuildMembers.csv.vbs", description: "Ящик выдавал себя за .csv, но это был скрипт.", realWorld: "Скрипт (.vbs), замаскированный под документ, при клике скачивает бэкдоры." },
        zip_bomb: { category: "Троян", threatType: "Архивная бомба", displayName: "Сжатые архивы", claimedSender: "Картограф", claimedSeal: "Печать картографии", claimedWeight: "10 КБ", actualSender: "maps@royal.gov (СОВПАДЕНИЕ)", actualRoute: "https://maps.royal.gov/archive", actualSeal: "Печать картографии", actualWeight: "500 МБ", trueExtension: "KingdomMap.zip", description: "Архивная бомба перегрузила реестр.", realWorld: "Крошечный ZIP-архив при распаковке заполняет весь диск мусором." },
        mimic_patch: { category: "Мимик", threatType: "Ложное обновление", displayName: "Гильдия архитекторов", claimedSender: "Главный строитель", claimedSeal: "Печать арки", claimedWeight: "8.5 МБ", actualSender: "hackers.biz (НЕСОВПАДЕНИЕ)", actualRoute: "http://updater-patch.com", actualSeal: "Поддельный знак", description: "Мимик заставил скачать фальшивое обновление.", realWorld: "Сайт выдает ложное сообщение: «Ваш браузер устарел». Кнопка скачивает вирус." },
        fake_antivirus: { category: "Мимик", threatType: "Ложная тревога", displayName: "Королевский экзорцист", claimedSender: "Церковь безопасности", claimedSeal: "Печать Экзорциста", claimedWeight: "3.2 МБ", actualSender: "fake-priest-scam.net (НЕСОВПАДЕНИЕ)", actualRoute: "http://clean-castle.xyz", actualSeal: "Неподписанный пергамент", description: "Мошенник под видом техподдержки проник в замок.", realWorld: "Фальшивое окно гласит: «Найдены вирусы!». Вас заставляют купить поддельный антивирус." }
    },
    kk: {
        phish_email: { category: "Шабарман", threatType: "Фишинг", displayName: "Пошта көгершіні", claimedSender: "Архиепископ", claimedSeal: "Қасиетті мөр", claimedWeight: "15 КБ", actualSender: "scammer-guild.biz (СӘЙКЕС ЕМЕС)", actualRoute: "http://royal.gov/mail", actualSeal: "Жалған мөр", description: "Патшалығыңыз фишингтен зардап шекті.", realWorld: "Шабуылшы банк атынан хат жіберіп, құпия сөзіңізді ұрлайды." },
        spear_phish: { category: "Шабарман", threatType: "Мақсатты фишинг", displayName: "Шұғыл курьер", claimedSender: "Бас қазынашы", claimedSeal: "Қазынашылық мөрі", claimedWeight: "22 КБ", actualSender: "support@kingdom-taxes.com (СӘЙКЕС ЕМЕС)", actualRoute: "https://kingdom-taxes.com/mail", actualSeal: "Көшірме (ЖАЛҒАН)", description: "Шиыршық күзетшілерді алдады.", realWorld: "Хакерлер директордың атынан шұғыл ақша аударуды сұрайтын хат жібереді." },
        mal_attachment: { category: "Шабарман", threatType: "Зиянды тіркеме", displayName: "Саудагер шоты", claimedSender: "Салық инспекторы", claimedSeal: "Салық мөрі", claimedWeight: "12 КБ", actualSender: "taxes@royal.gov (СӘЙКЕС)", actualRoute: "https://taxes.royal.gov", actualSeal: "Қолтаңба жоқ", actualWeight: "480 КБ (Ауыр жүк)", description: "Шот шиыршығында зиянды бағдарлама болды.", realWorld: "Сіз «шот-фактура» аласыз. Оны ашқанда вирустық макрос іске қосылады." },
        mitm_messenger: { category: "Шабарман", threatType: "Делдал шабуылы", displayName: "Шифрланбаған шабарман", claimedSender: "Ист-Рич бароны", claimedSeal: "Ист-Рич елтаңбасы", claimedWeight: "5 КБ", actualSender: "eastreach@baron-mail.net (СӘЙКЕС)", actualRoute: "http://plain-courier-post.net", actualSeal: "Қолтаңба жоқ", description: "Шиыршық ұсталды.", realWorld: "Қоғамдық Wi-Fi арқылы HTTPS-сіз кіру хакерлерге құпия сөзді ұстап алуға мүмкіндік береді." },
        mal_download: { category: "Саудагер", threatType: "Қауіпсіз емес жүктеу", displayName: "Тегін тауарлар", claimedSender: "Сиқыршылар гильдиясы", claimedSeal: "Сиқыршылар мөрі", claimedWeight: "2.4 МБ", actualSender: "shady-hackers.ru (СӘЙКЕС ЕМЕС)", actualRoute: "http://wizard-spells.org/free", actualSeal: "Мерзімі өткен", description: "Жасырын жүктеу құрбаны болдыңыз.", realWorld: "Бейресми сайттардан бағдарлама жүктеу көбінесе жасырын вирустарға әкеледі." },
        homograph_spoof: { category: "Саудагер", threatType: "Доменді ауыстыру", displayName: "Банк арбасы", claimedSender: "Корольдік қазынашылық", claimedSeal: "Банк елтаңбасы", claimedWeight: "1.8 МБ", actualSender: "https://royаlbank.com (Ауыстыру)", actualRoute: "https://royаlbank.com (СЫРТҚЫ)", actualSeal: "Расталмаған тіркеуші", description: "Қолдан жасалған домен қамалға кірді.", realWorld: "Хакер кириллицаны (мысалы, аpple.com) пайдаланып ұқсас домен тіркейді." },
        driveby_wagon: { category: "Саудагер", threatType: "Жасырын жүктеу", displayName: "Алхимик арбасы", claimedSender: "Алхимиктер гильдиясы", claimedSeal: "Алхимик мөрі", claimedWeight: "200 КБ", actualSender: "alchemists.org (СӘЙКЕС)", actualRoute: "https://alchemists.org/exploit.js (ЗИЯНДЫ СКРИПТ)", actualSeal: "Алхимик мөрі (СӘЙКЕС)", actualWeight: "1.5 МБ", description: "Жасырын жүктеу арқылы зақымдады.", realWorld: "Зақымдалған сайт браузердің осалдығын пайдаланып, скриптті білдіртпей іске қосады." },
        watering_hole: { category: "Саудагер", threatType: "Суат шабуылы", displayName: "Нан арбасы", claimedSender: "Наубайшылар гильдиясы", claimedSeal: "Наубайшылар мөрқалыбы", claimedWeight: "50 КБ", actualSender: "trusted-bakery.com (СӘЙКЕС)", actualRoute: "https://trusted-bakery.com/update", actualSeal: "Мерзімі өткен", actualWeight: "2.1 МБ", description: "Наубайхана сайты бұзылған.", realWorld: "Хакерлер құрбаны жиі кіретін сайтты (мысалы, форумды) зақымдайды." },
        ransomware_rider: { category: "Жарлық", threatType: "Төлем бопсалау", displayName: "Дүрбелеңдегі салт атты", claimedSender: "Алыс күзет бекеті", claimedSeal: "Күзет белгісі", claimedWeight: "35 КБ", actualSender: "extortionists.biz (СӘЙКЕС ЕМЕС)", actualRoute: "http://black-hand.net", actualSeal: "Жоқ", description: "Бопсалаушы бағдарлама қойманы бұғаттады.", realWorld: "Вирус барлық файлдарыңызды шифрлап, криптовалютамен төлем талап етеді." },
        authority_impersonation: { category: "Жарлық", threatType: "Бөтен адам ретінде көріну", displayName: "Корольдік паладин", claimedSender: "Лорд-протектор", claimedSeal: "Лорд-протектордың мөрі", claimedWeight: "10 КБ", actualSender: "impostor-guild.net (СӘЙКЕС ЕМЕС)", actualRoute: "https://impostor-guild.net", actualSeal: "Жалған мөрқалып", description: "Салт атты өзін Қорғаушымын деп таныстырды.", realWorld: "Алаяқ полиция қызметкері ретінде қоңырау шалып, компьютеріңізге кіруді талап етеді." },
        baiting_lottery: { category: "Жарлық", threatType: "Еліктіру", displayName: "Жаршы-шабарман", claimedSender: "Әл-ауқат комитеті", claimedSeal: "Әл-ауқат мөрі", claimedWeight: "40 КБ", actualSender: "scammer-jackpot.com (СӘЙКЕС ЕМЕС)", actualRoute: "http://scammer-jackpot.com", actualSeal: "Мөр жоқ", description: "Шиыршық тегін алтынға уәде берді.", realWorld: "Қалқымалы терезе iPhone ұтып алғаныңызды хабарлап, вирусты файлды жүктеткізеді." },
        trojan_exe: { category: "Троян", threatType: "Троян", displayName: "Салық жәшігі", claimedSender: "Салық аудиторы", claimedSeal: "Аудит мөрі", claimedWeight: "1.2 МБ", actualSender: "finance@royal.gov (СӘЙКЕС)", actualRoute: "https://finance.royal.gov", actualSeal: "Аудит мөрі", actualWeight: "1.2 МБ", trueExtension: "Taxes_2026.pdf.exe", description: "Троян қамалды зақымдады.", realWorld: "Файл 'Есеп.pdf.exe' деп аталған. Windows '.exe' жасырады да, пайдаланушы вирусты іске қосады." },
        trojan_vbs: { category: "Троян", threatType: "Троян скрипт", displayName: "Гильдия тізімі", claimedSender: "Қолөнер шебері", claimedSeal: "Қолөнер мөрі", claimedWeight: "45 КБ", actualSender: "crafts@royal.gov (СӘЙКЕС)", actualRoute: "https://crafts.royal.gov", actualSeal: "Қолөнер мөрі", actualWeight: "45 КБ", trueExtension: "GuildMembers.csv.vbs", description: "Жәшік өзін .csv ретінде көрсетті, бірақ бұл скрипт болды.", realWorld: "Құжат ретінде жасырылған скрипт (.vbs) іске қосылғанда бэкдорларды жүктейді." },
        zip_bomb: { category: "Троян", threatType: "Мұрағат бомбасы", displayName: "Қысылған мұрағаттар", claimedSender: "Картограф", claimedSeal: "Картография мөрі", claimedWeight: "10 КБ", actualSender: "maps@royal.gov (СӘЙКЕС)", actualRoute: "https://maps.royal.gov/archive", actualSeal: "Картография мөрі", actualWeight: "500 МБ", trueExtension: "KingdomMap.zip", description: "Мұрағат бомбасы қақпа тізілімін шамадан тыс жүктеді.", realWorld: "Кішкентай ZIP мұрағаты ашылған кезде қатты дискіні қоқыспен толтырып тастайды." },
        mimic_patch: { category: "Мимик", threatType: "Жалған жаңарту", displayName: "Сәулетшілер гильдиясы", claimedSender: "Бас құрылысшы", claimedSeal: "Корольдік арка мөрі", claimedWeight: "8.5 МБ", actualSender: "hackers-scaffold.biz (СӘЙКЕС ЕМЕС)", actualRoute: "http://realm-updater.com", actualSeal: "Жалған бор белгісі", description: "Мимик-сәулетші жалған жаңартуды жүктеуге көндірді.", realWorld: "Сайт «Браузеріңіз ескірді» деп хабарлап, вирус жүктетеді." },
        fake_antivirus: { category: "Мимик", threatType: "Жалған дабыл", displayName: "Корольдік экзорцист", claimedSender: "Қауіпсіздік шіркеуі", claimedSeal: "Экзорцист мөрі", claimedWeight: "3.2 МБ", actualSender: "fake-priest-scam.net (СӘЙКЕС ЕМЕС)", actualRoute: "http://clean-castle.xyz", actualSeal: "Қол қойылмаған", description: "Алаяқ қамалға кірді.", realWorld: "Жалған терезе: «Вирустар табылды!» деп, жалған антивирус сатып алуға мәжбүрлейді." }
    }
};

const CARAVAN_SCENARIOS = [
    { id: "phish_email", type: "pigeon", category: "Royal Messenger", threatType: "Phishing Attack", isMalware: true, displayName: "Messenger Pigeon", claimedSender: "Arch-Bishop", claimedRoute: "royal.gov/mail", claimedSeal: "Holy Clergy", claimedWeight: "15 KB", actualSender: "scammer-guild.biz (MISMATCH)", actualRoute: "http://royal.gov/mail (UNENCRYPTED)", actualSeal: "Forged Wax Seal (FAKE)", actualWeight: "15 KB", description: "Your kingdom fell to credential harvesting.", realWorld: "An attacker sends an email looking like it's from your boss or bank (e.g., support@paypa1.com), asking you to click a link to steal your password." },
    { id: "spear_phish", type: "pigeon", category: "Royal Messenger", threatType: "Spear Phishing", isMalware: true, displayName: "Urgent Courier", claimedSender: "Lord Treasurer", claimedRoute: "treasury@royal.gov", claimedSeal: "Vault Signet", claimedWeight: "22 KB", actualSender: "support@kingdom-taxes.com (MISMATCH)", actualRoute: "https://kingdom-taxes.com/mail (EXTERNAL)", actualSeal: "Replica (FAKE)", actualWeight: "22 KB", description: "A spear phishing scroll fooled the guards.", realWorld: "Hackers research a specific employee and send a highly targeted email appearing to be from the CEO, urgently requesting a wire transfer." },
    { id: "mal_attachment", type: "pigeon", category: "Royal Messenger", threatType: "Phishing Attachment", isMalware: true, displayName: "Invoice Pigeon", claimedSender: "Tax Collector", claimedRoute: "taxes@royal.gov", claimedSeal: "Tax Registry Seal", claimedWeight: "12 KB", actualSender: "taxes@royal.gov (MATCH)", actualRoute: "https://taxes.royal.gov (VALID)", actualSeal: "Missing Signature (FORGED/MISSING)", actualWeight: "480 KB", description: "An invoice scroll carried malware.", realWorld: "You receive an email with a supposed invoice.pdf. When opened, it exploits a vulnerability or runs a macro to install malware." },
    { id: "mitm_messenger", type: "pigeon", category: "Royal Messenger", threatType: "Man-in-the-Middle", isMalware: true, displayName: "Unencrypted Squire", claimedSender: "Baron East-Reach", claimedRoute: "eastreach@baron.net", claimedSeal: "Crest", claimedWeight: "5 KB", actualSender: "eastreach@baron.net (MATCH)", actualRoute: "http://plain-post.net (UNSECURED)", actualSeal: "No Signature (UNSECURED)", actualWeight: "5 KB", description: "The scroll was intercepted in plaintext.", realWorld: "Logging into a website without HTTPS on a public Wi-Fi network allows anyone on the same network to intercept your passwords in plain text." },
    { id: "mal_download", type: "wagon", category: "Foreign Merchant", threatType: "Insecure Download", isMalware: true, displayName: "Free Goods Wagon", claimedSender: "Wizard Guild", claimedRoute: "wizard-spells.org", claimedSeal: "Seal of Wizards", claimedWeight: "2.4 MB", actualSender: "hackers-guild.ru (MISMATCH)", actualRoute: "http://wizard-spells.org (UNENCRYPTED)", actualSeal: "Expired Mark (INVALID)", actualWeight: "2.4 MB", description: "Your kingdom fell to a drive-by malware download.", realWorld: "Downloading 'free' software from unofficial, shady websites often bundles hidden malware or adware with the installer." },
    { id: "homograph_spoof", type: "wagon", category: "Foreign Merchant", threatType: "Domain Spoofing", isMalware: true, displayName: "Bank Cart", claimedSender: "Treasury Bank", claimedRoute: "https://royalbank.com", claimedSeal: "Bank Crest", claimedWeight: "1.8 MB", actualSender: "https://royаlbank.com (Cyrillic Spoof)", actualRoute: "https://royаlbank.com (EXTERNAL)", actualSeal: "Unverified (FAKE)", actualWeight: "1.8 MB", description: "A spoofed domain breached your castle.", realWorld: "An attacker registers a domain using Cyrillic characters that look identical to a real site (e.g., 'a'pple.com) to trick you into entering credentials." },
    { id: "driveby_wagon", type: "wagon", category: "Foreign Merchant", threatType: "Drive-by Download", isMalware: true, displayName: "Traveling Alchemist", claimedSender: "Alchemist Guild", claimedRoute: "https://alchemists.org", claimedSeal: "Alchemist Seal", claimedWeight: "200 KB", actualSender: "alchemists.org (MATCH)", actualRoute: "https://alchemists.org/exploit.js (MALICIOUS SCRIPT)", actualSeal: "Alchemist Seal (MATCH)", actualWeight: "1.5 MB", description: "A drive-by exploit kit infected the castle.", realWorld: "Visiting a compromised website that silently runs a malicious script in the background, exploiting your browser to download malware." },
    { id: "watering_hole", type: "wagon", category: "Foreign Merchant", threatType: "Watering Hole Attack", isMalware: true, displayName: "Bread Supply", claimedSender: "Baker Guild", claimedRoute: "https://bakery.com", claimedSeal: "Baker Stamp", claimedWeight: "50 KB", actualSender: "bakery.com (MATCH)", actualRoute: "https://bakery.com/update (EXPIRED CERT)", actualSeal: "Expired Cert (EXPIRED)", actualWeight: "2.1 MB", description: "The local bakery's site was hacked to host malware.", realWorld: "Hackers infect a specific website they know their target frequently visits (like an industry forum or local cafe site) to infect the target's devices." },
    { id: "ransomware_rider", type: "rider", category: "Urgent Decree", threatType: "Ransomware", isMalware: true, displayName: "Dark Rider", claimedSender: "High Sentry", claimedRoute: "sentry-dispatch.gov", claimedSeal: "Guard Badge", claimedWeight: "35 KB", actualSender: "extortionists.biz (MISMATCH)", actualRoute: "http://black-hand.net (EXTERNAL)", actualSeal: "None (MISSING)", actualWeight: "35 KB", description: "Ransomware locked the castle vault.", realWorld: "Malware encrypts all your files and demands cryptocurrency to give you the decryption key. Often relies on panic and urgency." },
    { id: "authority_impersonation", type: "rider", category: "Urgent Decree", threatType: "Social Engineering", isMalware: true, displayName: "Sovereign Paladin", claimedSender: "Lord Protector", claimedRoute: "lord-protector@royal.gov", claimedSeal: "Protector Signet", claimedWeight: "10 KB", actualSender: "impostor-guild.net (MISMATCH)", actualRoute: "https://impostor-guild.net (EXTERNAL)", actualSeal: "Forged Stamp (FAKE)", actualWeight: "10 KB", description: "Authority impersonation tricked the guards.", realWorld: "A scammer calls or emails pretending to be IT support or law enforcement, demanding remote access to your computer to 'fix' a fake issue." },
    { id: "baiting_lottery", type: "rider", category: "Urgent Decree", threatType: "Social Engineering", isMalware: true, displayName: "Heralding Squire", claimedSender: "Welfare Board", claimedRoute: "lottery@royal.gov", claimedSeal: "Welfare Stamp", claimedWeight: "40 KB", actualSender: "scammer-jackpot.com (MISMATCH)", actualRoute: "http://scammer-jackpot.com (UNSECURED)", actualSeal: "None (MISSING)", actualWeight: "40 KB", description: "The baiting scroll promised a free pot of gold.", realWorld: "A pop-up or email claims you won an iPhone or lottery. To claim it, you must download a file or fill out a form, which steals your data." },
    { id: "trojan_exe", type: "trojan", category: "Trojan Horse", threatType: "Trojan", isMalware: true, displayName: "Taxes Crate", claimedSender: "Tax Auditor", claimedRoute: "finance@royal.gov", claimedSeal: "Auditing Seal", claimedWeight: "1.2 MB", actualSender: "finance@royal.gov (MATCH)", actualRoute: "https://finance.royal.gov (VALID)", actualSeal: "Auditing Seal (MATCH)", actualWeight: "1.2 MB", trueExtension: "Taxes_2026.pdf.exe", description: "A double-extension Trojan infected the castle.", realWorld: "A file is named 'Tax_Report.pdf.exe'. Windows hides the '.exe', so the user thinks it's a safe PDF, but it's an executable virus." },
    { id: "trojan_vbs", type: "trojan", category: "Trojan Horse", threatType: "Trojan Script", isMalware: true, displayName: "Guild Crate", claimedSender: "Guildmaster", claimedRoute: "crafts@royal.gov", claimedSeal: "Crafting Seal", claimedWeight: "45 KB", actualSender: "crafts@royal.gov (MATCH)", actualRoute: "https://crafts.royal.gov (VALID)", actualSeal: "Crafting Seal (MATCH)", actualWeight: "45 KB", trueExtension: "GuildMembers.csv.vbs", description: "The crate claimed to be a .csv, but it was actually a .vbs script.", realWorld: "A script file (.vbs, .bat) disguised as a data file or document. When double-clicked, it runs system commands to download backdoors." },
    { id: "zip_bomb", type: "trojan", category: "Trojan Horse", threatType: "Zip Bomb Attack", isMalware: true, displayName: "Archives", claimedSender: "Cartographer", claimedRoute: "maps@royal.gov", claimedSeal: "Cartography Seal", claimedWeight: "10 KB", actualSender: "maps@royal.gov (MATCH)", actualRoute: "https://maps.royal.gov (VALID)", actualSeal: "Cartography Seal (MATCH)", actualWeight: "500 MB", trueExtension: "KingdomMap.zip", description: "A Zip Bomb crashed the gate registry.", realWorld: "A tiny 10KB ZIP file is sent. When extracted, it expands into petabytes of junk data, instantly consuming all hard drive space and crashing the system." },
    { id: "mimic_patch", type: "mimic", category: "The Mimic", threatType: "Fake Browser Update", isMalware: true, displayName: "Royal Architect", claimedSender: "Chief Builder", claimedRoute: "builders.royal.gov", claimedSeal: "Arch Seal", claimedWeight: "8.5 MB", actualSender: "hackers.biz (MISMATCH)", actualRoute: "http://updater-patch.com (EXTERNAL)", actualSeal: "Forged Mark (FAKE)", actualWeight: "8.5 MB", description: "A mimic architect tricked you into downloading a fake update.", realWorld: "A pop-up on a website falsely claims your Chrome or Flash player is outdated. Clicking 'Update' downloads malware instead of a patch." },
    { id: "fake_antivirus", type: "mimic", category: "The Mimic", threatType: "Tech Support Scam", isMalware: true, displayName: "Royal Exorcist", claimedSender: "Church of Security", claimedRoute: "church-security.gov", claimedSeal: "Holy Seal", claimedWeight: "3.2 MB", actualSender: "fake-priest-scam.net (MISMATCH)", actualRoute: "http://clean-castle.xyz (EXTERNAL)", actualSeal: "Unsigned (MISSING)", actualWeight: "3.2 MB", description: "A tech support scammer infected the castle.", realWorld: "A fake warning claims 'Your PC is infected with viruses!' and prompts you to buy their fake antivirus software, which is actually malware itself." },
    { id: "safe_cleric", type: "pigeon", category: "Royal Messenger", threatType: "Safe", isMalware: false, displayName: "Holy Pigeon", claimedSender: "Chamberlain", claimedRoute: "https://chamberlain.gov", claimedSeal: "Royal Seal", claimedWeight: "8 KB", actualSender: "Chamberlain (chamberlain@royal.gov)", actualRoute: "https://chamberlain.gov (SECURE)", actualSeal: "Royal Seal (VALID)", actualWeight: "8 KB", description: "A legitimate scroll containing tax instructions." },
    { id: "safe_merchant", type: "wagon", category: "Foreign Merchant", threatType: "Safe", isMalware: false, displayName: "Grain Supply", claimedSender: "Farming Guild", claimedRoute: "https://farms.gov", claimedSeal: "Farming Seal", claimedWeight: "320 KB", actualSender: "Farming Guild (farms@royal.gov)", actualRoute: "https://farms.gov (SECURE)", actualSeal: "Farming Seal (VALID)", actualWeight: "320 KB", description: "A valid supply wagon delivering grain." },
    { id: "safe_rider", type: "rider", category: "Urgent Decree", threatType: "Safe", isMalware: false, displayName: "Scout Rider", claimedSender: "Border Watch", claimedRoute: "borderwatch@royal.gov", claimedSeal: "Watchtower Signet", claimedWeight: "12 KB", actualSender: "Border Watch (borderwatch@royal.gov)", actualRoute: "https://borderwatch.gov (SECURE)", actualSeal: "Watchtower Signet (VALID)", actualWeight: "12 KB", description: "An urgent border patrol warning about wild boars." },
    { id: "safe_crate", type: "trojan", category: "Trojan Horse", threatType: "Safe", isMalware: false, displayName: "Armor Crate", claimedSender: "Blacksmith Guild", claimedRoute: "blacksmiths@royal.gov", claimedSeal: "Blacksmith Seal", claimedWeight: "1.4 MB", actualSender: "Blacksmith Guild (blacksmiths@royal.gov)", actualRoute: "https://blacksmiths.gov (SECURE)", actualSeal: "Blacksmith Seal (VALID)", actualWeight: "1.4 MB", trueExtension: "Ledger.xlsx (EXCEL DATA)", description: "A safe, heavy crate of shield blueprints." },
    { id: "safe_architect", type: "mimic", category: "The Mimic", threatType: "Safe", isMalware: false, displayName: "Royal Mason", claimedSender: "Masonry Lead", claimedRoute: "masonry.gov", claimedSeal: "Mason Crest Seal", claimedWeight: "4.5 MB", actualSender: "Masonry Lead (masonry@royal.gov)", actualRoute: "https://masonry.gov (SECURE)", actualSeal: "Mason Crest Seal (VALID)", actualWeight: "4.5 MB", description: "A legitimate Royal Mason carrying building specs." }
];

const REPORT_THREAT_OPTIONS = [
    { text: "Phishing / Domain Spoofing", id: "phish" }, { text: "Double Extension Trojan", id: "trojan" },
    { text: "Zip Bomb Payload", id: "zip_bomb" }, { text: "Social Engineering / Baiting", id: "social" },
    { text: "Unencrypted Protocol (MITM)", id: "mitm" }, { text: "Fake Update / Patch", id: "fake_update" }
];

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
    if (tt.includes("middle") || tt.includes("unencrypted")) return "mitm";
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
    if (lvl === 1) pool = [ "phish_email", "safe_merchant", "spear_phish", "safe_cleric", "mitm_messenger" ];
    else if (lvl === 2) pool = [ "trojan_exe", "safe_crate", "mal_download", "homograph_spoof", "zip_bomb", "safe_rider", "mal_attachment" ];
    else pool = [ "mimic_patch", "safe_architect", "ransomware_rider", "authority_impersonation", "fake_antivirus", "watering_hole", "driveby_wagon", "baiting_lottery" ];

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
        let txt = opt.text;
        if (currentLang === 'ru') {
            if (opt.id === "phish") txt = "Фишинг / Подмена домена"; else if (opt.id === "trojan") txt = "Троян (Двойное расширение)"; else if (opt.id === "zip_bomb") txt = "Архивная бомба"; else if (opt.id === "social") txt = "Социальная инженерия"; else if (opt.id === "mitm") txt = "Незашифрованный протокол"; else if (opt.id === "fake_update") txt = "Фальшивое обновление";
        } else if (currentLang === 'kk') {
            if (opt.id === "phish") txt = "Фишинг / Доменді ауыстыру"; else if (opt.id === "trojan") txt = "Троян (Қос кеңейтім)"; else if (opt.id === "zip_bomb") txt = "Мұрағат бомбасы"; else if (opt.id === "social") txt = "Әлеуметтік инженерия"; else if (opt.id === "mitm") txt = "Шифрланбаған хаттама"; else if (opt.id === "fake_update") txt = "Жалған жаңарту";
        }
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
            showFeedback(true, UI_TRANSLATIONS[currentLang].feedbackSuccessReport + tType + UI_TRANSLATIONS[currentLang].feedbackSuccessReportSuffix + desc + rwText);
        } else {
            wisdom += 3; recordResolvedThreat(correctThreat); sfx.playArrest();
            showFeedback(true, UI_TRANSLATIONS[currentLang].feedbackIncompleteReport + tType + UI_TRANSLATIONS[currentLang].feedbackIncompleteReportSuffix + desc + rwText);
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
