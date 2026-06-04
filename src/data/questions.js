// ============================================================
// QUESTIONS — Edit text_en / text_ar / campMessage_en / campMessage_ar
// Profile keys: creative | engineer | gameDesigner | aiExplorer | leader
// 7 questions total. Q7 is the weighted tiebreaker (scores ×3).
// ============================================================

export const questions = [
  {
    id: 1,
    text_en: "When your child has free time, they most often…",
    text_ar: "لما ابنك يكون فاضي، الأغلب بيعمل شو؟",
    campMessage_en: "At The Tech Camp, every type of learner finds their zone.",
    campMessage_ar: "في The Tech Camp، كل طفل بيلاقي نشاطو المفضل.",
    answers: [
      { text_en: "Draw, build or invent something",                    text_ar: "يرسم، يبني أو يخترع شي",                        scores: { creative: 2 } },
      { text_en: "Take things apart to see how they work",             text_ar: "يفكك الأشياء ليفهم كيف تشتغل",                  scores: { engineer: 2 } },
      { text_en: "Play video games or design levels",                  text_ar: "يلعب فيديو غيم أو يصمم مستويات",                scores: { gameDesigner: 2 } },
      { text_en: "Ask questions about technology and AI",              text_ar: "يسأل عن التكنولوجيا والذكاء الاصطناعي",          scores: { aiExplorer: 2 } },
      { text_en: "Organize games or lead activities with friends",     text_ar: "ينظم ألعاب أو يقود نشاطات مع رفاقو",             scores: { leader: 2 } },
    ],
  },
  {
    id: 2,
    text_en: "Which activity would your child enjoy most?",
    text_ar: "أي نشاط ابنك بيحبو أكتر؟",
    campMessage_en: "We offer all of these at The Tech Camp — and more.",
    campMessage_ar: "عنا كل هالأنشطة في The Tech Camp — وأكتر.",
    answers: [
      { text_en: "Designing and animating a cartoon character",        text_ar: "تصميم وتحريك شخصية كرتونية",                    scores: { creative: 2 } },
      { text_en: "Building and programming a robot",                  text_ar: "بناء وبرمجة روبوت",                              scores: { engineer: 2 } },
      { text_en: "Creating their own video game",                     text_ar: "إنشاء لعبة فيديو خاصة فيو",                     scores: { gameDesigner: 2 } },
      { text_en: "Training an AI to recognize images",                text_ar: "تدريب ذكاء اصطناعي يتعرف على صور",               scores: { aiExplorer: 2 } },
      { text_en: "Running a team project and presenting it",          text_ar: "إدارة مشروع جماعي وتقديمو",                     scores: { leader: 2 } },
    ],
  },
  {
    id: 3,
    text_en: "When your child fails at something, they usually…",
    text_ar: "لما ابنك يفشل بشي، عادةً بيشو؟",
    campMessage_en: "Failure is just the first version. We teach kids to iterate.",
    campMessage_ar: "الفشل هو النسخة الأولى بس. بنعلم الأولاد يطوروا من أخطاءهم.",
    answers: [
      { text_en: "Redesign and try a totally new idea",               text_ar: "يعيد التصميم ويجرب فكرة جديدة كلياً",            scores: { creative: 2 } },
      { text_en: "Debug — find exactly what went wrong",              text_ar: "يحلل ويكتشف بالضبط وين الغلط",                  scores: { engineer: 2 } },
      { text_en: "Try again to beat their own score",                 text_ar: "يحاول مرة تانية ليتجاوز نتيجتو",                scores: { gameDesigner: 2 } },
      { text_en: "Search online for a smarter solution",              text_ar: "يبحث أونلاين عن حل أذكى",                       scores: { aiExplorer: 2 } },
      { text_en: "Ask the group what they think went wrong",          text_ar: "يسأل المجموعة شو رأيهم وين الغلط",               scores: { leader: 2 } },
    ],
  },
  {
    id: 4,
    text_en: "What question does your child ask most often?",
    text_ar: "شو السؤال اللي ابنك بيسألو أكتر؟",
    campMessage_en: "Curious kids thrive at The Tech Camp.",
    campMessage_ar: "الأطفال الفضوليون بيزدهروا في The Tech Camp.",
    answers: [
      { text_en: '"Can I make that myself?"',                         text_ar: '"فيني أصنع هيدا بنفسي؟"',                        scores: { creative: 2 } },
      { text_en: '"How does that actually work?"',                    text_ar: '"كيف هيدا الشي بيشتغل بالضبط؟"',                scores: { engineer: 2 } },
      { text_en: '"What\'s the fastest way to win?"',                 text_ar: '"شو أسرع طريقة للفوز؟"',                         scores: { gameDesigner: 2 } },
      { text_en: '"Can a computer do this automatically?"',           text_ar: '"في كمبيوتر يقدر يعمل هيدا تلقائياً؟"',          scores: { aiExplorer: 2 } },
      { text_en: '"Who wants to join my team?"',                      text_ar: '"مين بدو ينضم لفريقي؟"',                         scores: { leader: 2 } },
    ],
  },
  {
    id: 5,
    text_en: "Which project would your child be most excited to show off?",
    text_ar: "أي مشروع ابنك بيكون أكتر متحمس يعرضو؟",
    campMessage_en: "At The Tech Camp, every child leaves with a project they built themselves.",
    campMessage_ar: "في The Tech Camp، كل طفل بيطلع بمشروع بناه بنفسو.",
    answers: [
      { text_en: "An animated story they wrote and illustrated with AI", text_ar: "قصة متحركة كتبها ورسمها بمساعدة الذكاء الاصطناعي", scores: { creative: 2, aiExplorer: 1 } },
      { text_en: "A robot they built and programmed to solve a maze",    text_ar: "روبوت بناه وبرمجو ليحل متاهة",                  scores: { engineer: 2 } },
      { text_en: "A video game they designed from scratch",              text_ar: "لعبة فيديو صممها من الصفر",                    scores: { gameDesigner: 2 } },
      { text_en: "An AI tool that recognizes objects or faces",          text_ar: "أداة ذكاء اصطناعي تتعرف على أشياء أو وجوه",     scores: { aiExplorer: 2 } },
      { text_en: "A team app or website they led and launched",          text_ar: "تطبيق أو موقع جماعي قادو وأطلقو",               scores: { leader: 2 } },
    ],
  },
  {
    id: 6,
    text_en: "What would help your child the most right now?",
    text_ar: "شو بيساعد ابنك أكتر هلق؟",
    campMessage_en: "The Tech Camp gives kids real skills — and real confidence.",
    campMessage_ar: "The Tech Camp بيعطي الأولاد مهارات حقيقية — وثقة حقيقية.",
    answers: [
      { text_en: "A space to create freely without limits",           text_ar: "مساحة يبدع فيها بحرية بدون حدود",               scores: { creative: 2 } },
      { text_en: "Structured challenges that build real skills",      text_ar: "تحديات منظمة تبني مهارات حقيقية",               scores: { engineer: 2 } },
      { text_en: "Fun, competitive activities that keep them focused", text_ar: "نشاطات ممتعة تنافسية تخليه يركز",              scores: { gameDesigner: 2 } },
      { text_en: "Exposure to the latest tech tools and AI",          text_ar: "تعرض لأحدث الأدوات التقنية والذكاء الاصطناعي",   scores: { aiExplorer: 2 } },
      { text_en: "A team environment that builds confidence",         text_ar: "بيئة جماعية تبني الثقة بالنفس",                 scores: { leader: 2 } },
    ],
  },
  {
    id: 7,
    text_en: "What do you most want your child to gain from The Tech Camp?",
    text_ar: "شو أكتر شي بدك ابنك يكتسبو من The Tech Camp؟",
    campMessage_en: "This is what we're here for.",
    campMessage_ar: "هيدا هو سبب وجودنا.",
    answers: [
      { text_en: "The ability to create and express themselves through technology", text_ar: "القدرة على الإبداع والتعبير عن النفس من خلال التكنولوجيا", scores: { creative: 3 } },
      { text_en: "Strong logical thinking and real engineering skills",             text_ar: "تفكير منطقي قوي ومهارات هندسية حقيقية",                  scores: { engineer: 3 } },
      { text_en: "Focus, strategy and a competitive mindset",                       text_ar: "التركيز والاستراتيجية وعقلية تنافسية",                    scores: { gameDesigner: 3 } },
      { text_en: "Fluency in AI and future technologies",                           text_ar: "إتقان الذكاء الاصطناعي وتقنيات المستقبل",                 scores: { aiExplorer: 3 } },
      { text_en: "Leadership, teamwork and communication skills",                   text_ar: "مهارات القيادة والعمل الجماعي والتواصل",                  scores: { leader: 3 } },
    ],
  },
];
