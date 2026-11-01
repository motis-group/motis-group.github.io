export interface Leaf {
  trigger: string;
  sub: string;
  title: string;
  kicker: string;
  headline: string;
  paragraphs: string[];
}

export const LEAVES: Leaf[] = [
  {
    "trigger": "costs",
    "sub": "exposed",
    "title": "the bill keeps growing, and somebody is asking about it",
    "kicker": "the bills keep growing",
    "headline": "The bill keeps growing, and now somebody is asking about it.",
    "paragraphs": [
      "A number on an invoice got big enough to be noticed by somebody whose job is noticing. Now there is a question on the table — what is this spend, and what do we get for it — and “the platform needs it” does not survive a second asking.",
      "The honest answer usually exists in the query history: which workloads cost what, which of them anyone still reads, and which run hourly for a dashboard nobody has opened since March.",
      "I put that answer together fixed price and fast: per-workload cost, what is deletable today, what needs a fix, and the check that stops it creeping back once the question has been answered.",
      "Twenty minutes with read-only access to the query history is usually enough. I’ll tell you what I found and what it costs you per month, whether or not there’s a job in it."
    ]
  },
  {
    "trigger": "costs",
    "sub": "quiet",
    "title": "the bill keeps growing, and only you are watching it",
    "kicker": "the bills keep growing",
    "headline": "The bill keeps growing, and nobody can say why.",
    "paragraphs": [
      "Warehouse spend has a shape. It rarely jumps; it creeps. A query gets copied into a dashboard, the dashboard gets scheduled hourly, the table underneath doubles, and eighteen months later the bill is a line item somebody asks about in a budget meeting.",
      "The awkward part is that nobody owns it. The engineers who wrote the queries have moved on to other work, finance sees a total and not a cause, and the platform keeps doing exactly what it was told.",
      "This is a findable problem. The query history says which workloads cost what, which schedules run for nobody, and which tables get scanned in full for a filter on one column. Most of the spend usually sits in a handful of places.",
      "Fixing it once is easy, and it grows back. What I hand over is the check that notices the creep while it is still one query, not a quarter’s overrun — the agent flags it, I review the fix.",
      "Twenty minutes with read-only access to the query history is usually enough. I’ll tell you what I found and what it costs you per month, whether or not there’s a job in it."
    ]
  },
  {
    "trigger": "it-broke",
    "sub": "caught",
    "title": "you caught it before anyone else did",
    "kicker": "you got caught out",
    "headline": "Something went wrong and you found it yourselves.",
    "paragraphs": [
      "A number was wrong, or two systems disagreed, and somebody spotted it before it reached anyone who would have minded.",
      "Worth being precise about why it got caught. Somebody was paying attention. Attention works on the common case and fails on the exception, which is the one that matters, and the next exception arrives while that person is on leave or looking at something else.",
      "This is the cheapest moment to fix it and the hardest to argue for internally, because nothing visibly broke. The argument is that you already know where the gap is. Most people are still looking for theirs.",
      "Twenty minutes with read-only access is usually enough. Nothing is on fire, so there is no rush at this end either. I’ll tell you what I found whether or not there’s a job in it."
    ]
  },
  {
    "trigger": "it-broke",
    "sub": "outside",
    "title": "someone outside found it first",
    "kicker": "you got caught out",
    "headline": "A customer or a regulator found it before you did.",
    "paragraphs": [
      "The wrong number stings for a day. The cost is the conversation afterwards, when somebody asks how you will stop it happening again and you cannot point at the thing that was meant to catch it, because a person was doing that and people miss things.",
      "Worth knowing how long the gap had been open before it showed. If the failure arrived immediately and the cause was obvious, it is a technical fault with a technical fix and you do not need me.",
      "If it surfaced months later, looked like a data quality problem or a vendor problem, and has happened before in a slightly different shape, then what drifted is the description of how the work is meant to run. Nobody reconciled it against how the work actually runs, and it will keep recurring in new shapes until somebody does.",
      "With a regulator involved there is a date on the answer now. What closes it is something you can show another person: the check that runs, what it looks at, what happens when it fails.",
      "Twenty minutes with read-only access is usually enough. If there is already a date on this, say so and I will work to it. If your access has to go through a process, that is fine, I have done it before."
    ]
  },
  {
    "trigger": "its-you",
    "sub": "exposed",
    "title": "you are the check, and it shows outside",
    "kicker": "it is slowing you down",
    "headline": "You are the last check, and what gets past you reaches customers or a regulator.",
    "paragraphs": [
      "In most businesses there is one person, not a system, who catches the error before it goes out. Nobody appointed them. It accreted around a gap, and here that person is you.",
      "You have tried handing it over and it half worked, because whoever you handed it to does not know that one supplier always invoices late, or which figure looks wrong for a reason. You know because you have been there for all of it.",
      "Which makes you a single point of failure with consequences attached to it. A week of illness and something reaches somebody who counts.",
      "The work is getting what you know into checks that fail loudly, starting with whatever faces outward, so that being unavailable stops being a risk to the business.",
      "Twenty minutes with read-only access is usually enough. If there is already a date on this, say so and I will work to it. If your access has to go through a process, that is fine, I have done it before."
    ]
  },
  {
    "trigger": "its-you",
    "sub": "quiet",
    "title": "you are the check, and it is your ceiling",
    "kicker": "it is slowing you down",
    "headline": "You are the last check, and the cost lands on you rather than on a customer.",
    "paragraphs": [
      "Everything goes past you before it goes out. You have tried handing it over and it half worked, because whoever you handed it to does not carry what you carry. They do not know which supplier always invoices late, or which figure looks odd in March for a reason. You know because you were there.",
      "Nobody outside is affected, so nothing forces the issue. What it costs you is room. You cannot hand the job on, so the business cannot take more work than you personally have hours for.",
      "You cannot delegate a rule you have never written down. Most people in this position go looking for somebody more careful, and careful was never the missing part.",
      "The work is writing the rule down in a form that runs without you, so the checking stops being anyone’s job.",
      "Twenty minutes with read-only access is usually enough. Nothing is on fire, so there is no rush at this end either. I’ll tell you what I found whether or not there’s a job in it."
    ]
  },
  {
    "trigger": "not-sure",
    "sub": "exposed",
    "title": "you are looking, but someone outside would notice",
    "kicker": "just having a look",
    "headline": "You are having a look, and a customer or a regulator would find out if the numbers were wrong.",
    "paragraphs": [
      "Those two answers pull against each other. If somebody outside would notice, there is exposure here that nobody has priced. You may simply not have had the incident that makes it feel urgent yet.",
      "Nothing is forcing it, which is why it stays on the list. Work like this gets done when an event turns up with a date on it: an acquisition, a renewal, an audit, a contract that requires numbers you cannot currently produce. Until one arrives it is always next quarter.",
      "Doing it before the event is cheaper in every direction. No deadline set by somebody else, no explaining, and no rebuilding confidence at the same time as fixing the cause.",
      "Twenty minutes tells you whether there is anything here worth acting on.",
      "Twenty minutes with read-only access is usually enough. If there is already a date on this, say so and I will work to it. If your access has to go through a process, that is fine, I have done it before."
    ]
  },
  {
    "trigger": "not-sure",
    "sub": "quiet",
    "title": "you don’t trust the numbers",
    "kicker": "just having a look",
    "headline": "You don’t quite believe your own reporting.",
    "paragraphs": [
      "Nothing is on fire. Two reports disagree by a bit, somebody quietly reconciles them before the meeting, and nobody is sure which one was right. It has been that way long enough to feel normal.",
      "Nobody outside would notice, which tells me there is probably nothing here urgent enough to pay me for yet. Work like this gets done when an event arrives with a date on it. Without one it competes with everything else on the list and loses, every quarter, and that is the correct outcome. If I took your money today I would be selling you a fix for something you have already absorbed.",
      "So take the method instead. This is how I read a system I’ve never seen and work out where it has drifted from what it describes. It takes about twenty minutes and you can run it on your own this afternoon.",
      "⊹ start with whatever claims to be the complete list: the register, the master sheet, the report with “all” in its name",
      "⊹ take two systems that describe the same thing and count where they disagree",
      "⊹ look for the version words: new, v2, final, current, copy. Anything carrying two of them has no owner",
      "⊹ find the field meant to classify every record, and count how many are blank",
      "⊹ find the spreadsheet somebody keeps on the side. Whatever is in it is what the system does not hold, and that gap is the whole problem",
      "⊹ ask who would notice if each of those was wrong for a week",
      "The things that change this: somebody who holds the rules in their head hands in notice, a customer or an auditor notices before you do, or a contract turns up asking for numbers you cannot currently produce. Any of those, call me."
    ]
  },
  {
    "trigger": "someone-left",
    "sub": "exposed",
    "title": "the knowledge left and it shows outside",
    "kicker": "someone is leaving",
    "headline": "The person who knew has gone, and the mistakes reach people outside the building.",
    "paragraphs": [
      "The systems still work. The data is still there. What left with them is the part nobody wrote down: which exceptions are real, which supplier is always late, which figure looks wrong in March for a reason. They knew that because they were there when it happened.",
      "Whoever picked up the job now reconstructs those rules from memory. They get most of them right, and the ones they get wrong surface later as something a customer or a regulator finds.",
      "That sets the order of the work. Anything facing outward gets its checks first, ahead of the tidying that would feel more satisfying.",
      "If they are still serving notice, say so now. An hour with them while they are in the building beats a week of guessing afterwards. It is the difference between writing down what somebody knows and reconstructing it from what they left behind.",
      "Twenty minutes with read-only access is usually enough. If there is already a date on this, say so and I will work to it. If your access has to go through a process, that is fine, I have done it before."
    ]
  },
  {
    "trigger": "someone-left",
    "sub": "quiet",
    "title": "the knowledge left, and it costs you time",
    "kicker": "someone is leaving",
    "headline": "The person who knew has gone, and so far it has only cost you time.",
    "paragraphs": [
      "The systems still work and the data is still there. What left is the part nobody wrote down: which exceptions are real, which supplier is always late, which figure looks odd in March for a reason. They knew because they were there when it happened.",
      "Whoever picked up the job reconstructs those rules every time, gets most of them right, and quietly gets some wrong. None of it has reached a customer yet.",
      "So nothing is forcing the issue, and that is the part worth watching. Work without a deadline gets postponed until it acquires one, and it acquires one on somebody else’s schedule rather than yours.",
      "If they are still serving notice, say so now. An hour with them while they are in the building beats a week of guessing afterwards.",
      "Twenty minutes with read-only access is usually enough. Nothing is on fire, so there is no rush at this end either. I’ll tell you what I found whether or not there’s a job in it."
    ]
  }
];
