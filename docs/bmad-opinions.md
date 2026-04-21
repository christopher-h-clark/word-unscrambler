# BMAD Opinions

## Overview

After excessive scope creep on my first BMAD experiment, I started a much
simpler BMAD experiment. I see a lot of value in the brainstorming and advanced
elicitation features of BMAD, _but_ they must be employed judiciously, as it's
easy for them to lead to unanticipated increase in scope. I specifically focused
on my idea, resisting BMAD's attempts to get me to think through features to
differentiate my project from the many similar sites already available.

What I'm implementing here is a simple word unscrambler, inspired by
[Word Unscrambler](https://wordunscrambler.me/). It's super simple, accepting
3-7 letters, and unscrambling them against a dictionary.

Also, this time I remembered to use Sonnet for the `/bmad-dev-story` tasks. This
is based on my conversations with Kevin and with Samuel and Ryan.

## Questions

This experiment was to answer four questions:

1. What did you like or dislike about the process?
2. What did AI do well, and where did it fail?
3. What would you clean up in the code if you were to ship this project?
4. What would you do differently if you were to do this again?

### What did you like or dislike about the process?

#### What I Liked

- This time, it seemed to move quite a bit faster than the first time, in part
  because I wasn't trying to use all of the advanced elicitation methods at each
  step.
- Things seemed to go smoother this time, perhaps because of the simplicity. I
  think that simplicity may be the key to getting good results at this point.
- From a management perspective, I think AI forces us to be very specific, and
  helps us to incrementally generate the needed specificity. I once had the
  manager ask 3 engineers to estimate a project, but didn't tell them that he
  was going to farm it out to the entire team (8–10 engineers). They went
  through and made user story titles that made sense to them, but didn't fill
  out the details, because they had done the initial investigation and
  implicitly understood the details, and expected to be doing all of the work
  themselves. The timelines didn't account for the need to communicate the
  specifics to other engineers who weren't as familiar with the code base. The
  manager was not happy to receive push-back regarding the lack of definition in
  the user stories and unwillingness to commit to timelines that the newer
  engineers couldn't assess. Using the brainstorming and advanced elicitation
  techniques from BMAD could have helped the manager and 3 senior engineers to
  be more complete and specific. I find it somewhat ironic that the specificity
  required by AI may ultimately improve human interaction in the workplace
  because people will have become more accustomed to greater precision in
  expressing their requests. Experience with some of the advanced elicitation
  techniques in BMAD could also enable someone receiving a vague request to
  guide the person making the request to define and express missing details.

#### What I Disliked

- The BMAD method seemed a bit optimistic. In the architecture document, after
  step 5, it said, "**[C]** Continue – Save these patterns and finalize the
  architecture" but then added another 258 lines and said, "**[C]** Continue –
  Save this structure and validate the complete architecture" which seems like
  we have more steps and weren't finished at step 5. The architecture document
  seemed to take 7 steps. Similarly the PRD would vary between estimating 11 or
  13 total steps and sometimes wouldn't indicate how far along we were. I think
  this is something the BMAD method could adjust in subsequent versions. It's
  not intrinsic to the methodology, just status reporting and expectation
  management.

### What did AI do well, and where did it fail?

#### What AI Did Well

- It respected my wishes to keep things simple, even generating its own
  statements to that effect.
- I was surprised at the quality of the UX examples the AI generated. Typography
  was extremely simple and the most sophisticated background was a gradient, but
  it looked far better than I expected. I was envisioning a left-aligned layout
  with some sort of image to the right, but went with a centered layout with a
  gradient because I didn't want to spend extra time generating a background
  image.
- The implementation readiness analysis discovered the inconsistent placement of
  the `prd.md` file (see below under "Where AI Failed") and offered to
  automatically move it to the correct location.
- The AI model surfaced options for the word list that I hadn't considered. I
  saw a list of 3-letter words on Wiktionary, but they didn't have similar lists
  for longer words. In addition to Wiktionary, it suggested SCOWL, which I'd
  never heard of before, but it looked like a great choice!
- It eventually (during implementation of story 1-4) detected and offered to
  correct the discrepancey between allowing 3–7 vs 3–10 letters, the discrepancy
  between 18 and 24 stories, and the discrepancy between 23 and 24 stories. It
  actually credited me with calling out the issues in this document! I'm fairly
  impressed that it used this non-standard document to identify and fix actual
  issues.
- Implementing Story 2-1, it seemed to do very well. The code review surfaced
  some issues, which it fixed on its own.
- The GitHub action to build kept failing because the client JS bundle was over
  100kB, so I asked Sonnet about it. Sonnet identified that the size check was
  checking the uncompressed bundle size, but ultimately it created a gzipped
  bundle at 68kB. It recommended fixing the test, rather than allowing a larger
  size bundle (which I agree with).

#### Where AI Failed

- Context built quickly. I saw something about keeping context below 20%, but it
  hit 20% in the first step of writing a document. It seemed to forget things I
  told it previously, so it either failed to write it down in the Project
  Context or PRD, or it got lost in the context.
- I changed my mind about the word length, switching from 3-10 letters to 3-7
  letters, but the API specification wasn't updated to reflect that. It would
  have been good for the AI to flag the inconsistency and ask if I wanted to
  stick with 3-10 letters or update the existing documents to indicate 3-7
  letters.
- It put the `prd.md` document in the `planning_artifacts` directory but the
  `ux-design-directions.html` and `ux-design-specification.md` documents in the
  `planning-artifacts` directory. I assume that the BMAD method will fix this
  inconsistency in a future update. For now, I think it would still find them
  all even if I moved the PRD into the `planning-artifacs` directory (it found
  this document, so I explicitly excluded it).
- It calculated 5 epics with 18 stories, but epics 1–4 have 5 stories each and
  epic 5 has 4 stories, which looks like 24 stories to me (and ultimately
  claimed to write 23 stories, but wrote 24!). It's somewhat amusing given that
  computers were initially built to do math accurately. I suppose some stories
  could apply to multiple epics, but I've never seen that in practice.

```
    📋 Epic Structure Created
    5 Epics with 18 Stories:
    1. Epic 1: Project Foundation & Setup (5 stories)
    2. Epic 2: Backend API Implementation (5 stories)
    3. Epic 3: Frontend UI Implementation (5 stories)
    4. Epic 4: Testing & Quality Assurance (5 stories)
    5. Epic 5: Deployment & Documentation (4 stories)
```

- The implementation readiness assessment couldn't find the PRD, so I had to
  tell it that it was located in the `planning_artifacts` directory (which is
  where the earlier process put it!). It noted the inconsistency and offered to
  move it to the `planning-artifacts` directory. So I guess the inconsistency
  was resolved. My guess is that BMAD will fix this in the next version or a
  subsequent version.
- Generating the first story (setting up the code base from an exmaple project),
  it seemed to get confused with the monorepo setup, and then a number of
  commands failed because it couldn't find files.
- It created a number of files for the first story, then deleted them for the
  second. This seemed inefficient.
- Several command lines failed. It seemed odd that the AI would struggle to
  create a command line that works.
- Performing code reviews would often land on the AI identifying a clear next
  step, but not offering something for me to select (like almost every other
  BMAD skill). So I'd essentially re-type the last line of what it told me to
  get it to proceed with the action it suggested. Sort of odd. I suppose BMAD
  will address this in future versions.
- Reviewing story 2-3, Blind Hunter and Edge Case Hunter failed to do anything,
  but the AI allowed me to wait for their results. Seeing nothing happening, I
  asked if they were running, and it told me that they were not. It needs to
  accurately report status.
- Implementing story 2-5, it carried the confusion on the maximum number of
  letters forward, even though it had been corrected previously.
- It failed to update `sprint-status.yaml` as it implemented story 2-5, which
  resulted in inconsistent status information. Story 2-5 was left in the
  `ready-for-dev` state throughout development and code review and Epic 2 was
  left in `in-progress`. Even after fixing the story status, there were
  inconsistencies in the summary and numbers of stories and epics `in-progress`,
  `ready-for-dev`, etc in the summary at the bottom, which were only fixed after
  I called them out.
- During Story 3-1 or 3-2, it decided to start committing files to git without
  being asked. I figured this out when I did the code review and found no
  changed files. It had silently committed them to git without being directed to
  do so. This is concerning.
- After I planned Epic 4, I was over 90% tokens, with reset coming in over 1.5
  hours. I decided to try planning Epic 5. At first, it couldn't find the
  `sprint-status.yaml` file, which was concerning, so I did `/bmad-help` and it
  told me that Epic 3 was only partially done (3-1 and 3-2 done, but the others
  not), which conflicted with the `sprint-status.yml` file. It's been making
  basic math errors and losing track of status, which is concerning, given that
  this is a computer and should be essentially perfect at calculations.
- BMAD seems to block me from planning Epic 5 until I finish implementing
  Epic 4. With humans, this makes sense, but I'm not sure whether it makes sense
  on an AI-built project. Would completing Epic 4 make a significant difference
  in the scope of work for Epic 5?
- Code reviews kept getting stuck. For example, it would churn for awhile, show
  some text, ending with "Proceeding to step-03-triage for findings
  consolidation," and then just stop, rather than showing a choice that allows
  me to hit Enter to continue to the findings consolidation, so I'd have to
  prompt it with "Can we proceed to step-03-triage?" and then it would keep
  going.
- During implementation of story 5-1, it chose to commit files to git, even
  though I twice previously had to remind it that I will perform all git
  operations.
- During story 5-1, it chose very old versions of Node.js in the `Dockerfile`
  and started the `docker-compose.yml` file with a `version` statement, which
  has been obsolete for years. It fixed these when I prodded it, but I feel like
  it should have known better.

### What would you clean up in the code if you were to ship this project?

### What would you do differently if you were to do this again?

- This time around, I minimized use of brainstorming and advanced elicitation
  features because I already had an idea that was well-developed and I wanted to
  keep it focused and simple.
- Another experiment could be to start with an existing code base and see how it
  handles adding features, fixing defects, etc.
- While working on this, I learned about a Karpathy `CLAUDE.md` that looks quite
  promising. I might use it for Epic 4 and Epic 5.

### What would you do the same if you were to do this again?

- I would definitely try to keep the amount of work being done in a single cycle
  of architecture, planning, and implementation as simple as possible. I
  understand that more complex projects probably require a lot more analysis
  work up front to define the MVP and align some follow-on work. Just like with
  human-driven processes, it takes a lot of time (and in this case, tokens) to
  do the planning stages. Just like with human-driven processes, it makes sense
  to defer the analysis and definition of anything not pertaining to MVP or a
  current effort (possibly covering multiple sprints) until it's time to
  implement that portion, because the risk of the work being invalidated or
  becoming irrelevant is moderate and it doesn't contribute to the immediate
  goal. Just like with human-driven processes, I think we want to do enough
  analysis and planning to avoid painting ourselves into a corner, but place our
  primary focus on the immediate goal and address the future in the future. I
  think I need to do a brownfield BMAD experiment to clarify my thoughts on
  this.

## Other Insights

### Understanding vs Production

One thing that I've observed in this exercise is that the process of writing
code brings with it a significant level of understanding of that code. When AI
generates code, the human(s) responsible for the code do not gain that benefit.
Instead, we must explicitly seek to understand the code that the AI wrote in
order to be able to intelligently discuss strategies to maintain it going
forward. Traditionally, we would only see the cost to gain this understanding as
a distinct activity when adding a new developer to an existing team. With
AI-assisted software development, _all_ developers are now always in the mode of
understanding the code that someone else wrote.

With this particular project, I'm moving quickly to understand what the
AI-assisted software development process can do—in particular as a force
multiplier—and therefore focusing on having the model do most of the work. While
I have observed closely enough to be able to flag a number of errors and
inconsistency, building a maintainable software project would require a far
greater level of comprehension. AI is an accelerator: I don't need to write
boilerplate code like getters and setters; I can leave the details of using a
new library to a model that knows the library better than I do. Working with
production code, I cannot get away without understanding the code in depth so
that I can address the benefits, shortcomings, the best strategies to enhance
it, and the drawbacks to certain approaches or features. The big advantage to
AI-assisted software development is that I can _understand_ code before I can
write that same code, even in languages or frameworks that are new to me, at
least to a degree. The disadvantage is that I must take the time to more fully
understand the code separate from generating it. Where that understanding came
for free as part of writing the code myself, it is no longer free. Fred Brooks
talked about this cost when bringing a new developer onto a project, but now it
applies to everyone all the time, and we must account for that in planning. AI
might make us 5–10x faster at generating the code, but a non-trivial portion of
that gain is consumed by building understanding of something we didnt' write
ourselves.

### Assembly Language to High Level Languages to Natural Language

One thing that I realized fairly early on in my explorations of AI, AI-assisted
software development, and BMAD, is that where we are today is much like where
the industry was in the 60's or 70's with the transition from assembly language
to high-level languages. But it's an even more dramatic change today. Moving
from assembly language to a high level language, there are details we no longer
need to know about. For a while, it was necessary and even useful to drop into
assembly language for some specific high-performance operations. However, today
with architecture-independent runtime environments like Java and JavaScript,
assembly language is more of an obstacle to portability than a benefit to
performance.

AI is a similar type of abstraction, but a much larger step. For now,
understanding the underlying code is essential, but eventually it may be
unnecessary. With the current pace of development, the day when the AI models
allow us to program computers exclusively in human language without having to
understand the underlying implementation is rapidly approaching.

### The Bar

The bar for quality production code has not changed. It is still challenging to
develop software products that are secure, stable, scalable, maintainable, and
all of the other qualities we associated with solid production code. What has
changed significantly is the bar for entry.

Consider the music industry. To build the skills with an instrument or voice to
be able to create truly excellent music takes years. One can argue that
contemporary styles may be less demanding of performers than more traditional
styles, and I don't entirely disagree. Playing a 4-chord groove with a band is
_far_ simpler than playing the third movement of Beethoven‘s _Moonlight Sonata_.
But that's secondary. 50 years ago, the cost to record an album was high, and
record companies only signed top talent to do so. Today, it's possible to
assemble a recording studio in your basement for under $1,000. The bar for
producing an audio recording is far lower than it was 50 years ago. Anyone can
do it today. But can anyone produce a great album in that $1,000 studio?
Certainly, a great song is a great song, even when recorded on very basic
equipment. But a great album contains several great songs, arranged and
performed with great skill, recorded with great equipment, and produced by
greatly skilled engineers. And _that_ is still a costly process, both in each of
those people mastering their craft and paying them to apply that skill to a
particular project.

Software development seems to be a lot like that. In some ways, AI will make
software development easier. In many ways, nothing changes when we need to
produce excellent software.

### Back to the Future
